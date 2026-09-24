import { expect, it } from 'vitest'
import { communityOpinions } from '../src/shared/services/community-opinions.js'
const review = (id, content, changes = {}) => ({ id, userId: id, albumId: 'album', status: 'approved', content, ...changes })
it('groups similar opinions from distinct users, normalizing accents and punctuation', () => {
  const groups = communityOpinions([review(1, '¡La producción es excelente!'), review(2, 'La produccion es excelente.'), review(3, 'Prefiero otro disco')])
  expect(groups).toHaveLength(1)
  expect(groups[0]).toMatchObject({ userCount: 2, totalUsers: 3 })
})
it('does not count repeated posts from one user as agreement', () => {
  expect(communityOpinions([review(1, 'La producción es excelente'), review(2, 'La producción es excelente', { userId: '1' })])).toEqual([])
})
it('separates albums, negations and opposite opinions', () => {
  expect(communityOpinions([review(1, 'La producción de este disco es excelente'), review(2, 'La producción de este disco no es excelente'), review(3, 'La producción de este disco es horrible'), review(4, 'La producción de este disco es excelente', { albumId: 'other' })])).toEqual([])
})
it('excludes rejected, empty and anonymous reviews but includes pending reviews', () => {
  const input = [review(1, 'Me encanta este disco'), review(2, 'Me encanta este disco', { status: 'rejected' }), review(3, 'Me encanta este disco', { userId: null }), review(4, ''), review(5, null)]
  expect(communityOpinions(input)).toEqual([])
  expect(communityOpinions([...input, review(6, 'Me encanta este disco', { status: 'pending_moderation' })])[0].userCount).toBe(2)
})
it('matches close wording while keeping unrelated opinions apart', () => {
  expect(communityOpinions([review(1, 'Excelente producción musical con arreglos originales'), review(2, 'Excelente producción musical con arreglos muy originales'), review(3, 'El concierto estuvo genial')])).toHaveLength(1)
})
