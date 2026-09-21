const cards = [
  ['totalUsers', 'Usuarios totales', '◎', 'Comunidad Sonar'],
  ['totalReviews', 'Reseñas acumuladas', '▤', 'Voces que construyen criterio'],
  ['pendingReviews', 'Pendientes', '◷', 'Esperando tu revisión'],
  ['approvedReviews', 'Aprobadas', '✓', 'Listas para compartir'],
  ['rejectedReviews', 'Rechazadas', '⊘', 'Fuera de los criterios'],
  ['flaggedReviews', 'Marcadas por IA', '✧', 'Requieren una segunda mirada'],
]

export function KpiCards({ metrics, busy, error }) {
  return <section className="kpi-grid" aria-label="Métricas administrativas" aria-busy={busy}>{cards.map(([key, title, icon, caption]) => <article className={`kpi-card ${key === 'pendingReviews' ? 'kpi-pending' : ''}`} key={key}><div className="kpi-top"><span aria-hidden="true">{icon}</span><span className="eyebrow">{title}</span></div><strong className="kpi-value">{error ? '—' : busy ? '…' : metrics[key].toLocaleString('es')}</strong><p>{caption}</p>{key === 'pendingReviews' && <a href="#moderacion">Moderar ahora ↗</a>}</article>)}</section>
}
