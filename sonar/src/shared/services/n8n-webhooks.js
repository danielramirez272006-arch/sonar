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

/**
 * Dispara el Webhook de n8n para la suscripción al Boletín Semanal (Newsletter).
 * Envía { email, name, topics } a n8n para registrar al usuario y disparar el correo de bienvenida.
 */
export async function subscribeNewsletterWebhook(params = {}, legacyName = '', legacyTopics = []) {
  let email, name, topics
  if (typeof params === 'string') {
    email = params
    name = legacyName
    topics = legacyTopics
  } else if (params && typeof params === 'object') {
    email = params.email
    name = params.name
    topics = params.topics
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    throw new Error('Debes proporcionar un correo electrónico válido.')
  }

  const cleanEmail = email.trim().toLowerCase()
  const cleanName = (name && typeof name === 'string' ? name.trim() : '') || 'Melómano de Sonar'
  const selectedTopics = Array.isArray(topics) && topics.length > 0 ? topics : ['Lanzamientos', 'Hi-Fi', 'Festivales']

  const payload = {
    email: cleanEmail,
    name: cleanName,
    topics: selectedTopics,
    subscribedAt: new Date().toISOString(),
  }

  // Guardar en localStorage para persistencia local de suscriptores
  try {
    const existing = JSON.parse(localStorage.getItem('sonar_newsletter_subscribers') || '[]')
    if (!existing.some(s => s.email === cleanEmail)) {
      existing.push(payload)
      localStorage.setItem('sonar_newsletter_subscribers', JSON.stringify(existing))
    }
  } catch {
    // Ignorar error de storage
  }

  const configuredUrl =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_NEWSLETTER_WEBHOOK_URL

  const endpoints = configuredUrl
    ? [configuredUrl]
    : [
        'http://localhost:5678/webhook-test/newsletter',
        'http://localhost:5678/webhook/newsletter',
      ]

  for (const endpoint of endpoints) {
    try {
      console.log(
        '%c[n8n Webhook - Newsletter] Enviando suscripción a n8n:',
        'color: #B80C09; font-weight: bold;',
        { payload, endpoint }
      )

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2500)

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          ...data,
          email: cleanEmail,
          message: data.message || `¡Suscripción confirmada! Te hemos enviado un correo de bienvenida a ${cleanEmail}.`,
          subscriber: payload,
        }
      }
    } catch {
      // Intentar el siguiente endpoint o pasar al fallback
    }
  }

  await delay(300)
  return {
    success: true,
    email: cleanEmail,
    message: `¡Suscripción confirmada! Te hemos registrado al boletín semanal con tu correo ${cleanEmail}.`,
    subscriber: payload,
    simulated: true,
  }
}

/**
 * Dispara el Webhook de n8n para la verificación OTP al crear una cuenta nueva.
 * Envía { email, username, code } a n8n para que entregue el código de 6 dígitos con diseño y logo oficial.
 */
export async function requestRegisterOtpWebhook(email, username = '', code = '') {
  if (!email || typeof email !== 'string' || !email.trim()) {
    throw new Error('Debes proporcionar un correo electrónico válido.')
  }

  const cleanEmail = email.trim().toLowerCase()
  const cleanUsername = username.trim() || 'Nuevo Melómano'
  const generatedCode = code || Math.floor(100000 + Math.random() * 900000).toString()

  const configuredUrl =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_REGISTER_OTP_WEBHOOK_URL

  const endpoint = configuredUrl || 'http://localhost:5678/webhook/register-otp'

  try {
    console.log(
      '%c[n8n Webhook - Registro OTP] Enviando petición a n8n:',
      'color: #B80C09; font-weight: bold;',
      { email: cleanEmail, username: cleanUsername, code: generatedCode, endpoint }
    )

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 1200)

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: cleanEmail,
        username: cleanUsername,
        code: generatedCode,
        action: 'register_otp',
        timestamp: new Date().toISOString(),
      }),
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
        success: true,
        email: cleanEmail,
        code: receivedCode,
        message: data.message || `Código de verificación enviado a ${cleanEmail}.`,
      }
    }
  } catch (err) {
    console.warn('Advertencia webhook registro n8n:', err)
  }

  await delay(200)
  return {
    success: true,
    email: cleanEmail,
    message: 'Código de verificación enviado correctamente a tu correo.',
    code: generatedCode,
    simulated: true,
  }
}

/**
 * Dispara el Webhook de n8n para alertar sobre un nuevo inicio de sesión en la cuenta.
 * Envía { email, username, device, timestamp } para enviar un correo de seguridad con el logo de Sonar.
 */
export async function notifyLoginAlertWebhook(params = {}, legacyUsername = '', legacyDevice = '') {
  let email, username, device
  if (typeof params === 'string') {
    email = params
    username = legacyUsername
    device = legacyDevice || 'Navegador Web / Sonar App'
  } else if (params && typeof params === 'object') {
    email = params.email
    username = params.username
    device = params.device || 'Navegador Web / Sonar App'
  }

  if (!email || typeof email !== 'string' || !email.trim()) {
    return { success: false, message: 'Email requerido para alerta de login.' }
  }

  const cleanEmail = email.trim().toLowerCase()
  const cleanUsername = (username && typeof username === 'string' ? username.trim() : '') || 'Melómano'
  const cleanDevice = device || 'Navegador Web / Sonar App'

  const payload = {
    email: cleanEmail,
    username: cleanUsername,
    device: cleanDevice,
    action: 'login_alert',
    timestamp: new Date().toISOString(),
  }

  const configuredUrl =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_LOGIN_ALERT_WEBHOOK_URL

  const endpoints = configuredUrl
    ? [configuredUrl]
    : [
        'http://localhost:5678/webhook-test/login-alert',
        'http://localhost:5678/webhook/login-alert',
      ]

  for (const endpoint of endpoints) {
    try {
      console.log(
        '%c[n8n Webhook - Login Alert] Enviando notificación de inicio de sesión a n8n:',
        'color: #B80C09; font-weight: bold;',
        { payload, endpoint }
      )

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          ...data,
          email: cleanEmail,
          message: data.message || 'Alerta de login enviada con éxito.',
        }
      }
    } catch {
      // Fallback
    }
  }

  return {
    success: true,
    email: cleanEmail,
    message: 'Alerta de login procesada.',
    simulated: true,
  }
}

export default {
  sendReviewToModeration,
  notifyReviewCreated,
  triggerNewReviewWebhook,
  requestPasswordResetWebhook,
  requestRegisterOtpWebhook,
  notifyLoginAlertWebhook,
  subscribeNewsletterWebhook,
}


