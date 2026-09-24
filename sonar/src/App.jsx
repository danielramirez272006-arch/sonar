import { ReportsPage } from './pages/admin/reports-page.jsx'
import { dashboardMetrics } from './shared/services/admin-data.js'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ConsoleSearch } from './features/admin/console-search.jsx'
import { ModerationTable } from './features/admin/moderation/components/moderation-table.jsx'
import { BrowserRouter } from 'react-router-dom'
import { getReviews, getUsers, updateUser, updateReview } from './shared/services/api-client.js'
import { analyzeReview } from './shared/services/ia-service.js'
import { useAdminDashboard, useModeration } from './features/admin/index.js'
import { AdminDashboardPage } from './pages/admin/admin-dashboard-page.jsx'
import { ModerationPage } from './pages/admin/moderation-page.jsx'
import { UsersPage } from './pages/admin/users-page.jsx'
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
  const routeParams = new URLSearchParams(window.location.hash.split('?')[1] || '')
  const [page, setPage] = useState(() => window.location.hash === '#moderacion' ? 'moderacion' : window.location.hash.split('?')[0] === '#usuarios' ? 'usuarios' : window.location.hash.startsWith('#admin-reports') ? 'reports' : window.location.hash.startsWith('#admin-reviews') ? 'reviews' : 'dashboard')
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
      if (!['#dashboard', '#moderacion', '#usuarios', '#admin', ''].includes(window.location.hash)) return
      setPage(window.location.hash === '#moderacion' ? 'moderacion' : window.location.hash.split('?')[0] === '#usuarios' ? 'usuarios' : 'dashboard')
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

  async function handleUserUpdate(userId, changes) {
    const updatedUser = await updateUser(userId, changes)
    setData(previous => ({ ...previous, users: previous.users.map(user => user.id === userId ? updatedUser : user) }))
    setNotice('Perfil de usuario actualizado.')
    return updatedUser
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

  async function sendToModeration(id) {
    await updateReview(id, { status: 'pending_moderation' })
    await Promise.all([loadData(), moderation.refresh()])
  }

  const loading = busy || dashboard.isLoading || moderation.isLoading
  const currentError = error || dashboard.error || moderation.error
  const shared = { users: data.users, query, busy: loading, onAction: handleAction, analyses, onUserUpdate: handleUserUpdate }
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
          <ConsoleSearch users={data.users} reviews={data.reviews} query={query} setQuery={setQuery} inputRef={searchRef} />
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
            <a href="#admin-reports" aria-current={page === 'reports' ? 'page' : undefined}>Reportes</a>
            <a href="#usuarios" aria-current={page === 'usuarios' ? 'page' : undefined}>Usuarios</a>
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
        {currentError && <div className="error-banner" role="alert"><div><strong>No pudimos completar la consulta.</strong><p>{currentError} Comprueba que la API local esté disponible.</p></div><button onClick={refresh} disabled={loading}>Reintentar</button></div>}
        <div className="live-notice" role="status">{notice}</div>
        {page === 'reports' ? <ReportsPage users={data.users} reviews={data.reviews} onUserUpdate={handleUserUpdate} onSendToModeration={sendToModeration} /> : page === 'reviews' ? <ModerationTable key={window.location.hash} {...shared} compact={!routeParams.has('review')} reviews={routeParams.get('review') ? data.reviews.filter(review => String(review.id) === routeParams.get('review')) : data.reviews} initialFilter={routeParams.get('filter') || 'all'} /> : page === 'dashboard' ? <AdminDashboardPage {...shared} reviews={data.reviews} metrics={dashboardMetrics(data.users, data.reviews)} onRefresh={refresh} onExport={exportCsv} error={currentError} /> : page === 'usuarios' ? <UsersPage reviews={data.reviews} initialUserId={routeParams.get('user')} users={data.users} onUserUpdate={handleUserUpdate} /> : <ModerationPage {...shared} allReviews={data.reviews} reviews={moderation.reviews} onRefresh={refresh} error={currentError} />}
      </main>
      <footer className="console-footer">
        <div className="console-footer__inner shell">
          <div className="console-footer__brand">
            <a href="#explore" className="console-footer__logo" aria-label="Sonar · Ir al portal público"><AnimatedLogo /></a>
            <p>Un espacio para escuchar con atención.<br />Y compartir con criterio.</p>
          </div>
          <nav className="console-footer__links" aria-label="Enlaces del pie de página">
            <a href="#dashboard">Centro de control</a>
            <a href="#moderacion">Moderación de reseñas</a>
            <a href="#explore">Portal Público</a>
          </nav>
          <div className="edition">CURADO CON CRITERIO<br /><b>EDICIÓN AUDIÓFILA</b><small>© {new Date().getFullYear()} SONAR</small></div>
        </div>
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
