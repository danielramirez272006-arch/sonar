import { expect, it, vi } from 'vitest'
import { isNewsVisible, toNewsArticle } from '../src/shared/services/news-service.js'
import { saveCatalog, validateCatalog, deleteCatalog } from '../src/shared/services/catalog-service.js'
import { apiRequest } from '../src/shared/services/api-client.js'
vi.mock('../src/shared/services/api-client.js', () => ({ apiRequest: vi.fn().mockResolvedValue({}) }))
const input = { title: 'Noticia', description: 'Resumen', content: 'Texto completo', category: 'Crónicas', startDate: '2026-09-25', endDate: '', status: 'published' }
it('keeps imported images and edition links and rejects unsafe image URLs', () => {
  expect(validateCatalog('announcements', { ...input, cover: 'data:image/jpeg;base64,/9j/AA==', vinylId: 42 })).toMatchObject({ cover: 'data:image/jpeg;base64,/9j/AA==', vinylId: '42' })
  expect(validateCatalog('announcements', { ...input, cover: 'https://example.com/cover.jpg' }).cover).toBe('https://example.com/cover.jpg')
  expect(() => validateCatalog('announcements', { ...input, cover: 'data:image/svg+xml;base64,AAAA' })).toThrow()
  expect(() => validateCatalog('announcements', { ...input, cover: 'data:image/jpeg;base64,' + 'A'.repeat(60000) })).toThrow()
})
it('prevents deleting a vinyl edition referenced by a news article', async () => {
  apiRequest.mockResolvedValueOnce([{ vinylId: '42' }])
  await expect(deleteCatalog('vinyl', '42', { role: 'admin' })).rejects.toThrow('noticias asociadas')
})
it('associates news with published labels and keeps artist announcement fields', () => {
  const data = validateCatalog('announcements', { ...input, labelId: 7, artist: 'Artista', album: 'Disco', eventDate: '2026-12-01', sourceUrl: 'https://example.com/anuncio' })
  expect(data).toMatchObject({ labelId: '7', artist: 'Artista', album: 'Disco', eventDate: '2026-12-01' })
  expect(toNewsArticle(data, [{ id: 7, name: 'Sello', status: 'published' }]).labelName).toBe('Sello')
  expect(toNewsArticle(data, [{ id: 7, name: 'Sello', status: 'draft' }]).labelName).toBe('')
})
it('prevents deleting a label referenced by news', async () => {
  apiRequest.mockImplementation(async endpoint => endpoint === '/announcements' ? [{ labelId: '7' }] : [])
  await expect(deleteCatalog('labels', 7, { role: 'admin' })).rejects.toThrow('noticias')
  apiRequest.mockResolvedValue({})
})
it('shows published news only during its publication dates', () => {
  const now = new Date(2026, 8, 25)
  expect(isNewsVisible(input, now)).toBe(true)
  expect(isNewsVisible({ ...input, status: 'draft' }, now)).toBe(false)
  expect(isNewsVisible({ ...input, startDate: '2026-09-26' }, now)).toBe(false)
  expect(isNewsVisible({ ...input, endDate: '2026-09-24' }, now)).toBe(false)
})
it('uses edited content and preserves existing audio', () => {
  const audioNarration = { audioUrl: '/audio/existing.m4a' }
  expect(toNewsArticle({ ...input, audioNarration })).toMatchObject({ summary: 'Resumen', content: 'Texto completo', audioNarration })
  expect(validateCatalog('announcements', input).endDate).toBe('')
})
it('only allows administrators to save news and patches the existing record', async () => {
  await expect(saveCatalog('announcements', input, { role: 'user' }, 'news-1')).rejects.toThrow('Solo un administrador')
  await saveCatalog('announcements', input, { role: 'admin' }, 'news-1')
  expect(apiRequest).toHaveBeenCalledWith('/announcements/news-1', expect.objectContaining({ method: 'PATCH', body: expect.stringContaining('Texto completo') }))
})
