import { useState, useCallback } from 'react'

/**
 * useClipboard
 * Copy text to clipboard and track success state.
 *
 * @param {number} [timeout=1500] – ms until “copied” resets
 * @returns {{ copy: (text: string) => Promise<void>, copied: boolean }}
 */
export default function useClipboard(timeout = 1500) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), timeout)
    } catch (err) {
      console.error('Clipboard copy failed', err)
      setCopied(false)
    }
  }, [timeout])

  return { copy, copied }
}
