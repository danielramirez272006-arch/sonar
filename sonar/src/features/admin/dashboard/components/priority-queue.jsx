import { ArrowUpRight, Check, Sparkles } from 'lucide-react';

export function PriorityQueue({ reviews = [], users = [], busy, onAction }) {
  const priorityReviews = [...reviews]
    .filter((review) => review.status === 'pending_moderation')
    .sort((a, b) => Number(b.aiFlagged) - Number(a.aiFlagged))
    .slice(0, 3);

  return (
    <section className="priority-queue" aria-labelledby="priority-title">
      <header className="priority-queue__heading">
        <div><span className="eyebrow">PARA ESCUCHAR AHORA</span><h2 id="priority-title">Cola prioritaria</h2></div>
        <a href="#moderacion">Ver cola completa <ArrowUpRight size={15} /></a>
      </header>
      {priorityReviews.length ? <div className="priority-queue__list">
        {priorityReviews.map((review, index) => {
          const user = users.find((item) => item.id === review.userId);
          return <article className="priority-item" key={review.id} style={{ '--enter-delay': `${180 + index * 90}ms` }}>
            <span className="priority-item__number">0{index + 1}</span>
            <div className="priority-item__body"><div><strong>@{user?.username || `Usuario ${review.userId}`}</strong>{review.aiFlagged && <span className="priority-item__flag"><Sparkles size={12} /> Señal de IA</span>}</div><p>{review.content}</p><small>Álbum {review.albumId} · {review.rating} / 5</small></div>
            <div className="priority-item__actions"><button type="button" aria-label={`Aprobar reseña de ${user?.username || review.userId}`} onClick={() => onAction('approve', review)} disabled={busy}><Check size={16} /></button><a href="#moderacion" aria-label={`Revisar reseña de ${user?.username || review.userId}`}><ArrowUpRight size={16} /></a></div>
          </article>;
        })}
      </div> : <div className="priority-queue__empty"><Check size={17} /> No hay reseñas pendientes. La cola está al día.</div>}
    </section>
  );
}

export default PriorityQueue;
