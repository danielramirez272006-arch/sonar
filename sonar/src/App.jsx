import { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { getReviews, getUsers } from './shared/services/api-client.js'
import { analyzeReview } from './shared/services/ia-service.js'
import { useAdminDashboard, useModeration } from './features/admin/index.js'
import { AdminDashboardPage } from './pages/admin/admin-dashboard-page.jsx'
import { ModerationPage } from './pages/admin/moderation-page.jsx'
import { AnimatedLogo } from './shared/components/ui/AnimatedLogo.jsx'
import { AuthProvider } from './shared/context/auth-context.jsx'
import { ThemeProvider, useTheme } from './shared/context/theme-context.jsx'
import { PlayerProvider } from './shared/context/player-context.jsx'
import { GlobalAudioPlayer } from './shared/components/layout/global-audio-player.jsx'
import { ReviewModal } from './shared/components/layout/review-modal.jsx'
import AppRouter from './shared/routing/app-router.jsx'
import "./Styles/App.css";
import './Styles/admin.css'
import './Styles/admin-dashboard.css'
import './Styles/admin-moderation.css'

export function AdminConsole() {
  const { isDark, toggleTheme } = useTheme()
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
    <div className="sonar-app transition-colors duration-300 dark:bg-sonar-base dark:text-sonar-text min-h-screen">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="console-header dark:bg-sonar-surface dark:border-white/10">
        <div className="topbar shell dark:bg-sonar-surface dark:border-white/10">
          <a href="#explore" className="brand flex items-center gap-3" aria-label="Sonar, ir al portal">
            <AnimatedLogo size="sm" showText={false} />
            <span>
              <strong className="text-gray-900 dark:text-sonar-text">
                SONAR • <span className="text-[#B80C09] dark:text-[#ff4d4a] font-light tracking-widest text-lg transition-colors">CONSOLE</span>
              </strong>
              <small className="dark:text-[#DCDCDD]/70">AUDIOPHILE CURATION HUB</small>
            </span>
          </a>
          <div className="global-search dark:bg-sonar-base dark:border-sonar-surface">
            <span aria-hidden="true" className="text-[#B80C09] dark:text-[#ff4d4a]">⌕</span>
            <input
              ref={searchRef}
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Buscar por usuario o álbum…"
              aria-label="Buscar reseñas por usuario o álbum"
              className="dark:bg-sonar-base dark:text-sonar-text dark:placeholder-gray-400"
            />
            {query ? <button className="clear-search dark:text-sonar-text hover:text-[#B80C09]" aria-label="Limpiar búsqueda" onClick={() => { setQuery(''); searchRef.current?.focus() }}>×</button> : <kbd className="dark:border-white/10 dark:text-sonar-text">Ctrl K</kbd>}
          </div>
          <div className="console-mode flex items-center gap-3">
            <span className="status-dot" /> <span className="dark:text-sonar-text">Entorno de prueba</span> <span className="avatar small dark:bg-sonar-base dark:text-sonar-text border dark:border-white/10">S</span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md bg-gray-100 dark:bg-sonar-base text-gray-800 dark:text-sonar-text border border-transparent dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex-shrink-0 cursor-pointer"
              aria-label="Alternar modo oscuro"
              title={isDark ? "Cambiar a Modo Blanco" : "Cambiar a Modo Oscuro"}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
        </div>
        <div className="nav-row shell dark:bg-sonar-base dark:border-sonar-surface">
          <nav aria-label="Administración">
            <a
              className={`${page === 'dashboard' ? 'active dark:bg-sonar-surface dark:text-sonar-text dark:border dark:border-[#B80C09]/40 font-bold' : 'dark:text-sonar-text dark:hover:bg-sonar-surface/60'}`}
              aria-current={page === 'dashboard' ? 'page' : undefined}
              href="#dashboard"
            >
              ◫ <span>Dashboard</span>
            </a>
            <a
              className={`${page === 'moderacion' ? 'active dark:bg-sonar-surface dark:text-sonar-text dark:border dark:border-[#B80C09]/40 font-bold' : 'dark:text-sonar-text dark:hover:bg-sonar-surface/60'}`}
              aria-current={page === 'moderacion' ? 'page' : undefined}
              href="#moderacion"
            >
              ≋ <span>Moderación</span>
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-200 dark:bg-sonar-surface text-gray-700 dark:text-sonar-text border border-transparent dark:border-white/10">
                {dashboard.metrics.pendingReviews}
              </span>
            </a>
            <a href="#explore" className="dark:text-sonar-text dark:hover:bg-sonar-surface/60">← <span>Ir al Portal Público</span></a>
          </nav>
          <span className="nav-caption dark:text-sonar-text/70">BUEN CRITERIO. MEJOR MÚSICA.</span>
        </div>
      </header>
      <main id="contenido" tabIndex={-1} className="shell main-content transition-colors duration-300 dark:bg-sonar-base dark:text-sonar-text">
        <div className="breadcrumb text-gray-600 dark:text-[#DCDCDD]/70">Administración <span>/</span> Centro de control <span>/</span> <strong className="text-gray-900 dark:text-sonar-text">{page === 'dashboard' ? 'Dashboard' : 'Moderación'}</strong></div>
        {currentError && <div className="error-banner" role="alert"><div><strong>No pudimos completar la consulta.</strong><p>{currentError} Comprueba que la API local esté disponible.</p></div><button onClick={refresh} disabled={loading}>Reintentar</button></div>}
        <div className="live-notice" role="status">{notice}</div>
        {page === 'dashboard' ? <AdminDashboardPage {...shared} reviews={data.reviews} metrics={dashboard.metrics} onRefresh={refresh} onExport={exportCsv} error={currentError} /> : <ModerationPage {...shared} reviews={moderation.reviews} onRefresh={refresh} error={currentError} />}
      </main>
      <footer className="console-footer shell dark:bg-sonar-surface dark:border-white/10">
        <div><strong>SONAR<span className="red-dot text-[#B80C09]"> •</span></strong><p className="dark:text-[#DCDCDD]/80">Un espacio para escuchar con atención.<br />Y compartir con criterio.</p></div>
        <div><a href="#dashboard" className="dark:text-sonar-text hover:text-[#B80C09] dark:hover:text-[#ff4d4a] transition-colors">Centro de control</a><a href="#moderacion" className="dark:text-sonar-text hover:text-[#B80C09] dark:hover:text-[#ff4d4a] transition-colors">Moderación de reseñas</a><a href="#explore" className="dark:text-sonar-text hover:text-[#B80C09] dark:hover:text-[#ff4d4a] transition-colors">Portal Público</a></div>
        <span className="edition dark:text-[#DCDCDD]/70">CURADO CON CRITERIO<br /><b className="dark:text-sonar-text font-bold">EDICIÓN AUDIÓFILA</b><small className="dark:text-[#DCDCDD]/50">© {new Date().getFullYear()} SONAR</small></span>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <PlayerProvider>
            <AppRouter />
            <GlobalAudioPlayer />
            <ReviewModal />
          </PlayerProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
