import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { getCatalog } from '../../../../shared/services/catalog-service.js'
import { growthStatistics } from '../../../../shared/services/growth-statistics.js'

export function GrowthPanel({ users = [], busy, error: usersError }) {
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
    <header className="growth-heading"><div><span className="eyebrow">COMUNIDAD Y CATÁLOGO</span><h2 id="growth-title">Así crece SONAR</h2><p>Altas de usuarios y música registrada en la plataforma.</p></div></header>
    <div className="growth-cards">
      <a className="dashboard-metric" href="#usuarios"><div className="dashboard-metric__top"><span>Comunidad</span><i aria-hidden="true" /></div><strong>{busy || usersError ? '—' : stats.totalUsers}</strong><div><h2>Usuarios registrados</h2><p>{busy || usersError ? 'Datos no disponibles' : `${stats.newUsers} nuevos en ${days} días`}</p></div></a>
      <a className="dashboard-metric" href="#admin-catalog-music"><div className="dashboard-metric__top"><span>Catálogo</span><i aria-hidden="true" /></div><strong>{unavailable ? '—' : stats.totalMusic}</strong><div><h2>Música registrada</h2><p>{unavailable ? 'Datos no disponibles' : `${stats.newMusic} registros en ${days} días`}</p></div></a>
      <article className="dashboard-metric"><div className="dashboard-metric__top"><span>Publicación</span><i aria-hidden="true" /></div><strong>{unavailable ? '—' : stats.published}</strong><div><h2>Publicados</h2><p>Estado editorial del registro</p></div></article>
      <article className="dashboard-metric"><div className="dashboard-metric__top"><span>En preparación</span><i aria-hidden="true" /></div><strong>{unavailable ? '—' : stats.drafts}</strong><div><h2>Borradores</h2><p>Pendientes de publicación</p></div></article>
    </div>
    <div className="growth-toolbar"><h3>Registros por día</h3><label>Período<select value={days} onChange={e => setDays(Number(e.target.value))}><option value={7}>Últimos 7 días</option><option value={30}>Últimos 30 días</option></select></label><button disabled={loading} onClick={() => { setLoading(true); setRevision(value => value + 1) }}><RefreshCw size={15} aria-hidden="true" /> Actualizar música</button></div>
    {error && <p role="alert">No se pudo consultar la música registrada. {error}</p>}
    {usersError && <p>Las estadísticas de usuarios no están disponibles. Usa el aviso superior para reintentar.</p>}
    {loading || busy ? <p role="status">Preparando estadísticas…</p> : !error && !usersError && <>
      <div className="growth-legend"><span>U · Usuarios nuevos</span><span>M · Música registrada</span></div>
      <div className="growth-chart" role="region" aria-label="Estadísticas diarias" tabIndex={0}><div className="growth-chart-inner" style={{ gridTemplateColumns: `repeat(${days}, minmax(52px, 1fr))` }}>{stats.series.map(day => <div className="growth-day" key={day.date}><div className="growth-bars"><div><span>U: {day.users}</span><i style={{ height: `${day.users / max * 100}px` }} /></div><div><span>M: {day.music}</span><i style={{ height: `${day.music / max * 100}px` }} /></div></div><small>{day.date}</small></div>)}</div></div>
      {!stats.newUsers && !stats.newMusic && <p>No hay altas registradas en este período.</p>}
      <p className="growth-note">Se cuentan cuentas nuevas, no sesiones ni usuarios conectados. La música corresponde a fichas con URL de audio; no a archivos alojados en SONAR.{stats.missingDates > 0 && ` ${stats.missingDates} registros sin fecha válida se incluyen en los totales, pero no en el gráfico.`}</p>
    </>}
  </section>
}
