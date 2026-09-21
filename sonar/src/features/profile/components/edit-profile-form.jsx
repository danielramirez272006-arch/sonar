import React, { useState } from 'react';
import Input from '../../../shared/components/ui/input';
import Button from '../../../shared/components/ui/button';

export const EditProfileForm = ({ initialData = {}, onSave = () => {} }) => {
  const [formData, setFormData] = useState({
    username: initialData.username || '',
    bio: initialData.bio || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <Input
        label="Nombre de Usuario"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#5c435a] dark:text-[#B89CB0]">
          Biografía
        </label>
        <textarea
          rows={3}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-[#e6d5e2] dark:border-white/10 bg-white/50 dark:bg-[#231123]/50 text-[#231123] dark:text-white placeholder-[#81737e] focus:outline-hidden focus:ring-2 focus:ring-[#B80C09]"
          placeholder="Escribe algo sobre tus gustos musicales…"
        />
      </div>
      <Button type="submit" variant="primary" className="self-end mt-2">
        Guardar Cambios
      </Button>
    </form>
  );
};

export default EditProfileForm;
