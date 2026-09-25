import { useState } from 'react'

export function CatalogImage({ value, onChange, onBusy }) {
  const [error, setError] = useState('')
  async function upload(event) {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file) return
    setError(''); onBusy(true)
    let bitmap
    try {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Elige una imagen JPG, PNG o WebP.')
      if (file.size > 5 * 1024 * 1024) throw new Error('La imagen debe pesar menos de 5 MB.')
      bitmap = await createImageBitmap(file)
      const canvas = document.createElement('canvas')
      const scale = Math.min(1, 600 / Math.max(bitmap.width, bitmap.height))
      canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale))
      const context = canvas.getContext('2d')
      context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
      let data
      for (const quality of [0.85, 0.65, 0.45, 0.25, 0.1]) { data = canvas.toDataURL('image/jpeg', quality); if (data.length <= 60000) break }
      if (data.length > 60000) throw new Error('La imagen contiene demasiado detalle. Prueba una imagen más pequeña.')
      onChange(data)
    } catch (cause) { setError(cause.message || 'No se pudo leer la imagen.') }
    finally { bitmap?.close(); onBusy(false) }
  }
  return <div className="catalog-image"><label>URL de la imagen<input type="url" value={value?.startsWith('data:') ? '' : value || ''} placeholder="https://…" onChange={event => onChange(event.target.value)} /></label><label className="catalog-upload"><strong>↑ Importar una imagen</strong><span>Selecciona una foto de tu equipo</span><input aria-label="Importar una imagen" type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} /></label><small>JPG, PNG o WebP, hasta 5 MB. La imagen se optimiza al importarla y se conserva al guardar.</small>{value && <><img src={value} alt="Vista previa de la imagen" /><button type="button" onClick={() => onChange('')}>Quitar imagen</button></>}{error && <p role="alert">{error}</p>}</div>
}
