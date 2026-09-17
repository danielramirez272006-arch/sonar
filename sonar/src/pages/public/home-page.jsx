import React from 'react';
import Navbar from '../../shared/components/layout/navbar';
import AlbumOfTheWeek from '../../features/home/components/album-of-the-week';
import HeroSearch from '../../features/home/components/hero-search';
import FeaturedReviews from '../../features/home/components/featured-reviews';
import TrendingGrid from '../../features/home/components/trending-grid';
import Footer from '../../shared/components/layout/footer';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#231123] text-gray-900 dark:text-[#FAF5F8] flex flex-col transition-colors duration-300">
      {/* Header Navigation with theme toggle */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="w-full flex-1 flex flex-col">
        {/* SECTION HERO: Álbum de la Semana (In Rainbows - Vinyl Slide-out) */}
        <AlbumOfTheWeek />

        {/* SECTION HERO SEARCH: Descubre. Escucha. Reseña. */}
        <HeroSearch />

        {/* SECTION RESEÑAS DESTACADAS: Featured Community Reviews */}
        <FeaturedReviews />

        {/* SECTION CUADRÍCULA DE EXPLORACIÓN: Tendencias & Descubrimiento */}
        <TrendingGrid />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
