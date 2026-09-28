import { useState } from 'react'
import { useTranslation } from '../../../../shared/context/language-context.jsx'
import { weekActivity } from '../../../../shared/services/admin-data.js'
export function ActivityChart({ events = [] }) {
  const { t } = useTranslation()
  const [type, setType] = useState('reviews')
  const days = weekActivity(events)
  const max = Math.max(1, ...days.map(day => day[type]))
  return <section className="admin-panel"><h3>{t('admin.activity.title')}</h3><div className="admin-filters">{[['reviews', t('admin.activity.reviews')], ['users', t('admin.activity.users')], ['reports', t('admin.activity.reports')], ['moderations', t('admin.activity.moderations')]].map(([key, title]) => <button key={key} aria-pressed={type === key} onClick={() => setType(key)}>{title} · {days.reduce((sum, day) => sum + day[key], 0)}</button>)}</div><div className="admin-chart">{days.map(day => <div key={day.day}><strong>{day[type]}</strong><div className="admin-chart__track"><i style={{ height: `${day[type] / max * 100}%` }} /></div><small>{day.day}</small></div>)}</div><p>{t('admin.activity.note')} {days.every(day => day[type] === 0) && t('admin.activity.empty')}</p></section>
}
export default ActivityChart
