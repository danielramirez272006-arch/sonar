import { useEffect, useState } from 'react'
import { useTranslation } from '../../../../shared/context/language-context.jsx'
import { RefreshCw } from 'lucide-react'
import { getCatalog } from '../../../../shared/services/catalog-service.js'
import { growthStatistics } from '../../../../shared/services/growth-statistics.js'

export function GrowthPanel({ users = [], busy, error: usersError }) {
  const { t } = useTranslation()
  const [music, setMusic] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  const [days, setDays] = useState(7)
  useEffect(() => {
    let active = true
    getCatalog('music').then(rows => {
      if (active) { setMusic(rows); setLoading(false); setError('') }
    }).catch(cause => { if (active) { setError(cause.message); setLoading(false) } })
    return () => { active = false }
  }, [revision, users])
  const stats = growthStatistics(users, music, days)
  const unavailable = loading || error
  const max = Math.max(1, ...stats.series.flatMap(day => [day.users, day.music]))
  return <section className="growth-panel" aria-labelledby="growth-title" aria-busy={loading || busy}>
    <header className="growth-heading"><div><span className="eyebrow">{t('admin.growth.eyebrow')}</span><h2 id="growth-title">{t('admin.growth.title')}</h2><p>{t('admin.growth.description')}</p></div></header>
    <div className="growth-cards">
      <a className="dashboard-metric" href="#usuarios"><div className="dashboard-metric__top"><span>{t('admin.growth.community')}</span><i aria-hidden="true" /></div><strong>{busy || usersError ? '—' : stats.totalUsers}</strong><div><h2>{t('admin.growth.usersRegistered')}</h2><p>{busy || usersError ? t('admin.growth.unavailable') : t('admin.growth.newInDays', { count: stats.newUsers, days })}</p></div></a>
      <a className="dashboard-metric" href="#admin-catalog-music"><div className="dashboard-metric__top"><span>{t('admin.growth.catalog')}</span><i aria-hidden="true" /></div><strong>{unavailable ? '—' : stats.totalMusic}</strong><div><h2>{t('admin.growth.musicRegistered')}</h2><p>{unavailable ? t('admin.growth.unavailable') : t('admin.growth.recordsInDays', { count: stats.newMusic, days })}</p></div></a>
      <article className="dashboard-metric"><div className="dashboard-metric__top"><span>{t('admin.growth.publishing')}</span><i aria-hidden="true" /></div><strong>{unavailable ? '—' : stats.published}</strong><div><h2>{t('admin.growth.published')}</h2><p>{t('admin.growth.editorialStatus')}</p></div></article>
      <article className="dashboard-metric"><div className="dashboard-metric__top"><span>{t('admin.growth.preparing')}</span><i aria-hidden="true" /></div><strong>{unavailable ? '—' : stats.drafts}</strong><div><h2>{t('admin.growth.drafts')}</h2><p>{t('admin.growth.awaitingPublication')}</p></div></article>
    </div>
    <div className="growth-toolbar"><h3>{t('admin.growth.recordsPerDay')}</h3><label>{t('admin.growth.period')}<select value={days} onChange={e => setDays(Number(e.target.value))}><option value={7}>{t('admin.growth.last7')}</option><option value={30}>{t('admin.growth.last30')}</option></select></label><button disabled={loading} onClick={() => { setLoading(true); setRevision(value => value + 1) }}><RefreshCw size={15} aria-hidden="true" /> {t('admin.growth.refreshMusic')}</button></div>
    {error && <p role="alert">{t('admin.growth.musicError')} {error}</p>}
    {usersError && <p>{t('admin.growth.userError')}</p>}
    {loading || busy ? <p role="status">{t('admin.growth.preparingStats')}</p> : !error && !usersError && <>
      <div className="growth-legend"><span>{t('admin.growth.newUsersLegend')}</span><span>{t('admin.growth.musicLegend')}</span></div>
      <div className="growth-chart" role="region" aria-label={t('admin.growth.chartLabel')} tabIndex={0}><div className="growth-chart-inner" style={{ gridTemplateColumns: `repeat(${days}, minmax(52px, 1fr))` }}>{stats.series.map(day => <div className="growth-day" key={day.date}><div className="growth-bars"><div><span>U: {day.users}</span><i style={{ height: `${day.users / max * 100}px` }} /></div><div><span>M: {day.music}</span><i style={{ height: `${day.music / max * 100}px` }} /></div></div><small>{day.date}</small></div>)}</div></div>
      {!stats.newUsers && !stats.newMusic && <p>{t('admin.growth.noActivity')}</p>}
      <p className="growth-note">{t('admin.growth.note')}{stats.missingDates > 0 && ` ${t('admin.growth.missingDates', { count: stats.missingDates })}`}</p>
    </>}
  </section>
}
