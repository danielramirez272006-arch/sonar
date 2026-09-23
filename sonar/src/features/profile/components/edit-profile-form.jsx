import React, { useState } from 'react';
import Input from '../../../shared/components/ui/input';
import Button from '../../../shared/components/ui/button';
import Avatar from '../../../shared/components/ui/avatar';
import { GENRE_OPTIONS } from '../../../shared/services/recommendations-service';

const AVATAR_COLOR_PALETTE = [
  '#B80C09', // Crimson
  '#5c1d5e', // Purple
  '#4B2840', // Burgundy
  '#0284c7', // Sky Blue
  '#059669', // Emerald
  '#d97706', // Amber
  '#7c3aed', // Violet
  '#231123', // Midnight
];

export const EditProfileForm = ({ initialData = {}, onSave = () => {} }) => {
  const [formData, setFormData] = useState({
    username: initialData.username || initialData.name || '',
    bio: initialData.bio || '',
    avatarBg: initialData.avatarBg || '#5c1d5e',
    preferences: initialData.preferences || ['Art Rock', 'Electrónica'],
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
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
          className="w-full px-4 py-2.5 rounded-xl border border-[#e6d5e2] dark:border-white/10 bg-white/50 dark:bg-[#231123]/50 text-[#231123] dark:text-white placeholder-[#81737e] focus:outline-hidden focus:ring-2 focus:ring-[#B80C09] transition-all"
          placeholder="Escribe sobre tus géneros predilectos, equipos de audio o discos indispensables..."
        />
      </div>

      {/* Vista Previa & Color de Avatar Distintivo */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-2xl bg-gray-50 dark:bg-[#231123]/60 border border-[#e6d5e2] dark:border-white/10">
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <Avatar
            name={formData.username || 'Usuario'}
            avatarBg={formData.avatarBg}
            size="xl"
            className="ring-4 ring-[#B80C09]/20 shadow-md"
          />
          <span className="text-[11px] font-bold text-[#5c435a] dark:text-[#B89CB0]">
            Vista previa
          </span>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <label className="text-xs font-bold uppercase tracking-wider text-[#5c435a] dark:text-[#B89CB0]">
            Color de Avatar Característico
          </label>
          <p className="text-xs text-[#5c435a]/80 dark:text-[#B89CB0]/80">
            Haz clic en un color para cambiar el fondo de tu avatar en tiempo real:
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {AVATAR_COLOR_PALETTE.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, avatarBg: color })}
                style={{ backgroundColor: color }}
                className={`w-9 h-9 rounded-full cursor-pointer transition-transform hover:scale-110 shadow-xs ring-2 ${
                  formData.avatarBg === color
                    ? 'ring-offset-2 ring-[#B80C09] scale-110 shadow-md'
                    : 'ring-transparent'
                }`}
                title={`Fondo ${color}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Géneros Musicales y Recomendaciones Propias */}
      <div className="flex flex-col gap-2.5 p-5 rounded-2xl bg-gray-50 dark:bg-[#231123]/60 border border-[#e6d5e2] dark:border-white/10">
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

      <Button type="submit" variant="primary" className="self-end mt-2 px-6 py-3 cursor-pointer font-bold">
        Guardar Perfil & Preferencias
      </Button>
    </form>
  );
};

export default EditProfileForm;
