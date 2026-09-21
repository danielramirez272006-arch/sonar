import React from 'react';
import StarRating from '../../../shared/components/ui/star-rating';
import Avatar from '../../../shared/components/ui/avatar';

export const ReviewCard = ({ review = {} }) => {
  return (
    <article className="p-6 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar username={review.username || `User ${review.userId || ''}`} size="md" />
          <div>
            <h4 className="font-bold text-sm text-[#231123] dark:text-white">
              {review.username || `Usuario #${review.userId}`}
            </h4>
            <span className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
              {review.albumId ? `Álbum: ${review.albumId}` : 'Reseña de la comunidad'}
            </span>
          </div>
        </div>
        <StarRating rating={review.rating || 5} readonly />
      </div>
      <p className="text-sm text-[#231123]/90 dark:text-gray-200 leading-relaxed italic">
        “{review.content || review.text}”
      </p>
    </article>
  );
};

export default ReviewCard;
