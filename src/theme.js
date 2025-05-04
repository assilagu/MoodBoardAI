// src/theme.js

// 1. Couleurs (light & dark)
export const colors = {
  light: {
    cream:          '#F9F6F1',
    'beige-rose':   '#F6ECE5',
    'rose-poudre':  '#FADADD',
    'lavande-pale': '#E9E7FD',
    'bleu-ciel':    '#D7EAFE',
    'menthe-pastel':'#D8F3DC',
    'gris-perle':   '#DADADA',
    'sable-clair':  '#EDE3D2',
    'rose-vintage': '#EFC7C2',
    'lilas-leger':  '#E6E6FA',
  },
  dark: {
    'noir-veloute':    '#1B1B1F',
    'gris-anthracite': '#2B2B30',
    'bleu-nuit':       '#31394D',
    'violet-profond':  '#433758',
    'rose-fume':       '#5B4856',
    'menthe-nocturne': '#3A4B4E',
    'gris-brumeux':    '#9FA0A8',
    'lilas-sombre':    '#645C78',
    'bleu-encre':      '#2C3E50',
  }
}

// 2. Espacements
export const spacing = {
  xxs: '2px',
  xs:  '4px',
  sm:  '8px',
  md:  '16px',
  lg:  '24px',
  xl:  '32px',
  '2xl':'40px',
}

// 3. Tailles de police
export const fontSizes = {
  xs:  '0.75rem',  // 12px
  sm:  '0.875rem', // 14px
  base:'1rem',     // 16px
  lg:  '1.125rem', // 18px
  xl:  '1.25rem',  // 20px
  '2xl':'1.5rem',  // 24px
  '3xl':'2rem',    // 32px
  '4xl':'2.5rem',  // 40px
}

// 4. Rayons de bordure
export const radii = {
  sm:   '0.25rem',  // 4px
  md:   '0.5rem',   // 8px
  lg:   '1rem',     // 16px
  round:'9999px',
}

// 5. Durées d’animation
export const transitions = {
  fast:   '150ms',
  normal: '300ms',
  slow:   '500ms',
}
