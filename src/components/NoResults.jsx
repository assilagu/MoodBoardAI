// src/components/NoResults.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * NoResults
 * Affiche un message lorsqu'aucune image n'est trouvée.
 *
 * Props:
 *  - keyword: le mot-clé recherché
 */
export default function NoResults({ keyword }) {
  return (
    <div className="text-center py-12">
      <p className="text-lg text-gray-600 dark:text-lilas-sombre">
        Aucun résultat pour « <span className="font-medium">{keyword}</span> ».
      </p>
    </div>
  );
}

NoResults.propTypes = {
  keyword: PropTypes.string.isRequired,
};
