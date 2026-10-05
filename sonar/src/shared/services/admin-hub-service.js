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
export async function askAdminHub(message, action = 'general', customContext = null, language = 'es') {
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

  const languageNames = {
    es: 'Spanish (Español)',
    en: 'English',
    ja: 'Japanese (日本語)',
    fr: 'French (Français)',
    it: 'Italian (Italiano)',
    zh: 'Chinese (中文)',
  }
  const langName = languageNames[language] || 'Spanish (Español)'

  const languageInstruction = `\n\n[CRITICAL SYSTEM INSTRUCTION: The active user interface language is ${langName} (${language}). You MUST write your ENTIRE response, including markdown headings, executive summary, detailed analysis, bullet points, alerts, recommendations, and suggested quickActions in ${langName} (${language}).]`

  const payload = {
    message: cleanMessage + languageInstruction,
    action,
    adminName,
    sessionId,
    language: language || 'es',
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
          { endpoint, message: cleanMessage, action, language: payload.language, attempt }
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
  return generateSimulatedHubResponse(cleanMessage, action, payload.context, language || 'es')
}

/**
 * Genera un análisis simulado de alta calidad cuando n8n no está activo.
 */
function generateSimulatedHubResponse(message, action, context, language = 'es') {
  const { users, reviews, releases, labels, vinyls, reports } = context
  const timestamp = new Date().toISOString()
  const lower = message.toLowerCase()

  let analysisText = ''
  let metadata = { category: 'mixed', severity: 'info', metrics: {} }
  let quickActions = []

  const isEn = language === 'en'
  const isFr = language === 'fr'
  const isIt = language === 'it'
  const isZh = language === 'zh'
  const isJa = language === 'ja'

  // --- CATÁLOGO ---
  if (action === 'catalog' || lower.includes('catálogo') || lower.includes('catalogo') ||
      lower.includes('lanzamiento') || lower.includes('sello') || lower.includes('vinilo') ||
      lower.includes('género') || lower.includes('genero') || lower.includes('catalog') ||
      lower.includes('release') || lower.includes('vinyl') || lower.includes('genre')) {
    const totalReleases = releases.length
    const totalLabels = labels.length
    const totalVinyls = vinyls.length
    const genres = releases.map(r => r.genre).filter(Boolean)
    const genreCount = {}
    genres.forEach(g => { genreCount[g] = (genreCount[g] || 0) + 1 })
    const topGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).slice(0, 5)
    const noGenre = releases.filter(r => !r.genre).length

    if (isEn) {
      analysisText = `### 📊 Executive Summary\nAnalyzed **${totalReleases} releases**, **${totalLabels} record labels**, and **${totalVinyls} vinyl editions** in the Sonar catalog.\n\n### 🔍 Catalog Detailed Analysis\n* **Total releases:** ${totalReleases} in database.\n* **Record labels registered:** ${totalLabels}.\n* **Vinyl editions cataloged:** ${totalVinyls}.\n* **Top genres:** ${topGenres.map(([g, c]) => `${g} (${c})`).join(', ') || 'No genre data'}.\n${noGenre > 0 ? `\n### 🚨 Data Quality Alert\n**${noGenre} release(s)** do not have a genre assigned.` : ''}\n\n### 💡 Recommendations\n* Complete missing genres to improve browsing.\n* Highlight independent label releases on weekly showcase.`
      quickActions = ['📋 View releases without genre', '🏷️ Analyze record labels', '💿 Review vinyl editions']
    } else if (isFr) {
      analysisText = `### 📊 Résumé Exécutif\nAnalyse de **${totalReleases} sorties**, **${totalLabels} labels** et **${totalVinyls} éditions vinyles**.\n\n### 🔍 Analyse du Catalogue\n* **Sorties totales:** ${totalReleases}.\n* **Labels enregistrés:** ${totalLabels}.\n* **Éditions vinyles:** ${totalVinyls}.\n* **Genres principaux:** ${topGenres.map(([g, c]) => `${g} (${c})`).join(', ') || 'Pas de données'}.\n\n### 💡 Recommandations\n* Compléter les genres manquants.`
      quickActions = ['📋 Voir sorties sans genre', '🏷️ Analyser labels', '💿 Réviser éditions vinyles']
    } else if (isIt) {
      analysisText = `### 📊 Sintesi Esecutiva\nAnalizzati **${totalReleases} singoli/album**, **${totalLabels} etichette** e **${totalVinyls} edizioni in vinile**.\n\n### 🔍 Analisi Dettagliata\n* **Totale uscite:** ${totalReleases}.\n* **Etichette:** ${totalLabels}.\n* **Edizioni vinile:** ${totalVinyls}.\n\n### 💡 Raccomandazioni\n* Completare i generi mancanti.`
      quickActions = ['📋 Visualizza uscite senza genere', '🏷️ Analizza etichette', '💿 Rivedi edizioni vinile']
    } else if (isZh) {
      analysisText = `### 📊 执行摘要\n已分析 Sonar 目录中的 **${totalReleases} 个发行项**、**${totalLabels} 个唱片公司** 和 **${totalVinyls} 个黑胶版本**。\n\n### 🔍 目录详细分析\n* **总发行项:** ${totalReleases}.\n* **已注册公司:** ${totalLabels}.\n* **黑胶版本:** ${totalVinyls}.\n\n### 💡 建议\n* 完善缺失的音乐流派分类。`
      quickActions = ['📋 查看无流派的发行项', '🏷️ 分析唱片公司', '💿 审查黑胶版本']
    } else if (isJa) {
      analysisText = `### 📊 エグゼクティブサマリー\nSonarカタログ内の**${totalReleases}件のリリース**、**${totalLabels}件のレーベル**、**${totalVinyls}件のヴァイナル盤**を分析しました。\n\n### 🔍 カタログ詳細分析\n* **総リリース数:** ${totalReleases}.\n* **登録レーベル数:** ${totalLabels}.\n* **ヴァイナル盤数:** ${totalVinyls}.\n\n### 💡 おすすめ\n* ジャンル未設定のリリースの補完を推進してください。`
      quickActions = ['📋 ジャンル未設定リリースを表示', '🏷️ レコードレーベルを分析', '💿 ヴァイナル盤をレビュー']
    } else {
      analysisText = `### 📊 Resumen Ejecutivo\nSe han analizado **${totalReleases} lanzamientos**, **${totalLabels} sellos discográficos** y **${totalVinyls} ediciones de vinilo** en el catálogo de Sonar.\n\n### 🔍 Análisis Detallado del Catálogo\n* **Lanzamientos totales:** ${totalReleases} en la base de datos.\n* **Sellos discográficos registrados:** ${totalLabels}.\n* **Ediciones de vinilo catalogadas:** ${totalVinyls}.\n* **Géneros más representados:** ${topGenres.map(([g, c]) => `${g} (${c})`).join(', ') || 'Sin datos de género disponibles'}.\n${noGenre > 0 ? `\n### 🚨 Alerta de Calidad de Datos\n**${noGenre} lanzamiento(s)** no tienen género asignado.` : ''}\n\n### 💡 Recomendaciones\n* ${noGenre > 0 ? `Completar los géneros faltantes en ${noGenre} lanzamiento(s).` : 'Los géneros están completos.'}`
      quickActions = ['📋 Ver lanzamientos sin género', '🏷️ Analizar sellos discográficos', '💿 Revisar ediciones de vinilo']
    }

    metadata = { category: 'catalog', severity: noGenre > 5 ? 'warning' : 'info', metrics: { totalReleases, totalLabels, totalVinyls, missingGenres: noGenre } }
  }
  // --- USUARIOS ---
  else if (action === 'users' || lower.includes('usuario') || lower.includes('cuenta') ||
           lower.includes('engagement') || lower.includes('activo') || lower.includes('riesgo') ||
           lower.includes('sospech') || lower.includes('user') || lower.includes('risk')) {
    const totalUsers = users.length
    const activeUsers = users.filter(u => u.status === 'active')
    const suspendedUsers = users.filter(u => u.status === 'suspended')
    const bannedUsers = users.filter(u => u.status === 'banned')
    const usersWithReports = users.filter(u => (u.conductReports || []).length > 0)
    const highRiskUsers = users.filter(u => (u.conductReports || []).filter(r => r.status === 'pending').length >= 3)
    const avgReviews = totalUsers > 0 ? (reviews.length / totalUsers).toFixed(1) : 0

    if (isEn) {
      analysisText = `### 📊 Executive Summary\nSonar community has **${totalUsers} registered users**. Detected **${usersWithReports.length} reported user(s)** and **${highRiskUsers.length} high-risk user(s)**.\n\n### 👥 Detailed User Analysis\n* **Active users:** ${activeUsers.length}.\n* **Suspended users:** ${suspendedUsers.length}.\n* **Banned users:** ${bannedUsers.length}.\n* **User review ratio:** ${avgReviews} average reviews.\n\n### 💡 Recommendations\n* Review ${highRiskUsers.length} high-risk accounts promptly.`
      quickActions = ['🔍 View high-risk users', '📊 Analyze engagement', '⚠️ Review pending reports']
    } else if (isFr) {
      analysisText = `### 📊 Résumé Exécutif\nLa communauté Sonar compte **${totalUsers} utilisateurs enregistrés**. **${highRiskUsers.length} utilisateur(s) à haut risque**.\n\n### 💡 Recommandations\n* Réviser urgemment les comptes à haut risque.`
      quickActions = ['🔍 Voir utilisateurs à haut risque', '📊 Analyser engagement', '⚠️ Réviser signalements']
    } else if (isIt) {
      analysisText = `### 📊 Sintesi Esecutiva\nCommunity Sonar: **${totalUsers} utenti**. Rilevati **${highRiskUsers.length} utenti ad alto rischio**.\n\n### 💡 Raccomandazioni\n* Rivedere urgentemente gli utenti ad alto rischio.`
      quickActions = ['🔍 Utenti ad alto rischio', '📊 Analizza engagement', '⚠️ Segnalazioni in sospeso']
    } else if (isZh) {
      analysisText = `### 📊 执行摘要\nSonar 社区拥有 **${totalUsers} 名注册用户**。检测到 **${highRiskUsers.length} 名高风险用户**。\n\n### 💡 建议\n* 优先审查高风险账号。`
      quickActions = ['🔍 查看高风险用户', '📊 分析互动度', '⚠️ 审查待处理举报']
    } else if (isJa) {
      analysisText = `### 📊 エグゼクティブサマリー\nSonarコミュニティには**${totalUsers}人の登録ユーザー**がいます。**${highRiskUsers.length}人の高リスクユーザー**が検出されました。\n\n### 💡 おすすめ\n* 高リスクアカウントを早急にレビューしてください。`
      quickActions = ['🔍 高リスクユーザーを表示', '📊 エンゲージメントを分析', '⚠️ 保留中通報をレビュー']
    } else {
      analysisText = `### 📊 Resumen Ejecutivo\nLa comunidad de Sonar tiene **${totalUsers} usuarios registrados**. Se detectaron **${usersWithReports.length} usuario(s) con reportes** de conducta y **${highRiskUsers.length} usuario(s) de alto riesgo**.\n\n### 👥 Análisis Detallado de Usuarios\n* **Usuarios activos:** ${activeUsers.length}.\n* **Usuarios suspendidos:** ${suspendedUsers.length}.\n* **Usuarios baneados:** ${bannedUsers.length}.\n* **Ratio de reseñas por usuario:** ${avgReviews} reseñas promedio.\n\n### 💡 Recomendaciones\n* ${highRiskUsers.length > 0 ? `Revisar urgentemente los ${highRiskUsers.length} usuario(s) de alto riesgo.` : 'Mantener el monitoreo periódico.'}`
      quickActions = ['🔍 Ver usuarios de alto riesgo', '📊 Analizar engagement', '⚠️ Revisar reportes pendientes']
    }

    metadata = {
      category: 'users',
      severity: highRiskUsers.length > 0 ? 'warning' : 'info',
      metrics: { totalUsers, activeUsers: activeUsers.length, suspended: suspendedUsers.length, banned: bannedUsers.length, highRisk: highRiskUsers.length, avgReviews: Number(avgReviews) }
    }
  }
  // --- REPORTES Y MÉTRICAS ---
  else if (action === 'reports' || lower.includes('reporte') || lower.includes('métrica') ||
           lower.includes('metrica') || lower.includes('crecimiento') || lower.includes('resumen') ||
           lower.includes('ejecutivo') || lower.includes('report') || lower.includes('metric')) {
    const totalUsers = users.length
    const totalReviews = reviews.length
    const pendingReviews = reviews.filter(r => r.status === 'pending_moderation')
    const pendingReports = reports.filter(r => r.status === 'pending')

    if (isEn) {
      analysisText = `### 📊 Platform Executive Summary\nRecords **${totalUsers} users** and **${totalReviews} reviews**. There are **${pendingReviews.length} pending reviews** and **${pendingReports.length} unresolved reports**.`
      quickActions = ['🤖 Run auto-moderation', '📊 Export metrics', '📋 View pending reports']
    } else if (isFr) {
      analysisText = `### 📊 Résumé Exécutif\nPlatforme: **${totalUsers} utilisateurs** et **${totalReviews} avis**. En attente: **${pendingReviews.length} avis**.`
      quickActions = ['🤖 Lancer modération auto', '📊 Exporter métriques', '📋 Signalements en attente']
    } else if (isIt) {
      analysisText = `### 📊 Sintesi Esecutiva\nPiattaforma: **${totalUsers} utenti** e **${totalReviews} recensioni**. In sospeso: **${pendingReviews.length} recensioni**.`
      quickActions = ['🤖 Moderazione automatica', '📊 Esporta metriche', '📋 Segnalazioni in sospeso']
    } else if (isZh) {
      analysisText = `### 📊 平台执行摘要\n记录有 **${totalUsers} 名用户** 和 **${totalReviews} 条评论**。待审核: **${pendingReviews.length} 条**。`
      quickActions = ['🤖 运行自动审核', '📊 导出指标', '📋 查看待处理举报']
    } else if (isJa) {
      analysisText = `### 📊 プラットフォームサマリー\n**${totalUsers}人のユーザー**と**${totalReviews}件のレビュー**。保留中: **${pendingReviews.length}件**。`
      quickActions = ['🤖 自動モデレーションを実行', '📊 メトリクスをエクスポート', '📋 保留中通報を表示']
    } else {
      analysisText = `### 📊 Resumen Ejecutivo de la Plataforma SONAR\nLa plataforma registra **${totalUsers} usuarios** y **${totalReviews} reseñas**. Hay **${pendingReviews.length} reseñas pendientes** y **${pendingReports.length} reportes** sin resolver.`
      quickActions = ['🤖 Ejecutar moderación automática', '📊 Exportar métricas', '📋 Ver reportes pendientes']
    }

    metadata = {
      category: 'reports',
      severity: pendingReviews.length > 10 || pendingReports.length > 5 ? 'warning' : 'info',
      metrics: { totalUsers, totalReviews, pendingReviews: pendingReviews.length, pendingReports: pendingReports.length }
    }
  }
  // --- GENERAL ---
  else {
    const totalUsers = users.length
    const activeUsers = users.filter(u => u.status === 'active').length
    const totalReviews = reviews.length
    const pendingReviews = reviews.filter(r => r.status === 'pending_moderation').length
    const pendingReports = reports.filter(r => r.status === 'pending').length
    const highRiskUsers = users.filter(u => (u.conductReports || []).filter(r => r.status === 'pending').length >= 3).length

    if (isEn) {
      analysisText = `### 🎙️ General Summary — SONAR Admin Hub AI\n\n### 📈 Status Dashboard\n* **Registered users:** ${totalUsers} (${activeUsers} active).\n* **Total reviews:** ${totalReviews} (${pendingReviews} pending moderation).\n* **Catalog:** ${releases.length} releases, ${labels.length} labels, ${vinyls.length} vinyls.\n* **Pending reports:** ${pendingReports}.\n* **High-risk users:** ${highRiskUsers}.`
      quickActions = ['📋 Analyze full catalog', '👥 Detect risk users', '📊 Generate executive report']
    } else if (isFr) {
      analysisText = `### 🎙️ Résumé Général — SONAR Admin Hub IA\n\n### 📈 Tableau de bord\n* **Utilisateurs:** ${totalUsers} (${activeUsers} actifs).\n* **Avis:** ${totalReviews} (${pendingReviews} en attente).\n* **Catalogue:** ${releases.length} sorties, ${labels.length} labels, ${vinyls.length} vinyles.`
      quickActions = ['📋 Analyser le catalogue', '👥 Détecter utilisateurs à risque', '📊 Générer rapport exécutif']
    } else if (isIt) {
      analysisText = `### 🎙️ Sintesi Generale — SONAR Admin Hub IA\n\n### 📈 Pannello di Stato\n* **Utenti registrati:** ${totalUsers} (${activeUsers} attivi).\n* **Recensioni totali:** ${totalReviews} (${pendingReviews} in sospeso).\n* **Catalogo:** ${releases.length} uscite, ${labels.length} etichette, ${vinyls.length} vinili.`
      quickActions = ['📋 Analizza catalogo completo', '👥 Rileva utenti a rischio', '📊 Genera report esecutivo']
    } else if (isZh) {
      analysisText = `### 🎙️ 总体摘要 — SONAR 管理中心 AI\n\n### 📈 状态面板\n* **注册用户:** ${totalUsers} (${activeUsers} 活跃).\n* **总评论数:** ${totalReviews} (${pendingReviews} 待审核).\n* **目录:** ${releases.length} 发行项, ${labels.length} 唱片公司, ${vinyls.length} 黑胶.`
      quickActions = ['📋 分析完整目录', '👥 检测风险用户', '📊 生成执行报告']
    } else if (isJa) {
      analysisText = `### 🎙️ 全般サマリー — SONAR 管理ハブ AI\n\n### 📈 ステータスダッシュボード\n* **登録ユーザー:** ${totalUsers}人 (${activeUsers}人アクティブ).\n* **総レビュー数:** ${totalReviews}件 (${pendingReviews}件保留中).\n* **カタログ:** ${releases.length}件のリリース, ${labels.length}件のレーベル, ${vinyls.length}件のヴァイナル.`
      quickActions = ['📋 カタログ全体を分析', '👥 リスクユーザーを検出', '📊 エグゼクティブレポートを作成']
    } else {
      analysisText = `### 🎙️ Resumen General de SONAR — Admin Hub IA\n\n### 📈 Panel de Estado\n* **Usuarios registrados:** ${totalUsers} (${activeUsers} activos).\n* **Reseñas totales:** ${totalReviews} (${pendingReviews} pendientes de moderación).\n* **Catálogo:** ${releases.length} lanzamientos, ${labels.length} sellos, ${vinyls.length} vinilos.\n* **Reportes de conducta pendientes:** ${pendingReports}.\n* **Usuarios de alto riesgo:** ${highRiskUsers}.`
      quickActions = ['📋 Analizar catálogo completo', '👥 Detectar usuarios de riesgo', '📊 Generar reporte ejecutivo']
    }

    metadata = {
      category: 'mixed',
      severity: (pendingReviews > 10 || highRiskUsers > 0) ? 'warning' : 'info',
      metrics: { totalUsers, activeUsers, totalReviews, pendingReviews, pendingReports, highRiskUsers }
    }
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
