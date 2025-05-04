// src/components/LoadingSpinner.jsx
import React from 'react'

export default function LoadingSpinner() {
  return (
    <div
      className="flex justify-center items-center py-12"
      aria-busy="true"
      aria-label="Chargement en cours"
    >
      <div
        className="
          w-12 h-12
          border-4 border-t-transparent border-rose-vintage
          rounded-full animate-spin
        "
      />
    </div>
  )
}
