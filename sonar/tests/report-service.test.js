import { beforeEach, expect, it, vi } from 'vitest'
import { apiRequest } from '../src/shared/services/api-client.js'
import { submitCommunityReport } from '../src/shared/services/report-service.js'
import { reportsFrom } from '../src/shared/services/admin-data.js'
vi.mock('../src/shared/services/api-client.js', () => ({ apiRequest: vi.fn() }))
beforeEach(() => vi.resetAllMocks())
const input = { authorId: 'author', reporter: { id: 'reader', username: 'Reader' }, contentId: 'comment-1', contentType: 'comment', contentSnapshot: 'Texto reportado', reason: 'Spam' }
it('persists a home report in the format consumed by the admin', async () => {
  apiRequest.mockResolvedValueOnce([{ id: 'author', username: 'Author', conductReports: [] }]).mockResolvedValueOnce({})
  await submitCommunityReport(input)
  const changes = JSON.parse(apiRequest.mock.calls[1][1].body)
  expect(apiRequest.mock.calls[1][0]).toBe('/users/author')
  expect(apiRequest.mock.calls[1][1].method).toBe('PATCH')
  expect(reportsFrom([{ id: 'author', username: 'Author', ...changes }])[0]).toMatchObject({ status: 'pending', reason: 'Spam', contentSnapshot: 'Texto reportado', reporterId: 'reader' })
})
it('propagates API failures instead of confirming an unsaved report', async () => {
  apiRequest.mockResolvedValueOnce([{ id: 'author' }]).mockRejectedValueOnce(new Error('Offline'))
  await expect(submitCommunityReport(input)).rejects.toThrow('Offline')
})
it('rejects duplicate pending reports', async () => {
  apiRequest.mockResolvedValueOnce({ id: 'author', conductReports: [{ contentId: 'comment-1', contentType: 'comment', reporterId: 'reader', status: 'pending' }] }])
  await expect(submitCommunityReport(input)).rejects.toThrow('Ya tienes')
  expect(apiRequest).toHaveBeenCalledTimes(1)
})
