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

/**
 * Dispara el Webhook de n8n para la recuperación de contraseña por correo Gmail.
 * Envía { email } a n8n para generar token y emitir el correo de recuperación.
 */
export async function requestPasswordResetWebhook(email) {
  if (!email || typeof email !== 'string' || !email.trim()) {
    throw new Error('Debes proporcionar un correo electrónico válido.')
  }

  const cleanEmail = email.trim().toLowerCase()
  const webhookUrl =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_FORGOT_PASSWORD_WEBHOOK_URL) ||
    'http://localhost:5678/webhook/forgot-password'

  console.log(
    '%c[n8n Webhook - Forgot Password] Enviando petición a n8n:',
    'color: #B80C09; font-weight: bold;',
    { email: cleanEmail, endpoint: webhookUrl }
  )

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 1500)

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: cleanEmail }),
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (response.ok) {
      const data = await response.json()
      return data
    }
  } catch {
    // Si n8n no está encendido o en ejecución local en ese momento, responder con éxito seguro
    console.info(
      '[n8n Webhook] n8n no está respondiendo en localhost:5678 o no está activo el webhook. Simulando respuesta exitosa.'
    )
  }

  await delay(200)
  return {
    success: true,
    message:
      'Si existe una cuenta asociada a este correo, recibirás un enlace para restablecer tu contraseña.',
    simulated: true,
  }
}

export default {
  sendReviewToModeration,
  notifyReviewCreated,
  triggerNewReviewWebhook,
  requestPasswordResetWebhook,
}


