import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  analyzeReview,
  getLyricalContext,
  getRecommendations,
} from '../src/shared/services/ia-service.js'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('getRecommendations', () => {
  it('devuelve cuatro álbumes con los campos requeridos', async () => {
    const result = getRecommendations('1')
    await vi.runAllTimersAsync()
    const albums = await result

    expect(Array.isArray(albums)).toBe(true)
    expect(albums).toHaveLength(4)
    for (const album of albums) {
      expect(album).toEqual({
        id: expect.any(String),
        title: expect.any(String),
        artist: expect.any(String),
        coverUrl: expect.any(String),
        reason: expect.any(String),
      })
    }
  })
})

describe('getLyricalContext', () => {
  it.each([
    ['Currents', 'Tame Impala'],
    ['', ''],
    [undefined, undefined],
  ])('devuelve análisis y cita para %s / %s', async (albumName, artist) => {
    const result = getLyricalContext(albumName, artist)
    await vi.runAllTimersAsync()

    expect(await result).toEqual({
      analisis: expect.any(String),
      cita: expect.any(String),
    })
  })
})

describe('analyzeReview', () => {
  it('mantiene una reseña normal pendiente sin marcarla', async () => {
    const result = analyzeReview({ content: 'Un álbum con melodías excelentes.' })
    await vi.runAllTimersAsync()

    expect(await result).toEqual({
      aiFlagged: false,
      status: 'pending_moderation',
      reason: null,
    })
  })

  it('marca lenguaje ofensivo sin aprobar ni rechazar la reseña', async () => {
    const result = analyzeReview({ content: '¡IDIOTA!' })
    await vi.runAllTimersAsync()

    expect(await result).toEqual({
      aiFlagged: true,
      status: 'pending_moderation',
      reason: expect.any(String),
    })
  })
})
