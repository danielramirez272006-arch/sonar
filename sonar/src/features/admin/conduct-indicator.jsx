import { useRef, useState } from 'react'
import { useAuth } from '../../shared/context/auth-context.jsx'

export function ConductIndicator({ user, reviews = [], onUserUpdate }) {
  const { user: admin } = useAuth()
  const [contentId, setContentId] = useState('')
  const reports = Array.isArray(user.conductReports) ? user.conductReports : []
  const count = reports.filter(report => report.status !== 'dismissed').length
  const level = count === 0 ? 0 : count < 4 ? 1 : count < 7 ? 2 : count < 10 ? 3 : 4
  const faces = ['😊', '🙁', '😐', '😠', '😡']
  const labels = ['Sin reportes de mala conducta', 'Reportes por revisar', 'Varios reportes recibidos', 'Atención prioritaria', '10 o más reportes recibidos']
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
      setMessage(success)
      return true
    } catch (error) {
      setMessage(error.message || 'No se pudo guardar el reporte. Inténtalo de nuevo.')
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
    if (await save([...reports, report], 'Reporte registrado.')) setReason('')
  }

  return <section className={`conduct-card conduct-card--${level}`} aria-label="Indicador de conducta">
    <div className="conduct-card__summary">
      <span className="conduct-card__face" role="img" aria-label={['Cara feliz', 'Cara preocupada', 'Cara seria', 'Cara molesta', 'Cara enojada'][level]}>{faces[level]}</span>
      <div><h3>Conducta en la comunidad</h3><strong>{labels[level]}</strong><p>{count} {count === 1 ? 'reporte no descartado' : 'reportes no descartados'}</p></div>
    </div>
    <meter min="0" max="10" value={Math.min(count, 10)} aria-label={`${count} reportes; nivel máximo del indicador a partir de 10`} />
    <p className="conduct-card__note">El indicador refleja reportes recibidos, no faltas confirmadas. Los reportes descartados no cuentan.</p>
    <details><summary>Historial de reportes ({reports.length})</summary>
      {reports.length ? <ul>{reports.map(report => <li key={report.id}><div><strong>{report.reason}</strong><small>{report.createdAt ? new Date(report.createdAt).toLocaleDateString('es') : ''} · {({ dismissed: 'Descartado', resolved: 'Resuelto', reviewed: 'Revisado' }[report.status] || 'Pendiente de revisión')}</small></div>{report.status !== 'dismissed' && <button type="button" disabled={busy} onClick={() => save(reports.map(item => item.id === report.id ? { ...item, status: 'dismissed' } : item), 'Reporte descartado.')}>Descartar</button>}</li>)}</ul> : <p>No hay reportes registrados.</p>}
    </details>
    <form onSubmit={addReport}><label>Contenido reportado<select value={contentId} onChange={event => setContentId(event.target.value)}><option value="">Perfil del usuario</option>{reviews.map(review => <option key={review.id} value={review.id}>Reseña #{review.id}</option>)}</select></label>
      <label htmlFor={`conduct-reason-${user.id}`}>Registrar reporte de mala conducta</label>
      <textarea id={`conduct-reason-${user.id}`} value={reason} onChange={event => setReason(event.target.value)} required maxLength={1000} rows={2} placeholder="Describe el motivo del reporte…" disabled={busy} />
      <button type="submit" disabled={busy || !reason.trim()}>{busy ? 'Guardando…' : 'Registrar reporte'}</button>
    </form>
    {message && <p role="status">{message}</p>}
  </section>
}
