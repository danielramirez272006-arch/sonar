import { useCallback, useEffect, useRef, useState } from 'react'
import { getReviews, getUsers } from './shared/services/api-client.js'
import { analyzeReview } from './shared/services/ia-service.js'
import { useAdminDashboard, useModeration } from './features/admin/index.js'
import { AdminDashboardPage } from './pages/admin/admin-dashboard-page.jsx'
import { ModerationPage } from './pages/admin/moderation-page.jsx'
import { ThemeProvider } from './shared/context/theme-context.jsx'
import AppRouter from './shared/routing/app-router.jsx'
import "./Styles/App.css";
import './Styles/admin.css'
import './Styles/admin-dashboard.css'
import './Styles/admin-moderation.css'

export function AdminConsole() {
  const dashboard = useAdminDashboard()
  const moderation = useModeration()
  const [page, setPage] = useState(() => window.location.hash === '#moderacion' ? 'moderacion' : 'dashboard')
  const [data, setData] = useState({ users: [], reviews: [] })
  const [query, setQuery] = useState('')
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [analyses, setAnalyses] = useState({})
  const searchRef = useRef(null)
  const actionLock = useRef(false)
  const loadData = useCallback(async () => {
    const [users, reviews] = await Promise.all([getUsers(), getReviews()])
    setData({ users, reviews })
  }, [])

  useEffect(() => {
    let cancelled = false
    Promise.resolve().then(() => {
      if (!cancelled) return loadData()
    }).catch(cause => setError(cause.message))
    function onHashChange() {
      if (!['#dashboard', '#moderacion', '#admin', ''].includes(window.location.hash)) return
      setPage(window.location.hash === '#moderacion' ? 'moderacion' : 'dashboard')
      setQuery('')
    }
    function onShortcut(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('keydown', onShortcut)
    return () => {
      cancelled = true
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('keydown', onShortcut)
    }
  }, [loadData])

  async function refresh() {
    if (actionLock.current) return
    actionLock.current = true
    setBusy(true)
    setError(null)
    setNotice('')
    try {
      await Promise.all([loadData(), dashboard.refresh(), moderation.refresh()])
      setNotice('Información actualizada.')
    } catch (cause) {
      setError(cause.message || 'No se pudo actualizar la información.')
    } finally {
      actionLock.current = false
      setBusy(false)
    }
  }

  async function handleAction(action, review) {
    if (actionLock.current) return
    actionLock.current = true
    setBusy(true)
    setError(null)
    setNotice('')
    try {
      if (action === 'analyze') {
        const analysis = await analyzeReview(review)
        setAnalyses(previous => ({ ...previous, [review.id]: analysis }))
        if (analysis.aiFlagged) await moderation.flagReview(review.id)
        setNotice(analysis.aiFlagged ? 'Reseña marcada para revisión humana.' : 'Análisis de prueba completado: no se detectaron palabras de la lista ofensiva.')
      } else {
        await moderation[action === 'approve' ? 'approveReview' : 'rejectReview'](review.id)
        setNotice(`Reseña ${action === 'approve' ? 'aprobada' : 'rechazada'}.`)
      }
      await Promise.all([loadData(), dashboard.refresh()])
      return true
    } catch (cause) {
      setNotice('')
      setError(cause.message || 'No se pudo completar la acción.')
      return false
    } finally {
      actionLock.current = false
      setBusy(false)
    }
  }

  function exportCsv() {
    const rows = [['id', 'userId', 'albumId', 'rating', 'status', 'aiFlagged'], ...data.reviews.map(review => [review.id, review.userId, review.albumId, review.rating, review.status, review.aiFlagged])]
    const csv = rows.map(row => row.map(value => `"${String(value ?? '').replace(/^[=+@-]/, "'$&").replaceAll('"', '""')}"`).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'sonar-resenas.csv'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const loading = busy || dashboard.isLoading || moderation.isLoading
  const currentError = error || dashboard.error || moderation.error
  const shared = { users: data.users, query, busy: loading, onAction: handleAction, analyses }
  return (
    <div className="sonar-app">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="console-header">
        <div className="topbar shell">
          <a href="#explore" className="brand" aria-label="Sonar, ir al portal"><span className="sonar-mark" aria-hidden="true"><i /></span><span><strong>SONAR <span>• CONSOLE</span></strong><small>AUDIOPHILE CURATION HUB</small></span></a>
          <div className="global-search"><span aria-hidden="true">⌕</span><input ref={searchRef} value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar por usuario o álbum…" aria-label="Buscar reseñas por usuario o álbum" />{query ? <button className="clear-search" aria-label="Limpiar búsqueda" onClick={() => { setQuery(''); searchRef.current?.focus() }}>×</button> : <kbd>Ctrl K</kbd>}</div>
          <div className="console-mode"><span className="status-dot" /> Entorno de prueba <span className="avatar small">S</span></div>
        </div>
        <div className="nav-row shell"><nav aria-label="Administración"><a className={page === 'dashboard' ? 'active' : ''} aria-current={page === 'dashboard' ? 'page' : undefined} href="#dashboard">◫ <span>Dashboard</span></a><a className={page === 'moderacion' ? 'active' : ''} aria-current={page === 'moderacion' ? 'page' : undefined} href="#moderacion">≋ <span>Moderación</span><b>{dashboard.metrics.pendingReviews}</b></a><a href="#explore">← <span>Ir al Portal Público</span></a></nav><span className="nav-caption">BUEN CRITERIO. MEJOR MÚSICA.</span></div>
      </header>
      <main id="contenido" tabIndex={-1} className="shell main-content">
        <div className="breadcrumb">Administración <span>/</span> Centro de control <span>/</span> <strong>{page === 'dashboard' ? 'Dashboard' : 'Moderación'}</strong></div>
        {currentError && <div className="error-banner" role="alert"><div><strong>No pudimos completar la consulta.</strong><p>{currentError} Comprueba que la API local esté disponible.</p></div><button onClick={refresh} disabled={loading}>Reintentar</button></div>}
        <div className="live-notice" role="status">{notice}</div>
        {page === 'dashboard' ? <AdminDashboardPage {...shared} reviews={data.reviews} metrics={dashboard.metrics} onRefresh={refresh} onExport={exportCsv} error={currentError} /> : <ModerationPage {...shared} reviews={moderation.reviews} onRefresh={refresh} error={currentError} />}
      </main>
      <footer className="console-footer shell"><div><strong>SONAR<span className="red-dot"> •</span></strong><p>Un espacio para escuchar con atención.<br />Y compartir con criterio.</p></div><div><a href="#dashboard">Centro de control</a><a href="#moderacion">Moderación de reseñas</a><a href="#explore">Portal Público</a></div><span className="edition">CURADO CON CRITERIO<br /><b>EDICIÓN AUDIÓFILA</b><small>© {new Date().getFullYear()} SONAR</small></span></footer>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  )
}
