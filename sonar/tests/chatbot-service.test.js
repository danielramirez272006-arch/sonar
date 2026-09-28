import { describe, it, expect, vi, beforeEach } from 'vitest'
import { sendChatMessage } from '../src/shared/services/chatbot-service.js'

describe('Sonar AI Sommelier Chatbot Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('rechaza mensajes vacíos o con solo espacios', async () => {
    await expect(sendChatMessage('')).rejects.toThrow('El mensaje no puede estar vacío.')
    await expect(sendChatMessage('   ')).rejects.toThrow('El mensaje no puede estar vacío.')
  })

  it('responde usando el webhook de n8n cuando está disponible', async () => {
    const mockN8nResponse = {
      message: 'Te recomiendo Aja de Steely Dan por su mezcla audiófila.',
      suggestions: [
        {
          title: 'Aja',
          artist: 'Steely Dan',
          year: '1977',
          genre: 'Jazz Rock',
          reason: 'Masterizado con rango dinámico excelente.',
        },
      ],
      quickReplies: ['💿 Más Jazz', '🎸 Rock Clásico'],
      sessionId: 'test-session-123',
    }

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockN8nResponse,
    })

    const result = await sendChatMessage('Recomiéndame algo audiófilo', 'test-session-123')

    expect(result.success).toBe(true)
    expect(result.source).toBe('n8n-gemini')
    expect(result.message).toContain('Steely Dan')
    expect(result.suggestions).toHaveLength(1)
    expect(result.suggestions[0].title).toBe('Aja')
  })

  it('utiliza el motor de contingencia local inteligente si n8n no responde', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const result = await sendChatMessage('Recomiéndame algo de jazz japones', 'test-local-session')

    expect(result.success).toBe(true)
    expect(result.source).toBe('local-sommelier')
    expect(result.message).toContain('Jazz')
    expect(result.suggestions.length).toBeGreaterThan(0)
    expect(result.quickReplies.length).toBeGreaterThan(0)
  })

  it('brinda respuesta de bienvenida y sugerencias generales ante preguntas abiertas', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const result = await sendChatMessage('Hola qué tal', 'test-greeting')

    expect(result.success).toBe(true)
    expect(result.source).toBe('local-sommelier')
    expect(result.message).toContain('Sonaria')
    expect(result.suggestions).toHaveLength(2)
  })
})
