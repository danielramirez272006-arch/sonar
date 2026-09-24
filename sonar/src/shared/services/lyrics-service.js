/**
 * Servicio de Letras de Canciones (Lyrics API)
 * Utiliza LRCLIB (API pública abierta, gratuita y sin api key) con respaldo a Lyrics.ovh.
 */

const LRCLIB_BASE_URL = 'https://lrclib.net/api';
const LYRICS_OVH_BASE_URL = 'https://api.lyrics.ovh/v1';

// Cache en memoria para respuestas de letras
const lyricsCache = new Map();

/**
 * Limpia el título y artista para maximizar coincidencias en la API de letras.
 */
function cleanQueryString(str = '') {
  return str
    .replace(/\(.*?\)/g, '')         // Eliminar (Remastered 2011), (Live), etc.
    .replace(/\[.*?\]/g, '')         // Eliminar [Bonus Track], etc.
    .replace(/feat\..*$/i, '')       // Eliminar feat.
    .replace(/ft\..*$/i, '')
    .replace(/- \d{4} Remaster.*/i, '')
    .replace(/- Remastered.*/i, '')
    .replace(/- Single.*/i, '')
    .trim();
}

/**
 * Obtiene la letra de una canción (incluyendo letra sincronizada si está disponible).
 * @param {Object} params - { title, artist, album, duration }
 * @returns {Promise<{ plainLyrics: string, syncedLyrics: string, source: string, instrumental: boolean } | null>}
 */
export async function getLyricsForTrack({ title, artist, album, duration }) {
  if (!title || !artist) return null;

  const cleanTitle = cleanQueryString(title);
  const cleanArtist = cleanQueryString(artist);
  const cacheKey = `${cleanArtist}__${cleanTitle}`.toLowerCase();

  if (lyricsCache.has(cacheKey)) {
    return lyricsCache.get(cacheKey);
  }

  // 1. Intentar LRCLIB /api/get exacto
  try {
    const params = new URLSearchParams({
      artist_name: cleanArtist,
      track_name: cleanTitle,
    });
    if (album) params.append('album_name', cleanQueryString(album));
    if (duration && duration > 0) params.append('duration', Math.round(duration));

    const response = await fetch(`${LRCLIB_BASE_URL}/get?${params.toString()}`, {
      headers: { 'User-Agent': 'SonarAudiophile/2.0 (sonar@audiophile.music)' },
    });

    if (response.ok) {
      const data = await response.json();
      if (data && (data.plainLyrics || data.syncedLyrics || data.instrumental)) {
        const result = {
          plainLyrics: data.plainLyrics || (data.instrumental ? 'Esta pista es una pieza instrumental (sin letra vocal).' : ''),
          syncedLyrics: data.syncedLyrics || '',
          instrumental: Boolean(data.instrumental),
          source: 'LRCLIB (Public Open Source)',
        };
        lyricsCache.set(cacheKey, result);
        return result;
      }
    }
  } catch (err) {
    console.warn('LRCLIB exact lookup failed:', err);
  }

  // 2. Intentar LRCLIB búsqueda general /api/search?q=
  try {
    const query = encodeURIComponent(`${cleanArtist} ${cleanTitle}`);
    const searchRes = await fetch(`${LRCLIB_BASE_URL}/search?q=${query}`);
    if (searchRes.ok) {
      const items = await searchRes.json();
      if (Array.isArray(items) && items.length > 0) {
        const bestMatch = items[0];
        if (bestMatch && (bestMatch.plainLyrics || bestMatch.syncedLyrics || bestMatch.instrumental)) {
          const result = {
            plainLyrics: bestMatch.plainLyrics || (bestMatch.instrumental ? 'Esta pista es una pieza instrumental (sin letra vocal).' : ''),
            syncedLyrics: bestMatch.syncedLyrics || '',
            instrumental: Boolean(bestMatch.instrumental),
            source: 'LRCLIB Search',
          };
          lyricsCache.set(cacheKey, result);
          return result;
        }
      }
    }
  } catch (err) {
    console.warn('LRCLIB search query failed:', err);
  }

  // 3. Respaldo secundario: Lyrics.ovh
  try {
    const ovhRes = await fetch(
      `${LYRICS_OVH_BASE_URL}/${encodeURIComponent(cleanArtist)}/${encodeURIComponent(cleanTitle)}`
    );
    if (ovhRes.ok) {
      const data = await ovhRes.json();
      if (data && data.lyrics) {
        const result = {
          plainLyrics: data.lyrics,
          syncedLyrics: '',
          instrumental: false,
          source: 'Lyrics.ovh Public API',
        };
        lyricsCache.set(cacheKey, result);
        return result;
      }
    }
  } catch (err) {
    console.warn('Lyrics.ovh fallback failed:', err);
  }

  return null;
}

export default {
  getLyricsForTrack,
};
