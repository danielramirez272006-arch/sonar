import { KpiCards } from '../../features/admin/dashboard/components/kpi-cards.jsx'
import { EditorialGuide } from '../../features/admin/dashboard/components/editorial-guide.jsx'
import { ModerationTable } from '../../features/admin/moderation/components/moderation-table.jsx'
import { RecentActivityFeed } from '../../features/admin/dashboard/components/recent-activity-feed.jsx'

export function AdminDashboardPage({ metrics, reviews, users, onRefresh, onExport, error, ...feedProps }) {
  const currentError = error || feedProps.error

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="page-heading">
        <div>
          <span className="eyebrow dark:text-sonar-text/70">LA MÚSICA NOS REÚNE. EL CRITERIO NOS DEFINE.</span>
          <h1 className="dark:text-sonar-text">Dashboard <em className="dark:text-pink-300">Administrativo</em></h1>
          <p className="dark:text-sonar-text/70">Una mirada al pulso de Sonar. Cada opinión cuenta, cada reseña importa.</p>
        </div>
        <div className="profile-card dark:bg-sonar-surface dark:border-white/10">
          <span className="avatar profile-avatar dark:bg-sonar-accent dark:text-sonar-text">S</span>
          <div>
            <small className="dark:text-sonar-text/70">ESPACIO DE CURADURÍA</small>
            <strong className="dark:text-sonar-text">Consola administrativa</strong>
            <span className="dark:text-sonar-text/70"><i className="status-dot" /> Vista de prueba</span>
          </div>
        </div>
      </div>

      {currentError && (
        <div className="bg-red-50/10 border border-red-500/30 text-red-500 p-4 rounded-xl flex items-center justify-between w-full">
          <span>{typeof currentError === 'string' ? currentError : 'No se pudo cargar la información.'}</span>
        </div>
      )}

      <KpiCards metrics={metrics} busy={feedProps.busy} error={currentError} />

      <section className="queue-banner dark:bg-sonar-surface dark:border-white/10">
        <div className="queue-symbol dark:bg-sonar-base dark:border-white/10 dark:text-sonar-text" aria-hidden="true">≋</div>
        <div>
          <span className="eyebrow dark:text-pink-300">TU CRITERIO HACE LA DIFERENCIA</span>
          <h2 className="dark:text-sonar-text">
            {currentError
              ? 'La comunidad merece una buena escucha.'
              : `${metrics?.pendingReviews ?? 0} ${metrics?.pendingReviews === 1 ? 'reseña espera' : 'reseñas esperan'} tu próxima escucha.`}
          </h2>
          <p className="dark:text-sonar-text/70">Ayuda a que las buenas conversaciones encuentren su lugar.</p>
        </div>
        <a className="primary-button dark:bg-sonar-accent dark:border-sonar-accent dark:hover:bg-[#002830]" href="#moderacion">Ir a moderación <span>↗</span></a>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ModerationTable {...feedProps} error={currentError} reviews={reviews} users={users} compact />
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <RecentActivityFeed className="dark:bg-sonar-surface dark:border-white/10" />
          <aside className="side-stack flex flex-col gap-6">
            <section className="panel distribution dark:bg-sonar-surface dark:border-white/10 dark:text-sonar-text">
              <div className="panel-heading">
                <h2 className="dark:text-sonar-text">Cómo suena Sonar</h2>
                <span className="dark:text-sonar-text/70">↗</span>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-sonar-text/70 uppercase tracking-wider">
                Distribución de calificaciones
              </p>
              <div className="rating-bars">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = (reviews || []).filter(review => Math.round(review.rating) === rating).length
                  return (
                    <div key={rating}>
                      <span className="dark:text-sonar-text">{rating} <b className="dark:text-pink-300">★</b></span>
                      <meter min="0" max={Math.max((reviews || []).length, 1)} value={count} aria-label={`${rating} estrellas: ${count} reseñas`} />
                      <small className="dark:text-sonar-text/70 font-semibold">{count}</small>
                    </div>
                  )
                })}
              </div>
              <div className="panel-bottom dark:border-white/10">
                <span className="text-sm font-medium text-gray-500 dark:text-sonar-text/70 uppercase tracking-wider">
                  RESEÑAS REGISTRADAS
                </span>
                <strong className="dark:text-sonar-text text-xl font-black">{reviews?.length ?? 0}</strong>
              </div>
            </section>
            <EditorialGuide />
            <section className="panel tools-panel dark:bg-sonar-surface dark:border-white/10 flex flex-col gap-3">
              <span className="eyebrow dark:text-sonar-text/70">TU MESA DE TRABAJO</span>
              <button
                onClick={onExport}
                disabled={feedProps.busy || !!currentError}
                className="flex items-center justify-between p-4 w-full bg-white dark:bg-sonar-surface border border-gray-200 dark:border-sonar-surface rounded-lg text-sm font-medium text-gray-800 dark:text-sonar-text hover:bg-gray-50 dark:hover:bg-sonar-accent transition-colors"
              >
                <span>↓ Descargar reseñas en CSV</span> <span>↗</span>
              </button>
              <button
                onClick={onRefresh}
                disabled={feedProps.busy}
                className="flex items-center justify-between p-4 w-full bg-white dark:bg-sonar-surface border border-gray-200 dark:border-sonar-surface rounded-lg text-sm font-medium text-gray-800 dark:text-sonar-text hover:bg-gray-50 dark:hover:bg-sonar-accent transition-colors"
              >
                <span>↻ Actualizar información</span> <span>↗</span>
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
