import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedLogo } from '../ui/animated-logo';
import { Avatar } from '../ui/avatar';
import { useTheme } from '../../context/theme-context';

export const Navbar = ({
  links = [
    { id: 'explore', label: 'Explorar' },
    { id: 'community', label: 'Comunidad' },
  ],
  user = {
    name: 'Mateo Rivaes',
    avatarUrl: '',
  },
  onNavigate = () => {},
}) => {
  const [activeTab, setActiveTab] = useState('explore');
  const { isDark, toggleTheme } = useTheme();

  const handleNavClick = (id) => {
    setActiveTab(id);
    onNavigate(id);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        backgroundColor: 'var(--bg-navbar)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'background-color 0.25s ease, border-color 0.25s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 24px',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Izquierda: AnimatedLogo interactivo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <AnimatedLogo />
        </div>

        {/* Derecha: Enlaces, Botón de Tema (Blanco/Negro) & Mock Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Enlaces de navegación */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {links.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <motion.button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    position: 'relative',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: isActive ? 'var(--text-main)' : 'var(--text-secondary)',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {link.label}

                  {/* Indicador de tab activo animado */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'var(--badge-bg)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        zIndex: -1,
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Botón Switch Modo Blanco / Modo Negro */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            title={isDark ? 'Cambiar a Modo Blanco' : 'Cambiar a Modo Negro'}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--badge-bg)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
          >
            <motion.span
              key={isDark ? 'dark' : 'light'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="material-symbols-outlined"
              style={{ fontSize: '20px' }}
            >
              {isDark ? 'light_mode' : 'dark_mode'}
            </motion.span>
          </motion.button>

          {/* Separador vertical */}
          <div
            style={{
              width: '1px',
              height: '24px',
              backgroundColor: 'var(--border-subtle)',
              transition: 'background-color 0.25s ease',
            }}
          />

          {/* Mock Avatar del usuario */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 12px 4px 4px',
              borderRadius: '24px',
              backgroundColor: 'var(--badge-bg)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
          >
            <Avatar
              src={user?.avatarUrl}
              name={user?.name || 'Mateo Rivaes'}
              size="sm"
            />
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-main)',
              }}
            >
              {user?.name || 'Mi Perfil'}
            </span>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
