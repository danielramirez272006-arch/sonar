export function RecentActivityFeed({ activities = [], className = '' }) {
  return <section className={`admin-panel ${className}`} aria-label="Actividad reciente"><h3>Actividad reciente</h3><p>Últimos eventos registrados</p>{!activities.length && <p>No hay actividad con fecha registrada.</p>}<ol className="admin-events">{activities.slice(0, 10).map(item => <li key={item.id}><a href={item.href}>{item.text}<small>{new Date(item.at).toLocaleString('es')}</small></a></li>)}</ol></section>
}
export default RecentActivityFeed
