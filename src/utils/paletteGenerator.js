// src/utils/paletteGenerator.js

import {
  filterSimilarColors,
  rebalanceVibrance,
  hslToRgb,
  rgbToHex
} from './colorUtils'
import { getPalette, getPaletteFromImage } from '../services/api'

/**
 * 1) Transforme une chaîne en une teinte HSL normalisée [0,1)
 */
export function keywordToHue(keyword) {
  let hash = 0
  for (let i = 0; i < keyword.length; i++) {
    hash = (hash * 31 + keyword.charCodeAt(i)) & 0xffffffff
  }
  return (hash % 360) / 360
}

/**
 * 2) Génère `count` couleurs thématiques analogiques basées sur le mot-clé
 */
export async function generateThemePalette(keyword, count = 8) {
  const h = keywordToHue(keyword)
  const { r, g, b } = hslToRgb({ h, s: 0.5, l: 0.5 })
  const seedHex = rgbToHex({ r, g, b })
  const cols = await getPalette(seedHex, 'analogic', count)
  const unique = filterSimilarColors(cols, 0.1, count)
  return rebalanceVibrance(unique).slice(0, count)
}

/**
 * 3) Extrait `count` couleurs dominantes depuis un tableau d’URLs d’images
 */
export async function extractImagePalette(imageUrls, count = 4) {
  const batches = await Promise.all(
    imageUrls.map(url => getPaletteFromImage(url, count))
  )
  const flat = batches.flat()
  const uniq = filterSimilarColors(flat, 0.1, count)
  return rebalanceVibrance(uniq).slice(0, count)
}

/**
 * 4) Fusionne deux listes de couleurs, filtre/rééquilibre et renvoie `total` éléments
 */
export function mergeFilterAndSort(themeCols, imageCols, total = 8) {
  const pool = [...themeCols, ...imageCols]
  const uniq = filterSimilarColors(pool, 0.1, total)
  return rebalanceVibrance(uniq).slice(0, total)
}

/**
 * 5) Génère une palette mixte selon un ratio `bias` [0..1] pour le mot-clé
 *    (ex : bias=0.7 → 70% de couleurs thématiques, 30% d’images)
 */
export async function generateMixedPalette(
  keyword,
  imageUrls,
  total = 8,
  bias = 0.9
) {
  const themeCount = Math.round(total * bias)
  const imageCount = total - themeCount

  // 1) Couleurs thématiques
  const themeCols = await generateThemePalette(keyword, themeCount)

  // 2) Couleurs issues des images (si besoin)
  let imageCols = []
  if (imageCount > 0 && imageUrls.length > 0) {
    imageCols = await extractImagePalette(imageUrls, imageCount)
  }

  // 3) On fusionne et on recadre à `total`
  return mergeFilterAndSort(themeCols, imageCols, total)
}
