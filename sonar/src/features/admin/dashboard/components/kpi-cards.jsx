import React from 'react';
import { motion } from 'framer-motion';

const kpis = [
  {
    id: 'users',
    title: 'Usuarios Totales',
    value: '1,245',
    change: '+12% este mes',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'reviews',
    title: 'Reseñas Hoy',
    value: '48',
    change: '+5 nuevas en la última hora',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
      </svg>
    ),
  },
  {
    id: 'alerts',
    title: 'Alertas de IA',
    value: '3',
    change: 'Requieren revisión urgente',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

export const KpiCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {kpis.map((kpi) => (
        <motion.div
          key={kpi.id}
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="p-6 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(75,40,64,0.06)] dark:shadow-[0_6px_25px_-4px_rgba(0,0,0,0.4)] transition-colors duration-300 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#5c435a] dark:text-[#B89CB0]">
              {kpi.title}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#f8e9f6] dark:bg-[#231123] text-[#B80C09] flex items-center justify-center border border-[#e6d5e2] dark:border-white/10 shadow-2xs">
              {kpi.icon}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1">
            <span className="text-3xl sm:text-4xl font-black text-[#B80C09] tracking-tight">
              {kpi.value}
            </span>
            <span className="text-xs font-semibold text-[#81737e] dark:text-[#FAF5F8]/70">
              {kpi.change}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default KpiCards;
