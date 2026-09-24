/**
 * Servicio de Letras de Canciones (Lyrics API)
 * Utiliza LRCLIB (API pública abierta, gratuita y sin api key) con múltiples respaldos y base curada.
 */

const LRCLIB_BASE_URL = 'https://lrclib.net/api';
const LYRICS_OVH_BASE_URL = 'https://api.lyrics.ovh/v1';

// Cache en memoria para respuestas de letras
const lyricsCache = new Map();

/**
 * Base curada de letras para canciones emblemáticas de alta fidelidad
 */
export const CURATED_LYRICS = {
  'radiohead__15 step': {
    plainLyrics: `How come I end up where I started?
How come I end up where I went wrong?
Won't take my eyes off the ball again
First you smile, then you smile

You used to be alright, what happened?
Did the cat get your tongue?
Did your string come undone?
One by one, one by one

It's all wrong, it's all right
It's all wrong, it's all right
You used to be alright, what happened?`,
    syncedLyrics: `[00:15.00] How come I end up where I started?
[00:22.00] How come I end up where I went wrong?
[00:30.00] Won't take my eyes off the ball again
[00:37.00] First you smile, then you smile
[00:46.00] You used to be alright, what happened?
[00:53.00] Did the cat get your tongue?
[01:00.00] Did your string come undone?
[01:08.00] One by one, one by one
[01:15.00] It's all wrong, it's all right
[01:23.00] It's all wrong, it's all right`,
    instrumental: false,
    source: 'Sonar Curated Master Lyrics',
  },
  'radiohead__karma police': {
    plainLyrics: `Karma police, arrest this man
He talks in maths, he buzzes like a fridge
He's like a detuned radio

Karma police, arrest this girl
Her Hitler hairdo is making me feel ill
And we have crashed her party

This is what you'll get
This is what you'll get
This is what you'll get
When you mess with us

Karma police, I've given all I can
It's not enough, I've given all I can
But we're still on the payroll

This is what you'll get
This is what you'll get
This is what you'll get
When you mess with us

For a minute there, I lost myself, I lost myself
Phew, for a minute there, I lost myself, I lost myself`,
    syncedLyrics: `[00:08.00] Karma police, arrest this man
[00:15.00] He talks in maths, he buzzes like a fridge
[00:22.00] He's like a detuned radio
[00:30.00] For a minute there, I lost myself, I lost myself`,
    instrumental: false,
    source: 'Sonar Curated Master Lyrics',
  },
  'daft punk__one more time': {
    plainLyrics: `One more time, we're gonna celebrate
Oh yeah, all right, don't stop the dancing
One more time, we're gonna celebrate
Oh yeah, all right, don't stop the dancing

One more time, we're gonna celebrate
Oh yeah, all right, don't stop the dancing
One more time, we're gonna celebrate
Oh yeah, all right, don't stop the dancing

Music's got me feeling so free
Celebrate and dance so free
One more time
Music's got me feeling so free
We're gonna celebrate
Celebrate and dance so free
One more time`,
    syncedLyrics: `[00:00.00] One more time, we're gonna celebrate
[00:08.00] Oh yeah, all right, don't stop the dancing
[00:15.00] One more time, we're gonna celebrate
[00:23.00] Oh yeah, all right, don't stop the dancing`,
    instrumental: false,
    source: 'Sonar Curated Master Lyrics',
  },
  'daft punk__harder better faster stronger': {
    plainLyrics: `Work it, make it, do it, makes us
Harder, better, faster, stronger

More than, hour, our, never
Ever, after, work is, over

Work it, make it, do it, makes us
Harder, better, faster, stronger

Work it harder, make it better
Do it faster, makes us stronger
More than ever, hour after
Our work is never over`,
    syncedLyrics: `[00:10.00] Work it, make it, do it, makes us
[00:15.00] Harder, better, faster, stronger`,
    instrumental: false,
    source: 'Sonar Curated Master Lyrics',
  },
  'tame impala__the less i know the better': {
    plainLyrics: `Someone said they left together
I ran out the door to get her
She was holding hands with Trevor
Not the greatest feeling ever
Said, "Pull yourself together
You should try your luck with Heather"
Man, I hope they slept together
Oh, the less I know the better

Oh, my love, can't you see yourself by my side?
No surprise when you're on his shoulder like every night
Oh, my love, can't you see that you're on my mind?
Don't suppose we could convince your lover to change his mind?
So goodbye`,
    syncedLyrics: `[00:18.00] Someone said they left together
[00:22.00] I ran out the door to get her
[00:25.00] She was holding hands with Trevor
[00:28.00] Not the greatest feeling ever`,
    instrumental: false,
    source: 'Sonar Curated Master Lyrics',
  },
  'the beatles__here comes the sun': {
    plainLyrics: `Here comes the sun, doo-doo-doo-doo
Here comes the sun, and I say
It's alright

Little darling, it's been a long, cold, lonely winter
Little darling, it feels like years since it's been here

Here comes the sun, doo-doo-doo-doo
Here comes the sun, and I say
It's alright

Little darling, the smiles returning to the faces
Little darling, it seems like years since it's been here

Here comes the sun, doo-doo-doo-doo
Here comes the sun, and I say
It's alright`,
    syncedLyrics: `[00:12.00] Here comes the sun, doo-doo-doo-doo
[00:17.00] Here comes the sun, and I say
[00:20.00] It's alright`,
    instrumental: false,
    source: 'Sonar Curated Master Lyrics',
  },
  'the beatles__come together': {
    plainLyrics: `Here come old flat top, he come grooving up slowly
He got joo joo eyeball, he one holy roller
He got hair down to his knee
Got to be a joker he just do what he please

He wear no shoeshine, he got toe jam football
He got monkey finger, he shoot Coca-Cola
He say "I know you, you know me"
One thing I can tell you is you got to be free
Come together, right now, over me`,
    syncedLyrics: `[00:08.00] Here come old flat top, he come grooving up slowly
[00:15.00] He got joo joo eyeball, he one holy roller
[00:22.00] Come together, right now, over me`,
    instrumental: false,
    source: 'Sonar Curated Master Lyrics',
  },
  'frank ocean__pink + white': {
    plainLyrics: `Yeah, yeah, oh
Yeah, yeah, yeah

That's the way everyday goes
Every time we have no control
If the sky is pink and white
If the ground is black and yellow
It's the same way you showed me

Nod my head, don't close my eyes
Halfway in, halfway out
Just like you showed me, what it's all about
Just like you showed me what you got
And you showed me love`,
    syncedLyrics: `[00:14.00] That's the way everyday goes
[00:18.00] Every time we have no control
[00:21.00] If the sky is pink and white`,
    instrumental: false,
    source: 'Sonar Curated Master Lyrics',
  },
  'miles davis__so what': {
    plainLyrics: 'Esta pista es una pieza instrumental legendaria de Jazz (sin letra vocal).',
    syncedLyrics: '',
    instrumental: true,
    source: 'Sonar Master Catalog',
  },
  'miles davis__blue in green': {
    plainLyrics: 'Esta pista es una pieza instrumental legendaria de Jazz (sin letra vocal).',
    syncedLyrics: '',
    instrumental: true,
    source: 'Sonar Master Catalog',
  },
  'pink floyd__the great gig in the sky': {
    plainLyrics: 'Vocalizaciones líricas e improvisación de Clare Torry sin texto verbal formal.',
    syncedLyrics: '',
    instrumental: true,
    source: 'Sonar Master Catalog',
  },
};

/**
 * Limpia el título y artista para maximizar coincidencias en la API de letras.
 */
export function cleanQueryString(str = '') {
  if (!str) return '';
  return String(str)
    .replace(/\(.*?\)/g, '')         // Eliminar (Remastered 2011), (Live), (Radio Edit), etc.
    .replace(/\[.*?\]/g, '')         // Eliminar [Bonus Track], [Explicit], etc.
    .replace(/feat\..*$/i, '')       // Eliminar feat.
    .replace(/ft\..*$/i, '')
    .replace(/featuring.*$/i, '')
    .replace(/- \d{4} Remaster.*/i, '')
    .replace(/- Remastered.*/i, '')
    .replace(/- Single.*/i, '')
    .replace(/- Live.*/i, '')
    .replace(/- Stereo.*/i, '')
    .replace(/- Mono.*/i, '')
    .replace(/ - /g, ' ')
    .replace(/["'“”]/g, '')
    .replace(/\s+/g, ' ')
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

  // 1. Revisar cache en memoria
  if (lyricsCache.has(cacheKey)) {
    return lyricsCache.get(cacheKey);
  }

  // 2. Intentar LRCLIB /api/get exacto
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

  // 3. Intentar LRCLIB búsqueda general /api/search?q=
  try {
    const query = encodeURIComponent(`${cleanArtist} ${cleanTitle}`);
    const searchRes = await fetch(`${LRCLIB_BASE_URL}/search?q=${query}`);
    if (searchRes.ok) {
      const items = await searchRes.json();
      if (Array.isArray(items) && items.length > 0) {
        // Encontrar la mejor coincidencia que tenga letra
        const bestMatch = items.find(i => i.plainLyrics || i.syncedLyrics) || items[0];
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

  // 4. Intentar búsqueda solo por título si el artista tiene nombres compuestos
  try {
    const titleOnlyQuery = encodeURIComponent(cleanTitle);
    const titleSearchRes = await fetch(`${LRCLIB_BASE_URL}/search?q=${titleOnlyQuery}`);
    if (titleSearchRes.ok) {
      const items = await titleSearchRes.json();
      if (Array.isArray(items) && items.length > 0) {
        const match = items.find(
          i => (i.plainLyrics || i.syncedLyrics) &&
               (i.artistName?.toLowerCase().includes(cleanArtist.toLowerCase()) || cleanArtist.toLowerCase().includes(i.artistName?.toLowerCase() || ''))
        );
        if (match) {
          const result = {
            plainLyrics: match.plainLyrics || (match.instrumental ? 'Esta pista es una pieza instrumental (sin letra vocal).' : ''),
            syncedLyrics: match.syncedLyrics || '',
            instrumental: Boolean(match.instrumental),
            source: 'LRCLIB Title Search',
          };
          lyricsCache.set(cacheKey, result);
          return result;
        }
      }
    }
  } catch {}

  // 5. Respaldo secundario: Lyrics.ovh
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

  // 6. Respaldo terciario: Base curada local para temas emblemáticos
  for (const [key, curated] of Object.entries(CURATED_LYRICS)) {
    if (cacheKey.includes(key) || key.includes(cacheKey)) {
      lyricsCache.set(cacheKey, curated);
      return curated;
    }
  }

  return null;
}

export default {
  getLyricsForTrack,
  cleanQueryString,
  CURATED_LYRICS,
};
