import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  notifyReviewCreated,
  sendReviewToModeration,
} from '../src/shared/services/n8n-webhooks.js'

beforeEach(() => {
  vi.useFakeTimers()
  // El fetch mockeado simula que n8n no está disponible (lanza error).
  // sendReviewToModeration intentará conectar y luego caerá al fallback local.
  vi.stubGlobal('fetch', vi.fn(() => {
    throw new Error('n8n no disponible en entorno de test.')
  }))
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('sendReviewToModeration', () => {
  it('encola una reseña y conserva su ID, cayendo al fallback si n8n no responde', async () => {
    const result = sendReviewToModeration({ id: '101', content: 'Excelente álbum.' })
    await vi.runAllTimersAsync()

    expect(await result).toEqual({
      success: true,
      queued: true,
      reviewId: '101',
      message: expect.any(String),
      simulated: true,
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

