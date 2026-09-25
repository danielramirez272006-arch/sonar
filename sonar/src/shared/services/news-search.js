const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()
export function matchesNewsSearch(query, ...values) {
  const text = normalize(values.join(' '))
  return normalize(query).trim().split(/\s+/).filter(Boolean).every(term => text.includes(term))
}
