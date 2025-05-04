// src/utils/pdfExporter.js
import html2canvas from 'html2canvas'
import { jsPDF }   from 'jspdf'

export async function exportElementToPdf(el, options = {}) {
  if (!el) throw new Error('exportElementToPdf: element is required')

  const {
    orientation = 'portrait',
    unit        = 'pt',
    format      = 'a4',
    filename
  } = options

  // 1) Révéler temporairement le conteneur caché
  const origOpacity = el.style.opacity
  const origPointer = el.style.pointerEvents
  el.style.opacity = '1'
  el.style.pointerEvents = 'all'

  // 2) Rasteriser en haute résolution
  const canvas = await html2canvas(el, {
    scale: 3,
    useCORS: true,
    backgroundColor: null
  })
  const imgData = canvas.toDataURL('image/png')

  // 3) Restaurer les styles initiaux
  el.style.opacity = origOpacity
  el.style.pointerEvents = origPointer

  // 4) Créer le PDF
  const pdf  = new jsPDF({ orientation, unit, format })
  const pw   = pdf.internal.pageSize.getWidth()
  const ph   = pdf.internal.pageSize.getHeight()
  const props= pdf.getImageProperties(imgData)
  const ratio= Math.min(pw / props.width, ph / props.height)
  const w    = props.width * ratio
  const h    = props.height * ratio
  const x    = (pw - w) / 2
  const y    = (ph - h) / 2

  pdf.addImage(imgData, 'PNG', x, y, w, h)

  // 5) Enregistrement
  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  pdf.save(filename || `moodboard-${ts}.pdf`)
}
