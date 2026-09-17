import React, { useState } from 'react';
import { motion } from 'framer-motion';

const trendingAlbums = [
  {
    id: 1,
    title: 'Currents',
    artist: 'Tame Impala',
    year: '2015',
    genre: 'Psychedelic Pop',
    rating: 4.6,
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'To Pimp a Butterfly',
    artist: 'Kendrick Lamar',
    year: '2015',
    genre: 'Hip Hop / Jazz',
    rating: 4.9,
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Vespertine',
    artist: 'Björk',
    year: '2001',
    genre: 'Glitch Pop / Ambient',
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    title: 'Kid A',
    artist: 'Radiohead',
    year: '2000',
    genre: 'Electronic Rock',
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    title: 'Blonde',
    artist: 'Frank Ocean',
    year: '2016',
    genre: 'R&B / Neo-Soul',
    rating: 4.7,
    cover: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    title: 'Discovery',
    artist: 'Daft Punk',
    year: '2001',
    genre: 'French House / Disco',
    rating: 4.8,
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 7,
    title: 'Abbey Road',
    artist: 'The Beatles',
    year: '1969',
    genre: 'Classic Rock',
    rating: 4.9,
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 8,
    title: 'Melodrama',
    artist: 'Lorde',
    year: '2017',
    genre: 'Art Pop',
    rating: 4.6,
    cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80',
  },
];

const tabs = [
  { id: 'week', label: 'Esta semana' },
  { id: 'acclaimed', label: 'Más aclamados' },
  { id: 'news', label: 'Novedades' },
  { id: 'classics', label: 'Clásicos' },
];

export const TrendingGrid = () => {
  const [activeTab, setActiveTab] = useState('week');

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
          gap: '32px',
        }}
      >
        {/* Section Header & Filter Tabs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                color: 'var(--badge-text)',
                fontWeight: 800,
              }}
            >
              RADAR MUSICAL
            </span>
            <h2
              style={{
                fontSize: 'clamp(24px, 3.5vw, 36px)',
                fontWeight: 800,
                color: 'var(--text-main)',
                margin: 0,
                transition: 'color 0.25s ease',
              }}
            >
              Exploración — Álbumes en Tendencia
            </h2>
          </div>

          {/* Filter Tabs */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              gap: '4px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: 'none',
                    backgroundColor: isActive ? '#B80C09' : 'transparent',
                    color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                  type="button"
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 8 Albums Responsive Card Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}
        >
          {trendingAlbums.map((album) => (
            <motion.div
              key={album.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '16px',
                borderRadius: '16px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)',
                transition: 'all 0.25s ease',
              }}
              className="group"
            >
              {/* Album Image & Hover Actions */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--badge-bg)',
                  marginBottom: '12px',
                }}
              >
                <img
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  className="group-hover:scale-105"
                  alt={album.title}
                  src={album.cover}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 70%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    padding: '12px',
                    transition: 'opacity 0.25s ease',
                  }}
                  className="opacity-0 group-hover:opacity-100"
                >
                  <button
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#B80C09',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                    type="button"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>bookmark_add</span>
                    <span>Guardar</span>
                  </button>
                  <button
                    aria-label="Reproducir muestra"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      color: '#231123',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                    type="button"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>play_arrow</span>
                  </button>
                </div>
              </div>

              {/* Album Title & Rating */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {album.title}
                </span>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--badge-bg)',
                    color: 'var(--text-main)',
                    fontSize: '12px',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '13px', color: '#f59e0b', fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span>{album.rating}</span>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 8px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {album.artist}
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '8px',
                }}
              >
                <span>{album.year}</span>
                <span style={{ fontWeight: 600, color: 'var(--badge-text)' }}>{album.genre}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Discovery Bottom Banner CTA */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            borderRadius: '24px',
            background: 'var(--bg-banner)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
            padding: '40px',
            boxShadow: 'var(--shadow-card-hover)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            color: '#FFFFFF',
          }}
        >
          {/* Ambient interior highlights */}
          <div
            style={{
              position: 'absolute',
              right: '-4rem',
              bottom: '-4rem',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              backgroundColor: 'rgba(184, 12, 9, 0.25)',
              filter: 'blur(80px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '580px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                color: '#ffdad5',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#B80C09' }}>album</span>
              <span>Bitácora de Escucha Personal</span>
            </div>
            <h3 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, margin: 0 }}>
              ¿Listo para registrar tu viaje musical?
            </h3>
            <p style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.85)', margin: 0, lineHeight: 1.5 }}>
              Califica cada surco, escribe ensayos detallados y conecta con audiófilos que sienten la música con la misma intensidad que tú.
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: '14px 24px',
                borderRadius: '12px',
                backgroundColor: '#B80C09',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(184, 12, 9, 0.5)',
              }}
              type="button"
            >
              Crear Cuenta Gratis
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: '14px 24px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                backdropFilter: 'blur(8px)',
                cursor: 'pointer',
              }}
              type="button"
            >
              Explorar Catálogo Completo
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingGrid;
