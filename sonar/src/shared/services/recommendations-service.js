// Servicio de Recomendaciones Personalizadas por Usuario

export const GENRE_OPTIONS = [
  'Art Rock',
  'Electrónica',
  'Psicodelia',
  'Jazz & Fusion',
  'Post-Punk',
  'Synthwave',
  'Ambient & Drone',
  'Dream Pop',
  'Hip-Hop Experimental',
  'Folk Acústico',
  'IDM / Techno',
  'Neo-Soul',
];

export const DEFAULT_FALLBACK_COVER =
  'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg';

export const DEFAULT_FALLBACK_PREVIEW =
  'https://cdnt-preview.dzcdn.net/api/1/1/5/3/f/0/53faff1741bb65b8ddbc11780555c546.mp3';

export const CATALOG_RECOMMENDATIONS = [
  // Art Rock
  {
    id: 'rec-1',
    title: 'In Rainbows',
    artist: 'Radiohead',
    year: '2007',
    genre: 'Art Rock',
    cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
    rating: 4.9,
    description: 'La cumbre de la espacialidad acústica y la calidez analógica.',
    previewUrl: 'https://cdnt-preview.dzcdn.net/api/1/1/5/3/f/0/53faff1741bb65b8ddbc11780555c546.mp3',
  },
  {
    id: 'rec-3',
    title: 'Vespertine',
    artist: 'Björk',
    year: '2001',
    genre: 'Art Rock',
    cover: 'https://cdn-images.dzcdn.net/images/cover/4bd6b0232c2092faf145101453cb1051/500x500-000000-80-0-0.jpg',
    rating: 4.9,
    description: 'Micro-ritmos y arreglos de cuerdas íntimos de alta fidelidad.',
  },
  {
    id: 'rec-13',
    title: 'The Dark Side of the Moon',
    artist: 'Pink Floyd',
    year: '1973',
    genre: 'Art Rock',
    cover: 'https://cdn-images.dzcdn.net/images/cover/e635a8510c1a74bc089b3566ebbb9cb8/500x500-000000-80-0-0.jpg',
    rating: 5.0,
    description: 'Monumento a la ingeniería sonora en Abbey Road.',
  },
  {
    id: 'rec-14',
    title: 'Kid A',
    artist: 'Radiohead',
    year: '2000',
    genre: 'Art Rock',
    cover: 'https://cdn-images.dzcdn.net/images/cover/e5925065cdb1cefbc3bd75af4a1f1801/500x500-000000-80-0-0.jpg',
    rating: 4.9,
    description: 'Jazz experimental y electrónica analógica vanguardista.',
  },

  // Electrónica / IDM
  {
    id: 'rec-2',
    title: 'Discovery',
    artist: 'Daft Punk',
    year: '2001',
    genre: 'Electrónica',
    cover: 'https://cdn-images.dzcdn.net/images/cover/5718f7c81c27e0b2417e2a4c45224f8a/500x500-000000-80-0-0.jpg',
    rating: 4.8,
    description: 'Obra maestra de compresión y sampleo analógico atemporal.',
    previewUrl: 'https://cdns-preview-e.dzcdn.net/stream/c-e58f0cf41f021e1026600c3b53a812df-3.mp3',
  },
  {
    id: 'rec-6',
    title: 'Selected Ambient Works',
    artist: 'Aphex Twin',
    year: '1992',
    genre: 'Electrónica',
    cover: 'https://cdn-images.dzcdn.net/images/cover/e5925065cdb1cefbc3bd75af4a1f1801/500x500-000000-80-0-0.jpg',
    rating: 4.8,
    description: 'Texturas etéreas y sintetizadores analógicos indispensables.',
  },
  {
    id: 'rec-15',
    title: 'MOTOMAMI',
    artist: 'ROSALÍA',
    year: '2022',
    genre: 'Electrónica',
    cover: 'https://cdn-images.dzcdn.net/images/cover/66ae12120936d9660d3e30a7db7627b8/500x500-000000-80-0-0.jpg',
    rating: 4.7,
    description: 'Deconstrucción de texturas urbanas y sintetizadores vanguardistas.',
  },
  {
    id: 'rec-16',
    title: 'Melodrama',
    artist: 'Lorde',
    year: '2017',
    genre: 'Dream Pop',
    cover: 'https://cdn-images.dzcdn.net/images/cover/0c424dbe627530cd06a6fd408baba3f3/500x500-000000-80-0-0.jpg',
    rating: 4.8,
    description: 'Elegante balance entre producción pop emocional y capas de sintetizadores.',
  },

  // Jazz & Fusion
  {
    id: 'rec-5',
    title: 'Kind of Blue',
    artist: 'Miles Davis',
    year: '1959',
    genre: 'Jazz & Fusion',
    cover: 'https://cdn-images.dzcdn.net/images/cover/11075d5a71120a1ce2d94cf219d266e7/500x500-000000-80-0-0.jpg',
    rating: 5.0,
    description: 'El disco de jazz por excelencia para audiófilos.',
  },
  {
    id: 'rec-17',
    title: 'Abbey Road',
    artist: 'The Beatles',
    year: '1969',
    genre: 'Art Rock',
    cover: 'https://cdn-images.dzcdn.net/images/cover/aa94ab293730bb7845d2aa8c672b2c29/500x500-000000-80-0-0.jpg',
    rating: 4.9,
    description: 'Mezcla analógica insuperable de cuatro pistas en Abbey Road.',
  },

  // Psicodelia
  {
    id: 'rec-4',
    title: 'Currents',
    artist: 'Tame Impala',
    year: '2015',
    genre: 'Psicodelia',
    cover: 'https://cdn-images.dzcdn.net/images/cover/de5b9b704cd4ec36f8bf49beb3e17ba2/500x500-000000-80-0-0.jpg',
    rating: 4.7,
    description: 'Bajos envolventes y sintetizadores polifónicos de gran factura.',
  },

  // Post-Punk
  {
    id: 'rec-7',
    title: 'Unknown Pleasures',
    artist: 'Joy Division',
    year: '1979',
    genre: 'Post-Punk',
    cover: 'https://cdn-images.dzcdn.net/images/cover/2eb0eb7e399bf081a28a11ea8974591f/500x500-000000-80-0-0.jpg',
    rating: 4.8,
    description: 'Producción cavernosa y legendaria de Martin Hannett.',
  },

  // Hip-Hop Experimental
  {
    id: 'rec-22',
    title: 'To Pimp a Butterfly',
    artist: 'Kendrick Lamar',
    year: '2015',
    genre: 'Hip-Hop Experimental',
    cover: 'https://cdn-images.dzcdn.net/images/cover/00dd0da365a94b1829302d6b7fec70e6/500x500-000000-80-0-0.jpg',
    rating: 5.0,
    description: 'Fusión monumental de jazz libre, funk y narrativa visceral.',
  },

  // R&B / Neo-Soul
  {
    id: 'rec-23',
    title: 'Blonde',
    artist: 'Frank Ocean',
    year: '2016',
    genre: 'Neo-Soul',
    cover: 'https://cdn-images.dzcdn.net/images/cover/aa7e6de00b0810f5051aa60b489f58d8/500x500-000000-80-0-0.jpg',
    rating: 4.9,
    description: 'Minimalismo y pureza vocal en cinta analógica.',
  },
];

/**
 * Obtiene recomendaciones adaptadas a los gustos y preferencias de un usuario.
 */
export function getRecommendationsForUser(user, activeGenreFilter = null) {
  const preferences = user?.preferences && user.preferences.length > 0
    ? user.preferences
    : ['Art Rock', 'Electrónica'];

  // Puntuamos el catálogo según coincidencias con las preferencias del usuario
  const scored = CATALOG_RECOMMENDATIONS.map((album) => {
    const isPreferred = preferences.some(
      (pref) => pref.toLowerCase() === album.genre.toLowerCase()
    );

    let matchPercentage = 80;
    let matchReason = '';

    if (isPreferred) {
      matchPercentage = Math.min(99, Math.round(92 + album.rating * 1.5));
      matchReason = `Recomendado porque disfrutas de ${album.genre}`;
    } else {
      matchPercentage = Math.min(88, Math.round(72 + album.rating * 2.5));
      matchReason = `Excelente referencia para explorar ${album.genre}`;
    }

    return {
      ...album,
      isPreferred,
      matchPercentage,
      matchReason,
      matchScore: isPreferred ? 100 + album.rating * 10 : album.rating * 10,
    };
  });

  // Si hay un filtro activo específico, filtramos primero
  const filtered = activeGenreFilter && activeGenreFilter !== 'Todos'
    ? scored.filter((item) => item.genre.toLowerCase() === activeGenreFilter.toLowerCase())
    : scored;

  // Ordenamos primero los que coinciden con los gustos del usuario, luego por calificación
  return filtered.sort((a, b) => b.matchScore - a.matchScore);
}
