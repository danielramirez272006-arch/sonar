import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sendChatMessage } from '../../../shared/services/chatbot-service.js'
import { usePlayer } from '../../../shared/context/player-context.jsx'
import { useAuth } from '../../../shared/context/auth-context.jsx'

const INITIAL_MESSAGE = {
  id: 'init-msg-1',
  sender: 'bot',
  text: '¡Hola! Soy **Sonaria**, tu asistente de inteligencia artificial oficial de la plataforma **SONAR**. 🎧✨\n\nPuedo guiarte paso a paso por todas las funciones de la página: explorar el catálogo Hi-Fi, ganar **Sonar Coins**, canjear skins en la **Boutique**, publicar reseñas o activar el **Control Parental**.\n\n¿En qué te puedo asesorar hoy?',
  suggestions: [
    {
      title: 'Aja',
      artist: 'Steely Dan',
      year: '1977',
      genre: 'Jazz Rock / Hi-Fi',
      reason: 'Álbum destacado en el catálogo de SONAR con preescucha Hi-Fi disponible.',
      deezerQuery: 'Steely Dan Aja',
    },
    {
      title: 'Random Access Memories',
      artist: 'Daft Punk',
      year: '2013',
      genre: 'Nu-Disco / Hi-Fi',
      reason: 'Producción de referencia en SONAR. ¡Escúchalo para ganar +5 Sonar Coins!',
      deezerQuery: 'Daft Punk Random Access Memories',
    },
  ],
  quickReplies: [
    '🪙 ¿Cómo ganar Sonar Coins?',
    '⭐ ¿Cómo publicar una reseña?',
    '🛒 ¿Qué hay en la Boutique?',
    '🔒 ¿Cómo activar Control Parental?',
    '💿 Explorar Catálogo Hi-Fi',
  ],
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
}

export function SonarAiSommelier() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => 'sonar-session-' + Date.now().toString(36))

  const { playTrack, pauseTrack, isPlaying, currentTrack } = usePlayer()
  const { user } = useAuth()

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen, messages])

  const handlePlaySuggestion = async (suggestion) => {
    if (!playTrack || !suggestion) return
    try {
      playTrack({
        id: suggestion.id || 'sommelier-' + (suggestion.title || 'track').replace(/\s+/g, '-').toLowerCase(),
        title: suggestion.title,
        artist: suggestion.artist,
        album: suggestion.album || suggestion.title,
        cover: suggestion.cover || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
        preview: suggestion.preview || null,
        previewUrl: suggestion.previewUrl || null,
      })
    } catch {
      /* ignore */
    }
  }

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputValue).trim()
    if (!text || isLoading) return

    // Soporte directo para pausar
    if (/^(?:pausa|pausar|stop|detener|silencio)\b/i.test(text)) {
      if (pauseTrack) pauseTrack()
    }

    const userMsg = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await sendChatMessage(text, sessionId, {
        userName: user?.name || user?.username || 'Melómano',
        preferences: user?.preferences || ['Jazz', 'Rock', 'Electrónica'],
      })

      const botMsg = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: response.message,
        suggestions: response.suggestions || [],
        quickReplies: response.quickReplies || [],
        source: response.source,
        autoPlay: Boolean(response.autoPlay),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, botMsg])

      // Auto-reproducción si el usuario pidió reproducir o el agente activó autoPlay
      if (response.autoPlay && response.suggestions && response.suggestions.length > 0) {
        handlePlaySuggestion(response.suggestions[0])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-err-' + Date.now(),
          sender: 'bot',
          text: 'Disculpa, ocurrió un breve retraso al conectar con Sonaria. ¿Podrías intentar formular tu solicitud nuevamente?',
          quickReplies: [
            '▶️ Reproduce Steely Dan',
            '▶️ Pon Daft Punk',
            '🪙 ¿Cómo ganar Sonar Coins?',
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenReview = (suggestion) => {
    window.dispatchEvent(
      new CustomEvent('sonar:open-review-modal', {
        detail: {
          album: {
            title: suggestion.title,
            artist: suggestion.artist,
            albumId: 'custom-' + Date.now(),
            cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
          },
        },
      })
    )
  }

  const handleClearHistory = () => {
    setMessages([INITIAL_MESSAGE])
  }

  return (
    <>
      {/* Botón Lanzador Flotante */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#B80C09] via-[#8C0A07] to-[#4B2840] text-white font-bold shadow-2xl shadow-black/60 border border-white/20 cursor-pointer backdrop-blur-md transition-all group"
          aria-label={isOpen ? 'Cerrar Sonaria' : 'Abrir Sonaria (Asistente IA)'}
        >
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-white/15">
            <span className="material-symbols-outlined text-[19px] text-[#ffdddd] group-hover:rotate-12 transition-transform">
              {isOpen ? 'close' : 'smart_toy'}
            </span>
            {!isOpen && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4d4a] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B80C09]"></span>
              </span>
            )}
          </div>
          <span className="text-xs tracking-wider uppercase hidden sm:inline-block font-extrabold text-[#DCDCDD]">
            {isOpen ? 'Cerrar Sonaria' : 'Sonaria'}
          </span>
        </motion.button>
      </div>

      {/* Ventana Modal / Drawer del Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[82vh] flex flex-col rounded-2xl bg-[#231123] border border-[#4B2840]/80 shadow-2xl shadow-black/80 overflow-hidden text-[#DCDCDD]"
          >
            {/* Cabecera */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-[#231123] via-[#4B2840] to-[#231123] border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#B80C09]/30 border border-[#B80C09]/60 flex items-center justify-center">
                  <span className="text-base font-serif font-black text-[#ff4d4a]">✧</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-bold text-white tracking-wide">Sonaria</strong>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold tracking-widest bg-[#B80C09] text-white uppercase">
                      Gemini IA
                    </span>
                  </div>
                  <small className="text-[11px] text-[#DCDCDD]/70 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Asistente y consultora musical activa
                  </small>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearHistory}
                  title="Reiniciar conversación"
                  className="p-1.5 rounded-lg text-[#DCDCDD]/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Minimizar"
                  className="p-1.5 rounded-lg text-[#DCDCDD]/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </button>
              </div>
            </div>

            {/* Cuerpo de Mensajes */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-radial from-[#2e1628]/40 to-[#1a0c1a]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#B80C09] to-[#8C0A07] text-white rounded-tr-xs shadow-md'
                        : 'bg-[#4B2840]/70 border border-white/10 text-[#DCDCDD] rounded-tl-xs backdrop-blur-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Tarjetas de Recomendación Musical */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2.5 pt-2.5 border-t border-white/15">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-[#ff4d4a] block">
                          💿 Recomendaciones del Sommelier:
                        </span>
                        {msg.suggestions.map((sug, idx) => {
                          const isThisTrackPlaying =
                            isPlaying &&
                            currentTrack &&
                            (String(currentTrack.title || '').toLowerCase().includes(String(sug.title || '').toLowerCase()) ||
                              String(sug.title || '').toLowerCase().includes(String(currentTrack.title || '').toLowerCase()))

                          return (
                            <div
                              key={idx}
                              className={`p-2.5 rounded-xl bg-[#231123]/90 border transition-all flex flex-col gap-2 ${
                                isThisTrackPlaying
                                  ? 'border-[#ff4d4a] shadow-lg shadow-[#ff4d4a]/20 bg-[#2e122b]'
                                  : 'border-white/10 hover:border-[#B80C09]/50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <strong className="text-xs text-white font-bold block flex items-center gap-1.5">
                                    {sug.title}
                                    {isThisTrackPlaying && (
                                      <span className="flex items-center gap-0.5 ml-1">
                                        <span className="w-1 h-3 bg-[#ff4d4a] animate-pulse"></span>
                                        <span className="w-1 h-2 bg-[#ff4d4a] animate-pulse [animation-delay:0.2s]"></span>
                                        <span className="w-1 h-4 bg-[#ff4d4a] animate-pulse [animation-delay:0.4s]"></span>
                                      </span>
                                    )}
                                  </strong>
                                  <small className="text-[11px] text-[#DCDCDD]/70 block">
                                    {sug.artist} {sug.year ? `· ${sug.year}` : ''} {sug.genre ? `· ${sug.genre}` : ''}
                                  </small>
                                </div>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold whitespace-nowrap ${
                                    isThisTrackPlaying
                                      ? 'bg-[#B80C09] text-white animate-pulse'
                                      : 'bg-[#003844] text-white'
                                  }`}
                                >
                                  {isThisTrackPlaying ? 'Sonando Ahora' : 'Hi-Fi Master'}
                                </span>
                              </div>

                              {sug.reason && (
                                <p className="text-[11px] text-[#DCDCDD]/80 italic bg-[#1a0c1a]/60 p-2 rounded-lg border-l-2 border-[#B80C09]">
                                  «{sug.reason}»
                                </p>
                              )}

                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  onClick={() => (isThisTrackPlaying && pauseTrack ? pauseTrack() : handlePlaySuggestion(sug))}
                                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer text-white ${
                                    isThisTrackPlaying
                                      ? 'bg-[#B80C09] hover:bg-[#8C0A07]'
                                      : 'bg-[#003844] hover:bg-[#005161]'
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-[14px]">
                                    {isThisTrackPlaying ? 'pause' : 'play_arrow'}
                                  </span>
                                  <span>{isThisTrackPlaying ? 'Pausar' : 'Reproducir'}</span>
                                </button>
                                <button
                                  onClick={() => handleOpenReview(sug)}
                                  className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-[#DCDCDD] font-semibold text-[11px] transition-colors cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[14px]">rate_review</span>
                                  <span>Reseñar</span>
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1 px-1">
                    <span className="text-[10px] text-[#DCDCDD]/40">{msg.timestamp}</span>
                    {msg.sender === 'bot' && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                          msg.source === 'n8n-gemini'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-[#4B2840]/60 text-[#ffdddd]/60 border border-white/10'
                        }`}
                      >
                        {msg.source === 'n8n-gemini' ? '⚡ n8n Gemini Agent' : '✧ Sonaria Local'}
                      </span>
                    )}
                  </div>

                  {/* Sugerencias Rápidas (Chips) */}
                  {msg.sender === 'bot' && msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                      {msg.quickReplies.map((reply, rIdx) => (
                        <button
                          key={rIdx}
                          onClick={() => handleSend(reply)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-[#2e1628] hover:bg-[#4B2840] text-[#DCDCDD] border border-white/15 hover:border-[#B80C09]/50 transition-colors cursor-pointer"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Animación Escribiendo */}
              {isLoading && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#4B2840]/40 max-w-[120px]">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d4a] animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d4a] animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d4a] animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <small className="text-[10px] text-[#DCDCDD]/60 font-semibold">Consultando...</small>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input y Botón de Envío */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="p-3 bg-[#1C0D1C] border-t border-white/10 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Pregunta sobre vinilos, jazz, másters..."
                disabled={isLoading}
                className="flex-1 bg-[#2e1628] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-[#DCDCDD]/40 focus:outline-none focus:border-[#B80C09] transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="w-10 h-10 rounded-xl bg-[#B80C09] hover:bg-[#9c0a07] disabled:opacity-40 disabled:hover:bg-[#B80C09] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Enviar mensaje"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default SonarAiSommelier
