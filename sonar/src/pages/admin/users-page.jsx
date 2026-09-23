import { Ban, CalendarDays, Check, Search, Shield, UserRound, VolumeX, X } from 'lucide-react';
import { useState } from 'react';

const muteOptions = [
  { label: '1 día', days: 1 },
  { label: '1 semana', days: 7 },
  { label: '1 mes', days: 30 },
];

function getUserStatus(user) {
  if (user.status === 'banned') return { label: 'Baneado', tone: 'banned' };
  if (user.mutedUntil && new Date(user.mutedUntil) > new Date()) return { label: 'Silenciado', tone: 'muted' };
  return { label: 'Activo', tone: 'active' };
}

function formatDate(value) {
  return value ? new Intl.DateTimeFormat('es', { dateStyle: 'medium' }).format(new Date(value)) : '';
}

export const UsersPage = ({ users = [], onUserUpdate, compact = false }) => {
  const [query, setQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [pendingId, setPendingId] = useState(null);
  const [message, setMessage] = useState('');
  const visibleUsers = users.filter(user => `${user.username} ${user.email}`.toLowerCase().includes(query.toLowerCase()));
  const selectedUser = users.find(user => user.id === selectedUserId) || null;

  async function applyUserUpdate(userId, changes, successMessage) {
    setPendingId(userId);
    setMessage('');
    try {
      await onUserUpdate(userId, changes);
      setMessage(successMessage);
    } catch (error) {
      setMessage(error.message || 'No se pudo actualizar el usuario.');
    } finally {
      setPendingId(null);
    }
  }

  function banUser(user) {
    if (user.role === 'admin') return setMessage('La cuenta administradora no puede ser baneada.');
    const isBanned = user.status === 'banned';
    return applyUserUpdate(user.id, { status: isBanned ? 'active' : 'banned', mutedUntil: null }, isBanned ? 'Usuario desbaneado.' : 'Usuario baneado.');
  }

  function muteUser(user, days) {
    if (user.role === 'admin') return setMessage('La cuenta administradora no puede ser silenciada.');
    const mutedUntil = new Date(Date.now() + days * 86400000).toISOString();
    return applyUserUpdate(user.id, { status: 'active', mutedUntil }, `Usuario silenciado hasta ${formatDate(mutedUntil)}.`);
  }

  function unmuteUser(user) {
    return applyUserUpdate(user.id, { mutedUntil: null }, 'Silenciamiento retirado.');
  }

  return (
    <div className={`user-page ${compact ? 'user-page--compact' : ''}`}>
      <header><div><span className="eyebrow">COMUNIDAD SONAR</span><h1>Gestión de usuarios</h1><p>Revisa perfiles y modera la participación de la comunidad.</p></div>{!compact && <a href="#dashboard">Volver al dashboard</a>}</header>
      <label className="user-management__search"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar por nombre o correo" aria-label="Buscar usuarios" /></label>
      {message && <p className="user-page__notice" role="status">{message}</p>}
      <div className="user-page__table"><div className="user-page__head"><span>Usuario</span><span>Rol</span><span>Estado</span><span>Acciones</span></div>{visibleUsers.map(user => { const status = getUserStatus(user); return <article key={user.id} className={selectedUserId === user.id ? 'is-selected' : ''}><button className="user-page__identity" type="button" onClick={() => setSelectedUserId(user.id)}><span className="user-management__avatar">{user.username?.slice(0, 1).toUpperCase() || '?'}</span><span><strong>{user.username}</strong><small>{user.email}</small></span></button><span className={`user-role user-role--${user.role}`}>{user.role === 'admin' ? <><Shield size={14} /> Administrador</> : <><UserRound size={14} /> Miembro</>}</span><span className={`user-status user-status--${status.tone}`}>{status.label}{status.tone === 'muted' && <small>hasta {formatDate(user.mutedUntil)}</small>}</span><div className="user-page__actions"><button type="button" className="user-action user-action--profile" onClick={() => setSelectedUserId(user.id)}><UserRound size={14} /> Perfil</button><button type="button" className="user-action user-action--ban" onClick={() => banUser(user)} disabled={pendingId === user.id || user.role === 'admin'}>{user.status === 'banned' ? <><Check size={14} /> Desbanear</> : <><Ban size={14} /> Banear</>}</button>{status.tone === 'muted' ? <button type="button" className="user-action user-action--mute" onClick={() => unmuteUser(user)} disabled={pendingId === user.id}><VolumeX size={14} /> Quitar silencio</button> : <select className="user-mute-select" defaultValue="" onChange={event => { if (event.target.value) muteUser(user, Number(event.target.value)); event.target.value = ''; }} disabled={pendingId === user.id || user.role === 'admin'} aria-label={`Silenciar a ${user.username}`}><option value="">Silenciar...</option>{muteOptions.map(option => <option key={option.days} value={option.days}>{option.label}</option>)}</select>}</div></article> })}{!visibleUsers.length && <p className="user-page__empty">No se encontraron usuarios.</p>}</div>
      {selectedUser && <aside className="user-profile-drawer" aria-label={`Perfil de ${selectedUser.username}`}><header><div><span className="eyebrow">PERFIL DEL MIEMBRO</span><h2>{selectedUser.username}</h2></div><button type="button" onClick={() => setSelectedUserId(null)} aria-label="Cerrar perfil"><X size={17} /></button></header><div className="user-profile-drawer__status"><span className={`user-status user-status--${getUserStatus(selectedUser).tone}`}>{getUserStatus(selectedUser).label}</span><span>{selectedUser.email}</span></div><p className="user-profile-drawer__bio">{selectedUser.bio || 'Este usuario todavía no ha añadido una descripción.'}</p><div className="user-profile-drawer__stats"><span><b>{selectedUser.stats?.reviewsCount ?? 0}</b> reseñas</span><span><b>{selectedUser.stats?.savedAlbums ?? 0}</b> álbumes guardados</span><span><b>{selectedUser.stats?.followers ?? 0}</b> seguidores</span></div><div className="user-profile-drawer__section"><h3>Gustos y preferencias</h3>{selectedUser.preferences?.length ? <div className="preference-list">{selectedUser.preferences.map(preference => <span key={preference}>{preference}</span>)}</div> : <p>No hay preferencias registradas.</p>}</div><div className="user-profile-drawer__section"><h3><CalendarDays size={15} /> Moderación</h3><p>{selectedUser.status === 'banned' ? 'La cuenta no puede participar en la plataforma.' : getUserStatus(selectedUser).tone === 'muted' ? `No puede comentar hasta el ${formatDate(selectedUser.mutedUntil)}.` : 'La cuenta puede participar normalmente.'}</p></div></aside>}
    </div>
  );
};

export default UsersPage;
