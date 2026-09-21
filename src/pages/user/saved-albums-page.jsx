import React from 'react';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';

export const SavedAlbumsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8]">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        <h1 className="text-3xl font-black text-[#B80C09] mb-6">Álbumes Guardados</h1>
        <p className="text-[#5c435a] dark:text-[#B89CB0]">Tu colección de álbumes favoritos para escuchar más tarde.</p>
      </main>
      <Footer />
    </div>
  );
};

export default SavedAlbumsPage;
