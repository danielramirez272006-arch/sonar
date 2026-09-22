// Servicio de Estadísticas Sociales y Comunidad por Usuario

const STORAGE_KEY_SOCIAL = 'sonar_user_social_stats';
const STORAGE_KEY_FOLLOWS = 'sonar_user_following';

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
    console.error('Error en social storage:', e);
  }
}

/**
 * Genera un número determinista y variado según la identidad del usuario.
 */
function hashString(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 100000;
  }
  return Math.abs(hash);
}

export const socialService = {
  /**
   * Obtiene estadísticas únicas de seguidores, siguiendo y reseñas para cualquier usuario.
   */
  getUserStats(user, actualReviewsCount = 0) {
    if (!user) {
      return { reviews: 0, followers: 0, following: 0 };
    }

    const userId = String(user.id || user.email || user.username || 'user');
    const store = getStorage(STORAGE_KEY_SOCIAL, {});

    if (userId === '1') {
      if (store[userId]) {
        return {
          ...store[userId],
          reviews: actualReviewsCount !== undefined ? actualReviewsCount : (store[userId].reviews || 86),
        };
      }
      const demoStats = {
        reviews: actualReviewsCount || 86,
        followers: 420,
        following: 142,
      };
      store[userId] = demoStats;
      setStorage(STORAGE_KEY_SOCIAL, store);
      return demoStats;
    }

    // Para cualquier usuario nuevo, comenzar limpio en 0 a menos que tenga interacción real
    const newStats = {
      reviews: actualReviewsCount !== undefined ? actualReviewsCount : (user.stats?.reviewsCount || 0),
      followers: typeof user.stats?.followers === 'number' ? user.stats.followers : (store[userId]?.followers || 0),
      following: typeof user.stats?.following === 'number' ? user.stats.following : (store[userId]?.following || 0),
    };

    store[userId] = newStats;
    setStorage(STORAGE_KEY_SOCIAL, store);
    return newStats;
  },

  /**
   * Da formato limpio al nombre de usuario y su handle (evita que se vea @correo.com).
   */
  formatUserIdentity(user) {
    if (!user) {
      return { displayName: 'Audiófilo Sonar', handle: '@oyente' };
    }

    let raw = user.username || user.name || user.email || 'usuario';
    // Si viene en formato email, extraer solo la parte previa al @
    let handleBase = raw.includes('@') ? raw.split('@')[0] : raw;
    handleBase = handleBase.toLowerCase().replace(/[^a-z0-9_]/g, '');

    let displayName = user.username || user.name || handleBase;
    if (displayName.includes('@')) {
      const parts = displayName.split('@')[0].split(/[._-]/);
      displayName = parts
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');
    }

    return {
      displayName,
      handle: `@${handleBase}`,
    };
  },

  /**
   * Permite seguir o dejar de seguir a otro usuario en la comunidad.
   */
  toggleFollow(currentUserId, targetUserId) {
    if (!currentUserId || !targetUserId) return false;

    const allFollows = getStorage(STORAGE_KEY_FOLLOWS, {});
    const userFollowing = allFollows[currentUserId] || [];
    const isFollowing = userFollowing.includes(targetUserId);

    let updatedFollowing;
    if (isFollowing) {
      updatedFollowing = userFollowing.filter((id) => id !== targetUserId);
    } else {
      updatedFollowing = [...userFollowing, targetUserId];
    }

    allFollows[currentUserId] = updatedFollowing;
    setStorage(STORAGE_KEY_FOLLOWS, allFollows);

    // Actualizar contadores en el almacenamiento
    const socialStore = getStorage(STORAGE_KEY_SOCIAL, {});
    if (socialStore[currentUserId]) {
      socialStore[currentUserId].following = updatedFollowing.length;
    }
    if (socialStore[targetUserId]) {
      socialStore[targetUserId].followers = isFollowing
        ? Math.max(0, socialStore[targetUserId].followers - 1)
        : socialStore[targetUserId].followers + 1;
    }
    setStorage(STORAGE_KEY_SOCIAL, socialStore);

    return !isFollowing;
  },
};

export default socialService;
