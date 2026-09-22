export function EditorialGuide() {
  return (
    <section className="editorial-guide dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
      <span className="eyebrow dark:text-pink-300">EL CRITERIO ES HUMANO</span>
      <h2 className="dark:text-white">
        Escuchar.<br />
        Comprender.<br />
        <em className="dark:text-pink-300">Después, decidir.</em>
      </h2>
      <p className="dark:text-gray-300">
        Cuidamos un espacio donde las opiniones distintas puedan sonar juntas.
      </p>
      <details>
        <summary className="dark:text-gray-200 dark:border-gray-700">
          Criterios editoriales <span>↗</span>
        </summary>
        <ul className="dark:text-gray-300">
          <li><strong className="dark:text-white">Escucha atenta.</strong> Valora los argumentos sobre la música.</li>
          <li><strong className="dark:text-white">Autoría original.</strong> Favorece experiencias y opiniones propias.</li>
          <li><strong className="dark:text-white">Pasión y respeto.</strong> La crítica es bienvenida; los ataques personales no.</li>
        </ul>
      </details>
      <span className="guide-rings dark:opacity-20" aria-hidden="true" />
    </section>
  )
}

export default EditorialGuide
