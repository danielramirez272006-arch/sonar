import { useUIText } from '../../../../shared/i18n/use-ui-text.js';
import { useState } from 'react'
import { useTranslation } from '../../../../shared/context/language-context.jsx'
import { ReviewAlbum } from './review-album.jsx'

export function ModerationTable({ reviews, users, query, busy, onAction, analyses, compact = false, error, initialFilter = 'all', userFilterId = null }) {
  const ui = useUIText();
  const { t } = useTranslation()
  const [filter, setFilter] = useState(initialFilter)
  const [rejectId, setRejectId] = useState(null)
  const statuses = { pending_moderation: t('admin.reviews.pending'), approved: t('admin.reviews.approved'), rejected: t('admin.reviews.rejected') }
  const options = compact ? [['all', t('admin.reviews.all')], ['pending_moderation', t('admin.reviews.pending')], ['approved', t('admin.reviews.approved')], ['rejected', t('admin.reviews.rejected')], ['flagged', t('admin.reviews.flagged')]] : [['all', t('admin.reviews.all')], ['flagged', t('admin.reviews.flaggedByAI')]]
  const visible = reviews.filter(review => {
    if (userFilterId !== null && String(review.userId) !== String(userFilterId)) return false
    const user = users.find(item => String(item.id) === String(review.userId))
    return (filter === 'all' || (filter === 'flagged' ? review.aiFlagged : review.status === filter)) && `${user?.username ?? ''} ${review.userId} ${review.albumId} ${review.content}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
  })
  return (
    <section className="review-feed" aria-label={compact ? ui("Reseñas registradas") : ui("Cola de moderación")} aria-busy={busy}>
      {userFilterId !== null && <p className="users-review-filter">{t('admin.reviews.userReviews', { username: users.find(user => String(user.id) === String(userFilterId))?.username || `Usuario ${userFilterId}` })} · <a href="#admin-reviews">{t('admin.reviews.removeUserFilter')}</a> · <a href="#usuarios">{t('admin.reviews.backToUsers')}</a></p>}
      <div className="feed-heading flex items-center justify-between gap-3 mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-sonar-text">
          {compact ? t('admin.reviews.communityVoices') : t('admin.reviews.queueTitle')}
        </h2>
        <span className="eyebrow text-xs font-semibold text-gray-500 dark:text-sonar-text/70">
          {t('admin.reviews.count', { count: visible.length })}
        </span>
      </div>
      <div className="filter-tabs flex flex-wrap gap-2 pb-4 mb-5 border-b border-gray-200 dark:border-sonar-surface" aria-label={t('admin.reviews.filterLabel')}>
        {options.map(([value, label]) => {
          const isSelected = filter === value
          return (
            <button
              key={value}
              aria-pressed={isSelected}
              onClick={() => setFilter(value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#4B2840] text-white dark:bg-sonar-surface dark:text-sonar-text border border-[#B80C09]/50 shadow-xs'
                  : 'bg-transparent text-gray-600 dark:text-sonar-text/70 hover:bg-gray-100 dark:hover:bg-sonar-surface/60'
              }`}
            >
              {label}
              {value === 'all' && (
                <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-sonar-base text-gray-800 dark:text-sonar-text">
                  {reviews.filter(review => userFilterId === null || String(review.userId) === String(userFilterId)).length}
                </span>
              )}
            </button>
          )
        })}
      </div>
      {visible.length === 0 && (
        <div className="empty-state p-12 text-center rounded-xl border border-dashed border-gray-300 dark:border-sonar-surface bg-white dark:bg-sonar-surface text-gray-700 dark:text-sonar-text">
          <span aria-hidden="true" className="text-3xl block mb-3 text-[#B80C09] dark:text-[#ff4d4a]">◎</span>
          <h3 className="text-lg font-serif dark:text-sonar-text">
            {busy ? t('admin.reviews.emptyLoading') : error ? t('admin.reviews.emptyError') : query || filter !== 'all' ? t('admin.reviews.emptyMatch') : t('admin.reviews.emptyReady')}
          </h3>
          <p className="text-xs text-gray-500 dark:text-sonar-text/70 mt-2 max-w-sm mx-auto">
            {busy ? t('admin.reviews.loading') : error ? t('admin.reviews.retry') : query || filter !== 'all' ? t('admin.reviews.tryFilter') : t('admin.reviews.nonePending')}
          </p>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {visible.map((review, index) => {
          const user = users.find(item => String(item.id) === String(review.userId))
          const name = user?.username || `Usuario ${review.userId}`
          const analysis = analyses[review.id]
          const isEven = index % 2 === 0
          return (
            <article
              className={`review-card rounded-xl p-6 border transition-colors duration-200 ${
                isEven
                  ? 'bg-white dark:bg-[#4B2840] border-gray-200 dark:border-white/10'
                  : 'bg-gray-50/50 dark:bg-[#4B2840] border-gray-200 dark:border-white/10'
              }`}
              key={review.id}
            >
              <div className="review-meta flex items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-white/10">
                <div className="review-author flex items-center gap-3">
                  <span className="avatar w-9 h-9 rounded-full bg-gray-200 dark:bg-[#231123] text-gray-800 dark:text-[#DCDCDD] flex items-center justify-center font-serif text-sm font-bold border border-gray-300 dark:border-white/15">
                    {name.slice(0, 1).toUpperCase()}
                  </span>
                  <div>
                    <strong className="text-sm font-bold text-gray-900 dark:text-[#DCDCDD] block">
                      {name}
                    </strong>
                    <small className="text-[11px] text-gray-500 dark:text-[#DCDCDD]/70 block">
                      {t('admin.users.eyebrow')} <span className="text-gray-400 dark:text-[#DCDCDD]/50">· {t('admin.reviews.reviewLabel')} #{review.id}</span>
                    </small>
                  </div>
                </div>
                <span
                  className={`badge px-2.5 py-1 rounded-full text-xs font-bold ${
                    review.aiFlagged
                      ? 'bg-red-50 dark:bg-[#B80C09]/20 text-[#B80C09] dark:text-[#ff4d4a] border border-red-200 dark:border-[#B80C09]/40'
                      : review.status === 'approved'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50'
                      : 'bg-gray-100 dark:bg-[#231123] text-gray-700 dark:text-[#DCDCDD] border border-gray-200 dark:border-white/15'
                  }`}
                >
                  {review.aiFlagged ? `✧ ${t('admin.reviews.flaggedByAI')}` : statuses[review.status] || review.status}
                </span>
              </div>
              <ReviewAlbum review={review} />
              {!compact && (
                <div
                  className={`analysis-box p-4 rounded-xl flex gap-3 mb-4 ${
                    review.aiFlagged
                      ? 'bg-red-50/60 dark:bg-[#B80C09]/15 border border-red-200 dark:border-[#B80C09]/30 text-red-950 dark:text-[#DCDCDD]'
                      : 'bg-gray-50 dark:bg-[#231123] border border-gray-200 dark:border-white/10 text-gray-800 dark:text-[#DCDCDD]'
                  }`}
                >
                  <span aria-hidden="true" className="text-lg text-[#B80C09] dark:text-[#ff4d4a]">✧</span>
                  <div>
                    <strong className="text-xs tracking-wider uppercase block text-gray-900 dark:text-[#DCDCDD]">
                      {t('admin.reviews.analysisTitle')} <span className="text-[10px] text-gray-500 dark:text-[#DCDCDD]/60 ml-2 pl-2 border-l border-gray-300 dark:border-white/15">{t('admin.reviews.mock')}</span>
                    </strong>
                    <p className="text-xs text-gray-600 dark:text-[#DCDCDD]/80 mt-1 leading-relaxed">
                      {analysis
                        ? analysis.reason || t('admin.reviews.analysisClear')
                        : review.aiFlagged
                        ? t('admin.reviews.analysisFlagged')
                        : t('admin.reviews.analysisSecondLook')}
                    </p>
                  </div>
                </div>
              )}
              {review.status === 'pending_moderation' && (
                <div className="review-actions flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                  {rejectId === review.id ? (
                    <>
                      <span className="text-xs font-semibold text-red-600 dark:text-[#ff4d4a]">{t('admin.reviews.confirmReject')}</span>
                      <button
                        className="px-3 py-1.5 rounded-lg bg-[#B80C09] hover:bg-[#9c0a07] text-white font-semibold text-xs transition-colors cursor-pointer border-transparent"
                        disabled={busy}
                        onClick={async () => {
                          if (await onAction('reject', review)) setRejectId(null)
                        }}
                      >
                        {t('admin.reviews.confirm')}
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#231123] hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-[#DCDCDD] font-semibold text-xs transition-colors cursor-pointer border border-gray-200 dark:border-white/15"
                        disabled={busy}
                        onClick={() => setRejectId(null)}
                      >
                        {t('admin.reviews.cancel')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="px-3.5 py-2 rounded-lg bg-[#B80C09] hover:bg-[#9c0a07] text-white font-semibold text-xs transition-colors cursor-pointer border border-transparent shadow-xs"
                        disabled={busy}
                        onClick={() => onAction('approve', review)}
                      >
                        ✓ {t('admin.reviews.approve')}
                      </button>
                      <button
                        className="px-3.5 py-2 rounded-lg bg-gray-100 dark:bg-[#231123] hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-[#DCDCDD] font-semibold text-xs transition-colors cursor-pointer border border-gray-200 dark:border-white/15"
                        disabled={busy}
                        onClick={() => setRejectId(review.id)}
                      >
                        {t('admin.reviews.reject')}
                      </button>
                      <button
                        className="px-3.5 py-2 rounded-lg bg-transparent hover:bg-[#B80C09]/10 dark:hover:bg-white/5 text-[#B80C09] dark:text-[#ff4d4a] font-semibold text-xs transition-colors cursor-pointer border border-gray-200 dark:border-white/15 ml-auto"
                        disabled={busy}
                        onClick={() => onAction('analyze', review)}
                      >
                        ✧ {t('admin.reviews.reviewAI')}
                      </button>
                    </>
                  )}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
