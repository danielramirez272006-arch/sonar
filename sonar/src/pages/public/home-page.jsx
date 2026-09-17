import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import AlbumOfTheWeek from '../../features/home/components/album-of-the-week';
import HeroSearch from '../../features/home/components/hero-search';
import FeaturedReviews from '../../features/home/components/featured-reviews';
import TrendingGrid from '../../features/home/components/trending-grid';
import Footer from '../../shared/components/layout/footer';
import Skeleton from '../../shared/components/ui/loader';

const pageContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const HomePageSkeleton = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-10 py-8 flex flex-col gap-12">
      {/* Skeleton Hero / Álbum de la semana */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-6">
        <div className="lg:col-span-6 flex justify-center items-center">
          <Skeleton
            variant="rounded"
            className="w-[240px] h-[240px] sm:w-[340px] sm:h-[340px] shadow-md"
          />
        </div>
        <div className="lg:col-span-6 flex flex-col gap-4">
          <Skeleton width="220px" height="26px" variant="rounded" />
          <Skeleton width="85%" height="48px" variant="rounded" />
          <Skeleton width="60%" height="20px" variant="text" />
          <Skeleton width="180px" height="28px" variant="rounded" />
          <Skeleton width="100%" height="90px" variant="rounded" />
          <div className="flex gap-3 pt-2">
            <Skeleton width="140px" height="44px" variant="rounded" />
            <Skeleton width="140px" height="44px" variant="rounded" />
            <Skeleton width="44px" height="44px" variant="rounded" />
          </div>
        </div>
      </div>

      {/* Skeleton Hero Search */}
      <div className="flex flex-col items-center gap-4 py-8 max-w-[700px] mx-auto w-full">
        <Skeleton width="75%" height="44px" variant="rounded" />
        <Skeleton width="90%" height="20px" variant="text" />
        <Skeleton width="100%" height="56px" variant="rounded" className="mt-2" />
      </div>

      {/* Skeleton Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} height="240px" variant="rounded" />
        ))}
      </div>
    </div>
  );
};

export const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#fff7fa] dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] flex flex-col transition-colors duration-300">
      {/* Barra de Navegación fija */}
      <Navbar />

      <main className="w-full flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HomePageSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={pageContainerVariants}
              initial="hidden"
              animate="visible"
              className="w-full flex-1 flex flex-col"
            >
              {/* Álbum de la Semana (Hero Vinilo) */}
              <AlbumOfTheWeek />

              {/* Buscador Principal */}
              <HeroSearch />

              {/* Reseñas Destacadas */}
              <FeaturedReviews />

              {/* Cuadrícula de Tendencias & Banner */}
              <TrendingGrid />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Pie de Página */}
      <Footer />
    </div>
  );
};

export default HomePage;
