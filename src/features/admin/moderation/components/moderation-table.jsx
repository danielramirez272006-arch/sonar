import { useState } from 'react'

const statuses = { pending_moderation: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada' }

export function ModerationTable({ reviews, users, query, busy, onAction, analyses, compact = false, error }) {
  const [filter, setFilter] = useState('all')
  const [rejectId, setRejectId] = useState(null)
  const options = compact ? [['all', 'Todas'], ['pending_moderation', 'Pendientes'], ['approved', 'Aprobadas'], ['rejected', 'Rechazadas'], ['flagged', 'Marcadas']] : [['all', 'Todas'], ['flagged', 'Marcadas por IA']]
  const visible = reviews.filter(review => {
    const user = users.find(item => item.id === review.userId)
    return (filter === 'all' || (filter === 'flagged' ? review.aiFlagged : review.status === filter)) && `${user?.username ?? ''} ${review.userId} ${review.albumId} ${review.content}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
  })
  return <section className="review-feed" aria-label={compact ? 'Reseñas registradas' : 'Cola de moderación'} aria-busy={busy}>
    <div className="feed-heading"><h2>{compact ? 'Las voces de la comunidad' : 'Cola de revisión'}</h2><span className="eyebrow">{visible.length} RESEÑAS</span></div>
    <div className="filter-tabs" aria-label="Filtrar reseñas">{options.map(([value, label]) => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}{value === 'all' && <span>{reviews.length}</span>}</button>)}</div>
    {visible.length === 0 && <div className="empty-state"><span aria-hidden="true">◎</span><h3>{busy ? 'Afinando la selección…' : error ? 'No se pudieron cargar las reseñas' : query || filter !== 'all' ? 'No hay coincidencias' : 'Todo en armonía'}</h3><p>{busy ? 'Estamos consultando las reseñas.' : error ? 'Reintenta la consulta desde el aviso superior.' : query || filter !== 'all' ? 'Prueba otra búsqueda o cambia el filtro.' : 'No hay reseñas pendientes en esta selección.'}</p></div>}
    {visible.map((review, index) => {
      const user = users.find(item => item.id === review.userId)
      const name = user?.username || `Usuario ${review.userId}`
      const analysis = analyses[review.id]
      return <article className="review-card" key={review.id}>
        <div className="review-meta"><div className="review-author"><span className="avatar">{name.slice(0, 1)}</span><div><strong>{name}</strong><small>COMUNIDAD SONAR <span>· Reseña #{review.id}</span></small></div></div><span className={`badge ${review.aiFlagged ? 'badge-alert' : review.status === 'approved' ? 'badge-success' : ''}`}>{review.aiFlagged ? '✧ Marcada por IA' : statuses[review.status] || review.status}</span></div>
        <div className="review-body"><div className={`record-art record-art-${index % 2}`} role="img" aria-label="Ilustración de un vinilo; portada no disponible"><div className="record-disc" /><div className="record-sleeve"><span>SONAR<br />COLLECTION</span><i /><small>33⅓ RPM</small></div></div><div className="review-copy"><div className="eyebrow">DEL ARCHIVO SONORO</div><h3>Álbum <span>{review.albumId}</span></h3><div className="rating"><span aria-hidden="true">★</span> {review.rating} <small>/ 5 · Calificación del oyente</small></div><blockquote>“{review.content}”</blockquote></div></div>
        {!compact && <div className={`analysis-box ${review.aiFlagged ? 'flagged' : ''}`}><span aria-hidden="true">✧</span><div><strong>LECTURA ASISTIDA <span>MOCK LOCAL</span></strong><p>{analysis ? analysis.reason || 'No se detectaron palabras de la lista ofensiva. La decisión final es tuya.' : review.aiFlagged ? 'Esta reseña está marcada. Revisa su contenido antes de tomar una decisión.' : 'Una segunda lectura puede ayudar. El análisis local no aprueba ni rechaza reseñas.'}</p></div></div>}
        {review.status === 'pending_moderation' && <div className="review-actions">{rejectId === review.id ? <><span>¿Rechazar esta reseña?</span><button className="danger-button" disabled={busy} onClick={async () => { if (await onAction('reject', review)) setRejectId(null) }}>Confirmar rechazo</button><button disabled={busy} onClick={() => setRejectId(null)}>Cancelar</button></> : <><button className="primary-button" disabled={busy} onClick={() => onAction('approve', review)}>✓ Aprobar reseña</button><button disabled={busy} onClick={() => setRejectId(review.id)}>Rechazar</button><button className="text-button" disabled={busy} onClick={() => onAction('analyze', review)}>✧ Revisar con IA</button></>}</div>}
      </article>
    })}
  </section>
}
