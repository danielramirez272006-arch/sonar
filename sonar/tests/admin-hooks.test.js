/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { useModeration } from '../src/features/admin/moderation/use-moderation.js'
import { useAdminDashboard } from '../src/features/admin/dashboard/use-admin-dashboard.js'
import {
  getPendingReviews,
  updateReview,
  getUsers,
  getReviews,
} from '../src/shared/services/api-client.js'

vi.mock('../src/shared/services/api-client.js', () => ({
  getPendingReviews: vi.fn(),
  updateReview: vi.fn(),
  getUsers: vi.fn(),
  getReviews: vi.fn(),
}))

const pendingReviews = [
  { id: '101', userId: '1', albumId: 'album_01', rating: 4.7,
    content: 'Obra cumbre del pop psicodélico.', status: 'pending_moderation', aiFlagged: false },
  { id: '102', userId: '1', albumId: 'album_02', rating: 3.5,
    content: 'Requiere revisión.', status: 'pending_moderation', aiFlagged: true },
]
const users = [{ id: '1', role: 'user' }, { id: 'admin-1', role: 'admin' }]
const reviews = [
  { id: '101', status: 'pending_moderation', aiFlagged: false },
  { id: '102', status: 'approved', aiFlagged: false },
  { id: '103', status: 'rejected', aiFlagged: true },
]
const initialMetrics = {
  totalUsers: 0, totalReviews: 0, pendingReviews: 0,
  approvedReviews: 0, rejectedReviews: 0, flaggedReviews: 0,
}
const expectedMetrics = {
  totalUsers: 2, totalReviews: 3, pendingReviews: 1,
  approvedReviews: 1, rejectedReviews: 1, flaggedReviews: 1,
}

beforeEach(() => {
  vi.resetAllMocks()
  getPendingReviews.mockResolvedValue(pendingReviews)
  getUsers.mockResolvedValue(users)
  getReviews.mockResolvedValue(reviews)
  vi.stubGlobal('fetch', vi.fn(() => {
    throw new Error('No se permiten peticiones HTTP en estas pruebas.')
  }))
})

afterEach(() => {
  cleanup()
  try {
    expect(globalThis.fetch).not.toHaveBeenCalled()
  } finally {
    vi.unstubAllGlobals()
  }
})

async function mountModeration() {
  const hook = renderHook(() => useModeration())
  await waitFor(() => expect(hook.result.current.reviews).toEqual(pendingReviews))
  return hook
}

async function mountDashboard() {
  const hook = renderHook(() => useAdminDashboard())
  await waitFor(() => expect(hook.result.current.metrics).toEqual(expectedMetrics))
  return hook
}

describe('useModeration', () => {
  it('parte del estado inicial y carga las reseñas automáticamente', async () => {
    let resolveReviews
    getPendingReviews.mockReturnValueOnce(new Promise(resolve => { resolveReviews = resolve }))
    const { result } = renderHook(() => useModeration())
    expect(result.current.reviews).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    await waitFor(() => expect(result.current.isLoading).toBe(true))
    expect(getPendingReviews).toHaveBeenCalledTimes(1)
    await act(async () => { resolveReviews(pendingReviews) })
    expect(result.current.reviews).toEqual(pendingReviews)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('loadPendingReviews recarga, actualiza y devuelve la lista', async () => {
    const { result } = await mountModeration()
    const nextReviews = [pendingReviews[1]]
    getPendingReviews.mockResolvedValueOnce(nextReviews)
    await act(async () => {
      expect(await result.current.loadPendingReviews()).toEqual(nextReviews)
    })
    expect(getPendingReviews).toHaveBeenCalledTimes(2)
    expect(result.current.reviews).toEqual(nextReviews)
    expect(result.current.isLoading).toBe(false)
  })

  it.each([
    ['approveReview', { status: 'approved' }],
    ['rejectReview', { status: 'rejected' }],
    ['flagReview', { aiFlagged: true, status: 'pending_moderation' }],
  ])('%s actualiza y mantiene la carga hasta finalizar la recarga', async (method, changes) => {
    const { result } = await mountModeration()
    const updatedReview = { ...pendingReviews[0], ...changes }
    updateReview.mockResolvedValueOnce(updatedReview)
    let resolveReload
    getPendingReviews.mockReturnValueOnce(new Promise(resolve => { resolveReload = resolve }))
    let operation
    await act(async () => { operation = result.current[method]('101') })
    expect(updateReview).toHaveBeenCalledWith('101', changes)
    expect(getPendingReviews).toHaveBeenCalledTimes(2)
    expect(updateReview.mock.invocationCallOrder[0]).toBeLessThan(getPendingReviews.mock.invocationCallOrder[1])
    expect(result.current.isLoading).toBe(true)
    const nextReviews = changes.status === 'pending_moderation'
      ? [updatedReview, pendingReviews[1]] : [pendingReviews[1]]
    await act(async () => {
      resolveReload(nextReviews)
      expect(await operation).toEqual(updatedReview)
    })
    expect(result.current.reviews).toEqual(nextReviews)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it.each([
    ['approveReview', null], ['rejectReview', undefined], ['flagReview', ''],
  ])('%s rechaza el ID inválido %s', async (method, id) => {
    const { result } = await mountModeration()
    await act(async () => {
      await expect(result.current[method](id)).rejects.toThrow('El ID de la reseña es obligatorio.')
    })
    expect(updateReview).not.toHaveBeenCalled()
    expect(result.current.error).toBe('El ID de la reseña es obligatorio.')
    expect(result.current.isLoading).toBe(false)
  })

  it('expone y relanza el error de API y permite recuperarse', async () => {
    const { result } = await mountModeration()
    const failure = new Error('No se pudieron consultar las reseñas.')
    getPendingReviews.mockRejectedValueOnce(failure)
    await act(async () => {
      await expect(result.current.loadPendingReviews()).rejects.toBe(failure)
    })
    expect(result.current.error).toBe(failure.message)
    expect(result.current.isLoading).toBe(false)
    await act(async () => { await result.current.loadPendingReviews() })
    expect(result.current.error).toBeNull()
  })
})

describe('useAdminDashboard', () => {
  it('conserva la respuesta más reciente y espera todas las cargas concurrentes', async () => {
    const { result } = await mountDashboard()
    let resolveOlderUsers
    let resolveNewerUsers
    getUsers.mockReturnValueOnce(new Promise(resolve => { resolveOlderUsers = resolve }))
    getUsers.mockReturnValueOnce(new Promise(resolve => { resolveNewerUsers = resolve }))
    getReviews.mockResolvedValueOnce(reviews)
    getReviews.mockResolvedValueOnce([])
    let olderRequest
    let newerRequest
    await act(async () => {
      olderRequest = result.current.loadMetrics()
      newerRequest = result.current.refresh()
    })
    await act(async () => {
      resolveNewerUsers([])
      expect(await newerRequest).toEqual(initialMetrics)
    })
    expect(result.current.metrics).toEqual(initialMetrics)
    expect(result.current.isLoading).toBe(true)
    await act(async () => {
      resolveOlderUsers(users)
      expect(await olderRequest).toEqual(expectedMetrics)
    })
    expect(result.current.metrics).toEqual(initialMetrics)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('carga usuarios y reseñas y calcula todas las métricas al montar', async () => {
    let resolveUsers
    getUsers.mockReturnValueOnce(new Promise(resolve => { resolveUsers = resolve }))
    const { result } = renderHook(() => useAdminDashboard())
    expect(result.current.metrics).toEqual(initialMetrics)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    await waitFor(() => expect(result.current.isLoading).toBe(true))
    expect(getUsers).toHaveBeenCalledTimes(1)
    expect(getReviews).toHaveBeenCalledTimes(1)
    await act(async () => { resolveUsers(users) })
    expect(result.current.metrics).toEqual(expectedMetrics)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it.each(['loadMetrics', 'refresh'])('%s vuelve a consultar y devuelve las métricas actualizadas', async method => {
    const { result } = await mountDashboard()
    getUsers.mockResolvedValueOnce([users[0]])
    getReviews.mockResolvedValueOnce([reviews[1]])
    const nextMetrics = { ...initialMetrics, totalUsers: 1, totalReviews: 1, approvedReviews: 1 }
    await act(async () => {
      expect(await result.current[method]()).toEqual(nextMetrics)
    })
    expect(getUsers).toHaveBeenCalledTimes(2)
    expect(getReviews).toHaveBeenCalledTimes(2)
    expect(result.current.metrics).toEqual(nextMetrics)
    expect(result.current.isLoading).toBe(false)
  })

  it.each([
    [null, reviews, { ...expectedMetrics, totalUsers: 0 }],
    [users, {}, { ...initialMetrics, totalUsers: 2 }],
    [undefined, 'invalid', initialMetrics],
  ])('trata respuestas no válidas como arreglos vacíos (%#)', async (usersResult, reviewsResult, expected) => {
    const { result } = await mountDashboard()
    getUsers.mockResolvedValueOnce(usersResult)
    getReviews.mockResolvedValueOnce(reviewsResult)
    await act(async () => { await result.current.loadMetrics() })
    expect(result.current.metrics).toEqual(expected)
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it.each(['users', 'reviews'])('expone y relanza un fallo al consultar %s', async resource => {
    const { result } = await mountDashboard()
    const failure = new Error(`No se pudo consultar ${resource}.`)
    const request = resource === 'users' ? getUsers : getReviews
    request.mockRejectedValueOnce(failure)
    await act(async () => {
      await expect(result.current.loadMetrics()).rejects.toBe(failure)
    })
    expect(result.current.error).toBe(failure.message)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.metrics).toEqual(expectedMetrics)
    await act(async () => { await result.current.loadMetrics() })
    expect(result.current.error).toBeNull()
  })
})
