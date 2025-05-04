// src/hooks/useImages.js
import { useState, useEffect, useCallback } from 'react'

/**
 * useImages
 * Hook pour rechercher et accumuler les images via votre micro‐service “/api/search”.
 * – remplace la page 1, concatène sinon
 *
 * @param {string} q       Mot-clé de recherche
 * @param {number} page    Numéro de page (1-indexé)
 * @param {number} perPage Images par page
 *
 * @returns {{
 *   images: Array,
 *   loading: boolean,
 *   error: any,
 *   refetch: () => void
 * }}
 */
export default function useImages(q, page = 1, perPage = 16) {
  const [images, setImages]   = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  // fetcher : remplace sur page 1, concatène sinon
  const fetcher = useCallback(
    async (query, pg) => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(
          `/api/search?query=${encodeURIComponent(query)}&page=${pg}&per_page=${perPage}`
        )
        if (!res.ok) {
          throw new Error(`Search API error: ${res.statusText}`)
        }
        const { results } = await res.json()
        // page 1 => reset, sinon append
        setImages(prev => (pg === 1 ? results : [...prev, ...results]))
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    },
    [perPage]
  )

  // relance quand q ou page change
  useEffect(() => {
    if (q) {
      fetcher(q, page)
    } else {
      setImages([])
    }
  }, [q, page, fetcher])

  // retry/callback
  const refetch = useCallback(() => {
    if (q) fetcher(q, page)
  }, [q, page, fetcher])

  return { images, loading, error, refetch }
}
