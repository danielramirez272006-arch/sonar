import React from 'react';
import { motion } from 'framer-motion';

export const AlbumOfTheWeek = () => {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        padding: '56px 24px',
        overflow: 'hidden',
        background: 'var(--bg-page-gradient)',
        transition: 'background 0.25s ease',
      }}
    >
      {/* Resplandor ambiental de fondo */}
      <div
        style={{
          position: 'absolute',
          top: '-6rem',
          left: '25%',
          width: '580px',
          height: '580px',
          borderRadius: '50%',
          background: 'rgba(184, 12, 9, 0.12)',
          filter: 'blur(130px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '33%',
          right: '2.5rem',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'rgba(75, 40, 64, 0.2)',
          filter: 'blur(120px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left: Vinyl Record & Sleeve Presentation */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <div className="relative group cursor-pointer select-none py-4">
            {/* Slide-out Vinyl Record */}
            <div className="absolute top-4 right-0 w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full bg-[#181119] shadow-[0_24px_50px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-700 ease-out transform translate-x-10 group-hover:translate-x-28 sm:group-hover:translate-x-36 group-hover:rotate-45">
              {/* Vinyl Grooves */}
              <div className="absolute inset-2 rounded-full border border-white/10" />
              <div className="absolute inset-6 rounded-full border border-white/10" />
              <div className="absolute inset-10 rounded-full border border-white/10" />
              <div className="absolute inset-14 rounded-full border border-white/10" />
              <div className="absolute inset-20 rounded-full border border-white/10" />
              <div className="absolute inset-28 rounded-full border border-white/10" />

              {/* Vinyl Center Label */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#B80C09] flex flex-col items-center justify-center shadow-inner relative p-3 text-center ring-2 ring-white/20">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#181119] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] mb-1" />
                <span className="text-[11px] uppercase tracking-tighter text-white font-bold leading-none">
                  RADIOHEAD
                </span>
                <span className="text-[9px] text-white/80 tracking-widest mt-0.5 font-medium">
                  SIDE A · 33⅓ RPM
                </span>
              </div>
              {/* Dynamic sheen reflection */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
            </div>

            {/* Album Sleeve Outer Container */}
            <div
              style={{
                position: 'relative',
                zIndex: 10,
                width: '280px',
                height: '280px',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.5s ease',
              }}
              className="sm:!w-[380px] sm:!h-[380px] group-hover:-translate-y-1"
            >
              <img
                className="w-full h-full object-cover"
                alt="In Rainbows by Radiohead"
                src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&auto=format&fit=crop&q=80"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Badge overlay on cover */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <span className="w-2 h-2 rounded-full bg-[#B80C09] animate-ping" />
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--text-main)',
                    letterSpacing: '1px',
                  }}
                >
                  33 RPM LP
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Editorial Content & Metadata */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
        >
          {/* Editorial Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              alignSelf: 'flex-start',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: 'var(--badge-bg)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--badge-text)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              transition: 'all 0.25s ease',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '16px', color: '#B80C09', fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span>ÁLBUM DE LA SEMANA — ELECCIÓN EDITORIAL</span>
          </div>

          {/* Master Title & Metadata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <h1
              style={{
                fontSize: 'clamp(36px, 5vw, 56px)',
                fontWeight: 800,
                color: 'var(--text-main)',
                lineHeight: 1.1,
                letterSpacing: '-1px',
                transition: 'color 0.25s ease',
              }}
            >
              In Rainbows
            </h1>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px',
                color: 'var(--text-secondary)',
                transition: 'color 0.25s ease',
              }}
            >
              <span style={{ fontWeight: 700, color: 'var(--badge-text)' }}>Radiohead</span>
              <span>·</span>
              <span>(2007)</span>
              <span>·</span>
              <span>10 Canciones</span>
              <span>·</span>
              <span>42 min</span>
              <span>·</span>
              <span
                style={{
                  padding: '2px 10px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--badge-bg)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                Art Rock / Experimental
              </span>
            </div>
          </div>

          {/* Interactive Rating Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '4px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined" style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined" style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined" style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="material-symbols-outlined" style={{ fontSize: '24px', fontVariationSettings: "'FILL' 1" }}>star_half</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)' }}>4.8</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                / 5.0 (24,812 calificaciones registradas)
              </span>
            </div>
          </div>

          {/* Editorial Synopsis */}
          <blockquote
            style={{
              padding: '20px',
              borderRadius: '16px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
              transition: 'all 0.25s ease',
            }}
          >
            <p
              style={{
                fontSize: '16px',
                color: 'var(--text-main)',
                lineHeight: 1.6,
                fontStyle: 'italic',
                margin: 0,
              }}
            >
              “Una obra maestra visceral de texturas digitales y calidez analógica. Una experiencia sónica introspectiva y universal que redefinió el canon de la música moderna.”
            </p>
            <div
              style={{
                marginTop: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '10px',
              }}
            >
              <span>— Consejo Editorial Sonar</span>
              <span style={{ fontWeight: 700, color: 'var(--badge-text)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Criterio Impecable
              </span>
            </div>
          </blockquote>

          {/* Community Social Signals */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '12px',
                fontWeight: 500,
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#B80C09' }}>headphones</span>
              <span>89.4k escuchas este mes</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '12px',
                fontWeight: 500,
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--badge-text)' }}>playlist_add_check</span>
              <span>14.2k en listas personales</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '12px',
                backgroundColor: 'var(--badge-bg)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--badge-text)',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#B80C09' }}>military_tech</span>
              <span>#1 en Lo Mejor de 2007</span>
            </div>
          </div>

          {/* Action CTA Suite */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', paddingTop: '6px' }}>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 24px',
                borderRadius: '12px',
                backgroundColor: '#B80C09',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: '0 8px 24px -4px rgba(184, 12, 9, 0.4)',
                border: 'none',
                cursor: 'pointer',
              }}
              type="button"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
              <span>Escuchar Ahora</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 24px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: 'var(--shadow-card)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              type="button"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#B80C09' }}>
                rate_review
              </span>
              <span>Escribir Reseña</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Guardar álbum en lista"
              style={{
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                boxShadow: 'var(--shadow-card)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              type="button"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>bookmark_add</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AlbumOfTheWeek;
