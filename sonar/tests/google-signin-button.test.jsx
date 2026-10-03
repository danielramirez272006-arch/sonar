import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { GoogleSignInButton } from '../src/features/auth/components/google-signin-button';

beforeEach(() => {
  globalThis.__stubEnv('VITE_GOOGLE_CLIENT_ID', 'test.apps.googleusercontent.com');
  window.google = { accounts: { id: { initialize: jest.fn(), renderButton: jest.fn(), prompt: jest.fn() } } };
});
afterEach(() => { cleanup(); delete window.google; globalThis.__unstubAllEnvs(); });

it('renderiza el botón oficial y entrega la credencial al formulario', async () => {
  const onCredential = jest.fn();
  render(<GoogleSignInButton onCredential={onCredential} />);
  await waitFor(() => expect(window.google.accounts.id.renderButton).toHaveBeenCalled());
  expect(window.google.accounts.id.prompt).not.toHaveBeenCalled();
  window.google.accounts.id.initialize.mock.calls[0][0].callback({ credential: 'signed-token' });
  expect(onCredential).toHaveBeenCalledWith('signed-token');
});

it('muestra un error cuando falta la configuración sin simular una cuenta', async () => {
  globalThis.__stubEnv('VITE_GOOGLE_CLIENT_ID', '');
  const onCredential = jest.fn();
  render(<GoogleSignInButton onCredential={onCredential} />);
  expect((await screen.findByRole('alert')).textContent).toContain('VITE_GOOGLE_CLIENT_ID');
  expect(onCredential).not.toHaveBeenCalled();
});

it('muestra los fallos de inicialización', async () => {
  window.google.accounts.id.renderButton.mockImplementation(() => { throw new Error('Google no disponible'); });
  render(<GoogleSignInButton />);
  expect((await screen.findByRole('alert')).textContent).toContain('Google no disponible');
});
