const ignored = new Set('el la los las un una unos unas de del al a en con por para y o que es son se su sus este esta muy mas me mi lo'.split(' '))
const negative = /\b(no|nunca|jamas|tampoco|sin|malo|mala|malos|malas|pesimo|pesima|aburrido|aburrida|odio|horrible)\b/
const positive = /\b(bueno|buena|buenos|buenas|excelente|genial|encanta|encantan|increible|hermoso|hermosa)\b/
function describe(review) {
  const text = review.content.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
  const tokens = new Set(text.split(' ').filter(word => !ignored.has(word)))
  return { review, text, tokens, negative: negative.test(text), positive: positive.test(text) }
}
function similar(a, b) {
  if (a.negative !== b.negative || a.positive !== b.positive) return false
  if (a.text === b.text) return true
  const shared = [...a.tokens].filter(token => b.tokens.has(token)).length
  return shared >= 3 && shared / new Set([...a.tokens, ...b.tokens]).size >= .75
}

// Conservative text matching: groups are suggestions for human review, not sentiment judgments.
export function communityOpinions(reviews = []) {
  const eligible = reviews.filter(review => ['approved', 'pending_moderation'].includes(review.status) && review.userId != null && review.albumId != null && typeof review.content === 'string' && review.content.trim())
  const groups = []
  for (const review of eligible) {
    const candidate = describe(review)
    if (candidate.text.split(' ').length < 3) continue
    const group = groups.find(item => String(item.albumId) === String(review.albumId) && item.items.every(item => similar(item, candidate)))
    if (group) group.items.push(candidate)
    else groups.push({ albumId: review.albumId, items: [candidate] })
  }
  return groups.map(group => ({
    albumId: group.albumId,
    opinion: group.items[0].review.content,
    reviews: group.items.map(item => item.review),
    userCount: new Set(group.items.map(item => String(item.review.userId))).size,
    totalUsers: new Set(eligible.filter(review => String(review.albumId) === String(group.albumId)).map(review => String(review.userId))).size,
  })).filter(group => group.userCount >= 2).sort((a, b) => b.userCount - a.userCount)
}
