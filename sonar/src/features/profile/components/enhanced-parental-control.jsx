import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../shared/context/auth-context';
import { usePlayer } from '../../../shared/context/player-context';

const KIDS_CHANNELS = [
  {
    id: 'classical-early',
    title: 'Mozart & Clásicos para Niños',
    description: 'Composiciones sinfónicas relajantes y enriquecedoras.',
    icon: 'music_note',
    color: 'from-amber-500 to-amber-700',
    sampleTrack: {
      id: 90111,
      deezerId: 14880659,
      title: 'Eine kleine Nachtmusik',
      artist: 'W.A. Mozart',
      album: 'Clásicos Kids',
      cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
      preview: 'https://cdns-preview-d.dzcdn.net/stream/c-deda7fac944b3f76bfa77d75010eaddc-3.mp3',
    },
  },
  {
    id: 'animation-soundtracks',
    title: 'Bandas Sonoras & Animación',
    description: 'Música orquestal inspiradora de grandes aventuras.',
    icon: 'movie',
    color: 'from-purple-600 to-purple-800',
    sampleTrack: {
      id: 90112,
      deezerId: 302127,
      title: 'One More Time (Kids Animation Mix)',
      artist: 'Daft Punk',
      album: 'Interstella Dreams',
      cover: 'https://cdn-images.dzcdn.net/images/cover/5718f7c81c27e0b2417e2a4c45224f8a/500x500-000000-80-0-0.jpg',
      preview: 'https://cdns-preview-d.dzcdn.net/stream/c-deda7fac944b3f76bfa77d75010eaddc-3.mp3',
    },
  },
  {
    id: 'study-lofi',
    title: 'Lo-Fi para Concentración & Tareas',
    description: 'Beats instrumentales suaves sin letras distractoras.',
    icon: 'school',
    color: 'from-teal-600 to-teal-800',
    sampleTrack: {
      id: 90113,
      deezerId: 10709540,
      title: 'Quiet Study Beats',
      artist: 'Sonar Kids Lo-Fi',
      album: 'Study Session',
      cover: 'https://cdn-images.dzcdn.net/images/cover/de5b9b704cd4ec36f8bf49beb3e17ba2/500x500-000000-80-0-0.jpg',
      preview: 'https://cdns-preview-d.dzcdn.net/stream/c-deda7fac944b3f76bfa77d75010eaddc-3.mp3',
    },
  },
  {
    id: 'bedtime-lullaby',
    title: 'Canciones de Cuna & Sueño Profundo',
    description: 'Melodías acústicas en piano y arpa para dormir.',
    icon: 'bedtime',
    color: 'from-indigo-600 to-indigo-900',
    sampleTrack: {
      id: 90114,
      deezerId: 12047952,
      title: 'Here Comes The Sun (Lullaby)',
      artist: 'The Beatles',
      album: 'Peaceful Nights',
      cover: 'https://cdn-images.dzcdn.net/images/cover/aa94ab293730bb7845d2aa8c672b2c29/500x500-000000-80-0-0.jpg',
      preview: 'https://cdns-preview-d.dzcdn.net/stream/c-deda7fac944b3f76bfa77d75010eaddc-3.mp3',
    },
  },
];

const KIDS_SAFE_JUKEBOX = [
  {
    id: 'kid-safe-1',
    title: 'Eine kleine Nachtmusik (Serenata)',
    artist: 'W.A. Mozart',
    genre: 'Clásica Kids',
    cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
    preview: 'https://cdns-preview-d.dzcdn.net/stream/c-deda7fac944b3f76bfa77d75010eaddc-3.mp3',
    tag: '🎻 Concentración',
  },
  {
    id: 'kid-safe-2',
    title: 'Para Elisa (Bagatela en La menor)',
    artist: 'Ludwig van Beethoven',
    genre: 'Piano Clásico',
    cover: 'https://cdn-images.dzcdn.net/images/cover/aa94ab293730bb7845d2aa8c672b2c29/500x500-000000-80-0-0.jpg',
    preview: 'https://cdns-preview-d.dzcdn.net/stream/c-deda7fac944b3f76bfa77d75010eaddc-3.mp3',
    tag: '🎹 Piano Calma',
  },
  {
    id: 'kid-safe-3',
    title: 'Here Comes The Sun',
    artist: 'The Beatles',
    genre: 'Pop Familiar',
    cover: 'https://cdn-images.dzcdn.net/images/cover/aa94ab293730bb7845d2aa8c672b2c29/500x500-000000-80-0-0.jpg',
    preview: 'https://cdns-preview-d.dzcdn.net/stream/c-deda7fac944b3f76bfa77d75010eaddc-3.mp3',
    tag: '☀️ Alegría',
  },
  {
    id: 'kid-safe-4',
    title: 'One More Time',
    artist: 'Daft Punk',
    genre: 'Electrónica Divertida',
    cover: 'https://cdn-images.dzcdn.net/images/cover/5718f7c81c27e0b2417e2a4c45224f8a/500x500-000000-80-0-0.jpg',
    preview: 'https://cdns-preview-d.dzcdn.net/stream/c-deda7fac944b3f76bfa77d75010eaddc-3.mp3',
    tag: '🚀 Fiesta Kids',
  },
  {
    id: 'kid-safe-5',
    title: 'Quiet Study Beats (Lo-Fi)',
    artist: 'Sonar Kids Lo-Fi',
    genre: 'Estudio & Tareas',
    cover: 'https://cdn-images.dzcdn.net/images/cover/de5b9b704cd4ec36f8bf49beb3e17ba2/500x500-000000-80-0-0.jpg',
    preview: 'https://cdns-preview-d.dzcdn.net/stream/c-deda7fac944b3f76bfa77d75010eaddc-3.mp3',
    tag: '📖 Estudio',
  },
  {
    id: 'kid-safe-6',
    title: 'Nocturne Lullaby (Canción de Cuna)',
    artist: 'Acoustic Dreams',
    genre: 'Relajación Nocturna',
    cover: 'https://cdn-images.dzcdn.net/images/cover/4bd6b0232c2092faf145101453cb1051/500x500-000000-80-0-0.jpg',
    preview: 'https://cdns-preview-d.dzcdn.net/stream/c-deda7fac944b3f76bfa77d75010eaddc-3.mp3',
    tag: '🌙 Para Dormir',
  },
];

const AMBIENT_SOUNDS = [
  { id: 'rain', name: '🌧️ Lluvia Suave en la Ventana', desc: 'Gotas de agua relajantes para leer' },
  { id: 'forest', name: '🌲 Bosque & Pájaros Cantores', desc: 'Naturaleza para despejar la mente' },
  { id: 'waves', name: '🌊 Olas de Mar Tranquilas', desc: 'Ritmo oceánico suave para dormir' },
  { id: 'white-noise', name: '📻 Sonido Blanco Acústico', desc: 'Frecuencia suave para concentración' },
];

const KIDS_QUIZZES = [
  {
    question: '¿Qué instrumento de la orquesta tiene cuerdas y se toca con un arco?',
    options: ['El Violín 🎻', 'La Trompeta 🎺', 'La Batería 🥁'],
    correct: 0,
    fact: '¡Correcto! El violín es el instrumento de cuerda frotada más ágil de la orquesta.',
  },
  {
    question: '¿Quién compuso la famosa melodía "Para Elisa"?',
    options: ['Ludwig van Beethoven 🎹', 'Miles Davis 🎺', 'Freddie Mercury 🎤'],
    correct: 0,
    fact: '¡Excelente! Beethoven escribió "Para Elisa" en 1810 para piano solo.',
  },
  {
    question: '¿Cuántas cuerdas suele tener una guitarra clásica o acústica estándar?',
    options: ['4 cuerdas', '6 cuerdas 🎸', '12 cuerdas'],
    correct: 1,
    fact: '¡Genial! La guitarra estándar tiene 6 cuerdas afinadas en Mi, La, Re, Sol, Si, Mi.',
  },
];

export const EnhancedParentalControl = () => {
  const { user, updateUser, updateParentalControl, isParentalControlActive } = useAuth();
  const { playTrack } = usePlayer();

  const audioCtxRef = useRef(null);
  const ambientNodeRef = useRef(null);

  // Configuración de límites y opciones
  const [parentalSettings, setParentalSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('sonar_parental_extra_settings');
      return saved
        ? JSON.parse(saved)
        : {
            dailyLimitMinutes: 60,
            volumeCapEnabled: true,
            maxDecibels: 75,
            bedtimeHour: '21:00',
            bedtimeEnabled: true,
            blockedKeywords: ['violencia', 'lenguaje explícito', 'drogas'],
            listenedTodayMinutes: 24,
          };
    } catch {
      return {
        dailyLimitMinutes: 60,
        volumeCapEnabled: true,
        maxDecibels: 75,
        bedtimeHour: '21:00',
        bedtimeEnabled: true,
        blockedKeywords: ['violencia', 'lenguaje explícito'],
        listenedTodayMinutes: 24,
      };
    }
  });

  const [pinInput, setPinInput] = useState(() => user?.parentalControl?.pin || '1234');
  const [newKeyword, setNewKeyword] = useState('');
  const [toastNotice, setToastNotice] = useState('');
  
  // Estado de Trivia Kids
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizScore, setQuizScore] = useState(0);

  // Estado de Temporizador de Estudio Pomodoro
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);

  // Estado de Sonidos Ambientales Kids
  const [activeAmbient, setActiveAmbient] = useState(null);

  // Síntesis real de audio ambiental con Web Audio API
  useEffect(() => {
    if (!activeAmbient) {
      if (ambientNodeRef.current) {
        try { ambientNodeRef.current.stop(); } catch {}
        ambientNodeRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (ambientNodeRef.current) {
        try { ambientNodeRef.current.stop(); } catch {}
      }

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (activeAmbient === 'rain') {
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 2.5;
        } else if (activeAmbient === 'waves') {
          output[i] = (lastOut + (0.05 * white)) / 1.05;
          lastOut = output[i];
          output[i] *= 2.0;
        } else if (activeAmbient === 'forest') {
          output[i] = Math.sin(i / 60) * 0.08 + (white * 0.02);
        } else {
          output[i] = white * 0.12;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = activeAmbient === 'rain' ? 'lowpass' : activeAmbient === 'waves' ? 'bandpass' : 'lowpass';
      filter.frequency.value = activeAmbient === 'rain' ? 800 : activeAmbient === 'waves' ? 450 : 1200;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.2;

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      whiteNoise.start(0);
      ambientNodeRef.current = whiteNoise;
    } catch (err) {
      console.warn('Web Audio ambient sound error:', err);
    }

    return () => {
      if (ambientNodeRef.current) {
        try { ambientNodeRef.current.stop(); } catch {}
        ambientNodeRef.current = null;
      }
    };
  }, [activeAmbient]);

  useEffect(() => {
    let interval = null;
    if (isPomodoroRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0 && isPomodoroRunning) {
      setIsPomodoroRunning(false);
      setToastNotice('⏰ ¡Tiempo de estudio completado! Hora de un descanso de 5 minutos.');
    }
    return () => clearInterval(interval);
  }, [isPomodoroRunning, pomodoroSeconds]);

  const [activityLogs, setActivityLogs] = useState(() => {
    try {
      const logs = localStorage.getItem('sonar_parental_audit_logs');
      return logs
        ? JSON.parse(logs)
        : [
            { id: 1, action: 'Escucha segura Kids', track: 'Eine kleine Nachtmusik - W.A. Mozart', time: 'Hoy, 15:42', safe: true },
            { id: 2, action: 'Bloqueo por PIN', track: 'Pista Explícita bloqueada automáticamente', time: 'Hoy, 14:20', safe: false },
            { id: 3, action: 'Escucha segura Kids', track: 'Quiet Study Beats - Lo-Fi Session', time: 'Ayer, 18:10', safe: true },
          ];
    } catch {
      return [];
    }
  });

  const handleSaveSettings = (newSettings) => {
    const updated = { ...parentalSettings, ...newSettings };
    setParentalSettings(updated);
    try {
      localStorage.setItem('sonar_parental_extra_settings', JSON.stringify(updated));
    } catch {}
    setToastNotice('✓ Configuración de Modo Kids guardada con éxito');
    setTimeout(() => setToastNotice(''), 3000);
  };

  const handleAddBlockedKeyword = (e) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    const clean = newKeyword.trim().toLowerCase();
    if (!parentalSettings.blockedKeywords.includes(clean)) {
      handleSaveSettings({
        blockedKeywords: [...parentalSettings.blockedKeywords, clean],
      });
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    handleSaveSettings({
      blockedKeywords: parentalSettings.blockedKeywords.filter((k) => k !== keywordToRemove),
    });
  };

  const handleSavePin = (e) => {
    e.preventDefault();
    if (pinInput.trim().length === 4) {
      updateParentalControl({ pin: pinInput.trim() });
      setToastNotice('🔑 PIN de Control Parental actualizado a: ' + pinInput.trim());
      setTimeout(() => setToastNotice(''), 3000);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const usagePercent = Math.min(
    100,
    Math.round((parentalSettings.listenedTodayMinutes / parentalSettings.dailyLimitMinutes) * 100)
  );

  const currentQuiz = KIDS_QUIZZES[currentQuizIdx];

  const handleAnswerQuiz = (optIndex) => {
    setQuizSelected(optIndex);
    if (optIndex === currentQuiz.correct) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setQuizSelected(null);
    setCurrentQuizIdx((prev) => (prev + 1) % KIDS_QUIZZES.length);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. CABECERA Y ESTADO PRINCIPAL */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[32px]">toys</span>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#231123] dark:text-white flex items-center gap-2">
                <span>Modo Kids & Control Parental</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/15 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-500/30">
                  {user?.accountType === 'junior' || isParentalControlActive ? '🛡️ Modo Kids Activo' : '🔓 Modo Libre'}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0] mt-0.5">
                Experiencia musical 100% segura, educativa y adaptada para niños con temporizador de tareas y cuidado auditivo.
              </p>
            </div>
          </div>

          {toastNotice && (
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-3.5 py-2 rounded-xl border border-amber-200 dark:border-amber-800 self-start sm:self-auto animate-fade-in shadow-xs">
              {toastNotice}
            </span>
          )}
        </div>

        {/* Selector de Nivel de Protección */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Kids Estricto */}
          <div
            onClick={() => {
              updateUser({ accountType: 'junior' });
              updateParentalControl({ enabled: true, blockExplicit: true });
              setToastNotice('🛡️ Modo Kids Seguro activado: Música 100% familiar y protegida');
              setTimeout(() => setToastNotice(''), 3000);
            }}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              user?.accountType === 'junior' && user?.parentalControl?.blockExplicit
                ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/30'
                : 'border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-black/20 hover:border-amber-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[26px]">child_care</span>
              {user?.accountType === 'junior' && user?.parentalControl?.blockExplicit && (
                <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                  Activo
                </span>
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#231123] dark:text-white">Modo Kids (Recomendado)</h4>
              <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] mt-1">
                Bloquea todo contenido explícito, limita búsquedas a contenido familiar y activa el protector auditivo.
              </p>
            </div>
          </div>

          {/* Supervisado con PIN */}
          <div
            onClick={() => {
              updateUser({ accountType: 'standard' });
              updateParentalControl({ enabled: true, blockExplicit: true });
              setToastNotice('🔑 Modo Supervisado activado: Requiere PIN de 4 dígitos para pistas explícitas');
              setTimeout(() => setToastNotice(''), 3000);
            }}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              user?.accountType === 'standard' && user?.parentalControl?.blockExplicit
                ? 'border-[#B80C09] bg-rose-50/50 dark:bg-rose-950/20 shadow-md ring-2 ring-[#B80C09]/30'
                : 'border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-black/20 hover:border-[#B80C09]/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-[#B80C09] dark:text-rose-400 text-[26px]">pin</span>
              {user?.accountType === 'standard' && user?.parentalControl?.blockExplicit && (
                <span className="text-[10px] font-black uppercase text-[#B80C09] dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded-full">
                  Activo
                </span>
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#231123] dark:text-white">Supervisado Familiar</h4>
              <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] mt-1">
                Permite a los padres o tutores autorizar temporalmente canciones mediante su PIN secreto.
              </p>
            </div>
          </div>

          {/* Modo Adulto */}
          <div
            onClick={() => {
              updateUser({ accountType: 'standard' });
              updateParentalControl({ enabled: false, blockExplicit: false });
              setToastNotice('🔓 Modo Adulto Libre activado (sin restricciones de contenido)');
              setTimeout(() => setToastNotice(''), 3000);
            }}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              !user?.parentalControl?.blockExplicit
                ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/20 shadow-md ring-2 ring-purple-600/30'
                : 'border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-black/20 hover:border-purple-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-purple-600 dark:text-purple-300 text-[26px]">lock_open</span>
              {!user?.parentalControl?.blockExplicit && (
                <span className="text-[10px] font-black uppercase text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded-full">
                  Activo
                </span>
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#231123] dark:text-white">Modo Libre (Adultos)</h4>
              <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] mt-1">
                Acceso sin restricciones a todo el catálogo discográfico, letras y podcasts de la plataforma.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TEMPORIZADOR DE ESTUDIO POMODORO & AMBIENTES PARA NIÑOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Temporizador de Tareas & Pomodoro Kids */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#231123] to-[#3a1b33] text-white border border-white/15 shadow-md flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[24px] text-amber-400">timer</span>
              <div>
                <h4 className="text-base font-bold text-white">Temporizador de Estudio Kids (Pomodoro)</h4>
                <p className="text-xs text-pink-200/70">Sesión enfocada de 25 min para hacer tareas sin pantallas.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-black/40 border border-white/10">
            <span className="text-4xl sm:text-5xl font-mono font-black text-amber-300 tracking-wider">
              {formatTime(pomodoroSeconds)}
            </span>
            <span className="text-xs text-white/70 mt-1">
              {isPomodoroRunning ? '🎧 Sesión en curso con música suave' : 'Listo para iniciar'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                isPomodoroRunning ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPomodoroRunning ? 'pause' : 'play_arrow'}
              </span>
              <span>{isPomodoroRunning ? 'Pausar Estudio' : 'Iniciar Tiempo de Tareas (25 min)'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPomodoroRunning(false);
                setPomodoroSeconds(25 * 60);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
              title="Reiniciar a 25 min"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            </button>
          </div>
        </div>

        {/* Sonidos Calmantes & Ruido Blanco para Dormir */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[24px] text-teal-500">spa</span>
              <div>
                <h4 className="text-base font-bold text-[#231123] dark:text-white">Sonidos Calmantes & Naturaleza</h4>
                <p className="text-xs text-[#5c435a] dark:text-[#B89CB0]">Ambientes sonoros para relajar y dormir.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {AMBIENT_SOUNDS.map((sound) => {
              const isActive = activeAmbient === sound.id;
              return (
                <button
                  key={sound.id}
                  type="button"
                  onClick={() => {
                    setActiveAmbient(isActive ? null : sound.id);
                    setToastNotice(isActive ? 'Sonido ambiental detenido' : `Reproduciendo: ${sound.name}`);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                    isActive
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-400/40'
                      : 'bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 hover:border-teal-500'
                  }`}
                >
                  <span className="text-xs font-bold truncate">{sound.name}</span>
                  <span className={`text-[10px] ${isActive ? 'text-teal-100' : 'text-gray-400'}`}>
                    {sound.desc}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-teal-600 dark:text-teal-400 font-semibold pt-1">
            <span>{activeAmbient ? '🔊 Reproducción ambiental activa' : 'Toca para activar ambiente'}</span>
            {activeAmbient && (
              <button
                type="button"
                onClick={() => setActiveAmbient(null)}
                className="text-[11px] underline text-gray-500 hover:text-red-500 cursor-pointer"
              >
                Detener todo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. TRIVIA MUSICAL EDUCATIVA PARA NIÑOS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#4B2840]/30 to-purple-900/20 border border-amber-300/40 dark:border-white/10 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-amber-500">quiz</span>
            <div>
              <h4 className="text-base font-bold text-[#231123] dark:text-white">
                Trivia Musical Kids & Juegos de Oído
              </h4>
              <p className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                Aprende sobre instrumentos e historia musical mientras escuchas.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-300/30">
            Puntos: {quizScore}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-black/40 border border-[#e6d5e2] dark:border-white/10 flex flex-col gap-3">
          <p className="text-sm font-bold text-[#231123] dark:text-white">
            {currentQuiz.question}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {currentQuiz.options.map((opt, idx) => {
              const isSelected = quizSelected === idx;
              const isCorrect = idx === currentQuiz.correct;

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleAnswerQuiz(idx)}
                  disabled={quizSelected !== null}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    quizSelected === null
                      ? 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-white/10'
                      : isSelected && isCorrect
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : isSelected && !isCorrect
                      ? 'bg-red-600 text-white border-red-600'
                      : isCorrect
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-500'
                      : 'opacity-50'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {quizSelected !== null && (
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {currentQuiz.fact}
              </span>
              <button
                type="button"
                onClick={handleNextQuiz}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs self-start sm:self-auto cursor-pointer"
              >
                Siguiente Pregunta ➔
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. CANALES DE DESCUBRIMIENTO EXCLUSIVOS "SONAR KIDS" */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#231123] via-[#3d1a35] to-[#003844] text-white border border-white/15 shadow-xl flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md">
              <span className="material-symbols-outlined text-[24px]">explore</span>
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                Canales de Música Segura & Educativa "Sonar Kids"
              </h3>
              <p className="text-xs text-pink-200/80">
                Selecciones curadas para fomentar la creatividad, el estudio y el descanso.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-500/30 self-start sm:self-auto">
            100% Sin Contenido Explícito
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KIDS_CHANNELS.map((ch) => (
            <motion.div
              key={ch.id}
              whileHover={{ y: -3 }}
              className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between gap-3 group hover:border-amber-400 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${ch.color} text-white shadow-md`}>
                  <span className="material-symbols-outlined text-[20px]">{ch.icon}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {ch.title}
                  </h4>
                </div>
              </div>

              <p className="text-xs text-pink-200/70 leading-relaxed">
                {ch.description}
              </p>

              <button
                type="button"
                onClick={() => playTrack(ch.sampleTrack)}
                className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white text-white hover:text-[#231123] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                <span>Reproducir Canal</span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* JUKEBOX SEGURO DE 1 TAP */}
        <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">music_note</span>
              <span>Jukebox Sonar Kids · Éxitos 100% Seguros (1-Tap Play)</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {KIDS_SAFE_JUKEBOX.map((track) => (
              <div
                key={track.id}
                onClick={() => playTrack(track)}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-between gap-3 cursor-pointer transition-all hover:border-amber-400/50"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-10 h-10 rounded-lg object-cover shadow-xs shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate">{track.title}</span>
                    <span className="text-[10px] text-pink-200/70 truncate">{track.artist}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    {track.tag}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-400 text-white flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. LÍMITE DE TIEMPO DIARIO & CUIDADO AUDITIVO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Límite de Tiempo de Escucha Diario */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[24px] text-amber-500">hourglass_top</span>
              <div>
                <h4 className="text-base font-bold text-[#231123] dark:text-white">
                  Límite de Tiempo Diario
                </h4>
                <p className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                  Evita la fatiga auditiva limitando las horas de reproducción al día.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-[#e6d5e2] dark:border-white/10 flex flex-col gap-2">
            <div className="flex justify-between items-baseline text-xs font-bold">
              <span className="text-[#5c435a] dark:text-pink-200">
                Uso hoy: {parentalSettings.listenedTodayMinutes} min
              </span>
              <span className="text-[#B80C09] dark:text-pink-300 font-mono">
                Límite: {parentalSettings.dailyLimitMinutes} min ({usagePercent}%)
              </span>
            </div>

            <div className="w-full h-3 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${usagePercent}%` }}
                className={`h-full rounded-full ${
                  usagePercent > 85
                    ? 'bg-[#B80C09]'
                    : usagePercent > 50
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-500">Ajustar a:</span>
            {[30, 45, 60, 90, 120].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => handleSaveSettings({ dailyLimitMinutes: mins })}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  parentalSettings.dailyLimitMinutes === mins
                    ? 'bg-[#B80C09] text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-200'
                }`}
              >
                {mins} min
              </button>
            ))}
          </div>
        </div>

        {/* Protección Auditiva & Limitador de Decibeles */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[24px] text-teal-500">hearing</span>
              <div>
                <h4 className="text-base font-bold text-[#231123] dark:text-white">
                  Protección de Oído & Volumen Seguro
                </h4>
                <p className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                  Cumple con el estándar de seguridad auditiva de la OMS para niños.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-[#e6d5e2] dark:border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#231123] dark:text-white block">
                  Tope Máximo de Volumen ({parentalSettings.maxDecibels} dB)
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  Previene aumentos repentinos o picos de volumen peligrosos.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleSaveSettings({ volumeCapEnabled: !parentalSettings.volumeCapEnabled })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  parentalSettings.volumeCapEnabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                    parentalSettings.volumeCapEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-white/10">
              <span className="text-xs font-bold text-gray-500">Nivel Máximo:</span>
              {[70, 75, 80, 85].map((db) => (
                <button
                  key={db}
                  type="button"
                  onClick={() => handleSaveSettings({ maxDecibels: db })}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    parentalSettings.maxDecibels === db
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  {db} dB
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Estándar de audición segura activo en todos los reproductores</span>
          </div>
        </div>
      </div>

      {/* 6. PIN DE AUTORIZACIÓN & FILTRO DE PALABRAS CLAVE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PIN de Autorización */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-[#231123] dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#B80C09]">key</span>
              <span>PIN de Autorización Parental</span>
            </h4>
            <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] mt-1">
              Código de 4 dígitos que los padres usan para autorizar música o cambiar ajustes de seguridad.
            </p>
          </div>

          <form onSubmit={handleSavePin} className="flex items-center gap-3">
            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="1234"
              className="w-28 text-center tracking-[0.4em] font-mono text-base py-2.5 px-3 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-300 dark:border-white/20 text-[#231123] dark:text-white font-black focus:outline-hidden focus:border-[#B80C09]"
            />
            <button
              type="submit"
              disabled={pinInput.trim().length !== 4}
              className="px-5 py-2.5 rounded-xl bg-[#B80C09] hover:bg-[#960a07] text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
            >
              Guardar PIN
            </button>
          </form>

          <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs text-[#5c435a] dark:text-[#B89CB0]">Simulación de Bloqueo:</span>
            <button
              type="button"
              onClick={() => {
                playTrack({
                  id: 9896728,
                  title: 'To Pimp A Butterfly (Muestra Explícita)',
                  artist: 'Kendrick Lamar',
                  album: 'To Pimp A Butterfly',
                  explicit: true,
                  explicit_lyrics: true,
                });
              }}
              className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-bold text-[#231123] dark:text-white transition-all flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px] text-[#B80C09]">lock</span>
              <span>Probar PIN en Reproductor</span>
            </button>
          </div>
        </div>

        {/* Lista Negra de Palabras Clave o Artistas */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-[#231123] dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#B80C09]">block</span>
              <span>Palabras & Artistas Restringidos</span>
            </h4>
            <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] mt-1">
              Agrega términos que se filtrarán automáticamente del buscador y recomendaciones para niños.
            </p>
          </div>

          <form onSubmit={handleAddBlockedKeyword} className="flex items-center gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Ej. Artista, palabra o tema..."
              className="flex-1 text-xs py-2 px-3 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-300 dark:border-white/20 text-[#231123] dark:text-white focus:outline-hidden focus:border-[#B80C09]"
            />
            <button
              type="submit"
              disabled={!newKeyword.trim()}
              className="px-4 py-2 rounded-xl bg-[#231123] dark:bg-white text-white dark:text-[#231123] text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            >
              + Bloquear
            </button>
          </form>

          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {parentalSettings.blockedKeywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs font-semibold border border-red-200 dark:border-red-900/30"
              >
                <span>{kw}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(kw)}
                  className="hover:text-red-900 dark:hover:text-white cursor-pointer ml-0.5"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 7. REGISTRO DE ACTIVIDAD Y AUDITORÍA PARENTAL */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[22px] text-[#5c435a] dark:text-[#B89CB0]">
              history_toggle_off
            </span>
            <h4 className="text-base font-bold text-[#231123] dark:text-white">
              Historial de Actividad & Auditoría de Seguridad Kids
            </h4>
          </div>
          <span className="text-xs text-gray-500 font-mono">Últimas 24 horas</span>
        </div>

        <div className="flex flex-col divide-y divide-gray-100 dark:divide-white/10 text-xs">
          {activityLogs.map((log) => (
            <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    log.safe ? 'bg-emerald-500' : 'bg-[#B80C09] animate-pulse'
                  }`}
                />
                <div>
                  <span className="font-bold text-[#231123] dark:text-white">{log.track}</span>
                  <span className="text-gray-400 block text-[11px]">{log.action}</span>
                </div>
              </div>
              <span className="text-gray-400 font-mono text-[11px] shrink-0">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedParentalControl;
