export const sameId = (a, b) => a != null && b != null && String(a) === String(b)
export function userStatus(user, now = Date.now()) {
  if (user.status === 'banned') return 'banned'
  if (user.status === 'suspended' && (!user.suspendedUntil || Date.parse(user.suspendedUntil) > now)) return 'suspended'
  if (Date.parse(user.mutedUntil) > now) return 'muted'
  return 'active'
}
export const statusLabels = { active: 'Activo', muted: 'Silenciado', suspended: 'Suspendido', banned: 'Baneado' }
export function reportsFrom(users) {
  return users.flatMap(user => (user.conductReports || []).map(report => ({ ...report, userId: user.id, userName: user.username, status: report.status === 'dismissed' ? 'resolved' : report.status || 'pending' })))
}
export function behaviorInput(user, reviews, now = Date.now()) {
  const own = reviews.filter(review => sameId(review.userId, user.id))
  return { reportCount: (user.conductReports || []).filter(report => report.status !== 'dismissed').length, previousSanctions: user.sanctions || [], publicationsLast7Days: own.filter(review => Date.parse(review.createdAt) >= now - 7 * 86400000 && Date.parse(review.createdAt) <= now).length, flaggedContent: own.filter(review => review.aiFlagged).length, rejectedReviews: own.filter(review => review.status === 'rejected').length }
}
export function adminEvents(users, reviews) {
  const events = []
  for (const user of users) {
    const href = `#usuarios?user=${encodeURIComponent(user.id)}`
    if (user.createdAt) events.push({ id: `user-${user.id}`, userId: user.id, at: user.createdAt, type: 'users', text: `${user.username} se registró`, href })
    for (const report of user.conductReports || []) events.push({ id: `report-${user.id}-${report.id}`, userId: user.id, at: report.createdAt, type: 'reports', text: `Reporte sobre ${user.username}: ${report.reason}`, href: `#admin-reports?report=${encodeURIComponent(report.id)}` })
    for (const sanction of user.sanctions || []) {
      events.push({ id: `sanction-${sanction.id}`, userId: user.id, at: sanction.createdAt, type: 'sanctions', text: `${sanction.type}: ${user.username} · ${sanction.reason}`, href })
      if (sanction.revokedAt) events.push({ id: `revoke-${sanction.id}`, userId: user.id, at: sanction.revokedAt, type: 'sanctions', text: `Sanción retirada a ${user.username}`, href })
    }
  }
  for (const review of reviews) {
    const href = `#admin-reviews?review=${encodeURIComponent(review.id)}`
    if (review.createdAt) events.push({ id: `review-${review.id}`, userId: review.userId, at: review.createdAt, type: 'reviews', text: `Nueva reseña #${review.id}`, href })
    for (const action of review.moderationHistory || []) events.push({ id: `moderation-${action.id}`, userId: review.userId, at: action.createdAt, type: 'moderations', text: `Reseña #${review.id}: ${action.aiFlagged ? 'contenido marcado' : action.status === 'approved' ? 'aprobada' : action.status === 'rejected' ? 'rechazada' : 'enviada a moderación'}`, href })
  }
  return events.filter(event => Number.isFinite(Date.parse(event.at))).sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
}
export function weekActivity(events, now = new Date()) {
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(now); day.setHours(0, 0, 0, 0); day.setDate(day.getDate() - 6 + index)
    const end = new Date(day); end.setDate(end.getDate() + 1)
    const selected = events.filter(event => Date.parse(event.at) >= +day && Date.parse(event.at) < +end && Date.parse(event.at) <= +now)
    return { day: day.toLocaleDateString('es', { weekday: 'short', day: 'numeric' }), ...Object.fromEntries(['reviews', 'users', 'reports', 'moderations'].map(type => [type, selected.filter(event => event.type === type).length])) }
  })
}
export function dashboardMetrics(users, reviews) {
  const now = Date.now()
  return { totalUsers: users.length, totalReviews: reviews.length, pendingReviews: reviews.filter(r => r.status === 'pending_moderation').length, flaggedReviews: reviews.filter(r => r.aiFlagged).length, approvedReviews: reviews.filter(r => r.status === 'approved').length, rejectedReviews: reviews.filter(r => r.status === 'rejected').length, newUsers: users.filter(u => Date.parse(u.createdAt) >= now - 7 * 86400000 && Date.parse(u.createdAt) <= now).length, pendingReports: reportsFrom(users).filter(r => r.status === 'pending').length, sanctionedUsers: users.filter(u => userStatus(u) !== 'active').length }
}
export function sanctionChanges(user, { type, reason, days }, admin, now = new Date()) {
  if (user.role === 'admin') throw new Error('No se pueden sancionar cuentas administradoras.')
  if (!reason.trim()) throw new Error('Escribe el motivo de la acción.')
  if (!['mute', 'suspend', 'ban', 'remove'].includes(type)) throw new Error('Acción inválida.')
  if (['mute', 'suspend'].includes(type) && (!Number.isFinite(Number(days)) || Number(days) < 1 || Number(days) > 365)) throw new Error('La duración debe estar entre 1 y 365 días.')
  const createdAt = now.toISOString()
  const history = (user.sanctions || []).map(item => item.status === 'active' ? { ...item, status: 'revoked', revokedAt: createdAt, revokedBy: admin?.id, removalReason: reason.trim() } : item)
  const until = ['mute', 'suspend'].includes(type) ? new Date(+now + Number(days) * 86400000).toISOString() : null
  if (type !== 'remove') history.push({ id: crypto.randomUUID(), userId: user.id, type, reason: reason.trim(), durationDays: until ? Number(days) : null, createdAt, expiresAt: until, adminId: admin?.id || 'unknown', adminName: admin?.username || 'Administrador', status: 'active' })
  return { status: type === 'ban' ? 'banned' : type === 'suspend' ? 'suspended' : 'active', mutedUntil: type === 'mute' ? until : null, suspendedUntil: type === 'suspend' ? until : null, sanctions: history }
}
