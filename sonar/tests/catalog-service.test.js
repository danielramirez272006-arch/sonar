import { afterEach, expect, it, vi } from 'vitest'
import { validateCatalog, getCatalog, saveCatalog, deleteCatalog } from '../src/shared/services/catalog-service.js'
import { apiRequest } from '../src/shared/services/api-client.js'
vi.mock('../src/shared/services/api-client.js', () => ({ apiRequest: vi.fn() }))
afterEach(() => vi.resetAllMocks())
const admin = { role: 'admin' }
const label = { name: 'Sello nuevo', country: 'Guatemala', status: 'draft' }
it('validates required fields, dates, links and announcement periods', () => {
  expect(() => validateCatalog('labels', { ...label, name: ' ' })).toThrow('Nombre')
  expect(() => validateCatalog('labels', { ...label, website: 'javascript:alert(1)' })).toThrow('http')
  expect(() => validateCatalog('announcements', { title: 'Aviso', description: 'Texto', startDate: '2026-02-30', endDate: '2026-03-01', status: 'draft' })).toThrow('Fecha')
  expect(() => validateCatalog('announcements', { title: 'Aviso', description: 'Texto', startDate: '2026-10-10', endDate: '2026-10-01', status: 'draft' })).toThrow('fin')
})
it('creates, updates and deletes through real HTTP methods', async () => {
  apiRequest.mockResolvedValue({ id: 'a', ...label })
  await saveCatalog('labels', label, admin)
  expect(apiRequest).toHaveBeenLastCalledWith('/recordLabels', expect.objectContaining({ method: 'POST' }))
  await saveCatalog('labels', label, admin, 'a')
  expect(apiRequest).toHaveBeenLastCalledWith('/recordLabels/a', expect.objectContaining({ method: 'PATCH' }))
  await deleteCatalog('announcements', 'a', admin)
  expect(apiRequest).toHaveBeenLastCalledWith('/announcements/a', { method: 'DELETE' })
})
it('blocks non-administrators and propagates API failures', async () => {
  await expect(saveCatalog('labels', label, { role: 'user' })).rejects.toThrow('administrador')
  expect(apiRequest).not.toHaveBeenCalled()
  apiRequest.mockRejectedValue(new Error('Sin conexión'))
  await expect(saveCatalog('labels', label, admin)).rejects.toThrow('Sin conexión')
})
it('protects referenced labels and validates associations', async () => {
  apiRequest.mockResolvedValue([{ labelId: 'a' }])
  await expect(deleteCatalog('labels', 'a', admin)).rejects.toThrow('asociados')
  expect(apiRequest.mock.calls.every(([, options]) => !options)).toBe(true)
  apiRequest.mockResolvedValue([])
  await expect(saveCatalog('releases', { title: 'Disco', artist: 'Artista', releaseDate: '2026-10-01', status: 'draft', labelId: 'missing' }, admin)).rejects.toThrow('ya no existe')
})
it('reads collections and rejects malformed responses', async () => {
  apiRequest.mockResolvedValue([])
  expect(await getCatalog('vinyl')).toEqual([])
  expect(apiRequest).toHaveBeenCalledWith('/vinylEditions')
  apiRequest.mockResolvedValue({})
  await expect(getCatalog('vinyl')).rejects.toThrow('lista válida')
})
