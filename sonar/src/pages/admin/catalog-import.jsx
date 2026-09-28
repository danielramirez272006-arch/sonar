import { saveImportedRow } from '../../shared/services/catalog-import-service.js'
import { useRef, useState } from 'react'
import { Modal } from '../../shared/components/ui/modal.jsx'
import { catalogTemplate, readCatalogExcel } from '../../shared/services/catalog-excel.js'
import { catalogTypes } from '../../shared/services/catalog-service.js'
import { useTranslation } from '../../shared/context/language-context.jsx'

export function CatalogImport({ type, user, onSaved, onClose }) {
  const { t } = useTranslation()
  const [status, setStatus] = useState('draft')
  const [items, setItems] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [filename, setFilename] = useState('')
  const lock = useRef(false)
  async function run(action) {
    if (lock.current) return
    lock.current = true; setBusy(true); setError('')
    try { await action() } catch (cause) { setError(cause.message || t('admin.catalog.processError')) }
    finally { lock.current = false; setBusy(false) }
  }
  function template() {
    run(async () => {
      const data = await catalogTemplate(type)
      const url = URL.createObjectURL(new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
      const link = document.createElement('a'); link.href = url; link.download = `plantilla-${type}.xlsx`; link.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    })
  }
  function select(event) {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file) return
    run(async () => {
      setItems([]); setNotice(''); setFilename(file.name)
      if (!/\.xlsx$/i.test(file.name)) throw new Error(t('admin.catalog.xlsxOnly'))
      if (file.size > 5 * 1024 * 1024) throw new Error(t('admin.catalog.fileTooLarge'))
      setItems((await readCatalogExcel(type, await file.arrayBuffer())).map(item => ({ ...item, importId: crypto.randomUUID() })))
    })
  }
  function save() {
    run(async () => {
      let count = 0
      const failures = []
      for (const item of items) {
        try {
          const saved = await saveImportedRow(type, item, user, status)
          onSaved(saved); count++
          setItems(previous => previous.filter(value => value.row !== item.row))
          setNotice(`${count} registros guardados.`)
        } catch (cause) { failures.push(`Fila ${item.row}: ${cause.message}`) }
      }
      if (failures.length) setError(`${failures.join(' · ')} Reintenta los pendientes; los guardados no se duplicarán.`)
    })
  }
  return <Modal isOpen title={t('admin.catalog.importTitle')} className="catalog-import" onClose={() => { if (!busy) onClose() }}>
    <p>{t('admin.catalog.importDescription', { catalog: t(`admin.catalog.type.${type}`, { defaultValue: catalogTypes[type].title }) })}</p>
    <ol className="catalog-import-steps"><li><strong>{t('admin.catalog.stepTemplate')}</strong><p>{t('admin.catalog.keepHeaders')}</p><button disabled={busy} onClick={template}>{t('admin.catalog.downloadTemplate')}</button></li><li><strong>{t('admin.catalog.stepFile')}</strong><p>{t('admin.catalog.xlsxLimits')}</p><label className="catalog-upload"><strong>{t('admin.catalog.selectExcel')}</strong><span>{filename || t('admin.catalog.chooseFile')}</span><input aria-label={t('admin.catalog.selectExcel')} type="file" accept=".xlsx" disabled={busy} onChange={select} /></label></li></ol>
    <label>{t('admin.catalog.importStatus')}<select disabled={busy} value={status} onChange={event => setStatus(event.target.value)}><option value="draft">{t('admin.catalog.draftHidden')}</option><option value="published">{t('admin.catalog.publishedVisible')}</option></select></label>
    {filename && <p className="catalog-import-filename">{t('admin.catalog.file')} {filename}</p>}
    {error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}{busy && <p role="status">{t('admin.catalog.processing')}</p>}
    {items.length > 0 && <><h3>{t('admin.catalog.preview')} · {t('admin.catalog.pendingRecords', { count: items.length })}</h3><div className="catalog-import-preview"><table><thead><tr><th>{t('admin.catalog.row')}</th><th>{t('admin.catalog.titleName')}</th><th>{t('admin.catalog.artistCountry')}</th><th>{t('admin.catalog.status')}</th></tr></thead><tbody>{items.map(item => <tr key={item.row}><td>{item.row}</td><td>{item.data.title || item.data.name}</td><td>{item.data.artist || item.data.country || '—'}</td><td>{status === 'published' ? t('admin.catalog.publishedStatus') : t('admin.catalog.draftStatus')}</td></tr>)}</tbody></table></div><p>{t('admin.catalog.importPreviewNote')}</p></>}
    <div className="catalog-form-actions"><button disabled={busy} onClick={onClose}>{t('admin.catalog.close')}</button><button className="primary-button" disabled={busy || !items.length} onClick={save}>{t('admin.catalog.importRecords', { count: items.length || '' })}</button></div>
  </Modal>
}
