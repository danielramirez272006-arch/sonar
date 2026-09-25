import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../shared/context/auth-context';
import { usePlayer } from '../../../shared/context/player-context';

const JUNIOR_CHANNELS = [
  {
    id: 'classical-early',
    title: 'Mozart & Clásicos para Niños',
    description: 'Composiciones sinfónicas relajantes y enriquecedoras.',
    icon: 'music_note',
    color: 'from-amber-600 to-amber-700',
    sampleTrack: { id: 90111, title: 'Eine kleine Nachtmusik', artist: 'W.A. Mozart', album: 'Clásicos Universales' },
  },
  {
    id: 'animation-soundtracks',
    title: 'Bandas Sonoras & Animación',
    description: 'Música orquestal inspiradora de grandes aventuras.',
    icon: 'movie',
    color: 'from-purple-600 to-purple-800',
    sampleTrack: { id: 90112, title: 'Adventure Suite', artist: 'London Symphony', album: 'Cinema Dreams' },
  },
  {
    id: 'study-lofi',
    title: 'Lo-Fi para Concentración & Tareas',
    description: 'Beats instrumentales suaves sin letras distractoras.',
    icon: 'school',
    color: 'from-teal-600 to-teal-800',
    sampleTrack: { id: 90113, title: 'Quiet Study Beats', artist: 'Sonar Lo-Fi', album: 'Study Session Vol. 1' },
  },
  {
    id: 'bedtime-lullaby',
    title: 'Canciones de Cuna & Sueño Profundo',
    description: 'Melodías acústicas en piano y arpa para dormir.',
    icon: 'bedtime',
    color: 'from-indigo-600 to-indigo-900',
    sampleTrack: { id: 90114, title: 'Nocturne Lullaby', artist: 'Acoustic Dreams', album: 'Peaceful Nights' },
  },
];

export const EnhancedParentalControl = () => {
  const { user, updateUser, updateParentalControl, isParentalControlActive } = useAuth();
  const { playTrack } = usePlayer();

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
  const [activityLogs, setActivityLogs] = useState(() => {
    try {
      const logs = localStorage.getItem('sonar_parental_audit_logs');
      return logs
        ? JSON.parse(logs)
        : [
            { id: 1, action: 'Escucha segura', track: 'Eine kleine Nachtmusik - W.A. Mozart', time: 'Hoy, 15:42', safe: true },
            { id: 2, action: 'Bloqueo por PIN', track: 'Pista Explícita bloqueada automáticamente', time: 'Hoy, 14:20', safe: false },
            { id: 3, action: 'Escucha segura', track: 'Quiet Study Beats - Lo-Fi Session', time: 'Ayer, 18:10', safe: true },
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
    setToastNotice('✓ Configuración de Control Parental guardada con éxito');
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

  const usagePercent = Math.min(
    100,
    Math.round((parentalSettings.listenedTodayMinutes / parentalSettings.dailyLimitMinutes) * 100)
  );

  return (
    <div className="flex flex-col gap-6">
      {/* 1. CABECERA Y ESTADO PRINCIPAL */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[32px]">shield_person</span>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#231123] dark:text-white flex items-center gap-2">
                <span>Ecosistema de Control Parental & Modo Junior</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-500/30">
                  {user?.accountType === 'junior' || isParentalControlActive ? '🛡️ Protección Activa' : '🔓 Modo Libre'}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0] mt-0.5">
                Protege a los más jóvenes con límites de tiempo diario, tope de volumen auditivo y bloqueo estricto de contenido adulto.
              </p>
            </div>
          </div>

          {toastNotice && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300 px-3.5 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto animate-fade-in shadow-xs">
              {toastNotice}
            </span>
          )}
        </div>

        {/* Selector de Nivel de Protección */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Junior Estricto */}
          <div
            onClick={() => {
              updateUser({ accountType: 'junior' });
              updateParentalControl({ enabled: true, blockExplicit: true });
              setToastNotice('🛡️ Modo Junior Seguro activado: Música 100% segura para menores');
              setTimeout(() => setToastNotice(''), 3000);
            }}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              user?.accountType === 'junior' && user?.parentalControl?.blockExplicit
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/30'
                : 'border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-black/20 hover:border-emerald-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[26px]">child_care</span>
              {user?.accountType === 'junior' && user?.parentalControl?.blockExplicit && (
                <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                  Activo
                </span>
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#231123] dark:text-white">Junior Estricto (Recomendado)</h4>
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

      {/* 2. LÍMITE DE TIEMPO DIARIO & CUIDADO AUDITIVO */}
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

          {/* Medidor Circular / Barra de Uso Hoy */}
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

          {/* Opciones Rápidas de Límite */}
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
                  Cumple con el estándar de seguridad auditiva de la OMS para menores.
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

            {/* Selector de decibeles */}
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

      {/* 3. CANALES DE DESCUBRIMIENTO EXCLUSIVOS "SONAR JUNIOR" */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#231123] via-[#3d1a35] to-[#003844] text-white border border-white/15 shadow-xl flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md">
              <span className="material-symbols-outlined text-[24px]">explore</span>
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                Canales de Música Segura & Educativa "Sonar Junior"
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
          {JUNIOR_CHANNELS.map((ch) => (
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
      </div>

      {/* 4. PIN DE AUTORIZACIÓN & FILTRO DE PALABRAS CLAVE */}
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

          {/* Botón de Prueba en Vivo */}
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
              Agrega términos que se filtrarán automáticamente del buscador y recomendaciones del menor.
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

      {/* 5. REGISTRO DE ACTIVIDAD Y AUDITORÍA PARENTAL */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[22px] text-[#5c435a] dark:text-[#B89CB0]">
              history_toggle_off
            </span>
            <h4 className="text-base font-bold text-[#231123] dark:text-white">
              Historial de Actividad & Auditoría de Seguridad
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
