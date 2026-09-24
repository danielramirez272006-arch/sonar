import { apiRequest } from './api-client.js'

export const catalogTypes = {
  music: { title: 'Música registrada', singular: 'registro musical', endpoint: 'music', fields: [['title', 'Título de la canción', 'text', true], ['artist', 'Artista', 'text', true], ['album', 'Álbum', 'text'], ['genre', 'Género', 'text'], ['audioUrl', 'URL del audio', 'url', true], ['cover', 'URL de portada', 'url'], ['description', 'Descripción', 'textarea']] },
  announcements: { title: 'Anuncios', singular: 'anuncio', endpoint: 'announcements', fields: [['title', 'Título', 'text', true], ['description', 'Mensaje', 'textarea', true], ['startDate', 'Fecha de inicio', 'date', true], ['endDate', 'Fecha de fin', 'date', true]] },
  releases: { title: 'Lanzamientos destacados', singular: 'lanzamiento', endpoint: 'featuredReleases', fields: [['title', 'Título', 'text', true], ['artist', 'Artista', 'text', true], ['releaseDate', 'Fecha de lanzamiento', 'date', true], ['cover', 'URL de portada', 'url'], ['description', 'Texto editorial', 'textarea']] },
  labels: { title: 'Sellos discográficos', singular: 'sello', endpoint: 'recordLabels', fields: [['name', 'Nombre', 'text', true], ['country', 'País', 'text', true], ['founded', 'Año de fundación', 'number'], ['website', 'Sitio web', 'url'], ['description', 'Descripción', 'textarea']] },
  vinyl: { title: 'Ediciones de vinilo', singular: 'edición de vinilo', endpoint: 'vinylEditions', fields: [['title', 'Álbum / edición', 'text', true], ['artist', 'Artista', 'text', true], ['year', 'Año de edición', 'number', true], ['format', 'Formato', 'text', true], ['color', 'Color del vinilo', 'text'], ['catalogNumber', 'Número de catálogo', 'text'], ['cover', 'URL de portada', 'url'], ['description', 'Descripción', 'textarea']] },
}
function config(type) {
  if (!Object.hasOwn(catalogTypes, type)) throw new Error('Tipo de catálogo inválido.')
  return catalogTypes[type]
}
export function validateCatalog(type, input) {
  const data = {}
  for (const [key, label, kind, required] of config(type).fields) {
    const value = String(input[key] ?? '').trim()
    if (required && !value) throw new Error(`${label}: completa este campo.`)
    if (value.length > (kind === 'textarea' ? 2000 : 300)) throw new Error(`${label}: el texto es demasiado largo.`)
    if (kind === 'url' && value) {
      let url
      try { url = new URL(value) } catch { throw new Error(`${label}: introduce una URL válida.`) }
      if (!['https:', 'http:'].includes(url.protocol)) throw new Error(`${label}: utiliza http o https.`)
    }
    if (kind === 'number' && value && (!/^\d{4}$/.test(value) || Number(value) < 1800 || Number(value) > new Date().getFullYear() + 5)) throw new Error(`${label}: introduce un año válido.`)
    if (kind === 'date' && value && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value)) throw new Error('Fecha de lanzamiento inválida.')
    data[key] = value
  }
  if (!['draft', 'published'].includes(input.status)) throw new Error('Estado inválido.')
  data.status = input.status
  if (type === 'announcements' && data.endDate < data.startDate) throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio.')
  if (['releases', 'vinyl'].includes(type)) data.labelId = String(input.labelId || '')
  return data
}
export async function getCatalog(type, published = false) {
  const rows = await apiRequest(`/${config(type).endpoint}${published ? '?status=published' : ''}`)
  if (!Array.isArray(rows)) throw new Error('La API no devolvió una lista válida.')
  return published ? rows.filter(row => row.status === 'published') : rows
}
function requireAdmin(actor) {
  if (actor?.role !== 'admin') throw new Error('Solo un administrador puede modificar el catálogo.')
}
export async function saveCatalog(type, input, actor, id) {
  requireAdmin(actor)
  const data = validateCatalog(type, input)
  if (data.labelId) {
    const labels = await getCatalog('labels')
    if (!labels.some(label => String(label.id) === data.labelId)) throw new Error('El sello seleccionado ya no existe.')
  }
  const editing = id != null
  return apiRequest(`/${config(type).endpoint}${editing ? `/${encodeURIComponent(id)}` : ''}`, {
    method: editing ? 'PATCH' : 'POST',
    body: JSON.stringify({ ...data, updatedAt: new Date().toISOString(), ...(!editing && { id: crypto.randomUUID(), createdAt: new Date().toISOString() }) }),
  })
}
export async function deleteCatalog(type, id, actor) {
  requireAdmin(actor)
  const endpoint = config(type).endpoint
  if (type === 'labels') {
    const references = await Promise.all(['releases', 'vinyl'].map(kind => getCatalog(kind)))
    if (references.flat().some(row => String(row.labelId) === String(id))) throw new Error('Este sello tiene lanzamientos o vinilos asociados. Edita esos registros antes de eliminarlo.')
  }
  return apiRequest(`/${endpoint}/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
