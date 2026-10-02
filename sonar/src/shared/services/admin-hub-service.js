import { getUsers, getReviews } from './api-client.js'
import { getCatalog } from './catalog-service.js'

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Recopila toda la información de la plataforma Sonar incluyendo reportes.
 */
export async function fetchAdminHubContext() {
  try {
    const [users, reviews, releases, labels, vinyls] = await Promise.allSettled([
      getUsers(),
      getReviews(),
      getCatalog('releases'),
      getCatalog('labels'),
      getCatalog('vinyl'),
    ])

    const safeValue = (result) =>
      result.status === 'fulfilled' && Array.isArray(result.value) ? result.value : []

    const usersData = safeValue(users)

    // Extraer reportes de conducta de los usuarios
    const reports = usersData
      .flatMap(u => (u.conductReports || []).map(r => ({ ...r, userId: u.id, userName: u.username })))
      .filter(r => r && typeof r === 'object')

    return {
      users: usersData,
      reviews: safeValue(reviews),
      releases: safeValue(releases),
      labels: safeValue(labels),
      vinyls: safeValue(vinyls),
      reports,
    }
  } catch (err) {
    console.warn('[Admin Hub IA] No se pudieron cargar todos los datos:', err)
    return { users: [], reviews: [], releases: [], labels: [], vinyls: [], reports: [] }
  }
}

/**
 * Envía la instrucción del admin y el contexto completo al webhook de n8n Admin Hub.
 *
 * @param {string} message - Instrucción o pregunta del administrador.
 * @param {string} action - Tipo de acción: 'catalog', 'users', 'reports', 'general'.
 * @param {Object} [customContext] - Contexto opcional (si no se especifica, lo consulta automáticamente).
 */
export async function askAdminHub(message, action = 'general', customContext = null) {
  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new Error('Debes ingresar una instrucción o pregunta para Admin Hub IA.')
  }

  const cleanMessage = message.trim()
  const context = customContext || (await fetchAdminHubContext())

  // Usuario administrador
  let adminName = 'Administrador'
  try {
    const stored = localStorage.getItem('sonar_auth_user')
    if (stored) {
      const parsed = JSON.parse(stored)
      adminName = parsed.username || parsed.name || 'Administrador'
    }
  } catch {
    // Ignorar
  }

  const sessionId = `admin-hub-${Date.now()}`

  const payload = {
    message: cleanMessage,
    action,
    adminName,
    sessionId,
    context: {
      users: context.users || [],
      reviews: context.reviews || [],
      releases: context.releases || [],
      labels: context.labels || [],
      vinyls: context.vinyls || [],
      reports: context.reports || [],
    },
  }

  // URL del webhook
  const configuredUrl =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_ADMIN_HUB_WEBHOOK_URL

  const endpoints = configuredUrl
    ? [configuredUrl]
    : [
        'http://localhost:5678/webhook/sonar-admin-hub',
        'http://localhost:5678/webhook-test/sonar-admin-hub',
      ]

  for (const endpoint of endpoints) {
    // Intentar hasta 2 veces por endpoint (reintento en caso de timeout)
    const maxAttempts = 2
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(
          '%c[Admin Hub IA -> n8n Agent] Enviando instrucción:',
          'color: #6366f1; font-weight: bold;',
          { endpoint, message: cleanMessage, action, attempt }
        )

        const controller = new AbortController()
        // 120 segundos — el agente de IA puede tardar en procesar todo el contexto
        const timeoutId = setTimeout(() => controller.abort(), 120000)

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          if (data && typeof data === 'object') {
            return {
              success: true,
              analysis: data.analysis || data.message || 'Sin detalles de análisis.',
              metadata: data.metadata || {},
              quickActions: data.quickActions || [],
              action: data.action || action,
              sessionId: data.sessionId || sessionId,
              timestamp: data.timestamp || new Date().toISOString(),
              model: data.model || 'gemini',
            }
          }
        }

        // Si la respuesta no fue ok pero no fue timeout, no reintentar
        break
      } catch (err) {
        const isTimeout = err.name === 'AbortError'
        const isConnectionRefused = err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')

        if (isTimeout && attempt < maxAttempts) {
          console.warn(`[Admin Hub IA] Timeout en intento ${attempt}, reintentando...`)
          continue // Reintentar
        }

        if (isConnectionRefused) {
          console.warn(`[Admin Hub IA] n8n no disponible en ${endpoint}, probando siguiente...`)
          break // Probar siguiente endpoint
        }

        console.warn(`[Admin Hub IA] Error al contactar ${endpoint}:`, err)
        break
      }
    }
  }

  // Fallback simulado cuando n8n no está activo
  await delay(1500)
  return generateSimulatedHubResponse(cleanMessage, action, payload.context)
}

/**
 * Genera un análisis simulado de alta calidad cuando n8n no está activo.
 */
function generateSimulatedHubResponse(message, action, context) {
  const { users, reviews, releases, labels, vinyls, reports } = context
  const timestamp = new Date().toISOString()
  const lower = message.toLowerCase()

  let analysisText = ''
  let metadata = { category: 'mixed', severity: 'info', metrics: {} }
  let quickActions = []

  // --- CATÁLOGO ---
  if (action === 'catalog' || lower.includes('catálogo') || lower.includes('catalogo') ||
      lower.includes('lanzamiento') || lower.includes('sello') || lower.includes('vinilo') ||
      lower.includes('género') || lower.includes('genero')) {
    const totalReleases = releases.length
    const totalLabels = labels.length
    const totalVinyls = vinyls.length
    const genres = releases.map(r => r.genre).filter(Boolean)
    const genreCount = {}
    genres.forEach(g => { genreCount[g] = (genreCount[g] || 0) + 1 })
    const topGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).slice(0, 5)
    const noGenre = releases.filter(r => !r.genre).length

    analysisText = `### 📊 Resumen Ejecutivo
Se han analizado **${totalReleases} lanzamientos**, **${totalLabels} sellos discográficos** y **${totalVinyls} ediciones de vinilo** en el catálogo de Sonar.

### 🔍 Análisis Detallado del Catálogo
* **Lanzamientos totales:** ${totalReleases} en la base de datos.
* **Sellos discográficos registrados:** ${totalLabels}.
* **Ediciones de vinilo catalogadas:** ${totalVinyls}.
* **Géneros más representados:** ${topGenres.map(([g, c]) => `${g} (${c})`).join(', ') || 'Sin datos de género disponibles'}.
${noGenre > 0 ? `\n### 🚨 Alerta de Calidad de Datos\n**${noGenre} lanzamiento(s)** no tienen género asignado. Esto afecta la navegación y las recomendaciones.` : ''}

### 💡 Recomendaciones
* ${noGenre > 0 ? `Completar los géneros faltantes en ${noGenre} lanzamiento(s) para mejorar la clasificación.` : 'Los géneros están bien distribuidos y completos.'}
* Considerar destacar lanzamientos de sellos independientes en la portada semanal.
* Verificar ediciones de vinilo sin información de precio o año de edición.`

    metadata = { category: 'catalog', severity: noGenre > 5 ? 'warning' : 'info', metrics: { totalReleases, totalLabels, totalVinyls, missingGenres: noGenre } }
    quickActions = ['📋 Ver lanzamientos sin género', '🏷️ Analizar sellos discográficos', '💿 Revisar ediciones de vinilo']
  }
  // --- USUARIOS ---
  else if (action === 'users' || lower.includes('usuario') || lower.includes('cuenta') ||
           lower.includes('engagement') || lower.includes('activo') || lower.includes('riesgo') ||
           lower.includes('sospech')) {
    const totalUsers = users.length
    const activeUsers = users.filter(u => u.status === 'active')
    const suspendedUsers = users.filter(u => u.status === 'suspended')
    const bannedUsers = users.filter(u => u.status === 'banned')
    const usersWithReports = users.filter(u => (u.conductReports || []).length > 0)
    const highRiskUsers = users.filter(u => (u.conductReports || []).filter(r => r.status === 'pending').length >= 3)
    const avgReviews = totalUsers > 0 ? (reviews.length / totalUsers).toFixed(1) : 0

    analysisText = `### 📊 Resumen Ejecutivo
La comunidad de Sonar tiene **${totalUsers} usuarios registrados**. Se detectaron **${usersWithReports.length} usuario(s) con reportes** de conducta y **${highRiskUsers.length} usuario(s) de alto riesgo**.

### 👥 Análisis Detallado de Usuarios
* **Usuarios activos:** ${activeUsers.length} (${totalUsers > 0 ? ((activeUsers.length / totalUsers) * 100).toFixed(1) : 0}%).
* **Usuarios suspendidos:** ${suspendedUsers.length}.
* **Usuarios baneados:** ${bannedUsers.length}.
* **Ratio de reseñas por usuario:** ${avgReviews} reseñas promedio.
* **Usuarios con reportes de conducta:** ${usersWithReports.length}.
${highRiskUsers.length > 0 ? `\n### 🚨 Usuarios de Alto Riesgo\n${highRiskUsers.slice(0, 5).map(u => `* **${u.username}** (ID: ${u.id}) — ${(u.conductReports || []).filter(r => r.status === 'pending').length} reportes pendientes.`).join('\n')}` : '\n### ✅ Sin Usuarios de Alto Riesgo\nNo se detectaron usuarios con 3 o más reportes pendientes.'}

### 💡 Recomendaciones
* ${highRiskUsers.length > 0 ? `Revisar urgentemente los ${highRiskUsers.length} usuario(s) con múltiples reportes pendientes.` : 'Mantener el monitoreo periódico de reportes de conducta.'}
* Implementar campañas de re-engagement para usuarios inactivos.
* Promover el programa de "Curador Audiófilo" para usuarios con más de 5 reseñas.`

    metadata = {
      category: 'users',
      severity: highRiskUsers.length > 0 ? 'warning' : 'info',
      metrics: { totalUsers, activeUsers: activeUsers.length, suspended: suspendedUsers.length, banned: bannedUsers.length, highRisk: highRiskUsers.length, avgReviews: Number(avgReviews) }
    }
    quickActions = ['🔍 Ver usuarios de alto riesgo', '📊 Analizar engagement', '⚠️ Revisar reportes pendientes']
  }
  // --- REPORTES Y MÉTRICAS ---
  else if (action === 'reports' || lower.includes('reporte') || lower.includes('métrica') ||
           lower.includes('metrica') || lower.includes('crecimiento') || lower.includes('resumen') ||
           lower.includes('ejecutivo') || lower.includes('predicción') || lower.includes('prediccion')) {
    const totalUsers = users.length
    const totalReviews = reviews.length
    const pendingReviews = reviews.filter(r => r.status === 'pending_moderation')
    const approvedReviews = reviews.filter(r => r.status === 'approved')
    const rejectedReviews = reviews.filter(r => r.status === 'rejected')
    const pendingReports = reports.filter(r => r.status === 'pending')
    const avgRating = reviews.filter(r => r.rating).reduce((sum, r) => sum + Number(r.rating), 0) / (reviews.filter(r => r.rating).length || 1)
    const ratingDistribution = {}
    reviews.filter(r => r.rating).forEach(r => {
      const k = String(Math.round(Number(r.rating)))
      ratingDistribution[k] = (ratingDistribution[k] || 0) + 1
    })

    analysisText = `### 📊 Resumen Ejecutivo de la Plataforma SONAR
La plataforma registra **${totalUsers} usuarios** y **${totalReviews} reseñas**. Hay **${pendingReviews.length} reseñas pendientes** de moderación y **${pendingReports.length} reportes** de conducta sin resolver.

### 📈 Métricas Clave
* **Total de usuarios:** ${totalUsers}.
* **Total de reseñas:** ${totalReviews} (${approvedReviews.length} aprobadas, ${pendingReviews.length} pendientes, ${rejectedReviews.length} rechazadas).
* **Calificación promedio:** ${avgRating.toFixed(1)}/10.
* **Distribución de calificaciones:** ${Object.entries(ratingDistribution).sort((a, b) => b[0] - a[0]).map(([k, v]) => `${k}★: ${v}`).join(' | ') || 'Sin datos'}.
* **Lanzamientos en catálogo:** ${releases.length}.
* **Sellos discográficos:** ${labels.length}.
* **Ediciones de vinilo:** ${vinyls.length}.

### 📋 Estado de Moderación
* **Reseñas pendientes de revisión:** ${pendingReviews.length}.
* **Reportes de conducta pendientes:** ${pendingReports.length}.
${pendingReviews.length > 10 ? '\n### 🚨 Alerta de Acumulación\nHay más de 10 reseñas pendientes de moderación. Se recomienda ejecutar el agente de moderación o revisarlas manualmente.' : ''}

### 💡 Recomendaciones
* ${pendingReviews.length > 0 ? `Procesar las ${pendingReviews.length} reseñas pendientes de moderación.` : 'La cola de moderación está al día.'}
* ${pendingReports.length > 0 ? `Resolver los ${pendingReports.length} reportes de conducta pendientes.` : 'No hay reportes de conducta pendientes.'}
* Monitorear la calificación promedio (${avgRating.toFixed(1)}) como indicador de satisfacción de la comunidad.`

    metadata = {
      category: 'reports',
      severity: pendingReviews.length > 10 || pendingReports.length > 5 ? 'warning' : 'info',
      metrics: { totalUsers, totalReviews, pendingReviews: pendingReviews.length, pendingReports: pendingReports.length, avgRating: Number(avgRating.toFixed(1)) }
    }
    quickActions = ['🤖 Ejecutar moderación automática', '📊 Exportar métricas', '📋 Ver reportes pendientes']
  }
  // --- GENERAL / TODO-EN-UNO ---
  else {
    const totalUsers = users.length
    const activeUsers = users.filter(u => u.status === 'active').length
    const totalReviews = reviews.length
    const pendingReviews = reviews.filter(r => r.status === 'pending_moderation').length
    const pendingReports = reports.filter(r => r.status === 'pending').length
    const highRiskUsers = users.filter(u => (u.conductReports || []).filter(r => r.status === 'pending').length >= 3).length

    analysisText = `### 🎙️ Resumen General de SONAR — Admin Hub IA

### 📈 Panel de Estado
* **Usuarios registrados:** ${totalUsers} (${activeUsers} activos).
* **Reseñas totales:** ${totalReviews} (${pendingReviews} pendientes de moderación).
* **Catálogo:** ${releases.length} lanzamientos, ${labels.length} sellos, ${vinyls.length} vinilos.
* **Reportes de conducta pendientes:** ${pendingReports}.
* **Usuarios de alto riesgo:** ${highRiskUsers}.

### 🔍 Diagnóstico Rápido
${pendingReviews > 0 ? `* ⚠️ **${pendingReviews} reseña(s)** en cola de moderación.` : '* ✅ Cola de moderación al día.'}
${pendingReports > 0 ? `* ⚠️ **${pendingReports} reporte(s)** de conducta pendientes.` : '* ✅ Sin reportes de conducta pendientes.'}
${highRiskUsers > 0 ? `* 🚨 **${highRiskUsers} usuario(s)** con múltiples reportes requieren atención.` : '* ✅ Sin usuarios de alto riesgo detectados.'}

### 💡 Acciones Sugeridas
Puedes pedirme tareas específicas como:
* "Analiza el catálogo y detecta duplicados"
* "¿Qué usuarios tienen más reportes?"
* "Genera un reporte ejecutivo de crecimiento"
* "¿Qué géneros musicales están más representados?"

*(Nota: Respuesta generada en modo offline/simulado. Para inferencia con Google Gemini AI, activa el workflow n8n en http://localhost:5678)*`

    metadata = {
      category: 'mixed',
      severity: (pendingReviews > 10 || highRiskUsers > 0) ? 'warning' : 'info',
      metrics: { totalUsers, activeUsers, totalReviews, pendingReviews, pendingReports, highRiskUsers }
    }
    quickActions = ['📋 Analizar catálogo completo', '👥 Detectar usuarios de riesgo', '📊 Generar reporte ejecutivo']
  }

  return {
    success: true,
    analysis: analysisText,
    metadata,
    quickActions,
    action,
    timestamp,
    simulated: true,
  }
}

export default {
  fetchAdminHubContext,
  askAdminHub,
}
