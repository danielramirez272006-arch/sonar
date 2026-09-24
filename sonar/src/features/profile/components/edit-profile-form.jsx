import React, { useState, useRef } from 'react';
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
  UploadCloud,
  Trash2,
  Type,
  Check,
  Pipette,
  Layers,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Speaker,
  Cpu,
  Award
} from 'lucide-react';
import Input from '../../../shared/components/ui/input';
import Button from '../../../shared/components/ui/button';
import Avatar from '../../../shared/components/ui/avatar';
import { BlobatarAvatar } from '../../../shared/components/ui/blobatar-avatar';
import { GENRE_OPTIONS } from '../../../shared/services/recommendations-service';
import { useAuth } from '../../../shared/context/auth-context';

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
  const { changePassword, deleteAccount } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'gear' | 'security' | 'danger'
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    username: initialData.username || initialData.name || '',
    bio: initialData.bio || '',
    avatarBg: initialData.avatarBg || '#5c1d5e',
    avatarStyle: initialData.avatarStyle || (initialData.avatarUrl ? 'image' : 'blobatar'),
    avatarSeed: initialData.avatarSeed || initialData.username || 'vinyl-master',
    avatarIcon: initialData.avatarIcon || 'headphones',
    avatarUrl: initialData.avatarUrl || '',
    avatarHue: initialData.avatarHue ?? 18,
    avatarTone: initialData.avatarTone ?? 'vivid',
    bannerUrl: initialData.bannerUrl || '',
    bannerGradient: initialData.bannerGradient || 'linear-gradient(135deg, rgba(184, 12, 9, 0.7) 0%, rgba(75, 40, 64, 0.95) 100%)',
    preferences: initialData.preferences || ['Art Rock', 'Electrónica'],
    gear: initialData.gear || {
      headphones: 'Sennheiser HD 600',
      turntable: 'Technics SL-1200 / Direct Drive',
      dacAmp: 'DAC Hi-Fi 24-bit/192kHz',
      favoriteFormat: 'Vinilo 33⅓ RPM',
    },
    badges: initialData.badges || ['Melómano Verificado', 'Audiófilo Vinilo'],
  });

  const [colorMode, setColorMode] = useState(
    formData.avatarBg?.includes('gradient') ? 'gradient' : 'solid'
  );
  const [customColor, setCustomColor] = useState(
    formData.avatarBg?.startsWith('#') ? formData.avatarBg : '#B80C09'
  );

  // Estados y handlers para subida de imagen de avatar
  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [bannerUploadError, setBannerUploadError] = useState(null);

  const processBannerFile = (file) => {
    if (!file) return;
    setBannerUploadError(null);

    if (!file.type.startsWith('image/')) {
      setBannerUploadError('Por favor selecciona una imagen válida (PNG, JPG, WEBP).');
      return;
    }

    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      setBannerUploadError('La imagen de portada supera los 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({
        ...prev,
        bannerUrl: e.target.result,
      }));
    };
    reader.onerror = () => {
      setBannerUploadError('Error al leer el archivo de portada.');
    };
    reader.readAsDataURL(file);
  };

  const processImageFile = (file) => {
    if (!file) return;
    setUploadError(null);

    if (!file.type.startsWith('image/')) {
      setUploadError('Por favor selecciona un archivo de imagen válido (PNG, JPG, JPEG, WEBP o GIF).');
      return;
    }

    const maxSizeBytes = 8 * 1024 * 1024; // 8MB
    if (file.size > maxSizeBytes) {
      setUploadError('La imagen supera el tamaño máximo permitido de 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setFormData((prev) => ({
        ...prev,
        avatarUrl: dataUrl,
        avatarStyle: 'image',
      }));
    };
    reader.onerror = () => {
      setUploadError('Ocurrió un error al leer la imagen. Inténtalo de nuevo.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Estados de cambio de contraseña
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passError, setPassError] = useState(null);
  const [passSuccess, setPassSuccess] = useState(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

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
      avatarHue: Math.floor(Math.random() * 360),
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (!oldPassword) {
      setPassError('Por favor ingresa tu contraseña actual.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPassError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('Las nuevas contraseñas no coinciden.');
      return;
    }

    setIsChangingPass(true);
    try {
      if (changePassword) {
        await changePassword(oldPassword, newPassword);
      }
      setPassSuccess('¡Tu contraseña ha sido cifrada y actualizada con éxito (SHA-256 + Salt)!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPassError(err.message || 'No se pudo actualizar la contraseña.');
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Pestañas de navegación de configuración */}
      <div className="flex items-center gap-2 border-b border-[#e6d5e2] dark:border-white/10 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-[#B80C09] text-white shadow-xs'
              : 'bg-gray-100 dark:bg-white/5 text-[#5c435a] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
          }`}
        >
          <Palette size={16} />
          <span>Perfil & Avatar Studio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gear')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'gear'
              ? 'bg-[#B80C09] text-white shadow-xs'
              : 'bg-gray-100 dark:bg-white/5 text-[#5c435a] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
          }`}
        >
          <Headphones size={16} />
          <span>Equipamiento Audiófilo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'security'
              ? 'bg-[#B80C09] text-white shadow-xs'
              : 'bg-gray-100 dark:bg-white/5 text-[#5c435a] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
          }`}
        >
          <Lock size={16} />
          <span>Seguridad & Cifrado</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('danger')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'danger'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-gray-100 dark:bg-white/5 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/30'
          }`}
        >
          <Trash2 size={16} />
          <span>Eliminar Cuenta</span>
        </button>
      </div>

      {/* TAB 1: PERFIL & AVATAR STUDIO */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Nombre de Usuario / Firma"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="ej. Mateo Rivaes"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#342632] dark:text-gray-300">
              Biografía / Manifiesto Musical
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Cuéntale a la comunidad tus discos de cabecera o qué buscas en una masterización..."
              className="w-full p-3.5 rounded-2xl border border-[#e6d5e2] dark:border-white/10 bg-[#fbedf9] dark:bg-[#231123] text-sm text-[#231123] dark:text-white placeholder-[#876a84] focus:outline-none focus:border-[#B80C09] transition-all resize-none"
            />
          </div>

          {/* AVATAR STUDIO */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gray-50/80 dark:bg-[#231123]/70 border border-[#e6d5e2] dark:border-white/10 flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#e6d5e2] dark:border-white/10 pb-4">
              <div className="flex items-center gap-4">
                <Avatar
                  name={formData.username || 'Usuario'}
                  avatarBg={formData.avatarBg}
                  avatarStyle={formData.avatarStyle}
                  avatarSeed={formData.avatarSeed}
                  avatarIcon={formData.avatarIcon}
                  src={formData.avatarUrl}
                  size="xl"
                  className="shrink-0 shadow-lg ring-4 ring-white dark:ring-white/10"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-black uppercase tracking-wider text-[#B80C09] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Avatar Studio
                  </span>
                  <h4 className="text-base font-extrabold text-[#231123] dark:text-white">
                    Identidad Visual
                  </h4>
                  <p className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                    Personaliza tu avatar con más de 34 combinaciones cromáticas.
                  </p>
                </div>
              </div>

              {formData.avatarStyle === 'blobatar' && (
                <button
                  type="button"
                  onClick={handleRandomizeSeed}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#4B2840] hover:bg-[#f8e9f6] text-[#5c1d5e] dark:text-pink-200 border border-[#e6d5e2] dark:border-white/10 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Dices className="w-4 h-4" />
                  <span>Generar Aleatorio</span>
                </button>
              )}
            </div>

            {/* Selector de Estilo de Avatar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'blobatar', label: 'Caras Blobatar', icon: Sparkles },
                { id: 'initials', label: 'Inicial Tipográfica', icon: Type },
                { id: 'icon', label: 'Ícono de Género', icon: Disc },
                { id: 'image', label: 'Subir Imagen', icon: UploadCloud },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatarStyle: style.id })}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    formData.avatarStyle === style.id
                      ? 'bg-[#B80C09] text-white border-[#B80C09] shadow-sm'
                      : 'bg-white dark:bg-[#4B2840] border-[#e6d5e2] dark:border-white/10 text-[#5c435a] dark:text-gray-300 hover:border-[#B80C09]/40'
                  }`}
                >
                  <style.icon className="w-4 h-4" />
                  <span>{style.label}</span>
                </button>
              ))}
            </div>

            {/* Contenido condicional: Subir Imagen desde el dispositivo */}
            {formData.avatarStyle === 'image' && (
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                  className="hidden"
                  id="avatar-file-input"
                />

                {formData.avatarUrl ? (
                  <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 gap-4 shadow-xs">
                    <div className="flex items-center gap-3.5">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#B80C09] shrink-0 bg-gray-100 dark:bg-black/40 shadow-xs">
                        <img
                          src={formData.avatarUrl}
                          alt="Vista previa del avatar subido"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#231123] dark:text-white flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-emerald-500" /> Imagen cargada con éxito
                        </span>
                        <span className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                          Tu foto será visible en todas tus reseñas y perfil
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-100 dark:bg-white/10 hover:bg-[#B80C09] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>Cambiar Foto</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: '', avatarStyle: 'blobatar' }))}
                        className="p-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Eliminar foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 text-center cursor-pointer ${
                      isDragging
                        ? 'border-[#B80C09] bg-[#B80C09]/10 scale-[1.01]'
                        : 'border-[#e6d5e2] dark:border-white/15 bg-white dark:bg-[#4B2840] hover:border-[#B80C09]/60 hover:bg-rose-50/30 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-[#B80C09]/20 text-[#B80C09] dark:text-rose-300 flex items-center justify-center shadow-xs">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#231123] dark:text-white block">
                        Haz clic para seleccionar o arrastra tu foto aquí
                      </span>
                      <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] mt-0.5">
                        Archivos PNG, JPG, JPEG, WEBP o GIF (hasta 8MB)
                      </p>
                    </div>
                  </div>
                )}

                {uploadError && (
                  <span className="text-xs font-bold text-red-500 flex items-center gap-1">
                    {uploadError}
                  </span>
                )}
              </div>
            )}

            {formData.avatarStyle === 'icon' && (
              <div className="flex flex-wrap gap-2">
                {ICON_CHOICES.map((ic) => (
                  <button
                    key={ic.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatarIcon: ic.id })}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      formData.avatarIcon === ic.id
                        ? 'bg-[#B80C09] text-white border-[#B80C09]'
                        : 'bg-white dark:bg-[#4B2840] border-[#e6d5e2] text-[#231123] dark:text-gray-200'
                    }`}
                  >
                    <ic.icon size={15} />
                    <span>{ic.name}</span>
                  </button>
                ))}
              </div>
            )}

            {formData.avatarStyle === 'blobatar' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BLOBATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatarSeed: preset.seed })}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left flex items-center gap-2 transition-all cursor-pointer ${
                      formData.avatarSeed === preset.seed
                        ? 'bg-[#B80C09]/10 border-[#B80C09] text-[#B80C09] dark:text-pink-300 ring-2 ring-[#B80C09]/30'
                        : 'bg-white dark:bg-[#4B2840] border-[#e6d5e2] dark:border-white/10 text-[#5c435a] dark:text-gray-200'
                    }`}
                  >
                    <BlobatarAvatar name={preset.seed} size={28} />
                    <span className="truncate">{preset.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Paletas de color (24 sólidos + 10 degradados) */}
            <div className="flex flex-col gap-3 pt-2 border-t border-[#e6d5e2] dark:border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#342632] dark:text-gray-300">
                  Fondo del Avatar
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setColorMode('solid')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      colorMode === 'solid' ? 'bg-[#B80C09] text-white' : 'bg-white dark:bg-[#4B2840] text-gray-500'
                    }`}
                  >
                    24 Sólidos
                  </button>
                  <button
                    type="button"
                    onClick={() => setColorMode('gradient')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      colorMode === 'gradient' ? 'bg-[#B80C09] text-white' : 'bg-white dark:bg-[#4B2840] text-gray-500'
                    }`}
                  >
                    10 Degradados
                  </button>
                </div>
              </div>

              {colorMode === 'solid' ? (
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                  {SOLID_PALETTES.map((item) => (
                    <button
                      key={item.color}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, avatarBg: item.color });
                        setCustomColor(item.color);
                      }}
                      className={`w-8 h-8 rounded-xl cursor-pointer transition-transform flex items-center justify-center ${
                        formData.avatarBg === item.color ? 'scale-125 ring-2 ring-white shadow-md' : 'hover:scale-110'
                      }`}
                      style={{ background: item.color }}
                      title={item.name}
                    >
                      {formData.avatarBg === item.color && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {GRADIENT_PALETTES.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatarBg: item.gradient })}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer ${
                        formData.avatarBg === item.gradient ? 'border-[#B80C09] ring-2 ring-[#B80C09]/40' : 'border-white/10'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-lg shrink-0" style={{ background: item.gradient }} />
                      <span className="truncate text-xs">{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* PORTADA / BANNER STUDIO */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gray-50/80 dark:bg-[#231123]/70 border border-[#e6d5e2] dark:border-white/10 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#e6d5e2] dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-[#B80C09]/10 text-[#B80C09]">
                  <ImageIcon className="w-5 h-5" />
                </span>
                <div className="flex flex-col">
                  <h4 className="text-base font-extrabold text-[#231123] dark:text-white">
                    Portada de Perfil (Banner)
                  </h4>
                  <p className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                    Personaliza la imagen o degradado de cabecera de tu perfil público.
                  </p>
                </div>
              </div>

              <input
                type="file"
                ref={bannerInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processBannerFile(file);
                }}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                id="banner-file-input"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-[#B80C09] hover:bg-[#960a07] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Subir Imagen</span>
                </button>
                {formData.bannerUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, bannerUrl: '' }))}
                    className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-white/10 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    Quitar
                  </button>
                )}
              </div>
            </div>

            {bannerUploadError && (
              <p className="text-xs text-rose-500 font-bold">{bannerUploadError}</p>
            )}

            {/* Previsualización del banner */}
            <div
              className="w-full h-24 sm:h-28 rounded-2xl overflow-hidden relative shadow-inner border border-[#e6d5e2] dark:border-white/10"
              style={{
                background: formData.bannerUrl
                  ? `url(${formData.bannerUrl}) center/cover no-repeat`
                  : formData.bannerGradient,
              }}
            >
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <span className="text-xs font-bold text-white bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs">
                  {formData.bannerUrl ? 'Imagen personalizada activa' : 'Degradado predeterminado'}
                </span>
              </div>
            </div>

            {/* Selector rápido de degradados para el banner */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs font-bold text-[#5c435a] dark:text-[#B89CB0]">
                O elige un estilo de atmósfera sonora:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {GRADIENT_PALETTES.slice(0, 5).map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        bannerUrl: '',
                        bannerGradient: item.gradient,
                      }))
                    }
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      !formData.bannerUrl && formData.bannerGradient === item.gradient
                        ? 'border-[#B80C09] ring-2 ring-[#B80C09]/40'
                        : 'border-[#e6d5e2] dark:border-white/10'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-md shrink-0" style={{ background: item.gradient }} />
                    <span className="truncate text-[11px] text-[#231123] dark:text-white">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* GÉNEROS MUSICALES */}
          <div className="flex flex-col gap-2.5 p-5 rounded-3xl bg-gray-50/80 dark:bg-[#231123]/70 border border-[#e6d5e2] dark:border-white/10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#B80C09]">
              Gustos Musicales
            </span>
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
                        : 'bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 text-[#5c435a] dark:text-gray-200'
                    }`}
                  >
                    <span>{isSelected ? '✓' : '+'}</span>
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
      )}

      {/* TAB 2: EQUIPAMIENTO AUDIÓFILO */}
      {activeTab === 'gear' && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-gray-50/80 dark:bg-[#231123]/70 border border-[#e6d5e2] dark:border-white/10 flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-[#e6d5e2] dark:border-white/10 pb-3">
              <Speaker className="w-6 h-6 text-[#B80C09]" />
              <div>
                <h4 className="text-base font-black text-[#231123] dark:text-white">Equipamiento de Escucha</h4>
                <p className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                  Comparte tus dispositivos de alta fidelidad con la comunidad Sonar.
                </p>
              </div>
            </div>

            <Input
              label="Auriculares / Monitores Principales"
              value={formData.gear?.headphones || ''}
              onChange={(e) => setFormData({ ...formData, gear: { ...formData.gear, headphones: e.target.value } })}
              placeholder="ej. Sennheiser HD 600, Beyerdynamic DT 990 Pro, Focal Clear"
            />

            <Input
              label="Tocadiscos / Tornamesa o DAC Principal"
              value={formData.gear?.turntable || ''}
              onChange={(e) => setFormData({ ...formData, gear: { ...formData.gear, turntable: e.target.value } })}
              placeholder="ej. Technics SL-1200GR, Audio-Technica LP120X, Rega Planar 3"
            />

            <Input
              label="Amplificador / DAC / Previo de Fono"
              value={formData.gear?.dacAmp || ''}
              onChange={(e) => setFormData({ ...formData, gear: { ...formData.gear, dacAmp: e.target.value } })}
              placeholder="ej. Schiit Magni/Modi Stack, Marantz PM6007, Cambridge Audio"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#342632] dark:text-gray-300">
                Formato de Escucha Predilecto
              </label>
              <select
                value={formData.gear?.favoriteFormat || 'Vinilo 33⅓ RPM'}
                onChange={(e) => setFormData({ ...formData, gear: { ...formData.gear, favoriteFormat: e.target.value } })}
                className="w-full p-3 rounded-2xl border border-[#e6d5e2] dark:border-white/10 bg-[#fbedf9] dark:bg-[#231123] text-sm text-[#231123] dark:text-white font-bold"
              >
                <option value="Vinilo 33⅓ RPM">Vinilo 33⅓ RPM (Prensaje Analógico)</option>
                <option value="FLAC 24-bit/96kHz (Lossless)">FLAC 24-bit / 96kHz (Lossless Hi-Res)</option>
                <option value="Streaming Hi-Fi">Streaming Hi-Fi (Deezer FLAC / Tidal Master)</option>
                <option value="Cassette / Cinta Magnética">Cassette / Cinta Magnética Vintage</option>
                <option value="CD Audio Red Book 16-bit/44.1kHz">CD Audio Red Book (16-bit/44.1kHz)</option>
              </select>
            </div>
          </div>

          <Button type="submit" variant="primary" className="self-end mt-2 px-7 py-3 cursor-pointer font-bold shadow-lg">
            Guardar Equipamiento
          </Button>
        </form>
      )}

      {/* TAB 3: SEGURIDAD & CAMBIO DE CONTRASEÑA */}
      {activeTab === 'security' && (
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-gray-50/80 dark:bg-[#231123]/70 border border-[#e6d5e2] dark:border-white/10 flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-[#e6d5e2] dark:border-white/10 pb-3">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <div>
                <h4 className="text-base font-black text-[#231123] dark:text-white">Cifrado & Seguridad de la Cuenta</h4>
                <p className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
                  Tu contraseña se procesa mediante algoritmo criptográfico <b>SHA-256 con Salt único</b>.
                </p>
              </div>
            </div>

            {passError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold">
                {passError}
              </div>
            )}

            {passSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                {passSuccess}
              </div>
            )}

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#342632] dark:text-gray-300">
                Contraseña Actual
              </label>
              <div className="relative">
                <input
                  type={showOldPass ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                  required
                  className="w-full pr-10 pl-3.5 py-2.5 rounded-2xl border border-[#e6d5e2] dark:border-white/10 bg-[#fbedf9] dark:bg-[#231123] text-sm text-[#231123] dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPass(!showOldPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-white"
                >
                  {showOldPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 relative">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#342632] dark:text-gray-300">
                Nueva Contraseña (Mínimo 6 caracteres)
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Crea una contraseña segura"
                  required
                  className="w-full pr-10 pl-3.5 py-2.5 rounded-2xl border border-[#e6d5e2] dark:border-white/10 bg-[#fbedf9] dark:bg-[#231123] text-sm text-[#231123] dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-white"
                >
                  {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#342632] dark:text-gray-300">
                Confirmar Nueva Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu nueva contraseña"
                required
                className="w-full pl-3.5 py-2.5 rounded-2xl border border-[#e6d5e2] dark:border-white/10 bg-[#fbedf9] dark:bg-[#231123] text-sm text-[#231123] dark:text-white"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isChangingPass}
            className="self-end mt-2 px-7 py-3 cursor-pointer font-bold shadow-lg"
          >
            {isChangingPass ? 'Cifrando con SHA-256...' : 'Actualizar Contraseña Cifrada'}
          </Button>
        </form>
      )}

      {/* TAB 4: PRIVACIDAD Y ZONA DE PELIGRO */}
      {activeTab === 'danger' && (
        <div className="flex flex-col gap-6">
          {/* EXPORTACIÓN DE DATOS PERSONALES */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 flex flex-col gap-4 shadow-xs">
            <div className="flex items-center gap-3 text-[#231123] dark:text-white">
              <span className="material-symbols-outlined text-2xl text-[#B80C09]">download</span>
              <div>
                <h4 className="text-base font-extrabold">Portabilidad: Exportar mis Datos (JSON)</h4>
                <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] mt-0.5">
                  Descarga una copia completa de tu perfil, críticas publicadas, colecciones guardadas y preferencias.
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const exportPayload = {
                    user: formData,
                    exportedAt: new Date().toISOString(),
                    system: 'SONAR Audio Community',
                  };
                  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `sonar_datos_${formData.username || 'usuario'}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                <span>Descargar Archivo JSON</span>
              </Button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <Trash2 className="w-6 h-6 shrink-0" />
              <div>
                <h4 className="text-base font-black">Zona de Peligro: Eliminar Cuenta Permanentemente</h4>
                <p className="text-xs text-rose-700/80 dark:text-rose-300/80 mt-0.5">
                  Esta acción es irreversible. Se eliminará tu perfil, configuración, preferencias y registros de sesión en Sonar.
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-700 dark:text-rose-200 text-xs font-bold">
                {deleteError}
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2 border-t border-rose-500/20">
              <label className="text-xs font-bold text-[#231123] dark:text-gray-200">
                Para confirmar la eliminación, escribe <span className="font-mono font-extrabold text-rose-600 dark:text-rose-400">ELIMINAR MI CUENTA</span>:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="ELIMINAR MI CUENTA"
                className="w-full px-4 py-2.5 rounded-2xl border border-rose-300 dark:border-rose-900 bg-white dark:bg-[#231123] text-sm text-[#231123] dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab('profile')}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                disabled={deleteConfirmText.trim() !== 'ELIMINAR MI CUENTA' || isDeleting}
                onClick={async () => {
                  setDeleteError(null);
                  setIsDeleting(true);
                  try {
                    await deleteAccount();
                  } catch (err) {
                    setDeleteError(err.message || 'No se pudo eliminar la cuenta.');
                    setIsDeleting(false);
                  }
                }}
                className={`px-6 py-2.5 rounded-2xl text-xs font-bold text-white transition-all cursor-pointer ${
                  deleteConfirmText.trim() === 'ELIMINAR MI CUENTA'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-md'
                    : 'bg-gray-400 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                }`}
              >
                {isDeleting ? 'Eliminando cuenta...' : 'Confirmar y Eliminar Definitivamente'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfileForm;
