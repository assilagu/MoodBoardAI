// src/components/FontSelector.jsx
import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'

export default function FontSelector({ fonts, onSelect }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const categories = useMemo(() => {
    const setCat = new Set(fonts.map(f => f.category || ''))
    return Array.from(setCat).filter(c => c).sort()
  }, [fonts])

  const filtered = useMemo(
    () =>
      fonts.filter(f => {
        const matchCat = category ? f.category === category : true
        const matchSearch = f.family
          .toLowerCase()
          .includes(search.toLowerCase())
        return matchCat && matchSearch
      }),
    [fonts, category, search]
  )

  const handleKey = (e, family) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(family)
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Rechercher une police…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        aria-label="Recherche de police"
        className="
          w-full p-2 border rounded
          focus:outline-none focus:ring-2 focus:ring-bleu-ciel dark:focus:ring-violet-profond
        "
      />

      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        aria-label="Filtre catégorie"
        className="
          w-full p-2 border rounded
          focus:outline-none focus:ring-2 focus:ring-bleu-ciel dark:focus:ring-violet-profond
        "
      >
        <option value="">Toutes catégories</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <ul
        role="listbox"
        aria-label="Liste des polices"
        className="max-h-60 overflow-auto border rounded"
      >
        {filtered.map(f => (
          <li
            key={f.family}
            role="option"
            tabIndex={0}
            onClick={() => onSelect(f.family)}
            onKeyDown={e => handleKey(e, f.family)}
            className="
              cursor-pointer px-3 py-2
              hover:bg-gray-100 dark:hover:bg-gray-700
              focus:outline-none focus:ring-2 focus:ring-bleu-ciel dark:focus:ring-violet-profond
            "
            aria-selected={false}
            aria-label={`Sélectionner police ${f.family}`}
          >
            {f.family}
          </li>
        ))}
        {!filtered.length && (
          <li className="px-3 py-2 text-gray-500">Aucune police trouvée.</li>
        )}
      </ul>
    </div>
  )
}

FontSelector.propTypes = {
  fonts: PropTypes.arrayOf(
    PropTypes.shape({
      family: PropTypes.string.isRequired,
      category: PropTypes.string
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired
}
