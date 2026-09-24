/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import { ForgotPasswordForm } from '../src/features/auth/components/forgot-password-form';

describe('ForgotPassword n8n Webhook Form', () => {
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
  });

  afterEach(cleanup);

  it('permite ingresar el correo y dispara el flujo de recuperación hacia n8n con mensaje de confirmación', async () => {
    const testEmail = 'usuario_sonar@gmail.com';

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    fireEvent.change(emailInput, { target: { value: testEmail } });

    const submitBtn = screen.getByRole('button', { name: /Enviar Enlace de Recuperación/i });
    fireEvent.click(submitBtn);

    const successMsg = await screen.findByText(/¡Correo de Recuperación Solicitado!/i);
    expect(successMsg).toBeDefined();

    const checkInboxMsg = await screen.findByText(/Revisa tu bandeja de entrada/i);
    expect(checkInboxMsg).toBeDefined();
  });
});
