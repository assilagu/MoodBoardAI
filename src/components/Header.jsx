import React, { useState, useEffect } from 'react';
import logo from '../moodboardia.png'; // ton logo à la racine de src

export default function Header() {
  // 1. État du thème (persisté en localStorage)
  const [theme, setTheme] = useState(
    () => window.localStorage.getItem('theme') || 'light'
  );

  // 2. À chaque changement de theme, on met à jour <html class="dark">
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  // 3. Switcher Light ↔ Dark
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header
      className={`
        flex items-center justify-between
        px-6 py-4
        bg-cream dark:bg-noir-veloute
        shadow-md
      `}
    >
      {/* Logo + Titre */}
      <div className="flex items-center space-x-3">
        <img
          src={logo}
          alt="Logo MoodBoard AI"
          className="h-10 w-10 object-contain"
        />
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          MoodBoard AI
        </h1>
      </div>

      {/* Toggle Light/Dark */}
      <button
        onClick={toggleTheme}
        aria-label="Basculer thème clair/sombre"
        className={`
          flex items-center space-x-2
          px-3 py-1
          rounded-lg
          bg-bleu-ciel dark:bg-violet-profond
          text-gray-800 dark:text-gray-100
          transition duration-300 ease-in-out
          hover:bg-menthe-pastel dark:hover:bg-rose-fume
        `}
      >
        {theme === 'light' ? (
          <>
            <span>🌙</span>
            <span>Dark</span>
          </>
        ) : (
          <>
            <span>☀️</span>
            <span>Light</span>
          </>
        )}
      </button>
    </header>
  );
}
