/** @vitest-environment jsdom */
import { afterEach, expect, it, vi } from 'vitest'
import { createReview, updateReview } from '../src/shared/services/api-client.js'
afterEach(() => vi.unstubAllGlobals())
const response = data => new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } })
it('saves a real review as pending with its creation date', async () => {
  const fetch = vi.fn().mockResolvedValueOnce(response({ id: 'u', username: 'Mateo', status: 'active' })).mockResolvedValueOnce(response({ id: 'r' }))
  vi.stubGlobal('fetch', fetch)
  await createReview({ userId: 'u', albumId: '123', content: 'Mi crítica', status: 'approved' })
  expect(JSON.parse(fetch.mock.calls[1][1].body)).toMatchObject({ status: 'pending_moderation', userName: 'Mateo', createdAt: expect.any(String) })
})
it('does not post a review while a temporary sanction is active', async () => {
  const fetch = vi.fn().mockResolvedValue(response({ id: 'u', mutedUntil: new Date(Date.now() + 86400000).toISOString() }))
  vi.stubGlobal('fetch', fetch)
  await expect(createReview({ userId: 'u', content: 'x' })).rejects.toThrow('sanción activa')
  expect(fetch).toHaveBeenCalledTimes(1)
})
it('appends moderation history without deleting previous decisions', async () => {
  window.localStorage.setItem('sonar_auth_user', JSON.stringify({ id: 'admin' }))
  const fetch = vi.fn().mockResolvedValueOnce(response({ id: 'r', moderationHistory: [{ id: 'old' }] })).mockResolvedValueOnce(response({ id: 'r' }))
  vi.stubGlobal('fetch', fetch)
  await updateReview('r', { status: 'approved' })
  expect(JSON.parse(fetch.mock.calls[1][1].body).moderationHistory).toEqual([{ id: 'old' }, expect.objectContaining({ status: 'approved', adminId: 'admin', createdAt: expect.any(String) })])
})
