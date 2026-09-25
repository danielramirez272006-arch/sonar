// Servicio de Interacciones: Likes, Comentarios y Colecciones Personales

const STORAGE_KEYS = {
  LIKED_REVIEWS: 'sonar_liked_reviews',
  LIKED_COMMENTS: 'sonar_liked_comments',
  DISLIKED_COMMENTS: 'sonar_disliked_comments',
  COMMENTS_STORE: 'sonar_review_comments',
  USER_COLLECTIONS: 'sonar_user_collections',
  REPORTED_COMMENTS: 'sonar_reported_comments',
  REPORTED_REVIEWS: 'sonar_reported_reviews',
  RECENTLY_PLAYED: 'sonar_recently_played',
};

// Comentarios iniciales enriquecidos para las reseñas
const INITIAL_MOCK_COMMENTS = {
  1: [
    {
      id: 'c-1-1',
      reviewId: 1,
      userName: 'Marcos Vinyl',
      userHandle: '@marcos_vinyl',
      avatarLetter: 'M',
      avatarBg: '#B80C09',
      content: 'Totalmente de acuerdo con "Reckoner". El paneo de la batería de Phil Selway en audífonos de estudio es una locura.',
      timestamp: 'Hace 45 min',
      likes: 12,
      replies: [
        {
          id: 'r-1-1-1',
          commentId: 'c-1-1',
          userName: 'Elena Analog',
          userHandle: '@elena_analog',
          avatarLetter: 'E',
          avatarBg: '#75527b',
          content: '¡Exacto! Y la reverb en la voz de Thom Yorke le da esa atmósfera única.',
          timestamp: 'Hace 30 min',
          likes: 4,
        },
      ],
    },
    {
      id: 'c-1-2',
      reviewId: 1,
      userName: 'Elena Analog',
      userHandle: '@elena_analog',
      avatarLetter: 'E',
      avatarBg: '#75527b',
      content: 'La calidez de las cuerdas en "Faust Arp" complementa perfecto la mezcla. Mi disco favorito de la década.',
      timestamp: 'Hace 1 hora',
      likes: 8,
      replies: [],
    },
  ],
  2: [
    {
      id: 'c-2-1',
      reviewId: 2,
      userName: 'Sofía Sound',
      userHandle: '@sofia_sound',
      avatarLetter: 'S',
      avatarBg: '#5c1d5e',
      content: 'El solo de sintetizador modular de "Digital Love" sigue siendo inigualable.',
      timestamp: 'Hace 30 min',
      likes: 15,
      replies: [],
    },
  ],
  3: [
    {
      id: 'c-3-1',
      reviewId: 3,
      userName: 'Carlos Beats',
      userHandle: '@carlos_beats',
      avatarLetter: 'C',
      avatarBg: '#231123',
      content: 'Vespertine es una lección de producción con micro-sonidos orgánicos.',
      timestamp: 'Hace 2 horas',
      likes: 6,
      replies: [],
    },
  ],
  4: [
    {
      id: 'c-4-1',
      reviewId: 4,
      userName: 'Valeria Moreno',
      userHandle: '@val_acoustics',
      avatarLetter: 'V',
      avatarBg: '#5c1d5e',
      content: 'El bajo con compresión agresiva en Let It Happen es legendario.',
      timestamp: 'Hace 3 horas',
      likes: 9,
      replies: [],
    },
  ],
};

function getStorage(key, fallback) {
  try {
    if (typeof window === 'undefined') return fallback;
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    console.error(`Error guardando ${key} en localStorage:`, e);
  }
}

export const interactionsService = {
  // LIKES
  getLikedReviewIds(userId) {
    if (!userId || userId === 'guest' || userId === 'default') return [];
    const all = getStorage(STORAGE_KEYS.LIKED_REVIEWS, {});
    return all[userId] || [];
  },

  toggleReviewLike(reviewId, userId) {
    if (!userId || userId === 'guest' || userId === 'default') return false;
    const all = getStorage(STORAGE_KEYS.LIKED_REVIEWS, {});
    const userLikes = all[userId] || [];
    const isLiked = userLikes.includes(reviewId);
    let updated;
    if (isLiked) {
      updated = userLikes.filter((id) => id !== reviewId);
    } else {
      updated = [...userLikes, reviewId];
    }
    all[userId] = updated;
    setStorage(STORAGE_KEYS.LIKED_REVIEWS, all);
    return !isLiked;
  },

  getLikedCommentIds(userId) {
    if (!userId || userId === 'guest' || userId === 'default') return [];
    const all = getStorage(STORAGE_KEYS.LIKED_COMMENTS, {});
    return all[userId] || [];
  },

  getDislikedCommentIds(userId) {
    if (!userId || userId === 'guest' || userId === 'default') return [];
    const all = getStorage(STORAGE_KEYS.DISLIKED_COMMENTS, {});
    return all[userId] || [];
  },

  toggleCommentLike(commentId, userId) {
    if (!userId || userId === 'guest' || userId === 'default') {
      return { isLiked: false, isDisliked: false };
    }
    const likesStore = getStorage(STORAGE_KEYS.LIKED_COMMENTS, {});
    const dislikesStore = getStorage(STORAGE_KEYS.DISLIKED_COMMENTS, {});

    const userLikes = likesStore[userId] || [];
    const userDislikes = dislikesStore[userId] || [];

    const isLiked = userLikes.includes(commentId);
    let nextLikes;
    let nextDislikes = userDislikes;

    if (isLiked) {
      nextLikes = userLikes.filter((id) => id !== commentId);
    } else {
      nextLikes = [...userLikes, commentId];
      // Quitar de dislikes si estaba con corazón roto
      nextDislikes = userDislikes.filter((id) => id !== commentId);
    }

    likesStore[userId] = nextLikes;
    dislikesStore[userId] = nextDislikes;
    setStorage(STORAGE_KEYS.LIKED_COMMENTS, likesStore);
    setStorage(STORAGE_KEYS.DISLIKED_COMMENTS, dislikesStore);

    return { isLiked: !isLiked, isDisliked: false };
  },

  toggleCommentDislike(commentId, userId) {
    if (!userId || userId === 'guest' || userId === 'default') {
      return { isLiked: false, isDisliked: false };
    }
    const likesStore = getStorage(STORAGE_KEYS.LIKED_COMMENTS, {});
    const dislikesStore = getStorage(STORAGE_KEYS.DISLIKED_COMMENTS, {});

    const userLikes = likesStore[userId] || [];
    const userDislikes = dislikesStore[userId] || [];

    const isDisliked = userDislikes.includes(commentId);
    let nextDislikes;
    let nextLikes = userLikes;

    if (isDisliked) {
      nextDislikes = userDislikes.filter((id) => id !== commentId);
    } else {
      nextDislikes = [...userDislikes, commentId];
      // Quitar de likes si tenía corazón
      nextLikes = userLikes.filter((id) => id !== commentId);
    }

    likesStore[userId] = nextLikes;
    dislikesStore[userId] = nextDislikes;
    setStorage(STORAGE_KEYS.LIKED_COMMENTS, likesStore);
    setStorage(STORAGE_KEYS.DISLIKED_COMMENTS, dislikesStore);

    return { isLiked: false, isDisliked: !isDisliked };
  },

  // COMENTARIOS
  getCommentsForReview(reviewId) {
    const store = getStorage(STORAGE_KEYS.COMMENTS_STORE, INITIAL_MOCK_COMMENTS);
    return store[reviewId] || [];
  },

  addCommentToReview(reviewId, commentData) {
    const store = getStorage(STORAGE_KEYS.COMMENTS_STORE, INITIAL_MOCK_COMMENTS);
    const current = store[reviewId] || [];
    const newComment = {
      id: `c-${reviewId}-${Date.now()}`,
      reviewId,
      userName: commentData.userName || 'Usuario Sonar',
      userId: commentData.userId,
      userHandle: commentData.userHandle || '@usuario',
      avatarLetter: commentData.avatarLetter || commentData.userName?.charAt(0) || 'U',
      avatarBg: commentData.avatarBg || '#5c1d5e',
      content: commentData.content,
      timestamp: 'Ahora mismo',
      likes: 0,
      dislikes: 0,
      replies: [],
      createdAt: new Date().toISOString(),
    };
    store[reviewId] = [newComment, ...current];
    setStorage(STORAGE_KEYS.COMMENTS_STORE, store);
    return newComment;
  },

  addReplyToComment(reviewId, commentId, replyData) {
    const store = getStorage(STORAGE_KEYS.COMMENTS_STORE, INITIAL_MOCK_COMMENTS);
    const current = store[reviewId] || [];
    const newReply = {
      id: `r-${commentId}-${Date.now()}`,
      commentId,
      userName: replyData.userName || 'Usuario Sonar',
      userId: replyData.userId,
      userHandle: replyData.userHandle || '@usuario',
      avatarLetter: replyData.avatarLetter || replyData.userName?.charAt(0) || 'U',
      avatarBg: replyData.avatarBg || '#5c1d5e',
      content: replyData.content,
      timestamp: 'Ahora mismo',
      likes: 0,
      dislikes: 0,
      createdAt: new Date().toISOString(),
    };

    const updated = current.map((c) => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [...(c.replies || []), newReply],
        };
      }
      return c;
    });

    store[reviewId] = updated;
    setStorage(STORAGE_KEYS.COMMENTS_STORE, store);
    return { newReply, comments: updated };
  },

  // REPORTES DE COMENTARIOS Y RESEÑAS
  getReportedCommentIds(userId) {
    if (!userId || userId === 'guest' || userId === 'default') return [];
    const all = getStorage(STORAGE_KEYS.REPORTED_COMMENTS, {});
    return all[userId] || [];
  },

  getReportedReviewIds(userId) {
    if (!userId || userId === 'guest' || userId === 'default') return [];
    const all = getStorage(STORAGE_KEYS.REPORTED_REVIEWS, {});
    return all[userId] || [];
  },

  reportComment(userId, reportPayload) {
    if (!userId || userId === 'guest' || userId === 'default') return false;
    const all = getStorage(STORAGE_KEYS.REPORTED_COMMENTS, {});
    const userReports = all[userId] || [];
    const commentId = reportPayload.commentId || reportPayload.targetId;

    if (commentId && !userReports.includes(commentId)) {
      all[userId] = [...userReports, commentId];
      setStorage(STORAGE_KEYS.REPORTED_COMMENTS, all);
    }

    // Guardar en bitácora de reportes para administración/auditoría
    const reportsLog = getStorage('sonar_reports_log', []);
    const newReportEntry = {
      id: `rep-c-${Date.now()}`,
      reportedBy: userId,
      type: 'comment',
      commentId: commentId,
      commentText: reportPayload.commentText || reportPayload.targetContent || '',
      commentUser: reportPayload.commentUser || reportPayload.targetUser || '',
      reason: reportPayload.reason || reportPayload.reasonTitle || 'Lenguaje inapropiado o subido de tono',
      reasonId: reportPayload.reasonId || 'hate_speech',
      tags: reportPayload.tags || [],
      details: reportPayload.details || '',
      timestamp: reportPayload.timestamp || new Date().toISOString(),
      status: 'pending_review',
    };
    setStorage('sonar_reports_log', [newReportEntry, ...reportsLog]);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('sonar:comment-reported', {
          detail: newReportEntry,
        })
      );
    }

    return true;
  },

  reportReview(userId, reportPayload) {
    if (!userId || userId === 'guest' || userId === 'default') return false;
    const all = getStorage(STORAGE_KEYS.REPORTED_REVIEWS, {});
    const userReports = all[userId] || [];
    const reviewId = reportPayload.reviewId || reportPayload.targetId;

    if (reviewId && !userReports.includes(reviewId)) {
      all[userId] = [...userReports, reviewId];
      setStorage(STORAGE_KEYS.REPORTED_REVIEWS, all);
    }

    const reportsLog = getStorage('sonar_reports_log', []);
    const newReportEntry = {
      id: `rep-r-${Date.now()}`,
      reportedBy: userId,
      type: 'review',
      reviewId: reviewId,
      reviewTitle: reportPayload.reviewTitle || reportPayload.targetTitle || '',
      reviewText: reportPayload.reviewText || reportPayload.targetContent || '',
      reviewUser: reportPayload.reviewUser || reportPayload.targetUser || '',
      reason: reportPayload.reason || reportPayload.reasonTitle || 'Contenido inadecuado en reseña',
      reasonId: reportPayload.reasonId || 'other',
      tags: reportPayload.tags || [],
      details: reportPayload.details || '',
      timestamp: reportPayload.timestamp || new Date().toISOString(),
      status: 'pending_review',
    };
    setStorage('sonar_reports_log', [newReportEntry, ...reportsLog]);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('sonar:review-reported', {
          detail: newReportEntry,
        })
      );
    }

    return true;
  },

  getReportsLog() {
    return getStorage('sonar_reports_log', []);
  },

  // RESEÑAS PROPIAS DEL USUARIO
  getUserReviews(userId) {
    if (!userId) return [];
    const uidStr = String(userId);
    const reviewsStore = getStorage('sonar_user_reviews', {});
    if (reviewsStore[uidStr] && Array.isArray(reviewsStore[uidStr])) {
      return reviewsStore[uidStr];
    }
    // Solo el usuario demo 1 (Mateo) tiene reseñas históricas precargadas si no hay nada guardado
    if (uidStr === '1' || uidStr === 'mateo') {
      return [
        {
          id: 101,
          userName: 'Mateo Rivaes',
          userHandle: '@mateorivaes',
          avatarLetter: 'M',
          avatarBg: '#5c1d5e',
          date: 'Hace 3 días',
          rating: 4.7,
          albumTitle: 'In Rainbows',
          artist: 'Radiohead',
          cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
          content:
            'Una obra maestra que equilibra con elegancia la experimentación electrónica y la calidez acústica. "Reckoner" sigue siendo una de las piezas mejor mezcladas en la historia de la música moderna.',
          likesCount: 28,
          commentsCount: 3,
        },
        {
          id: 102,
          userName: 'Mateo Rivaes',
          userHandle: '@mateorivaes',
          avatarLetter: 'M',
          avatarBg: '#5c1d5e',
          date: 'Hace 1 semana',
          rating: 4.9,
          albumTitle: 'Discovery',
          artist: 'Daft Punk',
          cover: 'https://cdn-images.dzcdn.net/images/cover/5718f7c81c27e0b2417e2a4c45224f8a/500x500-000000-80-0-0.jpg',
          content:
            'Una producción envolvente y melodías memorables. El sampleo en Digital Love y los arpegios de sintetizador modular son una clase magistral.',
          likesCount: 42,
          commentsCount: 5,
        },
      ];
    }
    return [];
  },

  addUserReview(userId, reviewData) {
    if (!userId) return null;
    const uidStr = String(userId);
    const reviewsStore = getStorage('sonar_user_reviews', {});
    const current = this.getUserReviews(uidStr);
    const newRev = {
      id: Date.now(),
      userId: uidStr,
      userName: reviewData.userName || 'Usuario Sonar',
      userHandle: reviewData.userHandle || '@usuario',
      avatarLetter: reviewData.avatarLetter || reviewData.userName?.charAt(0).toUpperCase() || 'U',
      avatarBg: reviewData.avatarBg || '#B80C09',
      date: 'Ahora mismo',
      rating: Number(reviewData.rating) || 5,
      albumTitle: reviewData.albumTitle || 'Álbum',
      artist: reviewData.artist || 'Artista',
      cover: reviewData.cover || 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
      content: reviewData.content || reviewData.reviewText || '',
      likesCount: 0,
      commentsCount: 0,
      hasSpoilers: !!reviewData.hasSpoilers,
      createdAt: new Date().toISOString(),
    };
    const updated = [newRev, ...current];
    reviewsStore[uidStr] = updated;
    setStorage('sonar_user_reviews', reviewsStore);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('sonar:review-created', {
          detail: newRev,
        })
      );
    }

    return newRev;
  },

  // COLECCIONES PERSONALES & GUARDADOS (ÁLBUMES Y CANCIONES)
  getUserSavedAlbums(userId) {
    const effectiveUserId = String(userId || 'guest_user').trim() || 'guest_user';
    const collections = getStorage(STORAGE_KEYS.USER_COLLECTIONS, {});
    
    if (collections[effectiveUserId]?.savedAlbums) {
      return collections[effectiveUserId].savedAlbums;
    }

    // Colección de bienvenida por defecto si es usuario 1 o nuevo
    if (effectiveUserId === '1' || effectiveUserId === 'user-1') {
      return [
        {
          id: '1',
          title: 'In Rainbows',
          artist: 'Radiohead',
          year: '2007',
          genre: 'Art Rock',
          cover: 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
          rating: 5,
          collectionTag: 'Favoritos',
          type: 'album',
          addedAt: '2026-02-15',
        },
        {
          id: '2',
          title: 'Discovery',
          artist: 'Daft Punk',
          year: '2001',
          genre: 'Electrónica',
          cover: 'https://cdn-images.dzcdn.net/images/cover/5718f7c81c27e0b2417e2a4c45224f8a/500x500-000000-80-0-0.jpg',
          rating: 4.8,
          collectionTag: 'Colección Vinilo',
          type: 'album',
          addedAt: '2026-02-20',
        },
        {
          id: '3',
          title: 'Vespertine',
          artist: 'Björk',
          year: '2001',
          genre: 'Art Rock',
          cover: 'https://cdn-images.dzcdn.net/images/cover/4bd6b0232c2092faf145101453cb1051/500x500-000000-80-0-0.jpg',
          rating: 5,
          collectionTag: 'Por Escuchar',
          type: 'album',
          addedAt: '2026-03-01',
        },
        {
          id: '4',
          title: 'Currents',
          artist: 'Tame Impala',
          year: '2015',
          genre: 'Psicodelia',
          cover: 'https://cdn-images.dzcdn.net/images/cover/de5b9b704cd4ec36f8bf49beb3e17ba2/500x500-000000-80-0-0.jpg',
          rating: 4.7,
          collectionTag: 'Favoritos',
          type: 'album',
          addedAt: '2026-03-10',
        },
      ];
    }
    return [];
  },

  toggleSaveAlbum(userId, album, collectionTag = 'Favoritos') {
    if (!album) return { isSaved: false, savedAlbums: [] };

    const effectiveUserId = String(userId || 'guest_user').trim() || 'guest_user';
    const collections = getStorage(STORAGE_KEYS.USER_COLLECTIONS, {});
    const currentSaved = this.getUserSavedAlbums(effectiveUserId);

    const targetTitle = String(album.title || album.album || '').trim().toLowerCase();
    const targetArtist = String(album.artist || '').trim().toLowerCase();
    const targetId = String(album.id || album.trackId || album.deezerId || '').trim();

    const existingIndex = currentSaved.findIndex((a) => {
      const aId = String(a.id || a.trackId || a.deezerId || '').trim();
      const aTitle = String(a.title || a.album || '').trim().toLowerCase();
      const aArtist = String(a.artist || '').trim().toLowerCase();

      if (targetId && aId && targetId === aId) return true;
      if (targetTitle && aTitle && targetTitle === aTitle) {
        if (!targetArtist || !aArtist || targetArtist === aArtist) return true;
      }
      return false;
    });

    const isTrack =
      album.type === 'track' ||
      Boolean(album.trackId) ||
      Boolean(album.preview || album.previewUrl) ||
      Boolean(album.album && album.album !== album.title);

    let updated;
    let isSaved;
    if (existingIndex >= 0) {
      updated = currentSaved.filter((_, idx) => idx !== existingIndex);
      isSaved = false;
    } else {
      const newItem = {
        id: album.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        trackId: album.trackId || (isTrack ? album.id : null),
        deezerId: album.deezerId || album.id,
        title: album.title || album.album || 'Canción',
        album: album.album || album.albumTitle || album.title || 'Álbum',
        artist: album.artist || 'Artista',
        year: album.year || new Date().getFullYear().toString(),
        genre: album.genre || 'Música',
        cover: album.cover || album.cover_medium || album.albumCover || 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
        rating: album.rating || 5,
        duration: album.duration || 180,
        preview: album.preview || album.previewUrl,
        previewUrl: album.previewUrl || album.preview,
        type: isTrack ? 'track' : (album.type || 'album'),
        collectionTag: collectionTag || 'Favoritos',
        addedAt: new Date().toISOString().split('T')[0],
      };
      updated = [newItem, ...currentSaved];
      isSaved = true;
    }

    collections[effectiveUserId] = {
      ...(collections[effectiveUserId] || {}),
      savedAlbums: updated,
    };
    setStorage(STORAGE_KEYS.USER_COLLECTIONS, collections);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('sonar:collection-changed', {
          detail: { userId: effectiveUserId, item: album, isSaved, collection: updated },
        })
      );
    }

    return { isSaved, savedAlbums: updated };
  },

  isAlbumSaved(userId, albumIdentifier) {
    if (!albumIdentifier) return false;
    const effectiveUserId = String(userId || 'guest_user').trim() || 'guest_user';
    const saved = this.getUserSavedAlbums(effectiveUserId);

    let queryId = '';
    let queryTitle = '';
    let queryArtist = '';

    if (typeof albumIdentifier === 'object') {
      queryId = String(albumIdentifier.id || albumIdentifier.trackId || albumIdentifier.deezerId || '').trim().toLowerCase();
      queryTitle = String(albumIdentifier.title || albumIdentifier.album || '').trim().toLowerCase();
      queryArtist = String(albumIdentifier.artist || '').trim().toLowerCase();
    } else {
      const q = String(albumIdentifier).trim().toLowerCase();
      queryId = q;
      queryTitle = q;
    }

    return saved.some((a) => {
      const aId = String(a.id || '').trim().toLowerCase();
      const aTrackId = String(a.trackId || '').trim().toLowerCase();
      const aDeezerId = String(a.deezerId || '').trim().toLowerCase();
      const aTitle = String(a.title || a.album || '').trim().toLowerCase();
      const aArtist = String(a.artist || '').trim().toLowerCase();

      if (queryId && (aId === queryId || aTrackId === queryId || aDeezerId === queryId)) return true;
      if (queryTitle && aTitle === queryTitle) {
        if (!queryArtist || !aArtist || queryArtist === aArtist) return true;
      }
      return false;
    });
  },

  // ===================== HISTORIAL DE REPRODUCCIÓN (RECENTLY PLAYED) =====================
  getRecentlyPlayed(userId) {
    const effectiveUserId = String(userId || 'guest_user').trim() || 'guest_user';
    const allRecent = getStorage(STORAGE_KEYS.RECENTLY_PLAYED, {});
    return allRecent[effectiveUserId] || [];
  },

  addRecentlyPlayed(userId, item) {
    if (!item) return [];
    const effectiveUserId = String(userId || 'guest_user').trim() || 'guest_user';
    const allRecent = getStorage(STORAGE_KEYS.RECENTLY_PLAYED, {});
    const currentList = allRecent[effectiveUserId] || [];

    const playedItem = {
      id: item.id || `play-${Date.now()}`,
      deezerId: item.deezerId || item.id,
      title: item.title || item.name || 'Pista de Sonar',
      artist: item.artist || 'Artista',
      album: item.album || item.albumTitle || item.title || '',
      cover: item.cover || item.cover_medium || item.image || 'https://cdn-images.dzcdn.net/images/cover/a175af9b7d329bc678cb4d26fc13d6de/500x500-000000-80-0-0.jpg',
      preview: item.preview || item.previewUrl,
      type: item.type || (item.podcast ? 'podcast' : 'track'),
      playedAt: new Date().toISOString(),
    };

    // Filtrar duplicados recientes de la misma canción y limitar a los 25 más recientes
    const deduplicated = currentList.filter(
      (p) =>
        String(p.id) !== String(playedItem.id) &&
        String(p.title).toLowerCase() !== String(playedItem.title).toLowerCase()
    );

    const updated = [playedItem, ...deduplicated].slice(0, 25);
    allRecent[effectiveUserId] = updated;
    setStorage(STORAGE_KEYS.RECENTLY_PLAYED, allRecent);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('sonar:recently-played-changed', {
          detail: { userId: effectiveUserId, item: playedItem, history: updated },
        })
      );
    }

    return updated;
  },

  clearRecentlyPlayed(userId) {
    const effectiveUserId = String(userId || 'guest_user').trim() || 'guest_user';
    const allRecent = getStorage(STORAGE_KEYS.RECENTLY_PLAYED, {});
    allRecent[effectiveUserId] = [];
    setStorage(STORAGE_KEYS.RECENTLY_PLAYED, allRecent);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('sonar:recently-played-changed', {
          detail: { userId: effectiveUserId, history: [] },
        })
      );
    }
  },
};

export default interactionsService;

