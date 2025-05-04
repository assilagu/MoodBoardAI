// src/components/EditableColorPalette.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { fadeInUp } from '../utils/animations'

/**
 * EditableColorPalette
 * • 8 cases en 2×4, chacune avec un color-picker intégré
 * • Permet de modifier chaque couleur et de propager via onChangeColor
 */
export default function EditableColorPalette({
  colors,
  onChangeColor,
  title
}) {
  const MAX = 8
  const display = [...colors]
  while (display.length < MAX) {
    display.push({ hex: { value: '#EEE' }, name: { value: '' } })
  }

  return (
    <div className="relative w-full">
      {title && (
        <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
          {title}
        </h4>
      )}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-4 gap-4"
      >
        {display.map((c, i) => {
          const hex = c.hex.value
          return (
            <label
              key={i}
              className="flex flex-col items-center cursor-pointer"
            >
              <input
                type="color"
                value={hex}
                onChange={e => onChangeColor(i, e.target.value)}
                className="absolute w-0 h-0 opacity-0"
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-700"
                style={{ backgroundColor: hex }}
                aria-label={`Modifier couleur ${hex}`}
              />
              <span className="mt-2 text-xs text-gray-700 dark:text-gray-200">
                {hex}
              </span>
            </label>
          )
        })}
      </motion.div>
    </div>
  )
}

EditableColorPalette.propTypes = {
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      hex:  PropTypes.shape({ value: PropTypes.string.isRequired }).isRequired,
      name: PropTypes.shape({ value: PropTypes.string })
    })
  ).isRequired,
  onChangeColor: PropTypes.func.isRequired,
  title: PropTypes.string
}

EditableColorPalette.defaultProps = {
  title: 'Palette de couleurs'
}
