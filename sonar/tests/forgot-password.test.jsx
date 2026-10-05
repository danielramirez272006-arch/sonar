import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import { ForgotPasswordForm } from '../src/features/auth/components/forgot-password-form';
import { createUser } from '../src/shared/services/api-client';
import { hashPassword } from '../src/shared/services/crypto-service';

describe('ForgotPassword Email OTP Code Entry Flow', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    window.localStorage.clear();
    global.fetch = jest.fn().mockImplementation((url) => {
      const urlStr = typeof url === 'string' ? url : url?.url || '';
      if (urlStr.includes('/auth/password/reset/request')) {
        const payload = JSON.stringify({ success: true, message: 'Código enviado' });
        return Promise.resolve({
          ok: true,
          status: 200,
          text: async () => payload,
          json: async () => JSON.parse(payload),
        });
      }
      if (urlStr.includes('/auth/password/reset')) {
        const payload = JSON.stringify({ success: true });
        return Promise.resolve({
          ok: true,
          status: 200,
          text: async () => payload,
          json: async () => JSON.parse(payload),
        });
      }
      const empty = JSON.stringify({});
      return Promise.resolve({
        ok: true,
        status: 200,
        text: async () => empty,
        json: async () => ({}),
      });
    });
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

  afterEach(() => {
    global.fetch = originalFetch;
    cleanup();
  });

  it('solicita el código al correo, permite ingresarlo en pantalla y restablece la contraseña', async () => {
    const testEmail = 'melomano_otp@sonar.local';
    const oldPassHash = await hashPassword('claveVieja123');

    await createUser({
      id: 'test-user-otp-entry',
      username: 'melomano_codigo',
      email: testEmail,
      password: oldPassHash,
      role: 'user',
    });

    render(<ForgotPasswordForm />);

    // Paso 1: Ingreso de correo
    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    fireEvent.change(emailInput, { target: { value: testEmail } });

    const submitBtn = screen.getByRole('button', { name: /Enviar Código de Recuperación/i });
    fireEvent.click(submitBtn);

    // Esperar paso 2: Escribir código
    await screen.findByText(/Revisa tu bandeja de entrada o spam/i, {}, { timeout: 10000 });

    // Obtener el input de código y escribir código de 6 dígitos
    const otpInput = await screen.findByLabelText(/Código de 6 dígitos/i, {}, { timeout: 10000 });
    fireEvent.change(otpInput, { target: { value: '123456' } });

    expect(otpInput.value).toBe('123456');
  }, 15000);
});
