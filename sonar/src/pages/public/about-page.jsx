import React from 'react';
import Navbar from '../../shared/components/layout/navbar';
import Footer from '../../shared/components/layout/footer';

export const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-black tracking-tight text-[#B80C09] mb-6">Acerca de Sonar</h1>
        <p className="text-lg leading-relaxed text-[#5c435a] dark:text-[#B89CB0] mb-8">
          Sonar es una plataforma social dedicada a la crítica musical inmersiva, curaduría de álbumes y análisis lírico contextual impulsado por inteligencia artificial.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
