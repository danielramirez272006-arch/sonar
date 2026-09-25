import { expect, it } from 'vitest'
import { growthStatistics } from '../src/shared/services/growth-statistics.js'
import { validateCatalog } from '../src/shared/services/catalog-service.js'
it('counts valid records and separates totals from dated registrations', () => {
  const now = new Date(2026, 8, 24, 12)
  const today = new Date(2026, 8, 24, 8).toISOString()
  const stats = growthStatistics([null, { createdAt: today }, { createdAt: 'invalid' }, { createdAt: '2020-01-01' }], [{ status: 'published', createdAt: today }, { status: 'draft', createdAt: new Date(2026, 8, 25).toISOString() }], 7, now)
  expect(stats).toMatchObject({ totalUsers: 3, totalMusic: 2, newUsers: 1, newMusic: 1, published: 1, drafts: 1, missingDates: 1 })
  expect(stats.series).toHaveLength(7)
  expect(stats.series[6]).toMatchObject({ users: 1, music: 1 })
})
it('changes the period without inventing historical events', () => {
  const now = new Date(2026, 8, 24, 12)
  const users = [{ createdAt: new Date(2026, 8, 5).toISOString() }]
  expect(growthStatistics(users, [], 7, now).newUsers).toBe(0)
  expect(growthStatistics(users, [], 30, now).newUsers).toBe(1)
})
it('requires music metadata and a valid audio URL', () => {
  const input = { title: 'Canción', artist: 'Artista', audioUrl: 'https://example.com/audio.mp3', status: 'draft' }
  expect(validateCatalog('music', input)).toMatchObject(input)
  expect(() => validateCatalog('music', { ...input, audioUrl: '' })).toThrow('audio')
  expect(() => validateCatalog('music', { ...input, audioUrl: 'javascript:alert(1)' })).toThrow('http')
})
