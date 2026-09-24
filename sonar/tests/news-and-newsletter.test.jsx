/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NewsPage } from '../src/pages/public/news-page';
import { subscribeNewsletterWebhook } from '../src/shared/services/n8n-webhooks';
import { PlayerProvider } from '../src/shared/context/player-context';
import { AccessibilityProvider } from '../src/shared/context/accessibility-context';
import { ThemeProvider } from '../src/shared/context/theme-context';
import { AuthProvider } from '../src/shared/context/auth-context';

describe('News Page & n8n Newsletter Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const renderNewsPage = () => {
    return render(
      <AuthProvider>
        <ThemeProvider>
          <AccessibilityProvider>
            <PlayerProvider>
              <NewsPage />
            </PlayerProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </AuthProvider>
    );
  };

  it('renderiza la página de noticias con el encabezado editorial y el titular de portada', () => {
    renderNewsPage();

    expect(screen.getByText(/Radar Musical & Actualidad/i)).toBeTruthy();
    expect(screen.getByText(/PERIODISMO & CRÓNICA AUDIÓFILA/i)).toBeTruthy();
    expect(screen.getByText(/PORTADA DE LA SEMANA/i)).toBeTruthy();
  });

  it('permite filtrar noticias por categoría temática', () => {
    renderNewsPage();

    const festButton = screen.getAllByRole('button', { name: /^Festivales$/i })[0];
    fireEvent.click(festButton);

    expect(screen.getByText(/Festivales Revelan Carteles con Actos Estelares/i)).toBeTruthy();
  });

  it('permite buscar noticias por texto en tiempo real', () => {
    renderNewsPage();

    const searchInput = screen.getAllByPlaceholderText(/Buscar noticias/i)[0];
    fireEvent.change(searchInput, { target: { value: 'Daft Punk' } });

    expect(screen.getByText(/El Legado Técnico de Daft Punk/i)).toBeTruthy();
  });

  it('abre el modal inmersivo de lectura al seleccionar un artículo', () => {
    renderNewsPage();

    const readButtons = screen.getAllByRole('button', { name: /^Leer$/i });
    fireEvent.click(readButtons[0]);

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByLabelText(/Cerrar noticia/i)).toBeTruthy();
  });

  it('ejecuta la suscripción al boletín semanal mediante el servicio de webhook n8n', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: '¡Suscripción confirmada! Te hemos enviado un correo de bienvenida a melomano@sonar.audio.',
      }),
    });

    const result = await subscribeNewsletterWebhook({
      email: 'melomano@sonar.audio',
      name: 'Daniel Audiófilo',
      topics: ['Lanzamientos', 'Hi-Fi & Hardware'],
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain('Suscripción confirmada');
    expect(result.subscriber.email).toBe('melomano@sonar.audio');
  });

  it('valida que el correo no esté vacío al suscribirse al newsletter', async () => {
    await expect(subscribeNewsletterWebhook({ email: '' })).rejects.toThrow(
      /correo electrónico válido/i
    );
  });
});
