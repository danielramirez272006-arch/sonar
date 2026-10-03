import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTranslation } from '../../../../shared/context/language-context.jsx'
import { weekActivity } from '../../../../shared/services/admin-data.js'
export function ActivityChart({ events = [] }) {
  const { t } = useTranslation()
  const [type, setType] = useState('reviews')
  const days = weekActivity(events)
  const options = [['reviews', t('admin.activity.reviews')], ['users', t('admin.activity.users')], ['reports', t('admin.activity.reports')], ['moderations', t('admin.activity.moderations')]]
  const current = options.find(([key]) => key === type)[1]
  return (
    <section className="admin-panel">
      <h3>{t('admin.activity.title')}</h3>
      <div className="admin-filters">
        {options.map(([key, title]) => (
          <button key={key} aria-pressed={type === key} onClick={() => setType(key)}>
            {title} · {days.reduce((sum, day) => sum + day[key], 0)}
          </button>
        ))}
      </div>
      <div className="admin-chart" role="img" aria-label={`${t('admin.activity.title')}: ${current}`} style={{ display: 'block', width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={days} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.12)" />
            <XAxis dataKey="day" stroke="currentColor" />
            <YAxis allowDecimals={false} stroke="currentColor" />
            <Tooltip contentStyle={{ background: '#111', border: '1px solid #444', color: '#fff' }} />
            <Bar dataKey={type} name={current} fill="#B80C09" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p>{t('admin.activity.note')} {days.every(day => day[type] === 0) && t('admin.activity.empty')}</p>
    </section>
  )
}
export default ActivityChart
