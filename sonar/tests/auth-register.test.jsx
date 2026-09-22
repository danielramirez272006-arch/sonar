/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '../src/shared/context/auth-context';

describe('AuthContext Registration Flow', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

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
});
