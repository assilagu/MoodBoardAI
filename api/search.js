// src/api/search.js

const axios = require('axios')
const { Configuration, OpenAIApi } = require('openai')

// ── Initialisation OpenAI & Unsplash ─────────────────────────────────────────
const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
)

const unsplash = axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: { Authorization: `Client-ID ${process.env.UNSPLASH_KEY}` },
  timeout: 10000
})

// ── Cosine similarity ─────────────────────────────────────────────────────────
function cosine(a, b) {
  let dot = 0, magA = 0, magB = 0
  for (let i = 0; i < a.length; i++) {
    dot  += a[i] * b[i]
    magA += a[i] * a[i]
    magB += b[i] * b[i]
  }
  return (magA && magB) ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0
}

// ── Handler ───────────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { query = '', page = 1, per_page = 16 } = req.query
  console.log('🔍 /api/search called with:', { query, page, per_page })
  console.log('🔑 env OPENAI_API_KEY present?', !!process.env.OPENAI_API_KEY)
  console.log('🔑 env UNSPLASH_KEY present?', !!process.env.UNSPLASH_KEY)

  if (!query.trim()) {
    return res.status(400).json({ error: 'Missing "query" parameter.' })
  }

  try {
    // 1) Reformulation GPT-4
    console.log('1️⃣ Reformulating query via OpenAI...')
    const chat = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert at crafting image search queries for Unsplash.' },
        { role: 'user',   content: `Rewrite for Unsplash search: "${query}"` }
      ],
      temperature: 0.7,
      max_tokens: 32
    })
    const refinedQuery = chat.data.choices[0].message.content.trim()
    console.log('👉 refinedQuery =', refinedQuery)

    // 2) Appel Unsplash
    console.log('2️⃣ Fetching Unsplash with refinedQuery...')
    const usRes = await unsplash.get('/search/photos', {
      params: { query: refinedQuery, page, per_page, order_by: 'relevant' }
    })
    const images = usRes.data.results
    console.log(`   → Unsplash returned ${images.length} images`)

    if (images.length === 0) {
      return res.status(200).json({ results: [], refinedQuery })
    }

    // 3) Création embedding CLIP pour la requête
    console.log('3️⃣ Creating CLIP embedding for refinedQuery...')
    const embedPrompt = await openai.createEmbedding({
      model: 'clip',
      input: refinedQuery
    })
    const promptVec = embedPrompt.data.data[0].embedding

    // 4) Embedding groupé pour descriptions
    console.log('4️⃣ Creating CLIP embeddings for image descriptions...')
    const texts = images.map(img =>
      img.alt_description || img.description || img.user.username || ''
    )
    const embedImgs = await openai.createEmbedding({
      model: 'clip',
      input: texts
    })

    // 5) Calcul des similarités
    console.log('5️⃣ Scoring images by cosine similarity...')
    const scored = images.map((img, idx) => {
      const imgVec = embedImgs.data.data[idx].embedding
      const relevance = cosine(promptVec, imgVec)
      return { ...img, relevance }
    })
    console.log('   → Sample relevances:', scored.slice(0,3).map(i=> i.relevance.toFixed(2)))

    // 6) Filtrer/ Trier / Limiter
    const filtered = scored
      .filter(img => img.relevance >= 0.25)
      .sort((a,b) => b.relevance - a.relevance)
      .slice(0, per_page)
    console.log(`   → Returning ${filtered.length} images after filtering`)

    // 7) Réponse
    return res.status(200).json({ results: filtered, refinedQuery })

  } catch (err) {
    // Log complet de l’erreur
    console.error('🔍 /api/search error message:', err.message)
    if (err.response) {
      console.error('🔍 err.response.status:', err.response.status)
      console.error('🔍 err.response.data:', err.response.data)
    }
    // Renvoi d’un détail minimal pour debug front
    return res.status(500).json({
      error: 'Internal search error',
      details: err.response ? err.response.data : err.message
    })
  }
}
