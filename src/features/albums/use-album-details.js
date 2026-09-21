import { useState, useEffect } from 'react';
import { getAlbumDetails } from '../../shared/services/deezer-service';

export const useAlbumDetails = (albumId) => {
  const [album, setAlbum] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!albumId) return;

    setIsLoading(true);
    getAlbumDetails(albumId)
      .then((data) => {
        if (isMounted) setAlbum(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Error al cargar detalles del álbum');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [albumId]);

  return { album, isLoading, error };
};

export default useAlbumDetails;
