import { CommunityOpinions } from '../../features/admin/moderation/components/community-opinions.jsx'
import { ModerationTable } from '../../features/admin/moderation/components/moderation-table.jsx'
import { EditorialGuide } from '../../features/admin/dashboard/components/editorial-guide.jsx'
import { useTranslation } from '../../shared/context/language-context.jsx'

export function ModerationPage({ onRefresh, allReviews, ...props }) {
  const { t } = useTranslation()
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow text-gray-500 dark:text-[#DCDCDD]/70 font-bold text-xs tracking-wider">{t('admin.moderation.eyebrow')}</span>
          <h1 className="text-gray-900 dark:text-[#DCDCDD] font-bold">{t('admin.moderation.titleFull')}</h1>
          <p className="text-gray-600 dark:text-[#DCDCDD]/70 text-xs mt-1">
            <i className="status-dot" /> {props.error ? t('admin.moderation.unavailable') : t('admin.moderation.reviews', { count: props.reviews.length })} <span className="heading-separator">/</span> {t('admin.moderation.humanLastWord')}
          </p>
        </div>
        <button className="primary-button bg-[#B80C09] hover:bg-[#9c0a07] text-white border-transparent cursor-pointer font-bold px-4 py-2.5 rounded-lg transition-colors" onClick={onRefresh} disabled={props.busy}>
          ↻ {props.busy ? t('admin.sanctions.saving') : t('admin.moderation.refreshQueue')}
        </button>
      </div>

      <div className="moderation-intro p-5 rounded-xl border border-gray-200 dark:border-white/10 bg-[#f1e9f0] dark:bg-[#4B2840] flex items-center gap-4 mb-8">
        <span aria-hidden="true" className="text-[#B80C09] dark:text-[#ff4d4a] text-2xl font-bold">◎</span>
        <div>
          <strong className="text-gray-900 dark:text-[#DCDCDD] text-sm font-bold block mb-0.5">{t('admin.moderation.care')}</strong>
          <p className="text-gray-600 dark:text-[#DCDCDD]/80 text-xs">{t('admin.moderation.intro')}</p>
        </div>
        <span className="eyebrow text-gray-500 dark:text-[#DCDCDD]/70 ml-auto whitespace-nowrap text-[10px] tracking-wider font-bold">{t('admin.dashboard.archive')}</span>
      </div>

      <div className="workspace-grid">
        <div className="moderation-main"><ModerationTable {...props} /><CommunityOpinions reviews={allReviews ?? props.reviews} users={props.users} busy={props.busy} error={props.error} /></div>
        <aside className="side-stack">
          {/* Tarjeta Motor IA Sonar */}
          <div className="p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-md bg-white dark:bg-[#4B2840] text-gray-900 dark:text-[#DCDCDD]">
            <div className="panel-heading flex items-center justify-between gap-2 mb-4">
              <span className="eyebrow text-xs font-bold tracking-wider text-gray-500 dark:text-[#DCDCDD]/80">✧ {t('admin.moderation.sonarEngine')}</span>
              <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider rounded-md border border-gray-300 dark:border-white/15 bg-gray-100 dark:bg-[#231123] text-gray-700 dark:text-[#DCDCDD]">
                MOCK
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-[#DCDCDD] leading-tight mb-2">
              {t('admin.moderation.secondLook')}
            </h2>
            <p className="text-xs text-gray-600 dark:text-[#DCDCDD]/80 mb-4 leading-relaxed">
              {t('admin.moderation.aiHelp')}
            </p>
            <div className="signal-bars flex items-center justify-between h-14 my-4 gap-1" aria-hidden="true">
              {Array.from({ length: 24 }, (_, index) => (
                <i key={index} className="w-1 rounded-sm bg-[#B80C09] opacity-75" />
              ))}
            </div>
            <div className="engine-facts pt-4 border-t border-gray-200 dark:border-white/10 flex justify-between text-xs">
              <span className="text-gray-500 dark:text-[#DCDCDD]/70">
                {t('admin.moderation.analysis')}<strong className="block text-gray-900 dark:text-[#DCDCDD] font-bold text-sm">{t('admin.moderation.local')}</strong>
              </span>
              <span className="text-gray-500 dark:text-[#DCDCDD]/70">
                {t('admin.moderation.finalDecision')}<strong className="block text-gray-900 dark:text-[#DCDCDD] font-bold text-sm">{t('admin.moderation.human')}</strong>
              </span>
            </div>
          </div>
          <EditorialGuide />
          <div className="side-note p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#4B2840] flex items-center gap-3 text-gray-600 dark:text-[#DCDCDD]/80">
            <span className="text-[#B80C09] dark:text-[#ff4d4a] text-lg font-bold">ⓘ</span>
            <p className="text-xs leading-relaxed m-0">{t('admin.moderation.note')}</p>
          </div>
        </aside>
      </div>

      <div className="listening-bar p-5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#4B2840] flex items-center gap-4 mt-8 text-gray-900 dark:text-[#DCDCDD]">
        <span className="mini-record" aria-hidden="true" />
        <div>
          <span className="eyebrow text-[#B80C09] dark:text-[#ff4d4a] text-[10px] tracking-wider font-bold block mb-0.5">{t('admin.moderation.listen')}</span>
          <strong className="text-gray-900 dark:text-[#DCDCDD] text-sm font-bold">{t('admin.moderation.musicFirst')}</strong>
        </div>
        <span className="text-xs text-gray-500 dark:text-[#DCDCDD]/70 ml-auto">{t('admin.moderation.preview')}</span>
      </div>
    </>
  )
}

export default ModerationPage
