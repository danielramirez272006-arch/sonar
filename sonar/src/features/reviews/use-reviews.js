import { useState, useEffect, useCallback } from 'react';
import { getReviews, createReview } from '../../shared/services/api-client';

export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getReviews();
      setReviews(data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar reseñas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addReview = async (newReview) => {
    try {
      const created = await createReview(newReview);
      setReviews((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      setError(err.message || 'Error al publicar reseña');
      throw err;
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, isLoading, error, fetchReviews, addReview };
};

export default useReviews;
