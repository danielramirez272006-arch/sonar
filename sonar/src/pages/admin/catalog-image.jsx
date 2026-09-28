import { useUIText } from '../../shared/i18n/use-ui-text.js';
import { useState } from 'react'
import { useTranslation } from '../../shared/context/language-context.jsx'

export function CatalogImage({ value, onChange, onBusy }) {
  const ui = useUIText();
  const { t } = useTranslation()
  const [error, setError] = useState('')
  async function upload(event) {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file) return
    setError(''); onBusy(true)
    let bitmap
    try {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error(t('admin.catalog.imageFormat'))
      if (file.size > 5 * 1024 * 1024) throw new Error(t('admin.catalog.imageTooLarge'))
      bitmap = await createImageBitmap(file)
      const canvas = document.createElement('canvas')
      const scale = Math.min(1, 600 / Math.max(bitmap.width, bitmap.height))
      canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale))
      const context = canvas.getContext('2d')
      context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height)
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
      let data
      for (const quality of [0.85, 0.65, 0.45, 0.25, 0.1]) { data = canvas.toDataURL('image/jpeg', quality); if (data.length <= 60000) break }
      if (data.length > 60000) throw new Error(t('admin.catalog.imageDetail'))
      onChange(data)
    } catch (cause) { setError(cause.message || t('admin.catalog.imageReadError')) }
    finally { bitmap?.close(); onBusy(false) }
  }
  return <div className="catalog-image"><label>{t('admin.catalog.imageUrl')}<input type="url" value={value?.startsWith('data:') ? '' : value || ''} placeholder="https://…" onChange={event => onChange(event.target.value)} /></label><label className="catalog-upload"><strong>↑ {t('admin.catalog.importImage')}</strong><span>{t('admin.catalog.selectPhoto')}</span><input aria-label={t('admin.catalog.importImage')} type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} /></label><small>{ui("JPG, PNG o WebP, hasta 5 MB.")} {t('admin.catalog.imageOptimize')}</small>{value && <><img src={value} alt={t('admin.catalog.previewImage')} /><button type="button" onClick={() => onChange('')}>{t('admin.catalog.removeImage')}</button></>}{error && <p role="alert">{error}</p>}</div>
}
