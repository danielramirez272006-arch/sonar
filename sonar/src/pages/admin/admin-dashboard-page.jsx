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
          <span className="eyebrow">LA MÚSICA NOS REÚNE. EL CRITERIO NOS DEFINE.</span>
          <h1>Dashboard <em>Administrativo</em></h1>
          <p>Una mirada al pulso de Sonar. Cada opinión cuenta, cada reseña importa.</p>
        </div>
        <div className="profile-card">
          <span className="avatar profile-avatar">S</span>
          <div>
            <small>ESPACIO DE CURADURÍA</small>
            <strong>Consola administrativa</strong>
            <span><i className="status-dot" /> Vista de prueba</span>
          </div>
        </div>
      </div>

      {currentError && (
        <div className="bg-red-50/10 border border-red-500/30 text-red-500 p-4 rounded-xl flex items-center justify-between w-full">
          <span>{typeof currentError === 'string' ? currentError : 'No se pudo cargar la información.'}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCards metrics={metrics} busy={feedProps.busy} error={currentError} />
      </div>

      <section className="queue-banner">
        <div className="queue-symbol" aria-hidden="true">≋</div>
        <div>
          <span className="eyebrow">TU CRITERIO HACE LA DIFERENCIA</span>
          <h2>
            {currentError
              ? 'La comunidad merece una buena escucha.'
              : `${metrics?.pendingReviews ?? 0} ${metrics?.pendingReviews === 1 ? 'reseña espera' : 'reseñas esperan'} tu próxima escucha.`}
          </h2>
          <p>Ayuda a que las buenas conversaciones encuentren su lugar.</p>
        </div>
        <a className="primary-button" href="#moderacion">Ir a moderación <span>↗</span></a>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ModerationTable {...feedProps} error={currentError} reviews={reviews} users={users} compact />
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <RecentActivityFeed />
          <aside className="side-stack flex flex-col gap-6">
            <section className="panel distribution">
              <div className="panel-heading">
                <h2>Cómo suena Sonar</h2>
                <span>↗</span>
              </div>
              <p>Distribución de calificaciones</p>
              <div className="rating-bars">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = (reviews || []).filter(review => Math.round(review.rating) === rating).length
                  return (
                    <div key={rating}>
                      <span>{rating} <b>★</b></span>
                      <meter min="0" max={Math.max((reviews || []).length, 1)} value={count} aria-label={`${rating} estrellas: ${count} reseñas`} />
                      <small>{count}</small>
                    </div>
                  )
                })}
              </div>
              <div className="panel-bottom">
                <span>RESEÑAS REGISTRADAS</span>
                <strong>{reviews?.length ?? 0}</strong>
              </div>
            </section>
            <EditorialGuide />
            <section className="panel tools-panel">
              <span className="eyebrow">TU MESA DE TRABAJO</span>
              <button onClick={onExport} disabled={feedProps.busy || !!currentError}>
                ↓ Descargar reseñas en CSV <span>↗</span>
              </button>
              <button onClick={onRefresh} disabled={feedProps.busy}>
                ↻ Actualizar información <span>↗</span>
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
