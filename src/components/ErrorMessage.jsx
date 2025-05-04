// src/components/ErrorMessage.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorMessage
 * Affiche un message d'erreur et un bouton pour relancer la recherche.
 *
 * Props:
 *  - onRetry: fonction à appeler pour relancer l'opération (retry)
 */
export default function ErrorMessage({ onRetry }) {
  return (
    <div
      className="bg-rose-poudre dark:bg-rose-fume text-gray-800 dark:text-gray-100
                 p-6 rounded-md text-center"
      role="alert"
      aria-live="assertive"
    >
      <p className="mb-4 font-medium">
        Oups ! Une erreur est survenue pendant la récupération des images.
      </p>
      <button
        onClick={onRetry}
        className="
          px-4 py-2
          bg-violet-profond dark:bg-bleu-nuit
          text-white
          rounded-lg
          hover:bg-rose-fume dark:hover:bg-menthe-nocturne
          transition
        "
      >
        Réessayer
      </button>
    </div>
  );
}

ErrorMessage.propTypes = {
  onRetry: PropTypes.func.isRequired,
};
