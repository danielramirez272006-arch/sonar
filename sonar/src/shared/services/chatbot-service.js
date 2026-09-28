/**
 * Servicio de ChatBot: SONAR AI Sommelier Musical
 * Conecta con el webhook de n8n o utiliza fallback local interactivo.
 */

const N8N_CHATBOT_URL =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_CHATBOT_WEBHOOK_URL

const DEFAULT_ENDPOINTS = [
  N8N_CHATBOT_URL,
  'http://localhost:5678/webhook-test/sonar-chatbot',
  'http://localhost:5678/webhook/sonar-chatbot',
].filter(Boolean)

// Base de conocimiento local para respuestas de contingencia (fallback inteligente)
const LOCAL_KNOWLEDGE = [
  {
    keywords: ['jazz', 'japon', 'japones', 'fusion', 'casiopea', 'ryo fukui'],
    reply:
      '¡El Jazz y City Pop japonés de los 70s y 80s son joyas absolutas de la ingeniería sonora! El prensado en vinilo de sellos como Three Blind Mice o Alfa Records utilizaba vinilo virgen super silencioso con microfonía Neumann.',
    suggestions: [
      {
        title: 'Scenery',
        artist: 'Ryo Fukui',
        year: '1976',
        genre: 'Modal Jazz / Hard Bop',
        reason: 'Grabado con piano acústico capturado con extrema cercanía y rango dinámico.',
        deezerQuery: 'Ryo Fukui Scenery',
      },
      {
        title: 'Mint Jams',
        artist: 'Casiopea',
        year: '1982',
        genre: 'Jazz Fusion',
        reason: 'Grabación en vivo con sonido impecable y bajo slap de Tetsuo Sakurai.',
        deezerQuery: 'Casiopea Mint Jams',
      },
    ],
    quickReplies: ['🎸 Recomiéndame Rock Progresivo', '🎧 ¿Qué es el rango dinámico?', '💿 Ver más Jazz'],
  },
  {
    keywords: ['master', 'masterizacion', 'ingeniero', 'sonido', 'calidad', 'hi-fi', 'audiophile', 'vinilo'],
    reply:
      'Para apreciar la máxima fidelidad sonora, busca masterizaciones que respeten el rango dinámico sin compresión agresiva (sin *brickwalling*). Ingenieros legendarios como Bernie Grundman, Bob Ludwig y Kevin Gray son garantía de sonido puro.',
    suggestions: [
      {
        title: 'Aja',
        artist: 'Steely Dan',
        year: '1977',
        genre: 'Jazz Rock / Yacht Rock',
        reason: 'El estándar de oro para probar la claridad tímbrica y respuesta de bajos en sistemas Hi-Fi.',
        deezerQuery: 'Steely Dan Aja',
      },
      {
        title: 'The Dark Side of the Moon',
        artist: 'Pink Floyd',
        year: '1973',
        genre: 'Progressive Rock',
        reason: 'Mezcla maestra de Alan Parsons en los estudios Abbey Road con paneos estereofónicos icónicos.',
        deezerQuery: 'Pink Floyd Dark Side of the Moon',
      },
    ],
    quickReplies: ['💿 Recomiéndame Jazz japonés', '🎛️ ¿Cómo calibrar mi tornamesa?', '⭐ ¿Cómo publicar una reseña?'],
  },
  {
    keywords: ['tornamesa', 'tocadiscos', 'aguja', 'calibrar', 'vinilo', 'anti-skating', 'peso'],
    reply:
      'Para calibrar tu tornamesa correctamente: 1) Ajusta el contrapeso a cero con el brazo flotando. 2) Aplica la fuerza de tracking recomendada por el fabricante de tu cápsula (ej: 1.75g - 2.0g). 3) Ajusta el *anti-skating* al mismo valor que el peso de la aguja.',
    suggestions: [
      {
        title: 'Discovery',
        artist: 'Daft Punk',
        year: '2001',
        genre: 'French House',
        reason: 'Excelente para probar la respuesta transitoria y pegada rítmica de tu cápsula.',
        deezerQuery: 'Daft Punk Discovery',
      },
    ],
    quickReplies: ['💿 Recomiéndame Jazz japonés', '🎸 Álbumes con mejor masterización', '🏆 ¿Cómo ganar Sonar Coins?'],
  },
  {
    keywords: ['coins', 'monedas', 'sonar coins', 'puntos', 'recompensas', 'skins', 'tienda', 'nivel'],
    reply:
      'Puedes ganar **Sonar Coins** y experiencia XP en SONAR de varias formas:\n1. 🎧 Escuchando canciones completas en el reproductor.\n2. ⭐ Publicando reseñas y críticas de álbumes.\n3. 🎁 Abriendo tu Caja Diaria (*Daily Crate Drop*) en tu Perfil.\n4. 🛒 Luego puedes canjear skins de Casete y VU Meter en la Boutique.',
    suggestions: [],
    quickReplies: ['💿 Recomiéndame un álbum', '🔒 ¿Cómo funciona el Control Parental?', '⭐ Escribir reseña'],
  },
]

export async function sendChatMessage(message, sessionId = 'default-session', context = {}) {
  const cleanMsg = (message || '').trim()
  if (!cleanMsg) {
    throw new Error('El mensaje no puede estar vacío.')
  }

  // 1. Intentar llamar al Webhook de n8n
  for (const endpoint of DEFAULT_ENDPOINTS) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 6000)

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanMsg,
          sessionId,
          userName: context.userName || 'Melómano',
          preferences: context.preferences || [],
        }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (res.ok) {
        const data = await res.json()
        if (data && data.message) {
          return {
            success: true,
            source: 'n8n-gemini',
            message: data.message,
            suggestions: data.suggestions || [],
            quickReplies: data.quickReplies || [
              '💿 Recomiéndame Jazz japonés',
              '🎸 Álbumes con mejor masterización',
              '🎧 ¿Cómo calibrar mi tornamesa?',
            ],
            sessionId: data.sessionId || sessionId,
            timestamp: data.timestamp || new Date().toISOString(),
          }
        }
      }
    } catch {
      // Continuar al siguiente endpoint o fallback local
    }
  }

  // 2. Fallback Inteligente Local
  await new Promise((r) => setTimeout(r, 450))

  const lower = cleanMsg.toLowerCase()
  const match = LOCAL_KNOWLEDGE.find((item) =>
    item.keywords.some((kw) => lower.includes(kw))
  )

  if (match) {
    return {
      success: true,
      source: 'local-sommelier',
      message: match.reply,
      suggestions: match.suggestions,
      quickReplies: match.quickReplies,
      sessionId,
      timestamp: new Date().toISOString(),
    }
  }

  return {
    success: true,
    source: 'local-sommelier',
    message: `¡Excelente pregunta! Como Sommelier Musical de SONAR, te recomiendo explorar obras con gran cuidado en la dinámica y producción. Cuéntame qué género musical te gusta o qué estado de ánimo buscas hoy para sugerirte álbumes selectos.`,
    suggestions: [
      {
        title: 'To Pimp a Butterfly',
        artist: 'Kendrick Lamar',
        year: '2015',
        genre: 'Conscious Hip-Hop / Jazz Rap',
        reason: 'Arreglos orquestales y bajo acústico con instrumentación en vivo de Thundercat y Kamasi Washington.',
        deezerQuery: 'Kendrick Lamar To Pimp a Butterfly',
      },
      {
        title: 'In Rainbows',
        artist: 'Radiohead',
        year: '2007',
        genre: 'Art Rock',
        reason: 'Espacialidad acústica y calidez en la cinta de 2 pulgadas analógica grabada en Covent Garden.',
        deezerQuery: 'Radiohead In Rainbows',
      },
    ],
    quickReplies: [
      '💿 Recomiéndame Jazz japonés',
      '🎸 Álbumes con mejor masterización',
      '🎧 ¿Cómo calibrar mi tornamesa?',
    ],
    sessionId,
    timestamp: new Date().toISOString(),
  }
}

export default {
  sendChatMessage,
}
