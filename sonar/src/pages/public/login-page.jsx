import React from 'react';
import Navbar from '../../shared/components/layout/navbar';
import LoginForm from '../../features/auth/components/login-form';

export const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#231123] transition-colors duration-300">
      {/* Navbar Superior */}
      <Navbar />

      {/* Contenedor Principal Centrado */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <LoginForm />
      </main>
    </div>
  );
};

export default LoginPage;
