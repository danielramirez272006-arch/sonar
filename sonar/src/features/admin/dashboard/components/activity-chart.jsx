import { useState } from 'react'
import { weekActivity } from '../../../../shared/services/admin-data.js'
export function ActivityChart({ events = [] }) {
  const [type, setType] = useState('reviews')
  const days = weekActivity(events)
  const max = Math.max(1, ...days.map(day => day[type]))
  return <section className="admin-panel"><h3>Actividad de los últimos 7 días</h3><div className="admin-filters">{[['reviews', 'Reseñas'], ['users', 'Usuarios'], ['reports', 'Reportes'], ['moderations', 'Moderaciones']].map(([key, title]) => <button key={key} aria-pressed={type === key} onClick={() => setType(key)}>{title} · {days.reduce((sum, day) => sum + day[key], 0)}</button>)}</div><div className="admin-chart">{days.map(day => <div key={day.day}><strong>{day[type]}</strong><div className="admin-chart__track"><i style={{ height: `${day[type] / max * 100}%` }} /></div><small>{day.day}</small></div>)}</div><p>Solo se incluyen registros con fecha. {days.every(day => day[type] === 0) && 'No hay actividad en este período.'}</p></section>
}
export default ActivityChart
