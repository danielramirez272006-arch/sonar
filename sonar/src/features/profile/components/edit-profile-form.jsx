import { useState } from 'react';
import Input from '../../../shared/components/ui/input';
import Button from '../../../shared/components/ui/button';
import { BlobatarAvatar } from '../../../shared/components/ui/blobatar-avatar';
import { GENRE_OPTIONS } from '../../../shared/services/recommendations-service';

const AVATAR_HUES = [
  { label: 'Carmesí', hue: 12, color: '#B80C09' },
  { label: 'Ciruela', hue: 326, color: '#5c1d5e' },
  { label: 'Borgoña', hue: 344, color: '#4B2840' },
  { label: 'Océano', hue: 220, color: '#0284c7' },
  { label: 'Esmeralda', hue: 160, color: '#059669' },
  { label: 'Ámbar', hue: 55, color: '#d97706' },
];
const AVATAR_TONES = [{ label: 'Claro', tone: 0.2 }, { label: 'Medio', tone: 0.52 }, { label: 'Profundo', tone: 0.82 }];

export const EditProfileForm = ({ initialData = {}, onSave = () => {} }) => {
  const [formData, setFormData] = useState({
    username: initialData.username || initialData.name || '',
    bio: initialData.bio || '',
    avatarHue: initialData.avatarHue ?? 326,
    avatarTone: initialData.avatarTone ?? 0.52,
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

      {/* Personalización determinista del Blobatar */}
      <section className="flex flex-col gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-[#231123]/60 border border-[#e6d5e2] dark:border-white/10" aria-labelledby="blobatar-settings-title">
        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-full ring-4 ring-[#e6d5e2]/70 dark:ring-white/10 shadow-sm"><BlobatarAvatar name={formData.username || 'usuario-sonar'} size={76} active hue={formData.avatarHue} tone={formData.avatarTone} /></div>
          <div><span className="text-xs font-extrabold uppercase tracking-wider text-[#B80C09]">Tu identidad visual</span><h3 id="blobatar-settings-title" className="text-base font-bold text-[#231123] dark:text-white mt-0.5">Personaliza tu Blobatar</h3><p className="text-xs text-[#5c435a] dark:text-[#B89CB0] mt-1">Tu alias define el rostro; elige su matiz y profundidad sin perder tu identidad.</p></div>
        </div>
        <div className="flex flex-col gap-2"><span className="text-xs font-bold uppercase tracking-wider text-[#5c435a] dark:text-[#B89CB0]">Matiz</span><div className="flex flex-wrap items-center gap-3">{AVATAR_HUES.map(({ label, hue, color }) => <button key={hue} type="button" onClick={() => setFormData({ ...formData, avatarHue: hue })} aria-label={`Usar matiz ${label}`} aria-pressed={formData.avatarHue === hue} style={{ backgroundColor: color }} className={`w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110 shadow-xs ring-2 ${formData.avatarHue === hue ? 'ring-offset-2 ring-[#B80C09] scale-110' : 'ring-transparent'}`} />)}</div></div>
        <div className="flex flex-col gap-2"><span className="text-xs font-bold uppercase tracking-wider text-[#5c435a] dark:text-[#B89CB0]">Profundidad de color</span><div className="flex flex-wrap gap-2">{AVATAR_TONES.map(({ label, tone }) => <button key={label} type="button" onClick={() => setFormData({ ...formData, avatarTone: tone })} aria-pressed={formData.avatarTone === tone} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${formData.avatarTone === tone ? 'bg-[#5c1d5e] text-white shadow-xs' : 'bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 text-[#5c435a] dark:text-gray-200 hover:border-[#B80C09]/50'}`}>{label}</button>)}</div></div>
      </section>

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
