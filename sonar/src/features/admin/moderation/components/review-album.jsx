import { useEffect, useState } from 'react'
import { DEFAULT_DEEZER_ALBUMS, getAlbumById } from '../../../../shared/services/deezer-service.js'

// Compatibility with the two original demo reviews in db.json.
const demoAlbums = { album_01: 10709540, album_02: 14880659 }

export function ReviewAlbum({ review }) {
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
        <img className="review-album-cover" src={album.cover} alt={`Portada de ${album.title}`} loading="lazy" onError={() => setFailedCover(album.cover)} />
      ) : (
        <div className="review-album-placeholder" role="img" aria-label="Portada no disponible">♫</div>
      )}
      <div className="review-copy">
        <div className="eyebrow">CATÁLOGO MUSICAL · DEEZER</div>
        <h3>{album?.title || review.albumTitle || `Álbum ${review.albumId}`}</h3>
        {album && <p className="review-album-artist">{album.artist}{album.year ? ` · ${album.year}` : ''}</p>}
        <div className="rating"><span aria-hidden="true">★</span> {review.rating} <small>/ 5 · Calificación del oyente</small></div>
        <blockquote>“{review.content}”</blockquote>
        <div className="review-album-source">
          <span role="status">{loading ? 'Consultando Deezer…' : current.album ? 'Información de Deezer' : album ? 'Datos guardados · Deezer no disponible' : 'No se pudo cargar el álbum'}</span>
          {album && <a href={`https://www.deezer.com/album/${albumId}`} target="_blank" rel="noopener noreferrer" aria-label={`Escuchar ${album.title} en Deezer (nueva pestaña)`}>Escuchar en Deezer ↗</a>}
        </div>
      </div>
    </div>
  )
}
