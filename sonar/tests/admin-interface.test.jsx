/** @vitest-environment jsdom */
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from '../src/App.jsx'
import { getReviews, getUsers, getPendingReviews, updateReview } from '../src/shared/services/api-client.js'

vi.mock('../src/shared/components/ui/blobatar-avatar.jsx', () => ({ BlobatarAvatar: () => <span /> }))
vi.mock('../src/shared/services/deezer-service.js', () => ({ getAlbumById: async () => null, DEFAULT_DEEZER_ALBUMS: [], searchAlbums: async () => [] }))
vi.mock('../src/shared/services/api-client.js', () => ({
  getReviews: vi.fn(), getUsers: vi.fn(), getPendingReviews: vi.fn(), updateReview: vi.fn(),
}))

beforeEach(() => {
  vi.resetAllMocks()
  window.localStorage.setItem('sonar_auth_user', JSON.stringify({ id: '1', username: 'Mateo', role: 'admin' }))
  window.history.replaceState(null, '', '/#admin')
  const reviews = [{ id: '101', userId: '1', albumId: 'album_01', rating: 4.7, content: 'Una gran escucha.', status: 'pending_moderation', aiFlagged: false }]
  getReviews.mockImplementation(async () => reviews.map(review => ({ ...review })))
  getPendingReviews.mockImplementation(async () => reviews.filter(review => review.status === 'pending_moderation').map(review => ({ ...review })))
  getUsers.mockResolvedValue([{ id: '1', username: 'Mateo', role: 'admin' }])
  updateReview.mockImplementation(async (id, changes) => {
    const review = reviews.find(item => item.id === id)
    Object.assign(review, changes)
    return { ...review }
  })
})
afterEach(cleanup)

it('saltar al contenido conserva la pantalla de moderación', async () => {
  window.history.replaceState(null, '', '/#moderacion')
  render(<App />)
  await screen.findAllByText('Mateo')
  await act(async () => {
    window.history.replaceState(null, '', '/#contenido')
    window.dispatchEvent(new Event('hashchange'))
  })
  expect(screen.getByRole('heading', { name: 'Moderación de Reseñas' })).toBeTruthy()
})

it('limpia la búsqueda y devuelve el foco al campo', async () => {
  render(<App />)
  await screen.findAllByText('Mateo')
  const search = screen.getByRole('combobox', { name: /Buscar reseñas/ })
  fireEvent.change(search, { target: { value: 'sin coincidencias' } })
  fireEvent.click(screen.getByRole('button', { name: 'Limpiar búsqueda' }))
  expect(search.value).toBe('')
  expect(document.activeElement).toBe(search)
  expect(screen.getAllByText('Mateo')[0]).toBeTruthy()
})

it('conserva la confirmación si el rechazo falla y permite reintentarlo', async () => {
  window.history.replaceState(null, '', '/#moderacion')
  updateReview.mockRejectedValueOnce(new Error('No se guardó el rechazo.'))
  render(<App />)
  const reject = await screen.findByRole('button', { name: 'Rechazar' })
  await waitFor(() => expect(reject.disabled).toBe(false))
  fireEvent.click(reject)
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar rechazo' }))
  expect(await screen.findByRole('alert')).toBeTruthy()
  const confirm = screen.getByRole('button', { name: 'Confirmar rechazo' })
  await waitFor(() => expect(confirm.disabled).toBe(false))
  fireEvent.click(confirm)
  expect(await screen.findByText('Todo en armonía')).toBeTruthy()
  expect(updateReview).toHaveBeenLastCalledWith('101', { status: 'rejected' })
})

it('analiza una reseña normal sin aprobarla ni rechazarla', async () => {
  window.history.replaceState(null, '', '/#moderacion')
  render(<App />)
  const analyze = await screen.findByRole('button', { name: /Revisar con IA/ })
  await waitFor(() => expect(analyze.disabled).toBe(false))
  fireEvent.click(analyze)
  expect(await screen.findByText('No se detectaron palabras de la lista ofensiva. La decisión final es tuya.')).toBeTruthy()
  expect(updateReview).not.toHaveBeenCalled()
  expect(screen.getByRole('button', { name: /Aprobar reseña/ })).toBeTruthy()
})

it('muestra los datos y permite filtrar las reseñas con la búsqueda', async () => {
  render(<App />)
  expect(await screen.findAllByText('Mateo')).toBeTruthy()
  const search = screen.getByRole('combobox', { name: /Buscar reseñas/ })
  fireEvent.change(search, { target: { value: 'sin coincidencias' } })
  expect(screen.getByText('No hay coincidencias')).toBeTruthy()
  fireEvent.change(search, { target: { value: 'Mateo' } })
  expect(screen.getAllByText('Mateo')[0]).toBeTruthy()
})

it('aprueba una reseña desde la cola y refleja su desaparición', async () => {
  window.history.replaceState(null, '', '/#moderacion')
  render(<App />)
  const approve = await screen.findByRole('button', { name: /Aprobar reseña/ })
  await waitFor(() => expect(approve.disabled).toBe(false))
  fireEvent.click(approve)
  await waitFor(() => expect(updateReview).toHaveBeenCalledWith('101', { status: 'approved' }))
  expect(await screen.findByText('Todo en armonía')).toBeTruthy()
  expect(screen.getByRole('status').textContent).toContain('aprobada')
})

it('pide confirmación antes de rechazar y permite cancelar', async () => {
  render(<App />)
  const reject = await screen.findByRole('button', { name: 'Rechazar' })
  await waitFor(() => expect(reject.disabled).toBe(false))
  fireEvent.click(reject)
  expect(screen.getByText('¿Rechazar esta reseña?')).toBeTruthy()
  expect(updateReview).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
  expect(screen.queryByText('¿Rechazar esta reseña?')).toBeNull()
})

it('muestra el error y permite reintentar la carga', async () => {
  getUsers.mockRejectedValue(new Error('API no disponible'))
  render(<App />)
  expect(await screen.findByRole('alert')).toBeTruthy()
  getUsers.mockResolvedValue([{ id: '1', username: 'Mateo', role: 'user' }])
  const retry = screen.getByRole('button', { name: 'Reintentar' })
  await waitFor(() => expect(retry.disabled).toBe(false))
  fireEvent.click(retry)
  await waitFor(() => expect(screen.queryByRole('alert')).toBeNull())
  expect(await screen.findAllByText('Mateo')).toBeTruthy()
})
