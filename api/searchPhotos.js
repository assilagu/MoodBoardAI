// api/searchPhotos.js

const axios = require('axios');

module.exports = async function handler(req, res) {
  // ─── CORS ────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ─── Lecture des params ───────────────────────────────────
  const {
    query = '',
    page = 1,
    per_page = 12,
    order_by = 'latest'      // <- nouvelle valeur par défaut
  } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing "query" parameter.' });
  }

  // ─── Appel Unsplash ───────────────────────────────────────
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_KEY}`
      },
      params: {
        query,
        page,
        per_page,
        order_by       // <- on transmet bien ce paramètre
      }
    });
    return res.status(200).json({ results: response.data.results });
  } catch (err) {
    console.error('Unsplash fetch error:', err.message || err);
    return res.status(502).json({ error: 'Unable to fetch from Unsplash.' });
  }
};
