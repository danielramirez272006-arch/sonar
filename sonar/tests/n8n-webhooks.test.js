import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  notifyReviewCreated,
  sendReviewToModeration,
} from '../src/shared/services/n8n-webhooks.js'

beforeEach(() => {
  vi.useFakeTimers()
  // El fetch mockeado simula que n8n no está disponible (lanza error).
  // El servicio debe informar el fallo sin simular un envío exitoso.
  vi.stubGlobal('fetch', vi.fn(() => {
    throw new Error('n8n no disponible en entorno de test.')
  }))
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('sendReviewToModeration', () => {
  it('envía el ID como texto al webhook de prueba', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
    expect((await sendReviewToModeration({ id: 101, content: 'Bien' })).success).toBe(true)
    expect(fetch.mock.calls[0][0]).toBe('/api/n8n/webhook-test/review-moderation')
    expect(JSON.parse(fetch.mock.calls[0][1].body).reviewId).toBe('101')
  })

  it('prueba producción cuando la ruta de prueba devuelve 404', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 404 })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
    expect((await sendReviewToModeration({ id: '101', content: 'Bien' })).success).toBe(true)
    expect(fetch.mock.calls[1][0]).toBe('/api/n8n/webhook/review-moderation')
  })
  it('informa el fallo y conserva el ID si n8n no responde', async () => {
    const result = sendReviewToModeration({ id: '101', content: 'Excelente álbum.' })
    await vi.runAllTimersAsync()

    expect(await result).toEqual({
      success: false,
      queued: false,
      reviewId: '101',
      message: expect.any(String),
    })
  })

  it('rechaza null con un Error sin hacer peticiones HTTP', async () => {
    await expect(sendReviewToModeration(null)).rejects.toBeInstanceOf(Error)
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })
})

describe('notifyReviewCreated', () => {
  it('devuelve el mismo resultado que sendReviewToModeration', async () => {
    const review = { id: '101', content: 'Excelente álbum.' }
    const result = Promise.all([
      sendReviewToModeration(review),
      notifyReviewCreated(review),
    ])
    await vi.runAllTimersAsync()
    const [sent, notified] = await result

    expect(notified).toEqual(sent)
  })
})

