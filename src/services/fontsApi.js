// src/services/fontsApi.js

import axios from 'axios';

/**
 * fetchFonts
 * Récupère la liste des polices depuis l’API Google Fonts.
 *
 * @param {Object} [options]             Options de filtrage/tri.
 * @param {string} [options.category]    Filtre par catégorie. Exemples :
 *                                       "serif", "sans-serif", "display",
 *                                       "handwriting", "monospace".
 * @param {string} [options.sort]        Ordre de tri. Exemples :
 *                                       "alpha", "date", "popularity",
 *                                       "style", "trending".
 * @returns {Promise<Array>}             Tableau des objets police.
 * @throws {Error}                       En cas d’absence de clé ou d’erreur réseau/API.
 */
export async function fetchFonts({ category, sort } = {}) {
  // 1) Récupération de la clé depuis les env vars
  const apiKey = process.env.REACT_APP_GOOGLE_FONTS_KEY;
  if (!apiKey) {
    throw new Error('REACT_APP_GOOGLE_FONTS_KEY is not defined');
  }

  // 2) Construction des paramètres d’URL
  const params = new URLSearchParams({ key: apiKey });
  if (category) params.append('category', category);
  if (sort)     params.append('sort', sort);

  const url = `https://www.googleapis.com/webfonts/v1/webfonts?${params.toString()}`;

  try {
    // 3) Requête GET vers l’API
    const response = await axios.get(url);

    // 4) Validation de la forme attendue
    if (!response.data || !Array.isArray(response.data.items)) {
      throw new Error('Unexpected response format from Google Fonts API');
    }

    // 5) Renvoi du tableau "items"
    return response.data.items;
  } catch (err) {
    console.error('Error fetching Google Fonts:', err);
    throw err;
  }
}
