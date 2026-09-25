import { apiRequest } from './api-client.js'

export async function submitCommunityReport({ authorId, authorName, reporter, contentId, contentType, contentSnapshot, reason, tags = [], reviewId }) {
  if (!reporter?.id || !contentId || !reason?.trim()) throw new Error('Faltan datos para enviar el reporte.')
  let author
  if (authorId != null) {
    const matches = await apiRequest(`/users?${new URLSearchParams({ id: authorId })}`)
    author = matches?.[0]
  }
  else {
    const matches = await apiRequest(`/users?${new URLSearchParams({ username: authorName || '' })}`)
    if (matches?.length === 1) author = matches[0]
  }
  if (!author?.id) {
    const existing = await apiRequest(`/reports?${new URLSearchParams({ contentId, contentType, reporterId: reporter.id, status: 'pending' })}`)
    if (existing.length) throw new Error('Ya tienes un reporte pendiente sobre este contenido.')
    const report = { id: crypto.randomUUID(), userId: null, userName: authorName || 'Autor sin cuenta vinculada', reporterId: reporter.id, reporterName: reporter.username, contentId, contentType, contentSnapshot, reason: reason.trim(), tags, reviewId, status: 'pending', createdAt: new Date().toISOString() }
    await apiRequest('/reports', { method: 'POST', body: JSON.stringify(report) })
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('sonar:reports-updated'))
    return report
  }
  const reports = (author.conductReports || []).filter(Boolean)
  if (reports.some(report => String(report.contentId) === String(contentId) && report.contentType === contentType && String(report.reporterId) === String(reporter.id) && report.status === 'pending')) {
    throw new Error('Ya tienes un reporte pendiente sobre este contenido.')
  }
  const report = { id: crypto.randomUUID(), reporterId: reporter.id, reporterName: reporter.username, contentId, contentType, contentSnapshot, reason: reason.trim(), tags, reviewId, status: 'pending', createdAt: new Date().toISOString() }
  await apiRequest(`/users/${encodeURIComponent(author.id)}`, { method: 'PATCH', body: JSON.stringify({ conductReports: [...reports, report] }) })
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('sonar:reports-updated'))
  return report
}
