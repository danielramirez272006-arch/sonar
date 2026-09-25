import { CatalogImage } from './catalog-image.jsx'
import { newsCategories } from '../../shared/services/news-service.js'
import { CatalogImport } from './catalog-import.jsx'
import { useEffect, useRef, useState } from 'react'
import { Plus, Pencil, Trash2, Disc3 } from 'lucide-react'
import { useAuth } from '../../shared/context/auth-context.jsx'
import { Modal } from '../../shared/components/ui/modal.jsx'
import { catalogTypes, getCatalog, saveCatalog, deleteCatalog } from '../../shared/services/catalog-service.js'

export function CatalogPage({ type }) {
  const { user } = useAuth()
  const definition = catalogTypes[type]
  const [rows, setRows] = useState([])
  const [vinyls, setVinyls] = useState([])
  const [imageBusy, setImageBusy] = useState(false)
  const [labels, setLabels] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [importing, setImporting] = useState(false)
  const [editor, setEditor] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const lock = useRef(false)
  useEffect(() => {
    let active = true
    Promise.all([getCatalog(type), ['releases', 'vinyl', 'announcements'].includes(type) ? getCatalog('labels') : Promise.resolve([]), type === 'announcements' ? getCatalog('vinyl') : Promise.resolve([])]).then(([items, seals, editions]) => {
      if (active) { setRows(items); setLabels(seals); setVinyls(editions); const editId = new URLSearchParams(window.location.hash.split('?')[1] || '').get('edit'); if (editId) setEditor(items.find(item => String(item.id) === editId) || null); setLoadError(''); setLoading(false) }
    }).catch(cause => { if (active) { setLoadError(cause.message); setLoading(false) } })
    return () => { active = false }
  }, [type, refresh])
  const visible = rows.filter(row => (filter === 'all' || row.status === filter) && `${row.name || row.title} ${row.artist || ''} ${row.country || ''}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
  async function publishDrafts() {
    if (lock.current) return
    lock.current = true; setBusy(true); setError(''); setNotice('')
    let count = 0
    try {
      for (const row of rows.filter(item => item.status === 'draft')) {
        const saved = await saveCatalog(type, { ...row, status: 'published' }, user, row.id)
        setRows(previous => previous.map(item => String(item.id) === String(saved.id) ? saved : item))
        count++
      }
      setNotice(`${count} registros publicados. En Noticias se mostrarán según sus fechas.`)
    } catch (cause) { setNotice(`${count} registros publicados.`); setError(cause.message) }
    finally { lock.current = false; setBusy(false) }
  }
  function openEditor(row) { setEditor(row ? { ...row } : { status: 'draft', labelId: '', category: 'Crónicas' }); setError('') }
  async function submit(event) {
    event.preventDefault()
    if (lock.current || imageBusy) return
    lock.current = true; setBusy(true); setError(''); setNotice('')
    try {
      const saved = await saveCatalog(type, editor, user, editor.id)
      setRows(previous => editor.id != null ? previous.map(row => String(row.id) === String(editor.id) ? saved : row) : [saved, ...previous])
      setEditor(null); setNotice('Registro guardado correctamente.')
    } catch (cause) { setError(cause.message) } finally { lock.current = false; setBusy(false) }
  }
  async function remove() {
    if (lock.current || imageBusy) return
    lock.current = true; setBusy(true); setError(''); setNotice('')
    try {
      await deleteCatalog(type, deleting.id, user)
      setRows(previous => previous.filter(row => String(row.id) !== String(deleting.id)))
      setDeleting(null); setNotice('Registro eliminado correctamente.')
    } catch (cause) { setError(cause.message) } finally { lock.current = false; setBusy(false) }
  }
  return <section className="catalog-admin" aria-busy={loading || busy}>
    <header className="catalog-heading"><div><span className="eyebrow">GESTIÓN DEL CATÁLOGO</span><h1>{definition.title}</h1><p>{type === 'announcements' ? 'Administra las noticias del portal: crea, edita, publica o guarda como borrador.' : 'Administra registros y prepara contenido para su publicación.'}</p></div><div className="catalog-heading-actions"><button className="catalog-import-button" onClick={() => setImporting(true)} disabled={loading || !!loadError}>Importar Excel</button><button className="primary-button" onClick={() => openEditor()} disabled={loading || !!loadError}><Plus size={17} aria-hidden="true" /> Nuevo registro</button></div></header>
    <nav className="catalog-tabs" aria-label="Catálogos">{Object.entries(catalogTypes).map(([key, value]) => <a key={key} href={`#admin-catalog-${key}`} aria-current={key === type ? 'page' : undefined}>{value.title}</a>)}</nav>
    <div className="catalog-controls"><label>Buscar<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Nombre, artista o país" /></label><label>Estado<select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">Todos</option><option value="draft">Borradores</option><option value="published">Publicados</option></select></label><span>{rows.length} registros · {rows.filter(row => row.status === 'published').length} publicados</span></div>
    {['labels', 'vinyl', 'announcements', 'releases'].includes(type) && rows.some(row => row.status === 'draft') && <div className="catalog-publication-notice"><p>{rows.filter(row => row.status === 'draft').length} borradores están ocultos en Noticias. Publicarlos los hará visibles según sus fechas.</p><button className="primary-button" disabled={busy || loading} onClick={publishDrafts}>Publicar todos los borradores ({rows.filter(row => row.status === 'draft').length})</button></div>}
    {error && !editor && !deleting && <p role="alert">{error}</p>}
    {notice && <p role="status">{notice}</p>}
    {loadError ? <div role="alert"><p>{loadError}</p><button onClick={() => { setLoading(true); setRefresh(value => value + 1) }}>Reintentar</button></div> : loading ? <p role="status">Cargando catálogo…</p> : !visible.length ? <div className="catalog-empty"><Disc3 size={32} aria-hidden="true" /><h2>{rows.length ? 'No hay coincidencias' : 'Tu catálogo empieza aquí'}</h2><p>{rows.length ? 'Cambia la búsqueda o el filtro.' : `Añade tu primer ${definition.singular}. Puedes guardarlo como borrador.`}</p></div> : <div className="catalog-list">{visible.map(row => <article className="catalog-row" key={row.id}>
      {row.cover ? (
        <img src={row.cover} alt={`Portada de ${row.name || row.title}`} className="catalog-row-cover" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 10, flexShrink: 0, background: '#f0e0ed' }} onError={e => { e.target.style.display = 'none' }} />
      ) : (
        <Disc3 size={24} aria-hidden="true" />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {row.name || row.title}
          {row.type && <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(184,12,9,0.1)', color: '#B80C09', padding: '1px 7px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{row.type}</span>}
        </h2>
        <p>{[row.artist || row.country, row.genre, row.releaseDate || row.year || row.founded, labels.find(label => String(label.id) === row.labelId)?.name].filter(Boolean).join(' · ')}</p>
      </div>
      <span className={`catalog-status catalog-status--${row.status}`}>{row.status === 'published' ? 'Publicado' : 'Borrador'}</span>
      <div className="catalog-row-actions">
        {row.externalUrl && <a href={row.externalUrl} target="_blank" rel="noopener noreferrer" aria-label={`Ver ${row.name || row.title} en Deezer/Spotify`} title="Ver en Deezer/Spotify" style={{ padding: '4px 8px', fontSize: 12, color: '#B80C09', textDecoration: 'none', fontWeight: 700 }}>↗ Enlace</a>}
        <button onClick={() => openEditor(row)} aria-label={`Editar ${row.name || row.title}`}><Pencil size={15} aria-hidden="true" /> Editar</button>
        <button onClick={() => { setDeleting(row); setError('') }} aria-label={`Eliminar ${row.name || row.title}`}><Trash2 size={15} aria-hidden="true" /> Eliminar</button>
      </div>
    </article>)}</div>}
    {importing && <CatalogImport type={type} user={user} onClose={() => setImporting(false)} onSaved={saved => setRows(previous => [saved, ...previous])} />}
    {editor && <Modal isOpen title={`${editor.id != null ? 'Editar' : 'Crear'} ${definition.singular}`} onClose={() => { if (!busy && !imageBusy) setEditor(null) }}><form className="catalog-form" onSubmit={submit}><fieldset disabled={busy || imageBusy}>
      {definition.fields.filter(([key]) => key !== 'cover').map(([key, label, kind, required]) => <label key={key}>{label}{required ? ' *' : ''}{kind === 'category' ? <select value={editor[key] || 'Crónicas'} onChange={e => setEditor({ ...editor, [key]: e.target.value })}>{newsCategories.map(category => <option key={category}>{category}</option>)}</select> : kind === 'textarea' ? <textarea required={!!required} maxLength={key === 'content' ? 20000 : 2000} rows={3} value={editor[key] || ''} onChange={e => setEditor({ ...editor, [key]: e.target.value })} /> : <input type={kind} required={!!required} maxLength={300} min={kind === 'number' ? 1800 : undefined} max={kind === 'number' ? new Date().getFullYear() + 5 : undefined} value={editor[key] ?? ''} onChange={e => setEditor({ ...editor, [key]: e.target.value })} />}</label>)}
      {['releases', 'vinyl', 'announcements'].includes(type) && <label>Sello discográfico<select value={editor.labelId || ''} onChange={e => setEditor({ ...editor, labelId: e.target.value })}><option value="">Sin sello asociado</option>{labels.map(label => <option key={label.id} value={label.id}>{label.name}</option>)}</select></label>}
      {definition.fields.some(([key]) => key === 'cover') && <CatalogImage value={editor.cover} onChange={cover => setEditor(previous => ({ ...previous, cover }))} onBusy={setImageBusy} />}
      {type === 'announcements' && <label>Edición de vinilo relacionada<select value={editor.vinylId || ''} onChange={e => setEditor({ ...editor, vinylId: e.target.value })}><option value="">Sin edición asociada</option>{vinyls.map(vinyl => <option key={vinyl.id} value={vinyl.id}>{vinyl.title} · {vinyl.artist}</option>)}</select></label>}
      <label>Estado<select value={editor.status} onChange={e => setEditor({ ...editor, status: e.target.value })}><option value="draft">Borrador</option><option value="published">Publicado</option></select></label>
      <p>{type === 'announcements' ? 'Las noticias publicadas aparecen en Noticias durante las fechas indicadas. Un borrador no será visible. Deja la fecha final vacía para mantenerla publicada.' : 'El estado se guarda para su integración con el portal.'} Los campos con * son obligatorios.</p>{error && <p role="alert">{error}</p>}<div className="catalog-form-actions"><button type="button" onClick={() => setEditor(null)}>Cancelar</button><button className="primary-button" type="submit">{busy ? 'Guardando…' : 'Guardar registro'}</button></div>
    </fieldset></form></Modal>}
    {deleting && <Modal isOpen title="Eliminar registro" onClose={() => { if (!busy) setDeleting(null) }}><p>¿Eliminar «{deleting.name || deleting.title}»? Se retirará del catálogo administrativo. Esta acción no se puede deshacer.</p>{error && <p role="alert">{error}</p>}<div className="catalog-form-actions"><button disabled={busy} onClick={() => setDeleting(null)}>Cancelar</button><button disabled={busy} onClick={remove}>{busy ? 'Eliminando…' : 'Confirmar eliminación'}</button></div></Modal>}
  </section>
}
