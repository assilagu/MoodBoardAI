import React from 'react'
import PropTypes from 'prop-types'
import useFonts from '../../hooks/useFonts'

/**
 * FontSelect
 * Sélecteur de polices Google Fonts.
 *
 * Props:
 *  - category: filrer par catégorie (ex. "serif")
 *  - sort:     tri (ex. "popularity")
 *  - value:    police courante sélectionnée (string)
 *  - onChange: callback(value: string) exécuté lors du changement
 */
export default function FontSelect({
  category = '',
  sort = '',
  value,
  onChange
}) {
  const { fonts, isLoading, error } = useFonts(category, sort)

  if (isLoading) return <p>Chargement des polices…</p>
  if (error)     return <p>Erreur lors du chargement des polices.</p>

  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full p-2 border rounded"
    >
      <option value="">– Choisir une police –</option>
      {fonts.map(font => (
        <option key={font.family} value={font.family}>
          {font.family}
        </option>
      ))}
    </select>
  )
}

FontSelect.propTypes = {
  category: PropTypes.string,
  sort:     PropTypes.string,
  value:    PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
