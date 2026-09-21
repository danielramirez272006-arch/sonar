import React from 'react';
import Navbar from '../../shared/components/layout/navbar';

export const UsersPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8]">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-3xl font-black text-[#B80C09] mb-4">Gestión de Usuarios</h1>
        <p className="text-[#5c435a] dark:text-[#B89CB0]">Supervisa y gestiona los roles de la comunidad Sonar.</p>
      </main>
    </div>
  );
};

export default UsersPage;
