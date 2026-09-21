import React from 'react';
import Navbar from '../../shared/components/layout/navbar';

export const SettingsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8]">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-3xl font-black text-[#B80C09] mb-4">Configuración de la Consola</h1>
        <p className="text-[#5c435a] dark:text-[#B89CB0]">Ajusta parámetros de moderación, webhooks de n8n y llaves de IA.</p>
      </main>
    </div>
  );
};

export default SettingsPage;
