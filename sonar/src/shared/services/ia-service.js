function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export async function getRecommendations(userId) {
  // Reservado para personalizar las recomendaciones con el backend real.
  void userId
  await delay(500)

  return [
    {
      id: 'album_rec_01',
      title: 'Currents',
      artist: 'Tame Impala',
      coverUrl: '',
      reason: 'Recomendado por su combinación de psicodelia, electrónica y pop.',
    },
    {
      id: 'album_rec_02',
      title: 'Dummy',
      artist: 'Portishead',
      coverUrl: '',
      reason: 'Puede interesarte por sus atmósferas electrónicas y melancólicas.',
    },
    {
      id: 'album_rec_03',
      title: 'Mezzanine',
      artist: 'Massive Attack',
      coverUrl: '',
      reason: 'Coincide con una exploración de sonidos electrónicos y oscuros.',
    },
    {
      id: 'album_rec_04',
      title: 'In Rainbows',
      artist: 'Radiohead',
      coverUrl: '',
      reason: 'Recomendado por su mezcla de rock alternativo y producción experimental.',
    },
  ]
}

export async function getLyricalContext(albumName, artist) {
  await delay(1500)

  const title = typeof albumName === 'string' && albumName.trim()
    ? albumName.trim()
    : 'un álbum sin especificar'
  const artistName = typeof artist === 'string' && artist.trim()
    ? artist.trim()
    : 'un artista sin especificar'

  return {
    analisis: `Análisis de demostración de ${title}, de ${artistName}: este mock propone explorar la relación entre las melodías, el ritmo y las emociones del álbum.`,
    cita: 'Frase original de demostración, no extraída de una canción: «El eco dibuja caminos de luz».',
  }
}

export async function analyzeReview(review) {
  const content = typeof review === 'string' ? review : (typeof review?.content === 'string' ? review.content : '')
  const reviewId = typeof review === 'object' ? (review?.id || '') : ''
  const userId = typeof review === 'object' ? (review?.userId || '') : ''
  const albumId = typeof review === 'object' ? (review?.albumId || '') : ''

  // ── Intentar análisis vía n8n webhook ──
  const configuredUrl =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_REVIEW_MODERATION_WEBHOOK_URL

  const endpoints = configuredUrl
    ? [configuredUrl]
    : [
        'http://localhost:5678/webhook-test/review-moderation',
        'http://localhost:5678/webhook/review-moderation',
      ]

  for (const endpoint of endpoints) {
    try {
      console.log(
        '%c[n8n Webhook - Moderación IA] Enviando reseña a análisis:',
        'color: #B80C09; font-weight: bold;',
        { reviewId, endpoint }
      )

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, reviewId, userId, albumId, adminEmail: 'admin@sonar.audio' }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        return {
          aiFlagged: data.aiFlagged ?? false,
          status: data.status || 'pending_moderation',
          reason: data.reason || null,
          severity: data.severity || 'none',
          flaggedWords: data.flaggedWords || [],
          analyzedAt: data.analyzedAt || new Date().toISOString(),
          source: 'n8n',
        }
      }
    } catch {
      // Intentar siguiente endpoint o fallback local
    }
  }

  // ── Fallback: análisis local si n8n no está disponible ──
  await delay(500)

  const words = content.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []
  // Lista mínima de ejemplo; no constituye un sistema real de moderación.
  const offensiveWords = ['idiota', 'idiotas', 'imbécil', 'imbecil', 'mierda']
  const aiFlagged = words.some(word => offensiveWords.includes(word))

  return {
    aiFlagged,
    status: 'pending_moderation',
    reason: aiFlagged
      ? 'La reseña contiene lenguaje que requiere revisión.'
      : null,
    source: 'local',
  }
}

export default {
  analyzeReview,
  getRecommendations,
  getLyricalContext,
}


