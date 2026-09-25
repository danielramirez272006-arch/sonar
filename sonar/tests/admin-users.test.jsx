/** @vitest-environment jsdom */
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { UsersPage } from '../src/pages/admin/users-page.jsx'
import { ModerationTable } from '../src/features/admin/moderation/components/moderation-table.jsx'

vi.mock('../src/shared/components/ui/blobatar-avatar.jsx', () => ({ BlobatarAvatar: () => <span /> }))
vi.mock('../src/features/admin/moderation/components/review-album.jsx', () => ({ ReviewAlbum: ({ review }) => <p>{review.content}</p> }))
afterEach(cleanup)
const users = [
  { id: 1, username: 'Ana', email: 'ana@sonar.test', accountType: 'junior', createdAt: '2025-01-01', conductReports: [{ status: 'pending' }] },
  { id: 2, username: 'Luis', email: 'luis@sonar.test', createdAt: '2026-01-01', status: 'banned' },
]
const reviews = [{ id: 'r1', userId: '1', content: 'Reseña de Ana', status: 'approved', createdAt: '2026-06-01' }, { id: 'r2', userId: 2, content: 'Reseña de Luis', status: 'rejected' }]

it('combines account, conduct and multi-term search while keeping global metrics', () => {
  render(<UsersPage users={users} reviews={reviews} />)
  const summary = screen.getByRole('region', { name: 'Resumen de miembros' })
  expect(within(summary).getByText('Total de Miembros').parentElement.textContent).toContain('2')
  fireEvent.change(screen.getByLabelText('Tipo de cuenta'), { target: { value: 'junior' } })
  fireEvent.change(screen.getByLabelText('Conducta'), { target: { value: 'yellow' } })
  fireEvent.change(screen.getByLabelText('Buscar usuarios'), { target: { value: 'ana sonar.test' } })
  expect(screen.getByRole('link', { name: 'Ver reseñas de Ana' }).getAttribute('href')).toBe('#admin-reviews?user=1')
  expect(screen.queryByText('Luis')).toBeNull()
  expect(within(summary).getByText('Total de Miembros').parentElement.textContent).toContain('2')
  fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }))
  expect(screen.getByText('Luis')).toBeTruthy()
  fireEvent.change(screen.getByLabelText('Ordenar por'), { target: { value: 'activity' } })
  expect(screen.getAllByRole('row')[1].textContent).toContain('Ana')
  fireEvent.change(screen.getByLabelText('Ordenar por'), { target: { value: 'newest' } })
  expect(screen.getAllByRole('row')[1].textContent).toContain('Luis')
})

it('shows only the selected author across review states and mixed ID types', () => {
  render(<ModerationTable users={users} reviews={reviews} userFilterId="1" compact query="" analyses={{}} />)
  expect(screen.getByText('Reseña de Ana')).toBeTruthy()
  expect(screen.queryByText('Reseña de Luis')).toBeNull()
  expect(screen.getByRole('link', { name: 'Quitar filtro de usuario' }).getAttribute('href')).toBe('#admin-reviews')
})
