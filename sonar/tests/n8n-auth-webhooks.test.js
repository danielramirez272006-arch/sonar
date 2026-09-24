/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  requestRegisterOtpWebhook,
  notifyLoginAlertWebhook,
  subscribeNewsletterWebhook
} from '../src/shared/services/n8n-webhooks';

describe('n8n Auth Webhook Services (Registro OTP y Alerta de Login)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: 'Acción procesada exitosamente en n8n',
      }),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('requestRegisterOtpWebhook', () => {
    it('valida que el correo sea obligatorio', async () => {
      await expect(requestRegisterOtpWebhook('', 'User123', '123456')).rejects.toThrow(
        'Debes proporcionar un correo electrónico válido.'
      );
    });

    it('envía el código OTP de registro con los datos del usuario al endpoint de n8n', async () => {
      const result = await requestRegisterOtpWebhook('nuevo@sonar.local', 'Audiófilo Pro', '789123');
      expect(result.success).toBe(true);
      expect(result.code).toBe('789123');
      expect(result.email).toBe('nuevo@sonar.local');
      expect(global.fetch).toHaveBeenCalled();
    });

    it('genera un código OTP de 6 dígitos si no se suministra uno', async () => {
      const result = await requestRegisterOtpWebhook('nuevo2@sonar.local', 'Audiófilo 2');
      expect(result.success).toBe(true);
      expect(result.code).toBeDefined();
      expect(result.code.length).toBe(6);
    });
  });

  describe('notifyLoginAlertWebhook', () => {
    it('rechaza si no se proporciona un correo', async () => {
      const result = await notifyLoginAlertWebhook(null);
      expect(result.success).toBe(false);
    });

    it('despacha la alerta de inicio de sesión con datos del dispositivo', async () => {
      const result = await notifyLoginAlertWebhook('usuario@sonar.local', 'Daniel');
      expect(result.success).toBe(true);
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('subscribeNewsletterWebhook', () => {
    it('valida que el correo sea obligatorio', async () => {
      await expect(subscribeNewsletterWebhook('')).rejects.toThrow(
        'Debes proporcionar un correo electrónico válido.'
      );
    });

    it('envía la suscripción al webhook de n8n con preferencias', async () => {
      const result = await subscribeNewsletterWebhook(
        'fan@sonar.local',
        'Carlos',
        ['Lanzamientos en Vinilo']
      );
      expect(result.success).toBe(true);
      expect(result.email).toBe('fan@sonar.local');
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
