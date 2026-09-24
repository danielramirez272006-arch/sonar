/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import { ForgotPasswordForm } from '../src/features/auth/components/forgot-password-form';
import { createUser } from '../src/shared/services/api-client';
import { hashPassword } from '../src/shared/services/crypto-service';

describe('ForgotPassword Clean Security PIN Flow', () => {
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

  it('permite buscar una cuenta, verificar el código OTP de seguridad y actualizar la contraseña con hash SHA-256', async () => {
    const testEmail = 'seguridad_recov@sonar.local';
    const oldPassHash = await hashPassword('claveAntigua123');

    await createUser({
      id: 'test-user-recov-clean',
      username: 'usuario_seguro',
      email: testEmail,
      password: oldPassHash,
      role: 'user',
    });

    render(<ForgotPasswordForm />);

    // Paso 1: Ingreso de correo
    const emailInput = screen.getByLabelText(/Correo electrónico registrado/i);
    fireEvent.change(emailInput, { target: { value: testEmail } });

    const submitBtn = screen.getByRole('button', { name: /Continuar con Código de Seguridad/i });
    fireEvent.click(submitBtn);

    // Esperar paso 2: Ingreso de código
    await screen.findByText(/Código de verificación emitido/i);

    // Auto-completar el código emitido
    const autoFillBtn = screen.getByRole('button', { name: /Auto-completar/i });
    fireEvent.click(autoFillBtn);

    const verifyBtn = screen.getByRole('button', { name: /Verificar código/i });
    fireEvent.click(verifyBtn);

    // Esperar paso 3: Nueva contraseña
    await screen.findByLabelText(/^Nueva contraseña$/i);

    const newPassInput = screen.getByLabelText(/^Nueva contraseña$/i);
    const confirmPassInput = screen.getByLabelText(/Confirmar nueva contraseña/i);

    fireEvent.change(newPassInput, { target: { value: 'NuevaClaveSegura2026!' } });
    fireEvent.change(confirmPassInput, { target: { value: 'NuevaClaveSegura2026!' } });

    const resetBtn = screen.getByRole('button', { name: /Restablecer Contraseña Cifrada/i });
    fireEvent.click(resetBtn);

    // Esperar paso 4: Éxito
    const successMsg = await screen.findByText(/¡Contraseña Restablecida con Éxito!/i);
    expect(successMsg).toBeDefined();
  });
});
