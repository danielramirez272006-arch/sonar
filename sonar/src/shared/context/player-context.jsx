import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { resolvePlayablePreview } from '../services/deezer-service';
import { interactionsService } from '../services/interactions-service';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [reviewModalAlbum, setReviewModalAlbum] = useState(null);

  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = (e) => {
      console.warn('Audio playback error encountered:', e);
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const playTrack = useCallback(async (track) => {
    if (!track) return;
    const audio = audioRef.current;
    if (!audio) return;

    // Abrir inmediatamente la barra del reproductor con los metadatos disponibles
    const trackPayload = {
      id: track.id || track.deezerId || Date.now(),
      title: track.title || track.albumTitle || 'Pista de Sonar',
      artist: track.artist || 'Artista',
      album: track.album || track.albumTitle || track.title || '',
      cover: track.cover || track.cover_medium || track.cover_xl || 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
      preview: track.preview || track.previewUrl || null,
      deezerId: track.deezerId || track.albumId || (typeof track.id === 'number' ? track.id : null),
    };

    // Si ya es la pista activa y tiene audio cargado
    if (currentTrack?.id === trackPayload.id && audio.src && audio.src !== '') {
      if (audio.paused) {
        try {
          setIsLoading(true);
          await audio.play();
          setIsPlaying(true);
          setIsLoading(false);
        } catch (err) {
          console.error('Error reanudando audio:', err);
          setIsLoading(false);
        }
      }
      return;
    }

    setCurrentTrack(trackPayload);
    setIsLoading(true);
    setCurrentTime(0);
    setDuration(30);

    try {
      // Resolver dinámicamente un preview de alta fidelidad firmado y funcional
      const validPreviewUrl = await resolvePlayablePreview({
        ...trackPayload,
        preview: track.preview || track.previewUrl,
      });

      if (!validPreviewUrl) {
        console.warn('No se pudo encontrar URL de audio para:', trackPayload.title);
        setIsLoading(false);
        return;
      }

      audio.pause();
      audio.src = validPreviewUrl;
      audio.currentTime = 0;

      setCurrentTrack((prev) => (prev ? { ...prev, preview: validPreviewUrl } : trackPayload));

      // Guardar en historial de escucha del usuario activo
      try {
        const storedUser = localStorage.getItem('sonar_auth_user');
        const activeUserId = storedUser ? JSON.parse(storedUser)?.id || 'guest_user' : 'guest_user';
        interactionsService.addRecentlyPlayed(activeUserId, trackPayload);
      } catch {}

      await audio.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Error al reproducir pista en Sonar Player:', err);
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [currentTrack]);

  const pauseTrack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const closePlayer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
    }
    setCurrentTrack(null);
    setIsPlaying(false);
    setIsLoading(false);
    setCurrentTime(0);
  }, []);

  const toggleTrack = useCallback((track) => {
    if (!track) return;
    const trackId = track.id || track.deezerId;
    if (currentTrack?.id === trackId) {
      if (isPlaying) {
        pauseTrack();
      } else {
        playTrack(track);
      }
    } else {
      playTrack(track);
    }
  }, [currentTrack, isPlaying, pauseTrack, playTrack]);

  const seek = useCallback((seconds) => {
    if (audioRef.current && isFinite(seconds)) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  }, []);

  const openReviewModal = useCallback((album) => {
    setReviewModalAlbum(
      album && typeof album === 'object' && Object.keys(album).length > 0
        ? album
        : {
            id: 14880659,
            deezerId: 14880659,
            title: 'In Rainbows',
            album: 'In Rainbows',
            artist: 'Radiohead',
            cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
            type: 'album',
          }
    );
  }, []);

  const closeReviewModal = useCallback(() => {
    setReviewModalAlbum(null);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isLoading,
        currentTime,
        duration,
        playTrack,
        pauseTrack,
        closePlayer,
        toggleTrack,
        seek,
        reviewModalAlbum,
        openReviewModal,
        closeReviewModal,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export default PlayerContext;
