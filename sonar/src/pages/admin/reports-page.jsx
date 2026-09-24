import { useState } from 'react'
import { UserRound, ShieldCheck, Check, Inbox, ArrowUpRight } from 'lucide-react'
import { reportsFrom, sameId } from '../../shared/services/admin-data.js'
export function ReportsPage({ users = [], reviews = [], onUserUpdate, onSendToModeration }) {
  const [filter, setFilter] = useState('all')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const all = reportsFrom(users)
  const requested = new URLSearchParams(window.location.hash.split('?')[1] || '').get('report')
  const visible = all.filter(report => (filter === 'all' || report.status === filter) && (!requested || sameId(report.id, requested)))
  async function action(report, status, send = false) {
    if (busy) return
    setBusy(true); setMessage('')
    try {
      const user = users.find(item => sameId(item.id, report.userId))
      if (send && report.contentId && reviews.some(review => sameId(review.id, report.contentId))) await onSendToModeration(report.contentId)
      const next = (user.conductReports || []).map(item => item.id === report.id ? { ...item, status, updatedAt: new Date().toISOString() } : item)
      await onUserUpdate(user.id, { conductReports: next })
      if (send) window.location.assign(report.contentId && reviews.some(review => sameId(review.id, report.contentId)) ? `#admin-reviews?review=${encodeURIComponent(report.contentId)}` : `#usuarios?user=${encodeURIComponent(report.userId)}`)
      setMessage(send ? 'Reporte revisado. Abre el contenido o el usuario para continuar la moderación.' : 'Reporte actualizado.')
    } catch (error) { setMessage(error.message) } finally { setBusy(false) }
  }
  return <section className="admin-panel reports-workspace" aria-labelledby="reports-title">
    <header className="reports-heading">
      <div><span className="reports-eyebrow">COMUNIDAD · MODERACIÓN</span><h1 id="reports-title">Reportes de la comunidad</h1><p>Revisa el contexto y decide el siguiente paso.</p></div>
      <div className="reports-pending"><span className="reports-pending__dot" aria-hidden="true" /><strong>{all.filter(report => report.status === 'pending').length}</strong> pendientes</div>
    </header>
    <div className="reports-toolbar">
      <div className="admin-filters reports-filters" role="group" aria-label="Filtrar reportes por estado">{[['all', 'Todos'], ['pending', 'Pendientes'], ['reviewed', 'Revisados'], ['resolved', 'Resueltos']].map(([key, label]) => <button key={key} aria-pressed={filter === key} onClick={() => setFilter(key)}>{label}<span>{all.filter(report => key === 'all' || report.status === key).length}</span></button>)}</div>
      {requested && <a className="reports-all" href="#admin-reports" onClick={() => setFilter('all')}>Ver todos los reportes <ArrowUpRight size={16} aria-hidden="true" /></a>}
    </div>
    {message && <p className="reports-notice" role="status">{message}</p>}
    {!visible.length && <div className="reports-empty"><span className="reports-empty__icon"><Inbox size={28} strokeWidth={1.5} aria-hidden="true" /></span><h2>{!all.length ? 'Todo en orden por aquí' : 'Sin reportes en esta selección'}</h2><p>{!all.length ? 'Cuando la comunidad envíe un reporte, podrás revisarlo y gestionarlo desde aquí.' : 'Prueba otro estado para consultar los reportes de la comunidad.'}</p>{!!all.length && filter !== 'all' && <button className="reports-reset" onClick={() => setFilter('all')}>Mostrar todos los estados</button>}</div>}
    {visible.map(report => <article className="admin-report" key={`${report.userId}-${report.id}`}><h3>{report.userName}</h3><p>{report.reason}</p><div className="admin-profile-facts"><span>Reportó: {users.find(user => sameId(user.id, report.reporterId))?.username || report.reporterName || 'No registrado'}</span><span>Contenido: {report.contentType || 'Perfil'}</span><span>{report.createdAt ? new Date(report.createdAt).toLocaleString('es') : 'Sin fecha'}</span><span>{all.filter(item => sameId(item.userId, report.userId)).length} reportes acumulados</span><span>Estado: {{ pending: 'Pendiente', reviewed: 'Revisado', resolved: 'Resuelto' }[report.status]}</span></div><div className="report-actions">
      <div className="report-actions__group">
        <a className="report-action" href={`#usuarios?user=${encodeURIComponent(report.userId)}`}><UserRound size={16} aria-hidden="true" /><span>Ver usuario</span></a>
      </div>
      <div className="report-actions__group report-actions__group--decisions">
        <button className="report-action report-action--moderate" disabled={busy || report.status === 'resolved'} onClick={() => action(report, 'reviewed', true)}><ShieldCheck size={16} aria-hidden="true" /><span>Enviar a moderación</span></button>
        <button className="report-action report-action--resolve" disabled={busy || report.status === 'resolved'} onClick={() => action(report, 'resolved')}><Check size={16} aria-hidden="true" /><span>Resolver reporte</span></button>
      </div>
    </div></article>)}
  </section>
}
