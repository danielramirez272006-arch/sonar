import { useEffect, useState } from 'react'
import { apiRequest } from '../../shared/services/api-client.js'
import { UserRound, ShieldCheck, Check, Inbox, ArrowUpRight } from 'lucide-react'
import { reportsFrom, sameId } from '../../shared/services/admin-data.js'
import { useTranslation } from '../../shared/context/language-context.jsx'
export function ReportsPage({ users = [], reviews = [], onUserUpdate, onSendToModeration }) {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('all')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [standalone, setStandalone] = useState([])
  useEffect(() => {
    let active = true
    const reload = () => apiRequest('/reports').then(rows => { if (active) setStandalone(Array.isArray(rows) ? rows : []) }).catch(error => { if (active) setMessage(error.message) })
    reload()
    const timer = window.setInterval(reload, 30000)
    window.addEventListener('focus', reload)
    window.addEventListener('sonar:reports-updated', reload)
    return () => { active = false; clearInterval(timer); window.removeEventListener('focus', reload); window.removeEventListener('sonar:reports-updated', reload) }
  }, [])
  const all = [...reportsFrom(users), ...standalone.map(report => ({ ...report, standalone: true }))]
  const requested = new URLSearchParams(window.location.hash.split('?')[1] || '').get('report')
  const visible = all.filter(report => (filter === 'all' || report.status === filter) && (!requested || sameId(report.id, requested)))
  async function action(report, status, send = false) {
    if (busy) return
    setBusy(true); setMessage('')
    try {
      if (report.standalone) {
        const changes = { status, updatedAt: new Date().toISOString() }
        await apiRequest(`/reports/${encodeURIComponent(report.id)}`, { method: 'PATCH', body: JSON.stringify(changes) })
        setStandalone(rows => rows.map(row => row.id === report.id ? { ...row, ...changes } : row))
        setMessage(t('admin.reports.updated'))
        return
      }
      const user = users.find(item => sameId(item.id, report.userId))
      if (send && report.contentType === 'review' && report.contentId && reviews.some(review => sameId(review.id, report.contentId))) await onSendToModeration(report.contentId)
      const next = (user.conductReports || []).map(item => item.id === report.id ? { ...item, status, updatedAt: new Date().toISOString() } : item)
      await onUserUpdate(user.id, { conductReports: next })
      if (send) window.location.assign(report.contentType === 'review' && report.contentId && reviews.some(review => sameId(review.id, report.contentId)) ? `#admin-reviews?review=${encodeURIComponent(report.contentId)}` : `#usuarios?user=${encodeURIComponent(report.userId)}`)
      setMessage(send ? t('admin.reports.reviewedNotice') : t('admin.reports.updated'))
    } catch (error) { setMessage(error.message) } finally { setBusy(false) }
  }
  return <section className="admin-panel reports-workspace" aria-labelledby="reports-title">
    <header className="reports-heading">
      <div><span className="reports-eyebrow">{t('admin.reports.eyebrow')}</span><h1 id="reports-title">{t('admin.reports.title')}</h1><p>{t('admin.reports.description')}</p></div>
      <div className="reports-pending"><span className="reports-pending__dot" aria-hidden="true" /><strong>{all.filter(report => report.status === 'pending').length}</strong> {t('admin.reports.pendingCount')}</div>
    </header>
    <div className="reports-toolbar">
      <div className="admin-filters reports-filters" role="group" aria-label={t('admin.reports.filter')}>{[['all', t('admin.reports.all')], ['pending', t('admin.reports.pending')], ['reviewed', t('admin.reports.reviewed')], ['resolved', t('admin.reports.resolved')]].map(([key, label]) => <button key={key} aria-pressed={filter === key} onClick={() => setFilter(key)}>{label}<span>{all.filter(report => key === 'all' || report.status === key).length}</span></button>)}</div>
      {requested && <a className="reports-all" href="#admin-reports" onClick={() => setFilter('all')}>{t('admin.reports.viewAll')} <ArrowUpRight size={16} aria-hidden="true" /></a>}
    </div>
    {message && <p className="reports-notice" role="status">{message}</p>}
    {!visible.length && <div className="reports-empty"><span className="reports-empty__icon"><Inbox size={28} strokeWidth={1.5} aria-hidden="true" /></span><h2>{!all.length ? t('admin.reports.emptyTitle') : t('admin.reports.emptyFiltered')}</h2><p>{!all.length ? t('admin.reports.emptyDescription') : t('admin.reports.tryOther')}</p>{!!all.length && filter !== 'all' && <button className="reports-reset" onClick={() => setFilter('all')}>{t('admin.reports.showAllStates')}</button>}</div>}
    {visible.map(report => <article className="admin-report" key={`${report.userId}-${report.id}`}><h3>{report.userName}</h3><p>{report.reason}</p>{report.contentSnapshot && <blockquote className="reports-notice"><strong>{t('admin.reports.reportedContent')}</strong><p>{report.contentSnapshot}</p></blockquote>}<div className="admin-profile-facts"><span>{t('admin.reports.reporter')} {users.find(user => sameId(user.id, report.reporterId))?.username || report.reporterName || t('admin.users.noDate')}</span><span>{t('admin.reports.content')} {{ review: t('admin.conduct.review'), comment: t('admin.reports.comment'), reply: t('admin.reports.reply') }[report.contentType] || t('admin.reports.profile')}</span><span>{report.createdAt ? new Date(report.createdAt).toLocaleString() : t('admin.reports.noDate')}</span><span>{all.filter(item => sameId(item.userId, report.userId)).length} {t('admin.reports.accumulated')}</span><span>{t('admin.reports.status')} {t(`admin.conduct.status.${report.status}`, { defaultValue: t('admin.reports.pending') })}</span></div><div className="report-actions">
      <div className="report-actions__group">
        {report.userId != null && <a className="report-action" href={`#usuarios?user=${encodeURIComponent(report.userId)}`}><UserRound size={16} aria-hidden="true" /><span>{t('admin.reports.viewUser')}</span></a>}
      </div>
      <div className="report-actions__group report-actions__group--decisions">
        <button className="report-action report-action--moderate" disabled={busy || report.status === 'resolved'} onClick={() => action(report, 'reviewed', true)}><ShieldCheck size={16} aria-hidden="true" /><span>{report.standalone ? t('admin.reports.markReviewed') : t('admin.reports.sendModeration')}</span></button>
        <button className="report-action report-action--resolve" disabled={busy || report.status === 'resolved'} onClick={() => action(report, 'resolved')}><Check size={16} aria-hidden="true" /><span>{t('admin.reports.resolve')}</span></button>
      </div>
    </div></article>)}
  </section>
}
