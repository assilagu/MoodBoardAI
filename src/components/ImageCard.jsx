// src/components/ImageCard.jsx
import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'  // icône checkmark

/**
 * Affiche une image Unsplash avec animation, overlay au hover,
 * et état sélectionné.
 *
 * Props:
 *   - image:      objet retourné par l'API Unsplash
 *   - onClick:    fonction(image) appelée au clic
 *   - selected:   boolean, true si l'image est sélectionnée
 */
export default function ImageCard({ image, onClick, selected = false }) {
  const { urls, alt_description, user } = image

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-lg shadow-lg cursor-pointer
        focus:outline-none focus:ring-2 transition
        ${selected
          ? 'ring-4 ring-bleu-ciel dark:ring-violet-profond'
          : 'ring-0'
        }
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onClick && onClick(image)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick && onClick(image)
        }
      }}
      tabIndex="0"
      aria-label={`Photo par ${user.name}: ${alt_description || 'Sans description'}`}
    >
      <img
        src={urls.small}
        alt={alt_description || 'Image Unsplash'}
        loading="lazy"
        className="w-full h-48 object-cover"
      />

      {/* Overlay du nom du photographe */}
      <motion.div
        className="absolute inset-0 bg-black bg-opacity-25 opacity-0 hover:opacity-100
                   flex items-end p-2 transition-opacity"
      >
        <p className="text-xs text-white truncate">
          {user.name}
        </p>
      </motion.div>

      {/* Checkmark quand sélectionnée */}
      {selected && (
        <div
          className="absolute top-2 right-2 bg-white bg-opacity-75 rounded-full p-1"
          aria-hidden="true"
        >
          <Check size={16} className="text-bleu-ciel dark:text-violet-profond" />
        </div>
      )}
    </motion.div>
  )
}
