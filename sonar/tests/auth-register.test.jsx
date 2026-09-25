/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '../src/shared/context/auth-context';

describe('AuthContext Registration Flow', () => {
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
        addListener: function () {},
        removeListener: function () {},
        addEventListener: function () {},
        removeEventListener: function () {},
        dispatchEvent: function () {},
      };
    };
  });

  afterEach(cleanup);

  it('debe registrar un nuevo usuario y actualizar el estado de autenticación', async () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);

    const uniqueEmail = `daniel_${Date.now()}@sonar.local`;

    await act(async () => {
      await result.current.register({
        username: 'Daniel Ramirez',
        email: uniqueEmail,
        password: 'password123',
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).not.toBe(null);
    expect(result.current.user.username).toBe('Daniel Ramirez');
    expect(result.current.user.email).toBe(uniqueEmail);
    expect(result.current.user.role).toBe('user');
  });

  it('debe registrar un usuario con preferencias de género y permitir modificarlas posteriormente', async () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    const uniqueEmail = `audiophile_${Date.now()}@sonar.local`;
    const initialPrefs = ['Jazz & Fusion', 'Post-Punk'];

    await act(async () => {
      await result.current.register({
        username: 'Elena Jazz',
        email: uniqueEmail,
        password: 'password123',
        preferences: initialPrefs,
        bio: 'Amante del vinilo y el jazz modal.',
      });
    });

    expect(result.current.user.preferences).toEqual(initialPrefs);
    expect(result.current.user.bio).toBe('Amante del vinilo y el jazz modal.');

    // Modificar gustos y perfil
    act(() => {
      result.current.updateUser({
        preferences: ['Synthwave', 'Ambient & Drone', 'IDM / Techno'],
        bio: 'Exploradora de sintetizadores analógicos.',
      });
    });

    expect(result.current.user.preferences).toEqual(['Synthwave', 'Ambient & Drone', 'IDM / Techno']);
    expect(result.current.user.bio).toBe('Exploradora de sintetizadores analógicos.');
  });

  it('detecta si el correo ya está registrado en el paso 1 antes de crear la contraseña', async () => {
    const { createUser } = await import('../src/shared/services/api-client.js');
    const { RegisterForm } = await import('../src/features/auth/components/register-form.jsx');
    const { render, screen, fireEvent } = await import('@testing-library/react');

    const duplicateEmail = 'registrado@sonar.audio';
    await createUser({
      id: 'existing-user-123',
      username: 'usuario_previo',
      email: duplicateEmail,
      password: 'hashedpassword123',
      role: 'user',
    });

    render(
      <AuthProvider>
        <RegisterForm />
      </AuthProvider>
    );

    // Escribir nombre de usuario y correo duplicado
    fireEvent.change(screen.getByPlaceholderText(/tu_usuario/i), { target: { value: 'nuevo_intento' } });
    fireEvent.change(screen.getByPlaceholderText(/tu@ejemplo\.com/i), { target: { value: duplicateEmail } });

    // Intentar continuar al paso 2
    const continueBtn = screen.getByRole('button', { name: /Continuar y Verificar Correo/i });
    await act(async () => {
      fireEvent.click(continueBtn);
    });

    // Debe mostrar el error inmediatamente en el paso 1 sin avanzar a contraseña
    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Este correo ya está registrado en SONAR');
    expect(screen.getByRole('link', { name: /Iniciar Sesión/i })).toBeDefined();
    expect(screen.queryByLabelText(/^Contraseña/i)).toBeNull();
  });
});
