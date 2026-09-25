const initialsOf = name =>
  String(name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toLocaleUpperCase()

export function NewsLabels({ labels, articles, editions, releases, selected, onSelect, onClear }) {
  if (!labels.length) return null

  const countFor = labelId =>
    articles.filter(article => String(article.labelId) === String(labelId)).length
  const vinylCountFor = labelId => editions.filter(edition => String(edition.labelId) === String(labelId)).length
  const releaseCountFor = labelId => releases.filter(release => String(release.labelId) === String(labelId)).length
  const totalNewsFor = labelId => countFor(labelId) + vinylCountFor(labelId) + releaseCountFor(labelId)

  return (
    <section className="sonar-showcase sonar-labels-section" aria-labelledby="sonar-labels-title">
      <header className="sonar-showcase__head">
        <div className="sonar-showcase__intro">
          <span className="sonar-showcase__eyebrow">
            <span className="material-symbols-outlined">domain</span>
            Catálogo editorial
          </span>
          <h2 id="sonar-labels-title" className="sonar-showcase__title">
            Discográficas <span className="sonar-showcase__title-accent">y sus novedades</span>
          </h2>
          <p className="sonar-showcase__lead">
            Selecciona un sello para ver sus lanzamientos, reediciones y anuncios publicados.
          </p>
        </div>
        <span className="sonar-showcase__count">
          <span className="material-symbols-outlined">apartment</span>
          {labels.length} {labels.length === 1 ? 'sello' : 'sellos'}
        </span>
      </header>

      <div className="sonar-labels-grid">
        {labels.map(label => {
          const newsCount = countFor(label.id);
          const totalCount = totalNewsFor(label.id)
          const isActive = selected === String(label.id)

          return (
            <article
              className={`sonar-label-card${isActive ? ' is-active' : ''}`}
              key={label.id}
            >
              <div className="sonar-label-card__art">
                {label.cover ? (
                  <img className="sonar-label-card__cover" src={label.cover} alt={label.name} loading="lazy" />
                ) : (
                  <span className="sonar-label-card__cover sonar-label-card__cover--empty" aria-hidden="true">
                    {initialsOf(label.name)}
                  </span>
                )}
                <span className="sonar-label-card__glow" aria-hidden="true" />
              </div>

              <div className="sonar-label-card__body">
                <span className="sonar-label-card__kicker">Sello discográfico</span>
                <h3 className="sonar-label-card__name">{label.name}</h3>

                <p className="sonar-label-card__meta">
                  {label.country}
                  {label.founded ? ` · Desde ${label.founded}` : ''}
                </p>

                {label.description && <p className="sonar-label-card__text">{label.description}</p>}

                <ul className="sonar-label-card__stats">
                  <li>
                    <strong>{newsCount}</strong>
                    <span>Noticias</span>
                  </li>
                  <li>
                    <strong>{vinylCountFor(label.id)}</strong>
                    <span>Vinilos</span>
                  </li>
                  <li>
                    <strong>{releaseCountFor(label.id)}</strong>
                    <span>Lanzamientos</span>
                  </li>
                </ul>

                <div className="sonar-label-card__footer">
                  {label.website ? (
                    <a
                      className="sonar-label-card__site"
                      href={label.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="material-symbols-outlined">open_in_new</span>
                      Sitio oficial
                    </a>
                  ) : (
                    <span className="sonar-label-card__site is-empty">Sin sitio web</span>
                  )}

                  <button
                    type="button"
                    className="sonar-label-card__cta"
                    aria-pressed={isActive}
                    onClick={() => onSelect(isActive ? '' : String(label.id))}
                  >
                    {isActive ? (
                      <>
                        <span className="material-symbols-outlined">check</span>
                        Filtrando
                      </>
                    ) : (
                      <>
                        Ver novedades ({totalCount})
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {selected && (
        <div className="sonar-labels-section__reset">
          <span className="material-symbols-outlined">filter_alt_off</span>
          Estás viendo solo las novedades de un sello.
          <button type="button" onClick={onClear}>
            Mostrar noticias de todos los sellos
          </button>
        </div>
      )}
    </section>
  )
}
