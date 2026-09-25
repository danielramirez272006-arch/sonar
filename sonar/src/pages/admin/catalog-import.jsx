import { saveImportedRow } from '../../shared/services/catalog-import-service.js'
import { useRef, useState } from 'react'
import { Modal } from '../../shared/components/ui/modal.jsx'
import { catalogTemplate, readCatalogExcel } from '../../shared/services/catalog-excel.js'
import { catalogTypes } from '../../shared/services/catalog-service.js'

export function CatalogImport({ type, user, onSaved, onClose }) {
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
    try { await action() } catch (cause) { setError(cause.message || 'No se pudo procesar el archivo.') }
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
      if (!/\.xlsx$/i.test(file.name)) throw new Error('Selecciona un archivo Excel .xlsx.')
      if (file.size > 5 * 1024 * 1024) throw new Error('El archivo debe pesar menos de 5 MB.')
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
  return <Modal isOpen title="Importar desde Excel" className="catalog-import" onClose={() => { if (!busy) onClose() }}>
    <p>Añade varios registros a <strong>{catalogTypes[type].title}</strong>. Elige si quieres guardarlos como borradores o publicarlos.</p>
    <ol className="catalog-import-steps"><li><strong>Descarga y completa la plantilla</strong><p>Conserva los encabezados. Escribe las fechas como AAAA-MM-DD.</p><button disabled={busy} onClick={template}>Descargar plantilla Excel</button></li><li><strong>Selecciona tu archivo</strong><p>Excel .xlsx · Hasta 200 registros · Máximo 5 MB. Se lee la primera hoja.</p><label className="catalog-upload"><strong>↑ Seleccionar archivo Excel</strong><span>{filename || 'Haz clic aquí para elegir tu archivo .xlsx'}</span><input aria-label="Archivo Excel" type="file" accept=".xlsx" disabled={busy} onChange={select} /></label></li></ol>
    <label>Estado al importar<select disabled={busy} value={status} onChange={event => setStatus(event.target.value)}><option value="draft">Borrador (oculto en Noticias)</option><option value="published">Publicado (visible en Noticias según sus fechas)</option></select></label>
    {filename && <p className="catalog-import-filename">Archivo: {filename}</p>}
    {error && <p role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}{busy && <p role="status">Procesando…</p>}
    {items.length > 0 && <><h3>Vista previa · {items.length} registros pendientes</h3><div className="catalog-import-preview"><table><thead><tr><th>Fila</th><th>Título / Nombre</th><th>Artista / País</th><th>Estado</th></tr></thead><tbody>{items.map(item => <tr key={item.row}><td>{item.row}</td><td>{item.data.title || item.data.name}</td><td>{item.data.artist || item.data.country || '—'}</td><td>{status === 'published' ? 'Publicado' : 'Borrador'}</td></tr>)}</tbody></table></div><p>Se añadirán registros nuevos. Comprueba que no existan ya en el catálogo.</p></>}
    <div className="catalog-form-actions"><button disabled={busy} onClick={onClose}>Cerrar</button><button className="primary-button" disabled={busy || !items.length} onClick={save}>Importar {items.length || ''} registros</button></div>
  </Modal>
}
