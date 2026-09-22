export function EditorialGuide() {
  return (
    <section className="editorial-guide dark:bg-sonar-surface dark:border-sonar-surface dark:text-sonar-text">
      <span className="eyebrow dark:text-pink-300">EL CRITERIO ES HUMANO</span>
      <h2 className="dark:text-sonar-text">
        Escuchar.<br />
        Comprender.<br />
        <em className="dark:text-pink-300">Después, decidir.</em>
      </h2>
      <p className="dark:text-sonar-text/80">
        Cuidamos un espacio donde las opiniones distintas puedan sonar juntas.
      </p>
      <details>
        <summary className="dark:text-sonar-text dark:border-sonar-surface">
          Criterios editoriales <span>↗</span>
        </summary>
        <ul className="dark:text-sonar-text/90">
          <li><strong className="dark:text-sonar-text">Escucha atenta.</strong> Valora los argumentos sobre la música.</li>
          <li><strong className="dark:text-sonar-text">Autoría original.</strong> Favorece experiencias y opiniones propias.</li>
          <li><strong className="dark:text-sonar-text">Pasión y respeto.</strong> La crítica es bienvenida; los ataques personales no.</li>
        </ul>
      </details>
      <span className="guide-rings dark:opacity-20" aria-hidden="true" />
    </section>
  )
}

export default EditorialGuide
