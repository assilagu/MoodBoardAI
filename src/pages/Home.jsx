// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

import SearchBar             from '../components/SearchBar'
import useImages             from '../hooks/useImages'
import ImageCard             from '../components/ImageCard'
import LoadingSpinner        from '../components/LoadingSpinner'
import ErrorMessage          from '../components/ErrorMessage'
import NoResults             from '../components/NoResults'
import MoodboardPdf          from '../components/MoodboardPdf'
import EditableColorPalette  from '../components/EditableColorPalette'
import useFonts              from '../hooks/useFonts'
import FontSelector          from '../components/FontSelector'
import TypographyDisplay     from '../components/TypographyDisplay'
import ExportButton          from '../components/ExportButton'
import SelectionCounter      from '../components/SelectionCounter'

import { generateMixedPalette } from '../utils/paletteGenerator'
import { container, fadeInUp }  from '../utils/animations'

export default function Home() {
  const [keyword, setKeyword]                  = useState('')
  const [page, setPage]                        = useState(1)
  const [editablePalette, setEditablePalette]  = useState([])
  const [selectedFont, setSelectedFont]        = useState('')
  // ── Nouvel état pour la sélection des images
  const [selectedImages, setSelectedImages]    = useState([])

  const { images, loading, error, refetch }     = useImages(keyword, page, 16)
  const { fonts, isLoading: fontsLoading, error: fontsError } = useFonts()
  const pdfRef = useRef(null)

  // 70% thème / 30% images mix + initialisation editablePalette
  useEffect(() => {
    if (!keyword || images.length === 0) {
      setEditablePalette([])
      return
    }
    async function build() {
      try {
        const sample = images.slice(0, 12).map(i => i.urls.regular)
        const cols = await generateMixedPalette(keyword, sample, 8, 0.7)
        setEditablePalette(cols)
      } catch {
        const fallback = await generateMixedPalette(keyword, [], 8, 1)
        setEditablePalette(fallback)
      }
    }
    build()
  }, [keyword, images])

  const handleSearch = kw => {
    setKeyword(kw)
    setPage(1)
    setEditablePalette([])
    setSelectedImages([])        // reset sélection à chaque nouvelle recherche
  }
  const suggestions = ['cyberpunk', 'cosy winter', 'coffee workspace', 'minimal']

  const handleChangeColor = (index, hex) => {
    const copy = [...editablePalette]
    copy[index] = { ...copy[index], hex: { value: hex } }
    setEditablePalette(copy)
  }

  // ── Fonction utilitaire pour basculer la sélection d'une image
  function toggleImageSelection(img) {
    setSelectedImages(prev => {
      const exists = prev.find(i => i.id === img.id)
      if (exists) return prev.filter(i => i.id !== img.id)
      return [...prev, img]
    })
  }

  // ── Booléen qui indique si le minimum de 9 images est atteint
  const canExport = selectedImages.length >= 9

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="
        min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_3fr]
        bg-gradient-to-br from-cream to-lavande-pale
        dark:from-noir-veloute dark:to-gris-anthracite
      "
    >
      {/* Off-screen PDF */}
      <div
        ref={pdfRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 1024,
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1
        }}
      >
        <MoodboardPdf
          keyword={keyword}
          selectedFont={selectedFont}
          palette={editablePalette}
          images={selectedImages.length > 0 ? selectedImages : images}
        />
      </div>

      {/* Sidebar (desktop) */}
      <aside className="hidden lg:block sticky top-0 p-6 space-y-6 bg-white dark:bg-gray-900 shadow-lg">
        <SearchBar onSearch={handleSearch} />

        <div className="flex flex-wrap gap-2">
          {suggestions.map(tag => (
            <button
              key={tag}
              onClick={() => handleSearch(tag)}
              className="px-3 py-1 bg-bleu-ciel dark:bg-violet-profond text-sm rounded-full hover:bg-menthe-pastel dark:hover:bg-rose-fume transition"
              aria-label={`Suggestion ${tag}`}
            >
              {tag}
            </button>
          ))}
        </div>

        <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow" open>
          <summary className="cursor-pointer font-semibold text-gray-800 dark:text-gray-100">
            Typographie
          </summary>
          <motion.div variants={fadeInUp} className="mt-4 space-y-4">
            {!fontsLoading && !fontsError ? (
              <>
                <FontSelector fonts={fonts} onSelect={setSelectedFont} />
                <TypographyDisplay family={selectedFont} />
              </>
            ) : fontsLoading ? (
              <p>Chargement des polices…</p>
            ) : (
              <p>Erreur chargement polices.</p>
            )}
          </motion.div>
        </details>

        <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow" open>
          <summary className="cursor-pointer font-semibold text-gray-800 dark:text-gray-100">
            Palette de couleurs
          </summary>
          <motion.div variants={fadeInUp} className="mt-4">
            {!loading && !error && editablePalette.length === 8 ? (
              <EditableColorPalette
                colors={editablePalette}
                onChangeColor={handleChangeColor}
                title=""
              />
            ) : (
              <p className="text-sm text-gray-500">Génération en cours…</p>
            )}
          </motion.div>
        </details>

        <ExportButton
          targetRef={pdfRef}
          filename={`moodboard-${keyword || 'export'}.pdf`}
          disabled={!canExport}
        />
      </aside>

      {/* Main (mobile accordions + grid) */}
      <main className="p-6 space-y-8">
        <div className="space-y-6 lg:hidden">
          <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
            <summary className="cursor-pointer font-semibold text-gray-800 dark:text-gray-100">
              Typographie
            </summary>
            <motion.div variants={fadeInUp} className="mt-4 space-y-4">
              {!fontsLoading && !fontsError ? (
                <>
                  <FontSelector fonts={fonts} onSelect={setSelectedFont} />
                  <TypographyDisplay family={selectedFont} />
                </>
              ) : fontsLoading ? (
                <p>Chargement des polices…</p>
              ) : (
                <p>Erreur chargement polices.</p>
              )}
            </motion.div>
          </details>

          <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow" open>
            <summary className="cursor-pointer font-semibold text-gray-800 dark:text-gray-100">
              Palette de couleurs
            </summary>
            <motion.div variants={fadeInUp} className="mt-4">
              {!loading && !error && editablePalette.length === 8 ? (
                <EditableColorPalette
                  colors={editablePalette}
                  onChangeColor={handleChangeColor}
                  title=""
                />
              ) : (
                <p className="text-sm text-gray-500">Génération en cours…</p>
              )}
            </motion.div>
          </details>

          <ExportButton
            targetRef={pdfRef}
            filename={`moodboard-${keyword || 'export'}.pdf`}
            disabled={!canExport}
          />
        </div>

        {keyword && (
          <motion.p variants={fadeInUp} className="text-lg text-gray-700 dark:text-gris-brumeux">
            Résultats pour : <span className="font-medium">{keyword}</span>
          </motion.p>
        )}

        {loading && page === 1 && <LoadingSpinner />}
        {error && <ErrorMessage onRetry={refetch} />}
        {!loading && !error && keyword && images.length === 0 && <NoResults keyword={keyword} />}

        {/* Sélection counter */}
        <SelectionCounter count={selectedImages.length} min={9} max={20} />

        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {images.map(img => {
            const isSelected = selectedImages.some(i => i.id === img.id)
            return (
              <motion.div key={img.id} whileHover={{ scale: 1.02 }}>
                <ImageCard
                  image={img}
                  onClick={() => toggleImageSelection(img)}
                  selected={isSelected}
                />
              </motion.div>
            )
          })}
        </motion.div>

        {images.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={loading}
              className="px-6 py-2 bg-bleu-ciel rounded hover:bg-menthe-pastel transition focus:outline-none focus:ring-2 focus:ring-bleu-ciel"
              aria-label="Charger plus d’images"
            >
              {loading ? 'Chargement…' : 'Charger plus'}
            </button>
          </div>
        )}
      </main>
    </motion.div>
  )
}
