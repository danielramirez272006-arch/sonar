/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup, act } from '@testing-library/react';
import { isExplicitTrack } from '../src/shared/services/deezer-service';
import { AuthProvider, useAuth } from '../src/shared/context/auth-context';
import { PlayerProvider, usePlayer } from '../src/shared/context/player-context';
import { RegisterForm } from '../src/features/auth/components/register-form';

describe('Control Parental & Filtro de Contenido Sonar', () => {
  beforeEach(() => {
    window.localStorage.clear();
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    window.matchMedia = window.matchMedia || function () {
      return {
        matches: false,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
      };
    };
    vi.clearAllMocks();
  });

  afterEach(cleanup);

  describe('1. Detección de Pistas Explícitas (isExplicitTrack)', () => {
    it('detecta pistas explícitas mediante flag booleano o código Deezer', () => {
      expect(isExplicitTrack({ title: 'Wesley\'s Theory', explicit: true })).toBe(true);
      expect(isExplicitTrack({ title: 'Humble', explicit_lyrics: true })).toBe(true);
      expect(isExplicitTrack({ title: 'DNA', explicit_content_lyrics: 1 })).toBe(true);
      expect(isExplicitTrack({ title: 'Track Normal [Explicit]' })).toBe(true);
      expect(isExplicitTrack({ title: 'Track Normal (Explicit)' })).toBe(true);
    });

    it('devuelve false para pistas libres de contenido explícito', () => {
      expect(isExplicitTrack({ title: '15 Step', artist: 'Radiohead' })).toBe(false);
      expect(isExplicitTrack({ title: 'Vespertine', explicit: false })).toBe(false);
      expect(isExplicitTrack(null)).toBe(false);
    });
  });

  describe('2. Auth Context & Cuentas Junior / Estándar', () => {
    function TestAuthComponent() {
      const { user, register, updateParentalControl, verifyParentalPin, isParentalControlActive } = useAuth();
      return (
        <div>
          <span data-testid="user-type">{user?.accountType || 'none'}</span>
          <span data-testid="parental-active">{isParentalControlActive ? 'yes' : 'no'}</span>
          <span data-testid="parental-pin">{user?.parentalControl?.pin || 'none'}</span>
          
          <button
            onClick={() =>
              register({
                username: 'melomano_junior',
                email: `junior_${Date.now()}@sonar.test`,
                password: 'password123',
                accountType: 'junior',
                parentalControl: { enabled: true, blockExplicit: true, pin: '9876' },
              })
            }
          >
            Registrar Junior
          </button>

          <button
            onClick={() =>
              updateParentalControl({
                enabled: true,
                blockExplicit: true,
                pin: '5555',
              })
            }
          >
            Cambiar PIN
          </button>

          <button
            onClick={() => {
              const valid = verifyParentalPin('5555');
              document.getElementById('pin-check-result').textContent = valid ? 'valid' : 'invalid';
            }}
          >
            Verificar PIN
          </button>
          <span id="pin-check-result">none</span>
        </div>
      );
    }

    it('registra una cuenta junior con filtro parental activado y PIN personalizado', async () => {
      render(
        <AuthProvider>
          <TestAuthComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-type').textContent).toBe('none');

      await act(async () => {
        fireEvent.click(screen.getByText('Registrar Junior'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('user-type').textContent).toBe('junior');
        expect(screen.getByTestId('parental-active').textContent).toBe('yes');
        expect(screen.getByTestId('parental-pin').textContent).toBe('9876');
      });

      // Actualizar PIN y verificar
      await act(async () => {
        fireEvent.click(screen.getByText('Cambiar PIN'));
      });
      await waitFor(() => {
        expect(screen.getByTestId('parental-pin').textContent).toBe('5555');
      });

      fireEvent.click(screen.getByText('Verificar PIN'));
      expect(document.getElementById('pin-check-result').textContent).toBe('valid');
    });
  });

  describe('3. Player Context & Bloqueo de Reproducción Explícita', () => {
    function TestPlayerComponent() {
      const { playTrack, explicitLockModal, unlockExplicitWithPin, currentTrack } = usePlayer();
      return (
        <div>
          <span data-testid="locked-modal">{explicitLockModal.isOpen ? 'open' : 'closed'}</span>
          <span data-testid="current-playing">{currentTrack?.title || 'none'}</span>
          
          <button
            onClick={() =>
              playTrack({
                id: 999,
                title: 'Canción Explícita 18+',
                artist: 'Artista Adulto',
                explicit: true,
              })
            }
          >
            Reproducir Explícita
          </button>

          <button onClick={() => unlockExplicitWithPin('1234')}>Desbloquear con PIN</button>
        </div>
      );
    }

    it('bloquea la reproducción de canciones explícitas cuando hay control parental y permite desbloquear con PIN', async () => {
      // Simular usuario junior en localStorage
      window.localStorage.setItem(
        'sonar_auth_user',
        JSON.stringify({
          id: 'test-junior',
          accountType: 'junior',
          parentalControl: { enabled: true, blockExplicit: true, pin: '1234' },
        })
      );

      render(
        <PlayerProvider>
          <TestPlayerComponent />
        </PlayerProvider>
      );

      expect(screen.getByTestId('locked-modal').textContent).toBe('closed');

      // Intentar reproducir canción explícita
      await act(async () => {
        fireEvent.click(screen.getByText('Reproducir Explícita'));
      });

      // Debe abrir el modal de bloqueo y no reproducir directamente
      expect(screen.getByTestId('locked-modal').textContent).toBe('open');

      // Desbloquear con el PIN correcto
      await act(async () => {
        fireEvent.click(screen.getByText('Desbloquear con PIN'));
      });

      expect(screen.getByTestId('locked-modal').textContent).toBe('closed');
    });
  });

  describe('4. Formulario de Registro con Opción Junior', () => {
    it('muestra los botones de selección de cuenta Estándar y Junior con PIN configurable', async () => {
      render(
        <AuthProvider>
          <RegisterForm />
        </AuthProvider>
      );

      expect(screen.getByText('Modalidad de Cuenta & Control Parental')).toBeDefined();
      expect(screen.getByText('Estándar')).toBeDefined();
      expect(screen.getByText('Junior (Segura)')).toBeDefined();

      // Al hacer clic en Junior, debe aparecer el input para configurar el PIN
      fireEvent.click(screen.getByText('Junior (Segura)'));
      expect(screen.getByText(/PIN Parental/i)).toBeDefined();
    }, 15000);
  });
});
