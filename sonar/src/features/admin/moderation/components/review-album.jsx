import { useUIText } from '../../../../shared/i18n/use-ui-text.js';
import { useEffect, useState } from 'react'
import { DEFAULT_DEEZER_ALBUMS, getAlbumById } from '../../../../shared/services/deezer-service.js'

// Compatibility with the two original demo reviews in db.json.
const demoAlbums = { album_01: 10709540, album_02: 14880659 }

export function ReviewAlbum({ review }) {
  const ui = useUIText();
  const albumId = demoAlbums[review.albumId] ?? review.albumId
  const fallback = DEFAULT_DEEZER_ALBUMS.find(album => String(album.id) === String(albumId))
  const [result, setResult] = useState(null)
  const [failedCover, setFailedCover] = useState(null)

  useEffect(() => {
    let active = true
    getAlbumById(albumId).then(album => {
      if (active) setResult({ id: albumId, album })
    })
    return () => { active = false }
  }, [albumId])

  const current = result?.id === albumId ? result : null
  // Fallback chain: Deezer API → DEFAULT_DEEZER_ALBUMS → datos guardados en la reseña
  const reviewFallback = (review.albumTitle || review.artist || review.cover)
    ? { title: review.albumTitle, artist: review.artist, cover: review.cover, year: null }
    : null
  const album = current?.album || fallback || reviewFallback
  const loading = !current
  return (
    <div className="review-body">
      {album?.cover && failedCover !== album.cover ? (
        <img className="review-album-cover" src={album.cover} alt={ui("Portada de {{value0}}", { value0: album.title })} loading="lazy" onError={() => setFailedCover(album.cover)} />
      ) : (
        <div className="review-album-placeholder" role="img" aria-label={ui("Portada no disponible")}>♫</div>
      )}
      <div className="review-copy">
        <div className="eyebrow">{ui("CATÁLOGO MUSICAL · DEEZER")}</div>
        <h3>{album?.title || review.albumTitle || `Álbum ${review.albumId}`}</h3>
        {album && <p className="review-album-artist">{album.artist}{album.year ? ` · ${album.year}` : ''}</p>}
        <div className="rating"><span aria-hidden="true">★</span> {review.rating} <small>{ui("/ 5 · Calificación del oyente")}</small></div>
        <blockquote>“{review.content}”</blockquote>
        <div className="review-album-source">
          <span role="status">{loading ? ui("Consultando Deezer…") : current.album ? ui("Información de Deezer") : album ? ui("Datos guardados · Deezer no disponible") : ui("No se pudo cargar el álbum")}</span>
          {album && <a href={`https://www.deezer.com/album/${albumId}`} target="_blank" rel="noopener noreferrer" aria-label={ui("Escuchar {{value0}} en Deezer (nueva pestaña)", { value0: album.title })}>{ui("Escuchar en Deezer ↗")}</a>}
        </div>
      </div>
    </div>
  )
}
