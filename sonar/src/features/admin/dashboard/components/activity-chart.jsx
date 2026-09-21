import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

/**
 * Mock data: Reseñas publicadas por día de la semana
 */
const mockActivityData = [
  { day: 'Lunes', reviews: 12 },
  { day: 'Martes', reviews: 19 },
  { day: 'Miércoles', reviews: 15 },
  { day: 'Jueves', reviews: 22 },
  { day: 'Viernes', reviews: 30 },
  { day: 'Sábado', reviews: 25 },
  { day: 'Domingo', reviews: 18 },
];

/**
 * Tooltip personalizado adaptado al modo claro y oscuro corporativo
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#231123] px-3.5 py-2.5 rounded-xl border border-[#e6d5e2] dark:border-white/10 shadow-lg text-xs">
        <p className="font-bold text-[#231123] dark:text-[#FAF5F8] mb-1">{label}</p>
        <p className="text-[#B80C09] font-semibold">
          {payload[0].value} {payload[0].value === 1 ? 'reseña' : 'reseñas'}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * ActivityChart Component
 *
 * Gráfico de barras de métricas para el panel de administración.
 *
 * @param {Object} props
 * @param {Array} [props.data] - Conjunto de datos con estructura { day: string, reviews: number }
 * @param {string} [props.title] - Título del gráfico
 * @param {string} [props.className] - Clases CSS adicionales
 */
export const ActivityChart = ({
  data = mockActivityData,
  title = 'Reseñas Publicadas por Día',
  className = '',
}) => {
  return (
    <div
      className={`p-6 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-[0_4px_20px_-2px_rgba(75,40,64,0.06)] dark:shadow-[0_6px_25px_-4px_rgba(0,0,0,0.4)] transition-colors duration-300 w-full ${className}`}
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-[#81737e] dark:text-[#FAF5F8]/70 mt-0.5">
            Actividad semanal de interacción de la comunidad
          </p>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#f8e9f6] dark:bg-[#231123] text-[#B80C09] border border-[#e6d5e2] dark:border-white/10 w-fit">
          +18.4% esta semana
        </span>
      </div>

      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(128, 128, 128, 0.15)"
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#81737e', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#81737e', fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(75, 40, 64, 0.08)' }}
            />
            <Bar
              dataKey="reviews"
              fill="#B80C09"
              radius={[8, 8, 0, 0]}
              animationDuration={1200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityChart;
