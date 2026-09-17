import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../shared/components/layout/navbar';
import KpiCards from '../../features/admin/dashboard/components/kpi-cards';
import ModerationTable from '../../features/admin/moderation/components/moderation-table';

const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#231123] text-[#231123] dark:text-[#FAF5F8] transition-colors duration-300">
      {/* Navbar Superior */}
      <Navbar />

      {/* Contenedor Principal */}
      <main className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-10"
        >
          {/* Header del Panel */}
          <motion.div variants={itemVariants} className="flex flex-col gap-1 border-b border-[#e6d5e2] dark:border-white/10 pb-5">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-[#f8e9f6] dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 text-[#5c1d5e] dark:text-pink-200 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#B80C09]" />
              <span>Administración & Métricas</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#231123] dark:text-white tracking-tight mt-1">
              Panel de Control
            </h1>
            <p className="text-sm text-[#5c435a] dark:text-[#B89CB0]">
              Monitorea el crecimiento de la plataforma y supervisa el contenido evaluado por la IA.
            </p>
          </motion.div>

          {/* Tarjetas KPI */}
          <motion.section variants={itemVariants} className="flex flex-col gap-4">
            <KpiCards />
          </motion.section>

          {/* Sección de Moderación con IA */}
          <motion.section variants={itemVariants} className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#231123] dark:text-white tracking-tight">
                  Cola de Moderación (IA)
                </h2>
                <p className="text-xs sm:text-sm text-[#5c435a] dark:text-[#B89CB0]">
                  Reseñas marcadas automáticamente por nuestro modelo de lenguaje por posible spoiler o spam.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#81737e] dark:text-[#B89CB0]">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Modelo de Moderación Activo</span>
              </div>
            </div>

            <ModerationTable />
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
