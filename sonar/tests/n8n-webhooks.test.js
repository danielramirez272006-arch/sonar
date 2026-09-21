import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  notifyReviewCreated,
  sendReviewToModeration,
} from '../src/shared/services/n8n-webhooks.js'

beforeEach(() => {
  vi.useFakeTimers()
  // Evita tráfico real y permite detectar si el mock intenta usar fetch.
  vi.stubGlobal('fetch', vi.fn(() => {
    throw new Error('Los webhooks mock no deben realizar peticiones HTTP.')
  }))
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('sendReviewToModeration', () => {
  it('encola una reseña y conserva su ID sin hacer peticiones HTTP', async () => {
    const result = sendReviewToModeration({ id: '101', content: 'Excelente álbum.' })
    await vi.runAllTimersAsync()

    expect(await result).toEqual({
      success: true,
      queued: true,
      reviewId: '101',
      message: expect.any(String),
    })
    expect(globalThis.fetch).not.toHaveBeenCalled()
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
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })
})
