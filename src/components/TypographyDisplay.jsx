// src/components/TypographyDisplay.jsx
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { collapse } from '../utils/animations'

/**
 * TypographyDisplay
 * Affiche un texte d’exemple dans la police sélectionnée
 * et permet de régler taille, poids et style.
 */
export default function TypographyDisplay({
  family,
  weights    = [400, 700],
  styles     = ['normal', 'italic'],
  sampleText = 'The quick brown fox jumps over the lazy dog.'
}) {
  const [weight, setWeight] = useState(weights[0])
  const [style, setStyle]   = useState(styles[0])
  const [size, setSize]     = useState(24)

  // Injecte Google Fonts link
  useEffect(() => {
    if (!family) return
    const id = `gf-${family.replace(/\s+/g, '-')}`
    if (!document.getElementById(id)) {
      const link = document.createElement('link')
      link.id = id
      link.rel = 'stylesheet'
      const wgh = weights.join(';')
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
        family
      )}:wght@${wgh}&display=swap`
      document.head.appendChild(link)
    }
  }, [family, weights])

  if (!family) return null

  return (
    <div className="space-y-4">
      {/* Contrôles */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm">Taille (px)</label>
          <input
            type="range"
            min="12"
            max="72"
            value={size}
            onChange={e => setSize(Number(e.target.value))}
            className="focus:outline-none"
            aria-label="Taille du texte"
          />
          <span className="ml-2">{size}px</span>
        </div>

        <div>
          <label className="block text-sm">Poids</label>
          <select
            value={weight}
            onChange={e => setWeight(Number(e.target.value))}
            className="p-1 border rounded focus:outline-none focus:ring"
            aria-label="Poids de la police"
          >
            {weights.map(w => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm">Style</label>
          <select
            value={style}
            onChange={e => setStyle(e.target.value)}
            className="p-1 border rounded focus:outline-none focus:ring"
            aria-label="Style de la police"
          >
            {styles.map(st => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Aperçu animé */}
      <AnimatePresence initial={false}>
        <motion.div
          key={family + weight + style + size}
          variants={collapse}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="p-4 border rounded bg-gray-50 dark:bg-gray-800"
        >
          <p
            style={{
              fontFamily: `'${family}', sans-serif`,
              fontWeight:  weight,
              fontStyle:   style,
              fontSize:    `${size}px`,
              lineHeight:  1.4
            }}
          >
            {sampleText}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

TypographyDisplay.propTypes = {
  family:     PropTypes.string.isRequired,
  weights:    PropTypes.arrayOf(PropTypes.number),
  styles:     PropTypes.arrayOf(PropTypes.string),
  sampleText: PropTypes.string
}
