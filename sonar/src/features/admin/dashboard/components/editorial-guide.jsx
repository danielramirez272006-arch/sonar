import { useUIText } from '../../../../shared/i18n/use-ui-text.js';
export function EditorialGuide() {
  const ui = useUIText();
  return (
    <section className="editorial-guide p-6 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#4B2840] text-gray-900 dark:text-[#DCDCDD]">
      <span className="eyebrow text-gray-500 dark:text-[#DCDCDD]/70 font-bold text-[10px] tracking-wider block mb-1">{ui("EL CRITERIO ES HUMANO")}</span>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-[#DCDCDD] leading-tight my-2">{ui("Escuchar.")}<br />{ui("Comprender.")}<br />
        <em className="font-serif italic text-[#B80C09] dark:text-[#ff4d4a]">{ui("Después, decidir.")}</em>
      </h2>
      <p className="text-xs text-gray-600 dark:text-[#DCDCDD]/80 mb-4 leading-relaxed">{ui("Cuidamos un espacio donde las opiniones distintas puedan sonar juntas.")}</p>
      <details className="mt-2">
        <summary className="text-xs text-gray-800 dark:text-[#DCDCDD] border-t border-gray-200 dark:border-white/10 pt-3 font-bold cursor-pointer">{ui("Criterios editoriales")} <span>↗</span>
        </summary>
        <ul className="text-xs text-gray-700 dark:text-[#DCDCDD]/85 mt-2 pl-4 space-y-1">
          <li><strong className="text-gray-900 dark:text-[#DCDCDD]">{ui("Escucha atenta.")}</strong> {ui("Valora los argumentos sobre la música.")}</li>
          <li><strong className="text-gray-900 dark:text-[#DCDCDD]">{ui("Autoría original.")}</strong> {ui("Favorece experiencias y opiniones propias.")}</li>
          <li><strong className="text-gray-900 dark:text-[#DCDCDD]">{ui("Pasión y respeto.")}</strong> {ui("La crítica es bienvenida; los ataques personales no.")}</li>
        </ul>
      </details>
      <span className="guide-rings dark:opacity-20" aria-hidden="true" />
    </section>
  )
}

export default EditorialGuide
