import { useUIText } from '../../../shared/i18n/use-ui-text.js';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../shared/context/auth-context';
import { useLanguage } from '../../../shared/context/language-context';
import { soundEffects } from '../../../shared/utils/sound-effects';
import { repairRewardCopy } from './reward-copy';

export const REWARD_ITEMS = [
  // --- Marcos de Avatar ---
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
    badge: 'Legendario',
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
    badge: 'Popular',
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
    badge: 'Exclusivo',
  },
  {
    id: 'frame-prism-rainbow',
    type: 'frame',
    name: 'Marco Prisma Pink Floyd',
    category: 'Marcos de Avatar',
    cost: 400,
    icon: 'flare',
    color: 'from-rose-500 via-purple-500 to-sky-400',
    description: 'Halo refractario de espectro visible con haz de luz continua.',
    previewBorder: 'ring-4 ring-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.8)]',
  },
  {
    id: 'frame-analog-wood',
    type: 'frame',
    name: 'Marco Caoba Analógica',
    category: 'Marcos de Avatar',
    cost: 320,
    icon: 'nature',
    color: 'from-amber-700 to-yellow-900',
    description: 'Acabado en madera noble lacada de gabinete acústico artesanal.',
    previewBorder: 'ring-4 ring-amber-700 shadow-[0_0_16px_rgba(180,83,9,0.7)]',
  },

  // --- Skins de Reproductor ---
  {
    id: 'skin-cassette',
    type: 'skin',
    name: 'Skin Cassette C-90 CrO2',
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
    id: 'skin-vinyl-turntable',
    type: 'skin',
    name: 'Skin Tornamesa Direct Drive 33/45',
    category: 'Skins de Audio',
    cost: 700,
    icon: 'album',
    color: 'from-amber-500 to-zinc-900',
    description: 'Plato giratorio estroboscópico de cuarzo con brazo fonocaptor dinámico.',
    badge: 'Vinilo',
  },
  {
    id: 'skin-tube-glow',
    type: 'skin',
    name: 'Skin Bulbos Valvulares Hi-End',
    category: 'Skins de Audio',
    cost: 680,
    icon: 'local_fire_department',
    color: 'from-amber-600 to-orange-950',
    description: 'Preamplificador con filamentos incandescentes y saturación armónica par.',
    badge: 'Calidez',
  },

  // --- Presets DSP & Audio ---
  {
    id: 'dsp-warm-tube',
    type: 'dsp',
    name: 'Preset DSP: Calidez Valvular 1970',
    category: 'Presets DSP de Audio',
    cost: 400,
    icon: 'tune',
    color: 'from-orange-500 to-amber-700',
    description: 'Realce armónico de frecuencias medias y compresión sutil que emula etapas a tubos.',
    badge: 'DSP Hi-Fi',
  },
  {
    id: 'dsp-tape-studer',
    type: 'dsp',
    name: 'Preset DSP: Cinta Studer A800',
    category: 'Presets DSP de Audio',
    cost: 450,
    icon: 'graphic_eq',
    color: 'from-blue-600 to-indigo-900',
    description: 'Saturación analógica a 15 IPS con pegada redonda en graves y agudos aterciopelados.',
    badge: 'Estudio',
  },
  {
    id: 'dsp-jazz-club',
    type: 'dsp',
    name: 'Preset DSP: Acústica Club de Jazz',
    category: 'Presets DSP de Audio',
    cost: 380,
    icon: 'surround_sound',
    color: 'from-emerald-600 to-teal-900',
    description: 'Reverberación espacial de sala íntima con absorción de madera natural.',
  },

  // --- Packs de Sonidos UI ---
  {
    id: 'sound-vintage-clicks',
    type: 'sound',
    name: 'Pack Sonoro: Clics Analógicos Swiss',
    category: 'Packs de Sonido UI',
    cost: 280,
    icon: 'volume_up',
    color: 'from-amber-600 to-yellow-800',
    description: 'Sustituye las interacciones táctiles de la app por clics mecánicos de potenciómetro suizo.',
    badge: 'Táctil',
  },
  {
    id: 'sound-vinyl-needle',
    type: 'sound',
    name: 'Pack Sonoro: Aguja de Diamante Ortofon',
    category: 'Packs de Sonido UI',
    cost: 320,
    icon: 'music_note',
    color: 'from-violet-600 to-purple-900',
    description: 'Efecto de caída de aguja en microsurco al reproducir discos o pulsar me gusta.',
  },

  // --- Temas de Interfaz ---
  {
    id: 'theme-mcintosh-blue',
    type: 'theme',
    name: 'Tema UI: Vintage McIntosh Blue',
    category: 'Temas de Interfaz',
    cost: 500,
    icon: 'palette',
    color: 'from-cyan-600 to-blue-900',
    description: 'Elegante panel negro con retroiluminación azul turquesa icónica de alta gama.',
    badge: 'Premium',
  },
  {
    id: 'theme-gold-audiophile',
    type: 'theme',
    name: 'Tema UI: Gold Champagne Audiophile',
    category: 'Temas de Interfaz',
    cost: 520,
    icon: 'brush',
    color: 'from-amber-500 to-yellow-800',
    description: 'Acentos en oro cepillado y fondo carbón para máxima sofisticación visual.',
  },

  // --- Títulos de Prestigio ---
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
    id: 'title-vinyl-archaeologist',
    type: 'title',
    name: 'Título: Arqueólogo del Vinilo',
    category: 'Títulos de Prestigio',
    cost: 280,
    icon: 'history_edu',
    color: 'from-amber-600 to-amber-900',
    description: 'Distintivo de coleccionista experto en prensados originales y primeras ediciones.',
  },
  {
    id: 'title-hi-res-purist',
    type: 'title',
    name: 'Título: Purista Hi-Res 192kHz',
    category: 'Títulos de Prestigio',
    cost: 350,
    icon: 'graphic_eq',
    color: 'from-teal-600 to-emerald-900',
    description: 'Para quienes no aceptan nada por debajo de la fidelidad Bit-Perfect de estudio.',
  },

  // --- Pases & Beneficios ---
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
  {
    id: 'perk-lossless-master',
    type: 'perk',
    name: 'Pase Bitrate Master Lossless',
    category: 'Pases & Beneficios',
    cost: 350,
    icon: 'high_quality',
    color: 'from-sky-600 to-blue-900',
    description: 'Transmisión directa de audio sin compresión con rango dinámico expandido.',
  },
  {
    id: 'perk-ai-critic',
    type: 'perk',
    name: 'Pase Asistente Crítico IA Ilimitado',
    category: 'Pases & Beneficios',
    cost: 300,
    icon: 'smart_toy',
    color: 'from-fuchsia-600 to-purple-900',
    description: 'Análisis ilimitados de poética de letras y correlaciones musicales por IA.',
  },
];

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

export const RewardsStoreTab = () => {
  const ui = useUIText();
  const { currentLang, t: translate } = useLanguage();
  const { user, updateUser } = useAuth();
  const localizedReward = (item) => {
    return {
      ...item,
      name: translate(`rewards.${item.id}.name`, { defaultValue: item.name }),
      description: translate(`rewards.${item.id}.description`, { defaultValue: item.description }),
    };
  };
  const localizedQuest = (quest) => {
    return {
      ...quest,
      title: translate(`rewards.${quest.id}.title`, { defaultValue: quest.title }),
      desc: translate(`rewards.${quest.id}.description`, { defaultValue: quest.desc }),
    };
  };
  const localizedTransactionName = (transaction) => {
    const reward = REWARD_ITEMS.find((item) => item.name === transaction.name);
    return reward ? localizedReward(reward).name : transaction.name;
  };
  const rewardsText = {
    en: { all: 'All', frames: 'Avatar Frames', skins: 'Audio Skins', dsp: 'DSP Presets', sounds: 'UI Sounds', themes: 'Themes', titles: 'Titles', vip: 'VIP Passes', catalog: 'Rewards Catalog', catalogDesc: 'Customize your avatar, player, DSP chain and visual themes.', quests: 'Audiophile Missions and Challenges', questDesc: 'Complete listening and analysis goals to earn coins quickly.', daily: 'Daily', weekly: 'Weekly', progress: 'Progress', claimed: 'Reward Claimed', claim: 'Claim Reward!', inProgress: 'In Progress', cost: 'Cost', equipped: 'Equipped', equip: 'Equip', redeem: 'Redeem', preview: 'Live Preview', previewTitle: 'Live Preview • Sandbox', testing: 'PREVIEWING', player: 'Sonar Hi-Fi Player', price: 'Price', close: 'Close', redeemNow: 'Redeem Now', coins: 'Your Sonar Coins', streak: 'Listening Streak', crate: 'Daily Vinyl Crate', available: 'Available!', opened: 'Opened', crateTitle: 'Mystery Unpacking', openCrate: 'Open Vinyl Crate (Free)', opening: 'Opening Vinyl...', rewardRedeemed: 'Reward Redeemed', community: 'Monthly Community Goal', communityReviews: 'Collective Hi-Fi Reviews', receipt: 'Retro Receipt', store: 'Audiophile Store & Rewards', vault: 'Sound Loyalty Vault' },
    fr: { all: 'Tout', frames: 'Cadres d’avatar', skins: 'Skins audio', dsp: 'Préréglages DSP', sounds: 'Sons UI', themes: 'Thèmes', titles: 'Titres', vip: 'Pass VIP', catalog: 'Catalogue des récompenses', catalogDesc: 'Personnalisez votre avatar, lecteur, chaîne DSP et thèmes visuels.', quests: 'Missions et défis audiophiles', questDesc: 'Atteignez vos objectifs d’écoute et d’analyse pour gagner des pièces.', daily: 'Quotidienne', weekly: 'Hebdomadaire', progress: 'Progression', claimed: 'Récompense récupérée', claim: 'Récupérer la récompense !', inProgress: 'En cours', cost: 'Coût', equipped: 'Équipé', equip: 'Équiper', redeem: 'Échanger', preview: 'Aperçu en direct', previewTitle: 'Aperçu en direct • Bac à sable', testing: 'APERÇU', player: 'Lecteur Sonar Hi-Fi', price: 'Prix', close: 'Fermer', redeemNow: 'Échanger maintenant', coins: 'Vos Sonar Coins', streak: 'Série d’écoute', crate: 'Caisse vinyle quotidienne', available: 'Disponible !', opened: 'Ouverte', crateTitle: 'Ouverture mystérieuse', openCrate: 'Ouvrir la caisse vinyle (gratuit)', opening: 'Ouverture du vinyle…', rewardRedeemed: 'Récompense récupérée', community: 'Objectif communautaire mensuel', communityReviews: 'Avis Hi-Fi collectifs', receipt: 'Reçu rétro', store: 'Boutique et récompenses audiophiles', vault: 'Coffre de fidélité sonore' },
    it: { all: 'Tutti', frames: 'Cornici avatar', skins: 'Skin audio', dsp: 'Preset DSP', sounds: 'Suoni UI', themes: 'Temi', titles: 'Titoli', vip: 'Pass VIP', catalog: 'Catalogo premi', catalogDesc: 'Personalizza avatar, lettore, catena DSP e temi visivi.', quests: 'Missioni e sfide audiofile', questDesc: 'Completa obiettivi di ascolto e analisi per guadagnare monete.', daily: 'Giornaliera', weekly: 'Settimanale', progress: 'Progresso', claimed: 'Premio riscosso', claim: 'Riscatta premio!', inProgress: 'In corso', cost: 'Costo', equipped: 'Equipaggiato', equip: 'Equipaggia', redeem: 'Riscatta', preview: 'Anteprima dal vivo', previewTitle: 'Anteprima dal vivo • Sandbox', testing: 'ANTEPRIMA', player: 'Lettore Sonar Hi-Fi', price: 'Prezzo', close: 'Chiudi', redeemNow: 'Riscatta ora', coins: 'I tuoi Sonar Coins', streak: 'Serie di ascolto', crate: 'Cassa vinile giornaliera', available: 'Disponibile!', opened: 'Aperta', crateTitle: 'Apertura misteriosa', openCrate: 'Apri cassa vinile (gratis)', opening: 'Apertura del vinile…', rewardRedeemed: 'Premio riscattato', community: 'Obiettivo comunitario mensile', communityReviews: 'Recensioni Hi-Fi collettive', receipt: 'Scontrino rétro', store: 'Negozio e premi audiofili', vault: 'Scrigno della fedeltà sonora' },
    zh: { all: '全部', frames: '头像边框', skins: '音频皮肤', dsp: 'DSP 预设', sounds: '界面音效', themes: '主题', titles: '称号', vip: 'VIP 通行证', catalog: '奖励目录', catalogDesc: '自定义头像、播放器、DSP 音链和视觉主题。', quests: '发烧友任务与挑战', questDesc: '完成聆听和分析目标，快速获得金币。', daily: '每日', weekly: '每周', progress: '进度', claimed: '已领取奖励', claim: '领取奖励！', inProgress: '进行中', cost: '花费', equipped: '已装备', equip: '装备', redeem: '兑换', preview: '实时预览', previewTitle: '实时预览 • 沙盒', testing: '预览中', player: 'Sonar Hi-Fi 播放器', price: '价格', close: '关闭', redeemNow: '立即兑换', coins: '你的 Sonar Coins', streak: '连续聆听', crate: '每日黑胶箱', available: '可领取！', opened: '已开启', crateTitle: '神秘开箱', openCrate: '免费开启黑胶箱', opening: '正在开启黑胶…', rewardRedeemed: '奖励已兑换', community: '月度社区目标', communityReviews: '社区 Hi-Fi 评论', receipt: '复古收据', store: '发烧友商店与奖励', vault: '聆听忠诚宝库' },
    ja: { all: 'すべて', frames: 'アバターフレーム', skins: 'オーディオスキン', dsp: 'DSPプリセット', sounds: 'UIサウンド', themes: 'テーマ', titles: '称号', vip: 'VIPパス', catalog: 'リワードカタログ', catalogDesc: 'アバター、プレーヤー、DSPチェーン、ビジュアルテーマをカスタマイズ。', quests: 'オーディオファイルのミッションとチャレンジ', questDesc: 'リスニングと分析の目標を達成してコインを獲得しましょう。', daily: 'デイリー', weekly: 'ウィークリー', progress: '進捗', claimed: '報酬獲得済み', claim: '報酬を受け取る！', inProgress: '進行中', cost: 'コスト', equipped: '装備中', equip: '装備する', redeem: '交換', preview: 'ライブプレビュー', previewTitle: 'ライブプレビュー • サンドボックス', testing: 'プレビュー中', player: 'Sonar Hi-Fi プレーヤー', price: '価格', close: '閉じる', redeemNow: '今すぐ交換', coins: 'あなたのSonar Coins', streak: '連続リスニング', crate: 'デイリーレコードボックス', available: '利用可能！', opened: '開封済み', crateTitle: 'ミステリー開封', openCrate: 'レコードボックスを開く（無料）', opening: 'レコードを開封中…', rewardRedeemed: '報酬交換済み', community: '月間コミュニティ目標', communityReviews: 'コミュニティHi-Fiレビュー', receipt: 'レトロレシート', store: 'オーディオファイルのストアと報酬', vault: 'サウンドロイヤルティ保管庫' },
  };
  const spanishRewardsText = { all: 'Todos', frames: 'Marcos Avatar', skins: 'Skins Audio', dsp: 'Presets DSP', sounds: 'Sonidos UI', themes: 'Temas', titles: 'Títulos', vip: 'Pases VIP', catalog: 'Catálogo de Recompensas', catalogDesc: 'Personaliza tu avatar, reproductor, cadena DSP y temas visuales.', quests: 'Misiones y Desafíos Audiófilos', questDesc: 'Completa objetivos de audición y análisis para sumar monedas rápidamente.', daily: 'Diaria', weekly: 'Semanal', progress: 'Progreso', claimed: 'Recompensa Reclamada', claim: '¡Reclamar Recompensa!', inProgress: 'En Progreso', cost: 'Costo', equipped: 'Equipado', equip: 'Equipar', redeem: 'Canjear', preview: 'Probar en Vivo', previewTitle: 'Probador en Vivo • Sandbox', testing: 'PROBANDO', player: 'Reproductor Sonar Hi-Fi', price: 'Precio', close: 'Cerrar', redeemNow: 'Canjear Ahora', coins: 'Tus Sonar Coins', streak: 'Racha de Escucha', crate: 'Caja Diaria de Vinilo', available: '¡Disponible!', opened: 'Abierta', crateTitle: 'Desempaque Misterioso', openCrate: 'Abrir Caja de Vinilo (Gratis)', opening: 'Abriendo Vinilo...', rewardRedeemed: 'Recompensa Canjeada', community: 'Meta Comunitaria Mes', communityReviews: 'Reseñas Hi-Fi colectivas', receipt: 'Recibo Retro', store: 'Tienda & Recompensas Audiófilas', vault: 'Bóveda de Fidelidad Sonora' };
  const t = (key) => repairRewardCopy(rewardsText[currentLang]?.[key] || spanishRewardsText[key]);

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
    showToast(next ? '🔊 Efectos sonoros de UI activados' : '🔇 Efectos sonoros silenciados');
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

    showToast(`🔥 ¡Racha de ${nextStreak} días! Has ganado +${bonus} Sonar Coins de bonus.`);
  };

  // Abrir Caja Misteriosa
  const handleOpenCrate = () => {
    if (crateOpened || isOpeningCrate) return;
    setIsOpeningCrate(true);
    soundEffects.playNeedleDrop();

    setTimeout(() => {
      const rewardsList = [
        { type: 'legendary', title: '🌟 ¡Caja de Vinilo Legendaria! +350 Coins & +300 XP', points: 350, xp: 300, rarity: 'Legendario' },
        { type: 'rare', title: '💎 ¡Prensado Raro! +200 Sonar Coins & +200 XP', points: 200, xp: 200, rarity: 'Raro' },
        { type: 'common', title: '💿 ¡Vinilo Clásico! +120 Sonar Coins & +150 XP', points: 120, xp: 150, rarity: 'Clásico' },
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

      showToast(selected.title);
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

    showToast(`🎉 ¡Misión completada! +${rewardPoints} Coins y +${rewardXp} XP`);
  };

  // Canjear Artículo
  const handleRedeem = (item) => {
    if (inventory.includes(item.id)) return;
    if (points < item.cost) {
      soundEffects.playClick();
      showToast(`❌ Necesitas ${item.cost - points} monedas más para canjear este artículo.`);
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
    showToast(`🎉 ¡Canjeaste con éxito "${item.name}"!`);
  };

  // Equipar Artículo
  const handleEquip = (item) => {
    soundEffects.playClick();
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
      const cleanTitle = item.name.replace('Título: ', '');
      const next = equippedTitle === cleanTitle ? '' : cleanTitle;
      setEquippedTitle(next);
      try {
        localStorage.setItem('sonar_equipped_title', next);
        updateUser?.({ equippedTitle: next });
        window.dispatchEvent(new CustomEvent('sonar:profile-customization-changed', { detail: { equippedTitle: next } }));
      } catch {}
      showToast(next ? `🎖️ Título "${next}" activado` : 'Título desequipado');
    } else if (item.type === 'skin') {
      const next = equippedSkin === item.id ? '' : item.id;
      setEquippedSkin(next);
      try {
        localStorage.setItem('sonar_equipped_skin', next);
        updateUser?.({ equippedSkin: next });
        window.dispatchEvent(new CustomEvent('sonar:profile-customization-changed', { detail: { equippedSkin: next } }));
      } catch {}
      showToast(next ? `🎛️ Skin "${item.name}" activada` : 'Skin desequipada');
    } else if (item.type === 'dsp') {
      const next = equippedDsp === item.id ? '' : item.id;
      setEquippedDsp(next);
      try {
        localStorage.setItem('sonar_equipped_dsp', next);
      } catch {}
      showToast(next ? `🎚️ ${item.name} activado en tu cadena de audio` : 'DSP desactivado');
    } else if (item.type === 'theme') {
      const next = equippedTheme === item.id ? '' : item.id;
      setEquippedTheme(next);
      try {
        localStorage.setItem('sonar_equipped_theme', next);
      } catch {}
      showToast(next ? `🎨 ${item.name} aplicado a la interfaz` : 'Tema por defecto restaurado');
    } else if (item.type === 'sound') {
      showToast(`🔊 Pack sonoro "${item.name}" activado`);
    } else if (item.type === 'perk') {
      const isAlreadyActive = activePerks.includes(item.id);
      const nextPerks = isAlreadyActive
        ? activePerks.filter((id) => id !== item.id)
        : [...activePerks, item.id];
      setActivePerks(nextPerks);
      try {
        localStorage.setItem('sonar_active_perks', JSON.stringify(nextPerks));
        updateUser?.({ activePerks: nextPerks });
        window.dispatchEvent(new CustomEvent('sonar:profile-customization-changed', { detail: { activePerks: nextPerks } }));
      } catch {}
      showToast(!isAlreadyActive ? `🎟️ Pase "${item.name}" activado` : `Pase desactivado`);
    }
  };

  const filteredItems = activeCategory === 'all'
    ? REWARD_ITEMS
    : REWARD_ITEMS.filter((item) => item.type === activeCategory);

  const userLevel = Math.max(1, Math.floor(userXp / 300) + 1);
  const currentLevelProgress = userXp % 300;
  const percentToNextLevel = Math.min(100, Math.round((currentLevelProgress / 300) * 100));

  return (
    <div className="space-y-8 text-[#231123] dark:text-white relative">
      {/* Toast Notifier */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 bg-gradient-to-r from-amber-500 to-amber-700 text-black font-semibold px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-300/40 backdrop-blur-md"
          >
            <span className="material-symbols-outlined text-black font-bold">celebration</span>
            <span>{toastMessage}</span>
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
                Tienda & Recompensas Audiófilas
              </span>
              <button
                onClick={toggleSound}
                className={`p-1.5 rounded-full border text-xs transition-colors flex items-center gap-1 ${
                  soundEnabled
                    ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}
                title={soundEnabled ? 'Silenciar efectos de sonido' : 'Activar efectos de sonido de UI'}
              >
                <span className="material-symbols-outlined text-sm">
                  {soundEnabled ? 'volume_up' : 'volume_off'}
                </span>
              </button>
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
              Bóveda de Fidelidad Sonora
            </h2>
            <p className="text-zinc-400 text-sm mt-1 max-w-xl">
              Gana <span className="text-amber-400 font-semibold">Sonar Coins</span> escuchando vinilos, publicando reseñas Hi-Fi y manteniendo tu racha de audiófilo.
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
                <div className="text-xs text-[#5c435a] dark:text-zinc-400 font-medium">Nivel {userLevel} • Audiófilo</div>
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
              title="Ver Recibo de Disquería Retro"
            >
              <span className="material-symbols-outlined text-lg">receipt_long</span>
              <span className="hidden sm:inline">Recibo Retro</span>
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
                Días Consecutivos 🔥
              </div>
              <p className="text-xs text-[#B80C09] dark:text-orange-400/90 mt-0.5">
                Multiplicador activo: <span className="font-bold">{streakDays >= 5 ? '2.0x' : streakDays >= 3 ? '1.5x' : '1.2x'} Coins</span>
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
            {streakClaimedToday ? 'Racha Reclamada Hoy' : 'Reclamar Bono Diario (+50 🪙)'}
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
                  ? 'Vuelve mañana para abrir otra funda de vinilo'
                  : 'Abre la funda sellada y gana recompensas aleatorias'}
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
              Meta Comunitaria Mes
            </span>
            <span className="text-xs font-bold text-[#003844] dark:text-cyan-300">{communityProgressPercent}%</span>
          </div>

          <div className="my-4">
            <div className="flex justify-between text-xs text-[#5c435a] dark:text-zinc-300 mb-1.5">
              <span>Reseñas Hi-Fi colectivas</span>
              <span className="font-bold text-[#003844] dark:text-cyan-400">{communityReviewsCount} / {communityGoal}</span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden border border-[#e6d5e2] dark:border-white/5">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                style={{ width: `${communityProgressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-[#5c435a] dark:text-zinc-400 mt-2">
              🎁 Al llegar a la meta: Toda la comunidad desbloquea la skin conmemorativa <span className="text-[#003844] dark:text-cyan-300 font-semibold">Tornamesa Direct Drive</span>.
            </p>
          </div>

          <div className="text-center py-1 bg-[#003844]/5 dark:bg-cyan-500/5 rounded-xl border border-[#003844]/10 dark:border-cyan-500/10 text-xs font-semibold text-[#003844] dark:text-cyan-300">
            ¡Faltan solo {communityGoal - communityReviewsCount} reseñas para el desbloqueo colectivo!
          </div>
        </div>
      </div>

      {/* Misiones Dinámicas (Quests) */}
      <div className="bg-[#f8e9f6] dark:bg-zinc-900/60 border border-[#e6d5e2] dark:border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-black text-[#231123] dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B80C09] dark:text-amber-400">task_alt</span>
              Misiones y Desafíos Audiófilos
            </h3>
            <p className="text-xs text-[#5c435a] dark:text-zinc-400 mt-0.5">
              Completa objetivos de audición y análisis para sumar monedas rápidamente.
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
                          {quest.type === 'daily' ? 'Diaria' : 'Semanal'}
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black text-[#231123] dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B80C09] dark:text-amber-400">storefront</span>
              Catálogo de Recompensas
            </h3>
            <p className="text-xs text-[#5c435a] dark:text-zinc-400 mt-0.5">
              Personaliza tu avatar, reproductor, cadena DSP y temas visuales.
            </p>
          </div>

          {/* Filtros de Categoría */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: t('all') },
              { id: 'frame', label: t('frames') },
              { id: 'skin', label: t('skins') },
              { id: 'dsp', label: t('dsp') },
              { id: 'sound', label: t('sounds') },
              { id: 'theme', label: t('themes') },
              { id: 'title', label: 'Títulos' },
              { id: 'perk', label: t('vip') },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  soundEffects.playClick();
                  setActiveCategory(tab.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === tab.id
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                    : 'bg-white dark:bg-zinc-800/80 text-[#5c435a] dark:text-zinc-400 hover:text-[#231123] dark:hover:text-white hover:bg-[#f8e9f6] dark:hover:bg-zinc-700/80 border border-[#e6d5e2] dark:border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Artículos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((storedItem) => {
            const item = localizedReward(storedItem);
            const isOwned = inventory.includes(item.id);
            const isEquipped =
              (item.type === 'frame' && equippedFrame === item.id) ||
              (item.type === 'title' && equippedTitle === item.name.replace('Título: ', '')) ||
              (item.type === 'skin' && equippedSkin === item.id) ||
              (item.type === 'dsp' && equippedDsp === item.id) ||
              (item.type === 'theme' && equippedTheme === item.id) ||
              (item.type === 'perk' && activePerks.includes(item.id));

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-zinc-900/80 border border-[#e6d5e2] dark:border-white/10 hover:border-[#B80C09]/40 dark:hover:border-amber-400/40 rounded-3xl p-5 flex flex-col justify-between gap-4 transition-all shadow-xl group relative overflow-hidden text-[#231123] dark:text-white"
              >
                {/* Cabecera del Item */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg`}>
                      <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-[#B80C09]/10 dark:bg-amber-500/10 text-[#B80C09] dark:text-amber-400 text-[10px] font-bold border border-[#B80C09]/20 dark:border-amber-500/20">
                          {ui(item.badge)}
                        </span>
                      )}
                      <button
                        onClick={() => {
                          soundEffects.playClick();
                          setPreviewItem(storedItem);
                        }}
                        className="p-1.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-[#f8e9f6] dark:hover:bg-zinc-700 text-[#5c435a] dark:text-zinc-300 hover:text-[#B80C09] dark:hover:text-amber-400 transition-colors border border-[#e6d5e2] dark:border-white/5"
                        title={t('preview')}
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-[#231123] dark:text-white group-hover:text-[#B80C09] dark:group-hover:text-amber-300 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#5c435a] dark:text-zinc-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Pie con Precio / Botón */}
                <div className="pt-3 border-t border-[#e6d5e2] dark:border-white/5 flex items-center justify-between gap-3">
                  <div className="text-left">
                    <div className="text-[10px] text-[#5c435a]/70 dark:text-zinc-500 uppercase tracking-wider font-semibold">{t('cost')}</div>
                    <div className="text-base font-black text-amber-700 dark:text-amber-400 flex items-center gap-1">
                      {item.cost} <span className="text-xs">🪙</span>
                    </div>
                  </div>

                  {isOwned ? (
                    <button
                      onClick={() => handleEquip(storedItem)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
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
                      onClick={() => handleRedeem(storedItem)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        points >= item.cost
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black shadow-md shadow-amber-500/20 active:scale-95'
                          : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500 border border-gray-200 dark:border-white/5 cursor-not-allowed'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">shopping_bag</span>
                      {t('redeem')}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
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
                  Probador en Vivo • Sandbox
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
                        PROBANDO
                      </div>
                    </div>
                  ) : previewItem.type === 'skin' ? (
                    <div className="w-full max-w-xs p-4 rounded-2xl bg-zinc-900 border border-amber-500/30 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${previewItem.color} flex items-center justify-center text-white`}>
                        <span className="material-symbols-outlined">{previewItem.icon}</span>
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-xs font-bold text-white">Reproductor Sonar Hi-Fi</div>
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
