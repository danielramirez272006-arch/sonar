import { ModerationTable } from '../../features/admin/moderation/components/moderation-table.jsx'
import { EditorialGuide } from '../../features/admin/dashboard/components/editorial-guide.jsx'

export function ModerationPage({ onRefresh, ...props }) {
  return <>
    <div className="page-heading"><div><span className="eyebrow">CURADURÍA CON ATENCIÓN, COMUNIDAD CON RESPETO.</span><h1>Moderación <em>de Reseñas</em></h1><p><i className="status-dot" /> {props.error ? 'Cola no disponible' : `${props.reviews.length} reseñas en la cola de revisión`} <span className="heading-separator">/</span> La última palabra siempre es humana.</p></div><button className="primary-button" onClick={onRefresh} disabled={props.busy}>↻ {props.busy ? 'Actualizando…' : 'Actualizar cola'}</button></div>
    <div className="moderation-intro"><span aria-hidden="true">◎</span><p><strong>Más que moderar, cuidar la conversación.</strong> Lee, escucha el punto de vista y aplica los criterios de la comunidad.</p><span className="eyebrow">SONAR EDITORIAL</span></div>
    <div className="workspace-grid"><ModerationTable {...props} /><aside className="side-stack"><section className="engine-panel"><div className="panel-heading"><span className="eyebrow">✧ MOTOR IA SONAR</span><span className="badge">MOCK</span></div><h2>Una segunda<br /><em>mirada.</em></h2><p>Asistencia para detectar palabras ofensivas. Tú aportas el contexto.</p><div className="signal-bars" aria-hidden="true">{Array.from({ length: 24 }, (_, index) => <i key={index} />)}</div><div className="engine-facts"><span>ANÁLISIS<strong>Local</strong></span><span>DECISIÓN FINAL<strong>Humana</strong></span></div></section><EditorialGuide /><div className="side-note"><span>ⓘ</span><p>Marcar una reseña no implica rechazarla. Revisa siempre el texto completo antes de decidir.</p></div></aside></div>
    <div className="listening-bar"><span className="mini-record" aria-hidden="true" /><div><span className="eyebrow">ESCUCHA CON ATENCIÓN</span><strong>La música primero. El criterio, siempre.</strong></div><span>Preescucha disponible cuando se conecte el catálogo de audio.</span></div>
  </>
}
