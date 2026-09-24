import { useState } from 'react'
import { useAuth } from '../../shared/context/auth-context.jsx'
import { sanctionChanges } from '../../shared/services/admin-data.js'
export function SanctionPanel({ user, onUserUpdate }) {
  const { user: admin } = useAuth()
  const [now] = useState(() => Date.now())
  const [type, setType] = useState('mute')
  const [reason, setReason] = useState('')
  const [days, setDays] = useState(7)
  const [confirm, setConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  async function submit(event) {
    event.preventDefault()
    if (busy) return
    if (!confirm) { setConfirm(true); return }
    setBusy(true)
    try { await onUserUpdate(user.id, sanctionChanges(user, { type, reason, days }, admin)); setMessage('Acción guardada en el historial.'); setReason(''); setConfirm(false) }
    catch (error) { setMessage(error.message) }
    finally { setBusy(false) }
  }
  return <section className="admin-panel"><h3>Sanciones y decisiones</h3><form onSubmit={submit} className="admin-form">
    <fieldset disabled={busy || user.role === 'admin'}><label>Acción<select value={type} onChange={e => { setType(e.target.value); setConfirm(false) }}><option value="mute">Silenciar usuario</option><option value="suspend">Suspender usuario</option><option value="ban">Banear usuario</option><option value="remove">Quitar sanción</option></select></label>
    {['mute', 'suspend'].includes(type) && <label>Duración en días<input type="number" min="1" max="365" required value={days} onChange={e => { setDays(e.target.value); setConfirm(false) }} /></label>}
    <label>Motivo<textarea required maxLength={1000} value={reason} onChange={e => { setReason(e.target.value); setConfirm(false) }} /></label>
    {confirm && <p role="alert">Confirma la acción «{ { mute: 'Silenciar', suspend: 'Suspender', ban: 'Banear', remove: 'Quitar sanción' }[type]}» sobre {user.username}{['mute', 'suspend'].includes(type) ? ` durante ${days} días` : ''}. Motivo: {reason}</p>}
    <button type="submit">{busy ? 'Guardando…' : confirm ? 'Confirmar acción' : 'Revisar acción'}</button>{confirm && <button type="button" onClick={() => setConfirm(false)}>Cancelar</button>}</fieldset>
    </form>{user.role === 'admin' && <p>Las cuentas administradoras están protegidas.</p>}{message && <p role="status">{message}</p>}
    <h3>Historial de sanciones</h3>{!(user.sanctions || []).length && <p>Sin sanciones registradas.</p>}
    {(user.sanctions || []).slice().reverse().map(item => <article className="admin-history" key={item.id}><strong>{item.type} · {item.status === 'active' && item.expiresAt && Date.parse(item.expiresAt) <= now ? 'expired' : item.status}</strong><p>{item.reason}</p><small>{new Date(item.createdAt).toLocaleString('es')} · {item.durationDays ? `${item.durationDays} días` : 'Indefinida'} · {item.adminName}</small>{item.removalReason && <p>Retirada: {item.removalReason}</p>}</article>)}
    </section>
}
