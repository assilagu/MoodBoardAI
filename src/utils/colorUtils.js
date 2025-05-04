// src/utils/colorUtils.js

/**
 * Hex → RGB
 * @param {string} hex  ex. '#F7C8CC' ou 'F7C8CC'
 */
export function hexToRgb(hex) {
  const cleaned = hex.replace(/^#/, '')
  const int     = parseInt(cleaned, 16)
  return {
    r: (int >> 16) & 255,
    g: (int >> 8)  & 255,
    b: int         & 255,
  }
}

/**
 * RGB → HSL (h,s,l ∈ [0,1])
 */
export function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break
      case g: h = ((b - r) / d + 2);             break
      case b: h = ((r - g) / d + 4);             break
      default :
        h = 0;
    }
    h /= 6
  }
  return { h, s, l }
}

/** Distance euclidienne normalisée en HSL */
function hslDistance(a, b) {
  const dh = Math.min(Math.abs(a.h - b.h), 1 - Math.abs(a.h - b.h))
  const ds = a.s - b.s
  const dl = a.l - b.l
  return Math.sqrt(dh * dh + ds * ds + dl * dl)
}

/**
 * Filtre les couleurs trop proches
 * @param {Array} colors   liste {hex:{value},…}
 * @param {number} threshold
 * @param {number} minCount
 */
export function filterSimilarColors(colors, threshold = 0.1, minCount = 8) {
  const uniques = [], rest = []
  for (const c of colors) {
    const hsl = rgbToHsl(hexToRgb(c.hex.value))
    const close = uniques.some(u => hslDistance(hsl, rgbToHsl(hexToRgb(u.hex.value))) < threshold)
    if (!close) uniques.push(c)
    else           rest.push(c)
  }
  if (uniques.length < minCount) {
    uniques.push(...rest.slice(0, minCount - uniques.length))
  }
  return uniques.slice(0, Math.max(minCount, uniques.length))
}

/**
 * Rééquilibre la vibrance
 * place soit les + saturées en tête, soit les - saturées
 */
export function rebalanceVibrance(colors) {
  if (colors.length === 0) return []
  const sats = colors.map(c => rgbToHsl(hexToRgb(c.hex.value)).s)
  const avg  = sats.reduce((a,b) => a + b, 0) / sats.length
  return colors.slice().sort((a, b) => {
    const sa = rgbToHsl(hexToRgb(a.hex.value)).s
    const sb = rgbToHsl(hexToRgb(b.hex.value)).s
    return avg < 0.5 ? sb - sa : sa - sb
  })
  
}
/** Convertit HSL (h∈[0,1],s,l∈[0,1]) en RGB 0-255 */
export function hslToRgb({ h, s, l }) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // gris
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

/** Convertit trois canaux RGB en hex (e.g. 255,0,128 → '#FF0080') */
export function rgbToHex({ r, g, b }) {
  const toHex = v => v.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
