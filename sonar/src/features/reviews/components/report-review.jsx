import { useState } from 'react'
import { useAuth } from '../../../shared/context/auth-context.jsx'
import { submitCommunityReport } from '../../../shared/services/report-service.js'
export function ReportReview({ review }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  if (!review.userId) return null
  async function submit(event) {
    event.preventDefault()
    if (!user) { window.location.hash = '#login'; return }
    if (busy || !reason.trim()) return
    setBusy(true)
    try {
      await submitCommunityReport({ authorId: review.userId, reporter: user, contentType: 'review', contentId: review.id, contentSnapshot: review.content, reason })
      setMessage('Reporte enviado para revisión.'); setOpen(false); setReason('')
    } catch (error) { setMessage(error.message) } finally { setBusy(false) }
  }
  return <div><button type="button" onClick={() => setOpen(!open)}>Reportar reseña</button>{open && <form onSubmit={submit} className="admin-form"><label>Motivo del reporte<textarea required maxLength={1000} value={reason} onChange={e => setReason(e.target.value)} /></label><button disabled={busy}>{busy ? 'Enviando…' : 'Enviar reporte'}</button><button type="button" onClick={() => setOpen(false)}>Cancelar</button></form>}{message && <p role="status">{message}</p>}</div>
}
