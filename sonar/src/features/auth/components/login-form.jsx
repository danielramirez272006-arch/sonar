import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const LoginForm = ({ onSubmit = (e) => e.preventDefault() }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_10px_35px_-5px_rgba(75,40,64,0.08)] dark:shadow-[0_15px_40px_-5px_rgba(0,0,0,0.5)] transition-colors duration-300">
      {/* Header del Formulario */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#231123] dark:text-white tracking-tight">
          Iniciar Sesión
        </h2>
        <p className="text-sm text-[#5c435a] dark:text-[#B89CB0] mt-2">
          Bienvenido de nuevo a la comunidad de Sonar
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Campo Email */}
        <div className="flex flex-col gap-1.5 text-left">
          <label
            htmlFor="email"
            className="text-xs font-bold uppercase tracking-wider text-[#231123] dark:text-gray-200"
          >
            Correo Electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="audiophile@sonar.audio"
            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-[#231123] border border-[#e6d5e2] dark:border-white/10 text-sm text-[#231123] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 outline-none focus:border-[#B80C09] focus:ring-2 focus:ring-[#B80C09]/20"
          />
        </div>

        {/* Campo Contraseña */}
        <div className="flex flex-col gap-1.5 text-left">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-bold uppercase tracking-wider text-[#231123] dark:text-gray-200"
            >
              Contraseña
            </label>
            <a
              href="#forgot-password"
              className="text-xs font-semibold text-[#5c1d5e] dark:text-pink-300 hover:text-[#B80C09] dark:hover:text-[#B80C09] transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••••••"
            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-[#231123] border border-[#e6d5e2] dark:border-white/10 text-sm text-[#231123] dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 outline-none focus:border-[#B80C09] focus:ring-2 focus:ring-[#B80C09]/20"
          />
        </div>

        {/* Botón Entrar */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#B80C09] text-white text-sm font-bold uppercase tracking-wider shadow-[0_8px_20px_-4px_rgba(184,12,9,0.35)] hover:bg-[#9c0a07] transition-all cursor-pointer"
        >
          Entrar
        </motion.button>
      </form>

      {/* Footer del Formulario */}
      <div className="mt-8 text-center border-t border-[#e6d5e2]/80 dark:border-white/10 pt-6">
        <p className="text-xs text-[#5c435a] dark:text-[#B89CB0]">
          ¿No tienes una cuenta?{' '}
          <a
            href="#register"
            className="font-bold text-[#5c1d5e] dark:text-pink-300 hover:text-[#B80C09] dark:hover:text-[#B80C09] transition-colors"
          >
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
