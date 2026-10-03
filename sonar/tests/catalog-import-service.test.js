import { getCatalog, saveCatalog } from '../src/shared/services/catalog-service.js'
import { saveImportedRow } from '../src/shared/services/catalog-import-service.js'
jest.mock('../src/shared/services/catalog-service.js', () => ({ getCatalog: jest.fn(), saveCatalog: jest.fn() }))
afterEach(() => jest.resetAllMocks())
const item = { importId: 'stable-id', data: { title: 'Disco' } }
it('recovers a lost response without inserting a duplicate', async () => {
  getCatalog.mockResolvedValueOnce([]).mockResolvedValueOnce([{ id: 'stable-id', title: 'Disco' }])
  saveCatalog.mockRejectedValueOnce(new TypeError('Failed to fetch'))
  expect(await saveImportedRow('vinyl', item, { role: 'admin' }, 'published')).toMatchObject({ id: 'stable-id' })
  expect(saveCatalog).toHaveBeenCalledTimes(1)
})
it('retries a connection failure and retains publication choice', async () => {
  getCatalog.mockRejectedValueOnce(new TypeError('Failed to fetch')).mockResolvedValue([])
  saveCatalog.mockResolvedValue({ id: 'stable-id' })
  await saveImportedRow('vinyl', item, { role: 'admin' }, 'published')
  expect(saveCatalog).toHaveBeenCalledWith('vinyl', { title: 'Disco', status: 'published' }, { role: 'admin' }, undefined, 'stable-id')
})
