import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Dices,
  Palette,
  Disc,
  Headphones,
  Radio,
  Volume2,
  Mic,
  Flame,
  Image as ImageIcon,
  Type,
  Check,
  Pipette,
  Layers
} from 'lucide-react';
import Input from '../../../shared/components/ui/input';
import Button from '../../../shared/components/ui/button';
import Avatar from '../../../shared/components/ui/avatar';
import { GENRE_OPTIONS } from '../../../shared/services/recommendations-service';

// 24 colores sólidos organizados armónicamente
export const SOLID_PALETTES = [
  // Rojos y Burdeos
  { name: 'Sonar Crimson', color: '#B80C09' },
  { name: 'Ruby Flame', color: '#E11D48' },
  { name: 'Rosewood', color: '#881337' },
  { name: 'Velvet Burgundy', color: '#4B2840' },

  // Púrpuras y Magentas
  { name: 'Deep Purple', color: '#5c1d5e' },
  { name: 'Electric Violet', color: '#7c3aed' },
  { name: 'Cyber Magenta', color: '#D946EF' },
  { name: 'Midnight Plum', color: '#3B0764' },

  // Azules y Cyans
  { name: 'Neon Cyan', color: '#06B6D4' },
  { name: 'Ocean Sky', color: '#0284c7' },
  { name: 'Electric Indigo', color: '#2563EB' },
  { name: 'Deep Navy', color: '#1E1B4B' },

  // Verdes y Turquesas
  { name: 'Emerald Forest', color: '#059669' },
  { name: 'Mint Wave', color: '#10B981' },
  { name: 'Acid Lime', color: '#84CC16' },
  { name: 'Dark Moss', color: '#14532D' },

  // Cálidos y Terrosos
  { name: 'Sunset Amber', color: '#d97706' },
  { name: 'Warm Orange', color: '#EA580C' },
  { name: 'Tangerine Glow', color: '#F97316' },
  { name: 'Golden Sun', color: '#EAB308' },

  // Neutros y Oscuros
  { name: 'Midnight Velvet', color: '#231123' },
  { name: 'Obsidian Slate', color: '#0F172A' },
  { name: 'Titanium Grey', color: '#475569' },
  { name: 'Charcoal Black', color: '#18181B' },
];

// 10 degradados modernos de alta fidelidad
export const GRADIENT_PALETTES = [
  { name: 'Crimson Velvet', gradient: 'linear-gradient(135deg, #B80C09 0%, #4B2840 100%)' },
  { name: 'Cyber Neon', gradient: 'linear-gradient(135deg, #7928CA 0%, #FF0080 100%)' },
  { name: 'Electric Space', gradient: 'linear-gradient(135deg, #00C0FF 0%, #4218B8 100%)' },
  { name: 'Sunset Heat', gradient: 'linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%)' },
  { name: 'Aurora Mist', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { name: 'Solar Flare', gradient: 'linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)' },
  { name: 'Cosmic Indigo', gradient: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)' },
  { name: 'Golden Ember', gradient: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)' },
  { name: 'Velvet Night', gradient: 'linear-gradient(135deg, #231123 0%, #160a16 100%)' },
  { name: 'Dark Nebula', gradient: 'linear-gradient(135deg, #434343 0%, #000000 100%)' },
];

// Arquetipos de caras Blobatar con personalidad musical
export const BLOBATAR_PRESETS = [
  { id: 'vinyl-master', name: 'Vinilófilo', seed: 'vinyl-master' },
  { id: 'synth-rider', name: 'Synth Master', seed: 'synth-rider' },
  { id: 'cyber-audio', name: 'Cyberpunk', seed: 'cyber-audio' },
  { id: 'jazz-groove', name: 'Jazzista', seed: 'jazz-groove' },
  { id: 'modular-dj', name: 'DJ Modular', seed: 'modular-dj' },
  { id: 'acoustic-soul', name: 'Acústico', seed: 'acoustic-soul' },
  { id: 'night-listener', name: 'Noctámbulo', seed: 'night-listener' },
  { id: 'dream-pop', name: 'Dream Pop', seed: 'dream-pop' },
  { id: 'beatmaker-pro', name: 'Beatmaker', seed: 'beatmaker-pro' },
  { id: 'vocal-star', name: 'Vocal Star', seed: 'vocal-star' },
  { id: 'rock-spirit', name: 'Rocker', seed: 'rock-spirit' },
  { id: 'ambient-mind', name: 'Ambient', seed: 'ambient-mind' },
];

// Íconos vectoriales temáticos
export const ICON_CHOICES = [
  { id: 'headphones', name: 'Auriculares Hi-Fi', icon: Headphones },
  { id: 'vinyl', name: 'Vinilo / Disco', icon: Disc },
  { id: 'radio', name: 'Radio Retro', icon: Radio },
  { id: 'volume', name: 'Onda Sonora', icon: Volume2 },
  { id: 'mic', name: 'Micrófono Estudio', icon: Mic },
  { id: 'flame', name: 'Fuego / Top', icon: Flame },
];

export const EditProfileForm = ({ initialData = {}, onSave = () => {} }) => {
  const [formData, setFormData] = useState({
    username: initialData.username || initialData.name || '',
    bio: initialData.bio || '',
    avatarHue: initialData.avatarHue ?? 326,
    avatarTone: initialData.avatarTone ?? 0.52,
    avatarBg: initialData.avatarBg || '#5c1d5e',
    avatarStyle: initialData.avatarStyle || (initialData.avatarUrl ? 'image' : 'blobatar'),
    avatarSeed: initialData.avatarSeed || initialData.username || 'vinyl-master',
    avatarIcon: initialData.avatarIcon || 'headphones',
    avatarUrl: initialData.avatarUrl || '',
    preferences: initialData.preferences || ['Art Rock', 'Electrónica'],
  });

  const [colorMode, setColorMode] = useState(
    formData.avatarBg?.includes('gradient') ? 'gradient' : 'solid'
  );
  const [customColor, setCustomColor] = useState(
    formData.avatarBg?.startsWith('#') ? formData.avatarBg : '#B80C09'
  );

  const toggleGenre = (genre) => {
    setFormData((prev) => {
      const current = prev.preferences || [];
      if (current.includes(genre)) {
        return { ...prev, preferences: current.filter((g) => g !== genre) };
      } else {
        return { ...prev, preferences: [...current, genre] };
      }
    });
  };

  const handleRandomizeSeed = () => {
    const randomAdjectives = ['hi-fi', 'analog', 'acoustic', 'modular', 'stereo', 'sonic', 'tube', 'vinyl', 'groove', 'ambient'];
    const randomNouns = ['listener', 'producer', 'master', 'collector', 'explorer', 'audiophile', 'dj', 'wave', 'soul'];
    const randomNum = Math.floor(Math.random() * 9999);
    const adj = randomAdjectives[Math.floor(Math.random() * randomAdjectives.length)];
    const noun = randomNouns[Math.floor(Math.random() * randomNouns.length)];
    const newSeed = `${adj}-${noun}-${randomNum}`;

    setFormData((prev) => ({
      ...prev,
      avatarSeed: newSeed,
      avatarStyle: 'blobatar',
    }));
  };

  const handleCustomColorChange = (e) => {
    const val = e.target.value;
    setCustomColor(val);
    setFormData((prev) => ({ ...prev, avatarBg: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7 w-full">
      {/* Nombre y Datos Básicos */}
      <Input
        label="Nombre de Usuario / Alias"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        placeholder="Tu nombre en Sonar"
        required
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#5c435a] dark:text-[#B89CB0]">
          Biografía & Manifiesto Musical
        </label>
        <textarea
          rows={3}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full px-4 py-2.5 rounded-2xl border border-[#e6d5e2] dark:border-white/10 bg-white/50 dark:bg-[#231123]/50 text-[#231123] dark:text-white placeholder-[#81737e] focus:outline-hidden focus:ring-2 focus:ring-[#B80C09] transition-all"
          placeholder="Escribe sobre tus géneros predilectos, equipos de audio o discos indispensables..."
        />
      </div>

      {formData.avatarStyle === 'blobatar' && <div className="grid gap-3">
        <label>Matiz del Blobatar<input type="range" min="0" max="360" value={formData.avatarHue} onChange={e => setFormData(prev => ({ ...prev, avatarHue: Number(e.target.value) }))} /></label>
        <label>Profundidad del Blobatar<input type="range" min="0.2" max="0.8" step="0.01" value={formData.avatarTone} onChange={e => setFormData(prev => ({ ...prev, avatarTone: Number(e.target.value) }))} /></label>
      </div>}
      {/* ESTUDIO DE AVATAR & PERSONALIZACIÓN VISUAL */}
      <div className="flex flex-col gap-6 p-5 sm:p-6 rounded-3xl bg-gray-50/80 dark:bg-[#231123]/70 border border-[#e6d5e2] dark:border-white/10 shadow-xs">
        {/* Cabecera del Estudio de Avatar con Vista Previa en Vivo */}
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 pb-5 border-b border-[#e6d5e2]/80 dark:border-white/10">
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="relative group">
              <Avatar
                name={formData.username || 'Usuario'}
                avatarBg={formData.avatarBg}
                avatarHue={formData.avatarHue}
                avatarTone={formData.avatarTone}
                avatarSeed={formData.avatarSeed}
                avatarStyle={formData.avatarStyle}
                avatarIcon={formData.avatarIcon}
                src={formData.avatarUrl}
                size="2xl"
                className="w-24 h-24 ring-4 ring-[#B80C09]/25 shadow-xl transition-all"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-[#B80C09] text-white text-[9px] font-black uppercase tracking-wider shadow-md">
                En vivo
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#5c435a] dark:text-[#B89CB0]">
              Vista previa
            </span>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-[#B80C09]" />
              <h3 className="text-base sm:text-lg font-black text-[#231123] dark:text-white tracking-tight">
                Estudio de Avatar y Apariencia
              </h3>
            </div>
            <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] leading-relaxed">
              Personaliza tu cara, estilo de ilustración, colores de fondo y degradados para destacar en la comunidad audiófila.
            </p>

            {/* Pestañas de Modo de Avatar */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-2">
              {[
                { id: 'blobatar', label: 'Blobatar Dinámico', icon: Sparkles },
                { id: 'icon', label: 'Ícono Musical', icon: Headphones },
                { id: 'initials', label: 'Monograma', icon: Type },
                { id: 'image', label: 'Foto / URL', icon: ImageIcon },
              ].map((tab) => {
                const isSelected = formData.avatarStyle === tab.id;
                const IconComp = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatarStyle: tab.id })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-[#B80C09] text-white border-[#B80C09] shadow-sm'
                        : 'bg-white dark:bg-[#1a0e1c] border-[#e6d5e2] dark:border-white/10 text-[#5c435a] dark:text-gray-300 hover:border-[#B80C09]/40'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CONTENIDO SEGÚN MODO DE AVATAR */}
        {/* 1. MODO BLOBATAR */}
        {formData.avatarStyle === 'blobatar' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <label className="text-xs font-bold uppercase tracking-wider text-[#5c435a] dark:text-[#B89CB0] flex items-center gap-1.5">
                <span>Modelos y Expresiones de Blobatar</span>
              </label>

              {/* Botón de Aleatorizar */}
              <button
                type="button"
                onClick={handleRandomizeSeed}
                className="px-3 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Generar una cara aleatoria"
              >
                <Dices className="w-3.5 h-3.5" />
                <span>🎲 Aleatorizar Cara</span>
              </button>
            </div>

            {/* Grid de Arquetipos de Blobatar */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1">
              {BLOBATAR_PRESETS.map((preset) => {
                const isSelected = formData.avatarSeed === preset.seed;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatarSeed: preset.seed })}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#B80C09]/10 border-[#B80C09] ring-2 ring-[#B80C09]/40 shadow-xs'
                        : 'bg-white dark:bg-[#1a0e1c] border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09]/40'
                    }`}
                  >
                    <Avatar
                      avatarSeed={preset.seed}
                      avatarBg={formData.avatarBg}
                      size="sm"
                      className="pointer-events-none"
                    />
                    <span className="text-[11px] font-bold text-[#231123] dark:text-white truncate max-w-full">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. MODO ÍCONO MUSICAL */}
        {formData.avatarStyle === 'icon' && (
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5c435a] dark:text-[#B89CB0]">
              Elige tu Emblema Musical
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {ICON_CHOICES.map((ic) => {
                const isSelected = formData.avatarIcon === ic.id;
                const IconComponent = ic.icon;
                return (
                  <button
                    key={ic.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatarIcon: ic.id })}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#B80C09]/10 border-[#B80C09] ring-2 ring-[#B80C09]/40 shadow-xs'
                        : 'bg-white dark:bg-[#1a0e1c] border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09]/40'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-xs"
                      style={{ background: formData.avatarBg }}
                    >
                      <IconComponent className="w-5 h-5 drop-shadow-xs" />
                    </div>
                    <span className="text-[11px] font-bold text-[#231123] dark:text-white text-center">
                      {ic.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. MODO MONOGRAMA */}
        {formData.avatarStyle === 'initials' && (
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1a0e1c] border border-[#e6d5e2] dark:border-white/10 flex items-center gap-4">
            <Avatar
              name={formData.username || 'U'}
              avatarStyle="initials"
              avatarBg={formData.avatarBg}
              size="lg"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-[#231123] dark:text-white">
                Monograma Clásico de Usuario
              </span>
              <p className="text-[11px] text-[#5c435a] dark:text-[#B89CB0]">
                Muestra la letra inicial de tu nombre con tipografía nítida sobre tu color de fondo favorito.
              </p>
            </div>
          </div>
        )}

        {/* 4. MODO FOTO / URL */}
        {formData.avatarStyle === 'image' && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5c435a] dark:text-[#B89CB0]">
              URL de Imagen / Foto de Perfil
            </label>
            <input
              type="url"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              placeholder="https://ejemplo.com/tu-foto.jpg"
              className="w-full px-4 py-2.5 rounded-xl border border-[#e6d5e2] dark:border-white/10 bg-white dark:bg-[#1a0e1c] text-xs text-[#231123] dark:text-white placeholder-[#81737e] focus:outline-hidden focus:ring-2 focus:ring-[#B80C09]"
            />
          </div>
        )}

        {/* SECCIÓN DE PALETA DE COLORES Y DEGRADADOS EXTENDIDA */}
        <div className="flex flex-col gap-3 pt-4 border-t border-[#e6d5e2]/80 dark:border-white/10">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#5c435a] dark:text-[#B89CB0] flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#B80C09]" />
              <span>Colores de Fondo y Gradientes Sonar</span>
            </label>

            {/* Toggle Sólidos vs Gradientes vs Selector Libre */}
            <div className="flex items-center gap-1 p-1 bg-gray-200/70 dark:bg-white/5 rounded-xl border border-[#e6d5e2] dark:border-white/10">
              <button
                type="button"
                onClick={() => setColorMode('solid')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  colorMode === 'solid'
                    ? 'bg-white dark:bg-[#4B2840] text-[#231123] dark:text-white shadow-xs'
                    : 'text-[#5c435a] dark:text-gray-400 hover:text-white'
                }`}
              >
                Colores Sólidos ({SOLID_PALETTES.length})
              </button>
              <button
                type="button"
                onClick={() => setColorMode('gradient')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  colorMode === 'gradient'
                    ? 'bg-white dark:bg-[#4B2840] text-[#231123] dark:text-white shadow-xs'
                    : 'text-[#5c435a] dark:text-gray-400 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Gradientes ({GRADIENT_PALETTES.length})</span>
              </button>
            </div>
          </div>

          {/* PALETA 1: SÓLIDOS */}
          {colorMode === 'solid' && (
            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2.5 pt-1">
                {SOLID_PALETTES.map((item) => {
                  const isSelected = formData.avatarBg === item.color;
                  return (
                    <button
                      key={item.color}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatarBg: item.color })}
                      style={{ backgroundColor: item.color }}
                      className={`w-9 h-9 rounded-2xl cursor-pointer transition-all hover:scale-115 flex items-center justify-center shadow-xs ring-2 ${
                        isSelected
                          ? 'ring-offset-2 ring-2 ring-[#B80C09] scale-110 shadow-md'
                          : 'ring-white/20 dark:ring-white/10'
                      }`}
                      title={item.name}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                    </button>
                  );
                })}
              </div>

              {/* Selector de Color Personalizado con Color Picker Nativo */}
              <div className="flex items-center gap-3 mt-2 p-3 rounded-2xl bg-white dark:bg-[#1a0e1c] border border-[#e6d5e2] dark:border-white/10">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColor}
                    onChange={handleCustomColorChange}
                    className="w-8 h-8 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                    title="Abrir selector de color exacto"
                  />
                  <span className="text-xs font-bold text-[#231123] dark:text-white">
                    Color Personalizado (HEX):
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.avatarBg}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, avatarBg: val });
                    if (val.startsWith('#') && val.length === 7) {
                      setCustomColor(val);
                    }
                  }}
                  placeholder="#B80C09"
                  className="px-3 py-1 text-xs font-mono rounded-lg border border-[#e6d5e2] dark:border-white/10 bg-gray-50 dark:bg-black/30 text-[#231123] dark:text-white w-28 uppercase"
                />
              </div>
            </div>
          )}

          {/* PALETA 2: GRADIENTES */}
          {colorMode === 'gradient' && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              {GRADIENT_PALETTES.map((item) => {
                const isSelected = formData.avatarBg === item.gradient;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatarBg: item.gradient })}
                    className={`flex items-center gap-2 p-2 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#B80C09]/10 border-[#B80C09] ring-2 ring-[#B80C09]/40 shadow-sm'
                        : 'bg-white dark:bg-[#1a0e1c] border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09]/40'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-xl shrink-0 shadow-2xs flex items-center justify-center text-white"
                      style={{ background: item.gradient }}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 drop-shadow-md" />}
                    </div>
                    <span className="text-xs font-bold text-[#231123] dark:text-white truncate">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Géneros Musicales y Recomendaciones Propias */}
      <div className="flex flex-col gap-2.5 p-5 rounded-3xl bg-gray-50/80 dark:bg-[#231123]/70 border border-[#e6d5e2] dark:border-white/10">
        <div className="flex flex-col">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#B80C09]">
            Personalizar Recomendaciones
          </span>
          <h4 className="text-sm font-bold text-[#231123] dark:text-white mt-0.5">
            Tus Géneros Musicales Favoritos
          </h4>
          <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] mt-0.5">
            Sonar adaptará tu catálogo de recomendaciones basándose en las etiquetas que elijas:
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {GENRE_OPTIONS.map((genre) => {
            const isSelected = formData.preferences?.includes(genre);
            return (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#B80C09] text-white shadow-xs'
                    : 'bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 text-[#5c435a] dark:text-gray-200 hover:border-[#B80C09]/50'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isSelected ? 'check' : 'add'}
                </span>
                <span>{genre}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Button type="submit" variant="primary" className="self-end mt-2 px-7 py-3 cursor-pointer font-bold shadow-lg">
        Guardar Perfil & Preferencias
      </Button>
    </form>
  );
};

export default EditProfileForm;
