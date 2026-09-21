function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// Al conectar el webhook real, configurar su URL mediante el entorno:
// const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_REVIEW_WEBHOOK_URL

export async function sendReviewToModeration(review) {
  if (review === null || typeof review !== 'object' || Array.isArray(review)) {
    throw new Error('La reseña debe ser un objeto válido para enviarla a moderación.')
  }

  // Sustituir esta espera por el envío al webhook cuando esté disponible.
  await delay(500)

  return {
    success: true,
    queued: true,
    reviewId: review.id ?? null,
    message: 'La reseña fue enviada a moderación.',
  }
}

export async function notifyReviewCreated(review) {
  return sendReviewToModeration(review)
}

export const triggerNewReviewWebhook = async (reviewData = {}) => {
  console.log(
    '%c[n8n Webhook] Disparo simulado hacia n8n workflow:',
    'color: #B80C09; font-weight: bold;',
    {
      payload: reviewData,
      timestamp: new Date().toISOString(),
    }
  )

  return {
    success: true,
    message: 'Webhook recibido y encolado en n8n.',
    simulated: true,
  }
}

export default {
  sendReviewToModeration,
  notifyReviewCreated,
  triggerNewReviewWebhook,
}

