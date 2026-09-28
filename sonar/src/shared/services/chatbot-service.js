/**
 * Servicio de ChatBot: SONAR AI Sommelier Musical
 * Conecta con el webhook de n8n o utiliza fallback local interactivo.
 */

const N8N_CHATBOT_URL =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_CHATBOT_WEBHOOK_URL

const DEFAULT_ENDPOINTS = [
  N8N_CHATBOT_URL,
  '/api/n8n/webhook/sonar-chatbot',
  '/api/n8n/webhook-test/sonar-chatbot',
  'http://localhost:5678/webhook/sonar-chatbot',
  'http://localhost:5678/webhook-test/sonar-chatbot',
].filter(Boolean)

// Base de conocimiento específica de la plataforma SONAR
const LOCAL_KNOWLEDGE = [
  {
    keywords: ['que es sonar', 'plataforma', 'pagina', 'app', 'web', 'funciones', 'herramientas', 'que puedo hacer', 'ayuda'],
    reply:
      '¡Bienvenido a **SONAR**! 🎧 Somos la plataforma web definitiva para melómanos y amantes del audio de alta fidelidad. En SONAR puedes:\n\n1. 💿 **Explorar el Catálogo Hi-Fi**: Descubre álbumes legendarios con preescuchas y datos de masterización.\n2. ⭐ **Publicar Reseñas y Críticas**: Califica del 1 al 10 y analiza la dinámica de sonido con moderación IA.\n3. 🪙 **Ganar Sonar Coins**: Acumula monedas escuchando música (+5), publicando reseñas (+50) y abriendo tu Caja Diaria (+100).\n4. 🛒 **Boutique de Skins**: Canjea skins de Casetes y Medidores VU analógicos.\n5. 🔒 **Control Parental**: Protege a los más jóvenes con perfiles Junior y PIN de 4 dígitos.\n6. 📰 **Noticias y Newsletter**: Suscríbete al boletín semanal de audio y vinilos.',
    suggestions: [
      {
        title: 'Aja',
        artist: 'Steely Dan',
        year: '1977',
        genre: 'Jazz Rock / Hi-Fi',
        reason: 'Álbum destacado en el catálogo de SONAR por su legendaria fidelidad acústica.',
        deezerQuery: 'Steely Dan Aja',
      },
      {
        title: 'Random Access Memories',
        artist: 'Daft Punk',
        year: '2013',
        genre: 'Nu-Disco / Hi-Fi',
        reason: 'Masterizado por Bob Ludwig. Uno de los discos más escuchados en la plataforma.',
        deezerQuery: 'Daft Punk Random Access Memories',
      },
    ],
    quickReplies: [
      '🪙 ¿Cómo ganar Sonar Coins?',
      '⭐ ¿Cómo publicar una reseña?',
      '🛒 Ver Boutique de Skins',
      '🔒 ¿Cómo activar Control Parental?',
    ],
  },
  {
    keywords: ['resena', 'reseña', 'critica', 'calificar', 'estrellas', 'opinar', 'escribir reseña', 'comentario', 'moderacion'],
    reply:
      'En **SONAR**, publicar tus reseñas es muy sencillo y te otorga **+50 Sonar Coins**:\n\n1. Dirígete a cualquier álbum en el **Catálogo** o presiona el botón **"Reseñar"** en las sugerencias.\n2. Asigna una calificación de **1 a 10 estrellas**.\n3. Escribe tu análisis sobre la calidad de sonido, producción y dinámica.\n4. Al enviar, nuestro sistema de moderación automática mediante **IA en n8n** evaluará la reseña para publicarla en la comunidad.',
    suggestions: [
      {
        title: 'The Dark Side of the Moon',
        artist: 'Pink Floyd',
        year: '1973',
        genre: 'Progressive Rock',
        reason: 'El álbum con más reseñas y debates técnicos en la comunidad de SONAR.',
        deezerQuery: 'Pink Floyd Dark Side of the Moon',
      },
    ],
    quickReplies: ['🪙 ¿Para qué sirven las Sonar Coins?', '💿 Ir al Catálogo de Álbumes', '👤 Ver mi Perfil'],
  },
  {
    keywords: ['coins', 'monedas', 'sonar coins', 'puntos', 'recompensas', 'ganar', 'dinero', 'xp', 'nivel'],
    reply:
      'Las **Sonar Coins** 🪙 son la moneda oficial de la plataforma SONAR. Puedes conseguirlas de las siguientes formas:\n\n• 🎧 **+5 Coins**: Por cada canción que escuches en el reproductor.\n• ⭐ **+50 Coins**: Por cada reseña o crítica publicada.\n• 🎁 **+100 Coins**: Al abrir tu **Caja Diaria (*Daily Crate Drop*)** en tu Perfil.\n• 🔥 **Racha diaria**: Bonificación multiplicadora por entrar días consecutivos.\n\nPuedes gastar tus monedas en la **Boutique** para desbloquear skins de Casete y VU Meters.',
    suggestions: [],
    quickReplies: ['🛒 ¿Qué hay en la Boutique?', '🎁 ¿Cómo abrir la Caja Diaria?', '⭐ Publicar una reseña'],
  },
  {
    keywords: ['boutique', 'tienda', 'skin', 'skins', 'casete', 'cassette', 'vu meter', 'personalizar', 'comprar'],
    reply:
      'En la **Boutique de SONAR** 🛒 puedes personalizar tu reproductor y perfil con cosméticos exclusivos:\n\n• 📼 **Skins de Casete Vintage**: Diseños retro de cintas de cromo, metal y ediciones limitadas.\n• 🎛️ **Medidores VU Analógicos**: Estilos retro con agujas retroiluminadas en ámbar, cian y carmesí.\n• 👑 **Insignias de Melómano**: Títulos de prestigio para lucir en tus reseñas públicas.',
    suggestions: [],
    quickReplies: ['🪙 ¿Cómo ganar más Sonar Coins?', '💿 Escuchar música en el Reproductor', '👤 Ir a mi Perfil'],
  },
  {
    keywords: ['caja', 'crate', 'daily', 'diaria', 'recompensa diaria', 'drop', 'regalo'],
    reply:
      'El **Daily Crate Drop** 🎁 es una recompensa gratuita que puedes reclamar una vez al día en tu **Perfil de Usuario**.\n\nAl abrirla obtendrás **100 Sonar Coins**, puntos de experiencia XP para subir de nivel y la oportunidad de conseguir cosméticos exclusivos para tu casete de audio.',
    suggestions: [],
    quickReplies: ['👤 Ir a mi Perfil', '🪙 Ver saldo de Sonar Coins', '🛒 Ir a la Boutique'],
  },
  {
    keywords: ['parental', 'junior', 'ninos', 'hijos', 'pin', 'filtro', 'explicito', 'familiar'],
    reply:
      'El **Control Parental y Modo Junior** 🔒 de SONAR garantiza un entorno musical seguro:\n\n1. **Perfil Junior**: Oculta automáticamente portadas, álbumes y letras con lenguaje o temáticas explícitas.\n2. **PIN de Seguridad**: Protegido por una clave de 4 dígitos para que solo los padres puedan modificar la configuración.\n3. **Activación rápida**: Puedes activarlo durante el registro o en los ajustes de tu cuenta.',
    suggestions: [],
    quickReplies: ['⚙️ Ajustes de Cuenta', '💿 Explorar Música Familiar', '📰 Ver Noticias de SONAR'],
  },
  {
    keywords: ['reproductor', 'musica', 'escuchar', 'player', 'play', 'cancion', 'track', 'audio', 'preescucha'],
    reply:
      'El **Reproductor Hi-Fi de SONAR** 🎧 está ubicado en la barra inferior de la pantalla:\n\n• Incluye preescuchas de alta fidelidad sincronizadas con Deezer.\n• Botones de control: Play/Pausa, anterior, siguiente y control deslizante de volumen.\n• Modo inmersivo con visualización de VU Meter dinámico.\n• ¡Cada pista escuchada suma **+5 Sonar Coins** a tu balance!',
    suggestions: [
      {
        title: 'Scenery',
        artist: 'Ryo Fukui',
        year: '1976',
        genre: 'Modal Jazz',
        reason: 'Perfecto para probar la respuesta del reproductor Hi-Fi de SONAR.',
        deezerQuery: 'Ryo Fukui Scenery',
      },
    ],
    quickReplies: ['💿 Buscar en el Catálogo', '🛒 Ver Skins de VU Meter', '🪙 Ver mis Coins'],
  },
  {
    keywords: ['catalogo', 'buscar', 'filtros', 'albumes', 'artistas', 'generos', 'disco', 'vinilo'],
    reply:
      'El **Catálogo de SONAR** 💿 reúne miles de obras maestras organizadas por:\n\n• **Géneros**: Jazz, Rock Clásico, Electrónica, City Pop, Clásica, Hip-Hop, Metal y más.\n• **Filtros Audíofilos**: Masterización Hi-Fi, prensados en vinilo y dinamismo acústico.\n• **Buscador Inteligente**: Escribe el nombre del álbum o artista en la barra superior para escucharlo de inmediato.',
    suggestions: [
      {
        title: 'Mint Jams',
        artist: 'Casiopea',
        year: '1982',
        genre: 'Jazz Fusion',
        reason: 'Grabación en vivo recomendada en el catálogo de SONAR.',
        deezerQuery: 'Casiopea Mint Jams',
      },
    ],
    quickReplies: ['⭐ Escribir una Reseña', '🎧 Probar Reproductor', '🪙 Ganar Sonar Coins'],
  },
  {
    keywords: ['noticias', 'newsletter', 'boletin', 'correo', 'suscripcion', 'articulos'],
    reply:
      'La sección de **Noticias y Boletín** 📰 de SONAR te mantiene al día con la vanguardia musical:\n\n• Artículos editoriales sobre historia del vinilo, acústica e ingeniería de sonido.\n• Suscripción al **Boletín Semanal** mediante integración directa con n8n para recibir lanzamientos y guías en tu correo.',
    suggestions: [],
    quickReplies: ['📰 Ir a Noticias', '💿 Ver Catálogo', '⭐ Publicar Reseña'],
  },
  {
    keywords: ['login', 'registro', 'cuenta', 'perfil', 'password', 'recuperar', 'otp', 'clave', 'seguridad'],
    reply:
      'La seguridad en **SONAR** 🛡️ cuenta con:\n\n• **Alertas de Inicio de Sesión**: Notificación inmediata ante nuevos accesos mediante n8n.\n• **Recuperación con Código OTP**: Envío de código de 6 dígitos a tu correo electrónico para restablecer tu contraseña en segundos.\n• **Perfil Personalizado**: Gestión de biografía, avatar, nivel XP y colecciones.',
    suggestions: [],
    quickReplies: ['👤 Ver mi Perfil', '🔒 Control Parental', '🪙 Ver mis Sonar Coins'],
  },
]

export async function sendChatMessage(message, sessionId = 'default-session', context = {}) {
  const cleanMsg = (message || '').trim()
  if (!cleanMsg) {
    throw new Error('El mensaje no puede estar vacío.')
  }

  const isPlaybackCommand =
    /^(?:reproduce|reproducir|pon|ponme|play|toca|escuchar|dale play|quiero escuchar)\b/i.test(cleanMsg) ||
    /(?:reproducir|reproduceme|tocar|ponerme)\b/i.test(cleanMsg)

  // 1. Intentar llamar al Webhook de n8n
  for (const endpoint of DEFAULT_ENDPOINTS) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

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
          console.info('[Sonaria Service] Respuesta recibida exitosamente desde n8n:', endpoint)
          return {
            success: true,
            source: 'n8n-gemini',
            message: data.message,
            suggestions: data.suggestions || [],
            quickReplies: data.quickReplies || [
              '🪙 ¿Cómo ganar Sonar Coins?',
              '⭐ ¿Cómo publicar una reseña?',
              '💿 Explorar Catálogo Hi-Fi',
              '🔒 ¿Cómo activar el Control Parental?',
            ],
            autoPlay: Boolean(data.autoPlay || isPlaybackCommand),
            sessionId: data.sessionId || sessionId,
            timestamp: data.timestamp || new Date().toISOString(),
          }
        }
      } else {
        console.warn(`[Sonaria Service] Endpoint ${endpoint} respondió con status: ${res.status}`)
      }
    } catch (err) {
      console.warn(`[Sonaria Service] No se pudo conectar con ${endpoint}:`, err?.message || err)
    }
  }

  // 2. Fallback Inteligente Local centrado en la plataforma SONAR
  await new Promise((r) => setTimeout(r, 350))

  const lower = cleanMsg.toLowerCase()

  // Si es un comando directo de reproducción
  if (isPlaybackCommand) {
    let playTitle = 'Aja'
    let playArtist = 'Steely Dan'
    let playGenre = 'Jazz Rock / Hi-Fi'
    let playReason = 'Iniciando reproducción de alta fidelidad en el reproductor de SONAR.'

    if (lower.includes('daft punk') || lower.includes('random access') || lower.includes('discovery')) {
      playTitle = 'Random Access Memories'
      playArtist = 'Daft Punk'
      playGenre = 'Nu-Disco / Hi-Fi'
    } else if (lower.includes('pink floyd') || lower.includes('dark side') || lower.includes('moon')) {
      playTitle = 'The Dark Side of the Moon'
      playArtist = 'Pink Floyd'
      playGenre = 'Progressive Rock'
    } else if (lower.includes('radiohead') || lower.includes('in rainbows') || lower.includes('kid a')) {
      playTitle = 'In Rainbows'
      playArtist = 'Radiohead'
      playGenre = 'Art Rock'
    } else if (lower.includes('jazz') || lower.includes('fukui') || lower.includes('scenery')) {
      playTitle = 'Scenery'
      playArtist = 'Ryo Fukui'
      playGenre = 'Modal Jazz'
    } else if (lower.includes('casiopea') || lower.includes('mint jams') || lower.includes('fusion')) {
      playTitle = 'Mint Jams'
      playArtist = 'Casiopea'
      playGenre = 'Jazz Fusion'
    } else if (lower.includes('kendrick') || lower.includes('butterfly') || lower.includes('hip hop')) {
      playTitle = 'To Pimp a Butterfly'
      playArtist = 'Kendrick Lamar'
      playGenre = 'Conscious Hip-Hop'
    }

    return {
      success: true,
      source: 'local-sommelier',
      message: `▶️ ¡Con gusto! Iniciando la reproducción de **${playTitle}** de **${playArtist}** en el reproductor de SONAR. Disfruta de la calidad de audio Hi-Fi y suma **+5 Sonar Coins**.`,
      suggestions: [
        {
          title: playTitle,
          artist: playArtist,
          year: 'Master Hi-Fi',
          genre: playGenre,
          reason: playReason,
          deezerQuery: `${playArtist} ${playTitle}`,
        },
      ],
      quickReplies: ['⏸️ Pausar música', '⭐ Escribir reseña de este álbum', '🪙 Ver mis Sonar Coins'],
      autoPlay: true,
      sessionId,
      timestamp: new Date().toISOString(),
    }
  }

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
      autoPlay: false,
      sessionId,
      timestamp: new Date().toISOString(),
    }
  }

  // Respuesta predeterminada centrada exclusivamente en SONAR
  return {
    success: true,
    source: 'local-sommelier',
    message: `¡Hola! Soy **Sonaria**, tu asistente oficial de la plataforma **SONAR**. 🎧\n\nPuedo guiarte por el catálogo, publicar reseñas, ayudarte a ganar **Sonar Coins**, o puedes pedirme cosas como *"reproduce Aja"*, *"pon Daft Punk"* o *"toca jazz"* para iniciar la música de inmediato.\n\n¿En qué herramienta o canción de SONAR te puedo ayudar hoy?`,
    suggestions: [
      {
        title: 'Aja',
        artist: 'Steely Dan',
        year: '1977',
        genre: 'Jazz Rock / Hi-Fi',
        reason: 'Álbum de referencia en el catálogo de SONAR con preescucha disponible.',
        deezerQuery: 'Steely Dan Aja',
      },
      {
        title: 'Random Access Memories',
        artist: 'Daft Punk',
        year: '2013',
        genre: 'Nu-Disco / Hi-Fi',
        reason: 'Producción multipremiada disponible para reproducir y reseñar.',
        deezerQuery: 'Daft Punk Random Access Memories',
      },
    ],
    quickReplies: [
      '▶️ Reproduce Steely Dan',
      '▶️ Pon Daft Punk',
      '🪙 ¿Cómo ganar Sonar Coins?',
      '⭐ ¿Cómo publicar una reseña?',
    ],
    autoPlay: false,
    sessionId,
    timestamp: new Date().toISOString(),
  }
}

export default {
  sendChatMessage,
}
