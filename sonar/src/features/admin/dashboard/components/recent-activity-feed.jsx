import { useUIText } from '../../../../shared/i18n/use-ui-text.js';
export function RecentActivityFeed({ activities = [], className = '' }) {
  const ui = useUIText();
  return <section className={`admin-panel ${className}`} aria-label={ui("Actividad reciente")}><h3>{ui("Actividad reciente")}</h3><p>{ui("Últimos eventos registrados")}</p>{!activities.length && <p>{ui("No hay actividad con fecha registrada.")}</p>}<ol className="admin-events">{activities.slice(0, 10).map(item => <li key={item.id}><a href={item.href}>{item.text}<small>{new Date(item.at).toLocaleString('es')}</small></a></li>)}</ol></section>
}
export default RecentActivityFeed
