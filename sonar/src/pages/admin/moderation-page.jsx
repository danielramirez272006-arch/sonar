import { ModerationTable } from '../../features/admin/moderation/components/moderation-table.jsx'
import { EditorialGuide } from '../../features/admin/dashboard/components/editorial-guide.jsx'

export function ModerationPage({ onRefresh, ...props }) {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow dark:text-sonar-text/70">CURADURÍA CON ATENCIÓN, COMUNIDAD CON RESPETO.</span>
          <h1 className="dark:text-sonar-text">Moderación <em className="dark:text-pink-300">de Reseñas</em></h1>
          <p className="dark:text-sonar-text/70">
            <i className="status-dot" /> {props.error ? 'Cola no disponible' : `${props.reviews.length} reseñas en la cola de revisión`} <span className="heading-separator">/</span> La última palabra siempre es humana.
          </p>
        </div>
        <button className="primary-button dark:bg-sonar-accent dark:border-sonar-accent dark:text-sonar-text dark:hover:bg-[#002830]" onClick={onRefresh} disabled={props.busy}>
          ↻ {props.busy ? 'Actualizando…' : 'Actualizar cola'}
        </button>
      </div>

      <div className="moderation-intro dark:bg-sonar-surface dark:border-sonar-surface dark:text-sonar-text">
        <span aria-hidden="true" className="dark:text-pink-300">◎</span>
        <p><strong className="dark:text-sonar-text">Más que moderar, cuidar la conversación.</strong> Lee, escucha el punto de vista y aplica los criterios de la comunidad.</p>
        <span className="eyebrow dark:text-sonar-text/70">SONAR EDITORIAL</span>
      </div>

      <div className="workspace-grid">
        <ModerationTable {...props} />
        <aside className="side-stack">
          {/* Tarjeta Motor IA Sonar con estilos en línea forzados */}
          <div style={{ backgroundColor: '#4B2840', borderColor: '#003844' }} className="p-6 rounded-xl border shadow-md text-sonar-text">
            <div className="panel-heading flex items-center justify-between gap-2 mb-4">
              <span className="eyebrow text-xs font-bold tracking-wider text-pink-300">✧ MOTOR IA SONAR</span>
              <button style={{ backgroundColor: '#003844', color: '#DCDCDD' }} className="px-3 py-1.5 text-xs font-medium rounded-md border border-sonar-surface transition-colors cursor-default">
                MOCK
              </button>
            </div>
            <h2 className="text-2xl font-bold text-white dark:text-sonar-text leading-tight mb-2">
              Una segunda<br /><em className="font-serif italic text-pink-300">mirada.</em>
            </h2>
            <p className="text-xs text-gray-200 dark:text-sonar-text/80 mb-4 leading-relaxed">
              Asistencia para detectar palabras ofensivas. Tú aportas el contexto.
            </p>
            <div className="signal-bars flex items-center justify-between h-14 my-4 gap-1" aria-hidden="true">
              {Array.from({ length: 24 }, (_, index) => (
                <i key={index} style={{ backgroundColor: '#DCDCDD', opacity: 0.35 }} className="w-1 rounded-sm" />
              ))}
            </div>
            <div className="engine-facts pt-4 border-t border-white/10 dark:border-sonar-surface flex justify-between text-xs">
              <span className="text-gray-300 dark:text-sonar-text/70">
                ANÁLISIS<strong className="block text-white dark:text-sonar-text font-bold text-sm">Local</strong>
              </span>
              <span className="text-gray-300 dark:text-sonar-text/70">
                DECISIÓN FINAL<strong className="block text-white dark:text-sonar-text font-bold text-sm">Humana</strong>
              </span>
            </div>
          </div>
          <EditorialGuide />
          <div className="side-note dark:bg-sonar-surface dark:border-sonar-surface dark:text-sonar-text/70">
            <span className="dark:text-pink-300">ⓘ</span>
            <p>Marcar una reseña no implica rechazarla. Revisa siempre el texto completo antes de decidir.</p>
          </div>
        </aside>
      </div>

      <div className="listening-bar dark:bg-sonar-surface dark:border-sonar-surface dark:text-sonar-text">
        <span className="mini-record" aria-hidden="true" />
        <div>
          <span className="eyebrow dark:text-pink-300">ESCUCHA CON ATENCIÓN</span>
          <strong className="dark:text-sonar-text">La música primero. El criterio, siempre.</strong>
        </div>
        <span className="dark:text-sonar-text/70">Preescucha disponible cuando se conecte el catálogo de audio.</span>
      </div>
    </>
  )
}

export default ModerationPage
