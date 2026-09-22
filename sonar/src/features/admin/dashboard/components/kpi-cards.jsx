const cards = [
  ['totalUsers', 'Usuarios totales', '◎', 'Comunidad Sonar'],
  ['totalReviews', 'Reseñas acumuladas', '▤', 'Voces que construyen criterio'],
  ['pendingReviews', 'Pendientes', '◷', 'Esperando tu revisión'],
  ['approvedReviews', 'Aprobadas', '✓', 'Listas para compartir'],
  ['rejectedReviews', 'Rechazadas', '⊘', 'Fuera de los criterios'],
  ['flaggedReviews', 'Marcadas por IA', '✧', 'Requieren una segunda mirada'],
]

export function KpiCards({ metrics, busy, error }) {
  return (
    <section
      className="w-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4"
      aria-label="Métricas administrativas"
      aria-busy={busy}
    >
      {cards.map(([key, title, icon, caption]) => {
        const isActive = key === 'pendingReviews'
        return (
          <article
            className={`flex flex-col p-4 rounded-xl shadow-sm border min-w-0 overflow-hidden ${
              isActive 
                ? 'bg-white dark:bg-sonar-surface border-red-500 dark:border-sonar-alert text-gray-900 dark:text-sonar-text' 
                : 'bg-gray-50 dark:bg-transparent border-gray-100 dark:border-sonar-surface text-gray-500 dark:text-sonar-text/70'
            }`}
            key={key}
          >
            <div className="kpi-top flex items-center justify-between text-gray-500 dark:text-sonar-text/70">
              <span aria-hidden="true">{icon}</span>
              <span className="eyebrow text-xs uppercase font-semibold">{title}</span>
            </div>
            <strong className={`text-3xl font-bold my-2 ${isActive ? 'text-[#B80C09] dark:text-[#ff7875]' : 'text-gray-900 dark:text-sonar-text'}`}>
              {error ? '—' : busy ? '…' : metrics[key]?.toLocaleString('es') ?? '0'}
            </strong>
            <p className="text-xs whitespace-normal break-words leading-tight">
              {caption}
            </p>
            {isActive && (
              <a href="#moderacion" className="mt-2 text-xs font-semibold text-[#B80C09] dark:text-[#ff7875] hover:underline">
                Moderar ahora ↗
              </a>
            )}
          </article>
        )
      })}
    </section>
  )
}

export default KpiCards
