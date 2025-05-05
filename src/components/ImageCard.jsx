// src/components/ImageCard.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

/**
 * ImageCard
 * Affiche une vignette cliquable avec animations, overlay et état sélectionné.
 *
 * Props:
 *   - image:      objet Unsplash ({ id, urls, alt_description, user })
 *   - onClick:    fonction(image) appelée au clic ou à l’appui sur Entrée/Espace
 *   - selected:   booléen, si true affiche un indicateur de sélection
 */
export default function ImageCard({ image, onClick, selected }) {
  const { urls, alt_description, user } = image

  // Gère le clic et la sélection clavier
  const handleActivate = () => {
    if (onClick) onClick(image)
  }

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-lg shadow-lg cursor-pointer
        transition-transform focus:outline-none focus:ring-2
        ${selected
          ? 'ring-4 ring-bleu-ciel dark:ring-violet-profond'
          : 'ring-0'
        }
      `}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={handleActivate}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleActivate()
        }
      }}
      tabIndex="0"
      aria-label={`Photo par ${user.name}: ${alt_description || 'Sans description'}`}
    >
      {/* Image principale */}
      <img
        src={urls.small}
        alt={alt_description || 'Image Unsplash'}
        loading="lazy"
        className="w-full h-48 object-cover"
      />

      {/* Overlay du nom du photographe */}
      <motion.div
        className="
          absolute inset-0 bg-black bg-opacity-25 opacity-0
          hover:opacity-100 flex items-end p-2 transition-opacity
        "
      >
        <p className="text-xs text-white truncate">
          {user.name}
        </p>
      </motion.div>

      {/* Icône de sélection (check) */}
      {selected && (
        <div
          className="
            absolute top-2 right-2
            bg-white bg-opacity-75 rounded-full p-1
          "
          aria-hidden="true"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-bleu-ciel dark:text-violet-profond"
          >
            <path
              d="M20 6L9 17L4 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </motion.div>
  )
}

ImageCard.propTypes = {
  image: PropTypes.shape({
    id: PropTypes.string.isRequired,
    urls: PropTypes.shape({
      small: PropTypes.string.isRequired
    }).isRequired,
    alt_description: PropTypes.string,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  onClick:  PropTypes.func,
  selected: PropTypes.bool
}

ImageCard.defaultProps = {
  onClick:  null,
  selected: false
}
