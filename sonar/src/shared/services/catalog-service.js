import { apiRequest } from './api-client.js'
import { newsCategories } from './news-service.js'

export const catalogTypes = {
  music: { title: 'Música registrada', singular: 'registro musical', endpoint: 'music', fields: [['title', 'Título de la canción', 'text', true], ['artist', 'Artista', 'text', true], ['album', 'Álbum', 'text'], ['genre', 'Género', 'text'], ['audioUrl', 'URL del audio', 'url', true], ['cover', 'URL de portada', 'url'], ['description', 'Descripción', 'textarea']] },
  announcements: { title: 'Anuncios', singular: 'anuncio', endpoint: 'announcements', fields: [['title', 'Título', 'text', true], ['description', 'Resumen de la noticia', 'textarea', true], ['content', 'Contenido completo', 'textarea'], ['category', 'Categoría', 'category'], ['artist', 'Artista o artistas involucrados', 'text'], ['album', 'Álbum anunciado (opcional)', 'text'], ['eventDate', 'Fecha del lanzamiento o fichaje (opcional)', 'date'], ['sourceUrl', 'Fuente oficial del anuncio', 'url'], ['author', 'Autor', 'text'], ['cover', 'URL de portada', 'url'], ['startDate', 'Fecha de publicación', 'date', true], ['endDate', 'Visible hasta (opcional)', 'date']] },
  releases: { title: 'Lanzamientos destacados', singular: 'lanzamiento', endpoint: 'featuredReleases', fields: [['title', 'Título del álbum/sencillo', 'text', true], ['artist', 'Artista', 'text', true], ['releaseDate', 'Fecha de lanzamiento', 'date', true], ['genre', 'Género musical', 'text'], ['type', 'Tipo (Álbum / Sencillo / EP / Vinilo)', 'text'], ['cover', 'URL de portada', 'url'], ['externalUrl', 'Enlace externo (Deezer / Spotify)', 'url'], ['description', 'Texto editorial', 'textarea']] },
  labels: { title: 'Sellos discográficos', singular: 'sello', endpoint: 'recordLabels', fields: [['name', 'Nombre', 'text', true], ['country', 'País', 'text', true], ['founded', 'Año de fundación', 'number'], ['website', 'Sitio web', 'url'], ['cover', 'Imagen del sello', 'url'], ['description', 'Descripción', 'textarea']] },
  vinyl: { title: 'Ediciones de vinilo', singular: 'edición de vinilo', endpoint: 'vinylEditions', fields: [['title', 'Álbum / edición', 'text', true], ['artist', 'Artista', 'text', true], ['year', 'Año de edición', 'number', true], ['format', 'Formato', 'text', true], ['color', 'Color del vinilo', 'text'], ['catalogNumber', 'Número de catálogo', 'text'], ['releaseDate', 'Fecha de lanzamiento', 'date'], ['editionType', 'Tipo de edición (reedición, limitada, nueva)', 'text'], ['cover', 'URL de portada', 'url'], ['description', 'Descripción', 'textarea']] },
}
function config(type) {
  if (!Object.hasOwn(catalogTypes, type)) throw new Error('Tipo de catálogo inválido.')
  return catalogTypes[type]
}
export function validateCatalog(type, input) {
  const data = {}
  for (const [key, label, kind, required] of config(type).fields) {
    const value = String(input[key] ?? '').trim()
    if (key === 'cover' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(value) && value.length <= 60000) { data[key] = value; continue }
    if (kind === 'category' && value && !newsCategories.includes(value)) throw new Error('Selecciona una categoría de noticias válida.')
    if (required && !value) throw new Error(`${label}: completa este campo.`)
    if (value.length > (key === 'content' ? 20000 : kind === 'textarea' ? 2000 : 300)) throw new Error(`${label}: el texto es demasiado largo.`)
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
  if (type === 'announcements' && data.endDate && data.endDate < data.startDate) throw new Error('La fecha de fin no puede ser anterior a la fecha de inicio.')
  if (['releases', 'vinyl', 'announcements'].includes(type)) data.labelId = String(input.labelId || '')
  if (type === 'announcements') data.vinylId = String(input.vinylId || '')
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
export async function saveCatalog(type, input, actor, id, creationId) {
  requireAdmin(actor)
  const data = validateCatalog(type, input)
  if (data.labelId) {
    const labels = await getCatalog('labels')
    if (!labels.some(label => String(label.id) === data.labelId)) throw new Error('El sello seleccionado ya no existe.')
  }
  if (data.vinylId && !(await getCatalog('vinyl')).some(row => String(row.id) === data.vinylId)) throw new Error('La edición de vinilo seleccionada ya no existe.')
  const editing = id != null
  return apiRequest(`/${config(type).endpoint}${editing ? `/${encodeURIComponent(id)}` : ''}`, {
    method: editing ? 'PATCH' : 'POST',
    body: JSON.stringify({ ...data, updatedAt: new Date().toISOString(), ...(!editing && { id: creationId || crypto.randomUUID(), createdAt: new Date().toISOString() }) }),
  })
}
export async function deleteCatalog(type, id, actor) {
  requireAdmin(actor)
  const endpoint = config(type).endpoint
  if (type === 'vinyl' && (await getCatalog('announcements')).some(row => String(row.vinylId) === String(id))) throw new Error('Esta edición tiene noticias asociadas. Retira la asociación antes de eliminarla.')
  if (type === 'labels') {
    const references = await Promise.all(['releases', 'vinyl', 'announcements'].map(kind => getCatalog(kind)))
    if (references.flat().some(row => String(row.labelId) === String(id))) throw new Error('Este sello tiene noticias, lanzamientos o vinilos asociados. Edita esos registros antes de eliminarlo.')
  }
  return apiRequest(`/${endpoint}/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
