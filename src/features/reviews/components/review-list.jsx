import React from 'react';
import ReviewCard from './review-card';
import useReviews from '../use-reviews';
import Loader from '../../../shared/components/ui/loader';

export const ReviewList = () => {
  const { reviews, isLoading, error } = useReviews();

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 rounded-xl bg-red-500/10 text-red-500 text-sm">{error}</div>;
  }

  if (!reviews || reviews.length === 0) {
    return <p className="text-sm text-[#5c435a] dark:text-[#B89CB0]">No hay reseñas publicadas aún.</p>;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {reviews.map((rev) => (
        <ReviewCard key={rev.id} review={rev} />
      ))}
    </div>
  );
};

export default ReviewList;
