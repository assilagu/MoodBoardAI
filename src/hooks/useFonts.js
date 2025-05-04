// src/hooks/useFonts.js

import useSWR from 'swr'
import { fetchFonts } from '../services/fontsApi'

/**
 * useFonts
 * Hook pour charger et mettre en cache la liste des polices Google Fonts.
 *
 * @param {string} [category] Filtre par catégorie (“serif”, “sans-serif”, “display”, “handwriting”, “monospace”)
 * @param {string} [sort]     Tri (“alpha”, “date”, “popularity”, “style”, “trending”)
 * @returns {{
 *   fonts: Array,     // tableau des polices
 *   isLoading: boolean,  // true tant que la requête n'est pas terminée
 *   error: any        // erreur levée par fetchFonts ou SWR
 * }}
 */
export default function useFonts(category = '', sort = '') {
  // 1) Clef de cache SWR unique par combinaison [“fonts”, category, sort]
  const cacheKey = ['fonts', category, sort]

  // 2) Lancement de la requête via SWR
  //    On ne récupère que data et error : pas de variable inutilisée
  const { data, error } = useSWR(
    cacheKey,
    () => fetchFonts({ category, sort }),
    {
      revalidateOnFocus: false, // ne pas recharger au focus
    }
  )

  return {
    // 3) Résultat : soit les polices, soit un tableau vide
    fonts: data || [],
    // 4) isLoading : true tant qu’il n’y a ni données ni erreur
    isLoading: !error && !data,
    // 5) On remonte l’éventuelle erreur
    error,
  }
}
