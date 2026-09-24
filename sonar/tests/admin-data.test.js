import { expect, it } from 'vitest'
import { adminEvents, behaviorInput, dashboardMetrics, sanctionChanges, userStatus, weekActivity } from '../src/shared/services/admin-data.js'
it('expires temporary sanctions and preserves permanent bans', () => {
  expect(userStatus({ status: 'suspended', suspendedUntil: '2020-01-01' })).toBe('active')
  expect(userStatus({ status: 'banned', suspendedUntil: '2020-01-01' })).toBe('banned')
})
it('records the administrator, reason and duration and preserves revoked history', () => {
  const user = { id: '1', role: 'user' }
  const change = sanctionChanges(user, { type: 'suspend', reason: 'Insultos reiterados', days: 7 }, { id: 'admin', username: 'Admin' }, new Date('2026-09-23T12:00:00Z'))
  expect(change.suspendedUntil).toBe('2026-09-30T12:00:00.000Z')
  expect(change.sanctions[0]).toMatchObject({ adminId: 'admin', userId: '1', status: 'active', reason: 'Insultos reiterados' })
  const removed = sanctionChanges({ ...user, ...change }, { type: 'remove', reason: 'Apelación aceptada' }, { id: 'admin' })
  expect(removed.status).toBe('active')
  expect(removed.sanctions[0]).toMatchObject({ status: 'revoked', removalReason: 'Apelación aceptada' })
})
it('rejects invalid sanctions and protects administrators', () => {
  expect(() => sanctionChanges({ role: 'admin' }, { type: 'ban', reason: 'x' })).toThrow()
  expect(() => sanctionChanges({ role: 'user' }, { type: 'mute', reason: 'x', days: -1 })).toThrow()
})
it('counts actual records and does not invent dates for legacy data', () => {
  const users = [{ id: 1, conductReports: [{ id: 'r', status: 'pending' }, { id: 'd', status: 'dismissed' }], sanctions: [] }]
  const reviews = [{ id: 2, userId: '1', status: 'rejected', aiFlagged: true }]
  expect(dashboardMetrics(users, reviews)).toMatchObject({ pendingReports: 1, newUsers: 0, flaggedReviews: 1 })
  expect(adminEvents(users, reviews)).toEqual([])
  expect(behaviorInput(users[0], reviews)).toMatchObject({ rejectedReviews: 1, flaggedContent: 1, publicationsLast7Days: 0 })
})
it('groups events by local calendar day and excludes future and old events', () => {
  const now = new Date(2026, 8, 23, 12)
  const events = [{ type: 'reports', at: new Date(2026, 8, 23, 10).toISOString() }, { type: 'reports', at: new Date(2026, 8, 24, 10).toISOString() }, { type: 'reviews', at: new Date(2026, 8, 1).toISOString() }]
  const days = weekActivity(events, now)
  expect(days).toHaveLength(7)
  expect(days[6].reports).toBe(1)
  expect(days.reduce((sum, day) => sum + day.reviews, 0)).toBe(0)
})
