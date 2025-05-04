import React from 'react';

export default function Footer() {
  return (
    <footer
      className={`
        bg-beige-rose dark:bg-gris-anthracite
        text-center
        px-6 py-8
      `}
    >
      <div className="max-w-4xl mx-auto space-y-2">
        {/* À propos */}
        <p className="text-gray-700 dark:text-gris-brumeux text-sm">
          MoodBoard AI transforme vos idées en moodboards élégants et inspirants,
          en un mot-clé, en un instant.
        </p>

        {/* Copyright */}
        <p className="text-gray-600 dark:text-lilas-sombre text-xs">
          © {new Date().getFullYear()} MoodBoard AI. Tous droits réservés.
        </p>
      </div>
    </footer>
);
}
