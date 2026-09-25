import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../shared/context/auth-context';

export const REWARD_ITEMS = [
  {
    id: 'frame-gold-vinyl',
    type: 'frame',
    name: 'Marco Vinilo de Oro 24K',
    category: 'Marcos de Avatar',
    cost: 450,
    icon: 'album',
    color: 'from-amber-400 to-yellow-600',
    description: 'Borde dorado reluciente con textura de microsurcos de vinilo para tu avatar.',
    previewBorder: 'ring-4 ring-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)]',
  },
  {
    id: 'frame-neon-cyber',
    type: 'frame',
    name: 'Marco Neón Hi-Fi Cyberpunk',
    category: 'Marcos de Avatar',
    cost: 350,
    icon: 'bolt',
    color: 'from-cyan-400 to-fuchsia-500',
    description: 'Aura electromagnética de neón cian y magenta con pulso de audio.',
    previewBorder: 'ring-4 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.7)]',
  },
  {
    id: 'frame-valve-tube',
    type: 'frame',
    name: 'Marco Tubo Valvular Retro',
    category: 'Marcos de Avatar',
    cost: 300,
    icon: 'lightbulb',
    color: 'from-orange-500 to-amber-700',
    description: 'Resplandor cálido de filamento de bulbo termoiónico vintage para audiófilos analógicos.',
    previewBorder: 'ring-4 ring-orange-500 shadow-[0_0_18px_rgba(249,115,22,0.6)]',
  },
  {
    id: 'frame-hologram',
    type: 'frame',
    name: 'Marco Holográfico Espectral',
    category: 'Marcos de Avatar',
    cost: 500,
    icon: 'auto_awesome',
    color: 'from-purple-500 via-pink-500 to-indigo-500',
    description: 'Efecto tornasolado iridiscente que reacciona a los reflejos de luz.',
    previewBorder: 'ring-4 ring-purple-400 shadow-[0_0_22px_rgba(168,85,247,0.7)]',
  },
  {
    id: 'skin-cassette',
    type: 'skin',
    name: 'Skin Reproductor Cassette 1984',
    category: 'Skins de Audio',
    cost: 600,
    icon: 'radio',
    color: 'from-rose-600 to-red-800',
    description: 'Diseño retro con carretes giratorios analógicos para el reproductor global de Sonar.',
    badge: 'Popular',
  },
  {
    id: 'skin-vu-meter',
    type: 'skin',
    name: 'Skin VU Meter Aguja Analógica',
    category: 'Skins de Audio',
    cost: 750,
    icon: 'speed',
    color: 'from-emerald-500 to-teal-800',
    description: 'Vúmetro balístico retroiluminado en ámbar que mide la dinámica sonora.',
    badge: 'Hi-Fi Pro',
  },
  {
    id: 'title-absolute-pitch',
    type: 'title',
    name: 'Título: Oído Absoluto',
    category: 'Títulos de Prestigio',
    cost: 250,
    icon: 'hearing',
    color: 'from-indigo-600 to-blue-800',
    description: 'Insignia exclusiva que se muestra en tu perfil público y comentarios de reseñas.',
  },
  {
    id: 'title-mastering-guru',
    type: 'title',
    name: 'Título: Maestro del Mastering',
    category: 'Títulos de Prestigio',
    cost: 300,
    icon: 'equalizer',
    color: 'from-purple-600 to-pink-700',
    description: 'Reconocimiento de máxima autoridad acústica en la comunidad de Sonar.',
  },
  {
    id: 'perk-vip-room',
    type: 'perk',
    name: 'Pase VIP Salón de Debate Acústico',
    category: 'Pases & Beneficios',
    cost: 200,
    icon: 'meeting_room',
    color: 'from-amber-600 to-red-700',
    description: 'Acceso ilimitado a salas de escucha privadas con audiófilos y críticos certificados.',
  },
];

const INITIAL_QUESTS = [
  {
    id: 'quest-listen-3',
    title: 'Sesión Inmersiva sin Pausas',
    desc: 'Escucha 3 álbumes completos en calidad Lossless.',
    target: 3,
    progress: 2,
    rewardPts: 150,
    icon: 'headphones',
    claimed: false,
  },
  {
    id: 'quest-review-dynamic',
    title: 'Crítica de Rango Dinámico',
    desc: 'Publica una reseña detallando la fidelidad acústica de un disco.',
    target: 1,
    progress: 1,
    rewardPts: 200,
    icon: 'rate_review',
    claimed: false,
  },
  {
    id: 'quest-streak-3',
    title: 'Fidelidad Diaria Constante',
    desc: 'Mantén una racha de 3 días consecutivos escuchando música.',
    target: 3,
    progress: 3,
    rewardPts: 120,
    icon: 'local_fire_department',
    claimed: false,
  },
  {
    id: 'quest-save-5',
    title: 'Curador de Vinilos Independientes',
    desc: 'Guarda 5 álbumes de sellos discográficos de culto.',
    target: 5,
    progress: 4,
    rewardPts: 180,
    icon: 'bookmark',
    claimed: false,
  },
];

export const RewardsStoreTab = () => {
  const { user, updateUser } = useAuth();

  // Balance de Puntos & Pertenencias
  const [points, setPoints] = useState(() => {
    try {
      const saved = localStorage.getItem('sonar_user_points');
      return saved !== null ? Number(saved) : (user?.sonarPoints || 1250);
    } catch {
      return 1250;
    }
  });

  const [userXp, setUserXp] = useState(() => {
    try {
      const saved = localStorage.getItem('sonar_user_xp');
      return saved !== null ? Number(saved) : (user?.audiophileXp || 3450);
    } catch {
      return 3450;
    }
  });

  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('sonar_user_inventory');
      return saved ? JSON.parse(saved) : ['frame-gold-vinyl', 'title-absolute-pitch'];
    } catch {
      return ['frame-gold-vinyl'];
    }
  });

  const [equippedFrame, setEquippedFrame] = useState(() => {
    try {
      return localStorage.getItem('sonar_equipped_frame') || user?.equippedFrame || 'frame-gold-vinyl';
    } catch {
      return 'frame-gold-vinyl';
    }
  });

  const [equippedTitle, setEquippedTitle] = useState(() => {
    try {
      return localStorage.getItem('sonar_equipped_title') || user?.equippedTitle || 'Oído Absoluto';
    } catch {
      return 'Oído Absoluto';
    }
  });

  const [equippedSkin, setEquippedSkin] = useState(() => {
    try {
      return localStorage.getItem('sonar_equipped_skin') || user?.equippedSkin || 'skin-vu-meter';
    } catch {
      return 'skin-vu-meter';
    }
  });

  // Estado de Caja Sorpresa Diaria
  const [crateOpened, setCrateOpened] = useState(() => {
    try {
      const last = localStorage.getItem('sonar_daily_crate_last_open');
      if (!last) return false;
      const lastDate = new Date(last).toDateString();
      const today = new Date().toDateString();
      return lastDate === today;
    } catch {
      return false;
    }
  });

  const [isOpeningCrate, setIsOpeningCrate] = useState(false);
  const [crateReward, setCrateReward] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);

  // Misiones
  const [quests, setQuests] = useState(() => {
    try {
      const saved = localStorage.getItem('sonar_rewards_quests');
      return saved ? JSON.parse(saved) : INITIAL_QUESTS;
    } catch {
      return INITIAL_QUESTS;
    }
  });

  // Guardar puntos en localStorage y sincronizar con usuario
  const updatePoints = (newPoints) => {
    setPoints(newPoints);
    try {
      localStorage.setItem('sonar_user_points', String(newPoints));
      updateUser?.({ sonarPoints: newPoints });
    } catch {}
  };

  const updateXp = (newXp) => {
    setUserXp(newXp);
    try {
      localStorage.setItem('sonar_user_xp', String(newXp));
      updateUser?.({ audiophileXp: newXp });
    } catch {}
  };

  // Cálculo de Nivel Audiófilo (1000 XP por nivel)
  const userLevel = Math.max(1, Math.floor(userXp / 300) + 1);
  const currentLevelProgress = (userXp % 300);
  const percentToNextLevel = Math.min(100, Math.round((currentLevelProgress / 300) * 100));

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Abrir Caja Diaria
  const handleOpenCrate = () => {
    if (crateOpened || isOpeningCrate) return;
    setIsOpeningCrate(true);

    setTimeout(() => {
      const rewardsList = [
        { type: 'points', amount: 150, title: '🎁 +150 Sonar Coins & Racha Dorada' },
        { type: 'points', amount: 250, title: '⭐ ¡Gran Golpe de Suerte! +250 Sonar Coins' },
        { type: 'xp', amount: 300, title: '⚡ +300 XP de Prestigio Acústico' },
        { type: 'both', points: 100, xp: 200, title: '🔥 Pack Combo: +100 Monedas & +200 XP' },
      ];
      const selected = rewardsList[Math.floor(Math.random() * rewardsList.length)];
      
      if (selected.amount) {
        if (selected.type === 'points') updatePoints(points + selected.amount);
        if (selected.type === 'xp') updateXp(userXp + selected.amount);
      } else {
        updatePoints(points + selected.points);
        updateXp(userXp + selected.xp);
      }

      setCrateReward(selected);
      setCrateOpened(true);
      setIsOpeningCrate(false);
      try {
        localStorage.setItem('sonar_daily_crate_last_open', new Date().toISOString());
      } catch {}
      showToast(selected.title);
    }, 1800);
  };

  // Canjear Artículo
  const handleRedeem = (item) => {
    if (inventory.includes(item.id)) return;
    if (points < item.cost) {
      showToast(`❌ Necesitas ${item.cost - points} monedas más para canjear este artículo.`);
      return;
    }

    const nextPoints = points - item.cost;
    const nextInventory = [...inventory, item.id];
    updatePoints(nextPoints);
    setInventory(nextInventory);
    try {
      localStorage.setItem('sonar_user_inventory', JSON.stringify(nextInventory));
    } catch {}

    // Auto-equipar el artículo canjeado
    handleEquip(item);
    showToast(`🎉 ¡Canjeaste con éxito: "${item.name}"! Ya está equipado en tu perfil.`);
  };

  // Equipar Artículo
  const handleEquip = (item) => {
    if (item.type === 'frame') {
      const next = equippedFrame === item.id ? '' : item.id;
      setEquippedFrame(next);
      try {
        localStorage.setItem('sonar_equipped_frame', next);
        updateUser?.({ equippedFrame: next });
        window.dispatchEvent(new CustomEvent('sonar:profile-customization-changed', { detail: { equippedFrame: next } }));
      } catch {}
      showToast(next ? `✨ Marco "${item.name}" equipado` : 'Marco desequipado');
    } else if (item.type === 'title') {
      const next = equippedTitle === item.name.replace('Título: ', '') ? '' : item.name.replace('Título: ', '');
      setEquippedTitle(next);
      try {
        localStorage.setItem('sonar_equipped_title', next);
        updateUser?.({ equippedTitle: next });
        window.dispatchEvent(new CustomEvent('sonar:profile-customization-changed', { detail: { equippedTitle: next } }));
      } catch {}
      showToast(next ? `🎖️ Título "${next}" activado en tu perfil` : 'Título desequipado');
    } else if (item.type === 'skin') {
      const next = equippedSkin === item.id ? '' : item.id;
      setEquippedSkin(next);
      try {
        localStorage.setItem('sonar_equipped_skin', next);
        updateUser?.({ equippedSkin: next });
        window.dispatchEvent(new CustomEvent('sonar:profile-customization-changed', { detail: { equippedSkin: next } }));
      } catch {}
      showToast(next ? `🎛️ Skin "${item.name}" activada en el reproductor` : 'Skin desequipada');
    }
  };

  // Reclamar Misión
  const handleClaimQuest = (questId) => {
    const q = quests.find((item) => item.id === questId);
    if (!q || q.claimed || q.progress < q.target) return;

    const updated = quests.map((item) => (item.id === questId ? { ...item, claimed: true } : item));
    setQuests(updated);
    updatePoints(points + q.rewardPts);
    updateXp(userXp + q.rewardPts * 2);

    try {
      localStorage.setItem('sonar_rewards_quests', JSON.stringify(updated));
    } catch {}

    showToast(`🎁 ¡Reclamaste +${q.rewardPts} Sonar Coins y +${q.rewardPts * 2} XP!`);
  };

  const filteredItems = REWARD_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'frames') return item.type === 'frame';
    if (activeCategory === 'skins') return item.type === 'skin';
    if (activeCategory === 'titles') return item.type === 'title';
    if (activeCategory === 'perks') return item.type === 'perk';
    return true;
  });

  return (
    <div className="flex flex-col gap-8 text-[#231123] dark:text-white">
      {/* Toast Notificación */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl bg-[#231123]/95 text-white dark:bg-white dark:text-[#231123] font-bold text-xs shadow-2xl border border-amber-400/40 flex items-center gap-2 backdrop-blur-xl"
          >
            <span className="material-symbols-outlined text-amber-400 text-[18px]">verified</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TARJETA PRINCIPAL: BALANCE DE MONEDAS, NIVEL XP & RACHA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Saldo de Sonar Coins */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#003844] via-[#003844] to-[#231123] text-[#DCDCDD] shadow-xl flex flex-col justify-between gap-4 relative overflow-hidden border border-[#003844]/40">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 rounded-full bg-white/5 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#DCDCDD] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#52a2b0]">toll</span>
              <span>Saldo Sonar Coins</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#231123]/60 backdrop-blur-md text-[#DCDCDD] border border-white/20">
              Boutique Activa
            </span>
          </div>

          <div className="flex items-baseline gap-3 my-1">
            <span className="text-4xl sm:text-5xl font-black tracking-tight font-mono text-white">
              {points.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-[#DCDCDD]/80 uppercase tracking-widest">
              Monedas
            </span>
          </div>

          <p className="text-xs text-[#DCDCDD]/80 leading-relaxed">
            Acumula monedas escuchando pistas en alta resolución, redactando reseñas y manteniendo tu racha de escucha.
          </p>
        </div>

        {/* Nivel Audiófilo & Barra de XP */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#B80C09] dark:text-[#ff4d4a] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">military_tech</span>
              <span>Rango & Experiencia</span>
            </span>
            <span className="text-xs font-mono font-extrabold text-[#5c435a] dark:text-[#DCDCDD]">
              {userXp.toLocaleString()} XP
            </span>
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <h3 className="text-xl sm:text-2xl font-black text-[#231123] dark:text-[#DCDCDD]">
                Nivel {userLevel} · <span className="text-sm text-[#5c435a] dark:text-[#B89CB0]">{equippedTitle}</span>
              </h3>
              <span className="text-xs font-mono font-bold text-[#B80C09] dark:text-[#ff4d4a]">
                {percentToNextLevel}%
              </span>
            </div>

            <div className="w-full h-3 bg-gray-100 dark:bg-black/40 rounded-full overflow-hidden p-0.5 border border-[#e6d5e2] dark:border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentToNextLevel}%` }}
                className="h-full rounded-full bg-gradient-to-r from-[#003844] via-[#4B2840] to-[#B80C09]"
              />
            </div>
          </div>

          <span className="text-[11px] text-[#5c435a] dark:text-[#B89CB0] font-medium">
            Faltan {300 - currentLevelProgress} XP para alcanzar el <strong>Nivel {userLevel + 1}</strong>
          </span>
        </div>

        {/* Racha de Días & Caja Sorpresa Diaria */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#4B2840] to-[#231123] text-[#DCDCDD] border border-white/15 shadow-xl flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#DCDCDD] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#B80C09]">local_fire_department</span>
              <span>Racha de Escucha</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#003844]/60 text-[#DCDCDD] border border-[#003844]/80">
              🔥 5 Días Seguidos
            </span>
          </div>

          {/* Botón de Caja Diaria */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#003844] to-[#B80C09] text-white flex items-center justify-center shadow-md shrink-0">
                <span className="material-symbols-outlined text-[22px]">
                  {crateOpened ? 'lock_open' : 'redeem'}
                </span>
              </div>
              <div>
                <span className="text-xs font-extrabold block text-white">
                  {crateOpened ? 'Caja Diaria Reclamada' : 'Caja Sorpresa Diaria'}
                </span>
                <span className="text-[10px] text-[#B89CB0]">
                  {crateOpened ? 'Vuelve mañana para más premios' : 'Gira y gana monedas y XP'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenCrate}
              disabled={crateOpened || isOpeningCrate}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md ${
                crateOpened
                  ? 'bg-white/10 text-white/40 cursor-not-allowed'
                  : isOpeningCrate
                  ? 'bg-[#003844] text-white animate-pulse'
                  : 'bg-gradient-to-r from-[#003844] to-[#B80C09] hover:from-[#002830] hover:to-[#9c0a07] text-white hover:scale-105'
              }`}
            >
              {crateOpened ? '✓ Abierta' : isOpeningCrate ? 'Abriendo...' : 'Abrir Gratis'}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#B89CB0]">
            <span>Multiplicador de puntos:</span>
            <span className="font-mono font-bold text-[#DCDCDD]">1.5x Bonificación Activa</span>
          </div>
        </div>
      </div>

      {/* 2. BOUTIQUE DE CANJE (STORE DE MARCOS, SKINS Y TÍTULOS) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e6d5e2] dark:border-white/10">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#B80C09] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              <span>Boutique Exclusiva Sonar Hi-Fi</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#231123] dark:text-white mt-1">
              Catálogo de Canje & Personalización
            </h3>
            <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] mt-0.5">
              Personaliza tu avatar, desbloquea skins visuales para el reproductor y luce títulos de prestigio.
            </p>
          </div>

          {/* Selector de Categorías */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 self-start sm:self-auto">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'frames', label: '👑 Marcos' },
              { id: 'skins', label: '🎛️ Skins Audio' },
              { id: 'titles', label: '🎖️ Títulos' },
              { id: 'perks', label: '🎟️ Pases' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[#B80C09] text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-white/5 text-[#5c435a] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Artículos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isOwned = inventory.includes(item.id);
            const isEquipped =
              (item.type === 'frame' && equippedFrame === item.id) ||
              (item.type === 'title' && equippedTitle === item.name.replace('Título: ', '')) ||
              (item.type === 'skin' && equippedSkin === item.id);

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                  isEquipped
                    ? 'bg-[#003844]/10 dark:bg-[#003844]/30 border-[#003844] dark:border-[#52a2b0] shadow-md ring-2 ring-[#003844]/40'
                    : isOwned
                    ? 'bg-[#4B2840]/10 dark:bg-[#4B2840]/25 border-[#4B2840]/30 dark:border-white/15'
                    : 'bg-gray-50/60 dark:bg-black/20 border-gray-200 dark:border-white/10 hover:border-[#003844]/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md shrink-0 overflow-hidden`}
                    >
                      <span className="material-symbols-outlined text-[24px] select-none pointer-events-none">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-[#231123] dark:text-[#DCDCDD] flex items-center gap-1.5">
                        <span>{item.name}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-[#B80C09] text-white">
                            {item.badge}
                          </span>
                        )}
                      </h4>
                      <span className="text-[11px] font-bold text-[#5c435a] dark:text-[#B89CB0]">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] leading-relaxed">
                  {item.description}
                </p>

                {/* Previsualizador de Marco si aplica */}
                {item.type === 'frame' && (
                  <div className="p-3 rounded-xl bg-white dark:bg-black/30 border border-[#e6d5e2] dark:border-white/10 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${item.color} flex items-center justify-center text-white ${item.previewBorder}`}>
                      <span className="material-symbols-outlined text-[16px]">person</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#5c435a] dark:text-[#DCDCDD]">
                      Vista previa en avatar
                    </span>
                  </div>
                )}

                {/* Botón de Acción: Canjear o Equipar */}
                <div className="pt-3 border-t border-[#e6d5e2] dark:border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1 font-mono font-extrabold text-sm text-[#231123] dark:text-[#DCDCDD]">
                    <span className="material-symbols-outlined text-[#003844] dark:text-[#52a2b0] text-[18px]">toll</span>
                    <span>{isOwned ? 'Adquirido' : `${item.cost} Monedas`}</span>
                  </div>

                  {isOwned ? (
                    <button
                      type="button"
                      onClick={() => handleEquip(item)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1 shadow-xs ${
                        isEquipped
                          ? 'bg-[#003844] hover:bg-[#002830] text-[#DCDCDD] shadow-[#003844]/30'
                          : 'bg-gray-200 dark:bg-white/10 hover:bg-[#B80C09] hover:text-white text-[#231123] dark:text-[#DCDCDD]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isEquipped ? 'check_circle' : 'tune'}
                      </span>
                      <span>{isEquipped ? 'Equipado' : 'Equipar'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRedeem(item)}
                      disabled={points < item.cost}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-1 ${
                        points >= item.cost
                          ? 'bg-gradient-to-r from-[#003844] to-[#B80C09] hover:from-[#002830] hover:to-[#9c0a07] text-white hover:scale-105'
                          : 'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">shopping_cart</span>
                      <span>Canjear</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. MISIONES DINÁMICAS & DESAFÍOS DE ESCUCHA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#4B2840] border border-[#e6d5e2] dark:border-white/10 shadow-xs flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#B80C09] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
              <span>Desafíos & Misiones Semanales</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#231123] dark:text-white mt-1">
              Gana Monedas Cumpliendo Metas Musicales
            </h3>
            <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] mt-0.5">
              Completa cada objetivo para reclamar monedas y sumar puntos de experiencia inmediatamente.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3.5 py-1.5 rounded-xl border border-amber-300/40 self-start sm:self-auto shadow-2xs">
            Renuevan cada lunes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quests.map((quest) => {
            const isDone = quest.progress >= quest.target;
            const percent = Math.min(100, Math.round((quest.progress / quest.target) * 100));

            return (
              <div
                key={quest.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                  quest.claimed
                    ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/30'
                    : isDone
                    ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-500/40 shadow-xs'
                    : 'bg-gray-50/70 dark:bg-black/20 border-gray-200 dark:border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        quest.claimed
                          ? 'bg-emerald-600 text-white'
                          : isDone
                          ? 'bg-gradient-to-tr from-amber-500 to-[#B80C09] text-white shadow-md'
                          : 'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-white/40'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]">{quest.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#231123] dark:text-white">
                        {quest.title}
                      </h4>
                      <p className="text-xs text-[#5c435a] dark:text-[#B89CB0] mt-0.5">
                        {quest.desc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-[#5c435a] dark:text-[#B89CB0]">
                      Progreso: {quest.progress} / {quest.target}
                    </span>
                    <span className="font-mono text-[#B80C09] dark:text-pink-300">{percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-black/30 rounded-full overflow-hidden p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-[#B80C09] to-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#e6d5e2] dark:border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">toll</span>
                    <span>+{quest.rewardPts} Monedas</span>
                  </span>

                  {quest.claimed ? (
                    <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>Reclamado</span>
                    </span>
                  ) : isDone ? (
                    <button
                      type="button"
                      onClick={() => handleClaimQuest(quest.id)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs cursor-pointer shadow-md flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">redeem</span>
                      <span>Reclamar Recompensa</span>
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold">
                      En curso
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RewardsStoreTab;
