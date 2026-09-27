import { useUIText } from '../../../../shared/i18n/use-ui-text.js';
import { MessagesSquare } from 'lucide-react'
import { communityOpinions } from '../../../../shared/services/community-opinions.js'
import { sameId } from '../../../../shared/services/admin-data.js'

export function CommunityOpinions({ reviews = [], users = [], busy, error }) {
  const ui = useUIText();
  const groups = communityOpinions(reviews)
  return <section className="community-opinions" aria-labelledby="community-opinions-title" aria-busy={busy}>
    <header className="community-opinions__heading">
      <span className="community-opinions__icon"><MessagesSquare size={24} aria-hidden="true" /></span>
      <div><span className="eyebrow">{ui("LO QUE DICE LA COMUNIDAD")}</span><h2 id="community-opinions-title">{ui("Opiniones generales")}</h2></div>
      <span className="community-opinions__count">{groups.length} {ui("coincidencias")}</span>
    </header>
    <p className="community-opinions__intro">{ui("Comentarios con texto similar sobre un mismo álbum, compartidos por al menos dos usuarios. Incluye reseñas aprobadas y pendientes; no representa necesariamente la opinión de toda la comunidad.")}</p>
    {error ? <p role="status">{ui("No se pudo actualizar el resumen. Actualiza la cola para volver a intentarlo.")}</p> : busy ? <p role="status">{ui("Reuniendo las opiniones…")}</p> : groups.length ? <div className="community-opinions__list">{groups.map((group, index) => <article className="community-opinions__card" key={`${group.albumId}-${index}`}>
      <div className="community-opinions__meta"><span>{ui("Álbum")} {group.albumId}</span><strong>{group.userCount} {ui("de")} {group.totalUsers} {ui("usuarios coinciden")}</strong></div>
      <blockquote>“{group.opinion}”</blockquote>
      <p>{ui("Opinión representativa ·")} {group.reviews.length} {ui("reseñas relacionadas")}</p>
      <details><summary>{ui("Leer comentarios relacionados")}</summary><ul>{group.reviews.map(review => <li key={review.id}><strong>{users.find(user => sameId(user.id, review.userId))?.username || review.userName || ui("Usuario")} <span>· {review.status === 'approved' ? ui("Aprobada") : ui("Pendiente")}</span></strong><p>{review.content}</p><a href={`#admin-reviews?review=${encodeURIComponent(review.id)}`}>{ui("Revisar reseña →")}</a></li>)}</ul></details>
    </article>)}</div> : <div className="community-opinions__empty"><strong>{ui("Todavía no hay opiniones coincidentes")}</strong><p>{ui("Cuando dos usuarios compartan comentarios similares sobre el mismo álbum, aparecerán aquí con sus reseñas para revisarlas.")}</p></div>}
  </section>
}
