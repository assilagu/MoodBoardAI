// src/components/ColorPalette.jsx
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { fadeInUp } from '../utils/animations'

export default function ColorPalette({ colors, title }) {
  const MAX = 8
  const display = [...colors]
  while (display.length < MAX) {
    display.push({ hex: { value: '#EEE' }, name: { value: '' } })
  }

  const [toast, setToast] = useState(null)
  const copyHex = hex => {
    navigator.clipboard.writeText(hex)
    setToast(`Copié : ${hex}`)
    setTimeout(() => setToast(null), 1500)
  }

  return (
    <div className="relative w-full">
      <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        {title}
      </h4>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded shadow-lg z-50"
        >
          {toast}
        </div>
      )}

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-4 gap-4"
      >
        {display.map((c, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => c.hex.value && copyHex(c.hex.value)}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="
              relative flex flex-col items-center
              focus:outline-none focus:ring-2 focus:ring-bleu-ciel dark:focus:ring-violet-profond
            "
            aria-label={c.hex.value ? `Copier ${c.hex.value}` : undefined}
            tabIndex={0}
          >
            {c.name.value && (
              <span className="absolute -top-6 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition">
                {c.name.value}
              </span>
            )}
            <div
              className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-700"
              style={{ backgroundColor: c.hex.value }}
            />
            <span className="mt-2 text-xs text-gray-700 dark:text-gray-200">
              {c.hex.value}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}

ColorPalette.propTypes = {
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      hex:  PropTypes.shape({ value: PropTypes.string.isRequired }).isRequired,
      name: PropTypes.shape({ value: PropTypes.string })
    })
  ).isRequired,
  title: PropTypes.string
}

ColorPalette.defaultProps = {
  title: 'Palette de couleurs'
}
