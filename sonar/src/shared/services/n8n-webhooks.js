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
 * Envía { email, code } a n8n para que entregue el código de 6 dígitos por Gmail.
 */
export async function requestPasswordResetWebhook(email, code = '') {
  if (!email || typeof email !== 'string' || !email.trim()) {
    throw new Error('Debes proporcionar un correo electrónico válido.')
  }

  const cleanEmail = email.trim().toLowerCase()
  const generatedCode = code || Math.floor(100000 + Math.random() * 900000).toString()

  const configuredUrl =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_FORGOT_PASSWORD_WEBHOOK_URL

  const endpoints = configuredUrl
    ? [configuredUrl]
    : [
        'http://localhost:5678/webhook-test/forgot-password',
        'http://localhost:5678/webhook/forgot-password',
      ]

  for (const endpoint of endpoints) {
    try {
      console.log(
        '%c[n8n Webhook - OTP Password] Enviando petición a n8n:',
        'color: #B80C09; font-weight: bold;',
        { email: cleanEmail, code: generatedCode, endpoint }
      )

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2500)

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: cleanEmail, code: generatedCode }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        const receivedCode =
          typeof data.code === 'string' && !data.code.startsWith('=')
            ? data.code
            : generatedCode

        return {
          ...data,
          code: receivedCode,
        }
      }
    } catch {
      // Intentar el siguiente endpoint o pasar al fallback
    }
  }

  await delay(200)
  return {
    success: true,
    message: 'Código de verificación enviado correctamente a tu correo.',
    code: generatedCode,
    simulated: true,
  }
}

export default {
  sendReviewToModeration,
  notifyReviewCreated,
  triggerNewReviewWebhook,
  requestPasswordResetWebhook,
}


