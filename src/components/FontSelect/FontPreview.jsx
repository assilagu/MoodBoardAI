import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

/**
 * FontPreview
 * Prévisualise un texte dans la police sélectionnée.
 *
 * Props:
 *  - family: nom de la police (string)
 *  - text:   texte à afficher (string, facultatif)
 */
export default function FontPreview({
  family,
  text = 'The quick brown fox jumps over the lazy dog.'
}) {
  useEffect(() => {
    if (!family) return

    // ID unique pour éviter les doublons
    const linkId = `gf-${family.replace(/\s+/g, '-')}`
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link')
      link.id = linkId
      link.rel = 'stylesheet'
      // Chargement via Google Fonts API (400 & 700)
      link.href =
        `https://fonts.googleapis.com/css2?family=` +
        `${encodeURIComponent(family)}:wght@400;700&display=swap`
      document.head.appendChild(link)
    }
  }, [family])

  if (!family) return null

  return (
    <div className="mt-4 p-4 border rounded">
      <p
        className="text-xl"
        style={{ fontFamily: `'${family}', sans-serif` }}
      >
        {text}
      </p>
    </div>
  )
}

FontPreview.propTypes = {
  family: PropTypes.string.isRequired,
  text:   PropTypes.string
}
