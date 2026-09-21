import React from 'react';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';

export const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-black text-[#B80C09] mb-6">Términos y Condiciones</h1>
        <p className="text-[#5c435a] dark:text-[#B89CB0] leading-relaxed">
          Bienvenido a Sonar. Al utilizar nuestros servicios de curaduría y reseñas musicales, aceptas nuestros lineamientos de moderación comunitaria y respeto recíproco.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
