import { ModerationTable } from '../../features/admin/moderation/components/moderation-table.jsx'
import { EditorialGuide } from '../../features/admin/dashboard/components/editorial-guide.jsx'

export function ModerationPage({ onRefresh, ...props }) {
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow dark:text-[#B89CB0]">CURADURÍA CON ATENCIÓN, COMUNIDAD CON RESPETO.</span>
          <h1 className="dark:text-sonar-text">Moderación <em className="dark:text-pink-300">de Reseñas</em></h1>
          <p className="dark:text-[#B89CB0]">
            <i className="status-dot" /> {props.error ? 'Cola no disponible' : `${props.reviews.length} reseñas en la cola de revisión`} <span className="heading-separator">/</span> La última palabra siempre es humana.
          </p>
        </div>
        <button className="primary-button dark:bg-sonar-accent dark:border-sonar-accent dark:text-sonar-text dark:hover:bg-[#002830]" onClick={onRefresh} disabled={props.busy}>
          ↻ {props.busy ? 'Actualizando…' : 'Actualizar cola'}
        </button>
      </div>

      <div className="moderation-intro dark:bg-sonar-surface dark:border-white/10 dark:text-sonar-text">
        <span aria-hidden="true" className="dark:text-pink-300">◎</span>
        <p><strong className="dark:text-white">Más que moderar, cuidar la conversación.</strong> Lee, escucha el punto de vista y aplica los criterios de la comunidad.</p>
        <span className="eyebrow dark:text-[#B89CB0]">SONAR EDITORIAL</span>
      </div>

      <div className="workspace-grid">
        <ModerationTable {...props} />
        <aside className="side-stack">
          <section className="engine-panel dark:bg-sonar-surface dark:border-white/10 dark:text-sonar-text">
            <div className="panel-heading">
              <span className="eyebrow dark:text-pink-300">✧ MOTOR IA SONAR</span>
              <span className="badge dark:bg-sonar-base dark:border-white/10 dark:text-pink-200">MOCK</span>
            </div>
            <h2 className="dark:text-white">Una segunda<br /><em className="dark:text-pink-300">mirada.</em></h2>
            <p className="dark:text-[#B89CB0]">Asistencia para detectar palabras ofensivas. Tú aportas el contexto.</p>
            <div className="signal-bars" aria-hidden="true">
              {Array.from({ length: 24 }, (_, index) => <i key={index} />)}
            </div>
            <div className="engine-facts dark:border-white/10">
              <span className="dark:text-[#B89CB0]">ANÁLISIS<strong className="dark:text-sonar-text">Local</strong></span>
              <span className="dark:text-[#B89CB0]">DECISIÓN FINAL<strong className="dark:text-sonar-text">Humana</strong></span>
            </div>
          </section>
          <EditorialGuide />
          <div className="side-note dark:bg-sonar-surface dark:border-white/10 dark:text-[#B89CB0]">
            <span className="dark:text-pink-300">ⓘ</span>
            <p>Marcar una reseña no implica rechazarla. Revisa siempre el texto completo antes de decidir.</p>
          </div>
        </aside>
      </div>

      <div className="listening-bar dark:bg-sonar-surface dark:border-white/10 dark:text-sonar-text">
        <span className="mini-record" aria-hidden="true" />
        <div>
          <span className="eyebrow dark:text-pink-300">ESCUCHA CON ATENCIÓN</span>
          <strong className="dark:text-white">La música primero. El criterio, siempre.</strong>
        </div>
        <span className="dark:text-[#B89CB0]">Preescucha disponible cuando se conecte el catálogo de audio.</span>
      </div>
    </>
  )
}

export default ModerationPage
