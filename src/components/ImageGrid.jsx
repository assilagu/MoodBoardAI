// src/components/ImageGrid.jsx
import React from 'react'
import PropTypes from 'prop-types'
import ImageCard from './ImageCard'

/**
 * ImageGrid
 * Affiche une grille de cartes-images sélectionnables.
 *
 * Props:
 *   - images:          Array d'objets image (issu de useImages)
 *   - selectedImages:  Array d'images actuellement sélectionnées
 *   - toggleSelection: Fonction(image) pour ajouter/retirer la sélection
 *   - columns:         Override des classes de colonnes Tailwind (optionnel)
 */
export default function ImageGrid({
  images,
  selectedImages,
  toggleSelection,
  columns
}) {
  const baseCols = columns || 
    'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  return (
    <div className={`grid ${baseCols} gap-4 py-4 px-2`}>
      {images.map(img => {
        const isSelected = selectedImages.some(si => si.id === img.id)
        return (
          <ImageCard
            key={img.id}
            image={img}
            onClick={toggleSelection}
            selected={isSelected}
          />
        )
      })}
    </div>
  )
}

ImageGrid.propTypes = {
  images:          PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedImages:  PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleSelection: PropTypes.func.isRequired,
  columns:         PropTypes.string
}

ImageGrid.defaultProps = {
  columns: ''
}
