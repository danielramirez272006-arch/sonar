import { useUIText } from '../../../../shared/i18n/use-ui-text.js';
import { useTranslation } from '../../../../shared/context/language-context.jsx';

const primaryCards = [
  ['pendingReviews', 'admin.kpi.pendingTitle', 'admin.kpi.pendingDescription', 'admin.kpi.pendingTag'],
  ['flaggedReviews', 'admin.kpi.flaggedTitle', 'admin.kpi.flaggedDescription', 'admin.kpi.flaggedTag'],
  ['totalReviews', 'admin.kpi.archiveTitle', 'admin.kpi.archiveDescription', 'admin.kpi.archiveTag'],
];

export function KpiCards({ metrics, busy, error, onSelect }) {
  const ui = useUIText();
  const { t } = useTranslation();
  return (
    <section className="dashboard-metrics" aria-label={ui("Resumen operativo")} aria-busy={busy}>
      <div className="dashboard-metrics__primary">
        {primaryCards.map(([key, titleKey, descriptionKey, tagKey], index) => (
          <button className={`dashboard-metric dashboard-metric--${key}`} key={key} style={{ '--enter-delay': `${index * 90}ms` }} onClick={() => onSelect?.(key)} type="button" aria-label={t('admin.kpi.aria', { tag: t(tagKey) })}>
            <div className="dashboard-metric__top"><span>{t(tagKey)}</span><i aria-hidden="true" /></div>
            <strong>{error ? '—' : busy ? '…' : metrics[key]?.toLocaleString('es') ?? '0'}</strong>
            <div><h2>{t(titleKey)}</h2><p>{t(descriptionKey)}</p></div>
          </button>
        ))}
      </div>
      <div className="dashboard-metrics__secondary" aria-label={ui("Métricas secundarias")}>
        <a href="#usuarios"><b>{error ? '—' : busy ? '…' : metrics?.newUsers ?? 0}</b> {ui("nuevos usuarios / 7 días")}</a>
        <a href="#admin-reports"><b>{error ? '—' : busy ? '…' : metrics?.pendingReports ?? 0}</b> {ui("reportes pendientes")}</a>
        <a href="#usuarios"><b>{error ? '—' : busy ? '…' : metrics?.sanctionedUsers ?? 0}</b> {ui("usuarios sancionados")}</a>
        <span><b>{error ? '—' : metrics?.totalUsers ?? 0}</b> {t('admin.kpi.members')}</span>
        <span><b>{error ? '—' : metrics?.approvedReviews ?? 0}</b> {t('admin.kpi.approved')}</span>
        <span><b>{error ? '—' : metrics?.rejectedReviews ?? 0}</b> {t('admin.kpi.rejected')}</span>
      </div>
    </section>
  );
}

export default KpiCards;
