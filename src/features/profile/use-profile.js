import { useState, useCallback } from 'react';
import { apiClient } from '../../shared/services/api-client';

export const useProfile = (userId) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get(`/users/${userId}`);
      setProfile(data);
    } catch (err) {
      setError(err.message || 'Error al cargar el perfil.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
  };
};

export default useProfile;
