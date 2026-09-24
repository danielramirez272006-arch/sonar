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

function ModerationRhythm({ metrics, reviews }) {
  const total = Math.max(reviews?.length ?? 0, 1);
  const segments = [
    ['Pendientes', metrics?.pendingReviews ?? 0, 'pending'],
    ['Aprobadas', metrics?.approvedReviews ?? 0, 'approved'],
    ['Rechazadas', metrics?.rejectedReviews ?? 0, 'rejected'],
  ];

  return <section className="moderation-rhythm" aria-labelledby="rhythm-title">
    <header><div><span className="eyebrow">PULSO EDITORIAL</span><h2 id="rhythm-title">Estado de moderación</h2></div><span>{reviews?.length ?? 0} reseñas</span></header>
    <div className="moderation-rhythm__bars">
      {segments.map(([label, value, tone], index) => <div className="rhythm-bar" key={tone} style={{ '--size': `${(value / total) * 100}%`, '--enter-delay': `${260 + index * 100}ms` }}><div><span>{label}</span><b>{value}</b></div><i className={`rhythm-bar__track rhythm-bar__track--${tone}`}><em /></i></div>)}
    </div>
    <a href="#moderacion" className="moderation-rhythm__link">Abrir filtros y moderar <ArrowUpRight size={15} /></a>
  </section>;
}

export function AdminDashboardPage({ metrics, reviews = [], users = [], onRefresh, onExport, error, ...feedProps }) {
  const currentError = error || feedProps.error;
  const [selectedMetric, setSelectedMetric] = useState(null);
  const detailConfig = {
    pendingReviews: { title: 'Reseñas en prioridad', reason: 'Están pendientes de moderación y necesitan una decisión.', items: reviews.filter(review => review.status === 'pending_moderation') },
    flaggedReviews: { title: 'Señales para atención', reason: 'El análisis automático detectó una señal que requiere una segunda escucha.', items: reviews.filter(review => review.aiFlagged === true) },
    totalReviews: { title: 'Reseñas de esta semana', reason: 'Son las voces que forman el archivo reciente de la comunidad.', items: reviews },
  };
  const selectedDetail = selectedMetric ? detailConfig[selectedMetric] : null;

  return (
    <div className="admin-workspace">
      <header className="admin-workspace__hero">
        <div><span className="eyebrow">CENTRO DE CONTROL · EN VIVO</span><h1>Tu mesa de <em>curaduría.</em></h1><p>Prioriza las conversaciones que necesitan criterio y deja que los números acompañen la decisión.</p></div>
        <div className="admin-workspace__actions"><button type="button" onClick={onRefresh} disabled={feedProps.busy}><RefreshCw size={15} className={feedProps.busy ? 'is-spinning' : ''} /> Actualizar</button><a href="#moderacion" className="primary-button">Abrir moderación <ArrowUpRight size={16} /></a></div>
      </header>

      {currentError && <div className="admin-workspace__error">Los datos pueden estar desactualizados: {typeof currentError === 'string' ? currentError : 'no se pudo cargar la información.'}</div>}

      <KpiCards metrics={metrics} busy={feedProps.busy} error={currentError} onSelect={setSelectedMetric} />
      <GrowthPanel users={users} busy={feedProps.busy} error={currentError} />

      {selectedDetail && <section className="dashboard-detail" aria-live="polite">
        <header><div><span className="eyebrow">DETALLE DE MÉTRICA</span><h2>{selectedDetail.title}</h2><p>{selectedDetail.reason}</p></div><button type="button" onClick={() => setSelectedMetric(null)}>Cerrar</button></header>
        {selectedDetail.items.length ? <div className="dashboard-detail__list">{selectedDetail.items.map(review => { const user = users.find(item => item.id === review.userId); return <article key={review.id}><div><strong>@{user?.username || `usuario-${review.userId}`}</strong><span>{review.aiFlagged ? 'Señal de IA' : review.status === 'pending_moderation' ? 'Pendiente' : 'Archivo reciente'}</span></div><p>“{review.content}”</p><small>Razón: {review.aiFlagged ? 'la IA marcó esta reseña para revisión humana.' : review.status === 'pending_moderation' ? 'aún no tiene una decisión editorial.' : 'forma parte del archivo de reseñas reciente.'}</small></article> })}</div> : <p className="dashboard-detail__empty">No hay mensajes en esta categoría.</p>}
      </section>}

      <div className="admin-workspace__grid">
        <div className="admin-workspace__main"><PriorityQueue reviews={reviews} users={users} busy={feedProps.busy} onAction={feedProps.onAction} /><ModerationRhythm metrics={metrics} reviews={reviews} /><ActivityChart events={adminEvents(users, reviews)} /></div>
        <aside className="admin-workspace__side"><RecentActivityFeed activities={adminEvents(users, reviews)} className="dashboard-recent-activity" /><section className="admin-tools"><span className="eyebrow">HERRAMIENTAS</span><h2>Atajos de trabajo</h2><button type="button" onClick={onExport} disabled={feedProps.busy || !!currentError}><Download size={16} /> Exportar archivo CSV <ArrowUpRight size={15} /></button><a href="#moderacion"><SlidersHorizontal size={16} /> Configurar filtros <ArrowUpRight size={15} /></a></section></aside>
      </div>
      <UsersPage reviews={reviews} users={users} onUserUpdate={feedProps.onUserUpdate} compact />
      <section className="admin-workspace__archive" aria-labelledby="archive-title"><div><span className="eyebrow">ARCHIVO EDITORIAL</span><h2 id="archive-title">Reseñas y filtros</h2><p>Explora el historial completo sin salir de la consola.</p></div><ModerationTable {...feedProps} error={currentError} reviews={reviews} users={users} compact /></section>
    </div>
  );
}

export default AdminDashboardPage;
