// src/api/search.js

const axios = require('axios')
const { OpenAI } = require('openai')

// ─────────────────────────────────────────────────────────────────────────────
// Clients OpenAI & Unsplash
// ─────────────────────────────────────────────────────────────────────────────
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})
const unsplash = axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: { Authorization: `Client-ID ${process.env.UNSPLASH_KEY}` },
  timeout: 10000
})

// ─────────────────────────────────────────────────────────────────────────────
// Similarité cosinus entre deux vecteurs
// ─────────────────────────────────────────────────────────────────────────────
function cosine(a, b) {
  let dot = 0, magA = 0, magB = 0
  for (let i = 0; i < a.length; i++) {
    dot  += a[i] * b[i]
    magA += a[i] * a[i]
    magB += b[i] * b[i]
  }
  return magA && magB ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0
}

// ─────────────────────────────────────────────────────────────────────────────
// Route /api/search
// ─────────────────────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { query = '', page = 1, per_page = 16 } = req.query
  if (!query.trim()) {
    return res.status(400).json({ error: 'Missing "query" parameter.' })
  }

  let refinedQuery = query

  // 1) Tentative de reformulation OpenAI
  try {
    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content:
          'You are an expert at crafting image search queries for Unsplash. ' +
          'Rewrite the user’s search term to maximize relevance and clarity.' },
        { role: 'user', content: `Search term: "${query}"` }
      ],
      temperature: 0.7,
      max_tokens: 32
    })
    refinedQuery = chat.choices[0].message.content.trim() || query
  } catch (err) {
    console.warn('⚠️ OpenAI reformulation failed, falling back to raw query:', err.code || err.message)
  }

  // 2) Recherche Unsplash
  let images = []
  try {
    const usRes = await unsplash.get('/search/photos', {
      params: {
        query:     refinedQuery,
        page,
        per_page,
        order_by: 'relevant'
      }
    })
    images = usRes.data.results || []
  } catch (err) {
    console.error('❌ Unsplash fetch failed:', err.message || err)
    return res.status(502).json({ error: 'Unsplash fetch failed.' })
  }

  // Si aucune image, on renvoie vite fait
  if (images.length === 0) {
    return res.status(200).json({ results: [], refinedQuery })
  }

  // 3) Tentative de scoring par CLIP (groupé)
  try {
    // 3a) Embedding de la requête
    const embedQ = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: refinedQuery
    })
    const promptVec = embedQ.data[0].embedding

    // 3b) Embedding groupé des descriptions
    const texts = images.map(img =>
      img.alt_description ||
      img.description ||
      img.user.username ||
      ''
    )
    const embedImgs = await openai.embeddings.create({
      model: 'clip',
      input: texts
    })

    // 4) Calcul similarité et annotation
    const scored = images.map((img, idx) => {
      const imgVec    = embedImgs.data[idx].embedding
      const relevance = cosine(promptVec, imgVec)
      return { ...img, relevance }
    })

    // 5) Filtre, tri, top-N
    images = scored
      .filter(img => img.relevance >= 0.25)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, per_page)

  } catch (err) {
    console.warn('⚠️ CLIP scoring failed, returning raw Unsplash results:', err.code || err.message)
    // On laisse `images` tel quel
  }

  // 6) On renvoie
  return res.status(200).json({ results: images, refinedQuery })
}
