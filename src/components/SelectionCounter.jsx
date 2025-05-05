// src/components/SelectionCounter.jsx
import React from 'react'
import PropTypes from 'prop-types'

/**
 * SelectionCounter
 * Affiche le nombre d’images sélectionnées avec feedback :
 *  • "Sélection : X/20"
 *  • Avertissement si X < min ou X > max
 *
 * Props :
 *  - count: nombre d’éléments sélectionnés
 *  - min:   nombre minimum requis (défaut 9)
 *  - max:   nombre maximum autorisé (défaut 20)
 */
export default function SelectionCounter({
  count,
  min = 9,
  max = 20
}) {
  let message = `Sélection : ${count}/${max}`

  let feedback = null
  if (count < min) {
    feedback = (
      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
        Sélectionnez au moins {min} images pour exporter.
      </p>
    )
  } else if (count > max) {
    feedback = (
      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
        Vous avez sélectionné plus de {max} images (max autorisé).
      </p>
    )
  } else {
    feedback = (
      <p className="mt-2 text-sm text-green-600 dark:text-green-400">
        Prêt à exporter !
      </p>
    )
  }

  return (
    <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner">
      <span className="font-medium text-gray-800 dark:text-gray-100">
        {message}
      </span>
      {feedback}
    </div>
  )
}

SelectionCounter.propTypes = {
  count: PropTypes.number.isRequired,
  min:   PropTypes.number,
  max:   PropTypes.number
}
