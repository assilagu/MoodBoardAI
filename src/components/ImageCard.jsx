// src/components/ImageCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Affiche une image Unsplash avec animation et overlay au hover
 * Props:
 *   - image: objet retourné par l'API Unsplash
 */
export default function ImageCard({ image, onClick }) {
  const { urls, alt_description, user } = image;

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onClick && onClick(image)}
      tabIndex="0"
      aria-label={`Photo par ${user.name}: ${alt_description || 'Sans description'}`}
    >
      <img
        src={urls.small}
        alt={alt_description || 'Image Unsplash'}
        loading="lazy"
        className="w-full h-48 object-cover"
      />
      <motion.div
        className="absolute inset-0 bg-black bg-opacity-25 opacity-0 hover:opacity-100
                   flex items-end p-2 transition-opacity"
      >
        <p className="text-xs text-white truncate">
          {user.name}
        </p>
      </motion.div>
    </motion.div>
  );
}
