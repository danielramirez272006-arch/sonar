import { getCatalog } from './catalog-service.js';
import { toNewsArticle, isNewsVisible } from './news-service.js';
import { searchAlbums } from './deezer-service.js';

const CACHE_TTL = 60_000;

let cache = { at: 0, data: null };
let inflight = null;

const normalize = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim();

const tokenize = (query) =>
  normalize(query)
    .split(/[\s,]+/)
    .filter(Boolean);

/**
 * Carga (y cachea) todo el contenido editorial público para poder buscarlo desde cualquier vista.
 * Evita ráfagas de peticiones a la API cuando el usuario escribe rápido en la barra de búsqueda.
 */
export async function loadNewsIndex() {
  if (cache.data && Date.now() - cache.at < CACHE_TTL) return cache.data;
  if (inflight) return inflight;

  inflight = Promise.all([
    getCatalog('announcements'),
    getCatalog('labels', true),
    getCatalog('vinyl', true),
    getCatalog('releases'),
  ])
    .then(([announcements, labels, vinyls, releases]) => {
      const data = {
        articles: announcements.filter((row) => isNewsVisible(row)).map((row) => toNewsArticle(row, labels)),
        labels,
        editions: vinyls,
        releases: (releases || []).filter((row) => row.status === 'published'),
      };
      cache = { at: Date.now(), data };
      inflight = null;
      return data;
    })
    .catch((error) => {
      inflight = null;
      throw error;
    });

  return inflight;
}

/**
 * Puntúa un candidato. Devuelve 0 cuando no coincide con alguno de los términos buscados.
 */
function scoreCandidate(query, terms, title, ...body) {
  const normalizedTitle = normalize(title);
  const normalizedBody = normalize(body.filter(Boolean).join(' '));
  const haystack = `${normalizedTitle} ${normalizedBody}`;
  const phrase = terms.join(' ');

  if (!phrase) return 0;
  if (!terms.every((term) => haystack.includes(term))) return 0;

  let score = 10;
  if (normalizedTitle === phrase) score += 80;
  else if (normalizedTitle.startsWith(phrase)) score += 48;
  else if (normalizedTitle.includes(phrase)) score += 30;
  terms.forEach((term) => {
    if (normalizedTitle.includes(term)) score += 14;
  });
  if (terms.some((term) => normalizedTitle.startsWith(term))) score += 10;
  return score;
}

const NEWS_KINDS = {
  article: { label: 'Noticia', icon: 'newspaper' },
  label: { label: 'Sello', icon: 'domain' },
  vinyl: { label: 'Vinilo', icon: 'album' },
  release: { label: 'Lanzamiento', icon: 'new_releases' },
};

/**
 * Busca dentro del contenido editorial: noticias, sellos, ediciones de vinilo y lanzamientos.
 * @returns {Array<{kind: string, id: string, title: string, subtitle: string, cover: string, score: number}>}
 */
export function searchNewsIndex(index, query) {
  const terms = tokenize(query);
  if (!terms.length || !index) return [];

  const labelNameOf = (labelId) =>
    index.labels.find((label) => String(label.id) === String(labelId))?.name || '';
  const matches = [];

  const push = (kind, item, title, subtitle, cover) => {
    const score = scoreCandidate(query, terms, title, subtitle, cover);
    if (!score) return;
    matches.push({ kind, id: String(item.id), title, subtitle, cover: cover || '', score });
  };

  index.articles.forEach((article) => {
    push(
      'article',
      article,
      article.title,
      [article.category, article.labelName, article.artist, article.date, article.summary]
        .filter(Boolean)
        .join(' · '),
      article.cover
    );
  });

  index.labels.forEach((label) => {
    const newsCount = index.articles.filter((article) => String(article.labelId) === String(label.id)).length;
    push(
      'label',
      label,
      label.name,
      ['Sello discográfico', label.country, label.founded ? `Fundado en ${label.founded}` : '', newsCount ? `${newsCount} noticias` : '']
        .filter(Boolean)
        .join(' · '),
      label.cover
    );
  });

  index.editions.forEach((edition) => {
    push(
      'vinyl',
      edition,
      edition.title,
      [edition.artist, edition.year, edition.editionType, edition.format, edition.color, labelNameOf(edition.labelId)]
        .filter(Boolean)
        .join(' · '),
      edition.cover
    );
  });

  index.releases.forEach((release) => {
    push(
      'release',
      release,
      release.title,
      [release.artist, release.type, release.genre, release.releaseDate, labelNameOf(release.labelId)]
        .filter(Boolean)
        .join(' · '),
      release.cover
    );
  });

  return matches.sort((a, b) => b.score - a.score);
}

/**
 * Búsqueda unificada: canciones de Deezer + contenido editorial de Sonar.
 * @param {string} query
 * @param {{ scope?: 'all'|'tracks'|'news', trackLimit?: number, newsLimit?: number }} options
 */
export async function searchEverything(query, { scope = 'all', trackLimit = 6, newsLimit = 6 } = {}) {
  const term = String(query || '').trim();
  if (!term) return { tracks: [], news: [], index: null, newsError: '' };

  const wantsTracks = scope === 'all' || scope === 'tracks';
  const wantsNews = scope === 'all' || scope === 'news';

  const [tracks, indexResult] = await Promise.all([
    wantsTracks ? searchAlbums(term).catch(() => []) : Promise.resolve([]),
    wantsNews
      ? loadNewsIndex().catch((error) => {
          console.warn('No se pudo indexar el contenido de noticias para la búsqueda:', error);
          return null;
        })
      : Promise.resolve(null),
  ]);

  const news = indexResult ? searchNewsIndex(indexResult, term).slice(0, newsLimit) : [];

  return {
    tracks: tracks.slice(0, trackLimit),
    news,
    index: indexResult,
    newsError: wantsNews && !indexResult ? 'El contenido de noticias no está disponible en este momento.' : '',
  };
}

/**
 * Construye el hash de la página de noticias con el término y el recurso a abrir.
 */
export function buildNewsHash(term, { kind, id } = {}) {
  const params = new URLSearchParams();
  if (term) params.set('q', term);
  if (kind && id) {
    const key = { article: 'abrir', label: 'sello', vinyl: 'vinilo', release: 'lanzamiento' }[kind];
    if (key) params.set(key, id);
  }
  const query = params.toString();
  return query ? `#noticias?${query}` : '#noticias';
}

export { NEWS_KINDS };
