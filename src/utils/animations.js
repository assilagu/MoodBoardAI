// src/utils/animations.js
export const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } }
  }
  
  export const fadeInUp = {
    hidden:   { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }
  
  export const collapse = {
    hidden:  { height: 0, opacity: 0 },
    visible: { height: 'auto', opacity: 1, transition: { duration: 0.3 } }
  }
  