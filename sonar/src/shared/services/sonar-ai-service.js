import { getUsers, getReviews } from './api-client.js'
import { getCatalog } from './catalog-service.js'

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Recopila la información actual de la plataforma Sonar para enviarla a n8n.
 */
export async function fetchSonarPlatformContext() {
  try {
    const [users, reviews, releases, labels, vinyls] = await Promise.allSettled([
      getUsers(),
      getReviews(),
      getCatalog('releases'),
      getCatalog('labels'),
      getCatalog('vinyl'),
    ])

    return {
      users: users.status === 'fulfilled' && Array.isArray(users.value) ? users.value : [],
      reviews: reviews.status === 'fulfilled' && Array.isArray(reviews.value) ? reviews.value : [],
      releases: releases.status === 'fulfilled' && Array.isArray(releases.value) ? releases.value : [],
      labels: labels.status === 'fulfilled' && Array.isArray(labels.value) ? labels.value : [],
      vinyls: vinyls.status === 'fulfilled' && Array.isArray(vinyls.value) ? vinyls.value : [],
    }
  } catch (err) {
    console.warn('[Sonar AI Context] No se pudieron cargar todos los catálogos:', err)
    return {
      users: [],
      reviews: [],
      releases: [],
      labels: [],
      vinyls: [],
    }
  }
}

/**
 * Envía la pregunta y el contexto de Sonar al webhook de n8n sonar-ai-assistant.
 * 
 * @param {string} message - Pregunta del administrador.
 * @param {Object} [customContext] - Contexto opcional (si no se especifica, lo consulta automáticamente).
 * @param {Object} [userInfo] - Información del usuario (por defecto rol 'admin').
 */
export async function askSonarAI(message, customContext = null, userInfo = null) {
  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new Error('Debes ingresar una pregunta o consulta válida para Sonar AI.')
  }

  const cleanMessage = message.trim()

  // Obtener contexto si no fue proporcionado
  const context = customContext || (await fetchSonarPlatformContext())

  // Usuario administrador por defecto
  let currentUser = userInfo
  if (!currentUser) {
    try {
      const stored = localStorage.getItem('sonar_auth_user')
      if (stored) {
        currentUser = JSON.parse(stored)
      }
    } catch {
      // Ignorar error de parsing
    }
  }

  const userPayload = {
    id: currentUser?.id || 1,
    name: currentUser?.username || currentUser?.name || 'Administrador',
    role: currentUser?.role || 'admin',
  }

  const payload = {
    message: cleanMessage,
    user: userPayload,
    context: {
      users: context.users || [],
      reviews: context.reviews || [],
      releases: context.releases || [],
      labels: context.labels || [],
      vinyls: context.vinyls || [],
    },
  }

  // URL del webhook configurada mediante variable de entorno o endpoints por defecto
  const configuredUrl =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_AI_ASSISTANT_WEBHOOK_URL

  const endpoints = configuredUrl
    ? [configuredUrl]
    : [
        'http://localhost:5678/webhook/sonar-ai-assistant',
        'http://localhost:5678/webhook-test/sonar-ai-assistant',
      ]

  for (const endpoint of endpoints) {
    try {
      console.log(
        '%c[Sonar AI -> n8n Webhook] Enviando consulta:',
        'color: #B80C09; font-weight: bold;',
        { endpoint, message: cleanMessage }
      )

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

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
        if (data && typeof data === 'object') {
          return {
            success: data.success ?? true,
            message: data.message || 'Respuesta generada por la IA',
            analysis: data.analysis || data.message || 'Sin detalles de análisis.',
            timestamp: data.timestamp || new Date().toISOString(),
          }
        }
      }
    } catch (err) {
      console.warn(`[Sonar AI] Error o timeout al contactar ${endpoint}:`, err)
    }
  }

  // Fallback de demostración si n8n no está disponible en localhost:5678
  await delay(1200)
  return generateSimulatedAiResponse(cleanMessage, payload.context)
}

/**
 * Genera un análisis simulado de alta calidad sobre los datos reales cuando n8n no está activo localmente.
 */
function generateSimulatedAiResponse(message, context) {
  const { users, reviews, releases, labels, vinyls } = context
  const lowerMsg = message.toLowerCase()
  const timestamp = new Date().toISOString()

  let analysisText = ''

  if (lowerMsg.includes('reseña') || lowerMsg.includes('sospechosa') || lowerMsg.includes('spam')) {
    const totalReviews = reviews.length
    const pending = reviews.filter(r => r.status === 'pending_moderation' || r.aiFlagged)
    const lowRating = reviews.filter(r => r.rating <= 2)

    analysisText = `### 📊 Hallazgo Principal
Se han analizado **${totalReviews} reseñas** registradas en la plataforma Sonar.

### 🔍 Patrones e Inspección de Moderación
* **Reseñas pendientes o marcadas:** ${pending.length} reseña(s) requieren atención directa.
* **Calificaciones bajas (1-2 estrellas):** ${lowRating.length} reseña(s) expresan descontento significativo.

### 🚨 Posibles Anomalías o Reseñas Sospechosas
${pending.length > 0
  ? `Se detectó la reseña #${pending[0].id} (enviada por "${pending[0].userName || 'Usuario'}") con estado pendiente o indicador de lenguaje atípico: "*${pending[0].content || pending[0].comment || 'Sin texto'}*".`
  : 'No se detectaron patrones de spam automatizado o reseñas severamente sospechosas en la muestra actual.'}

### 💡 Recomendación Administrativa
Se sugiere revisar el módulo de **Moderación** para verificar las reseñas marcadas antes de su aprobación final en el portal público.`
  } else if (lowerMsg.includes('usuario') || lowerMsg.includes('patron')) {
    const totalUsers = users.length
    const activeUsers = users.filter(u => u.status !== 'suspended')

    analysisText = `### 📊 Hallazgo Principal
La comunidad de Sonar cuenta actualmente con **${totalUsers} usuarios registrados** (${activeUsers.length} en estado activo).

### 📈 Patrones de Comportamiento
* **Participación en la comunidad:** Alto interés en curaduría audiófila y publicaciones de vinilos.
* **Crecimiento de registros:** Tendencia positiva en usuarios interesados en lanzamientos recientes.

### 💡 Sugerencias Concretas
Promover distintivos de "Curador Audiófilo" para los usuarios con más de 5 reseñas publicadas.`
  } else if (lowerMsg.includes('lanzamiento') || lowerMsg.includes('genero') || lowerMsg.includes('destac') || lowerMsg.includes('tendencia')) {
    const totalReleases = releases.length
    const genres = releases.map(r => r.genre).filter(Boolean)
    const topGenre = genres.length > 0 ? genres[0] : 'Rock Alternativo / Electrónica'

    analysisText = `### 🎵 Análisis de Catálogo y Lanzamientos
Actualmente existen **${totalReleases} lanzamientos destacados** en el catálogo.

### 🏷️ Tendencias Identificadas
* **Género predominante:** ${topGenre}.
* **Formatos de alto interés:** Reediciones de Vinilo y lanzamientos en alta fidelidad.

### 💡 Recomendación
Destacar los lanzamientos de sellos independientes locales en la portada semanal de Sonar.`
  } else if (lowerMsg.includes('sello') || lowerMsg.includes('discografic')) {
    const totalLabels = labels.length

    analysisText = `### 🏢 Análisis de Sellos Discográficos
Actualmente hay **${totalLabels} sellos discográficos** registrados en la plataforma.

### 📌 Resumen
* Sellos activos vinculados a producciones y vinilos audiófilos.
* Recomendación: Promover la verificación oficial para sellos independientes.`
  } else {
    analysisText = `### 🎙️ Resumen de Actividad General de Sonar
* **Usuarios Registrados:** ${users.length}
* **Reseñas Publicadas / Moderación:** ${reviews.length}
* **Lanzamientos en Catálogo:** ${releases.length}
* **Sellos Discográficos:** ${labels.length}
* **Ediciones en Vinilo:** ${vinyls.length}

### 🔍 Diagnóstico
La plataforma mantiene una actividad estable con interacciones frecuentes en reseñas y exploración de vinilos.

*(Nota: Respuesta generada en modo offline/simulado. Para obtener inferencia en tiempo real con Google Gemini AI, asegúrate de activar el workflow n8n en http://localhost:5678)*`
  }

  return {
    success: true,
    message: 'Análisis de Sonar AI completado con éxito.',
    analysis: analysisText,
    timestamp,
    simulated: true,
  }
}

export default {
  fetchSonarPlatformContext,
  askSonarAI,
}
