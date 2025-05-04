// src/components/MoodboardPdf.jsx
import React from 'react'
import PropTypes from 'prop-types'

/**
 * MoodboardPdf
 * Layout HTML/CSS dédié à l’export PDF.
 *
 * • Fond : blanc propre
 * • Header : mot-clé + typo (si sélectionnée)
 * • Palette : 8 swatches centrés, encadrés et en relief
 * • Grille : 16 images en 4×4, espacement uniforme et ombre de levitation
 */
export default function MoodboardPdf({
  keyword,
  selectedFont,
  palette,
  images,
  style = {}
}) {
  const bg = '#ffffff'
  const fontFamily = selectedFont
    ? `'${selectedFont}', sans-serif`
    : 'sans-serif'

  return (
    <div
      style={{
        backgroundColor: bg,
        padding: '32px',
        fontFamily,
        color: '#333',
        width: '1024px',
        boxSizing: 'border-box',
        ...style
      }}
    >
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '24px' }}>
        {keyword && (
          <h1 style={{ fontSize: '36px', margin: 0 }}>{keyword}</h1>
        )}
        {selectedFont && (
          <p
            style={{
              fontSize: '18px',
              margin: '8px 0 0',
              fontStyle: 'italic',
              color: '#555'
            }}
          >
            {selectedFont}
          </p>
        )}
      </header>

      {/* Palette swatches */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        {palette.slice(0, 8).map((c, i) => (
          <div
            key={i}
            style={{
              width: '56px',
              height: '56px',
              backgroundColor: c.hex.value,
              border: '2px solid rgba(0,0,0,0.1)',
              borderRadius: '6px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          />
        ))}
      </div>

      {/* Images grid 4×4 */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
        }}
      >
        {images.slice(0, 16).map((img, idx) => (
          <div
            key={idx}
            style={{
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#fff',
              boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
              transform: 'translateY(-2px)'
            }}
          >
            <img
              src={img.urls.regular}
              crossOrigin="anonymous"
              alt={img.alt_description || `Image ${idx + 1}`}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          </div>
        ))}
      </section>
    </div>
  )
}

MoodboardPdf.propTypes = {
  keyword:      PropTypes.string,
  selectedFont: PropTypes.string,
  palette:      PropTypes.arrayOf(
    PropTypes.shape({
      hex: PropTypes.shape({ value: PropTypes.string.isRequired })
    })
  ).isRequired,
  images:       PropTypes.arrayOf(
    PropTypes.shape({
      urls: PropTypes.shape({ regular: PropTypes.string.isRequired }),
      alt_description: PropTypes.string
    })
  ).isRequired,
  style:        PropTypes.object
}

MoodboardPdf.defaultProps = {
  keyword:      '',
  selectedFont: '',
  style:        {}
}
