/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { AdminRoute } from '../src/shared/routing/admin-route';
import { AuthContext } from '../src/shared/context/auth-context';

describe('AdminRoute Component Security Guard', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const renderWithAuth = (authValues, fallbackContent = <div>Redirigido a Login</div>) => {
    return render(
      <AuthContext.Provider value={authValues}>
        <AdminRoute fallback={fallbackContent}>
          <div data-testid="admin-panel">Panel de Control Administrativo</div>
        </AdminRoute>
      </AuthContext.Provider>
    );
  };

  it('muestra estado de carga mientras se verifica la autenticación', () => {
    renderWithAuth({
      isLoading: true,
      isAuthenticated: false,
      user: null,
    });

    expect(screen.getByText(/Cargando permisos/i)).toBeDefined();
    expect(screen.queryByTestId('admin-panel')).toBeNull();
  });

  it('bloquea el acceso y muestra el fallback si el usuario no está autenticado', () => {
    renderWithAuth({
      isLoading: false,
      isAuthenticated: false,
      user: null,
    });

    expect(screen.getByText('Redirigido a Login')).toBeDefined();
    expect(screen.queryByTestId('admin-panel')).toBeNull();
  });

  it('bloquea el acceso y muestra el fallback si el usuario tiene rol estándar (role="user")', () => {
    renderWithAuth({
      isLoading: false,
      isAuthenticated: true,
      user: {
        id: 'user-standard-1',
        username: 'MelomanoComun',
        role: 'user',
        email: 'user@sonar.local',
      },
    });

    expect(screen.getByText('Redirigido a Login')).toBeDefined();
    expect(screen.queryByTestId('admin-panel')).toBeNull();
  });

  it('permite el acceso al panel administrativo si el usuario tiene rol admin (role="admin")', () => {
    renderWithAuth({
      isLoading: false,
      isAuthenticated: true,
      user: {
        id: 'admin-1',
        username: 'AdminSonar',
        role: 'admin',
        email: 'admin@sonar.local',
      },
    });

    expect(screen.getByTestId('admin-panel')).toBeDefined();
    expect(screen.getByText('Panel de Control Administrativo')).toBeDefined();
    expect(screen.queryByText('Redirigido a Login')).toBeNull();
  });
});
