import { useUIText } from '../../shared/i18n/use-ui-text.js';
import { useRef, useState } from 'react'
import { useTranslation } from '../../shared/context/language-context.jsx'
import { useAuth } from '../../shared/context/auth-context.jsx'
import { ShieldCheck, Shield, AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react'

const ICONS = [ShieldCheck, Shield, AlertCircle, AlertTriangle, ShieldAlert]

export function ConductIndicator({ user, reviews = [], onUserUpdate }) {
  const ui = useUIText();
  const { t } = useTranslation()
  const { user: admin } = useAuth()
  const [contentId, setContentId] = useState('')
  const reports = Array.isArray(user.conductReports) ? user.conductReports : []
  const count = reports.filter(report => report.status !== 'dismissed').length
  const level = count === 0 ? 0 : count < 4 ? 1 : count < 7 ? 2 : count < 10 ? 3 : 4
  const Icon = ICONS[level]
  const labels = [t('admin.conduct.level.none'), t('admin.conduct.level.review'), t('admin.conduct.level.multiple'), t('admin.conduct.level.priority'), t('admin.conduct.level.high')]
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const lock = useRef(false)

  async function save(nextReports, success) {
    if (lock.current) return false
    lock.current = true
    setBusy(true)
    setMessage('')
    try {
      await onUserUpdate(user.id, { conductReports: nextReports })
      setMessage(t(success))
      return true
    } catch (error) {
      setMessage(error.message || t('admin.conduct.saveError'))
      return false
    } finally {
      lock.current = false
      setBusy(false)
    }
  }

  async function addReport(event) {
    event.preventDefault()
    if (!reason.trim()) return
    const report = { id: crypto.randomUUID(), reason: reason.trim(), createdAt: new Date().toISOString(), status: 'pending', reporterId: admin?.id, reporterName: admin?.username || 'Administrador', contentType: contentId ? 'review' : 'profile', contentId: contentId || null, contentSnapshot: reviews.find(review => String(review.id) === contentId)?.content || null }
    if (await save([...reports, report], 'admin.conduct.saved')) setReason('')
  }

  return <section className={`conduct-card conduct-card--${level}`} aria-label={t('admin.conduct.title')}>
    <div className="conduct-card__summary">
      <span className="conduct-card__face" role="img" aria-label={['Cara feliz', 'Cara preocupada', 'Cara seria', 'Cara molesta', 'Cara enojada'][level]}>
        <Icon size={28} strokeWidth={2.3} />
      </span>
      <div><h3>{t('admin.conduct.title')}</h3><strong>{labels[level]}</strong><p>{count} {t(count === 1 ? 'admin.conduct.report.one' : 'admin.conduct.report.many')}</p></div>
    </div>
    <meter min="0" max="10" value={Math.min(count, 10)} aria-label={ui("{{value0}} reportes; nivel máximo del indicador a partir de 10", { value0: count })} />
    <p className="conduct-card__note">{t('admin.conduct.note')}</p>
    <details><summary>{t('admin.conduct.reportHistory')} ({reports.length})</summary>
      {reports.length ? <ul>{reports.map(report => <li key={report.id}><div><strong>{report.reason}</strong><small>{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : ''} · {t(`admin.conduct.status.${report.status}`, { defaultValue: t('admin.conduct.pendingReview') })}</small></div>{report.status !== 'dismissed' && <button type="button" disabled={busy} onClick={() => save(reports.map(item => item.id === report.id ? { ...item, status: 'dismissed' } : item), 'admin.conduct.dismissedNotice')}>{t('admin.conduct.dismiss')}</button>}</li>)}</ul> : <p>{t('admin.conduct.noReports')}</p>}
    </details>
    <form onSubmit={addReport}><h3>{t('admin.conduct.newReport')}</h3><p className="action-help">{t('admin.conduct.newReportHelp')}</p><label>{t('admin.conduct.reportedContent')}<select disabled={busy} value={contentId} onChange={event => setContentId(event.target.value)}><option value="">{t('admin.conduct.userProfile')}</option>{reviews.map(review => <option key={review.id} value={review.id}>{t('admin.conduct.review')} #{review.id} · {(review.content || '').slice(0, 55)}</option>)}</select></label>
      <label htmlFor={`conduct-reason-${user.id}`}>{t('admin.conduct.reportLabel')}</label>
      <textarea id={`conduct-reason-${user.id}`} value={reason} onChange={event => setReason(event.target.value)} required maxLength={1000} rows={2} placeholder={t('admin.conduct.reportPlaceholder')} disabled={busy} />
      {!reason.trim() && <p className="action-help">{t('admin.conduct.reasonRequired')}</p>}<button className="admin-action-primary" type="submit" disabled={busy || !reason.trim()}>{busy ? t('admin.sanctions.saving') : t('admin.conduct.submit')}</button>
    </form>
    {message && <p role="status">{message}</p>}
  </section>
}
