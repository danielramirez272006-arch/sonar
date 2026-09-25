import { useState } from 'react'
import { useAuth } from '../../shared/context/auth-context.jsx'
import { sanctionChanges } from '../../shared/services/admin-data.js'
const actions = [
  ['mute', 'Silenciar usuario', 'Limitar temporalmente su participación.'],
  ['suspend', 'Suspender usuario', 'Suspender la cuenta durante un plazo.'],
  ['ban', 'Banear usuario', 'Bloquear la cuenta por tiempo indefinido.'],
  ['remove', 'Quitar sanción', 'Retirar las restricciones vigentes.'],
]
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
  return <section className="admin-panel sanction-panel"><h3>Sanciones y decisiones</h3><p className="action-help">Elige qué necesitas hacer con la cuenta de {user.username}. Podrás revisar la decisión antes de guardarla.</p><form onSubmit={submit} className="admin-form">
    <fieldset disabled={busy || user.role === 'admin'}><legend>1. Elige una acción</legend><div className="sanction-options">{actions.map(([value, label, description]) => <label className="sanction-option" key={value}><input type="radio" name={`sanction-${user.id}`} value={value} checked={type === value} onChange={() => { setType(value); setConfirm(false) }} /><span><strong>{label}</strong><small>{description}</small></span></label>)}</div>
    {['mute', 'suspend'].includes(type) && <label>Duración en días<input type="number" min="1" max="365" required value={days} onChange={e => { setDays(e.target.value); setConfirm(false) }} /></label>}
    <label>Motivo<textarea required maxLength={1000} rows={3} placeholder="Explica qué ocurrió y por qué corresponde esta decisión…" value={reason} onChange={e => { setReason(e.target.value); setConfirm(false) }} /></label>
    <div className="sanction-preview" role={confirm ? 'alert' : undefined}><strong>{confirm ? 'Confirma tu decisión' : 'Resumen de la acción'}</strong><p>{actions.find(action => action[0] === type)[1]} · {user.username}{['mute', 'suspend'].includes(type) ? ` · ${days || '—'} días` : type === 'ban' ? ' · Sin fecha de finalización' : ''}</p>{confirm && <p>Motivo: {reason}</p>}</div>
    <div className="decision-buttons"><button className="admin-action-primary" type="submit" disabled={!reason.trim()}>{busy ? 'Guardando…' : confirm ? 'Confirmar acción' : 'Revisar acción'}</button>{confirm && <button className="admin-action-secondary" type="button" onClick={() => setConfirm(false)}>Cancelar</button>}</div></fieldset>
    </form>{user.role === 'admin' && <p>Las cuentas administradoras están protegidas.</p>}{message && <p role="status">{message}</p>}
    <h3 className="sanction-history-heading">Historial de sanciones</h3>{!(user.sanctions || []).length && <p>Sin sanciones registradas.</p>}
    {(user.sanctions || []).slice().reverse().map(item => <article className="admin-history" key={item.id}><strong>{item.type} · {item.status === 'active' && item.expiresAt && Date.parse(item.expiresAt) <= now ? 'expired' : item.status}</strong><p>{item.reason}</p><small>{new Date(item.createdAt).toLocaleString('es')} · {item.durationDays ? `${item.durationDays} días` : 'Indefinida'} · {item.adminName}</small>{item.removalReason && <p>Retirada: {item.removalReason}</p>}</article>)}
    </section>
}
