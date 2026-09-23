const BASE_URL = '/api/deezer';

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
      title: '15 Step',
      duration: 237,
      preview: 'https://cdnt-preview.dzcdn.net/api/1/1/5/3/f/0/53faff1741bb65b8ddbc11780555c546.mp3',
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
 * Normaliza un álbum de Deezer API al formato estándar de Sonar
 */
export const formatDeezerAlbum = (album) => {
  if (!album) return null;
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
  };
};

/**
 * Busca álbumes en la API de Deezer
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Array>} Lista de álbumes
 */
export const searchAlbums = async (query) => {
  if (!query || !query.trim()) return [];
  
  try {
    const response = await fetch(`${BASE_URL}/search/album?q=${encodeURIComponent(query.trim())}`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.data || !Array.isArray(data.data)) return [];
    return data.data.map(formatDeezerAlbum);
  } catch (error) {
    console.error("Error al conectar con la API de Deezer:", error);
    return [];
  }
};

/**
 * Obtiene detalles de un álbum por ID
 */
export const getAlbumById = async (id) => {
  if (!/^\d+$/.test(String(id))) return null;
  try {
    const response = await fetch(`${BASE_URL}/album/${id}`, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (data.error || !data.id || !data.title) return null;
    return formatDeezerAlbum(data);
  } catch (error) {
    console.error("Error al obtener álbum de Deezer:", error);
    return null;
  }
};

/**
 * Obtiene la lista de canciones de un álbum con sus URLs de preview de 30 segundos
 */
export const getAlbumTracks = async (albumId) => {
  if (!albumId) return [];
  try {
    const response = await fetch(`${BASE_URL}/album/${albumId}/tracks`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return (data.data || []).map((track) => ({
      id: track.id,
      title: track.title,
      duration: track.duration,
      preview: track.preview,
      rank: track.rank,
      artist: track.artist?.name || 'Artista',
      link: track.link,
    }));
  } catch (error) {
    console.error("Error al obtener canciones del álbum de Deezer:", error);
    return [];
  }
};

/**
 * Busca canciones directamente en Deezer con preview de 30 segundos
 */
export const searchTracks = async (query) => {
  if (!query || !query.trim()) return [];
  try {
    const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query.trim())}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return (data.data || []).map((track) => ({
      id: track.id,
      title: track.title,
      artist: track.artist?.name || 'Artista',
      album: track.album?.title || '',
      cover: track.album?.cover_medium || track.album?.cover || '',
      cover_xl: track.album?.cover_xl || track.album?.cover_big || '',
      preview: track.preview,
      duration: track.duration,
      link: track.link,
    }));
  } catch (error) {
    console.error("Error al buscar canciones en Deezer:", error);
    return [];
  }
};
