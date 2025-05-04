// api/getPalette.js

const axios = require('axios')
const {
  hexToRgb, rgbToHsl,
  filterSimilarColors, rebalanceVibrance
} = require('../src/utils/colorUtils')

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { url, hex, mode = 'analogic', count = 8 } = req.query
  if (!url && !hex) {
    return res.status(400).json({ error: 'Missing "url" or "hex" parameter.' })
  }

  try {
    let rawColors
    if (hex) {
      // Schéma basé sur la couleur du mot-clé
      const rsp = await axios.get('https://www.thecolorapi.com/scheme', {
        params: { hex, mode, count }
      })
      rawColors = rsp.data.colors
    } else {
      // Extraction depuis l’image
      const rsp = await axios.get('https://www.thecolorapi.com/image', {
        params: { url, count }
      })
      rawColors = rsp.data.colors
    }

    // 1) Filtre HSL pour garder au moins `count`
    let palette = filterSimilarColors(rawColors, 0.1, Number(count))
    // 2) Rééquilibre la vibrance
    palette = rebalanceVibrance(palette)

    // 3) Si on manque de cases, on complète depuis rawColors
    if (palette.length < count) {
      const needed = Number(count) - palette.length
      const rest = rawColors.filter(
        c => !palette.find(u => u.hex.value === c.hex.value)
      )
      palette = palette.concat(rest.slice(0, needed))
    }

    // 4) Renvoi
    return res.status(200).json({ colors: palette.slice(0, Number(count)) })
  } catch (err) {
    console.error('Color API error:', err.message || err)
    return res.status(502).json({ error: 'Unable to fetch color scheme.' })
  }
}
