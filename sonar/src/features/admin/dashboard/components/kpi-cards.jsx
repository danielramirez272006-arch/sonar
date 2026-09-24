const primaryCards = [
  ['pendingReviews', 'En espera', 'Reseñas por decidir', 'Prioridad'],
  ['flaggedReviews', 'Señales de IA', 'Requieren una segunda escucha', 'Atención'],
  ['totalReviews', 'Nuevas voces', 'Reseñas en el archivo', 'Archivo'],
];

export function KpiCards({ metrics, busy, error, onSelect }) {
  return (
    <section className="dashboard-metrics" aria-label="Resumen operativo" aria-busy={busy}>
      <div className="dashboard-metrics__primary">
        {primaryCards.map(([key, title, description, tag], index) => (
          <button className={`dashboard-metric dashboard-metric--${key}`} key={key} style={{ '--enter-delay': `${index * 90}ms` }} onClick={() => onSelect?.(key)} type="button" aria-label={`Ver detalle de ${tag}`}>
            <div className="dashboard-metric__top"><span>{tag}</span><i aria-hidden="true" /></div>
            <strong>{error ? '—' : busy ? '…' : metrics[key]?.toLocaleString('es') ?? '0'}</strong>
            <div><h2>{title}</h2><p>{description}</p></div>
          </button>
        ))}
      </div>
      <div className="dashboard-metrics__secondary" aria-label="Métricas secundarias">
        <a href="#usuarios"><b>{error ? '—' : busy ? '…' : metrics?.newUsers ?? 0}</b> nuevos usuarios / 7 días</a>
        <a href="#admin-reports"><b>{error ? '—' : busy ? '…' : metrics?.pendingReports ?? 0}</b> reportes pendientes</a>
        <a href="#usuarios"><b>{error ? '—' : busy ? '…' : metrics?.sanctionedUsers ?? 0}</b> usuarios sancionados</a>
        <span><b>{error ? '—' : metrics?.totalUsers ?? 0}</b> miembros</span>
        <span><b>{error ? '—' : metrics?.approvedReviews ?? 0}</b> aprobadas</span>
        <span><b>{error ? '—' : metrics?.rejectedReviews ?? 0}</b> rechazadas</span>
      </div>
    </section>
  );
}

export default KpiCards;
