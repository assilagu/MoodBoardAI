// src/components/SearchBar.jsx
import React, { useState } from 'react'
import PropTypes from 'prop-types'

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    const term = input.trim()
    if (term) onSearch(term)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto flex"
      role="search"
      aria-label="Recherche de moodboard"
    >
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ex : cyberpunk, cosy winter…"
        aria-label="Mot-clé pour moodboard"
        className="
          flex-1 px-4 py-2
          border border-gris-perle dark:border-gris-brumeux
          bg-cream dark:bg-gris-anthracite
          text-gray-800 dark:text-gray-100
          rounded-l-lg
          focus:outline-none focus:ring-2 focus:ring-bleu-ciel dark:focus:ring-violet-profond
        "
      />

      <button
        type="submit"
        aria-label="Générer moodboard"
        className="
          px-6 py-2
          bg-rose-vintage dark:bg-violet-profond
          text-gray-800 dark:text-gray-100
          rounded-r-lg transition duration-300 ease-in-out
          hover:bg-lavande-pale dark:hover:bg-rose-fume
          focus:outline-none focus:ring-2 focus:ring-rose-vintage dark:focus:ring-violet-profond
        "
      >
        Générer
      </button>
    </form>
  )
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired
}
