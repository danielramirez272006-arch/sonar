import React, { useState, useEffect, useRef } from 'react'
import { askSonarAI, fetchSonarPlatformContext } from '../../../shared/services/sonar-ai-service.js'
import { apiRequest } from '../../../shared/services/api-client.js'

const QUICK_ACTIONS = [
  {
    label: '🚨 Moderar comentarios subidos de tono',
    prompt: 'Detecta comentarios subidos de tono o inapropiados, márcalos para el administrador y envía avisos de mal comportamiento.',
    action: 'moderate',
  },
  {
    label: '👥 Analizar usuarios',
    prompt: 'Analiza el comportamiento general y patrones de actividad de los usuarios registrados en Sonar.',
  },
  {
    label: '💬 Analizar reseñas',
    prompt: 'Analiza las reseñas registradas y dime si hay alguna sospechosa, spam o con lenguaje problemático.',
  },
  {
    label: '📈 Ver tendencias',
    prompt: '¿Qué géneros musicales, formatos o tendencias destacan dentro de los datos actuales de la plataforma?',
  },
  {
    label: '📋 Resumir plataforma',
    prompt: 'Resume la actividad reciente y el estado general de la plataforma Sonar.',
  },
]

export function SonarAI() {
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentResponse, setCurrentResponse] = useState(null)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [platformStats, setPlatformStats] = useState(null)
  const responseEndRef = useRef(null)

  // Cargar estadísticas rápidas del contexto al iniciar
  useEffect(() => {
    let active = true
    fetchSonarPlatformContext().then(ctx => {
      if (active) {
        setPlatformStats({
          usersCount: ctx.users.length,
          reviewsCount: ctx.reviews.length,
          releasesCount: ctx.releases.length,
          labelsCount: ctx.labels.length,
          vinylsCount: ctx.vinyls.length,
        })
      }
    })
    return () => {
      active = false
    }
  }, [])

  const handleSubmit = async (queryText = inputMessage) => {
    const textToSend = typeof queryText === 'string' ? queryText.trim() : inputMessage.trim()
    if (!textToSend || loading) return

    setLoading(true)
    setError(null)

    try {
      // 1. Obtener contexto completo de la plataforma
      const context = await fetchSonarPlatformContext()

      // 2. Enviar petición a n8n
      const result = await askSonarAI(textToSend, context)

      if (result.success) {
        const newEntry = {
          id: Date.now(),
          query: textToSend,
          response: result.analysis,
          timestamp: result.timestamp || new Date().toISOString(),
          simulated: result.simulated ?? false,
        }

        setCurrentResponse(newEntry)
        setHistory(prev => [newEntry, ...prev])
        setInputMessage('')
      } else {
        throw new Error(result.message || 'No fue posible procesar la solicitud con Sonar AI.')
      }
    } catch (err) {
      console.error('[Sonar AI Error]:', err)
      setError(err.message || 'Ocurrió un error al intentar comunicar con Sonar AI.')
    } finally {
      setLoading(false)
      setTimeout(() => {
        responseEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  const handleModerateAllReviews = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiRequest('/admin/moderation/run-agent', { method: 'POST' })
      if (result.busy) throw new Error('El agente ya esta revisando las resenas. Espera a que termine.')
      if (!result.success) throw new Error((result.errors || ['El agente no pudo completar la revision.']).join('; '))
      window.dispatchEvent(new CustomEvent('sonar:reviews-updated'))
      window.dispatchEvent(new CustomEvent('sonar:reports-updated'))

      // Re-consultar contexto
      const updatedCtx = await fetchSonarPlatformContext()
      setPlatformStats({
        usersCount: updatedCtx.users.length,
        reviewsCount: updatedCtx.reviews.length,
        releasesCount: updatedCtx.releases.length,
        labelsCount: updatedCtx.labels.length,
        vinylsCount: updatedCtx.vinyls.length,
      })

      const analysisText = `El agente completo ${result.processed} decisiones usando ${result.provider || 'la cola actual'}. Las medidas se guardaron en el servidor. Los avisos de suspension pendientes se enviaran desde n8n mediante Gmail.`

      const newEntry = {
        id: Date.now(),
        query: 'Moderar comentarios subidos de tono con IA',
        response: analysisText,
        timestamp: new Date().toISOString(),
      }

      setCurrentResponse(newEntry)
      setHistory(prev => [newEntry, ...prev])
      setInputMessage('')
    } catch (err) {
      setError(err.message || 'No se pudo completar la moderacion con el agente.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAction = (actionItem) => {
    if (typeof actionItem === 'object' && actionItem.action === 'moderate') {
      setInputMessage(actionItem.prompt)
      handleModerateAllReviews()
    } else {
      const promptText = typeof actionItem === 'string' ? actionItem : actionItem.prompt
      setInputMessage(promptText)
      handleSubmit(promptText)
    }
  }

  // Formateador simple de Markdown para el análisis
  const renderFormattedAnalysis = (text) => {
    if (!text) return null

    const lines = text.split('\n')
    return lines.map((line, index) => {
      const trimmed = line.trim()

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-bold text-white mt-4 mb-2 flex items-center gap-2 border-b border-white/10 pb-1">
            {trimmed.replace('### ', '')}
          </h3>
        )
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-extrabold text-[#B80C09] dark:text-[#ff4d4a] mt-5 mb-2">
            {trimmed.replace('## ', '')}
          </h2>
        )
      }
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const content = trimmed.substring(2)
        return (
          <li key={index} className="ml-4 list-disc text-gray-200 my-1 leading-relaxed">
            {formatBoldText(content)}
          </li>
        )
      }
      if (trimmed.startsWith('🚨') || trimmed.includes('Sospechosa') || trimmed.includes('Anomalía')) {
        return (
          <div key={index} className="my-3 p-3.5 rounded-lg bg-[#B80C09]/15 border border-[#B80C09]/40 text-red-200 text-sm">
            {formatBoldText(trimmed)}
          </div>
        )
      }
      if (!trimmed) {
        return <div key={index} className="h-2" />
      }

      return (
        <p key={index} className="text-gray-300 my-1.5 leading-relaxed text-sm">
          {formatBoldText(trimmed)}
        </p>
      )
    })
  }

  const formatBoldText = (str) => {
    const parts = str.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="text-gray-300 italic">{part.slice(1, -1)}</em>
      }
      return part
    })
  }

  return (
    <div className="sonar-ai-container max-w-6xl mx-auto p-4 md:p-6 text-sonar-text">
      {/* Encabezado del Asistente */}
      <header className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-[#231123]/90 via-[#4B2840]/60 to-[#003844]/40 border border-white/10 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-9xl text-white">psychology</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#B80C09] text-white flex items-center justify-center shadow-lg shadow-[#B80C09]/30 border border-white/20">
              <span className="material-symbols-outlined text-3xl animate-pulse">smart_toy</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-wide text-white">Sonar AI</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#003844] text-[#DCDCDD] border border-cyan-500/30 flex items-center gap-1">
                  ✨ Google Gemini + n8n
                </span>
              </div>
              <p className="text-sm text-gray-300 mt-0.5">
                Asistente inteligente de administración para análisis predictivo y consulta de plataforma.
              </p>
            </div>
          </div>

          {/* Badge del estado de datos */}
          {platformStats && (
            <div className="flex flex-wrap items-center gap-2 text-xs bg-black/40 p-2.5 rounded-xl border border-white/10">
              <span className="text-gray-400 font-medium">Contexto activo:</span>
              <span className="px-2 py-0.5 bg-white/10 rounded-md text-white font-mono">{platformStats.usersCount} usuarios</span>
              <span className="px-2 py-0.5 bg-white/10 rounded-md text-white font-mono">{platformStats.reviewsCount} reseñas</span>
              <span className="px-2 py-0.5 bg-white/10 rounded-md text-white font-mono">{platformStats.releasesCount} catálogos</span>
            </div>
          )}
        </div>
      </header>

      {/* Botones de Acción Rápida */}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-[#B80C09]">bolt</span>
          Acciones Rápidas
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {QUICK_ACTIONS.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAction(action)}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#231123]/80 hover:bg-[#4B2840] text-gray-200 border border-white/10 hover:border-[#B80C09]/50 transition-all duration-200 hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {action.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid Principal: Formulario de Pregunta y Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Input y Control */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-2xl bg-[#231123]/80 border border-white/10 shadow-xl backdrop-blur-md">
            <label htmlFor="sonar-ai-prompt" className="block text-sm font-semibold text-gray-200 mb-2">
              Haz tu pregunta a la IA:
            </label>
            <textarea
              id="sonar-ai-prompt"
              rows={5}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ej. ¿Qué usuarios tienen comportamientos atípicos o reseñas sospechosas?"
              disabled={loading}
              className="w-full p-3.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#B80C09] focus:ring-1 focus:ring-[#B80C09] text-sm resize-none transition-all"
            />

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => handleSubmit()}
                disabled={loading || !inputMessage.trim()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#B80C09] to-[#800705] hover:from-[#d1100c] hover:to-[#960907] text-white font-bold text-sm shadow-lg shadow-[#B80C09]/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                    Analizando información...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">auto_awesome</span>
                    Preguntar a IA
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Historial Corto de Sesión */}
          {history.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#231123]/60 border border-white/10 shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">history</span>
                Historial de Sesión ({history.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentResponse(item)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-all border ${
                      currentResponse?.id === item.id
                        ? 'bg-[#4B2840] border-[#B80C09] text-white font-medium'
                        : 'bg-black/30 border-white/5 text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    <p className="line-clamp-2 font-medium">"{item.query}"</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Columna Derecha: Panel de Respuesta e Inspección */}
        <div className="lg:col-span-2">
          <div className="p-6 rounded-2xl bg-[#231123]/90 border border-white/10 shadow-2xl min-h-[420px] flex flex-col justify-between backdrop-blur-md relative">
            {/* Animación de Carga Activa */}
            {loading && (
              <div className="absolute inset-0 bg-[#231123]/90 backdrop-blur-sm rounded-2xl z-20 flex flex-col items-center justify-center p-6 text-center">
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-full border-4 border-[#B80C09]/20 border-t-[#B80C09] animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-[#B80C09] animate-pulse">smart_toy</span>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Sonar AI procesando consulta</h4>
                <p className="text-sm text-gray-300 max-w-xs">
                  Recopilando datos de usuarios, lanzamientos y reseñas mediante n8n...
                </p>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-4 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200 flex items-start gap-3">
                <span className="material-symbols-outlined text-xl text-red-400">error</span>
                <div>
                  <strong className="block text-sm font-bold">Error en la consulta</strong>
                  <span className="text-xs">{error}</span>
                </div>
              </div>
            )}

            {/* Contenido de la Respuesta */}
            {currentResponse ? (
              <div>
                <header className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-semibold text-[#B80C09] tracking-widest uppercase">
                      Respuesta del Agente
                    </span>
                    <h2 className="text-base font-bold text-white mt-0.5">
                      "{currentResponse.query}"
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-gray-400 block">
                      {new Date(currentResponse.timestamp).toLocaleString()}
                    </span>
                    {currentResponse.simulated && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Modo Seguro / Fallback
                      </span>
                    )}
                  </div>
                </header>

                <div className="prose prose-invert max-w-none text-gray-200 space-y-2">
                  {renderFormattedAnalysis(currentResponse.response)}
                </div>
                <div ref={responseEndRef} />
              </div>
            ) : (
              !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-gray-500">forum</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-300 mb-1">Sin consulta activa</h3>
                  <p className="text-sm text-gray-400 max-w-md">
                    Selecciona una acción rápida arriba o escribe una pregunta para analizar los datos de Sonar en tiempo real.
                  </p>
                </div>
              )
            )}

            {/* Pie de la tarjeta de respuesta */}
            {currentResponse && (
              <footer className="pt-4 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                <span>Sonar AI System • Powered by Google Gemini AI & n8n Webhook</span>
                <button
                  onClick={() => navigator.clipboard.writeText(currentResponse.response)}
                  className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                  title="Copiar texto del análisis"
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

export default SonarAI
