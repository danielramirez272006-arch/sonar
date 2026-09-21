function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export async function getRecommendations(userId) {
  // Reservado para personalizar las recomendaciones con el backend real.
  void userId
  await delay(500)

  return [
    {
      id: 'album_rec_01',
      title: 'Currents',
      artist: 'Tame Impala',
      coverUrl: '',
      reason: 'Recomendado por su combinación de psicodelia, electrónica y pop.',
    },
    {
      id: 'album_rec_02',
      title: 'Dummy',
      artist: 'Portishead',
      coverUrl: '',
      reason: 'Puede interesarte por sus atmósferas electrónicas y melancólicas.',
    },
    {
      id: 'album_rec_03',
      title: 'Mezzanine',
      artist: 'Massive Attack',
      coverUrl: '',
      reason: 'Coincide con una exploración de sonidos electrónicos y oscuros.',
    },
    {
      id: 'album_rec_04',
      title: 'In Rainbows',
      artist: 'Radiohead',
      coverUrl: '',
      reason: 'Recomendado por su mezcla de rock alternativo y producción experimental.',
    },
  ]
}

export async function getLyricalContext(albumName, artist) {
  await delay(1500)

  const title = typeof albumName === 'string' && albumName.trim()
    ? albumName.trim()
    : 'un álbum sin especificar'
  const artistName = typeof artist === 'string' && artist.trim()
    ? artist.trim()
    : 'un artista sin especificar'

  return {
    analisis: `Análisis de demostración de ${title}, de ${artistName}: este mock propone explorar la relación entre las melodías, el ritmo y las emociones del álbum.`,
    cita: 'Frase original de demostración, no extraída de una canción: «El eco dibuja caminos de luz».',
  }
}

export async function analyzeReview(review) {
  await delay(500)

  const content = typeof review === 'string' ? review : (typeof review?.content === 'string' ? review.content : '')
  const words = content.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []
  // Lista mínima de ejemplo; no constituye un sistema real de moderación.
  const offensiveWords = ['idiota', 'idiotas', 'imbécil', 'imbecil', 'mierda']
  const aiFlagged = words.some(word => offensiveWords.includes(word))

  return {
    aiFlagged,
    status: 'pending_moderation',
    reason: aiFlagged
      ? 'La reseña contiene lenguaje que requiere revisión.'
      : null,
  }
}

export default {
  analyzeReview,
  getRecommendations,
  getLyricalContext,
}


