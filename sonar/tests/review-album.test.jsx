/** @vitest-environment jsdom */
import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { ReviewAlbum } from '../src/features/admin/moderation/components/review-album.jsx'
import { getAlbumById } from '../src/shared/services/deezer-service.js'

vi.mock('../src/shared/services/deezer-service.js', () => ({
  getAlbumById: vi.fn(),
  DEFAULT_DEEZER_ALBUMS: [{ id: 10709540, title: 'Currents', artist: 'Tame Impala', year: '2015', cover: 'https://example.com/cover.jpg' }],
}))
afterEach(() => { cleanup(); vi.clearAllMocks() })

it('resolves a legacy review and displays the API album and listening link', async () => {
  getAlbumById.mockResolvedValue({ title: 'Currents', artist: 'Tame Impala', cover: 'https://example.com/live.jpg', year: '2015' })
  render(<ReviewAlbum review={{ albumId: 'album_01', rating: 4.7, content: 'Gran disco' }} />)
  expect(await screen.findByText('Información de Deezer')).toBeTruthy()
  expect(getAlbumById).toHaveBeenCalledWith(10709540)
  expect(screen.getByAltText('Portada de Currents').getAttribute('src')).toBe('https://example.com/live.jpg')
  expect(screen.getByRole('link').getAttribute('href')).toBe('https://www.deezer.com/album/10709540')
  expect(screen.getByText(/4.7/)).toBeTruthy()
})

it('keeps saved album information when Deezer is unavailable', async () => {
  getAlbumById.mockResolvedValue(null)
  render(<ReviewAlbum review={{ albumId: 'album_01', rating: 4, content: 'Gran disco' }} />)
  expect(await screen.findByText('Datos guardados · Deezer no disponible')).toBeTruthy()
  expect(screen.getByRole('heading', { name: 'Currents' })).toBeTruthy()
})

it('does not invent album information for an unknown ID', async () => {
  getAlbumById.mockResolvedValue(null)
  render(<ReviewAlbum review={{ albumId: 'unknown', rating: 3, content: 'Reseña' }} />)
  expect(await screen.findByText('No se pudo cargar el álbum')).toBeTruthy()
  expect(screen.queryByRole('link')).toBeNull()
})
