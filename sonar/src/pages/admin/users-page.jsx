import { Modal } from '../../shared/components/ui/modal.jsx'
import { useState } from 'react'
import { BlobatarAvatar } from '../../shared/components/ui/blobatar-avatar.jsx'
import { ConductIndicator } from '../../features/admin/conduct-indicator.jsx'
import { SanctionPanel } from '../../features/admin/sanction-panel.jsx'
import { RecentActivityFeed } from '../../features/admin/dashboard/components/recent-activity-feed.jsx'
import { adminEvents, behaviorInput, sameId, statusLabels, userStatus } from '../../shared/services/admin-data.js'

export const UsersPage = ({ users = [], reviews = [], onUserUpdate, compact = false, initialUserId = null }) => {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [role, setRole] = useState('all')
  const [selectedUserId, setSelectedUserId] = useState(initialUserId)
  const selected = users.find(user => sameId(user.id, selectedUserId))
  const visible = users.filter(user => `${user.username} ${user.email}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()) && (status === 'all' || userStatus(user) === status) && (role === 'all' || user.role === role))
  const ownReviews = user => reviews.filter(review => sameId(review.userId, user.id))
  const countReports = user => (user.conductReports || []).filter(report => report.status !== 'dismissed').length
  const signals = selected ? behaviorInput(selected, reviews) : null
  return <div className={`user-page ${compact ? 'user-page--compact' : ''}`}>
    <header><div><span className="eyebrow">COMUNIDAD SONAR</span><h1>Gestión de usuarios</h1><p>Perfiles, reportes y decisiones de moderación.</p></div>{!compact && <a href="#dashboard">Volver al dashboard</a>}</header>
    <div className="admin-filters"><label>Buscar usuarios<input aria-label="Buscar usuarios" value={query} onChange={e => setQuery(e.target.value)} placeholder="Nombre o correo" /></label><label>Estado<select value={status} onChange={e => setStatus(e.target.value)}><option value="all">Todos</option>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label>Rol<select value={role} onChange={e => setRole(e.target.value)}><option value="all">Todos</option><option value="user">Miembro</option><option value="admin">Administrador</option></select></label></div>
    <div className="admin-users-table"><table><thead><tr>{['Usuario', 'Rol', 'Estado', 'Reseñas', 'Reportes', 'Acciones'].map(label => <th key={label}>{label}</th>)}</tr></thead><tbody>{visible.map(user => <tr key={user.id}><td><div className="admin-user-identity"><BlobatarAvatar name={user.username} size={34} /><span><strong>{user.username}</strong><small>{user.email}</small></span></div></td><td>{user.role === 'admin' ? 'Administrador' : 'Miembro'}</td><td>{statusLabels[userStatus(user)]}</td><td>{ownReviews(user).length}</td><td>{countReports(user)}</td><td><button onClick={() => setSelectedUserId(user.id)}>Perfil</button></td></tr>)}</tbody></table>{!visible.length && <p>No se encontraron usuarios con estos filtros.</p>}</div>
    {selected && <Modal isOpen onClose={() => setSelectedUserId(null)} title={`Perfil de ${selected.username}`} className="admin-profile-modal" hideHeader><aside className="user-profile-drawer" aria-label={`Perfil de ${selected.username}`}><header><div className="admin-user-identity"><BlobatarAvatar name={selected.username} size={56} /><div><span className="eyebrow">PERFIL ADMINISTRATIVO</span><h2>{selected.username}</h2><p>{selected.email}</p></div></div><button onClick={() => setSelectedUserId(null)} aria-label="Cerrar perfil">×</button></header>
      <div className="admin-profile-facts"><span>Rol: {selected.role === 'admin' ? 'Administrador' : 'Miembro'}</span><span>Estado: {statusLabels[userStatus(selected)]}</span><span>Registro: {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString('es') : 'Sin fecha registrada'}</span><span>{ownReviews(selected).length} reseñas</span><span>{countReports(selected)} reportes</span><span>{selected.sanctions?.length || 0} sanciones</span><span>{selected.stats?.savedAlbums || 0} álbumes guardados</span><span>{selected.stats?.followers || 0} seguidores</span></div>
      <p className="user-profile-drawer__bio">{selected.bio || 'Sin biografía registrada.'}</p><div className="preference-list">{(selected.preferences || []).map(value => <span key={value}>{value}</span>)}</div>
      <ConductIndicator key={`conduct-${selected.id}`} user={selected} reviews={ownReviews(selected)} onUserUpdate={onUserUpdate} />
      <SanctionPanel key={`sanctions-${selected.id}`} user={selected} onUserUpdate={onUserUpdate} />
      <RecentActivityFeed activities={adminEvents([selected], ownReviews(selected))} />
      <section className="admin-panel"><h3>SONAR Intelligence</h3><p>Análisis de comportamiento · Preparado para integración</p><div className="admin-profile-facts"><span>{signals.reportCount} reportes</span><span>{signals.previousSanctions.length} sanciones anteriores</span><span>{signals.publicationsLast7Days} publicaciones / 7 días</span><span>{signals.flaggedContent} contenidos marcados</span><span>{signals.rejectedReviews} reseñas rechazadas</span></div><dl><dt>Nivel de riesgo</dt><dd>No evaluado</dd><dt>Señales detectadas</dt><dd>Análisis pendiente</dd><dt>Explicación</dt><dd>No hay un modelo conectado.</dd><dt>Recomendación</dt><dd>Sin recomendación automática. La decisión final corresponde al administrador.</dd></dl></section>
    </aside></Modal>}
  </div>
}
export default UsersPage
