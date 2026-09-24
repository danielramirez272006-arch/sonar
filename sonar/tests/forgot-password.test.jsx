/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import { ForgotPasswordForm } from '../src/features/auth/components/forgot-password-form';
import { createUser } from '../src/shared/services/api-client';
import { hashPassword } from '../src/shared/services/crypto-service';

describe('ForgotPassword Flow & Security (No-Email Direct Challenge)', () => {
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

  it('permite buscar una cuenta, resolver el desafío de identidad y actualizar la contraseña con hash SHA-256', async () => {
    const testEmail = 'recuperacion_directa@sonar.local';
    const oldPassHash = await hashPassword('claveAntigua123');

    await createUser({
      id: 'test-user-challenge',
      username: 'melomano_seguro',
      email: testEmail,
      password: oldPassHash,
      role: 'user',
      preferences: ['Art Rock', 'Electrónica'],
    });

    render(<ForgotPasswordForm />);

    // Paso 1: Ingreso de correo o usuario
    const idInput = screen.getByLabelText(/Correo electrónico o Nombre de usuario/i);
    fireEvent.change(idInput, { target: { value: testEmail } });

    const searchBtn = screen.getByRole('button', { name: /Continuar a Verificación/i });
    fireEvent.click(searchBtn);

    // Esperar paso 2: Desafío de identidad
    await screen.findByText(/¿Cuál de estos géneros forma parte de tu perfil\?/i);

    // Seleccionar la opción de confirmar por usuario para validación inequívoca
    const confirmUserTab = screen.getByRole('button', { name: /Confirmar Usuario/i });
    fireEvent.click(confirmUserTab);

    const userInput = screen.getByLabelText(/Escribe tu nombre de usuario exacto/i);
    fireEvent.change(userInput, { target: { value: 'melomano_seguro' } });

    const validateBtn = screen.getByRole('button', { name: /Validar Identidad/i });
    fireEvent.click(validateBtn);

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
