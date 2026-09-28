import { useUIText } from '../../shared/i18n/use-ui-text.js';
import { useTranslation } from '../../shared/context/language-context.jsx';
import { Modal } from '../../shared/components/ui/modal.jsx'

const formatReleaseDate = (value, locale) => {
  if (!value) return ''
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function NewsVinyl({ editions, labels, articles, selected, onSelect, onArticle }) {
  const ui = useUIText();
  const { i18n } = useTranslation();
  const labelFor = edition => labels.find(label => String(label.id) === String(edition.labelId))
  const newsFor = edition => articles.filter(article => String(article.vinylId) === String(edition.id))

  return <>
    {editions.length > 0 && (
      <section className="sonar-showcase sonar-vinyl-section" aria-labelledby="sonar-vinyl-title">
        <header className="sonar-showcase__head">
          <div className="sonar-showcase__intro">
            <span className="sonar-showcase__eyebrow">
              <span className="material-symbols-outlined">album</span>{ui("Analógico")}</span>
            <h2 id="sonar-vinyl-title" className="sonar-showcase__title">{ui("Próximos vinilos")} <span className="sonar-showcase__title-accent">{ui("y reediciones")}</span>
            </h2>
            <p className="sonar-showcase__lead">{ui("Descubre las ediciones anunciadas, sus detalles técnicos y las noticias relacionadas de cada tirada.")}</p>
          </div>
          <span className="sonar-showcase__count">
            <span className="material-symbols-outlined">library_music</span>
            {editions.length} {editions.length === 1 ? ui("edición") : ui("ediciones")}
          </span>
        </header>

        <div className="sonar-vinyl-grid">
          {editions.map(edition => {
            const label = labelFor(edition)
            const relatedNews = newsFor(edition)
            const specs = [
              edition.format && { icon: 'album', label: ui('Formato'), value: edition.format },
              edition.color && { icon: 'palette', label: ui('Color'), value: edition.color },
              edition.catalogNumber && { icon: 'tag', label: ui('Catálogo'), value: edition.catalogNumber },
              edition.releaseDate && { icon: 'event', label: ui('Lanzamiento'), value: formatReleaseDate(edition.releaseDate, i18n.language) },
            ].filter(Boolean)

            return (
              <article className="sonar-vinyl-card" key={edition.id}>
                <div className="sonar-vinyl-card__art">
                  <span className="sonar-vinyl-disc" aria-hidden="true" />
                  {edition.cover ? (
                    <img
                      className="sonar-vinyl-card__cover"
                      src={edition.cover}
                      alt={ui("Portada de {{value0}}", { value0: edition.title })}
                      loading="lazy"
                    />
                  ) : (
                    <span className="sonar-vinyl-card__cover sonar-vinyl-card__cover--empty">
                      <span className="material-symbols-outlined">album</span>
                    </span>
                  )}
                  <span className="sonar-vinyl-card__badge">{edition.editionType || ui("En vinilo")}</span>
                  {relatedNews.length > 0 && (
                    <span className="sonar-vinyl-card__news">
                      <span className="material-symbols-outlined">newspaper</span>
                      {relatedNews.length}
                    </span>
                  )}
                </div>

                <div className="sonar-vinyl-card__body">
                  <h3 className="sonar-vinyl-card__title">{edition.title}</h3>
                  <p className="sonar-vinyl-card__artist">
                    {edition.artist}
                    {edition.year ? <span> · {edition.year}</span> : null}
                  </p>

                  {specs.length > 0 && (
                    <ul className="sonar-vinyl-card__specs">
                      {specs.map(spec => (
                        <li key={spec.label}>
                          <span className="material-symbols-outlined">{spec.icon}</span>
                          <span className="sonar-vinyl-card__spec-label">{spec.label}</span>
                          <span className="sonar-vinyl-card__spec-value">{spec.value}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {label && (
                    <p className="sonar-vinyl-card__label">
                      <span className="material-symbols-outlined">domain</span>
                      {label.name}
                    </p>
                  )}

                  <button
                    type="button"
                    className="sonar-vinyl-card__cta"
                    onClick={() => onSelect(edition)}
                    aria-label={ui("Ver edición de vinilo {{value0}}", { value0: edition.title })}
                  >{ui("Ver edición de vinilo")}<span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    )}

    {selected && (
      <Modal isOpen className="vinyl-detail-modal" title={selected.title} onClose={() => onSelect(null)}>
        {selected.cover && (
          <img
            className="news-edition-cover"
            src={selected.cover}
            alt={ui("Portada de {{value0}}", { value0: selected.title })}
          />
        )}
        <p>{selected.artist}</p>
        <dl className="vinyl-facts">
          {[
            [ui('Año'), selected.year],
            [ui('Lanzamiento'), formatReleaseDate(selected.releaseDate, i18n.language)],
            [ui('Edición'), selected.editionType],
            [ui('Formato'), selected.format],
            [ui('Color'), selected.color],
            [ui('Número de catálogo'), selected.catalogNumber],
            [ui('Discográfica'), labelFor(selected)?.name],
          ]
            .filter(([, value]) => value)
            .map(([name, value]) => (
              <div key={name}>
                <dt>{name}</dt>
                <dd>{value}</dd>
              </div>
            ))}
        </dl>
        <p>{selected.description}</p>
        {labelFor(selected)?.website && (
          <a href={labelFor(selected).website} target="_blank" rel="noopener noreferrer">{ui("Sitio oficial de la discográfica ↗")}</a>
        )}
        <h3>{ui("Noticias de esta edición")}</h3>
        {newsFor(selected).map(article => (
          <button
            className="vinyl-news-link"
            key={article.id}
            onClick={() => {
              onSelect(null)
              onArticle(article)
            }}
          >
            {article.title} →
          </button>
        ))}
        {!newsFor(selected).length && <p>{ui("Aún no hay noticias publicadas para esta edición.")}</p>}
      </Modal>
    )}
  </>
}
