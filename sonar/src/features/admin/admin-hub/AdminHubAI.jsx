import React, { useState, useEffect, useRef } from 'react'
import { askAdminHub, fetchAdminHubContext } from '../../../shared/services/admin-hub-service.js'

const HUB_TOOLS = [
  {
    id: 'catalog',
    icon: '💿',
    label: 'Gestión de Catálogo',
    description: 'Analiza lanzamientos, sellos y vinilos',
    color: '#B80C09',
  },
  {
    id: 'users',
    icon: '👥',
    label: 'Análisis de Usuarios',
    description: 'Detecta patrones y usuarios de riesgo',
    color: '#f59e0b',
  },
  {
    id: 'reports',
    icon: '📊',
    label: 'Reportes y Métricas',
    description: 'Genera resúmenes ejecutivos',
    color: '#10b981',
  },
]

const QUICK_PROMPTS = [
  {
    icon: '🔍',
    label: 'Auditar catálogo completo',
    prompt: 'Analiza el catálogo completo: lanzamientos, sellos y vinilos. Detecta duplicados, géneros faltantes y sugiere mejoras de clasificación.',
    action: 'catalog',
  },
  {
    icon: '🚨',
    label: 'Detectar usuarios de riesgo',
    prompt: 'Identifica usuarios con múltiples reportes de conducta, cuentas suspendidas o comportamientos atípicos. Prioriza por urgencia.',
    action: 'users',
  },
  {
    icon: '📈',
    label: 'Reporte ejecutivo',
    prompt: 'Genera un reporte ejecutivo completo: métricas clave, estado de moderación, distribución de calificaciones y recomendaciones estratégicas.',
    action: 'reports',
  },
  {
    icon: '🎯',
    label: 'Engagement y retención',
    prompt: 'Analiza las métricas de engagement: ratio de reseñas por usuario, usuarios inactivos, y sugiere estrategias de retención y gamificación.',
    action: 'users',
  },
  {
    icon: '🏷️',
    label: 'Tendencias de género',
    prompt: '¿Qué géneros musicales, formatos y tendencias destacan en el catálogo? ¿Cuáles están subrepresentados?',
    action: 'catalog',
  },
  {
    icon: '⚖️',
    label: 'Estado de moderación',
    prompt: 'Resume el estado actual de la cola de moderación: reseñas pendientes, reportes sin resolver, y prioridades de revisión.',
    action: 'reports',
  },
]

export function AdminHubAI() {
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentResponse, setCurrentResponse] = useState(null)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [activeTool, setActiveTool] = useState(null)
  const [platformStats, setPlatformStats] = useState(null)
  const [contextCache, setContextCache] = useState(null)
  const responseEndRef = useRef(null)
  const inputRef = useRef(null)

  // Cargar estadísticas al iniciar
  useEffect(() => {
    let active = true
    fetchAdminHubContext().then(ctx => {
      if (active) {
        setContextCache(ctx)
        const pendingReviews = (ctx.reviews || []).filter(r => r.status === 'pending_moderation').length
        const pendingReports = (ctx.reports || []).filter(r => r.status === 'pending').length
        const highRiskUsers = (ctx.users || []).filter(u =>
          (u.conductReports || []).filter(r => r.status === 'pending').length >= 3
        ).length

        setPlatformStats({
          users: ctx.users.length,
          reviews: ctx.reviews.length,
          releases: ctx.releases.length,
          labels: ctx.labels.length,
          vinyls: ctx.vinyls.length,
          pendingReviews,
          pendingReports,
          highRiskUsers,
        })
      }
    })
    return () => { active = false }
  }, [])

  const handleSubmit = async (promptText, actionType) => {
    const text = (typeof promptText === 'string' ? promptText : inputMessage).trim()
    const action = actionType || activeTool || 'general'
    if (!text || loading) return

    setLoading(true)
    setError(null)

    try {
      const ctx = contextCache || await fetchAdminHubContext()
      const result = await askAdminHub(text, action, ctx)

      if (result.success) {
        const entry = {
          id: Date.now(),
          query: text,
          response: result.analysis,
          metadata: result.metadata || {},
          quickActions: result.quickActions || [],
          action,
          timestamp: result.timestamp || new Date().toISOString(),
          simulated: result.simulated ?? false,
          model: result.model || 'gemini',
        }
        setCurrentResponse(entry)
        setHistory(prev => [entry, ...prev])
        setInputMessage('')
      } else {
        throw new Error('No fue posible procesar la solicitud con Admin Hub IA.')
      }
    } catch (err) {
      console.error('[Admin Hub IA Error]:', err)
      setError(err.message || 'Ocurrió un error al comunicar con Admin Hub IA.')
    } finally {
      setLoading(false)
      setTimeout(() => {
        responseEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 120)
    }
  }

  const handleQuickPrompt = (item) => {
    setInputMessage(item.prompt)
    setActiveTool(item.action)
    handleSubmit(item.prompt, item.action)
  }

  const handleToolSelect = (toolId) => {
    setActiveTool(prev => prev === toolId ? null : toolId)
    inputRef.current?.focus()
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return { bg: 'bg-red-500/15', border: 'border-red-500/40', text: 'text-red-300', icon: '🔴' }
      case 'warning': return { bg: 'bg-amber-500/15', border: 'border-amber-500/40', text: 'text-amber-300', icon: '🟡' }
      default: return { bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', text: 'text-emerald-300', icon: '🟢' }
    }
  }

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'catalog': return '💿 Catálogo'
      case 'users': return '👥 Usuarios'
      case 'reports': return '📊 Reportes'
      default: return '🔄 General'
    }
  }

  // Formateador de Markdown para el análisis
  const renderFormattedAnalysis = (text) => {
    if (!text) return null
    const lines = text.split('\n')
    return lines.map((line, index) => {
      const trimmed = line.trim()

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-bold text-gray-900 dark:text-white mt-5 mb-2 flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-1.5">
            {trimmed.replace('### ', '')}
          </h3>
        )
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-extrabold text-[#B80C09] dark:text-[#ff4d4a] mt-6 mb-2">
            {trimmed.replace('## ', '')}
          </h2>
        )
      }
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const content = trimmed.substring(2)
        return (
          <li key={index} className="ml-4 list-disc text-gray-800 dark:text-gray-200 my-1.5 leading-relaxed">
            {formatBoldText(content)}
          </li>
        )
      }
      if (trimmed.startsWith('🚨') || trimmed.includes('Alerta') || trimmed.includes('Anomalía') || trimmed.includes('Alto Riesgo')) {
        return (
          <div key={index} className="my-3 p-3.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-800 dark:text-red-200 text-sm font-medium">
            {formatBoldText(trimmed)}
          </div>
        )
      }
      if (!trimmed) return <div key={index} className="h-2" />

      return (
        <p key={index} className="text-gray-700 dark:text-gray-300 my-1.5 leading-relaxed text-sm">
          {formatBoldText(trimmed)}
        </p>
      )
    })
  }

  const formatBoldText = (str) => {
    const parts = str.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-gray-900 dark:text-white font-semibold">{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="text-gray-600 dark:text-gray-300 italic">{part.slice(1, -1)}</em>
      }
      return part
    })
  }

  return (
    <div className="admin-hub-container max-w-7xl mx-auto p-4 md:p-6 text-gray-900 dark:text-sonar-text">
      {/* Encabezado Premium */}
      <header className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-[#B80C09] via-[#8E0A07] to-[#4c0604] border border-[#B80C09]/30 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.08] pointer-events-none">
          <span className="material-symbols-outlined text-9xl text-white">hub</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md text-white flex items-center justify-center shadow-lg border border-white/20">
              <span className="material-symbols-outlined text-3xl animate-pulse">neurology</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-wide text-white">Admin Hub IA</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-black/30 text-red-100 border border-white/20 flex items-center gap-1">
                  🧠 AI Agent + Gemini + n8n
                </span>
              </div>
              <p className="text-sm text-red-100/90 mt-0.5">
                Co-piloto estratégico todo-en-uno: catálogo, usuarios y reportes ejecutivos.
              </p>
            </div>
          </div>

          {/* Badge de estado */}
          {platformStats && (
            <div className="flex flex-wrap items-center gap-2 text-xs bg-black/30 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white">
              <span className="text-red-200 font-medium">Estado:</span>
              <span className="px-2 py-0.5 bg-white/15 rounded-md font-mono">{platformStats.users} usuarios</span>
              <span className="px-2 py-0.5 bg-white/15 rounded-md font-mono">{platformStats.reviews} reseñas</span>
              <span className="px-2 py-0.5 bg-white/15 rounded-md font-mono">{platformStats.releases} catálogos</span>
              {platformStats.pendingReviews > 0 && (
                <span className="px-2 py-0.5 bg-amber-400/30 rounded-md text-amber-100 font-mono border border-amber-300/40">
                  ⚠ {platformStats.pendingReviews} pendientes
                </span>
              )}
              {platformStats.highRiskUsers > 0 && (
                <span className="px-2 py-0.5 bg-red-900/60 rounded-md text-red-100 font-mono border border-red-400/40">
                  🚨 {platformStats.highRiskUsers} riesgo
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Herramientas / Módulos */}
      <section className="mb-5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-[#B80C09] dark:text-[#ff4d4a]">construction</span>
          Módulos del Agente
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {HUB_TOOLS.map(tool => (
            <button
              key={tool.id}
              onClick={() => handleToolSelect(tool.id)}
              disabled={loading}
              className={`p-4 rounded-xl text-left transition-all duration-200 border cursor-pointer ${
                activeTool === tool.id
                  ? 'bg-red-50 dark:bg-[#B80C09]/20 border-[#B80C09] shadow-md shadow-[#B80C09]/10'
                  : 'bg-white dark:bg-[#1c1c1f]/80 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-[#27272a]'
              } disabled:opacity-50`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tool.icon}</span>
                <div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white block">{tool.label}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{tool.description}</span>
                </div>
                {activeTool === tool.id && (
                  <span className="ml-auto material-symbols-outlined text-[#B80C09] dark:text-[#ff4d4a] text-lg">check_circle</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Acciones Rápidas */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-[#B80C09] dark:text-[#ff4d4a]">bolt</span>
          Consultas Rápidas
        </h2>
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(item)}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#1c1c1f] hover:bg-red-50 dark:hover:bg-[#27272a] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/10 hover:border-[#B80C09]/50 transition-all duration-200 hover:shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Input */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1c1c1f] border border-gray-200 dark:border-white/10 shadow-md">
            <label htmlFor="admin-hub-prompt" className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Instrucción para el agente:
            </label>
            {activeTool && (
              <div className="mb-3 flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-red-50 dark:bg-[#B80C09]/20 text-[#B80C09] dark:text-red-200 border border-[#B80C09]/40 font-semibold">
                  {HUB_TOOLS.find(t => t.id === activeTool)?.icon} {HUB_TOOLS.find(t => t.id === activeTool)?.label}
                </span>
                <button
                  onClick={() => setActiveTool(null)}
                  className="text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer transition-colors"
                  title="Quitar filtro de módulo"
                >
                  ✕
                </button>
              </div>
            )}
            <textarea
              id="admin-hub-prompt"
              ref={inputRef}
              rows={5}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault()
                  handleSubmit()
                }
              }}
              placeholder="Ej. ¿Qué usuarios tienen más reportes de conducta pendientes? ¿Hay lanzamientos sin género?"
              disabled={loading}
              className="w-full p-3.5 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-300 dark:border-white/15 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#B80C09] focus:ring-1 focus:ring-[#B80C09] focus:bg-white dark:focus:bg-black/60 text-sm resize-none transition-all"
            />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Ctrl+Enter para enviar</p>

            <div className="mt-3">
              <button
                onClick={() => handleSubmit()}
                disabled={loading || !inputMessage.trim()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#B80C09] to-[#8E0A07] hover:from-[#d30e0b] hover:to-[#B80C09] text-white font-bold text-sm shadow-lg shadow-[#B80C09]/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    Agente procesando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">neurology</span>
                    Enviar al Agente
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Historial */}
          {history.length > 0 && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1c1c1f]/80 border border-gray-200 dark:border-white/10 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">history</span>
                Historial ({history.length})
              </h3>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {history.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentResponse(item)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-all border ${
                      currentResponse?.id === item.id
                        ? 'bg-red-50 dark:bg-[#B80C09]/20 border-[#B80C09]/40 text-[#B80C09] dark:text-white font-semibold'
                        : 'bg-gray-50 dark:bg-black/30 border-gray-200 dark:border-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{getCategoryLabel(item.action).split(' ')[0]}</span>
                      <p className="line-clamp-1 font-medium flex-1">"{item.query}"</p>
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Columna Derecha: Respuesta */}
        <div className="lg:col-span-2">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1c1c1f] border border-gray-200 dark:border-white/10 shadow-md min-h-[480px] flex flex-col justify-between backdrop-blur-md relative">
            {/* Loading */}
            {loading && (
              <div className="absolute inset-0 bg-white/95 dark:bg-[#1c1c1f]/95 backdrop-blur-sm rounded-2xl z-20 flex flex-col items-center justify-center p-6 text-center">
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-full border-4 border-[#B80C09]/20 border-t-[#B80C09] animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-[#B80C09] dark:text-[#ff4d4a] animate-pulse">neurology</span>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Admin Hub IA procesando</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                  Analizando datos de usuarios, catálogo y reportes mediante el agente n8n...
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-500/50 text-red-800 dark:text-red-200 flex items-start gap-3">
                <span className="material-symbols-outlined text-xl text-red-500">error</span>
                <div>
                  <strong className="block text-sm font-bold">Error en la consulta</strong>
                  <span className="text-xs">{error}</span>
                </div>
              </div>
            )}

            {/* Respuesta */}
            {currentResponse ? (
              <div>
                <header className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200 dark:border-white/10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-[#B80C09] dark:text-[#ff4d4a] tracking-widest uppercase">
                        Respuesta del Agente
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-50 dark:bg-[#B80C09]/20 text-[#B80C09] dark:text-red-200 border border-red-200 dark:border-[#B80C09]/40">
                        {getCategoryLabel(currentResponse.metadata?.category || currentResponse.action)}
                      </span>
                      {currentResponse.metadata?.severity && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getSeverityColor(currentResponse.metadata.severity).bg} ${getSeverityColor(currentResponse.metadata.severity).border} border ${getSeverityColor(currentResponse.metadata.severity).text}`}>
                          {getSeverityColor(currentResponse.metadata.severity).icon} {currentResponse.metadata.severity === 'critical' ? 'Crítico' : currentResponse.metadata.severity === 'warning' ? 'Atención' : 'Normal'}
                        </span>
                      )}
                    </div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mt-0.5">
                      "{currentResponse.query}"
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 block">
                      {new Date(currentResponse.timestamp).toLocaleString()}
                    </span>
                    {currentResponse.simulated && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                        Modo Offline / Simulado
                      </span>
                    )}
                  </div>
                </header>

                {/* Métricas rápidas */}
                {currentResponse.metadata?.metrics && Object.keys(currentResponse.metadata.metrics).length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    {Object.entries(currentResponse.metadata.metrics).slice(0, 8).map(([key, val]) => (
                      <div key={key} className="p-2 rounded-lg bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/5 text-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-white block">{typeof val === 'number' ? val.toLocaleString() : val}</span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="prose prose-invert max-w-none text-gray-800 dark:text-gray-200 space-y-1">
                  {renderFormattedAnalysis(currentResponse.response)}
                </div>

                {/* Quick Actions sugeridas por el agente */}
                {currentResponse.quickActions?.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-gray-200 dark:border-white/10">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-[#B80C09] dark:text-[#ff4d4a]">arrow_forward</span>
                      Acciones Sugeridas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentResponse.quickActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setInputMessage(action)
                            inputRef.current?.focus()
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 dark:bg-[#B80C09]/15 hover:bg-red-100 dark:hover:bg-[#B80C09]/30 text-[#B80C09] dark:text-red-200 border border-red-200 dark:border-[#B80C09]/30 hover:border-[#B80C09] transition-all cursor-pointer"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={responseEndRef} />
              </div>
            ) : (
              !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-500 dark:text-gray-400">
                  <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-[#B80C09]/10 border border-red-100 dark:border-[#B80C09]/20 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-4xl text-[#B80C09]/60 dark:text-[#ff4d4a]/60">neurology</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-300 mb-1">Admin Hub IA listo</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                    Selecciona un módulo, usa una consulta rápida o escribe una instrucción para analizar los datos de la plataforma Sonar en tiempo real.
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
                    <span className="flex items-center gap-1">💿 Catálogo</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">👥 Usuarios</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">📊 Reportes</span>
                  </div>
                </div>
              )
            )}

            {/* Footer */}
            {currentResponse && (
              <footer className="pt-4 mt-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Admin Hub IA • Powered by AI Agent + Google Gemini + n8n</span>
                <button
                  onClick={() => navigator.clipboard.writeText(currentResponse.response)}
                  className="hover:text-gray-900 dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                  title="Copiar análisis"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  Copiar análisis
                </button>
              </footer>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHubAI
