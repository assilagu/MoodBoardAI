// src/App.jsx
import React from 'react';

// Composants globaux
import Header from './components/Header';
import Footer from './components/Footer';

// Nouvelle page
import Home from './pages/Home';

export default function App() {
  return (
    // Container principal : plein écran, flex-col, background par défaut
    <div
      className={`
        min-h-screen flex flex-col
        bg-cream dark:bg-noir-veloute
        text-gray-800 dark:text-gris-brumeux
      `}
    >
      {/* ──────────────────────────────────────────────────────────────── */}
      {/* 1. Header */}
      <Header />

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* 2. Contenu principal : ici la Home Page */}
      <main className="flex-1 px-6 py-8">
        <Home />
      </main>

      {/* ──────────────────────────────────────────────────────────────── */}
      {/* 3. Footer */}
      <Footer />
    </div>
  );
}
