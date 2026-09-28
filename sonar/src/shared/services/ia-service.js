

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export async function getRecommendations(userId) {
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

// Lista extendida de términos ofensivos, lenguaje subido de tono o spam
const OFFENSIVE_TERMS = [
  'idiota', 'idiotas', 'imbécil', 'imbecil', 'imbeciles', 'mierda', 'basura', 'estúpido', 'estupido',
  'maldito', 'maldita', 'estupida', 'puto', 'puta', 'pendejo', 'pendeja', 'asco', 'horrible', 'inútil',
  'inutil', 'estafa', 'fraude', 'hijo de', 'perra', 'bastardo', 'spam', 'odio', 'muérete', 'muerete'
]

/**
 * Dispara la notificación por Webhook de n8n para enviar correo de advertencia al usuario por mal comportamiento.
 */
export async function notifyReviewWarningWebhook(reviewData, userData, reason) {
  const email = userData?.email || 'usuario@sonar.com'
  const username = userData?.username || userData?.name || reviewData.userName || 'Usuario'

  const payload = {
    action: 'review_warning',
    reviewId: reviewData.id,
    userId: reviewData.userId,
    username,
    email,
    content: reviewData.content,
    reason: reason || 'Lenguaje o contenido subido de tono detectado por IA',
    timestamp: new Date().toISOString(),
  }

  const configuredUrl =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_REVIEW_WARNING_WEBHOOK_URL

  const endpoints = configuredUrl
    ? [configuredUrl]
    : [
        'http://localhost:5678/webhook/sonar-review-warning',
        'http://localhost:5678/webhook-test/sonar-review-warning',
      ]

  for (const endpoint of endpoints) {
    try {
      console.log(
        '%c[n8n Webhook - Advertencia de Conducta] Enviando correo de aviso:',
        'color: #B80C09; font-weight: bold;',
        { endpoint, payload }
      )

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        return await response.json()
      }
    } catch {
      // Ignorar fallback
    }
  }

  return {
    success: true,
    message: `Aviso enviado correctamente al correo ${email}.`,
    simulated: true,
  }
}

/** Vista orientativa del panel manual. Las sanciones automaticas pertenecen al agente del servidor. */
export async function analyzeReview(review) {
  await delay(400)
  const content = typeof review === 'string' ? review : (typeof review?.content === 'string' ? review.content : '')
  const words = content.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []
  const aiFlagged = words.some(word => OFFENSIVE_TERMS.includes(word)) || review?.aiFlagged === true
  return {
    aiFlagged,
    status: 'pending_moderation',
    reason: aiFlagged ? 'La rese\u00f1a contiene lenguaje subido de tono o t\u00e9rminos inapropiados.' : null,
  }
}

export default {
  analyzeReview,
  getRecommendations,
  getLyricalContext,
  notifyReviewWarningWebhook,
}
