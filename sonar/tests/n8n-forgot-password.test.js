/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { requestPasswordResetWebhook } from '../src/shared/services/n8n-webhooks';

describe('n8n Forgot Password OTP Webhook Service', () => {
  it('valida que el correo sea obligatorio', async () => {
    await expect(requestPasswordResetWebhook('')).rejects.toThrow(
      'Debes proporcionar un correo electrónico válido.'
    );
  });

  it('envía email y código al webhook de n8n', async () => {
    const code = '654321';
    const result = await requestPasswordResetWebhook('usuario@sonar.local', code);
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.code).toBe(code);
  });
});
