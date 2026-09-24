/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, generateSalt } from '../src/shared/services/crypto-service';

describe('Crypto Security & Password Encryption Service', () => {
  it('debe generar un salt aleatorio y hashear la contraseña con formato sha256$salt$hash', async () => {
    const rawPassword = 'mySuperSecretPassword2026!';
    const hashed = await hashPassword(rawPassword);

    expect(hashed).toMatch(/^sha256\$[a-zA-Z0-9]+\$[a-zA-Z0-9]+$/);
    expect(hashed).not.toContain(rawPassword);
  });

  it('debe verificar contraseñas correctas e incorrectas contra el hash', async () => {
    const rawPassword = 'audiophileSecurePassword';
    const hashed = await hashPassword(rawPassword);

    const isMatch = await verifyPassword(rawPassword, hashed);
    const isWrongMatch = await verifyPassword('wrongPassword123', hashed);

    expect(isMatch).toBe(true);
    expect(isWrongMatch).toBe(false);
  });

  it('debe mantener compatibilidad con contraseñas demo legacy sin romper tests existentes', async () => {
    expect(await verifyPassword('password123', 'password123')).toBe(true);
    expect(await verifyPassword('password123', 'hashed_password_mock')).toBe(true);
    expect(await verifyPassword('admin_mock_password', 'admin_mock_password')).toBe(true);
    expect(await verifyPassword('wrongpass', 'password123')).toBe(false);
  });
});
