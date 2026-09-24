/** @vitest-environment jsdom */
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { ConsoleSearch } from '../src/features/admin/console-search.jsx'
vi.mock('../src/shared/services/deezer-service.js', () => ({ DEFAULT_DEEZER_ALBUMS: [], searchAlbums: vi.fn().mockResolvedValue([]) }))
afterEach(cleanup)
function setup(query) {
  render(<ConsoleSearch users={[{ id: '1', username: 'Mateo', email: 'mateo@test.local' }]} reviews={[{ id: '101', userId: '1', content: 'Gran disco', albumId: '23' }]} query={query} setQuery={vi.fn()} inputRef={createRef()} />)
  fireEvent.focus(screen.getByRole('combobox'))
}
it('opens a matching user profile with Enter', () => {
  setup('Mateo')
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' })
  expect(window.location.hash).toBe('#usuarios?user=1')
})
it('navigates to the exact review', () => {
  setup('Gran disco')
  fireEvent.click(screen.getByRole('option', { name: /Reseña #101/ }))
  expect(window.location.hash).toBe('#admin-reviews?review=101')
})
it('offers working state filters and dismisses with Escape', () => {
  setup('filtros')
  expect(screen.getByRole('option', { name: /Reseñas aprobadas/ }).getAttribute('href')).toBe('#admin-reviews?filter=approved')
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' })
  expect(screen.queryByRole('listbox')).toBeNull()
})
