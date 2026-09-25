import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PRESETS = [
  {
    id: 'tube-warmth',
    name: 'Cálido Analógico (Tubos)',
    subtitle: 'Armónicos pares y medios sedosos',
    icon: 'local_fire_department',
    bands: [3, 2, 1, 0, -1],
    color: 'from-amber-600 to-[#B80C09]',
  },
  {
    id: 'flat-reference',
    name: 'Plano / Monitor Analítico',
    subtitle: 'Respuesta neutra de estudio Hi-Fi',
    icon: 'equalizer',
    bands: [0, 0, 0, 0, 0],
    color: 'from-[#003844] to-[#005f73]',
  },
  {
    id: 'acoustic-vocal',
    name: 'Presencia Vocal & Jazz',
    subtitle: 'Realce acústico e instrumentos de viento',
    icon: 'mic',
    bands: [-1, 1, 4, 3, 1],
    color: 'from-[#4B2840] to-[#6a395b]',
  },
  {
    id: 'hifi-deep-bass',
    name: 'Graves Profundos Hi-Fi',
    subtitle: 'Extensión sub-grave sin distorsión armónica',
    icon: 'speaker',
    bands: [5, 3, 0, 1, 2],
    color: 'from-[#231123] to-[#B80C09]',
  },
];

export const SoundSignatureSelector = ({ initialProfile = 'tube-warmth', onSaveProfile }) => {
  const [activePreset, setActivePreset] = useState(initialProfile);
  const [customBands, setCustomBands] = useState(() => {
    const current = PRESETS.find((p) => p.id === initialProfile) || PRESETS[0];
    return [...current.bands];
  });
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSelectPreset = (preset) => {
    setActivePreset(preset.id);
    setCustomBands([...preset.bands]);
  };

  const handleBandChange = (index, value) => {
    const next = [...customBands];
    next[index] = Number(value);
    setCustomBands(next);
  };

  const handleSave = () => {
    if (onSaveProfile) {
      onSaveProfile({
        presetId: activePreset,
        bands: customBands,
      });
    }
    window.dispatchEvent(
      new CustomEvent('sonar:sound-profile-changed', {
        detail: { presetId: activePreset, bands: customBands },
      })
    );
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const frequencies = ['60 Hz', '250 Hz', '1 kHz', '4 kHz', '16 kHz'];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col gap-6 text-[#231123] dark:text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B80C09]">
            Procesamiento Digital de Audio (DSP)
          </span>
          <h3 className="text-xl font-black tracking-tight mt-0.5">
            Firma de Sonido & Ecualizador
          </h3>
          <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] mt-1">
            Personaliza cómo responde la curva acústica de la plataforma a tu equipamiento y oídos.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-[#B80C09] hover:bg-[#960a07] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">
            {savedNotice ? 'check' : 'save'}
          </span>
          <span>{savedNotice ? '¡Firma Guardada!' : 'Aplicar al Perfil'}</span>
        </button>
      </div>

      {/* Selector de Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PRESETS.map((preset) => {
          const isSelected = activePreset === preset.id;
          return (
            <motion.div
              key={preset.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleSelectPreset(preset)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-gradient-to-br from-[#231123] to-[#4B2840] text-white border-[#B80C09] shadow-lg ring-2 ring-[#B80C09]/40'
                  : 'bg-gray-50 dark:bg-black/20 border-[#e6d5e2] dark:border-white/10 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`p-2 rounded-xl ${
                    isSelected ? 'bg-[#B80C09] text-white' : 'bg-white dark:bg-white/10 text-[#5c435a] dark:text-[#DCDCDD]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{preset.icon}</span>
                </span>
                {isSelected && (
                  <span className="text-[10px] font-black uppercase text-amber-300 bg-black/40 px-2 py-0.5 rounded-full border border-amber-300/30">
                    Activo
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold">{preset.name}</h4>
                <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-pink-200/80' : 'text-[#5c435a] dark:text-[#B89CB0]'}`}>
                  {preset.subtitle}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Visualizador de Ecualizador de 5 Bandas */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gray-50 dark:bg-black/30 border border-[#e6d5e2] dark:border-white/10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#5c435a] dark:text-pink-200 uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#B80C09]">tune</span>
            <span>Ajuste de Bandas de Frecuencia (dB)</span>
          </span>
          <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400">
            Rango: -6 dB a +6 dB
          </span>
        </div>

        <div className="grid grid-cols-5 gap-3 sm:gap-6 pt-4 pb-2">
          {frequencies.map((freq, idx) => (
            <div key={freq} className="flex flex-col items-center gap-3">
              <span className="text-xs font-mono font-bold text-[#B80C09] dark:text-pink-300">
                {customBands[idx] > 0 ? `+${customBands[idx]}` : customBands[idx]} dB
              </span>

              <input
                type="range"
                min="-6"
                max="6"
                step="1"
                value={customBands[idx]}
                onChange={(e) => handleBandChange(idx, e.target.value)}
                className="w-full accent-[#B80C09] cursor-pointer"
              />

              <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300">{freq}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SoundSignatureSelector;
