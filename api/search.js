// src/api/search.js

const axios = require('axios')
const { OpenAI } = require('openai')

// ─────────────────────────────────────────────────────────────────────────────
// Setup OpenAI & Unsplash clients
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
// Helper: cosine similarity between two vectors
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
// API Route Handler
// ─────────────────────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { query = '', page = 1, per_page = 16 } = req.query
  if (!query.trim()) {
    return res.status(400).json({ error: 'Missing "query" parameter.' })
  }

  try {
    // 1) Reformulation via GPT-3.5-turbo
    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert at crafting image search queries for Unsplash. ' +
            'Rewrite the user’s search term to maximize relevance and clarity.'
        },
        { role: 'user', content: `Search term: "${query}"` }
      ],
      temperature: 0.7,
      max_tokens: 32
    })
    const refinedQuery = chat.choices[0].message.content.trim()

    // 2) Appel à Unsplash avec la requête enrichie
    const usRes = await unsplash.get('/search/photos', {
      params: {
        query:     refinedQuery,
        page,
        per_page,
        order_by: 'relevant'
      }
    })
    const images = usRes.data.results
    if (!images.length) {
      return res.status(200).json({ results: [], refinedQuery })
    }

    // 3) Embedding ADA pour la requête (une seule fois)
    const embedQ = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: refinedQuery
    })
    const promptVec = embedQ.data[0].embedding

    // 4) Embedding CLIP groupé des descriptions d’images
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

    // 5) Calcul de similarité et annotation
    const scored = images.map((img, idx) => {
      const imgVec    = embedImgs.data[idx].embedding
      const relevance = cosine(promptVec, imgVec)
      return { ...img, relevance }
    })

    // 6) Filtrage, tri et top-N
    const filtered = scored
      .filter(img => img.relevance >= 0.25)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, per_page)

    // 7) Renvoi des résultats
    return res.status(200).json({ results: filtered, refinedQuery })

  } catch (err) {
    console.error('🔍 /api/search error:', err)
    return res.status(500).json({ error: 'Internal error during search.' })
  }
}
