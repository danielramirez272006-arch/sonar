import React, { useState } from 'react';
import Input from '../../../shared/components/ui/input';
import Button from '../../../shared/components/ui/button';

export const RegisterForm = ({ onRegister = () => {} }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 rounded-3xl p-8 shadow-xl flex flex-col gap-5"
    >
      <div className="text-center">
        <h2 className="text-2xl font-black text-[#231123] dark:text-white">Crea tu Cuenta</h2>
        <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] mt-1">Únete a la comunidad de audiófilos de Sonar</p>
      </div>
      <Input
        label="Nombre de Usuario"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required
      />
      <Input
        label="Correo Electrónico"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <Input
        label="Contraseña"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <Button type="submit" variant="primary" className="w-full mt-2">
        Registrarse
      </Button>
    </form>
  );
};

export default RegisterForm;
