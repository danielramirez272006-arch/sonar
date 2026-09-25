import { Modal } from '../../shared/components/ui/modal.jsx'
import { useState } from 'react'
import { BlobatarAvatar } from '../../shared/components/ui/blobatar-avatar.jsx'
import { ConductIndicator } from '../../features/admin/conduct-indicator.jsx'
import { SanctionPanel } from '../../features/admin/sanction-panel.jsx'
import { RecentActivityFeed } from '../../features/admin/dashboard/components/recent-activity-feed.jsx'
import { adminEvents, behaviorInput, sameId, statusLabels, userStatus } from '../../shared/services/admin-data.js'

const accountType = user => user.accountType || (user.isJunior ? 'junior' : 'standard')
const countReports = user => (user.conductReports || []).filter(report => report.status !== 'dismissed').length
const conduct = user => countReports(user) === 0 ? 'green' : countReports(user) < 7 ? 'yellow' : 'red'
const conductLabels = { green: 'Verde · Sin reportes', yellow: 'Amarillo · En revisión', red: 'Rojo · Prioritario' }
const timestamp = value => Date.parse(value) || 0
const reviewLink = user => `#admin-reviews?user=${encodeURIComponent(user.id)}`

export const UsersPage = ({ users = [], reviews = [], onUserUpdate, compact = false, initialUserId = null }) => {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [role, setRole] = useState('all')
  const [account, setAccount] = useState('all')
  const [behavior, setBehavior] = useState('all')
  const [sort, setSort] = useState('newest')
  const [selectedUserId, setSelectedUserId] = useState(initialUserId)
  const selected = users.find(user => sameId(user.id, selectedUserId))
  const ownReviews = user => reviews.filter(review => sameId(review.userId, user.id))
  const activity = user => Math.max(timestamp(user.lastActiveAt), timestamp(user.lastLoginAt), timestamp(user.createdAt), ...ownReviews(user).map(review => timestamp(review.createdAt)))
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean)
  const visible = users.filter(user => terms.every(term => `${user.username || ''} ${user.email || ''} ${user.id}`.toLocaleLowerCase().includes(term)) && (status === 'all' || userStatus(user) === status) && (role === 'all' || user.role === role) && (account === 'all' || accountType(user) === account) && (behavior === 'all' || conduct(user) === behavior)).sort((a, b) => {
    const aTime = sort === 'activity' ? activity(a) : timestamp(a.createdAt)
    const bTime = sort === 'activity' ? activity(b) : timestamp(b.createdAt)
    if (!aTime || !bTime) return aTime ? -1 : bTime ? 1 : 0
    return sort === 'oldest' ? aTime - bTime : bTime - aTime
  })
  const totalReviews = users.reduce((sum, user) => sum + ownReviews(user).length, 0)
  const signals = selected ? behaviorInput(selected, reviews) : null
  return <div className={`user-page ${compact ? 'user-page--compact' : ''}`}>
    <header><div><span className="eyebrow">COMUNIDAD SONAR</span><h1>Gestión de usuarios</h1><p>Perfiles, reportes y decisiones de moderación.</p></div>{!compact && <a href="#dashboard">Volver al dashboard</a>}</header>
    <section className="users-metrics" aria-label="Resumen de miembros">{[['Total de Miembros', users.length, 'Cuentas registradas'], ['Cuentas Junior', users.filter(user => accountType(user) === 'junior').length, 'Protección para menores'], ['Usuarios Sancionados/Silenciados', users.filter(user => userStatus(user) !== 'active').length, 'Restricciones vigentes'], ['Promedio de Reseñas', (users.length ? totalReviews / users.length : 0).toLocaleString('es', { maximumFractionDigits: 1 }), 'Reseñas por miembro']].map(([label, value, detail]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>)}</section>
    <div className="admin-filters"><label>Buscar usuarios<input aria-label="Buscar usuarios" value={query} onChange={e => setQuery(e.target.value)} placeholder="Nombre, correo o ID" /></label><label>Estado<select value={status} onChange={e => setStatus(e.target.value)}><option value="all">Todos</option>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label>Rol<select value={role} onChange={e => setRole(e.target.value)}><option value="all">Todos</option><option value="user">Miembro</option><option value="admin">Administrador</option></select></label><label>Tipo de cuenta<select value={account} onChange={e => setAccount(e.target.value)}><option value="all">Todas</option><option value="standard">Estándar</option><option value="junior">Junior</option></select></label><label>Conducta<select value={behavior} onChange={e => setBehavior(e.target.value)}><option value="all">Todos los niveles</option>{Object.entries(conductLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>Ordenar por<select value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Más recientes</option><option value="oldest">Mayor antigüedad</option><option value="activity">Actividad reciente</option></select></label><button type="button" onClick={() => { setQuery(''); setStatus('all'); setRole('all'); setAccount('all'); setBehavior('all'); setSort('newest') }}>Limpiar filtros</button></div>
    <p className="users-results" role="status">{visible.length} de {users.length} miembros · Conducta: verde 0, amarillo 1–6, rojo 7 o más reportes no descartados.</p>
    <div className="admin-users-table"><table><thead><tr>{['Usuario', 'Rol', 'Cuenta', 'Conducta', 'Estado', 'Reseñas', 'Reportes', 'Acciones'].map(label => <th key={label}>{label}</th>)}</tr></thead><tbody>{visible.map(user => <tr key={user.id}><td><div className="admin-user-identity"><BlobatarAvatar name={user.username} size={34} /><span><strong>{user.username}</strong><small>{user.email}</small></span></div></td><td>{user.role === 'admin' ? 'Administrador' : 'Miembro'}</td><td><span className="users-badge">{accountType(user) === 'junior' ? 'Junior' : 'Estándar'}</span></td><td><span className={`users-badge users-conduct--${conduct(user)}`}>{conductLabels[conduct(user)]}</span></td><td><span className="users-badge">{statusLabels[userStatus(user)]}</span></td><td>{ownReviews(user).length}</td><td>{countReports(user)}</td><td><div className="users-actions"><button onClick={() => setSelectedUserId(user.id)}>Perfil</button><a href={reviewLink(user)} aria-label={`Ver reseñas de ${user.username}`}>Ver reseñas</a></div></td></tr>)}</tbody></table>{!visible.length && <p>No se encontraron usuarios con estos filtros.</p>}</div>
    {selected && <Modal isOpen onClose={() => setSelectedUserId(null)} title={`Perfil de ${selected.username}`} className="admin-profile-modal" hideHeader><aside className="user-profile-drawer" aria-label={`Perfil de ${selected.username}`}><header><div className="admin-user-identity"><BlobatarAvatar name={selected.username} size={56} /><div><span className="eyebrow">PERFIL ADMINISTRATIVO</span><h2>{selected.username}</h2><p>{selected.email}</p></div></div><button onClick={() => setSelectedUserId(null)} aria-label="Cerrar perfil">×</button></header>
      <div className="admin-profile-facts"><span>Rol: {selected.role === 'admin' ? 'Administrador' : 'Miembro'}</span><span>Estado: {statusLabels[userStatus(selected)]}</span><span>Registro: {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString('es') : 'Sin fecha registrada'}</span><span>{ownReviews(selected).length} reseñas</span><span>{countReports(selected)} reportes</span><span>{selected.sanctions?.length || 0} sanciones</span><span>{selected.stats?.savedAlbums || 0} álbumes guardados</span><span>{selected.stats?.followers || 0} seguidores</span></div>
      <a className="users-review-link" href={reviewLink(selected)}>Ver todas las reseñas de {selected.username}</a><p className="user-profile-drawer__bio">{selected.bio || 'Sin biografía registrada.'}</p><div className="preference-list">{(selected.preferences || []).map(value => <span key={value}>{value}</span>)}</div>
      <ConductIndicator key={`conduct-${selected.id}`} user={selected} reviews={ownReviews(selected)} onUserUpdate={onUserUpdate} />
      <SanctionPanel key={`sanctions-${selected.id}`} user={selected} onUserUpdate={onUserUpdate} />
      <RecentActivityFeed activities={adminEvents([selected], ownReviews(selected))} />
      <section className="admin-panel"><h3>SONAR Intelligence</h3><p>Análisis de comportamiento · Preparado para integración</p><div className="admin-profile-facts"><span>{signals.reportCount} reportes</span><span>{signals.previousSanctions.length} sanciones anteriores</span><span>{signals.publicationsLast7Days} publicaciones / 7 días</span><span>{signals.flaggedContent} contenidos marcados</span><span>{signals.rejectedReviews} reseñas rechazadas</span></div><dl><dt>Nivel de riesgo</dt><dd>No evaluado</dd><dt>Señales detectadas</dt><dd>Análisis pendiente</dd><dt>Explicación</dt><dd>No hay un modelo conectado.</dd><dt>Recomendación</dt><dd>Sin recomendación automática. La decisión final corresponde al administrador.</dd></dl></section>
    </aside></Modal>}
  </div>
}
export default UsersPage
