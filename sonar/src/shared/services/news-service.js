export const newsCategories = ['Lanzamientos', 'Festivales', 'Hi-Fi & Hardware', 'Industria & Sellos', 'Crónicas']

export function isNewsVisible(row, now = new Date()) {
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  return row.status === 'published' && (!row.startDate || row.startDate <= today) && (!row.endDate || row.endDate >= today)
}
export function toNewsArticle(row, labels = []) {
  const label = labels.find(item => item.status === 'published' && String(item.id) === String(row.labelId))
  return {
    ...row,
    labelName: label?.name || '',
    labelWebsite: label?.website || '',
    category: row.category || 'Crónicas',
    summary: row.description || '',
    content: row.content || row.description || '',
    author: row.author || 'Redacción SONAR',
    role: row.role || 'Comunidad SONAR',
    readTime: row.readTime || `${Math.max(1, Math.ceil((row.content || row.description || '').split(/\s+/).length / 200))} min`,
    date: row.startDate ? new Date(`${row.startDate}T12:00:00`).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' }) : '',
    cover: row.cover || '/favicon.svg',
  }
}
