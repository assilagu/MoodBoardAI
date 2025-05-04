import { useState, useEffect } from 'react'

/**
 * useTheme
 * Renvoie le thème courant ("light" ou "dark") sur base de la classe <html>.
 */
export default function useTheme() {
  const [theme, setTheme] = useState(
    typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light'
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(
        document.documentElement.classList.contains('dark')
          ? 'dark'
          : 'light'
      )
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    return () => observer.disconnect()
  }, [])

  return { theme }
}
