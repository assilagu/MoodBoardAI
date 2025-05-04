// src/api/search.js

const axios = require('axios')
const { Configuration, OpenAIApi } = require('openai')

// ─────────────────────────────────────────────────────────────────────────────
// Setup OpenAI & Unsplash clients
// ─────────────────────────────────────────────────────────────────────────────
const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
)

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
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { query = '', page = 1, per_page = 16 } = req.query
  if (!query.trim()) {
    return res.status(400).json({ error: 'Missing "query" parameter.' })
  }

  try {
    // 1) Reformuler & enrichir la requête avec GPT-4
    const chat = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert at crafting image search queries for Unsplash. Rewrite the user’s search term to maximize relevance and clarity.'
        },
        { role: 'user', content: `Search term: "${query}"` }
      ],
      temperature: 0.7,
      max_tokens: 32
    })
    const refinedQuery = chat.data.choices[0].message.content.trim()

    // 2) Récupérer les images depuis Unsplash (order_by=relevant)
    const usRes = await unsplash.get('/search/photos', {
      params: {
        query:     refinedQuery,
        page,
        per_page,
        order_by: 'relevant'
      }
    })
    const images = usRes.data.results
    if (images.length === 0) {
      return res.status(200).json({ results: [], refinedQuery })
    }

    // 3) Embedding CLIP pour la requête une seule fois
    const embedPrompt = await openai.createEmbedding({
      model: 'clip',
      input: refinedQuery
    })
    const promptVec = embedPrompt.data.data[0].embedding

    // 4) Embedding CLIP groupé pour les descriptions
    const texts = images.map(img =>
      img.alt_description ||
      img.description ||
      img.user.username ||
      ''
    )
    const embedImgs = await openai.createEmbedding({
      model: 'clip',
      input: texts
    })

    // 5) Calculer la similarité et construire le tableau annoté
    const scored = images.map((img, idx) => {
      const imgVec = embedImgs.data.data[idx].embedding
      const relevance = cosine(promptVec, imgVec)
      return { ...img, relevance }
    })

    // 6) Filtrer & trier puis limiter à `per_page`
    const filtered = scored
      .filter(img => img.relevance >= 0.25)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, per_page)

    // 7) Renvoyer
    return res.status(200).json({ results: filtered, refinedQuery })
  } catch (err) {
    console.error('🔍 /api/search error:', err)
    return res.status(500).json({ error: 'Internal error during search.' })
  }
}
