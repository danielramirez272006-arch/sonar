/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { interactionsService } from '../src/shared/services/interactions-service';
import { getRecommendationsForUser, GENRE_OPTIONS } from '../src/shared/services/recommendations-service';

describe('Interactions Service (Likes, Comentarios y Colecciones)', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('debe alternar el estado de like en una reseña y persistirlo', () => {
    const userId = 'test-user-1';
    const reviewId = 999;

    expect(interactionsService.getLikedReviewIds(userId)).toEqual([]);

    // Primer clic: Like
    const isLiked = interactionsService.toggleReviewLike(reviewId, userId);
    expect(isLiked).toBe(true);
    expect(interactionsService.getLikedReviewIds(userId)).toContain(reviewId);

    // Segundo clic: Quitar like
    const isUnliked = interactionsService.toggleReviewLike(reviewId, userId);
    expect(isUnliked).toBe(false);
    expect(interactionsService.getLikedReviewIds(userId)).not.toContain(reviewId);
  });

  it('no debe permitir likes ni persistir estados para usuarios no autenticados (guest/null)', () => {
    expect(interactionsService.getLikedReviewIds(null)).toEqual([]);
    expect(interactionsService.getLikedReviewIds('guest')).toEqual([]);
    expect(interactionsService.toggleReviewLike(123, null)).toBe(false);
    expect(interactionsService.toggleReviewLike(123, 'guest')).toBe(false);
    expect(interactionsService.getLikedReviewIds(null)).toEqual([]);
  });

  it('debe agregar y listar comentarios interactivos para una reseña', () => {
    const reviewId = 888;
    const initialComments = interactionsService.getCommentsForReview(reviewId);
    expect(initialComments).toEqual([]);

    const comment = interactionsService.addCommentToReview(reviewId, {
      userName: 'Carlos Beats',
      userHandle: '@carlos_beats',
      content: 'Excelente paneo estéreo y rango dinámico.',
    });

    expect(comment.id).toBeDefined();
    expect(comment.content).toBe('Excelente paneo estéreo y rango dinámico.');

    const commentsAfter = interactionsService.getCommentsForReview(reviewId);
    expect(commentsAfter.length).toBe(1);
    expect(commentsAfter[0].userName).toBe('Carlos Beats');
  });

  it('debe guardar y remover álbumes de las colecciones del usuario', () => {
    const userId = 'user-collector';
    const testAlbum = {
      id: 'alb-test',
      title: 'Random Access Memories',
      artist: 'Daft Punk',
      year: '2013',
    };

    // Guardar álbum
    const saveRes = interactionsService.toggleSaveAlbum(userId, testAlbum, 'Favoritos');
    expect(saveRes.isSaved).toBe(true);
    expect(interactionsService.isAlbumSaved(userId, 'Random Access Memories')).toBe(true);

    // Quitar de la colección
    const unsaveRes = interactionsService.toggleSaveAlbum(userId, testAlbum);
    expect(unsaveRes.isSaved).toBe(false);
    expect(interactionsService.isAlbumSaved(userId, 'Random Access Memories')).toBe(false);
  });
});

describe('Recommendations Service (Recomendaciones Personalizadas por Usuario)', () => {
  it('debe priorizar álbumes que coincidan con las preferencias de género del usuario', () => {
    const userSynth = {
      username: 'Synth Lover',
      preferences: ['Synthwave', 'Electrónica'],
    };

    const recs = getRecommendationsForUser(userSynth);
    expect(recs.length).toBeGreaterThan(0);

    // Los primeros resultados deben coincidir con Synthwave o Electrónica
    const topRec = recs[0];
    expect(['Synthwave', 'Electrónica']).toContain(topRec.genre);
    expect(topRec.isPreferred).toBe(true);
    expect(topRec.matchReason).toContain('Recomendado porque disfrutas de');
  });

  it('debe contener lista de géneros disponibles', () => {
    expect(GENRE_OPTIONS).toContain('Art Rock');
    expect(GENRE_OPTIONS).toContain('Electrónica');
    expect(GENRE_OPTIONS).toContain('Jazz & Fusion');
  });

  it('debe devolver 0 reseñas y colecciones vacías para un usuario nuevo', () => {
    const newUserId = 'user-new-999';
    expect(interactionsService.getUserReviews(newUserId)).toEqual([]);
    expect(interactionsService.getUserSavedAlbums(newUserId)).toEqual([]);
  });
});

