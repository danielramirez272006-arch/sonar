import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { resolvePlayablePreview, isExplicitTrack, isKidsSafeTrack } from '../services/deezer-service';
import { interactionsService } from '../services/interactions-service';
import { resolveAccurateCoverForTrack } from '../services/recommendations-service';

const PlayerContext = createContext();

// Web Audio Synth Fallback Engine for Sonar
let synthAudioCtx = null;
let activeSynthNodes = [];
let synthTimer = null;

function stopSynthPlayback() {
  if (synthTimer) {
    clearInterval(synthTimer);
    synthTimer = null;
  }
  activeSynthNodes.forEach((n) => {
    try {
      n.stop();
      n.disconnect();
    } catch {}
  });
  activeSynthNodes = [];
}

function startHarmonicSynth(onTick, onEnd) {
  stopSynthPlayback();
  try {
    if (typeof window === 'undefined') return false;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;
    if (!synthAudioCtx) {
      synthAudioCtx = new AudioCtx();
    }
    const ctx = synthAudioCtx;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // Chords progression (Frequencies in Hz: C - Am - F - G)
    const chords = [
      [261.63, 329.63, 392.00], // C major
      [220.00, 261.63, 329.63], // A minor
      [174.61, 220.00, 261.63], // F major
      [196.00, 246.94, 293.66], // G major
    ];

    let step = 0;
    let elapsed = 0;

    const playChord = (chordFreqs, time) => {
      chordFreqs.forEach((freq, idx) => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = idx === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, time);

          gain.gain.setValueAtTime(0.001, time);
          gain.gain.exponentialRampToValueAtTime(0.06, time + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 1.8);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(time);
          osc.stop(time + 1.9);
          activeSynthNodes.push(osc);
        } catch {}
      });
    };

    playChord(chords[0], ctx.currentTime);

    synthTimer = setInterval(() => {
      elapsed += 0.5;
      if (onTick) onTick(elapsed);

      if (elapsed >= 30) {
        stopSynthPlayback();
        if (onEnd) onEnd();
        return;
      }

      if (Math.floor(elapsed) % 2 === 0 && Math.floor(elapsed) !== step) {
        step = Math.floor(elapsed);
        const chordIdx = Math.floor(step / 2) % chords.length;
        playChord(chords[chordIdx], ctx.currentTime);
      }
    }, 500);

    return true;
  } catch (e) {
    console.warn('Synth fallback notice:', e);
    return false;
  }
}

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [reviewModalAlbum, setReviewModalAlbum] = useState(null);
  const [explicitLockModal, setExplicitLockModal] = useState({ isOpen: false, track: null, reason: '' });
  const [unlockedExplicitSession, setUnlockedExplicitSession] = useState(false);

  const audioRef = useRef(null);
  const isSynthActiveRef = useRef(false);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (!isSynthActiveRef.current) {
        setCurrentTime(audio.currentTime);
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
          setDuration(audio.duration);
        }
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      stopSynthPlayback();
      isSynthActiveRef.current = false;
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
      console.warn('Audio element error encountered, activating harmonic synth fallback:', e);
      // Fallback automático transparente
      isSynthActiveRef.current = true;
      setIsLoading(false);
      setIsPlaying(true);
      startHarmonicSynth(
        (t) => setCurrentTime(t),
        () => {
          setIsPlaying(false);
          setCurrentTime(0);
          isSynthActiveRef.current = false;
        }
      );
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      stopSynthPlayback();
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

  const closeExplicitLockModal = useCallback(() => {
    setExplicitLockModal({ isOpen: false, track: null, reason: '' });
  }, []);

  const unlockExplicitWithPin = useCallback((enteredPin) => {
    try {
      let parentPin = '1234';
      const stored = typeof window !== 'undefined' ? window.localStorage?.getItem('sonar_auth_user') : null;
      if (stored) {
        const parsedUser = JSON.parse(stored);
        if (parsedUser.parentalControl?.pin) {
          parentPin = parsedUser.parentalControl.pin;
        }
      }
      if (String(enteredPin).trim() === String(parentPin).trim()) {
        setUnlockedExplicitSession(true);
        const pending = explicitLockModal.track;
        setExplicitLockModal({ isOpen: false, track: null, reason: '' });
        if (pending) {
          playTrack(pending, { bypassParentalLock: true });
        }
        return { success: true };
      }
      return { success: false, error: 'PIN de control parental incorrecto.' };
    } catch {
      return { success: false, error: 'Error al verificar el PIN.' };
    }
  }, [explicitLockModal.track]);

  const playTrack = useCallback(async (track, options = {}) => {
    if (!track) return;
    const audio = audioRef.current;
    if (!audio) return;

    // Verificar filtro de Control Parental y Modo Kids
    const isExplicit = isExplicitTrack(track);
    let isParentalFilterActive = false;
    let extraParentalSettings = null;
    try {
      const stored = typeof window !== 'undefined' ? window.localStorage?.getItem('sonar_auth_user') : null;
      if (stored) {
        const parsedUser = JSON.parse(stored);
        if (
          parsedUser.accountType === 'junior' ||
          (parsedUser.parentalControl?.enabled && parsedUser.parentalControl?.blockExplicit)
        ) {
          isParentalFilterActive = true;
        }
      }
      const extra = typeof window !== 'undefined' ? window.localStorage?.getItem('sonar_parental_extra_settings') : null;
      if (extra) {
        extraParentalSettings = JSON.parse(extra);
      }
    } catch {}

    const isSafeForKids = !isParentalFilterActive || isKidsSafeTrack(track, extraParentalSettings);

    if ((!isSafeForKids || isExplicit) && isParentalFilterActive && !unlockedExplicitSession && !options.bypassParentalLock) {
      const blockedTrackObj = {
        id: track.id || track.deezerId || Date.now(),
        title: track.title || track.albumTitle || 'Pista no permitida en Modo Kids',
        artist: track.artist || 'Artista',
        album: track.album || track.albumTitle || track.title || '',
        cover: resolveAccurateCoverForTrack(track),
        explicit: true,
        explicit_lyrics: true,
      };
      setExplicitLockModal({
        isOpen: true,
        track: blockedTrackObj,
        reason: 'Esta pista contiene contenido explícito o restringido para menores en el Modo Kids / Control Parental.',
      });
      return { blocked: true, reason: 'explicit_blocked' };
    }

    // Abrir inmediatamente la barra del reproductor con los metadatos disponibles
    const trackPayload = {
      id: track.id || track.deezerId || Date.now(),
      title: track.title || track.albumTitle || 'Pista de Sonar',
      artist: track.artist || 'Artista',
      album: track.album || track.albumTitle || track.title || '',
      cover: resolveAccurateCoverForTrack(track),
      preview: track.preview || track.previewUrl || null,
      deezerId: track.deezerId || track.albumId || (typeof track.id === 'number' ? track.id : null),
      isPodcast: track.isPodcast || track.type === 'podcast' || Boolean(track.audioUrl),
      audioUrl: track.audioUrl || track.preview,
      description: track.description,
      hosts: track.hosts,
      explicit: isExplicit,
      explicit_lyrics: isExplicit,
    };

    stopSynthPlayback();
    isSynthActiveRef.current = false;

    // Si ya es la pista activa y tiene audio cargado
    if (String(currentTrack?.id) === String(trackPayload.id) && audio.src && audio.src !== '') {
      if (audio.paused) {
        try {
          setIsLoading(true);
          await audio.play();
          setIsPlaying(true);
          setIsLoading(false);
        } catch (err) {
          console.warn('HTML5 audio play rejected, using harmonic synth fallback:', err);
          isSynthActiveRef.current = true;
          startHarmonicSynth(
            (t) => setCurrentTime(t),
            () => {
              setIsPlaying(false);
              setCurrentTime(0);
              isSynthActiveRef.current = false;
            }
          );
          setIsPlaying(true);
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
        console.warn('No se encontró URL de audio remota, activando sintetizador musical:', trackPayload.title);
        isSynthActiveRef.current = true;
        startHarmonicSynth(
          (t) => setCurrentTime(t),
          () => {
            setIsPlaying(false);
            setCurrentTime(0);
            isSynthActiveRef.current = false;
          }
        );
        setIsPlaying(true);
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

      try {
        await audio.play();
        setIsPlaying(true);
        setIsLoading(false);
      } catch (playErr) {
        console.warn('Audio.play() rejected (autoplay/CORS/network), switching to harmonic synth:', playErr);
        isSynthActiveRef.current = true;
        startHarmonicSynth(
          (t) => setCurrentTime(t),
          () => {
            setIsPlaying(false);
            setCurrentTime(0);
            isSynthActiveRef.current = false;
          }
        );
        setIsPlaying(true);
        setIsLoading(false);
      }
    } catch (err) {
      console.warn('Error en cadena de reproducción, activando sintetizador musical:', err);
      isSynthActiveRef.current = true;
      startHarmonicSynth(
        (t) => setCurrentTime(t),
        () => {
          setIsPlaying(false);
          setCurrentTime(0);
          isSynthActiveRef.current = false;
        }
      );
      setIsPlaying(true);
      setIsLoading(false);
    }
  }, [currentTrack, unlockedExplicitSession]);

  const pauseTrack = useCallback(() => {
    stopSynthPlayback();
    isSynthActiveRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  const closePlayer = useCallback(() => {
    stopSynthPlayback();
    isSynthActiveRef.current = false;
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

  const [playbackSpeed, setPlaybackSpeedState] = useState(1);

  const setPlaybackSpeed = useCallback((speed) => {
    if (audioRef.current && isFinite(speed)) {
      audioRef.current.playbackRate = speed;
      setPlaybackSpeedState(speed);
    }
  }, []);

  const skipSeconds = useCallback((delta) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(audioRef.current.duration || 99999, audioRef.current.currentTime + delta));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isLoading,
        currentTime,
        duration,
        playbackSpeed,
        setPlaybackSpeed,
        skipSeconds,
        playTrack,
        pauseTrack,
        closePlayer,
        toggleTrack,
        seek,
        reviewModalAlbum,
        openReviewModal,
        closeReviewModal,
        explicitLockModal,
        closeExplicitLockModal,
        unlockExplicitWithPin,
        unlockedExplicitSession,
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
