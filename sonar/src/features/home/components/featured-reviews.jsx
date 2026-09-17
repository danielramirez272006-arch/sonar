import React from 'react';
import { motion } from 'framer-motion';

const reviewsData = [
  {
    id: 1,
    author: '@sofia_sound',
    badge: 'Crítica Verificada',
    badgeIcon: 'verified',
    badgeColor: '#B80C09',
    avatarLetter: 'S',
    avatarBg: '#5c1d5e',
    rating: 5,
    text: "“Cada surco de este álbum parece respirar con una pulsación biológica. 'Reckoner' y 'Nude' alcanzan un nivel de producción y vulnerabilidad que pocos discos en la historia moderna han logrado igualar. Una lección de sobriedad y espacialidad acústica.”",
    album: {
      title: 'In Rainbows',
      artist: 'Radiohead · 2007',
      cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=80',
    },
    likes: 842,
    comments: 64,
    timeAgo: 'Hace 2 horas',
  },
  {
    id: 2,
    author: '@marcos_vinyl',
    badge: 'Top Reseñador',
    badgeIcon: 'award_star',
    badgeColor: '#f59e0b',
    avatarLetter: 'M',
    avatarBg: '#4B2840',
    rating: 4.5,
    text: "“Un torbellino de ritmos hipnóticos y sintetizadores etéreos. La mezcla envolvente en vinilo te sumerge en una atmósfera lúcida de la que no quieres salir jamás. El rango dinámico en pista analógica es demoledor.”",
    album: {
      title: 'Random Access Memories',
      artist: 'Daft Punk · 2013',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    },
    likes: 619,
    comments: 38,
    timeAgo: 'Hace 5 horas',
  },
  {
    id: 3,
    author: '@elena_analog',
    badge: 'Curadora',
    badgeIcon: 'auto_awesome',
    badgeColor: '#75527b',
    avatarLetter: 'E',
    avatarBg: '#75527b',
    rating: 5,
    text: "“La perfecta intersección entre melancolía nocturna y poesía lírica. Un viaje sonoro indispensable para entender la evolución de la música urbana experimental en la última década.”",
    album: {
      title: 'Untrue',
      artist: 'Burial · 2007',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    },
    likes: 523,
    comments: 47,
    timeAgo: 'Hace 1 día',
  },
];

export const FeaturedReviews = () => {
  return (
    <section
      style={{
        width: '100%',
        padding: '56px 24px',
        backgroundColor: 'var(--bg-page)',
        transition: 'background-color 0.25s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '12px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '16px',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                color: '#B80C09',
                fontWeight: 800,
              }}
            >
              DISCURSO & ANÁLISIS
            </span>
            <h2
              style={{
                fontSize: 'clamp(24px, 3.5vw, 36px)',
                fontWeight: 800,
                color: 'var(--text-main)',
                margin: '4px 0 0 0',
                transition: 'color 0.25s ease',
              }}
            >
              Reseñas Destacadas
            </h2>
            <p
              style={{
                fontSize: '15px',
                color: 'var(--text-secondary)',
                margin: '4px 0 0 0',
                transition: 'color 0.25s ease',
              }}
            >
              Voces críticas y oyentes apasionados compartiendo su perspectiva musical en alta resolución.
            </p>
          </div>
          <a
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--text-main)',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
            }}
            href="#reviews"
            onMouseEnter={(e) => (e.currentTarget.style.color = '#B80C09')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
          >
            <span>Ver todas (1.2k)</span>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              arrow_forward
            </span>
          </a>
        </div>

        {/* 3 Featured Critique Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {reviewsData.map((review) => (
            <motion.article
              key={review.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px',
                borderRadius: '16px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)',
                transition: 'all 0.25s ease',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Review Author Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: review.avatarBg,
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      }}
                    >
                      {review.avatarLetter}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
                        {review.author}
                      </span>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--badge-text)',
                        }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: '14px', color: review.badgeColor, fontVariationSettings: "'FILL' 1" }}
                        >
                          {review.badgeIcon}
                        </span>
                        <span>{review.badge}</span>
                      </span>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined"
                        style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}
                      >
                        {i < Math.floor(review.rating)
                          ? 'star'
                          : review.rating % 1 !== 0 && i === Math.floor(review.rating)
                          ? 'star_half'
                          : 'star'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Review Text Excerpt */}
                <p
                  style={{
                    fontSize: '14.5px',
                    color: 'var(--text-main)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {review.text}
                </p>

                {/* Album Reference Strip */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--badge-bg)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <img
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      alt={review.album.title}
                      src={review.album.cover}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {review.album.title}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {review.album.artist}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Metadata */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  marginTop: '16px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'var(--text-muted)' }}
                    type="button"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#B80C09' }}>favorite</span>
                    <span>{review.likes} likes</span>
                  </button>
                  <button
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'var(--text-muted)' }}
                    type="button"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chat_bubble</span>
                    <span>{review.comments} comentarios</span>
                  </button>
                </div>
                <span>{review.timeAgo}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedReviews;
