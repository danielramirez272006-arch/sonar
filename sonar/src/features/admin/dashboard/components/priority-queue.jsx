import { ArrowUpRight, Check, Sparkles } from 'lucide-react';
import { useTranslation } from '../../../../shared/context/language-context.jsx';

export function PriorityQueue({ reviews = [], users = [], busy, onAction }) {
  const { t } = useTranslation();
  const priorityReviews = [...reviews]
    .filter((review) => review.status === 'pending_moderation')
    .sort((a, b) => Number(b.aiFlagged) - Number(a.aiFlagged))
    .slice(0, 3);

  return (
    <section className="priority-queue" aria-labelledby="priority-title">
      <header className="priority-queue__heading">
        <div><span className="eyebrow">{t('admin.priority.listenNow')}</span><h2 id="priority-title">{t('admin.priority.queue')}</h2></div>
        <a href="#moderacion">{t('admin.priority.fullQueue')} <ArrowUpRight size={15} /></a>
      </header>
      {priorityReviews.length ? <div className="priority-queue__list">
        {priorityReviews.map((review, index) => {
          const user = users.find((item) => item.id === review.userId);
          return <article className="priority-item" key={review.id} style={{ '--enter-delay': `${180 + index * 90}ms` }}>
            <span className="priority-item__number">0{index + 1}</span>
            <div className="priority-item__body"><div><strong>@{user?.username || `Usuario ${review.userId}`}</strong>{review.aiFlagged && <span className="priority-item__flag"><Sparkles size={12} /> {t('admin.priority.aiSignal')}</span>}</div><p>{review.content}</p><small>{t('admin.priority.albumRating', { albumId: review.albumId, rating: review.rating })}</small></div>
            <div className="priority-item__actions"><button type="button" aria-label={t('admin.priority.approveReview', { username: user?.username || review.userId })} onClick={() => onAction('approve', review)} disabled={busy}><Check size={16} /></button><a href="#moderacion" aria-label={t('admin.priority.reviewUser', { username: user?.username || review.userId })}><ArrowUpRight size={16} /></a></div>
          </article>;
        })}
      </div> : <div className="priority-queue__empty"><Check size={17} /> {t('admin.priority.empty')}</div>}
    </section>
  );
}

export default PriorityQueue;
