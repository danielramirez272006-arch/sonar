import React, { useState } from 'react';
import { motion } from 'framer-motion';

const GEAR_OPTIONS = {
  cartridge: [
    { name: 'Ortofon 2M Blue (Elíptica Desnuda)', purity: 95, icon: 'album' },
    { name: 'Audio-Technica VM540ML (MicroLine)', purity: 98, icon: 'album' },
    { name: 'Nagaoka MP-110 (Moving Permalloy)', purity: 92, icon: 'album' },
  ],
  phono: [
    { name: 'Cambridge Audio Alva Duo (MM/MC)', purity: 96, icon: 'settings_input_component' },
    { name: 'Schiit Mani 2 (Ultra Low Noise)', purity: 94, icon: 'settings_input_component' },
    { name: 'Pro-Ject Tube Box S2 (Valvular)', purity: 91, icon: 'settings_input_component' },
  ],
  dac: [
    { name: 'Cambridge Audio DacMagic 200M (Dual ESS)', purity: 99, icon: 'memory' },
    { name: 'Chord Mojo 2 (FPGA Custom Filter)', purity: 99, icon: 'memory' },
    { name: 'Topping DX3 Pro+ (ES9038Q2M)', purity: 97, icon: 'memory' },
  ],
  amp: [
    { name: 'Woo Audio WA7 Fireflies (Tubo Preamplificado)', purity: 94, icon: 'electric_bolt' },
    { name: 'Schiit Magni+ (Discreto Clase AB)', purity: 96, icon: 'electric_bolt' },
    { name: 'Marantz PM6007 (Toroidal Current Feedback)', purity: 95, icon: 'electric_bolt' },
  ],
  headphones: [
    { name: 'Sennheiser HD 660S (Dinámico Abierto)', purity: 97, icon: 'headphones' },
    { name: 'Hifiman Sundara (Planar Magnetic)', purity: 98, icon: 'headphones' },
    { name: 'Focal Clear Mg (Magnesio Hi-Res)', purity: 99, icon: 'headphones' },
  ],
};

export const AudiophileSignalChain = ({ currentGear = {}, onUpdateGear }) => {
  const [selectedCartridge, setSelectedCartridge] = useState(GEAR_OPTIONS.cartridge[0]);
  const [selectedPhono, setSelectedPhono] = useState(GEAR_OPTIONS.phono[0]);
  const [selectedDac, setSelectedDac] = useState(GEAR_OPTIONS.dac[0]);
  const [selectedAmp, setSelectedAmp] = useState(GEAR_OPTIONS.amp[0]);
  const [selectedOutput, setSelectedOutput] = useState(GEAR_OPTIONS.headphones[0]);
  const [savedNotice, setSavedNotice] = useState(false);

  const overallPurity = Math.round(
    (selectedCartridge.purity +
      selectedPhono.purity +
      selectedDac.purity +
      selectedAmp.purity +
      selectedOutput.purity) /
      5
  );

  const handleApplyChain = () => {
    if (onUpdateGear) {
      onUpdateGear({
        stylus: selectedCartridge.name,
        phonoPreamp: selectedPhono.name,
        dac: selectedDac.name,
        amplifier: selectedAmp.name,
        headphones: selectedOutput.name,
      });
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const stages = [
    { title: '1. Fonocaptor', current: selectedCartridge, set: setSelectedCartridge, options: GEAR_OPTIONS.cartridge },
    { title: '2. Preamplificador', current: selectedPhono, set: setSelectedPhono, options: GEAR_OPTIONS.phono },
    { title: '3. DAC Procesador', current: selectedDac, set: setSelectedDac, options: GEAR_OPTIONS.dac },
    { title: '4. Amplificación', current: selectedAmp, set: setSelectedAmp, options: GEAR_OPTIONS.amp },
    { title: '5. Monitoreo', current: selectedOutput, set: setSelectedOutput, options: GEAR_OPTIONS.headphones },
  ];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#231123] via-[#35182d] to-[#003844] border border-white/15 shadow-2xl text-white flex flex-col gap-6 relative overflow-hidden">
      {/* Fondo con rayos de luz sónica */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#B80C09]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-pink-300">
            ARQUITECTURA DE AUDIO ANALÓGICO & DIGITAL
          </span>
          <h3 className="text-2xl font-black tracking-tight mt-0.5">
            Cadena de Señal Audiófila Visual
          </h3>
          <p className="text-xs text-[#DCDCDD]/80 mt-1">
            Configura el flujo de audio desde la aguja del vinilo hasta tus audífonos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-right">
            <span className="text-[10px] uppercase font-mono tracking-wider text-pink-300/80 block">
              Pureza Acústica Total
            </span>
            <div className="flex items-center gap-2 justify-end">
              <span className="text-xl font-mono font-black text-emerald-300">
                {overallPurity}% SNR
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          <button
            type="button"
            onClick={handleApplyChain}
            className="px-4 py-3 rounded-2xl bg-[#B80C09] hover:bg-[#960a07] text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg cursor-pointer"
          >
            {savedNotice ? '¡Cadena Guardada!' : 'Guardar Setup'}
          </button>
        </div>
      </div>

      {/* Cadena de Bloques Interconectados */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
        {stages.map((stage, idx) => (
          <div
            key={stage.title}
            className="p-4 rounded-2xl bg-black/30 border border-white/10 flex flex-col justify-between gap-3 relative group hover:border-[#B80C09] transition-all"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-pink-200/70 mb-2">
                <span>{stage.title}</span>
                <span className="font-mono text-emerald-300">{stage.current.purity}%</span>
              </div>

              <select
                value={stage.current.name}
                onChange={(e) => {
                  const found = stage.options.find((o) => o.name === e.target.value);
                  if (found) stage.set(found);
                }}
                className="w-full text-xs font-bold py-1.5 px-2 rounded-xl bg-white/10 border border-white/15 text-white focus:outline-hidden focus:border-[#B80C09] cursor-pointer"
              >
                {stage.options.map((opt) => (
                  <option key={opt.name} value={opt.name} className="bg-[#231123] text-white">
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/60">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#B80C09]">{stage.current.icon}</span>
                <span className="truncate max-w-[90px]">{stage.current.name.split(' ')[0]}</span>
              </span>
              <span className="font-mono">Paso {idx + 1}/5</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudiophileSignalChain;
