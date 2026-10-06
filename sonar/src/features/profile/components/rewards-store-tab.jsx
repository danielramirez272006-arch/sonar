import { useUIText } from '../../../shared/i18n/use-ui-text.js';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../shared/context/auth-context';
import { useLanguage } from '../../../shared/context/language-context';
import { soundEffects } from '../../../shared/utils/sound-effects';
import { repairRewardCopy } from './reward-copy';

import { EXTENDED_REWARD_ITEMS } from '../data/rewards-catalog.js';

export const REWARD_ITEMS = EXTENDED_REWARD_ITEMS;

const INITIAL_QUESTS = [
  {
    id: 'quest-daily-listen',
    type: 'daily',
    title: 'Sesión Inmersiva Diaria',
    desc: 'Escucha 3 pistas completas sin interrupción en Sonar.',
    target: 3,
    progress: 3,
    rewardPts: 100,
    rewardXp: 180,
    icon: 'headphones',
    claimed: false,
  },
  {
    id: 'quest-daily-review',
    type: 'daily',
    title: 'Crítica de Audiofilia',
    desc: 'Publica o califica una reseña evaluando el rango dinámico.',
    target: 1,
    progress: 1,
    rewardPts: 150,
    rewardXp: 250,
    icon: 'rate_review',
    claimed: false,
  },
  {
    id: 'quest-weekly-crate',
    type: 'weekly',
    title: 'Curador de la Semana',
    desc: 'Guarda 5 álbumes de sellos discográficos independientes.',
    target: 5,
    progress: 4,
    rewardPts: 300,
    rewardXp: 500,
    icon: 'bookmark',
    claimed: false,
  },
  {
    id: 'quest-weekly-streak',
    type: 'weekly',
    title: 'Constancia de Oro',
    desc: 'Mantén una racha de escucha activa durante 5 días seguidos.',
    target: 5,
    progress: 4,
    rewardPts: 400,
    rewardXp: 650,
    icon: 'local_fire_department',
    claimed: false,
  },
];

const RewardCard = React.memo(({
  item,
  localizedItem,
  isOwned,
  isEquipped,
  points,
  onEquip,
  onRedeem,
  onPreview,
  t,
  ui,
  isCarouselItem = false,
}) => {
  return (
    <div
      className={`bg-white dark:bg-zinc-900/80 border border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09]/40 dark:hover:border-amber-400/40 rounded-3xl p-5 flex flex-col justify-between gap-4 transition-transform hover:-translate-y-1 shadow-xl group relative overflow-hidden text-[#231123] dark:text-white h-full ${
        isCarouselItem ? 'snap-start shrink-0 select-none' : ''
      }`}
    >
      {/* Cabecera del Item */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${localizedItem.color} flex items-center justify-center text-white shadow-lg shrink-0`}>
            <span className="material-symbols-outlined text-2xl">{localizedItem.icon}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {localizedItem.badge && (
              <span className="px-2 py-0.5 rounded-full bg-[#B80C09]/10 dark:bg-amber-500/10 text-[#B80C09] dark:text-amber-400 text-[10px] font-bold border border-[#B80C09]/20 dark:border-amber-500/20 whitespace-nowrap">
                {ui(localizedItem.badge)}
              </span>
            )}
            <button
              type="button"
              onClick={() => onPreview(item)}
              className="p-1.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-[#f8e9f6] dark:hover:bg-zinc-700 text-[#5c435a] dark:text-zinc-300 hover:text-[#B80C09] dark:hover:text-amber-400 transition-colors border border-[#e6d5e2] dark:border-white/5 cursor-pointer"
              title={t('preview')}
            >
              <span className="material-symbols-outlined text-sm">visibility</span>
            </button>
          </div>
        </div>

        <h4 className="text-base font-bold text-[#231123] dark:text-white group-hover:text-[#B80C09] dark:group-hover:text-amber-300 transition-colors line-clamp-1">
          {localizedItem.name}
        </h4>
        <p className="text-xs text-[#5c435a] dark:text-zinc-400 mt-1 line-clamp-2 min-h-[32px]">
          {localizedItem.description}
        </p>
      </div>

      {/* Pie con Precio / Botón */}
      <div className="pt-3 border-t border-[#e6d5e2] dark:border-white/5 flex items-center justify-between gap-3">
        <div className="text-left">
          <div className="text-[10px] text-[#5c435a]/70 dark:text-zinc-500 uppercase tracking-wider font-semibold">{t('cost')}</div>
          <div className="text-base font-black text-amber-700 dark:text-amber-400 flex items-center gap-1">
            {localizedItem.cost} <span className="text-xs">🪙</span>
          </div>
        </div>

        {isOwned ? (
          <button
            type="button"
            onClick={() => onEquip(item)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
              isEquipped
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-[#003844] hover:bg-[#4B2840] text-white border border-[#003844]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {isEquipped ? 'check' : 'toggle_on'}
            </span>
            {isEquipped ? t('equipped') : t('equip')}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onRedeem(item)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
              points >= localizedItem.cost
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black shadow-md shadow-amber-500/20'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500 border border-gray-200 dark:border-white/5 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-sm">shopping_bag</span>
            {t('redeem')}
          </button>
        )}
      </div>
    </div>
  );
}, (prev, next) => {
  return (
    prev.item.id === next.item.id &&
    prev.isOwned === next.isOwned &&
    prev.isEquipped === next.isEquipped &&
    prev.points === next.points &&
    prev.localizedItem.name === next.localizedItem.name &&
    prev.localizedItem.description === next.localizedItem.description &&
    prev.isCarouselItem === next.isCarouselItem &&
    prev.t === next.t &&
    prev.ui === next.ui
  );
});

const SliderRail = React.memo(({
  title,
  icon,
  items,
  localizedMap,
  inventory,
  equippedFrame,
  equippedTitle,
  equippedSkin,
  equippedDsp,
  equippedTheme,
  activePerks,
  points,
  onEquip,
  onRedeem,
  onPreview,
  onExplore,
  t,
  ui,
}) => {
  const railRef = useRef(null);
  const slideLeft = () => railRef.current?.scrollBy({ left: -460, behavior: 'smooth' });
  const slideRight = () => railRef.current?.scrollBy({ left: 460, behavior: 'smooth' });

  return (
    <div className="space-y-3 p-4 md:p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/50 border border-[#e6d5e2] dark:border-white/10 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#B80C09]/10 dark:bg-amber-500/10 text-[#B80C09] dark:text-amber-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">{icon}</span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-[#231123] dark:text-white flex items-center gap-2">
            <span>{title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#f8e9f6] dark:bg-zinc-800 text-[#5c435a] dark:text-zinc-400 font-bold border border-[#e6d5e2] dark:border-white/5">
              {items.length}
            </span>
          </h4>
        </div>
        <div className="flex items-center gap-2">
          {onExplore && (
            <button
              type="button"
              onClick={onExplore}
              className="text-xs font-bold text-[#B80C09] dark:text-amber-400 hover:underline px-2.5 py-1 rounded-lg hover:bg-amber-500/10 transition-colors hidden sm:inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{ui('Ver categoría')}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          )}
          <button
            type="button"
            onClick={slideLeft}
            className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-800 hover:bg-amber-400 hover:text-black text-[#231123] dark:text-white border border-[#e6d5e2] dark:border-white/10 flex items-center justify-center transition-all shadow active:scale-95 cursor-pointer"
            title={ui('Deslizar a la izquierda')}
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <button
            type="button"
            onClick={slideRight}
            className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-800 hover:bg-amber-400 hover:text-black text-[#231123] dark:text-white border border-[#e6d5e2] dark:border-white/10 flex items-center justify-center transition-all shadow active:scale-95 cursor-pointer"
            title={ui('Deslizar a la derecha')}
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 pb-4 no-scrollbar items-stretch"
      >
        {items.map((storedItem) => {
          const locItem = localizedMap.get(storedItem.id) || storedItem;
          const isOwned = inventory.includes(storedItem.id);
          const isEquipped =
            (storedItem.type === 'frame' && equippedFrame === storedItem.id) ||
            (storedItem.type === 'title' && (equippedTitle === storedItem.name.replace(/^Título:\s*/i, '') || equippedTitle === storedItem.id)) ||
            (storedItem.type === 'skin' && equippedSkin === storedItem.id) ||
            (storedItem.type === 'dsp' && equippedDsp === storedItem.id) ||
            (storedItem.type === 'theme' && equippedTheme === storedItem.id) ||
            (storedItem.type === 'perk' && activePerks.includes(storedItem.id));

          return (
            <div key={storedItem.id} className="w-[280px] sm:w-[320px] shrink-0">
              <RewardCard
                item={storedItem}
                localizedItem={locItem}
                isOwned={isOwned}
                isEquipped={isEquipped}
                points={points}
                onEquip={onEquip}
                onRedeem={onRedeem}
                onPreview={onPreview}
                t={t}
                ui={ui}
                isCarouselItem={true}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

export const RewardsStoreTab = () => {
  const ui = useUIText();
  const { currentLang, t: translate } = useLanguage();
  const { user, updateUser } = useAuth();
  const localizedRewardMap = useMemo(() => {
    const map = new Map();
    REWARD_ITEMS.forEach((item) => {
      const translatedName = translate(`rewards.${item.id}.name`, { defaultValue: item.name });
      const translatedDesc = translate(`rewards.${item.id}.description`, { defaultValue: item.description });
      map.set(item.id, {
        ...item,
        name: translatedName !== item.name ? translatedName : ui(item.name),
        description: translatedDesc !== item.description ? translatedDesc : ui(item.description),
      });
    });
    return map;
  }, [currentLang, translate, ui]);

  const localizedReward = useCallback((item) => {
    if (!item) return null;
    return localizedRewardMap.get(item.id) || item;
  }, [localizedRewardMap]);
  const localizedQuest = (quest) => {
    const translatedTitle = translate(`rewards.${quest.id}.title`, { defaultValue: quest.title });
    const translatedDesc = translate(`rewards.${quest.id}.description`, { defaultValue: quest.desc });
    return {
      ...quest,
      title: translatedTitle !== quest.title ? translatedTitle : ui(quest.title),
      desc: translatedDesc !== quest.desc ? translatedDesc : ui(quest.desc),
    };
  };
  const localizedTransactionName = (transaction) => {
    const reward = REWARD_ITEMS.find((item) => item.name === transaction.name);
    return reward ? localizedReward(reward).name : transaction.name;
  };
  const spanishRewardsText = {
    all: 'Todos',
    frames: 'Marcos de Avatar',
    skins: 'Skins de Audio',
    dsp: 'Presets DSP',
    sounds: 'Sonidos de UI',
    themes: 'Temas',
    titles: 'Títulos',
    vip: 'Pases VIP',
    catalog: 'Catálogo de Recompensas',
    catalogDesc: 'Personaliza tu avatar, reproductor, cadena DSP y temas visuales.',
    quests: 'Misiones y Desafíos Audiófilos',
    questDesc: 'Completa objetivos de escucha y análisis para ganar monedas rápidamente.',
    daily: 'Diaria',
    weekly: 'Semanal',
    progress: 'Progreso',
    claimed: 'Recompensa Reclamada',
    claim: '¡Reclamar Recompensa!',
    inProgress: 'En Progreso',
    cost: 'Costo',
    equipped: 'Equipado',
    equip: 'Equipar',
    redeem: 'Canjear',
    preview: 'Vista Previa en Vivo',
    previewTitle: 'Vista Previa en Vivo • Sandbox',
    testing: 'PROBANDO',
    player: 'Reproductor Sonar Hi-Fi',
    price: 'Precio',
    close: 'Cerrar',
    redeemNow: 'Canjear Ahora',
    coins: 'Tus Sonar Coins',
    streak: 'Racha de Escucha',
    crate: 'Caja de Vinilo Diaria',
    available: '¡Disponible!',
    opened: 'Abierta',
    crateTitle: 'Desempaquetado Misterioso',
    openCrate: 'Abrir Caja de Vinilo (Gratis)',
    opening: 'Abriendo Vinilo…',
    rewardRedeemed: 'Recompensa Canjeada',
    community: 'Objetivo Comunitario Mensual',
    communityReviews: 'Reseñas Hi-Fi Colectivas',
    receipt: 'Recibo Retro',
    store: 'Tienda Audiófila y Recompensas',
    vault: 'Bóveda de Fidelidad Sonora',
  };
  const rewardsText = {
    es: spanishRewardsText,
    en: { all: 'All', frames: 'Avatar Frames', skins: 'Audio Skins', dsp: 'DSP Presets', sounds: 'UI Sounds', themes: 'Themes', titles: 'Titles', vip: 'VIP Passes', catalog: 'Rewards Catalog', catalogDesc: 'Customize your avatar, player, DSP chain and visual themes.', quests: 'Audiophile Missions and Challenges', questDesc: 'Complete listening and analysis goals to earn coins quickly.', daily: 'Daily', weekly: 'Weekly', progress: 'Progress', claimed: 'Reward Claimed', claim: 'Claim Reward!', inProgress: 'In Progress', cost: 'Cost', equipped: 'Equipped', equip: 'Equip', redeem: 'Redeem', preview: 'Live Preview', previewTitle: 'Live Preview • Sandbox', testing: 'PREVIEWING', player: 'Sonar Hi-Fi Player', price: 'Price', close: 'Close', redeemNow: 'Redeem Now', coins: 'Your Sonar Coins', streak: 'Listening Streak', crate: 'Daily Vinyl Crate', available: 'Available!', opened: 'Opened', crateTitle: 'Mystery Unpacking', openCrate: 'Open Vinyl Crate (Free)', opening: 'Opening Vinyl...', rewardRedeemed: 'Reward Redeemed', community: 'Monthly Community Goal', communityReviews: 'Collective Hi-Fi Reviews', receipt: 'Retro Receipt', store: 'Audiophile Store & Rewards', vault: 'Sound Loyalty Vault' },
    fr: { all: 'Tout', frames: 'Cadres d’avatar', skins: 'Skins audio', dsp: 'Préréglages DSP', sounds: 'Sons UI', themes: 'Thèmes', titles: 'Titres', vip: 'Pass VIP', catalog: 'Catalogue des récompenses', catalogDesc: 'Personnalisez votre avatar, lecteur, chaîne DSP et thèmes visuels.', quests: 'Missions et défis audiophiles', questDesc: 'Atteignez vos objectifs d’écoute et d’analyse pour gagner des pièces.', daily: 'Quotidienne', weekly: 'Hebdomadaire', progress: 'Progression', claimed: 'Récompense récupérée', claim: 'Récupérer la récompense !', inProgress: 'En cours', cost: 'Coût', equipped: 'Équipé', equip: 'Équiper', redeem: 'Échanger', preview: 'Aperçu en direct', previewTitle: 'Aperçu en direct • Bac à sable', testing: 'APERÇU', player: 'Lecteur Sonar Hi-Fi', price: 'Prix', close: 'Fermer', redeemNow: 'Échanger maintenant', coins: 'Vos Sonar Coins', streak: 'Série d’écoute', crate: 'Caisse vinyle quotidienne', available: 'Disponible !', opened: 'Ouverte', crateTitle: 'Ouverture mystérieuse', openCrate: 'Ouvrir la caisse vinyle (gratuit)', opening: 'Ouverture du vinyle…', rewardRedeemed: 'Récompense récupérée', community: 'Objectif communautaire mensuel', communityReviews: 'Avis Hi-Fi collectifs', receipt: 'Reçu rétro', store: 'Boutique et récompenses audiophiles', vault: 'Coffre de fidélité sonore' },
    it: { all: 'Tutti', frames: 'Cornici avatar', skins: 'Skin audio', dsp: 'Preset DSP', sounds: 'Suoni UI', themes: 'Temi', titles: 'Titoli', vip: 'Pass VIP', catalog: 'Catalogo premi', catalogDesc: 'Personalizza avatar, lettore, catena DSP e temi visivi.', quests: 'Missioni e sfide audiofile', questDesc: 'Completa obiettivi di ascolto e analisi per guadagnare monete.', daily: 'Giornaliera', weekly: 'Settimanale', progress: 'Progresso', claimed: 'Premio riscosso', claim: 'Riscatta premio!', inProgress: 'In corso', cost: 'Costo', equipped: 'Equipaggiato', equip: 'Equipaggia', redeem: 'Riscatta', preview: 'Anteprima dal vivo', previewTitle: 'Anteprima dal vivo • Sandbox', testing: 'ANTEPRIMA', player: 'Lettore Sonar Hi-Fi', price: 'Prezzo', close: 'Chiudi', redeemNow: 'Riscatta ora', coins: 'I tuoi Sonar Coins', streak: 'Serie di ascolto', crate: 'Cassa vinile giornaliera', available: 'Disponibile!', opened: 'Aperta', crateTitle: 'Apertura misteriosa', openCrate: 'Apri cassa vinile (gratis)', opening: 'Apertura del vinile…', rewardRedeemed: 'Premio riscattato', community: 'Obiettivo comunitario mensile', communityReviews: 'Recensioni Hi-Fi collettive', receipt: 'Scontrino rétro', store: 'Negozio e premi audiofili', vault: 'Scrigno della fedeltà sonora' },
    zh: { all: '全部', frames: '头像边框', skins: '音频皮肤', dsp: 'DSP 预设', sounds: '界面音效', themes: '主题', titles: '称号', vip: 'VIP 通行证', catalog: '奖励目录', catalogDesc: '自定义头像、播放器、DSP 音链和视觉主题。', quests: '发烧友任务与挑战', questDesc: '完成聆听和分析目标，快速获得金币。', daily: '每日', weekly: '每周', progress: '进度', claimed: '已领取奖励', claim: '领取奖励！', inProgress: '进行中', cost: '花费', equipped: '已装备', equip: '装备', redeem: '兑换', preview: '实时预览', previewTitle: '实时预览 • 沙盒', testing: '预览中', player: 'Sonar Hi-Fi 播放器', price: '价格', close: '关闭', redeemNow: '立即兑换', coins: '你的 Sonar Coins', streak: '连续聆听', crate: '每日黑胶箱', available: '可领取！', opened: '已开启', crateTitle: '神秘开箱', openCrate: '免费开启黑胶箱', opening: '正在开启黑胶…', rewardRedeemed: '奖励已兑换', community: '月度社区目标', communityReviews: '社区 Hi-Fi 评论', receipt: '复古收据', store: '发烧友商店与奖励', vault: '聆听忠诚宝库' },
    ja: { all: 'すべて', frames: 'アバターフレーム', skins: 'オーディオスキン', dsp: 'DSPプリセット', sounds: 'UIサウンド', themes: 'テーマ', titles: '称号', vip: 'VIPパス', catalog: 'リワードカタログ', catalogDesc: 'アバター、プレーヤー、DSPチェーン、ビジュアルテーマをカスタマイズ。', quests: 'オーディオファイルのミッションとチャレンジ', questDesc: 'リスニングと分析の目標を達成してコインを獲得しましょう。', daily: 'デイリー', weekly: 'ウィークリー', progress: '進捗', claimed: '報酬獲得済み', claim: '報酬を受け取る！', inProgress: '進行中', cost: 'コスト', equipped: '装備中', equip: '装備する', redeem: '交換', preview: 'ライブプレビュー', previewTitle: 'ライブプレビュー • サンドボックス', testing: 'プレビュー中', player: 'Sonar Hi-Fi プレーヤー', price: '価格', close: '閉じる', redeemNow: '今すぐ交換', coins: 'あなたのSonar Coins', streak: '連続リスニング', crate: 'デイリーレコードボックス', available: '利用可能！', opened: '開封済み', crateTitle: 'ミステリー開封', openCrate: 'レコードボックスを開く（無料）', opening: 'レコードを開封中…', rewardRedeemed: '報酬交換済み', community: '月間コミュニティ目標', communityReviews: 'コミュニティHi-Fiレビュー', receipt: 'レトロレシート', store: 'オーディオファイルのストアと報酬', vault: 'サウンドロイヤルティ保管庫' },
  };
  const t = useCallback((key) => {
    return repairRewardCopy(rewardsText[currentLang]?.[key] || spanishRewardsText[key] || '');
  }, [currentLang]);

  // Balance de Puntos & XP
  const [points, setPoints] = useState(() => {
    try {
      const saved = localStorage.getItem('sonar_user_points');
      return saved !== null ? Number(saved) : (user?.sonarPoints || 1350);
    } catch {
      return 1350;
    }
  });

  const [userXp, setUserXp] = useState(() => {
    try {
      const saved = localStorage.getItem('sonar_user_xp');
      return saved !== null ? Number(saved) : (user?.audiophileXp || 3650);
    } catch {
      return 3650;
    }
  });

  // Inventario y equipamiento
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('sonar_user_inventory');
      return saved ? JSON.parse(saved) : ['frame-gold-vinyl', 'title-absolute-pitch', 'perk-vip-room', 'dsp-warm-tube'];
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

  const [equippedDsp, setEquippedDsp] = useState(() => {
    try {
      return localStorage.getItem('sonar_equipped_dsp') || 'dsp-warm-tube';
    } catch {
      return 'dsp-warm-tube';
    }
  });

  const [equippedTheme, setEquippedTheme] = useState(() => {
    try {
      return localStorage.getItem('sonar_equipped_theme') || '';
    } catch {
      return '';
    }
  });

  const [activePerks, setActivePerks] = useState(() => {
    try {
      const saved = localStorage.getItem('sonar_active_perks');
      return saved ? JSON.parse(saved) : (user?.activePerks || ['perk-vip-room']);
    } catch {
      return ['perk-vip-room'];
    }
  });

  // Racha de Escucha (Streak)
  const [streakDays, setStreakDays] = useState(() => {
    try {
      const saved = localStorage.getItem('sonar_streak_days');
      return saved !== null ? Number(saved) : 4;
    } catch {
      return 4;
    }
  });

  const [streakClaimedToday, setStreakClaimedToday] = useState(() => {
    try {
      const last = localStorage.getItem('sonar_streak_last_claim');
      if (!last) return false;
      return new Date(last).toDateString() === new Date().toDateString();
    } catch {
      return false;
    }
  });

  // Temporizador de cuenta regresiva diaria
  const [timeRemaining, setTimeRemaining] = useState('');
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow - now;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(
        `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Estado de Caja Sorpresa Diaria
  const [crateOpened, setCrateOpened] = useState(() => {
    try {
      const last = localStorage.getItem('sonar_daily_crate_last_open');
      if (!last) return false;
      return new Date(last).toDateString() === new Date().toDateString();
    } catch {
      return false;
    }
  });

  const [isOpeningCrate, setIsOpeningCrate] = useState(false);
  const [crateReward, setCrateReward] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(soundEffects.isEnabled());

  // Modales adicionales
  const [previewItem, setPreviewItem] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('sonar_purchase_history');
      return saved
        ? JSON.parse(saved)
        : [
            { id: 'tx-1', name: 'Marco Vinilo de Oro 24K', cost: 450, date: '2026-09-27 18:30', type: 'frame' },
            { id: 'tx-2', name: 'Preset DSP: Calidez Valvular 1970', cost: 400, date: '2026-09-28 10:15', type: 'dsp' },
            { id: 'tx-3', name: 'Pase VIP Salón de Debate Acústico', cost: 200, date: '2026-09-28 12:40', type: 'perk' },
          ];
    } catch {
      return [];
    }
  });

  // Misiones
  const [quests, setQuests] = useState(() => {
    try {
      const saved = localStorage.getItem('sonar_rewards_quests');
      return saved ? JSON.parse(saved) : INITIAL_QUESTS;
    } catch {
      return INITIAL_QUESTS;
    }
  });

  // Meta Comunitaria
  const [communityReviewsCount] = useState(1248);
  const communityGoal = 1500;
  const communityProgressPercent = Math.min(100, Math.round((communityReviewsCount / communityGoal) * 100));

  // Actualizadores de estado
  const updatePoints = (newPoints) => {
    setPoints(newPoints);
    try {
      localStorage.setItem('sonar_user_points', String(newPoints));
      updateUser?.({ sonarPoints: newPoints });
      window.dispatchEvent(new CustomEvent('sonar:points-updated', { detail: { points: newPoints } }));
      window.dispatchEvent(new CustomEvent('sonar:points-awarded', { detail: { points: newPoints } }));
      window.dispatchEvent(new CustomEvent('sonar:profile-customization-changed', { detail: { sonarPoints: newPoints } }));
    } catch {}
  };

  const updateXp = (newXp) => {
    setUserXp(newXp);
    try {
      localStorage.setItem('sonar_user_xp', String(newXp));
      updateUser?.({ audiophileXp: newXp });
      window.dispatchEvent(new CustomEvent('sonar:profile-customization-changed', { detail: { audiophileXp: newXp } }));
    } catch {}
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.toggle(next);
    if (next) soundEffects.playCoin();
    showToast(next ? (t('soundEnabledToast') || ui('🔊 Efectos sonoros de UI activados')) : (t('soundDisabledToast') || ui('🔇 Efectos sonoros silenciados')));
  };

  const getToastMessage = (type, params = {}) => {
    const locName = params.name || '';
    const messages = {
      es: {
        frameEquipped: `✨ Marco "${locName}" equipado`,
        frameUnequipped: 'Marco desequipado',
        titleEquipped: `🎖️ Título "${locName}" activado`,
        titleUnequipped: 'Título desequipado',
        skinEquipped: `🎛️ Skin "${locName}" activada`,
        skinUnequipped: 'Skin desequipada',
        dspEquipped: `🎚️ "${locName}" activado en tu cadena de audio`,
        dspUnequipped: 'DSP desactivado',
        themeEquipped: `🎨 "${locName}" aplicado a la interfaz`,
        themeUnequipped: 'Tema por defecto restaurado',
        soundEquipped: `🔊 Pack sonoro "${locName}" activado`,
        perkEquipped: `🎟️ Pase "${locName}" activado`,
        perkUnequipped: 'Pase desactivado',
        redeemed: `🎉 ¡Canjeaste con éxito "${locName}"!`,
        insufficientCoins: `❌ Necesitas ${params.diff || 0} monedas más para canjear este artículo.`,
        questClaimed: `🎉 ¡Misión completada! +${params.pts || 0} Coins y +${params.xp || 0} XP`,
        streakBonus: `🔥 ¡Racha de ${params.streak || 0} días! Has ganado +${params.bonus || 0} Sonar Coins de bonus.`,
        crateLegendary: `🌟 ¡Caja de Vinilo Legendaria! +350 Coins & +300 XP`,
        crateRare: `💎 ¡Prensado Raro! +200 Sonar Coins & +200 XP`,
        crateCommon: `💿 ¡Vinilo Clásico! +120 Sonar Coins & +150 XP`,
      },
      en: {
        frameEquipped: `✨ Frame "${locName}" equipped`,
        frameUnequipped: 'Frame unequipped',
        titleEquipped: `🎖️ Title "${locName}" activated`,
        titleUnequipped: 'Title unequipped',
        skinEquipped: `🎛️ Skin "${locName}" activated`,
        skinUnequipped: 'Skin unequipped',
        dspEquipped: `🎚️ "${locName}" activated in your audio chain`,
        dspUnequipped: 'DSP deactivated',
        themeEquipped: `🎨 "${locName}" applied to interface`,
        themeUnequipped: 'Default theme restored',
        soundEquipped: `🔊 Sound pack "${locName}" activated`,
        perkEquipped: `🎟️ Pass "${locName}" activated`,
        perkUnequipped: 'Pass deactivated',
        redeemed: `🎉 Successfully redeemed "${locName}"!`,
        insufficientCoins: `❌ You need ${params.diff || 0} more coins to redeem this item.`,
        questClaimed: `🎉 Quest completed! +${params.pts || 0} Coins & +${params.xp || 0} XP`,
        streakBonus: `🔥 ${params.streak || 0}-day streak! You earned +${params.bonus || 0} Sonar Coins bonus.`,
        crateLegendary: `🌟 Legendary Vinyl Crate! +350 Coins & +300 XP`,
        crateRare: `💎 Rare Pressing! +200 Sonar Coins & +200 XP`,
        crateCommon: `💿 Classic Vinyl! +120 Sonar Coins & +150 XP`,
      },
      fr: {
        frameEquipped: `✨ Cadre « ${locName} » équipé`,
        frameUnequipped: 'Cadre retiré',
        titleEquipped: `🎖️ Titre « ${locName} » activé`,
        titleUnequipped: 'Titre retiré',
        skinEquipped: `🎛️ Skin « ${locName} » activée`,
        skinUnequipped: 'Skin retirée',
        dspEquipped: `🎚️ « ${locName} » activé dans votre chaîne audio`,
        dspUnequipped: 'DSP désactivé',
        themeEquipped: `🎨 « ${locName} » appliqué à l'interface`,
        themeUnequipped: 'Thème par défaut restauré',
        soundEquipped: `🔊 Pack sonore « ${locName} » activé`,
        perkEquipped: `🎟️ Pass « ${locName} » activé`,
        perkUnequipped: 'Pass désactivé',
        redeemed: `🎉 Vous avez obtenu « ${locName} » avec succès !`,
        insufficientCoins: `❌ Il vous manque ${params.diff || 0} pièces pour cet article.`,
        questClaimed: `🎉 Quête terminée ! +${params.pts || 0} Pièces & +${params.xp || 0} XP`,
        streakBonus: `🔥 Série de ${params.streak || 0} jours ! Vous avez gagné +${params.bonus || 0} Sonar Coins en bonus.`,
        crateLegendary: `🌟 Caisse Vinyle Légendaire ! +350 Pièces & +300 XP`,
        crateRare: `💎 Pressage Rare ! +200 Pièces & +200 XP`,
        crateCommon: `💿 Vinyle Classique ! +120 Pièces & +150 XP`,
      },
      it: {
        frameEquipped: `✨ Cornice "${locName}" equipaggiata`,
        frameUnequipped: 'Cornice rimossa',
        titleEquipped: `🎖️ Titolo "${locName}" attivato`,
        titleUnequipped: 'Titolo rimosso',
        skinEquipped: `🎛️ Skin "${locName}" attivata`,
        skinUnequipped: 'Skin rimossa',
        dspEquipped: `🎚️ "${locName}" attivato nella catena audio`,
        dspUnequipped: 'DSP disattivato',
        themeEquipped: `🎨 "${locName}" applicato all'interfaccia`,
        themeUnequipped: 'Tema predefinito ripristinato',
        soundEquipped: `🔊 Pacchetto suoni "${locName}" attivato`,
        perkEquipped: `🎟️ Pass "${locName}" attivato`,
        perkUnequipped: 'Pass disattivato',
        redeemed: `🎉 Hai riscattato con successo "${locName}"!`,
        insufficientCoins: `❌ Ti servono altre ${params.diff || 0} monete per riscattare questo articolo.`,
        questClaimed: `🎉 Missione completata! +${params.pts || 0} Monete & +${params.xp || 0} XP`,
        streakBonus: `🔥 Serie di ${params.streak || 0} giorni! Hai guadagnato +${params.bonus || 0} Sonar Coins di bonus.`,
        crateLegendary: `🌟 Cassa Vinile Leggendaria! +350 Monete & +300 XP`,
        crateRare: `💎 Stampa Rara! +200 Monete & +200 XP`,
        crateCommon: `💿 Vinile Classico! +120 Monete & +150 XP`,
      },
      zh: {
        frameEquipped: `✨ 已装备头像框“${locName}”`,
        frameUnequipped: '已卸下头像框',
        titleEquipped: `🎖️ 已启用称号“${locName}”`,
        titleUnequipped: '已卸下称号',
        skinEquipped: `🎛️ 已应用皮肤“${locName}”`,
        skinUnequipped: '已卸下皮肤',
        dspEquipped: `🎚️ 已在音频链中启用“${locName}”`,
        dspUnequipped: '已停用 DSP',
        themeEquipped: `🎨 已应用界面主题“${locName}”`,
        themeUnequipped: '已恢复默认主题',
        soundEquipped: `🔊 已启用音效包“${locName}”`,
        perkEquipped: `🎟️ 已激活通行证“${locName}”`,
        perkUnequipped: '已停用通行证',
        redeemed: `🎉 成功兑换“${locName}”！`,
        insufficientCoins: `❌ 兑换此物品还需要 ${params.diff || 0} 个金币。`,
        questClaimed: `🎉 任务完成！+${params.pts || 0} 金币与 +${params.xp || 0} 经验`,
        streakBonus: `🔥 连续签到 ${params.streak || 0} 天！获得额外 +${params.bonus || 0} 金币奖励。`,
        crateLegendary: `🌟 传奇黑胶盲盒！+350 金币 & +300 XP`,
        crateRare: `💎 珍稀压制！+200 金币 & +200 XP`,
        crateCommon: `💿 经典黑胶！+120 金币 & +150 XP`,
      },
      ja: {
        frameEquipped: `✨ フレーム「${locName}」を装着しました`,
        frameUnequipped: 'フレームの装備を解除しました',
        titleEquipped: `🎖️ 称号「${locName}」を装着しました`,
        titleUnequipped: '称号の装備を解除しました',
        skinEquipped: `🎛️ スキン「${locName}」を適用しました`,
        skinUnequipped: 'スキンの適用を解除しました',
        dspEquipped: `🎚️ オーディオチェーンに「${locName}」を適用しました`,
        dspUnequipped: 'DSPを解除しました',
        themeEquipped: `🎨 UIテーマに「${locName}」を適用しました`,
        themeUnequipped: 'デフォルトテーマに戻しました',
        soundEquipped: `🔊 サウンドパック「${locName}」を有効化しました`,
        perkEquipped: `🎟️ パス「${locName}」を有効化しました`,
        perkUnequipped: 'パスを無効化しました',
        redeemed: `🎉 「${locName}」の引き換えに成功しました！`,
        insufficientCoins: `❌ このアイテムを引き換えるにはあと ${params.diff || 0} コイン必要です。`,
        questClaimed: `🎉 ミッション完了！+${params.pts || 0} コイン & +${params.xp || 0} XP`,
        streakBonus: `🔥 ${params.streak || 0}日連続リスニング達成！ボーナス +${params.bonus || 0} コインを獲得しました。`,
        crateLegendary: `🌟 伝説のレコードボックス！+350 コイン & +300 XP`,
        crateRare: `💎 レアプレス！+200 コイン & +200 XP`,
        crateCommon: `💿 クラシックレコード！+120 コイン & +150 XP`,
      },
    };
    return messages[currentLang]?.[type] || messages.es[type] || '';
  };

  // Reclamar Racha Diaria
  const handleClaimDailyStreak = () => {
    if (streakClaimedToday) return;
    const bonus = 50 * (streakDays >= 5 ? 2 : streakDays >= 3 ? 1.5 : 1);
    const nextPoints = points + bonus;
    const nextStreak = streakDays + 1;

    updatePoints(nextPoints);
    setStreakDays(nextStreak);
    setStreakClaimedToday(true);
    soundEffects.playFanfare();

    try {
      localStorage.setItem('sonar_streak_days', String(nextStreak));
      localStorage.setItem('sonar_streak_last_claim', new Date().toISOString());
    } catch {}

    showToast(getToastMessage('streakBonus', { streak: nextStreak, bonus }));
  };

  // Abrir Caja Misteriosa
  const handleOpenCrate = () => {
    if (crateOpened || isOpeningCrate) return;
    setIsOpeningCrate(true);
    soundEffects.playNeedleDrop();

    setTimeout(() => {
      const rewardsList = [
        { type: 'legendary', points: 350, xp: 300, toastKey: 'crateLegendary' },
        { type: 'rare', points: 200, xp: 200, toastKey: 'crateRare' },
        { type: 'common', points: 120, xp: 150, toastKey: 'crateCommon' },
      ];
      const selected = rewardsList[Math.floor(Math.random() * rewardsList.length)];

      updatePoints(points + selected.points);
      updateXp(userXp + selected.xp);

      setCrateReward(selected);
      setCrateOpened(true);
      setIsOpeningCrate(false);
      soundEffects.playFanfare();

      try {
        localStorage.setItem('sonar_daily_crate_last_open', new Date().toISOString());
      } catch {}

      showToast(getToastMessage(selected.toastKey));
    }, 2000);
  };

  // Reclamar Misión
  const handleClaimQuest = (questId) => {
    const q = quests.find((item) => item.id === questId);
    if (!q || q.claimed || q.progress < q.target) return;

    const rewardPoints = q.rewardPts || 150;
    const rewardXp = q.rewardXp || 250;

    const updated = quests.map((item) => (item.id === questId ? { ...item, claimed: true } : item));
    setQuests(updated);

    updatePoints(points + rewardPoints);
    updateXp(userXp + rewardXp);
    soundEffects.playCoin();

    try {
      localStorage.setItem('sonar_rewards_quests', JSON.stringify(updated));
    } catch {}

    showToast(getToastMessage('questClaimed', { pts: rewardPoints, xp: rewardXp }));
  };

  // Equipar Artículo con respuesta instantánea
  const handleEquip = useCallback((item) => {
    soundEffects.playClick();
    const locItem = localizedReward(item);
    if (item.type === 'frame') {
      const next = equippedFrame === item.id ? '' : item.id;
      setEquippedFrame(next);
      showToast(next ? getToastMessage('frameEquipped', { name: locItem.name }) : getToastMessage('frameUnequipped'));
      try {
        localStorage.setItem('sonar_equipped_frame', next);
        window.dispatchEvent(new CustomEvent('sonar:profile-customization-changed', { detail: { equippedFrame: next } }));
      } catch {}
      if (updateUser) {
        setTimeout(() => updateUser({ equippedFrame: next }), 60);
      }
    } else if (item.type === 'title') {
      const cleanTitle = item.name.replace(/^Título:\s*/i, '');
      const locTitle = locItem.name.replace(/^Título:\s*|^Title:\s*|^Titre\s*:\s*|^Titolo:\s*|^称号[：:]\s*|^称号\s*/i, '');
      const next = equippedTitle === cleanTitle ? '' : cleanTitle;
      setEquippedTitle(next);
      showToast(next ? getToastMessage('titleEquipped', { name: locTitle }) : getToastMessage('titleUnequipped'));
      try {
        localStorage.setItem('sonar_equipped_title', next);
        window.dispatchEvent(new CustomEvent('sonar:profile-customization-changed', { detail: { equippedTitle: next } }));
      } catch {}
      if (updateUser) {
        setTimeout(() => updateUser({ equippedTitle: next }), 60);
      }
    } else if (item.type === 'skin') {
      const next = equippedSkin === item.id ? '' : item.id;
      setEquippedSkin(next);
      showToast(next ? getToastMessage('skinEquipped', { name: locItem.name }) : getToastMessage('skinUnequipped'));
      try {
        localStorage.setItem('sonar_equipped_skin', next);
        window.dispatchEvent(new CustomEvent('sonar:profile-customization-changed', { detail: { equippedSkin: next } }));
      } catch {}
      if (updateUser) {
        setTimeout(() => updateUser({ equippedSkin: next }), 60);
      }
    } else if (item.type === 'dsp') {
      const next = equippedDsp === item.id ? '' : item.id;
      setEquippedDsp(next);
      showToast(next ? getToastMessage('dspEquipped', { name: locItem.name }) : getToastMessage('dspUnequipped'));
      try {
        localStorage.setItem('sonar_equipped_dsp', next);
      } catch {}
    } else if (item.type === 'theme') {
      const next = equippedTheme === item.id ? '' : item.id;
      setEquippedTheme(next);
      showToast(next ? getToastMessage('themeEquipped', { name: locItem.name }) : getToastMessage('themeUnequipped'));
      try {
        localStorage.setItem('sonar_equipped_theme', next);
      } catch {}
    } else if (item.type === 'sound') {
      showToast(getToastMessage('soundEquipped', { name: locItem.name }));
    } else if (item.type === 'perk') {
      const isAlreadyActive = activePerks.includes(item.id);
      const nextPerks = isAlreadyActive
        ? activePerks.filter((id) => id !== item.id)
        : [...activePerks, item.id];
      setActivePerks(nextPerks);
      showToast(!isAlreadyActive ? getToastMessage('perkEquipped', { name: locItem.name }) : getToastMessage('perkUnequipped'));
      try {
        localStorage.setItem('sonar_active_perks', JSON.stringify(nextPerks));
        window.dispatchEvent(new CustomEvent('sonar:profile-customization-changed', { detail: { activePerks: nextPerks } }));
      } catch {}
      if (updateUser) {
        setTimeout(() => updateUser({ activePerks: nextPerks }), 60);
      }
    }
  }, [equippedFrame, equippedTitle, equippedSkin, equippedDsp, equippedTheme, activePerks, localizedReward, getToastMessage, updateUser]);

  // Canjear Artículo
  const handleRedeem = useCallback((item) => {
    const locItem = localizedReward(item);
    if (inventory.includes(item.id)) return;
    if (points < item.cost) {
      soundEffects.playClick();
      showToast(getToastMessage('insufficientCoins', { diff: item.cost - points }));
      return;
    }

    const nextPoints = points - item.cost;
    const nextInventory = [...inventory, item.id];
    const newTx = {
      id: `tx-${Date.now()}`,
      name: item.name,
      cost: item.cost,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type: item.type,
    };
    const nextHistory = [newTx, ...purchaseHistory];

    updatePoints(nextPoints);
    setInventory(nextInventory);
    setPurchaseHistory(nextHistory);
    soundEffects.playFanfare();

    try {
      localStorage.setItem('sonar_user_inventory', JSON.stringify(nextInventory));
      localStorage.setItem('sonar_purchase_history', JSON.stringify(nextHistory));
    } catch {}

    handleEquip(item);
    showToast(getToastMessage('redeemed', { name: locItem.name }));
  }, [inventory, points, purchaseHistory, localizedReward, handleEquip, getToastMessage]);

  const handlePreview = useCallback((item) => {
    soundEffects.playClick();
    setPreviewItem(item);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(24);
  const [viewMode, setViewMode] = useState('slider'); // 'slider' | 'grid'
  const singleSliderRef = useRef(null);

  const categoryFiltered = useMemo(() => {
    return activeCategory === 'all'
      ? REWARD_ITEMS
      : REWARD_ITEMS.filter((item) => item.type === activeCategory);
  }, [activeCategory]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return categoryFiltered;
    const q = searchQuery.toLowerCase();
    return categoryFiltered.filter((storedItem) => {
      const item = localizedReward(storedItem);
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q))
      );
    });
  }, [categoryFiltered, searchQuery, localizedReward]);

  const displayedItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const userLevel = Math.max(1, Math.floor(userXp / 300) + 1);
  const currentLevelProgress = userXp % 300;
  const percentToNextLevel = Math.min(100, Math.round((currentLevelProgress / 300) * 100));

  const categoryDefinitions = useMemo(() => [
    { id: 'frame', label: t('frames'), icon: 'portrait', title: ui('Marcos de Avatar') },
    { id: 'skin', label: t('skins'), icon: 'album', title: ui('Skins de Reproductor') },
    { id: 'dsp', label: t('dsp'), icon: 'tune', title: ui('Presets DSP & Audio') },
    { id: 'sound', label: t('sounds'), icon: 'volume_up', title: ui('Packs de Sonidos UI') },
    { id: 'theme', label: t('themes'), icon: 'palette', title: ui('Temas Visuales UI') },
    { id: 'title', label: t('titles'), icon: 'military_tech', title: ui('Títulos de Prestigio') },
    { id: 'perk', label: t('vip'), icon: 'verified', title: ui('Pases VIP & Beneficios') },
  ], [t, ui]);

  return (
    <div className="space-y-8 text-[#231123] dark:text-white relative">
      {/* Toast Notifier */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'transform, opacity' }}
            className="fixed top-20 right-6 z-50 bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-black font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-300/60 pointer-events-none"
          >
            <span className="material-symbols-outlined text-black font-black text-xl">celebration</span>
            <span className="text-sm font-bold tracking-tight">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Principal con Balance & Controles */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#231123] via-[#4B2840] to-[#231123] border border-[#4B2840] p-6 md:p-8 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold tracking-wider uppercase border border-amber-500/20 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">workspace_premium</span>
                {t('store')}
              </span>
              <button
                onClick={toggleSound}
                className={`p-1.5 rounded-full border text-xs transition-colors flex items-center gap-1 ${
                  soundEnabled
                    ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}
                title={soundEnabled ? ui('Silenciar efectos de sonido') : ui('Activar efectos de sonido de UI')}
              >
                <span className="material-symbols-outlined text-sm">
                  {soundEnabled ? 'volume_up' : 'volume_off'}
                </span>
              </button>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
              {t('vault')}
            </h2>
            <p className="text-zinc-400 text-sm mt-1 max-w-xl">
              {ui('Gana Sonar Coins escuchando vinilos, publicando reseñas Hi-Fi y manteniendo tu racha de audiófilo.')}
            </p>
          </div>

          {/* Tarjetas de Balance */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            {/* Sonar Coins */}
            <div className="flex-1 sm:flex-initial bg-white dark:bg-zinc-800/80 border border-[#4B2840]/30 dark:border-amber-500/30 rounded-2xl p-4 flex items-center gap-4 shadow-lg backdrop-blur-sm text-[#231123] dark:text-white">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-zinc-950 shadow-md shadow-amber-500/20">
                <span className="material-symbols-outlined text-2xl font-bold">monetization_on</span>
              </div>
              <div>
                <div className="text-xs text-[#5c435a] dark:text-zinc-400 font-medium">{t('coins')}</div>
                <div className="text-2xl font-black text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  {points.toLocaleString()}
                  <span className="text-xs font-bold text-amber-500/80">🪙</span>
                </div>
              </div>
            </div>

            {/* Rango & XP */}
            <div className="flex-1 sm:flex-initial bg-white dark:bg-zinc-800/80 border border-[#e6d5e2] dark:border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-lg backdrop-blur-sm text-[#231123] dark:text-white">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                <span className="material-symbols-outlined text-2xl">military_tech</span>
              </div>
              <div>
                <div className="text-xs text-[#5c435a] dark:text-zinc-400 font-medium">{ui('Nivel')} {userLevel} • {ui('Audiófilo')}</div>
                <div className="text-lg font-bold text-[#231123] dark:text-white flex items-center gap-2">
                  {userXp} XP
                  <span className="text-xs text-purple-400 font-medium">({percentToNextLevel}%)</span>
                </div>
              </div>
            </div>

            {/* Botón Recibo Retro */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setShowReceipt(true);
              }}
              className="px-3.5 py-4 bg-white dark:bg-zinc-800/80 hover:bg-[#f8e9f6] dark:hover:bg-zinc-700/80 border border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09]/40 rounded-2xl flex items-center gap-2 text-xs font-semibold text-[#5c435a] dark:text-zinc-300 hover:text-[#B80C09] dark:hover:text-amber-400 transition-all shadow-md"
              title={ui('Ver Recibo de Disquería Retro')}
            >
              <span className="material-symbols-outlined text-lg">receipt_long</span>
              <span className="hidden sm:inline">{t('receipt')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fila: Racha Diaria + Caja Misteriosa + Meta Comunitaria */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Racha de Escucha (Streak) */}
          <div className="bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-950 border border-[#e6d5e2] dark:border-orange-500/20 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xl text-[#231123] dark:text-white">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-[#B80C09]/10 dark:bg-orange-500/10 text-[#B80C09] dark:text-orange-400 text-xs font-bold border border-[#B80C09]/20 dark:border-orange-500/20 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">local_fire_department</span>
              {t('streak')}
            </span>
            <span className="text-xs text-[#5c435a]/70 dark:text-zinc-500 font-mono flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">timer</span>
              {timeRemaining}
            </span>
          </div>

          <div className="my-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-black font-black text-2xl shadow-lg shadow-orange-500/30">
              {streakDays}
            </div>
            <div>
              <div className="text-xl font-bold text-[#231123] dark:text-white flex items-center gap-2">
                {ui('Días Consecutivos')} 🔥
              </div>
              <p className="text-xs text-[#B80C09] dark:text-orange-400/90 mt-0.5">
                {ui('Multiplicador activo:')} <span className="font-bold">{streakDays >= 5 ? '2.0x' : streakDays >= 3 ? '1.5x' : '1.2x'} Coins</span>
              </p>
            </div>
          </div>

          <button
            disabled={streakClaimedToday}
            onClick={handleClaimDailyStreak}
            className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              streakClaimedToday
                ? 'bg-gray-100 dark:bg-zinc-800/80 text-gray-500 dark:text-zinc-500 border border-gray-200 dark:border-zinc-700/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black shadow-lg shadow-orange-500/20 active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {streakClaimedToday ? 'check_circle' : 'redeem'}
            </span>
            {streakClaimedToday ? ui('Racha Reclamada Hoy') : `${ui('Reclamar Bono Diario')} (+50 🪙)`}
          </button>
        </div>

        {/* 2. Caja Misteriosa de Vinilo */}
          <div className="bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-950 border border-[#e6d5e2] dark:border-amber-500/20 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xl text-[#231123] dark:text-white">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-[#B80C09]/10 dark:bg-amber-500/10 text-[#B80C09] dark:text-amber-400 text-xs font-bold border border-[#B80C09]/20 dark:border-amber-500/20 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">album</span>
              {t('crate')}
            </span>
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              {crateOpened ? t('opened') : t('available')}
            </span>
          </div>

          <div className="my-4 flex items-center gap-4">
            <motion.div
              animate={isOpeningCrate ? { rotate: [0, -15, 15, -15, 15, 360], scale: [1, 1.1, 1.15, 1] } : {}}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center text-zinc-950 shadow-lg shadow-amber-500/30"
            >
              <span className="material-symbols-outlined text-3xl font-bold">
                {isOpeningCrate ? 'motion_photos_on' : 'redeem'}
              </span>
            </motion.div>
            <div>
            <div className="text-lg font-bold text-[#231123] dark:text-white">{t('crateTitle')}</div>
              <p className="text-xs text-[#5c435a] dark:text-zinc-400 mt-0.5">
                {crateOpened
                  ? ui('Vuelve mañana para abrir otra funda de vinilo')
                  : ui('Abre la funda sellada y gana recompensas aleatorias')}
              </p>
            </div>
          </div>

          <button
            disabled={crateOpened || isOpeningCrate}
            onClick={handleOpenCrate}
            className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              crateOpened
                ? 'bg-gray-100 dark:bg-zinc-800/80 text-gray-500 dark:text-zinc-500 border border-gray-200 dark:border-zinc-700/50 cursor-not-allowed'
                : isOpeningCrate
                ? 'bg-amber-500/50 text-black animate-pulse cursor-wait'
                : 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black shadow-lg shadow-amber-500/20 active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {isOpeningCrate ? 'hourglass_top' : crateOpened ? 'check' : 'lock_open'}
            </span>
            {isOpeningCrate ? t('opening') : crateOpened ? t('rewardRedeemed') : t('openCrate')}
          </button>
        </div>

        {/* 3. Meta Comunitaria de Reseñas */}
          <div className="bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-950 border border-[#e6d5e2] dark:border-cyan-500/20 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xl text-[#231123] dark:text-white">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-[#003844]/10 dark:bg-cyan-500/10 text-[#003844] dark:text-cyan-400 text-xs font-bold border border-[#003844]/20 dark:border-cyan-500/20 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">groups</span>
              {t('community')}
            </span>
            <span className="text-xs font-bold text-[#003844] dark:text-cyan-300">{communityProgressPercent}%</span>
          </div>

          <div className="my-4">
            <div className="flex justify-between text-xs text-[#5c435a] dark:text-zinc-300 mb-1.5">
              <span>{t('communityReviews')}</span>
              <span className="font-bold text-[#003844] dark:text-cyan-400">{communityReviewsCount} / {communityGoal}</span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden border border-[#e6d5e2] dark:border-white/5">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                style={{ width: `${communityProgressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-[#5c435a] dark:text-zinc-400 mt-2">
              🎁 {ui('Al llegar a la meta: Toda la comunidad desbloquea la skin conmemorativa')} <span className="text-[#003844] dark:text-cyan-300 font-semibold">{ui('Tornamesa Direct Drive')}</span>.
            </p>
          </div>

          <div className="text-center py-1 bg-[#003844]/5 dark:bg-cyan-500/5 rounded-xl border border-[#003844]/10 dark:border-cyan-500/10 text-xs font-semibold text-[#003844] dark:text-cyan-300">
            {ui('¡Faltan solo')} {communityGoal - communityReviewsCount} {ui('reseñas para el desbloqueo colectivo!')}
          </div>
        </div>
      </div>

      {/* Misiones Dinámicas (Quests) */}
      <div className="bg-[#f8e9f6] dark:bg-zinc-900/60 border border-[#e6d5e2] dark:border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-black text-[#231123] dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B80C09] dark:text-amber-400">task_alt</span>
              {t('quests')}
            </h3>
            <p className="text-xs text-[#5c435a] dark:text-zinc-400 mt-0.5">
              {t('questDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quests.map((storedQuest) => {
          const quest = localizedQuest(storedQuest);
            const isReady = quest.progress >= quest.target;
            const progressPercent = Math.min(100, Math.round((quest.progress / quest.target) * 100));

            return (
              <div
                key={quest.id}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-800/50 border border-[#e6d5e2] dark:border-white/5 hover:border-[#B80C09]/40 dark:hover:border-white/15 transition-all flex flex-col justify-between gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#B80C09]/10 dark:bg-amber-500/10 border border-[#B80C09]/20 dark:border-amber-500/20 text-[#B80C09] dark:text-amber-400 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">{quest.icon}</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#231123] dark:text-white flex items-center gap-2">
                        {quest.title}
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f8e9f6] dark:bg-zinc-700/60 text-[#5c435a] dark:text-zinc-300 uppercase font-semibold">
                          {quest.type === 'daily' ? t('daily') : t('weekly')}
                        </span>
                      </div>
                      <p className="text-xs text-[#5c435a] dark:text-zinc-400 mt-0.5">{quest.desc}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-amber-700 dark:text-amber-400">+{quest.rewardPts} 🪙</span>
                    <div className="text-[10px] text-purple-400 font-semibold">+{quest.rewardXp} XP</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-[#5c435a] dark:text-zinc-400 font-medium">
                    <span>{t('progress')}</span>
                    <span className="text-[#231123] dark:text-white font-bold">{quest.progress} / {quest.target}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-zinc-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <button
                    disabled={!isReady || quest.claimed}
                    onClick={() => handleClaimQuest(quest.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      quest.claimed
                        ? 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500 border border-gray-200 dark:border-zinc-700/40 cursor-not-allowed'
                        : isReady
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold shadow-md shadow-amber-500/20 active:scale-95'
                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-white/5 cursor-not-allowed'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {quest.claimed ? 'done_all' : isReady ? 'redeem' : 'lock'}
                    </span>
                    {quest.claimed ? t('claimed') : isReady ? t('claim') : t('inProgress')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Catálogo de la Tienda */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black text-[#231123] dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B80C09] dark:text-amber-400">storefront</span>
              {t('catalog')}
            </h3>
            <p className="text-xs text-[#5c435a] dark:text-zinc-400 mt-0.5">
              {t('catalogDesc')}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* View Mode Switcher (Slider vs Grid) */}
            <div className="flex items-center p-1 rounded-2xl bg-white dark:bg-zinc-800/90 border border-[#e6d5e2] dark:border-white/10 shadow-sm">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setViewMode('slider');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'slider'
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                    : 'text-[#5c435a] dark:text-zinc-400 hover:text-[#231123] dark:hover:text-white'
                }`}
                title={ui('Carrusel Deslizante')}
              >
                <span className="material-symbols-outlined text-sm">view_carousel</span>
                <span className="hidden sm:inline">{ui('Carrusel Deslizante')}</span>
                <span className="sm:hidden">{ui('Deslizar')}</span>
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setViewMode('grid');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                    : 'text-[#5c435a] dark:text-zinc-400 hover:text-[#231123] dark:hover:text-white'
                }`}
                title={ui('Vista Cuadrícula')}
              >
                <span className="material-symbols-outlined text-sm">grid_view</span>
                <span className="hidden sm:inline">{ui('Vista Cuadrícula')}</span>
                <span className="sm:hidden">{ui('Cuadrícula')}</span>
              </button>
            </div>

            {/* Barra de Búsqueda */}
            <div className="relative flex-1 md:w-64">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(24);
                }}
                placeholder={ui('Buscar por nombre, preset, marca o descripción...')}
                className="w-full pl-9 pr-8 py-2 text-xs rounded-2xl bg-white dark:bg-zinc-800/90 text-[#231123] dark:text-white border border-[#e6d5e2] dark:border-white/10 focus:border-[#B80C09] dark:focus:border-amber-400 focus:outline-none transition-all placeholder:text-[#5c435a]/60 dark:placeholder:text-zinc-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 text-xs"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filtros de Categoría con Contadores */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: t('all'), count: REWARD_ITEMS.length },
              { id: 'frame', label: t('frames'), count: REWARD_ITEMS.filter(i => i.type === 'frame').length },
              { id: 'skin', label: t('skins'), count: REWARD_ITEMS.filter(i => i.type === 'skin').length },
              { id: 'dsp', label: t('dsp'), count: REWARD_ITEMS.filter(i => i.type === 'dsp').length },
              { id: 'sound', label: t('sounds'), count: REWARD_ITEMS.filter(i => i.type === 'sound').length },
              { id: 'theme', label: t('themes'), count: REWARD_ITEMS.filter(i => i.type === 'theme').length },
              { id: 'title', label: t('titles'), count: REWARD_ITEMS.filter(i => i.type === 'title').length },
              { id: 'perk', label: t('vip'), count: REWARD_ITEMS.filter(i => i.type === 'perk').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  soundEffects.playClick();
                  setActiveCategory(tab.id);
                  setVisibleCount(24);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeCategory === tab.id
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                    : 'bg-white dark:bg-zinc-800/80 text-[#5c435a] dark:text-zinc-400 hover:text-[#231123] dark:hover:text-white hover:bg-[#f8e9f6] dark:hover:bg-zinc-700/80 border border-[#e6d5e2] dark:border-white/5'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeCategory === tab.id ? 'bg-black/20 text-black' : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-[#5c435a] dark:text-zinc-400 font-medium">
            <span>
              {filteredItems.length} {ui('recompensas')}
            </span>
          </div>
        </div>

        {/* Estado Vacío cuando no hay resultados de búsqueda */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-zinc-900/40 rounded-3xl border border-[#e6d5e2] dark:border-white/5 p-8">
            <span className="material-symbols-outlined text-4xl text-zinc-400 mb-2">search_off</span>
            <p className="text-sm font-bold text-[#231123] dark:text-white">{ui('No se encontraron recompensas')}</p>
            <p className="text-xs text-[#5c435a] dark:text-zinc-400 mt-1">{ui('Prueba con otro término de búsqueda o selecciona otra categoría.')}</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setVisibleCount(24);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-400 text-black text-xs font-bold shadow hover:bg-amber-300 transition-all"
            >
              {ui('Ver todo el catálogo')}
            </button>
          </div>
        )}

        {/* CONTENIDO DEL CATÁLOGO: MODO SLIDER O MODO GRID */}
        {filteredItems.length > 0 && (
          viewMode === 'slider' ? (
            activeCategory === 'all' && !searchQuery.trim() ? (
              /* Modo Slider por Categorías Deslizantes (Rails) */
              <div className="space-y-8">
                {categoryDefinitions.map((cat) => {
                  const catItems = REWARD_ITEMS.filter((i) => i.type === cat.id);
                  if (catItems.length === 0) return null;
                  return (
                    <SliderRail
                      key={cat.id}
                      title={cat.title}
                      icon={cat.icon}
                      items={catItems}
                      localizedMap={localizedRewardMap}
                      inventory={inventory}
                      equippedFrame={equippedFrame}
                      equippedTitle={equippedTitle}
                      equippedSkin={equippedSkin}
                      equippedDsp={equippedDsp}
                      equippedTheme={equippedTheme}
                      activePerks={activePerks}
                      points={points}
                      onEquip={handleEquip}
                      onRedeem={handleRedeem}
                      onPreview={handlePreview}
                      onExplore={() => {
                        soundEffects.playClick();
                        setActiveCategory(cat.id);
                      }}
                      t={t}
                      ui={ui}
                    />
                  );
                })}
              </div>
            ) : (
              /* Modo Slider para Categoría Individual o Búsqueda */
              <div className="space-y-4 p-4 md:p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/50 border border-[#e6d5e2] dark:border-white/10 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#5c435a] dark:text-zinc-400 font-semibold">
                      {ui('Desliza horizontalmente para ver las opciones disponibles')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => singleSliderRef.current?.scrollBy({ left: -460, behavior: 'smooth' })}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-800 hover:bg-amber-400 hover:text-black text-[#231123] dark:text-white border border-[#e6d5e2] dark:border-white/10 flex items-center justify-center transition-all shadow active:scale-95 cursor-pointer"
                      title={ui('Deslizar a la izquierda')}
                    >
                      <span className="material-symbols-outlined text-lg">chevron_left</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => singleSliderRef.current?.scrollBy({ left: 460, behavior: 'smooth' })}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-800 hover:bg-amber-400 hover:text-black text-[#231123] dark:text-white border border-[#e6d5e2] dark:border-white/10 flex items-center justify-center transition-all shadow active:scale-95 cursor-pointer"
                      title={ui('Deslizar a la derecha')}
                    >
                      <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </button>
                  </div>
                </div>

                <div
                  ref={singleSliderRef}
                  className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 pb-4 no-scrollbar items-stretch"
                >
                  {filteredItems.map((storedItem) => {
                    const locItem = localizedRewardMap.get(storedItem.id) || storedItem;
                    const isOwned = inventory.includes(storedItem.id);
                    const isEquipped =
                      (storedItem.type === 'frame' && equippedFrame === storedItem.id) ||
                      (storedItem.type === 'title' && (equippedTitle === storedItem.name.replace(/^Título:\s*/i, '') || equippedTitle === storedItem.id)) ||
                      (storedItem.type === 'skin' && equippedSkin === storedItem.id) ||
                      (storedItem.type === 'dsp' && equippedDsp === storedItem.id) ||
                      (storedItem.type === 'theme' && equippedTheme === storedItem.id) ||
                      (storedItem.type === 'perk' && activePerks.includes(storedItem.id));

                    return (
                      <div key={storedItem.id} className="w-[280px] sm:w-[320px] shrink-0">
                        <RewardCard
                          item={storedItem}
                          localizedItem={locItem}
                          isOwned={isOwned}
                          isEquipped={isEquipped}
                          points={points}
                          onEquip={handleEquip}
                          onRedeem={handleRedeem}
                          onPreview={handlePreview}
                          t={t}
                          ui={ui}
                          isCarouselItem={true}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          ) : (
            /* Modo Cuadrícula (Grid View) con Paginación */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedItems.map((storedItem) => {
                  const locItem = localizedRewardMap.get(storedItem.id) || storedItem;
                  const isOwned = inventory.includes(storedItem.id);
                  const isEquipped =
                    (storedItem.type === 'frame' && equippedFrame === storedItem.id) ||
                    (storedItem.type === 'title' && (equippedTitle === storedItem.name.replace(/^Título:\s*/i, '') || equippedTitle === storedItem.id)) ||
                    (storedItem.type === 'skin' && equippedSkin === storedItem.id) ||
                    (storedItem.type === 'dsp' && equippedDsp === storedItem.id) ||
                    (storedItem.type === 'theme' && equippedTheme === storedItem.id) ||
                    (storedItem.type === 'perk' && activePerks.includes(storedItem.id));

                  return (
                    <div key={storedItem.id}>
                      <RewardCard
                        item={storedItem}
                        localizedItem={locItem}
                        isOwned={isOwned}
                        isEquipped={isEquipped}
                        points={points}
                        onEquip={handleEquip}
                        onRedeem={handleRedeem}
                        onPreview={handlePreview}
                        t={t}
                        ui={ui}
                        isCarouselItem={false}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Botón Cargar Más Recompensas */}
              {visibleCount < filteredItems.length && (
                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 24)}
                    className="px-6 py-3 rounded-2xl bg-white dark:bg-zinc-800/80 hover:bg-[#f8e9f6] dark:hover:bg-zinc-700 text-[#231123] dark:text-white font-bold text-xs border border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09]/40 shadow-lg transition-all active:scale-95 inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">expand_more</span>
                    {ui('Cargar más recompensas')} ({displayedItems.length} / {filteredItems.length})
                  </button>
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* Modal: Probador en Vivo (Live Sandbox Preview) */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-amber-500/30 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative text-white"
            >
              <button
                onClick={() => setPreviewItem(null)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-800/60"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="text-center space-y-4">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
                  {t('previewTitle')}
                </span>
                <h3 className="text-2xl font-black text-white">{localizedReward(previewItem).name}</h3>

                {/* Previsualización del elemento */}
                <div className="py-6 flex flex-col items-center justify-center bg-zinc-950/60 rounded-2xl border border-white/5">
                  {previewItem.type === 'frame' ? (
                    <div className="relative">
                      <div className={`w-28 h-28 rounded-full overflow-hidden ${previewItem.previewBorder} flex items-center justify-center bg-zinc-800 text-3xl font-black text-amber-400`}>
                        {user?.username ? user.username.slice(0, 2).toUpperCase() : 'SN'}
                      </div>
                      <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-extrabold shadow">
                        {t('testing')}
                      </div>
                    </div>
                  ) : previewItem.type === 'skin' ? (
                    <div className="w-full max-w-xs p-4 rounded-2xl bg-zinc-900 border border-amber-500/30 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${previewItem.color} flex items-center justify-center text-white`}>
                        <span className="material-symbols-outlined">{previewItem.icon}</span>
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-xs font-bold text-white">{t('player')}</div>
                        <div className="text-[10px] text-amber-400">{localizedReward(previewItem).name}</div>
                      </div>
                    </div>
                  ) : (
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${previewItem.color} flex items-center justify-center text-white text-3xl shadow-xl`}>
                      <span className="material-symbols-outlined text-4xl">{previewItem.icon}</span>
                    </div>
                  )}

                  <p className="text-xs text-zinc-300 mt-4 max-w-xs px-4 text-center">
                    {localizedReward(previewItem).description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-left">
                    <span className="text-xs text-zinc-400">{t('price')}</span>
                    <div className="text-xl font-black text-amber-400">{previewItem.cost} 🪙</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewItem(null)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    >
                      {t('close')}
                    </button>
                    {!inventory.includes(previewItem.id) && (
                      <button
                        onClick={() => {
                          handleRedeem(previewItem);
                          setPreviewItem(null);
                        }}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
                      >
                        {t('redeemNow')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Recibo Retro de Disquería */}
      <AnimatePresence>
        {showReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#f4efe6] text-zinc-900 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative font-mono border-2 border-zinc-800"
            >
              <button
                onClick={() => setShowReceipt(false)}
                className="absolute top-4 right-4 p-1.5 text-zinc-700 hover:text-black rounded-full bg-zinc-300"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>

              <div className="text-center border-b-2 border-dashed border-zinc-400 pb-4 mb-4">
                <div className="text-xl font-black tracking-widest uppercase">{translate('receipt.title', { defaultValue: 'SONAR AUDIO STORE' })}</div>
                <div className="text-[11px] text-zinc-600 mt-0.5">{translate('receipt.subtitle')}</div>
                <div className="text-[10px] text-zinc-500 mt-1">{translate('receipt.ticket', { ticket: Date.now().toString().slice(-6) })}</div>
              </div>

              <div className="space-y-2 text-xs border-b-2 border-dashed border-zinc-400 pb-4 mb-4 max-h-60 overflow-y-auto">
                {purchaseHistory.length === 0 ? (
                  <div className="text-center text-zinc-500 py-4">{translate('receipt.empty')}</div>
                ) : (
                  purchaseHistory.map((tx) => (
                    <div key={tx.id} className="flex justify-between items-start gap-2">
                      <div>
                        <div className="font-bold">{localizedTransactionName(tx)}</div>
                        <div className="text-[10px] text-zinc-600">{tx.date}</div>
                      </div>
                      <div className="font-black text-right shrink-0">-{tx.cost} 🪙</div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-1 text-xs mb-6">
                <div className="flex justify-between font-bold">
                  <span>{translate('receipt.balance')}</span>
                  <span className="text-base">{points.toLocaleString()} {translate('receipt.coins')}</span>
                </div>
                <div className="flex justify-between text-zinc-600 text-[11px]">
                  <span>{translate('receipt.rank_label')}</span>
                  <span>{translate('receipt.rank', { level: userLevel, xp: userXp })}</span>
                </div>
              </div>

              {/* Código de barras decorativo */}
              <div className="text-center pt-2">
                <div className="h-8 bg-[repeating-linear-gradient(90deg,#18181b_0px,#18181b_2px,transparent_2px,transparent_4px,#18181b_4px,#18181b_8px,transparent_8px,transparent_10px)] rounded opacity-80 mb-1" />
                <div className="text-[9px] tracking-widest text-zinc-600 uppercase">{translate('receipt.thanks')}</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RewardsStoreTab;
