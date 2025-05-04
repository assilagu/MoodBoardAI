// src/components/ImageGrid.jsx
import React from 'react';
import PropTypes from 'prop-types';
import ImageCard from './ImageCard';

/**
 * ImageGrid
 * Props:
 *   - images: array d'objets image (issu de useImages)
 *   - onImageClick?: callback quand on clique sur une carte
 *   - columns?: override des breakpoints (facultatif)
 */
export default function ImageGrid({ images, onImageClick, columns }) {
  // Définit par défaut 1→2→3→4 colonnes selon la taille d'écran
  const baseCols = columns || 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  return (
    <div className={`${baseCols} gap-4 py-4 px-2`}>
      {images.map(img => (
        <ImageCard
          key={img.id}
          image={img}
          onClick={onImageClick}
        />
      ))}
    </div>
  );
}

ImageGrid.propTypes = {
  images: PropTypes.array.isRequired,
  onImageClick: PropTypes.func,
  columns: PropTypes.string,
};
