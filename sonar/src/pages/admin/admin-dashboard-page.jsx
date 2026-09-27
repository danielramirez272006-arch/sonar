import { GrowthPanel } from '../../features/admin/dashboard/components/growth-panel.jsx';
import { adminEvents } from '../../shared/services/admin-data.js';
import { ActivityChart } from '../../features/admin/dashboard/components/activity-chart.jsx';
import { ArrowUpRight, Download, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { KpiCards } from '../../features/admin/dashboard/components/kpi-cards.jsx';
import { PriorityQueue } from '../../features/admin/dashboard/components/priority-queue.jsx';
import { RecentActivityFeed } from '../../features/admin/dashboard/components/recent-activity-feed.jsx';
import { ModerationTable } from '../../features/admin/moderation/components/moderation-table.jsx';
import UsersPage from './users-page.jsx';
import { useTranslation } from '../../shared/context/language-context.jsx';

function ModerationRhythm({ metrics, reviews }) {
  const { t } = useTranslation();
  const total = Math.max(reviews?.length ?? 0, 1);
  const segments = [
    [t('admin.dashboard.pending'), metrics?.pendingReviews ?? 0, 'pending'],
    [t('admin.dashboard.approved'), metrics?.approvedReviews ?? 0, 'approved'],
    [t('admin.dashboard.rejected'), metrics?.rejectedReviews ?? 0, 'rejected'],
  ];

  return <section className="moderation-rhythm" aria-labelledby="rhythm-title">
    <header><div><span className="eyebrow">{t('admin.dashboard.rhythmEyebrow')}</span><h2 id="rhythm-title">{t('admin.dashboard.moderationState')}</h2></div><span>{t('admin.dashboard.reviewCount', { count: reviews?.length ?? 0 })}</span></header>
    <div className="moderation-rhythm__bars">
      {segments.map(([label, value, tone], index) => <div className="rhythm-bar" key={tone} style={{ '--size': `${(value / total) * 100}%`, '--enter-delay': `${260 + index * 100}ms` }}><div><span>{label}</span><b>{value}</b></div><i className={`rhythm-bar__track rhythm-bar__track--${tone}`}><em /></i></div>)}
    </div>
    <a href="#moderacion" className="moderation-rhythm__link">{t('admin.dashboard.openFilters')} <ArrowUpRight size={15} /></a>
  </section>;
}

export function AdminDashboardPage({ metrics, reviews = [], users = [], onRefresh, onExport, error, ...feedProps }) {
  const { t } = useTranslation();
  const currentError = error || feedProps.error;
  const [selectedMetric, setSelectedMetric] = useState(null);
  const detailConfig = {
    pendingReviews: { title: t('admin.dashboard.pendingTitle'), reason: t('admin.dashboard.pendingReason'), items: reviews.filter(review => review.status === 'pending_moderation') },
    flaggedReviews: { title: t('admin.dashboard.flaggedTitle'), reason: t('admin.dashboard.flaggedReason'), items: reviews.filter(review => review.aiFlagged === true) },
    totalReviews: { title: t('admin.dashboard.archiveTitle'), reason: t('admin.dashboard.archiveReason'), items: reviews },
  };
  const selectedDetail = selectedMetric ? detailConfig[selectedMetric] : null;
  if (selectedDetail) return (
    <div className="admin-workspace">
      <header className="admin-workspace__hero">
        <div><span className="eyebrow">{t('admin.dashboard.reviewDetail')}</span><h1>{selectedDetail.title}</h1><p>{selectedDetail.reason}</p></div>
        <div className="admin-workspace__actions"><button type="button" onClick={() => setSelectedMetric(null)}>{t('admin.dashboard.backSummary')}</button></div>
      </header>
      <ModerationTable {...feedProps} error={currentError} reviews={selectedDetail.items} users={users} compact />
    </div>
  );

  return (
    <div className="admin-workspace">
      <header className="admin-workspace__hero">
        <div><span className="eyebrow">{t('admin.dashboard.live')}</span><h1>{t('admin.dashboard.title')}</h1><p>{t('admin.dashboard.description')}</p></div>
        <div className="admin-workspace__actions"><button type="button" onClick={onRefresh} disabled={feedProps.busy}><RefreshCw size={15} className={feedProps.busy ? 'is-spinning' : ''} /> {t('admin.dashboard.refresh')}</button><a href="#moderacion" className="primary-button">{t('admin.dashboard.openModeration')} <ArrowUpRight size={16} /></a></div>
      </header>

      {currentError && <div className="admin-workspace__error">{t('admin.dashboard.errorStale')} {typeof currentError === 'string' ? currentError : t('admin.dashboard.errorLoad')}</div>}

      <KpiCards metrics={metrics} busy={feedProps.busy} error={currentError} onSelect={setSelectedMetric} />
      <GrowthPanel users={users} busy={feedProps.busy} error={currentError} />


      <div className="admin-workspace__grid">
        <div className="admin-workspace__main"><PriorityQueue reviews={reviews} users={users} busy={feedProps.busy} onAction={feedProps.onAction} /><ModerationRhythm metrics={metrics} reviews={reviews} /><ActivityChart events={adminEvents(users, reviews)} /></div>
        <aside className="admin-workspace__side"><RecentActivityFeed activities={adminEvents(users, reviews)} className="dashboard-recent-activity" /><section className="admin-tools"><span className="eyebrow">{t('admin.dashboard.tools')}</span><h2>{t('admin.dashboard.shortcuts')}</h2><button type="button" onClick={onExport} disabled={feedProps.busy || !!currentError}><Download size={16} /> {t('admin.dashboard.exportCsv')} <ArrowUpRight size={15} /></button><a href="#moderacion"><SlidersHorizontal size={16} /> {t('admin.dashboard.configureFilters')} <ArrowUpRight size={15} /></a></section></aside>
      </div>
      <UsersPage reviews={reviews} users={users} onUserUpdate={feedProps.onUserUpdate} compact />
      <section className="admin-workspace__archive" aria-labelledby="archive-title"><div><span className="eyebrow">{t('admin.dashboard.archive')}</span><h2 id="archive-title">{t('admin.dashboard.reviewsAndFilters')}</h2><p>{t('admin.dashboard.archiveDescription')}</p></div><ModerationTable {...feedProps} error={currentError} reviews={reviews} users={users} compact /></section>
    </div>
  );
}

export default AdminDashboardPage;
