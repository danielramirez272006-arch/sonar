import { useState } from 'react'
import { useTranslation } from '../../shared/context/language-context.jsx'
import { useAuth } from '../../shared/context/auth-context.jsx'
import { sanctionChanges } from '../../shared/services/admin-data.js'
export function SanctionPanel({ user, onUserUpdate }) {
  const { t } = useTranslation()
  const { user: admin } = useAuth()
  const [now] = useState(() => Date.now())
  const [type, setType] = useState('mute')
  const [reason, setReason] = useState('')
  const [days, setDays] = useState(7)
  const [confirm, setConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const actions = [
    ['mute', t('admin.sanctions.action.mute'), t('admin.sanctions.action.muteHelp')],
    ['suspend', t('admin.sanctions.action.suspend'), t('admin.sanctions.action.suspendHelp')],
    ['ban', t('admin.sanctions.action.ban'), t('admin.sanctions.action.banHelp')],
    ['remove', t('admin.sanctions.action.remove'), t('admin.sanctions.action.removeHelp')],
  ]
  async function submit(event) {
    event.preventDefault()
    if (busy) return
    if (!confirm) { setConfirm(true); return }
    setBusy(true)
    try { await onUserUpdate(user.id, sanctionChanges(user, { type, reason, days }, admin)); setMessage(t('admin.sanctions.saveHistory')); setReason(''); setConfirm(false) }
    catch (error) { setMessage(error.message) }
    finally { setBusy(false) }
  }
  return <section className="admin-panel sanction-panel"><h3>{t('admin.sanctions.title')}</h3><p className="action-help">{t('admin.sanctions.help', { username: user.username })}</p><form onSubmit={submit} className="admin-form">
    <fieldset disabled={busy || user.role === 'admin'}><legend>{t('admin.sanctions.choose')}</legend><div className="sanction-options">{actions.map(([value, label, description]) => <label className="sanction-option" key={value}><input type="radio" name={`sanction-${user.id}`} value={value} checked={type === value} onChange={() => { setType(value); setConfirm(false) }} /><span><strong>{label}</strong><small>{description}</small></span></label>)}</div>
    {['mute', 'suspend'].includes(type) && <label>{t('admin.sanctions.duration')}<input type="number" min="1" max="365" required value={days} onChange={e => { setDays(e.target.value); setConfirm(false) }} /></label>}
    <label>{t('admin.sanctions.reason')}<textarea required maxLength={1000} rows={3} placeholder={t('admin.sanctions.reasonPlaceholder')} value={reason} onChange={e => { setReason(e.target.value); setConfirm(false) }} /></label>
    <div className="sanction-preview" role={confirm ? 'alert' : undefined}><strong>{confirm ? t('admin.sanctions.confirm') : t('admin.sanctions.summary')}</strong><p>{actions.find(action => action[0] === type)[1]} · {user.username}{['mute', 'suspend'].includes(type) ? ` · ${days || '—'} ${t('admin.sanctions.durationUnit')}` : type === 'ban' ? ` · ${t('admin.sanctions.indefinite')}` : ''}</p>{confirm && <p>{t('admin.sanctions.reason')}: {reason}</p>}</div>
    <div className="decision-buttons"><button className="admin-action-primary" type="submit" disabled={!reason.trim()}>{busy ? t('admin.sanctions.saving') : confirm ? t('admin.sanctions.confirmAction') : t('admin.sanctions.reviewAction')}</button>{confirm && <button className="admin-action-secondary" type="button" onClick={() => setConfirm(false)}>{t('admin.sanctions.cancel')}</button>}</div></fieldset>
    </form>{user.role === 'admin' && <p>{t('admin.sanctions.protected')}</p>}{message && <p role="status">{message}</p>}
    <h3 className="sanction-history-heading">{t('admin.sanctions.history')}</h3>{!(user.sanctions || []).length && <p>{t('admin.sanctions.empty')}</p>}
    {(user.sanctions || []).slice().reverse().map(item => <article className="admin-history" key={item.id}><strong>{t(`admin.sanctions.action.${item.type}`, { defaultValue: item.type })} · {t(`admin.sanctions.status.${item.status === 'active' && item.expiresAt && Date.parse(item.expiresAt) <= now ? 'expired' : item.status}`, { defaultValue: item.status })}</strong><p>{item.reason}</p><small>{new Date(item.createdAt).toLocaleString()} · {item.durationDays ? `${item.durationDays} ${t('admin.sanctions.durationUnit')}` : t('admin.sanctions.indefinite')} · {item.adminName}</small>{item.removalReason && <p>{t('admin.sanctions.removed')}: {item.removalReason}</p>}</article>)}
    </section>
}
