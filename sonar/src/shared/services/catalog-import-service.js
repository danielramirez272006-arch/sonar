import { getCatalog, saveCatalog } from './catalog-service.js'

export async function saveImportedRow(type, item, user, status) {
  // Keep the same ID across retries, including responses lost after a write.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const existing = (await getCatalog(type)).find(row => String(row.id) === item.importId)
      if (existing) return existing
      return await saveCatalog(type, { ...item.data, status }, user, undefined, item.importId)
    } catch (cause) {
      if (attempt === 2) throw cause
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)))
    }
  }
}
