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

  it('debe permitir a los usuarios responder a comentarios existentes', () => {
    const reviewId = 777;
    const comment = interactionsService.addCommentToReview(reviewId, {
      userName: 'Sofía Sound',
      userHandle: '@sofia_sound',
      content: '¿Alguien sabe qué sintetizador usaron en la pista 3?',
    });

    const replyRes = interactionsService.addReplyToComment(reviewId, comment.id, {
      userName: 'Mateo Rivaes',
      userHandle: '@mateorivaes',
      content: 'Usaron un Roland Juno-106 con chorus activado.',
    });

    expect(replyRes.newReply.id).toBeDefined();
    expect(replyRes.newReply.content).toBe('Usaron un Roland Juno-106 con chorus activado.');
    
    const comments = interactionsService.getCommentsForReview(reviewId);
    expect(comments[0].replies.length).toBe(1);
    expect(comments[0].replies[0].userName).toBe('Mateo Rivaes');
  });

  it('debe permitir reportar comentarios inapropiados y registrar el motivo', () => {
    const userId = 'user-reporter-1';
    const commentId = 'c-inapropiado-99';

    expect(interactionsService.getReportedCommentIds(userId)).toEqual([]);

    const reported = interactionsService.reportComment(userId, {
      commentId,
      commentText: 'comentario ofensivo',
      commentUser: 'Hater',
      reason: 'Lenguaje ofensivo o subido de tono',
      details: 'Insultos directos en la reseña',
    });

    expect(reported).toBe(true);
    expect(interactionsService.getReportedCommentIds(userId)).toContain(commentId);
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

  it('debe guardar canciones y álbumes por igual en favoritos distinguiendo su tipo', () => {
    const userId = 'user-fav-songs-albums';
    const testSong = {
      id: 'track-456',
      trackId: 'track-456',
      title: 'Get Lucky',
      artist: 'Daft Punk',
      album: 'Random Access Memories',
      type: 'track',
      preview: 'https://preview.url/get-lucky.mp3',
    };

    const testAlbum = {
      id: 'alb-789',
      title: 'Discovery',
      artist: 'Daft Punk',
      year: '2001',
      type: 'album',
    };

    // Guardar canción
    const songRes = interactionsService.toggleSaveAlbum(userId, testSong, 'Favoritos');
    expect(songRes.isSaved).toBe(true);
    expect(interactionsService.isAlbumSaved(userId, 'track-456')).toBe(true);
    expect(interactionsService.isAlbumSaved(userId, 'Get Lucky')).toBe(true);

    // Guardar álbum
    const albumRes = interactionsService.toggleSaveAlbum(userId, testAlbum, 'Colección Vinilo');
    expect(albumRes.isSaved).toBe(true);
    expect(interactionsService.isAlbumSaved(userId, 'Discovery')).toBe(true);

    const saved = interactionsService.getUserSavedAlbums(userId);
    expect(saved.length).toBe(2);

    const savedSongs = saved.filter((i) => i.type === 'track' || Boolean(i.trackId));
    const savedAlbums = saved.filter((i) => i.type !== 'track' && !i.trackId);

    expect(savedSongs.length).toBe(1);
    expect(savedSongs[0].title).toBe('Get Lucky');
    expect(savedAlbums.length).toBe(1);
    expect(savedAlbums[0].title).toBe('Discovery');
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

