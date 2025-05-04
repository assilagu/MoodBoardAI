import axios from 'axios'
import { filterSimilarColors, rebalanceVibrance } from '../utils/colorUtils'

const baseURL = process.env.REACT_APP_API_BASE_URL || '/api'
const apiClient = axios.create({ baseURL, timeout: 10000 })

/**
 * searchPhotos
 * @param {string} query 
 * @param {number} page 
 * @param {number} perPage 
 * @returns {Promise<Array>}
 */
export async function searchPhotos(query, page = 1, perPage = 16) {
  const { data } = await apiClient.get('/searchPhotos', {
    params: { query, page, per_page: perPage, order_by: 'latest' }
  })
  return data.results
}

/**
 * getPalette
 * Génère une palette à partir d’un hex.
 * @param {string} hex    (sans #)
 * @param {string} mode   Type de schéma (ex. analogic)
 * @param {number} count  Nombre de couleurs
 * @returns {Promise<Array>}
 */
export async function getPalette(hex, mode = 'analogic', count = 4) {
  const cleanHex = hex.replace(/^#/, '')
  const { data } = await apiClient.get('/getPalette', {
    params: { hex: cleanHex, mode, count }
  })
  // 1) filtre similitudes, 2) rééquilibre vibrance
  const unique = filterSimilarColors(data.colors, 0.1, count)
  return rebalanceVibrance(unique)
}

/**
 * getPaletteFromImage
 * Extrait une palette depuis l’URL d’une image
 * @param {string} url 
 * @param {number} count 
 * @returns {Promise<Array>}
 */
export async function getPaletteFromImage(url, count = 4) {
  const { data } = await apiClient.get('/getPalette', {
    params: { url, count }
  })
  const unique = filterSimilarColors(data.colors, 0.1, count)
  return rebalanceVibrance(unique)
}
