/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { requestPasswordResetWebhook } from '../src/shared/services/n8n-webhooks';

describe('n8n Forgot Password Webhook Service', () => {
  it('valida que el correo sea obligatorio', async () => {
    await expect(requestPasswordResetWebhook('')).rejects.toThrow(
      'Debes proporcionar un correo electrónico válido.'
    );
  });

  it('envía la petición al webhook de n8n y devuelve respuesta con formato adecuado', async () => {
    const result = await requestPasswordResetWebhook('usuario@sonar.local');
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.message).toContain('Si existe una cuenta asociada a este correo');
  });
});
