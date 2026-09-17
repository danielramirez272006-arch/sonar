import React from 'react';
import { AnimatedLogo } from '../ui/animated-logo';

export const Footer = () => {
  return (
    <footer
      style={{
        width: '100%',
        backgroundColor: 'var(--bg-footer)',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: '48px',
        transition: 'background-color 0.25s ease, border-color 0.25s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '48px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '36px',
        }}
      >
        {/* Brand Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AnimatedLogo />
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', maxWidth: '380px', lineHeight: 1.6, margin: 0 }}>
            Espacio editorial y red social para melómanos y coleccionistas. Crítica de discos, archivos de vinilo y exploración auditiva de alta fidelidad.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '4px' }}>
            {['podcasts', 'album', 'rss_feed'].map((icon) => (
              <a
                key={icon}
                aria-label={icon}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--badge-bg)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main)',
                  transition: 'all 0.2s ease',
                }}
                href={`#${icon}`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Links Col 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>
            Plataforma
          </h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px', color: 'var(--text-secondary)', listStyle: 'none', padding: 0, margin: 0 }}>
            {['Explorar Discos', 'Críticas del Mes', 'Listas Esenciales', 'Comunidad Audiófila'].map((link) => (
              <li key={link}><a href={`#${link}`} style={{ color: 'inherit' }}>{link}</a></li>
            ))}
          </ul>
        </div>

        {/* Links Col 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>
            Recursos
          </h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px', color: 'var(--text-secondary)', listStyle: 'none', padding: 0, margin: 0 }}>
            {['Colecciones Vinilo', 'API para Desarrolladores', 'Blog Sonar', 'Directorio de Sellos'].map((link) => (
              <li key={link}><a href={`#${link}`} style={{ color: 'inherit' }}>{link}</a></li>
            ))}
          </ul>
        </div>

        {/* Links Col 3 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--text-main)', fontWeight: 800, margin: 0 }}>
            Legal & Privacidad
          </h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px', color: 'var(--text-secondary)', listStyle: 'none', padding: 0, margin: 0 }}>
            {['Privacidad', 'Términos de Uso', 'Pautas Editoriales'].map((link) => (
              <li key={link}><a href={`#${link}`} style={{ color: 'inherit' }}>{link}</a></li>
            ))}
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}
      >
        <p style={{ margin: 0 }}>© 2024 Sonar Audio Media Inc. Todos los derechos reservados.</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
          <span>Sonar Engine v2.4 Activo</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
