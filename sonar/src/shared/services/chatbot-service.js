/**
 * Servicio de ChatBot: SONAR AI Sommelier Musical
 * Conecta con el webhook de n8n o utiliza fallback local interactivo.
 */

const N8N_CHATBOT_URL =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_CHATBOT_WEBHOOK_URL

const DEFAULT_ENDPOINTS = [
  N8N_CHATBOT_URL,
  'http://localhost:5678/webhook/sonar-chatbot',
  'http://localhost:5678/webhook-test/sonar-chatbot',
].filter(Boolean)

// Base de conocimiento local para contingencia inteligente por temas
const LOCAL_KNOWLEDGE = [
  {
    keywords: ['jazz', 'japon', 'japones', 'fusion', 'casiopea', 'ryo fukui', 't-square', 'masayoshi'],
    reply:
      '¡El Jazz y City Pop japonés de los 70s y 80s son joyas absolutas de la ingeniería sonora! Sellos como Three Blind Mice y Alfa Records utilizaron prensado en vinilo virgen silencioso con microfonía Neumann de condensador para capturar cada matiz armónico.',
    suggestions: [
      {
        title: 'Scenery',
        artist: 'Ryo Fukui',
        year: '1976',
        genre: 'Modal Jazz / Hard Bop',
        reason: 'Grabación de piano acústico con microfonía cercana, calidez analógica y ataque percusivo nítido.',
        deezerQuery: 'Ryo Fukui Scenery',
      },
      {
        title: 'Mint Jams',
        artist: 'Casiopea',
        year: '1982',
        genre: 'Jazz Fusion',
        reason: 'Grabación en vivo mítica en el Chuo Kaikan de Tokio con balance estéreo magistral.',
        deezerQuery: 'Casiopea Mint Jams',
      },
    ],
    quickReplies: ['🎸 Recomiéndame Rock Progresivo', '🎧 ¿Qué es el rango dinámico?', '💿 Ver más Jazz'],
  },
  {
    keywords: ['rock', 'progresivo', 'pink floyd', 'led zeppelin', 'king crimson', 'queen', 'rush', 'guitarra'],
    reply:
      'En el Rock Clásico y Progresivo, la riqueza sonora proviene del uso de cintas analógicas de 24 pistas y salas con acústica viva. Discos grabados en Abbey Road, Trident o Sound City capturan la pegada natural de la batería y la reverberación de amplificadores de bulbos.',
    suggestions: [
      {
        title: 'The Dark Side of the Moon',
        artist: 'Pink Floyd',
        year: '1973',
        genre: 'Progressive Rock',
        reason: 'Ingeniería de Alan Parsons con sintetizadores EMS VCS3, paneos estéreo envolventes y relojes mecánicos.',
        deezerQuery: 'Pink Floyd Dark Side of the Moon',
      },
      {
        title: 'In the Court of the Crimson King',
        artist: 'King Crimson',
        year: '1969',
        genre: 'Progressive Rock',
        reason: 'Dinámica orquestal con Mellotron e intensidad rítmica legendaria.',
        deezerQuery: 'King Crimson In the Court of the Crimson King',
      },
    ],
    quickReplies: ['💿 Recomiéndame Jazz japonés', '🎛️ Discos con mejor masterización', '🎧 Probar con auriculares'],
  },
  {
    keywords: ['electronica', 'techno', 'house', 'daft punk', 'kraftwerk', 'ambient', 'sintetizador', 'aphex twin', 'brian eno'],
    reply:
      'La música electrónica de alta gama destaca por la respuesta en frecuencias subgraves (20Hz-60Hz) y la separación de capas tímbricas sintéticas mediante secuenciadores analógicos como el Minimoog o Roland TB-303.',
    suggestions: [
      {
        title: 'Random Access Memories',
        artist: 'Daft Punk',
        year: '2013',
        genre: 'Nu-Disco / Electronic',
        reason: 'Masterizado por Bob Ludwig. Grabado combinando sintetizadores modulares con músicos de sesión en vivo.',
        deezerQuery: 'Daft Punk Random Access Memories',
      },
      {
        title: 'Music for Airports',
        artist: 'Brian Eno',
        year: '1978',
        genre: 'Ambient',
        reason: 'Loops de cinta analógica con capas polifónicas sutiles y espacialidad tridimensional.',
        deezerQuery: 'Brian Eno Music for Airports',
      },
    ],
    quickReplies: ['🎛️ Discos con mejor masterización', '🎸 Recomiéndame Rock Clásico', '💿 Ver Jazz'],
  },
  {
    keywords: ['metal', 'heavy', 'metallica', 'iron maiden', 'black sabbath', 'tool', 'opeth', 'bateria'],
    reply:
      'Para el Metal audiófilo, busca álbumes con baterías orgánicas (sin reemplazo por samples sintéticos aplastados) y separación nítida entre guitarras afinadas en graves y la línea de bajo.',
    suggestions: [
      {
        title: 'Lateralus',
        artist: 'Tool',
        year: '2001',
        genre: 'Progressive Metal',
        reason: 'Ingeniería de Joe Barresi con batería de Danny Carey en tomas acústicas de sala gigantesca.',
        deezerQuery: 'Tool Lateralus',
      },
      {
        title: 'Blackwater Park',
        artist: 'Opeth',
        year: '2001',
        genre: 'Progressive Death Metal',
        reason: 'Producido por Steven Wilson, con transiciones impecables entre pasajes acústicos y distorsión pesada.',
        deezerQuery: 'Opeth Blackwater Park',
      },
    ],
    quickReplies: ['🎸 Rock Progresivo', '🎛️ Discos con mejor masterización', '🎧 Calibrar sonido'],
  },
  {
    keywords: ['hip hop', 'rap', 'kendrick', 'kanye', 'madlib', 'mf doom', 'graves', 'subwoofer', 'sample'],
    reply:
      'El Hip-Hop de producción refinada utiliza técnicas de sampling desde vinilos oscuros combinados con cajas de ritmo analógicas (E-mu SP-1200, Akai MPC3000) e instrumentación orquestal en vivo.',
    suggestions: [
      {
        title: 'To Pimp a Butterfly',
        artist: 'Kendrick Lamar',
        year: '2015',
        genre: 'Conscious Hip-Hop / Jazz',
        reason: 'Mezcla analógica por MixedByAli con Thundercat en bajo y arreglos de vientos en vivo.',
        deezerQuery: 'Kendrick Lamar To Pimp a Butterfly',
      },
      {
        title: 'Madvillainy',
        artist: 'Madvillain (MF DOOM & Madlib)',
        year: '2004',
        genre: 'Underground Hip-Hop',
        reason: 'Collage de texturas analógicas y samples de vinilo con calidez cruda inconfundible.',
        deezerQuery: 'Madvillain Madvillainy',
      },
    ],
    quickReplies: ['💿 Recomiéndame Jazz japonés', '🎛️ Discos con mejor masterización', '🎁 Ganar Sonar Coins'],
  },
  {
    keywords: ['master', 'masterizacion', 'ingeniero', 'sonido', 'calidad', 'hi-fi', 'audiophile', 'dinamica', 'rango'],
    reply:
      'Para apreciar la máxima fidelidad sonora, busca masterizaciones que respeten el rango dinámico sin compresión agresiva (sin la guerra del volumen o *loudness war*). Ingenieros legendarios como Bernie Grundman, Bob Ludwig y Kevin Gray son garantía de sonido puro y transparente.',
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
        title: 'The Nightfly',
        artist: 'Donald Fagen',
        year: '1982',
        genre: 'Jazz Pop / Soft Rock',
        reason: 'Una de las primeras grabaciones digitales multitrack (3M 32-track) con una limpieza acústica quirúrgica.',
        deezerQuery: 'Donald Fagen The Nightfly',
      },
    ],
    quickReplies: ['💿 Recomiéndame Jazz japonés', '🎛️ ¿Cómo calibrar mi tornamesa?', '⭐ ¿Cómo publicar una reseña?'],
  },
  {
    keywords: ['tornamesa', 'tocadiscos', 'aguja', 'calibrar', 'vinilo', 'anti-skating', 'peso', 'capsula'],
    reply:
      'Para calibrar tu tornamesa correctamente:\n1. Ajusta el contrapeso a cero con el brazo flotando horizontalmente.\n2. Aplica la fuerza de tracking recomendada por el fabricante de tu cápsula (ej: 1.75g - 2.0g para Audio-Technica / Ortofon).\n3. Ajusta el *anti-skating* al mismo valor que el peso de la aguja para evitar desgaste asimétrico del surco.',
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
          console.info('[Sonaria Service] Respuesta recibida desde n8n:', endpoint)
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

  // Generador de respuesta dinámica contextual para consultas generales
  const suggestionsPool = [
    {
      title: 'Aja',
      artist: 'Steely Dan',
      year: '1977',
      genre: 'Jazz Rock / Hi-Fi',
      reason: 'Mezcla legendaria considerada el estándar de oro para probar la transparencia en sistemas de sonido.',
      deezerQuery: 'Steely Dan Aja',
    },
    {
      title: 'Scenery',
      artist: 'Ryo Fukui',
      year: '1976',
      genre: 'Modal Jazz',
      reason: 'Grabación de trío acústico con piano brillante y microfonía que capta cada armónico del contrabajo.',
      deezerQuery: 'Ryo Fukui Scenery',
    },
    {
      title: 'In Rainbows',
      artist: 'Radiohead',
      year: '2007',
      genre: 'Art Rock',
      reason: 'Espacialidad acústica y calidez en cinta analógica de 2 pulgadas grabada en Covent Garden.',
      deezerQuery: 'Radiohead In Rainbows',
    },
    {
      title: 'Random Access Memories',
      artist: 'Daft Punk',
      year: '2013',
      genre: 'Nu-Disco / Electronic',
      reason: 'Masterización premiada con Grammy por Bob Ludwig con batería acústica e instrumentos vintage.',
      deezerQuery: 'Daft Punk Random Access Memories',
    },
  ]

  // Seleccionar 2 sugerencias aleatorias para que cada respuesta sea única
  const shuffled = [...suggestionsPool].sort(() => 0.5 - Math.random())
  const selectedSuggestions = shuffled.slice(0, 2)

  return {
    success: true,
    source: 'local-sommelier',
    message: `¡Excelente consulta! Como **Sonaria**, analizo la música desde la producción, la calidez analógica y el rango dinámico.\n\nPara explorar en profundidad lo que me preguntas sobre *"${cleanMsg.length > 50 ? cleanMsg.slice(0, 50) + '...' : cleanMsg}"*, te recomiendo sumergirte en estas obras con fidelidad acústica superior:`,
    suggestions: selectedSuggestions,
    quickReplies: [
      '💿 Recomiéndame Jazz japonés',
      '🎸 Álbumes de Rock Progresivo',
      '🎛️ ¿Qué es el rango dinámico?',
      '🎧 ¿Cómo calibrar mi tornamesa?',
    ],
    sessionId,
    timestamp: new Date().toISOString(),
  }
}

export default {
  sendChatMessage,
}
