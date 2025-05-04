// src/components/ExportButton.jsx
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { exportElementToPdf } from '../utils/pdfExporter'

export default function ExportButton({ targetRef, filename }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleClick = async () => {
    if (!targetRef.current) return
    setLoading(true)
    setMessage('')
    try {
      await exportElementToPdf(targetRef.current, { filename })
      setMessage('PDF prêt !')
    } catch (err) {
      console.error('Export PDF error:', err)
      setMessage('Erreur export PDF')
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(''), 2000)
    }
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        aria-label="Télécharger moodboard"
        className={`
          flex items-center px-4 py-2
          bg-bleu-ciel dark:bg-violet-profond
          text-gray-800 dark:text-gray-100
          rounded hover:bg-menthe-pastel dark:hover:bg-rose-fume
          transition focus:outline-none focus:ring-2 focus:ring-bleu-ciel
          disabled:opacity-50
        `}
      >
        {loading ? 'Génération...' : 'Télécharger PDF'}
      </button>

      {message && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2
                        bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
          {message}
        </div>
      )}
    </div>
  )
}

ExportButton.propTypes = {
  targetRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
  filename:  PropTypes.string
}
