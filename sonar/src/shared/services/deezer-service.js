import { resolveAccurateCoverForTrack, getFallbackCoverForAlbum } from './recommendations-service';

const DEEZER_CACHE = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos de cache en memoria

/**
 * Curated real Deezer albums with official high-res Deezer cover images
 */
export const DEFAULT_DEEZER_ALBUMS = [
  {
    id: 14880659,
    title: 'In Rainbows',
    artist: 'Radiohead',
    year: '2007',
    genre: 'Art Rock / Experimental',
    rating: 4.8,
    cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
    cover_xl: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/1000x1000-000000-80-0-0.jpg',
    cover_medium: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/250x250-000000-80-0-0.jpg',
    link: 'https://www.deezer.com/album/14880659',
    topTrack: {
      id: 138546803,
      title: '15 Step',
      duration: 237,
    },
  },
  {
    id: 10709540,
    title: 'Currents',
    artist: 'Tame Impala',
    year: '2015',
    genre: 'Psychedelic Pop',
    rating: 4.6,
    cover: 'https://cdn-images.dzcdn.net/images/cover/de5b9b704cd4ec36f8bf49beb3e17ba2/500x500-000000-80-0-0.jpg',
    cover_xl: 'https://cdn-images.dzcdn.net/images/cover/de5b9b704cd4ec36f8bf49beb3e17ba2/1000x1000-000000-80-0-0.jpg',
    cover_medium: 'https://cdn-images.dzcdn.net/images/cover/de5b9b704cd4ec36f8bf49beb3e17ba2/250x250-000000-80-0-0.jpg',
    link: 'https://www.deezer.com/album/10709540',
  },
  {
    id: 9896728,
    title: 'To Pimp A Butterfly',
    artist: 'Kendrick Lamar',
    year: '2015',
    genre: 'Hip Hop / Jazz',
    rating: 4.9,
    cover: 'https://cdn-images.dzcdn.net/images/cover/00dd0da365a94b1829302d6b7fec70e6/500x500-000000-80-0-0.jpg',
    cover_xl: 'https://cdn-images.dzcdn.net/images/cover/00dd0da365a94b1829302d6b7fec70e6/1000x1000-000000-80-0-0.jpg',
    cover_medium: 'https://cdn-images.dzcdn.net/images/cover/00dd0da365a94b1829302d6b7fec70e6/250x250-000000-80-0-0.jpg',
    link: 'https://www.deezer.com/album/9896728',
    explicit_lyrics: true,
    explicit: true,
  },
  {
    id: 537883642,
    title: 'Vespertine',
    artist: 'Björk',
    year: '2001',
    genre: 'Glitch Pop / Ambient',
    rating: 4.8,
    cover: 'https://cdn-images.dzcdn.net/images/cover/4bd6b0232c2092faf145101453cb1051/500x500-000000-80-0-0.jpg',
    cover_xl: 'https://cdn-images.dzcdn.net/images/cover/4bd6b0232c2092faf145101453cb1051/1000x1000-000000-80-0-0.jpg',
    cover_medium: 'https://cdn-images.dzcdn.net/images/cover/4bd6b0232c2092faf145101453cb1051/250x250-000000-80-0-0.jpg',
    link: 'https://www.deezer.com/album/537883642',
  },
  {
    id: 14880741,
    title: 'Kid A',
    artist: 'Radiohead',
    year: '2000',
    genre: 'Electronic Rock',
    rating: 4.8,
    cover: 'https://cdn-images.dzcdn.net/images/cover/e5925065cdb1cefbc3bd75af4a1f1801/500x500-000000-80-0-0.jpg',
    cover_xl: 'https://cdn-images.dzcdn.net/images/cover/e5925065cdb1cefbc3bd75af4a1f1801/1000x1000-000000-80-0-0.jpg',
    cover_medium: 'https://cdn-images.dzcdn.net/images/cover/e5925065cdb1cefbc3bd75af4a1f1801/250x250-000000-80-0-0.jpg',
    link: 'https://www.deezer.com/album/14880741',
  },
  {
    id: 344137457,
    title: 'Blonde',
    artist: 'Frank Ocean',
    year: '2016',
    genre: 'R&B / Neo-Soul',
    rating: 4.7,
    cover: 'https://cdn-images.dzcdn.net/images/cover/aa7e6de00b0810f5051aa60b489f58d8/500x500-000000-80-0-0.jpg',
    cover_xl: 'https://cdn-images.dzcdn.net/images/cover/aa7e6de00b0810f5051aa60b489f58d8/1000x1000-000000-80-0-0.jpg',
    cover_medium: 'https://cdn-images.dzcdn.net/images/cover/aa7e6de00b0810f5051aa60b489f58d8/250x250-000000-80-0-0.jpg',
    link: 'https://www.deezer.com/album/344137457',
    explicit_lyrics: true,
    explicit: true,
  },
  {
    id: 302127,
    title: 'Discovery',
    artist: 'Daft Punk',
    year: '2001',
    genre: 'French House / Disco',
    rating: 4.8,
    cover: 'https://cdn-images.dzcdn.net/images/cover/5718f7c81c27e0b2417e2a4c45224f8a/500x500-000000-80-0-0.jpg',
    cover_xl: 'https://cdn-images.dzcdn.net/images/cover/5718f7c81c27e0b2417e2a4c45224f8a/1000x1000-000000-80-0-0.jpg',
    cover_medium: 'https://cdn-images.dzcdn.net/images/cover/5718f7c81c27e0b2417e2a4c45224f8a/250x250-000000-80-0-0.jpg',
    link: 'https://www.deezer.com/album/302127',
  },
  {
    id: 12047952,
    title: 'Abbey Road',
    artist: 'The Beatles',
    year: '1969',
    genre: 'Classic Rock',
    rating: 4.9,
    cover: 'https://cdn-images.dzcdn.net/images/cover/aa94ab293730bb7845d2aa8c672b2c29/500x500-000000-80-0-0.jpg',
    cover_xl: 'https://cdn-images.dzcdn.net/images/cover/aa94ab293730bb7845d2aa8c672b2c29/1000x1000-000000-80-0-0.jpg',
    cover_medium: 'https://cdn-images.dzcdn.net/images/cover/aa94ab293730bb7845d2aa8c672b2c29/250x250-000000-80-0-0.jpg',
    link: 'https://www.deezer.com/album/12047952',
  },
  {
    id: 42886601,
    title: 'Melodrama',
    artist: 'Lorde',
    year: '2017',
    genre: 'Art Pop',
    rating: 4.6,
    cover: 'https://cdn-images.dzcdn.net/images/cover/0c424dbe627530cd06a6fd408baba3f3/500x500-000000-80-0-0.jpg',
    cover_xl: 'https://cdn-images.dzcdn.net/images/cover/0c424dbe627530cd06a6fd408baba3f3/1000x1000-000000-80-0-0.jpg',
    cover_medium: 'https://cdn-images.dzcdn.net/images/cover/0c424dbe627530cd06a6fd408baba3f3/250x250-000000-80-0-0.jpg',
    link: 'https://www.deezer.com/album/42886601',
  },
  {
    id: 302867697,
    title: 'MOTOMAMI',
    artist: 'ROSALÍA',
    year: '2022',
    genre: 'Avant-Pop / Reggaeton',
    rating: 4.7,
    cover: 'https://cdn-images.dzcdn.net/images/cover/66ae12120936d9660d3e30a7db7627b8/500x500-000000-80-0-0.jpg',
    cover_xl: 'https://cdn-images.dzcdn.net/images/cover/66ae12120936d9660d3e30a7db7627b8/1000x1000-000000-80-0-0.jpg',
    cover_medium: 'https://cdn-images.dzcdn.net/images/cover/66ae12120936d9660d3e30a7db7627b8/250x250-000000-80-0-0.jpg',
    link: 'https://www.deezer.com/album/302867697',
    explicit_lyrics: true,
    explicit: true,
  },
  {
    id: 12114240,
    title: 'The Dark Side of the Moon',
    artist: 'Pink Floyd',
    year: '1973',
    genre: 'Progressive Rock',
    rating: 4.9,
    cover: 'https://cdn-images.dzcdn.net/images/cover/e635a8510c1a74bc089b3566ebbb9cb8/500x500-000000-80-0-0.jpg',
    cover_xl: 'https://cdn-images.dzcdn.net/images/cover/e635a8510c1a74bc089b3566ebbb9cb8/1000x1000-000000-80-0-0.jpg',
    cover_medium: 'https://cdn-images.dzcdn.net/images/cover/e635a8510c1a74bc089b3566ebbb9cb8/250x250-000000-80-0-0.jpg',
    link: 'https://www.deezer.com/album/12114240',
  },
];

/**
 * Cliente HTTP resiliente con fallbacks automáticos, timeout y caché en memoria
 */
async function fetchDeezerApi(endpoint) {
  if (!endpoint) return null;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const cacheKey = cleanEndpoint.toLowerCase().trim();

  // Revisar caché
  const cached = DEEZER_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
  const candidateUrls = [];

  if (isBrowser) {
    candidateUrls.push(`/api/deezer${cleanEndpoint}`);
  }
  candidateUrls.push(`https://api.deezer.com${cleanEndpoint}`);
  candidateUrls.push(`https://corsproxy.io/?${encodeURIComponent(`https://api.deezer.com${cleanEndpoint}`)}`);
  candidateUrls.push(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.deezer.com${cleanEndpoint}`)}`);

  for (const url of candidateUrls) {
    try {
      let res;
      if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
        res = await fetch(url, { signal: AbortSignal.timeout(3500) });
      } else {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 3500);
        res = await fetch(url, { signal: controller.signal });
        clearTimeout(tid);
      }

      if (res && res.ok) {
        const json = await res.json();
        // Verificar que Deezer no devolvió un error de cuota o similar
        if (json && !json.error) {
          DEEZER_CACHE.set(cacheKey, { timestamp: Date.now(), data: json });
          return json;
        }
      }
    } catch {
      // Continuar al siguiente proxy
      continue;
    }
  }

  return null;
}

/**
 * Determina si una pista o álbum contiene contenido explícito (lenguaje adulto / letras explícitas)
 */
export const isExplicitTrack = (track) => {
  if (!track) return false;
  if (track.explicit === true || track.explicit_lyrics === true || track.explicit_content_lyrics === 1) return true;
  const title = String(track.title || '').toLowerCase();
  const album = String(track.album || track.albumTitle || '').toLowerCase();
  if (
    title.includes('[explicit]') ||
    title.includes('(explicit)') ||
    album.includes('[explicit]') ||
    album.includes('(explicit)') ||
    title.includes('[e]')
  ) {
    return true;
  }
  return false;
};

/**
 * Validador estricto para Modo Kids: Bloquea pistas explícitas, palabras clave prohibidas y temas para adultos
 */
export const isKidsSafeTrack = (track, extraSettings = null) => {
  if (!track) return false;
  if (isExplicitTrack(track)) return false;

  const title = String(track.title || '').toLowerCase();
  const artist = String(track.artist || '').toLowerCase();
  const album = String(track.album || track.albumTitle || '').toLowerCase();

  const defaultBlocked = [
    'explicit', 'violencia', 'drogas', 'sex', 'sexual', 'matar', 'muerte', 'asesinato',
    'gun', 'shot', 'gang', 'blood', 'fuck', 'bitch', 'shit', 'weed', 'cocaína', 'perreo sucio'
  ];

  const customBlocked = extraSettings?.blockedKeywords || [];
  const allBlocked = [...defaultBlocked, ...customBlocked.map((k) => String(k).toLowerCase())];

  for (const kw of allBlocked) {
    if (kw && kw.trim().length > 1 && (title.includes(kw) || artist.includes(kw) || album.includes(kw))) {
      return false;
    }
  }

  if (extraSettings?.blockedArtists && Array.isArray(extraSettings.blockedArtists)) {
    if (extraSettings.blockedArtists.some((a) => artist.includes(String(a).toLowerCase()))) {
      return false;
    }
  }

  return true;
};

/**
 * Normaliza un álbum de Deezer API al formato estándar de Sonar
 */
export const formatDeezerAlbum = (album) => {
  if (!album) return null;
  const isExplicit = Boolean(album.explicit_lyrics || album.explicit_content_lyrics === 1);
  return {
    id: album.id,
    title: album.title,
    artist: album.artist?.name || 'Artista',
    cover: album.cover_big || album.cover_medium || album.cover || '',
    cover_xl: album.cover_xl || album.cover_big || '',
    cover_medium: album.cover_medium || album.cover || '',
    genre: album.genres?.data?.[0]?.name || 'Música',
    year: album.release_date ? album.release_date.substring(0, 4) : '2024',
    rating: (4.4 + ((album.id % 6) * 0.1)).toFixed(1),
    link: album.link,
    nb_tracks: album.nb_tracks,
    explicit_lyrics: isExplicit,
    explicit: isExplicit,
  };
};

/**
 * Busca canciones y pistas en la API de Deezer con fallbacks resilientes
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Array>} Lista de canciones normalizadas con preview y carátula
 */
export const searchAlbums = async (query) => {
  if (!query || !query.trim()) return [];
  const cleanQuery = query.trim();

  try {
    // 1. Búsqueda directa de pistas en Deezer (/search?q=...)
    const data = await fetchDeezerApi(`/search?q=${encodeURIComponent(cleanQuery)}`);
    if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
      return data.data.map((item) => {
        const isExplicit = Boolean(item.explicit_lyrics || item.explicit_content_lyrics === 1);
        const rawObj = {
          id: item.id,
          title: item.title,
          artist: item.artist?.name || 'Artista',
          album: item.album?.title || item.title,
          albumTitle: item.album?.title || item.title,
          cover: item.album?.cover_big || item.album?.cover_medium || item.album?.cover || item.artist?.picture_big || '',
          cover_xl: item.album?.cover_xl || item.album?.cover_big || '',
          cover_medium: item.album?.cover_medium || item.album?.cover || '',
          genre: 'Música',
          year: item.album?.release_date ? item.album.release_date.substring(0, 4) : '2024',
          rating: (4.5 + ((item.id % 5) * 0.1)).toFixed(1),
          duration: item.duration,
          preview: item.preview,
          link: item.link,
          type: 'track',
          explicit_lyrics: isExplicit,
          explicit: isExplicit,
        };
        const accurateCover = resolveAccurateCoverForTrack(rawObj);
        return {
          ...rawObj,
          cover: accurateCover,
          cover_medium: accurateCover,
        };
      });
    }

    // 2. Fallback de búsqueda de álbumes si /search no trajo nada
    const albumData = await fetchDeezerApi(`/search/album?q=${encodeURIComponent(cleanQuery)}`);
    if (albumData && albumData.data && Array.isArray(albumData.data) && albumData.data.length > 0) {
      return albumData.data.map(formatDeezerAlbum);
    }
  } catch (error) {
    console.warn('Fallo en búsqueda remota de Deezer, usando catálogo local:', error);
  }

  // 3. Fallback a catálogo curado offline si Deezer no responde
  const lower = cleanQuery.toLowerCase();
  const matchedCurated = DEFAULT_DEEZER_ALBUMS.filter(
    (a) => a.title.toLowerCase().includes(lower) || a.artist.toLowerCase().includes(lower)
  );
  if (matchedCurated.length > 0) {
    return matchedCurated.map((a) => ({
      ...a,
      album: a.title,
      albumTitle: a.title,
      type: 'track',
      preview: a.topTrack?.preview || null,
    }));
  }

  return [];
};

/**
 * Obtiene detalles de un álbum por ID
 */
export const getAlbumById = async (id) => {
  if (!/^\d+$/.test(String(id))) return null;
  try {
    const data = await fetchDeezerApi(`/album/${id}`);
    if (data && !data.error && data.id && data.title) {
      return formatDeezerAlbum(data);
    }
  } catch (error) {
    console.warn('Error al obtener álbum de Deezer:', error);
  }

  // Fallback local por ID
  const local = DEFAULT_DEEZER_ALBUMS.find((a) => String(a.id) === String(id));
  return local ? formatDeezerAlbum(local) : null;
};

/**
 * Obtiene la lista de canciones de un álbum con sus URLs de preview de 30 segundos
 */
export const getAlbumTracks = async (albumId) => {
  if (!albumId) return [];
  try {
    const data = await fetchDeezerApi(`/album/${albumId}/tracks`);
    if (data && data.data && Array.isArray(data.data)) {
      return data.data.map((track) => {
        const isExplicit = Boolean(track.explicit_lyrics || track.explicit_content_lyrics === 1);
        return {
          id: track.id,
          title: track.title,
          duration: track.duration,
          preview: track.preview,
          rank: track.rank,
          artist: track.artist?.name || 'Artista',
          link: track.link,
          explicit_lyrics: isExplicit,
          explicit: isExplicit,
        };
      });
    }
  } catch (error) {
    console.warn('Error al obtener canciones del álbum de Deezer:', error);
  }

  return [];
};

/**
 * Obtiene una canción individual por ID desde Deezer con su preview firmado
 */
export const getTrackById = async (trackId) => {
  if (!trackId) return null;
  try {
    const track = await fetchDeezerApi(`/track/${trackId}`);
    if (track && !track.error && track.id) {
      const isExplicit = Boolean(track.explicit_lyrics || track.explicit_content_lyrics === 1);
      const rawObj = {
        id: track.id,
        title: track.title,
        artist: track.artist?.name || 'Artista',
        album: track.album?.title || '',
        cover: track.album?.cover_medium || track.album?.cover || '',
        cover_xl: track.album?.cover_xl || track.album?.cover_big || '',
        preview: track.preview,
        duration: track.duration,
        link: track.link,
        explicit_lyrics: isExplicit,
        explicit: isExplicit,
      };
      const accurateCover = resolveAccurateCoverForTrack(rawObj);
      return {
        ...rawObj,
        cover: accurateCover,
        cover_medium: accurateCover,
      };
    }
  } catch (error) {
    console.warn('Error al obtener canción por ID de Deezer:', error);
  }

  return null;
};

/**
 * Busca canciones directamente en Deezer con preview de 30 segundos
 */
export const searchTracks = async (query) => {
  if (!query || !query.trim()) return [];
  try {
    const data = await fetchDeezerApi(`/search?q=${encodeURIComponent(query.trim())}`);
    if (data && data.data && Array.isArray(data.data)) {
      return data.data.map((track) => {
        const isExplicit = Boolean(track.explicit_lyrics || track.explicit_content_lyrics === 1);
        const rawObj = {
          id: track.id,
          title: track.title,
          artist: track.artist?.name || 'Artista',
          album: track.album?.title || '',
          cover: track.album?.cover_medium || track.album?.cover || '',
          cover_xl: track.album?.cover_xl || track.album?.cover_big || '',
          preview: track.preview,
          duration: track.duration,
          link: track.link,
          explicit_lyrics: isExplicit,
          explicit: isExplicit,
        };
        const accurateCover = resolveAccurateCoverForTrack(rawObj);
        return {
          ...rawObj,
          cover: accurateCover,
          cover_medium: accurateCover,
        };
      });
    }
  } catch (error) {
    console.warn('Error al buscar canciones en Deezer:', error);
  }

  return [];
};

/**
 * Busca artistas específicamente en Deezer y obtiene sus canciones más destacadas
 */
export const searchArtists = async (query) => {
  if (!query || !query.trim()) return [];
  const cleanQuery = query.trim();

  try {
    const data = await fetchDeezerApi(`/search/artist?q=${encodeURIComponent(cleanQuery)}`);
    if (!data || !data.data || data.data.length === 0) {
      return searchTracks(cleanQuery);
    }

    const results = [];
    const topArtists = data.data.slice(0, 3);
    for (const artist of topArtists) {
      try {
        const topData = await fetchDeezerApi(`/artist/${artist.id}/top?limit=10`);
        if (topData && topData.data && topData.data.length > 0) {
          topData.data.forEach((track) => {
            const rawObj = {
              id: track.id,
              title: track.title,
              artist: artist.name,
              album: track.album?.title || 'Sencillo',
              albumTitle: track.album?.title || 'Sencillo',
              cover: track.album?.cover_big || track.album?.cover_medium || artist.picture_big || '',
              cover_xl: track.album?.cover_xl || track.album?.cover_big || artist.picture_xl || '',
              cover_medium: track.album?.cover_medium || artist.picture_medium || '',
              preview: track.preview,
              duration: track.duration,
              link: track.link,
              type: 'track',
              artistId: artist.id,
              rating: (4.6 + ((track.id % 4) * 0.1)).toFixed(1),
            };
            const accurateCover = resolveAccurateCoverForTrack(rawObj);
            results.push({
              ...rawObj,
              cover: accurateCover,
              cover_medium: accurateCover,
            });
          });
        }
      } catch (err) {
        console.warn('Error al obtener canciones del artista:', err);
      }
    }

    return results.length > 0 ? results : searchTracks(cleanQuery);
  } catch (error) {
    console.warn('Error al buscar artistas en Deezer:', error);
    return searchTracks(cleanQuery);
  }
};

/**
 * Resuelve dinámicamente un preview de audio válido y firmado para cualquier pista o álbum
 */
export const resolvePlayablePreview = async (item) => {
  if (!item) return null;

  // 0. Si es un archivo de audio local (/audio/...), podcast o Data URL / Blob
  const rawPreview = item.preview || item.previewUrl || item.audioUrl;
  if (
    typeof rawPreview === 'string' &&
    (rawPreview.startsWith('/audio/') ||
      rawPreview.startsWith('/') ||
      rawPreview.startsWith('blob:') ||
      rawPreview.startsWith('data:audio/'))
  ) {
    return rawPreview;
  }

  // 1. Si ya cuenta con una URL de preview válida
  if (item.preview && typeof item.preview === 'string' && item.preview.startsWith('http')) {
    return item.preview;
  }
  if (item.previewUrl && typeof item.previewUrl === 'string' && item.previewUrl.startsWith('http')) {
    return item.previewUrl;
  }

  // 2. Si tiene trackId o id numérico de canción
  if (item.trackId || (item.type === 'track' && item.id)) {
    const t = await getTrackById(item.trackId || item.id);
    if (t?.preview) {
      return t.preview;
    }
  }

  // 3. Si tiene ID de álbum Deezer, obtener canciones
  const albumId = item.deezerId || item.albumId || (typeof item.id === 'number' && item.id < 1000000000 ? item.id : null);
  if (albumId) {
    const tracks = await getAlbumTracks(albumId);
    const found = tracks.find((t) => t.preview);
    if (found?.preview) return found.preview;
  }

  // 4. Búsqueda directa por título y artista en Deezer
  const query = `${item.title || item.albumTitle || ''} ${item.artist || ''}`.trim();
  if (query) {
    const searchResults = await searchTracks(query);
    const found = searchResults.find((t) => t.preview) || searchResults[0];
    if (found?.preview) return found.preview;
  }

  // 5. Fallback con muestra sonora garantizada
  try {
    const fallbackResults = await searchTracks('Radiohead 15 Step');
    if (fallbackResults.length > 0 && fallbackResults[0].preview) {
      return fallbackResults[0].preview;
    }
  } catch {}

  return 'https://cdns-preview-d.dzcdn.net/stream/c-deda7fac944b3f76bfa77d75010eaddc-3.mp3';
};

/**
 * Obtiene la lista completa de canciones pertenecientes a un álbum o canción actual
 */
export const getTracksForAlbum = async (item) => {
  if (!item) return [];
  const albumId = item.deezerId || item.albumId || (typeof item.id === 'number' && item.id < 1000000000 ? item.id : null);
  const albumName = item.album || item.albumTitle || item.title || '';
  const artistName = item.artist || '';

  // 1. Si tenemos un albumId numérico de Deezer
  if (albumId) {
    try {
      const tracks = await getAlbumTracks(albumId);
      if (tracks && tracks.length > 0) {
        return tracks.map((t, index) => {
          const trackObj = {
            id: t.id,
            trackNumber: index + 1,
            title: t.title,
            artist: t.artist || artistName,
            album: albumName,
            albumTitle: albumName,
            cover: item.cover || item.cover_medium,
            duration: t.duration || 180,
            preview: t.preview,
            link: t.link,
            type: 'track',
          };
          const accurateCover = resolveAccurateCoverForTrack(trackObj);
          return {
            ...trackObj,
            cover: accurateCover,
            cover_medium: accurateCover,
          };
        });
      }
    } catch (e) {
      console.warn('Error obteniendo canciones del álbum Deezer:', e);
    }
  }

  // 2. Búsqueda directa por el nombre del álbum y artista
  if (albumName) {
    try {
      const query = `${albumName} ${artistName}`.trim();
      const results = await searchTracks(query);
      if (results && results.length > 0) {
        return results.slice(0, 15).map((t, index) => {
          const trackObj = {
            id: t.id,
            trackNumber: index + 1,
            title: t.title,
            artist: t.artist || artistName,
            album: t.album || albumName,
            albumTitle: t.album || albumName,
            cover: t.cover || item.cover,
            duration: t.duration || 180,
            preview: t.preview,
            link: t.link,
            type: 'track',
          };
          const accurateCover = resolveAccurateCoverForTrack(trackObj);
          return {
            ...trackObj,
            cover: accurateCover,
            cover_medium: accurateCover,
          };
        });
      }
    } catch (e) {
      console.warn('Error buscando canciones para el álbum:', e);
    }
  }

  // 3. Fallbacks de repertorio estándar
  const lowerTitle = (albumName || '').toLowerCase();
  if (lowerTitle.includes('discovery') || lowerTitle.includes('daft punk')) {
    const daftCover = 'https://cdn-images.dzcdn.net/images/cover/5718f7c81c27e0b2417e2a4c45224f8a/500x500-000000-80-0-0.jpg';
    return [
      { id: 3135556, trackNumber: 1, title: 'One More Time', artist: 'Daft Punk', album: 'Discovery', duration: 320, cover: daftCover, preview: item.preview, type: 'track' },
      { id: 3135557, trackNumber: 2, title: 'Aerodynamic', artist: 'Daft Punk', album: 'Discovery', duration: 207, cover: daftCover, preview: item.preview, type: 'track' },
      { id: 3135558, trackNumber: 3, title: 'Digital Love', artist: 'Daft Punk', album: 'Discovery', duration: 298, cover: daftCover, preview: item.preview, type: 'track' },
      { id: 3135559, trackNumber: 4, title: 'Harder, Better, Faster, Stronger', artist: 'Daft Punk', album: 'Discovery', duration: 224, cover: daftCover, preview: item.preview, type: 'track' },
      { id: 3135560, trackNumber: 5, title: 'Crescendolls', artist: 'Daft Punk', album: 'Discovery', duration: 211, cover: daftCover, preview: item.preview, type: 'track' },
      { id: 3135561, trackNumber: 6, title: 'Nightvision', artist: 'Daft Punk', album: 'Discovery', duration: 104, cover: daftCover, preview: item.preview, type: 'track' },
      { id: 3135562, trackNumber: 7, title: 'Superheroes', artist: 'Daft Punk', album: 'Discovery', duration: 237, cover: daftCover, preview: item.preview, type: 'track' },
      { id: 3135563, trackNumber: 8, title: 'High Life', artist: 'Daft Punk', album: 'Discovery', duration: 201, cover: daftCover, preview: item.preview, type: 'track' },
      { id: 3135564, trackNumber: 9, title: 'Something About Us', artist: 'Daft Punk', album: 'Discovery', duration: 231, cover: daftCover, preview: item.preview, type: 'track' },
      { id: 3135565, trackNumber: 10, title: 'Voyager', artist: 'Daft Punk', album: 'Discovery', duration: 227, cover: daftCover, preview: item.preview, type: 'track' },
      { id: 3135566, trackNumber: 11, title: 'Veridis Quo', artist: 'Daft Punk', album: 'Discovery', duration: 344, cover: daftCover, preview: item.preview, type: 'track' },
      { id: 3135567, trackNumber: 12, title: 'Short Circuit', artist: 'Daft Punk', album: 'Discovery', duration: 206, cover: daftCover, preview: item.preview, type: 'track' },
      { id: 3135568, trackNumber: 13, title: 'Face to Face', artist: 'Daft Punk', album: 'Discovery', duration: 238, cover: daftCover, preview: item.preview, type: 'track' },
      { id: 3135569, trackNumber: 14, title: 'Too Long', artist: 'Daft Punk', album: 'Discovery', duration: 600, cover: daftCover, preview: item.preview, type: 'track' },
    ];
  }

  if (lowerTitle.includes('in rainbows') || lowerTitle.includes('radiohead')) {
    const radioheadCover = 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg';
    return [
      { id: 138546803, trackNumber: 1, title: '15 Step', artist: 'Radiohead', album: 'In Rainbows', duration: 237, cover: radioheadCover, preview: item.preview, type: 'track' },
      { id: 138546804, trackNumber: 2, title: 'Bodysnatchers', artist: 'Radiohead', album: 'In Rainbows', duration: 242, cover: radioheadCover, preview: item.preview, type: 'track' },
      { id: 138546805, trackNumber: 3, title: 'Nude', artist: 'Radiohead', album: 'In Rainbows', duration: 255, cover: radioheadCover, preview: item.preview, type: 'track' },
      { id: 138546806, trackNumber: 4, title: 'Weird Fishes/Arpeggi', artist: 'Radiohead', album: 'In Rainbows', duration: 318, cover: radioheadCover, preview: item.preview, type: 'track' },
      { id: 138546807, trackNumber: 5, title: 'All I Need', artist: 'Radiohead', album: 'In Rainbows', duration: 228, cover: radioheadCover, preview: item.preview, type: 'track' },
      { id: 138546808, trackNumber: 6, title: 'Faust Arp', artist: 'Radiohead', album: 'In Rainbows', duration: 129, cover: radioheadCover, preview: item.preview, type: 'track' },
      { id: 138546809, trackNumber: 7, title: 'Reckoner', artist: 'Radiohead', album: 'In Rainbows', duration: 290, cover: radioheadCover, preview: item.preview, type: 'track' },
      { id: 138546810, trackNumber: 8, title: 'House of Cards', artist: 'Radiohead', album: 'In Rainbows', duration: 328, cover: radioheadCover, preview: item.preview, type: 'track' },
      { id: 138546811, trackNumber: 9, title: 'Jigsaw Falling Into Place', artist: 'Radiohead', album: 'In Rainbows', duration: 249, cover: radioheadCover, preview: item.preview, type: 'track' },
      { id: 138546812, trackNumber: 10, title: 'Videotape', artist: 'Radiohead', album: 'In Rainbows', duration: 279, cover: radioheadCover, preview: item.preview, type: 'track' },
    ];
  }

  return [];
};
