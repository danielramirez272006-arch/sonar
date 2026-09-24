import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getLyricsForTrack } from '../src/shared/services/lyrics-service';

describe('Lyrics Service (LRCLIB & Public APIs)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('obtiene la letra correctamente desde la API pública de LRCLIB', async () => {
    const mockLyrics = {
      plainLyrics: 'For a minute there, I lost myself, I lost myself...',
      syncedLyrics: '[00:30.00] For a minute there, I lost myself',
      instrumental: false,
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockLyrics,
    });

    const result = await getLyricsForTrack({
      title: 'Karma Police',
      artist: 'Radiohead',
      album: 'OK Computer',
    });

    expect(result).toBeTruthy();
    expect(result.plainLyrics).toContain('I lost myself');
    expect(result.source).toContain('LRCLIB');
  });

  it('maneja canciones instrumentales sin error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ instrumental: true }),
    });

    const result = await getLyricsForTrack({
      title: 'Clubbed to Death',
      artist: 'Rob Dougan',
    });

    expect(result).toBeTruthy();
    expect(result.instrumental).toBe(true);
    expect(result.plainLyrics).toContain('instrumental');
  });

  it('retorna null ordenadamente si no se encuentra letra o faltan parámetros', async () => {
    const resNoParams = await getLyricsForTrack({});
    expect(resNoParams).toBeNull();

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    const res404 = await getLyricsForTrack({
      title: 'Canción Desconocida',
      artist: 'Artista Inexistente',
    });
    expect(res404).toBeNull();
  });
});
