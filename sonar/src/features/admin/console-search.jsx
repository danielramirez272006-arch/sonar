import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { DEFAULT_DEEZER_ALBUMS, searchAlbums } from '../../shared/services/deezer-service.js'

const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const shortcuts = [
  ['Reportes de la comunidad', 'reportes denuncias pendientes resueltos revisados', '#admin-reports'],
  ['Usuarios y perfiles', 'usuarios miembros cuentas', '#usuarios'],
  ['Todas las reseñas', 'resenas comentarios comunidad filtros', '#admin-reviews'],
  ['Reseñas pendientes', 'filtros pendientes revisar', '#admin-reviews?filter=pending_moderation'],
  ['Reseñas aprobadas', 'filtros aprobadas', '#admin-reviews?filter=approved'],
  ['Reseñas rechazadas', 'filtros rechazadas', '#admin-reviews?filter=rejected'],
  ['Reseñas marcadas por IA', 'filtros marcadas inteligencia artificial', '#admin-reviews?filter=flagged'],
  ['Moderación', 'moderar aprobar rechazar', '#moderacion'],
  ['Centro de control', 'dashboard estadisticas metricas exportar csv', '#dashboard'],
  ['Explorar música', 'portal discos musica catalogo', '#explore'],
]

export function ConsoleSearch({ users, reviews, query, setQuery, inputRef }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [remote, setRemote] = useState({ query: '', albums: [] })
  const term = normalize(query.trim())
  useEffect(() => {
    if (query.trim().length < 2) return
    let cancelled = false
    const timer = setTimeout(async () => {
      const albums = await searchAlbums(query)
      if (!cancelled) setRemote({ query, albums })
    }, 350)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [query])

  const matches = value => normalize(value).includes(term)
  const albums = [...new Map([...DEFAULT_DEEZER_ALBUMS, ...(remote.query === query ? remote.albums : [])].map(album => [String(album.id), album])).values()]
  const results = [
    ...(term ? users.filter(user => matches(`${user.username} ${user.email}`)).slice(0, 4).map(user => ({ title: user.username, detail: 'Usuario · Abrir perfil', href: `#usuarios?user=${encodeURIComponent(user.id)}` })) : []),
    ...(term ? albums.filter(album => matches(`${album.title} ${album.artist}`)).slice(0, 5).map(album => ({ title: album.title, detail: `${album.artist} · Abrir en Deezer ↗`, href: `https://www.deezer.com/album/${album.id}` })) : []),
    ...(term ? reviews.filter(review => matches(`${review.id} ${review.content} ${review.albumId} ${users.find(user => user.id === review.userId)?.username || ''}`)).slice(0, 4).map(review => ({ title: `Reseña #${review.id}`, detail: review.content, href: `#admin-reviews?review=${encodeURIComponent(review.id)}` })) : []),
    ...shortcuts.filter(([title, keywords]) => matches(`${title} ${keywords}`)).map(([title, , href]) => ({ title, detail: 'Acceso directo', href })),
  ]
  const activeIndex = Math.min(active, results.length - 1)
  function select(result) {
    if (!result) return
    setOpen(false)
    setQuery('')
    if (result.href.startsWith('https:')) window.location.assign(result.href)
    else window.location.hash = result.href
  }
  return <div className="global-search console-search" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
    <span className="console-search__icon" aria-hidden="true"><Search size={19} strokeWidth={1.8} /></span>
    <input ref={inputRef} value={query} placeholder="Usuarios, álbumes, reseñas, filtros…" aria-label="Buscar reseñas por usuario o álbum" role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls="console-search-results" aria-activedescendant={open && activeIndex >= 0 ? `search-option-${activeIndex}` : undefined}
      onFocus={() => setOpen(true)} onChange={event => { setQuery(event.target.value); setActive(0); setOpen(true) }}
      onKeyDown={event => {
        if (event.key === 'Escape') { setOpen(false); return }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setOpen(true); setActive(index => results.length ? (index + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length : 0) }
        if (event.key === 'Enter' && open) { event.preventDefault(); select(results[activeIndex]) }
      }} />
    {query && <button className="clear-search" aria-label="Limpiar búsqueda" onClick={() => { setQuery(''); setActive(0); inputRef.current?.focus() }}>×</button>}
    {open && <div className="console-search__panel">
      <p className="console-search__hint">{term ? 'Resultados y accesos directos' : '¿A dónde quieres ir?'} · ↑ ↓ y Enter</p>
      <div id="console-search-results" role="listbox" aria-label="Resultados de búsqueda">
        {results.map((result, index) => <a key={result.href} id={`search-option-${index}`} role="option" aria-selected={index === activeIndex} href={result.href} onClick={event => { event.preventDefault(); select(result) }} onMouseEnter={() => setActive(index)}><strong>{result.title}</strong><small>{result.detail}</small></a>)}
      </div>
      {!results.length && <p role="status">Sin resultados. Prueba un nombre, un álbum o «filtros».</p>}
      {query.trim().length >= 2 && remote.query !== query && <p role="status">Buscando también en Deezer…</p>}
    </div>}
  </div>
}
