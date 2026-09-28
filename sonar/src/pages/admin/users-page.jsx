import { Modal } from '../../shared/components/ui/modal.jsx'
import { useState } from 'react'
import { useTranslation } from '../../shared/context/language-context.jsx'
import { BlobatarAvatar } from '../../shared/components/ui/blobatar-avatar.jsx'
import { avatarPropsFor } from '../../shared/components/ui/avatar-props'
import { ConductIndicator } from '../../features/admin/conduct-indicator.jsx'
import { SanctionPanel } from '../../features/admin/sanction-panel.jsx'
import { RecentActivityFeed } from '../../features/admin/dashboard/components/recent-activity-feed.jsx'
import { adminEvents, behaviorInput, sameId, statusLabels, userStatus } from '../../shared/services/admin-data.js'

const accountType = user => user.accountType || (user.isJunior ? 'junior' : 'standard')
const countReports = user => (user.conductReports || []).filter(report => report.status !== 'dismissed').length
const conduct = user => countReports(user) === 0 ? 'green' : countReports(user) < 7 ? 'yellow' : 'red'
const timestamp = value => Date.parse(value) || 0
const reviewLink = user => `#admin-reviews?user=${encodeURIComponent(user.id)}`

export const UsersPage = ({ users = [], reviews = [], onUserUpdate, compact = false, initialUserId = null }) => {
  const { t } = useTranslation()
  const conductLabels = { green: t('admin.users.conduct.green'), yellow: t('admin.users.conduct.yellow'), red: t('admin.users.conduct.red') }
  const statusLabel = value => t(`admin.users.status.${value}`, { defaultValue: statusLabels[value] || value })
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
    <header><div><span className="eyebrow">{t('admin.users.eyebrow')}</span><h1>{t('admin.users.title')}</h1><p>{t('admin.users.description')}</p></div>{!compact && <a href="#dashboard">{t('admin.users.back')}</a>}</header>
    <section className="users-metrics" aria-label={t('admin.users.metricsAria')}>{[[t('admin.users.metric.total'), users.length, t('admin.users.metric.registered')], [t('admin.users.metric.junior'), users.filter(user => accountType(user) === 'junior').length, t('admin.users.metric.protection')], [t('admin.users.metric.restricted'), users.filter(user => userStatus(user) !== 'active').length, t('admin.users.metric.restrictions')], [t('admin.users.metric.average'), (users.length ? totalReviews / users.length : 0).toLocaleString(), t('admin.users.metric.perMember')]].map(([label, value, detail]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>)}</section>
    <div className="admin-filters"><label>{t('admin.users.searchLabel')}<input aria-label={t('admin.users.searchLabel')} value={query} onChange={e => setQuery(e.target.value)} placeholder={t('admin.users.searchPlaceholder')} /></label><label>{t('admin.users.status')}<select value={status} onChange={e => setStatus(e.target.value)}><option value="all">{t('admin.users.all')}</option>{Object.entries(statusLabels).map(([key]) => <option key={key} value={key}>{statusLabel(key)}</option>)}</select></label><label>{t('admin.users.role')}<select value={role} onChange={e => setRole(e.target.value)}><option value="all">{t('admin.users.all')}</option><option value="user">{t('admin.users.role.member')}</option><option value="admin">{t('admin.users.role.admin')}</option></select></label><label>{t('admin.users.accountType')}<select value={account} onChange={e => setAccount(e.target.value)}><option value="all">{t('admin.users.allAccounts')}</option><option value="standard">{t('admin.users.standard')}</option><option value="junior">{t('admin.users.junior')}</option></select></label><label>{t('admin.users.behavior')}<select value={behavior} onChange={e => setBehavior(e.target.value)}><option value="all">{t('admin.users.allLevels')}</option>{Object.entries(conductLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>{t('admin.users.sort')}<select value={sort} onChange={e => setSort(e.target.value)}><option value="newest">{t('admin.users.newest')}</option><option value="oldest">{t('admin.users.oldest')}</option><option value="activity">{t('admin.users.recentActivity')}</option></select></label><button type="button" onClick={() => { setQuery(''); setStatus('all'); setRole('all'); setAccount('all'); setBehavior('all'); setSort('newest') }}>{t('admin.users.clearFilters')}</button></div>
    <p className="users-results" role="status">{t('admin.users.results', { visible: visible.length, total: users.length })}</p>
    <div className="admin-users-table"><table><thead><tr>{['admin.users.table.user', 'admin.users.role', 'admin.users.table.account', 'admin.users.table.conduct', 'admin.users.table.status', 'admin.users.table.reviews', 'admin.users.table.reports', 'admin.users.table.actions'].map(key => <th key={key}>{t(key)}</th>)}</tr></thead><tbody>{visible.map(user => <tr key={user.id}><td><div className="admin-user-identity"><BlobatarAvatar {...avatarPropsFor(user, { name: user.username })} size={34} /><span><strong>{user.username}</strong><small>{user.email}</small></span></div></td><td>{user.role === 'admin' ? t('admin.users.role.admin') : t('admin.users.role.member')}</td><td><span className="users-badge">{accountType(user) === 'junior' ? t('admin.users.junior') : t('admin.users.standard')}</span></td><td><span className={`users-badge users-conduct--${conduct(user)}`}>{conductLabels[conduct(user)]}</span></td><td><span className="users-badge">{statusLabel(userStatus(user))}</span></td><td>{ownReviews(user).length}</td><td>{countReports(user)}</td><td><div className="users-actions"><button onClick={() => setSelectedUserId(user.id)}>{t('admin.users.profile')}</button><a href={reviewLink(user)} aria-label={t('admin.users.viewUserReviews', { username: user.username })}>{t('admin.users.viewReviews')}</a></div></td></tr>)}</tbody></table>{!visible.length && <p>{t('admin.users.noMatches')}</p>}</div>
    {selected && <Modal isOpen onClose={() => setSelectedUserId(null)} title={`${t('admin.users.profile')}: ${selected.username}`} className="admin-profile-modal" hideHeader><aside className="user-profile-drawer" aria-label={`${t('admin.users.profile')}: ${selected.username}`}><header><div className="admin-user-identity"><BlobatarAvatar {...avatarPropsFor(selected, { name: selected.username })} size={56} /><div><span className="eyebrow">{t('admin.users.profileTitle')}</span><h2>{selected.username}</h2><p>{selected.email}</p></div></div><button onClick={() => setSelectedUserId(null)} aria-label={t('admin.users.closeProfile')}>×</button></header>
      <div className="admin-profile-facts"><span>{t('admin.users.profileFacts.role')}: {selected.role === 'admin' ? t('admin.users.role.admin') : t('admin.users.role.member')}</span><span>{t('admin.users.profileFacts.status')}: {statusLabel(userStatus(selected))}</span><span>{t('admin.users.profileFacts.registered')}: {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : t('admin.users.noDate')}</span><span>{ownReviews(selected).length} {t('admin.users.profileFacts.reviews')}</span><span>{countReports(selected)} {t('admin.users.profileFacts.reports')}</span><span>{selected.sanctions?.length || 0} {t('admin.users.profileFacts.sanctions')}</span><span>{selected.stats?.savedAlbums || 0} {t('admin.users.savedAlbums')}</span><span>{selected.stats?.followers || 0} {t('admin.users.followers')}</span></div>
      <a className="users-review-link" href={reviewLink(selected)}>{t('admin.users.reviewsLink', { username: selected.username })}</a><p className="user-profile-drawer__bio">{selected.bio || t('admin.users.noBio')}</p><div className="preference-list">{(selected.preferences || []).map(value => <span key={value}>{value}</span>)}</div>
      <ConductIndicator key={`conduct-${selected.id}`} user={selected} reviews={ownReviews(selected)} onUserUpdate={onUserUpdate} />
      <SanctionPanel key={`sanctions-${selected.id}`} user={selected} onUserUpdate={onUserUpdate} />
      <RecentActivityFeed activities={adminEvents([selected], ownReviews(selected))} />
      <section className="admin-panel"><h3>{t('admin.users.intelligence')}</h3><p>{t('admin.users.behaviorAnalysis')}</p><div className="admin-profile-facts"><span>{signals.reportCount} {t('admin.users.profileFacts.reports')}</span><span>{signals.previousSanctions.length} {t('admin.users.previousSanctions')}</span><span>{signals.publicationsLast7Days} {t('admin.users.postsSevenDays')}</span><span>{signals.flaggedContent} {t('admin.users.flaggedContent')}</span><span>{signals.rejectedReviews} {t('admin.users.rejectedReviews')}</span></div><dl><dt>{t('admin.users.riskLevel')}</dt><dd>{t('admin.users.notAssessed')}</dd><dt>{t('admin.users.detectedSignals')}</dt><dd>{t('admin.users.analysisPending')}</dd><dt>{t('admin.users.explanation')}</dt><dd>{t('admin.users.noModel')}</dd><dt>{t('admin.users.recommendation')}</dt><dd>{t('admin.users.noRecommendation')}</dd></dl></section>
    </aside></Modal>}
  </div>
}
export default UsersPage
