/**
 * Deezer Service - Sonar (Mock / Pre-integración)
 * 
 * Funciones simuladas para búsqueda de álbumes y obtención de metadatos de Deezer.
 * Retorna datos estáticos para permitir el desarrollo continuo del frontend sin depender de la API externa.
 */

const mockAlbumsDb = [
  {
    id: 'in-rainbows',
    title: 'In Rainbows',
    artist: 'Radiohead',
    releaseDate: '2007-10-10',
    year: '2007',
    genre: 'Art Rock / Experimental',
    trackCount: 10,
    duration: '42:39',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&auto=format&fit=crop&q=80',
    coverSmall: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=80',
    previewTrack: {
      id: 1,
      title: '15 Step',
      duration: '3:57',
      previewUrl: 'https://cdn.example.com/audio/preview-15step.mp3',
    },
    rating: 4.8,
  },
  {
    id: 'random-access-memories',
    title: 'Random Access Memories',
    artist: 'Daft Punk',
    releaseDate: '2013-05-17',
    year: '2013',
    genre: 'French House / Disco',
    trackCount: 13,
    duration: '74:24',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    coverSmall: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    previewTrack: {
      id: 2,
      title: 'Get Lucky',
      duration: '4:08',
      previewUrl: 'https://cdn.example.com/audio/preview-getlucky.mp3',
    },
    rating: 4.5,
  },
  {
    id: 'untrue',
    title: 'Untrue',
    artist: 'Burial',
    releaseDate: '2007-11-05',
    year: '2007',
    genre: 'Future Garage / Ambient',
    trackCount: 13,
    duration: '50:33',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    coverSmall: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    previewTrack: {
      id: 3,
      title: 'Archangel',
      duration: '3:58',
      previewUrl: 'https://cdn.example.com/audio/preview-archangel.mp3',
    },
    rating: 5.0,
  },
  {
    id: 'currents',
    title: 'Currents',
    artist: 'Tame Impala',
    releaseDate: '2015-07-17',
    year: '2015',
    genre: 'Psychedelic Pop',
    trackCount: 13,
    duration: '51:12',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    coverSmall: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
    previewTrack: {
      id: 4,
      title: 'Let It Happen',
      duration: '4:16',
      previewUrl: 'https://cdn.example.com/audio/preview-letithappen.mp3',
    },
    rating: 4.8,
  },
];

/**
 * Busca álbumes por coincidencia de texto en título, artista o género.
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Array>} Lista de álbumes coincidentes
 */
export const searchAlbums = async (query = '') => {
  // Simulación de latencia de red (300ms)
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!query.trim()) {
    return mockAlbumsDb;
  }

  const normalizedQuery = query.toLowerCase().trim();
  return mockAlbumsDb.filter(
    (album) =>
      album.title.toLowerCase().includes(normalizedQuery) ||
      album.artist.toLowerCase().includes(normalizedQuery) ||
      album.genre.toLowerCase().includes(normalizedQuery)
  );
};

/**
 * Obtiene el detalle completo de un álbum por su ID.
 * @param {string|number} id - Identificador del álbum
 * @returns {Promise<Object>} Datos del álbum o el primero por defecto
 */
export const getAlbumDetails = async (id) => {
  // Simulación de latencia de red (200ms)
  await new Promise((resolve) => setTimeout(resolve, 200));

  const found = mockAlbumsDb.find((album) => String(album.id) === String(id));
  return found || mockAlbumsDb[0];
};

export default {
  searchAlbums,
  getAlbumDetails,
};
