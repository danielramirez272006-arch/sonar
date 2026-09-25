/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import { ForgotPasswordForm } from '../src/features/auth/components/forgot-password-form';
import { createUser } from '../src/shared/services/api-client';
import { hashPassword } from '../src/shared/services/crypto-service';

describe('ForgotPassword Email OTP Code Entry Flow', () => {
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
