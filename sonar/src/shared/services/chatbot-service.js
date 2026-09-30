/**
 * Servicio de ChatBot: SONAR AI Sommelier Musical
 * Conecta con el webhook de n8n o utiliza fallback local interactivo.
 */

const N8N_CHATBOT_URL =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_N8N_CHATBOT_WEBHOOK_URL

const DEFAULT_ENDPOINTS = [
  N8N_CHATBOT_URL,
  'http://localhost:5678/webhook/sonar-chatbot',
  'http://localhost:5678/webhook-test/sonar-chatbot',
  '/api/n8n/webhook/sonar-chatbot',
  '/api/n8n/webhook-test/sonar-chatbot',
].filter(Boolean)

// Traducciones para las respuestas del fallback local
const LANG_RESPONSES = {
  es: {
    playMsg: (title, artist) => `▶️ ¡Con gusto! Iniciando la reproducción de **${title}** de **${artist}** en el reproductor de SONAR. Disfruta de la calidad de audio Hi-Fi y suma **+5 Sonar Coins**.`,
    playQuickReplies: ['⏸️ Pausar música', '⭐ Escribir reseña de este álbum', '🪙 Ver mis Sonar Coins'],
    defaultMsg: '¡Hola! Soy **Sonaria**, tu asistente oficial de la plataforma **SONAR**. 🎧\n\nPuedo guiarte por el catálogo, publicar reseñas, ayudarte a ganar **Sonar Coins**, o puedes pedirme cosas como *"reproduce Aja"*, *"pon Daft Punk"* o *"toca jazz"* para iniciar la música de inmediato.\n\n¿En qué herramienta o canción de SONAR te puedo ayudar hoy?',
    defaultQuickReplies: ['▶️ Reproduce Steely Dan', '▶️ Pon Daft Punk', '🪙 ¿Cómo ganar Sonar Coins?', '⭐ ¿Cómo publicar una reseña?'],
  },
  en: {
    playMsg: (title, artist) => `▶️ Sure! Starting playback of **${title}** by **${artist}** on the SONAR player. Enjoy Hi-Fi audio quality and earn **+5 Sonar Coins**.`,
    playQuickReplies: ['⏸️ Pause music', '⭐ Write a review for this album', '🪙 Check my Sonar Coins'],
    defaultMsg: "Hi! I'm **Sonaria**, your official **SONAR** platform assistant. 🎧\n\nI can guide you through the catalog, publish reviews, help you earn **Sonar Coins**, or you can ask me things like *\"play Aja\"*, *\"play Daft Punk\"* or *\"play jazz\"* to start music right away.\n\nHow can I help you with SONAR today?",
    defaultQuickReplies: ['▶️ Play Steely Dan', '▶️ Play Daft Punk', '🪙 How to earn Sonar Coins?', '⭐ How to publish a review?'],
  },
  zh: {
    playMsg: (title, artist) => `▶️ 好的！正在 SONAR 播放器上播放 **${artist}** 的 **${title}**。享受 Hi-Fi 音质并获得 **+5 Sonar Coins**。`,
    playQuickReplies: ['⏸️ 暂停音乐', '⭐ 写专辑评论', '🪙 查看我的 Sonar Coins'],
    defaultMsg: '你好！我是 **Sonaria**，**SONAR** 平台的官方助手。🎧\n\n我可以帮你浏览目录、发表评论、赚取 **Sonar Coins**，或者你可以说*"播放 Aja"*、*"播放 Daft Punk"*来开始音乐。\n\n今天我能帮你什么？',
    defaultQuickReplies: ['▶️ 播放 Steely Dan', '▶️ 播放 Daft Punk', '🪙 如何赚取 Sonar Coins？', '⭐ 如何发表评论？'],
  },
  fr: {
    playMsg: (title, artist) => `▶️ Avec plaisir ! Lecture de **${title}** de **${artist}** sur le lecteur SONAR. Profitez de la qualité Hi-Fi et gagnez **+5 Sonar Coins**.`,
    playQuickReplies: ['⏸️ Mettre en pause', '⭐ Écrire une critique de cet album', '🪙 Voir mes Sonar Coins'],
    defaultMsg: "Bonjour ! Je suis **Sonaria**, votre assistante officielle **SONAR**. 🎧\n\nJe peux vous guider dans le catalogue, publier des critiques, vous aider à gagner des **Sonar Coins**, ou vous pouvez me demander *\"joue Aja\"*, *\"mets Daft Punk\"* pour lancer la musique.\n\nComment puis-je vous aider aujourd'hui ?",
    defaultQuickReplies: ['▶️ Jouer Steely Dan', '▶️ Jouer Daft Punk', '🪙 Comment gagner des Sonar Coins ?', '⭐ Comment publier une critique ?'],
  },
  it: {
    playMsg: (title, artist) => `▶️ Con piacere! Riproduzione di **${title}** di **${artist}** sul lettore SONAR. Goditi la qualità Hi-Fi e guadagna **+5 Sonar Coins**.`,
    playQuickReplies: ['⏸️ Metti in pausa', '⭐ Scrivi una recensione di questo album', '🪙 Vedi i miei Sonar Coins'],
    defaultMsg: "Ciao! Sono **Sonaria**, la tua assistente ufficiale **SONAR**. 🎧\n\nPosso guidarti nel catalogo, pubblicare recensioni, aiutarti a guadagnare **Sonar Coins**, o puoi chiedermi *\"riproduci Aja\"*, *\"metti Daft Punk\"* per avviare la musica.\n\nCome posso aiutarti oggi?",
    defaultQuickReplies: ['▶️ Riproduci Steely Dan', '▶️ Riproduci Daft Punk', '🪙 Come guadagnare Sonar Coins?', '⭐ Come pubblicare una recensione?'],
  },
  ja: {
    playMsg: (title, artist) => `▶️ かしこまりました！SONARプレーヤーで **${artist}** の **${title}** を再生します。Hi-Fi音質をお楽しみください。**+5 Sonar Coins** 獲得！`,
    playQuickReplies: ['⏸️ 一時停止', '⭐ このアルバムのレビューを書く', '🪙 Sonar Coins を確認'],
    defaultMsg: 'こんにちは！私は **Sonaria**、**SONAR** の公式アシスタントです。🎧\n\nカタログの案内、レビューの投稿、**Sonar Coins** の獲得をお手伝いします。*"再生 Aja"*、*"再生 Daft Punk"* と言って音楽を始めましょう。\n\n今日は何をお手伝いしましょうか？',
    defaultQuickReplies: ['▶️ Steely Dan を再生', '▶️ Daft Punk を再生', '🪙 Sonar Coins の獲得方法は？', '⭐ レビューの投稿方法は？'],
  },
}

function getLangStrings(lang) {
  return LANG_RESPONSES[lang] || LANG_RESPONSES.es
}

// Helper: obtener reply y quickReplies en el idioma correcto
function getLocalReply(entry, lang) {
  const reply = typeof entry.reply === 'object' && !Array.isArray(entry.reply)
    ? (entry.reply[lang] || entry.reply.es)
    : entry.reply
  const qr = entry.quickReplies
  const quickReplies = typeof qr === 'object' && !Array.isArray(qr)
    ? (qr[lang] || qr.es)
    : qr
  return { reply, quickReplies }
}

// Base de conocimiento multiidioma de la plataforma SONAR
const LOCAL_KNOWLEDGE = [
  {
    keywords: ['que es sonar', 'plataforma', 'pagina', 'app', 'web', 'funciones', 'herramientas', 'que puedo hacer', 'ayuda', 'what is sonar', 'help', 'platform', 'features'],
    reply: {
      es: '¡Bienvenido a **SONAR**! 🎧 Somos la plataforma web definitiva para melómanos y amantes del audio Hi-Fi. En SONAR puedes:\n\n1. 💿 **Explorar el Catálogo Hi-Fi**: Descubre álbumes legendarios con preescuchas.\n2. ⭐ **Publicar Reseñas**: Califica del 1 al 10 con moderación IA.\n3. 🪙 **Ganar Sonar Coins**: Escuchando (+5), reseñas (+50), Caja Diaria (+100).\n4. 🛒 **Boutique de Skins**: Casetes y Medidores VU.\n5. 🔒 **Control Parental**: Perfiles Junior con PIN.\n6. 📰 **Noticias y Newsletter**: Boletín semanal.',
      en: 'Welcome to **SONAR**! 🎧 The ultimate web platform for audiophiles and Hi-Fi audio lovers. On SONAR you can:\n\n1. 💿 **Explore the Hi-Fi Catalog**: Discover legendary albums with previews.\n2. ⭐ **Publish Reviews**: Rate from 1 to 10 with AI moderation.\n3. 🪙 **Earn Sonar Coins**: Listening (+5), reviews (+50), Daily Crate (+100).\n4. 🛒 **Skin Boutique**: Cassettes and VU Meters.\n5. 🔒 **Parental Control**: Junior profiles with PIN.\n6. 📰 **News & Newsletter**: Weekly bulletin.',
      zh: '欢迎来到 **SONAR**！🎧 面向音乐爱好者的终极平台。你可以：\n\n1. 💿 **探索 Hi-Fi 目录**：发现传奇专辑。\n2. ⭐ **发表评论**：1-10 评分，AI 审核。\n3. 🪙 **赚取 Sonar Coins**：听歌(+5)、评论(+50)、每日宝箱(+100)。\n4. 🛒 **精品店**：磁带和 VU 表皮肤。\n5. 🔒 **家长控制**：Junior 模式 + PIN。\n6. 📰 **新闻和简报**：每周简报。',
      fr: 'Bienvenue sur **SONAR** ! 🎧 La plateforme ultime pour mélomanes et amateurs Hi-Fi. Sur SONAR :\n\n1. 💿 **Explorer le Catalogue Hi-Fi** : Albums légendaires avec pré-écoutes.\n2. ⭐ **Publier des Critiques** : De 1 à 10 avec modération IA.\n3. 🪙 **Gagner des Sonar Coins** : Écoute (+5), critiques (+50), Caisse Quotidienne (+100).\n4. 🛒 **Boutique de Skins** : Cassettes et VU Mètres.\n5. 🔒 **Contrôle Parental** : Profils Junior + PIN.\n6. 📰 **Actualités & Newsletter** : Bulletin hebdomadaire.',
      it: 'Benvenuto su **SONAR**! 🎧 La piattaforma definitiva per audiofili. Su SONAR puoi:\n\n1. 💿 **Esplorare il Catalogo Hi-Fi**: Album leggendari con anteprime.\n2. ⭐ **Pubblicare Recensioni**: Da 1 a 10 con moderazione IA.\n3. 🪙 **Guadagnare Sonar Coins**: Ascolto (+5), recensioni (+50), Cassa Giornaliera (+100).\n4. 🛒 **Boutique di Skin**: Cassette e VU Meter.\n5. 🔒 **Controllo Parentale**: Profili Junior + PIN.\n6. 📰 **Notizie & Newsletter**: Bollettino settimanale.',
      ja: '**SONAR** へようこそ！🎧 オーディオファイルのための究極プラットフォーム：\n\n1. 💿 **Hi-Fi カタログ探索**：伝説のアルバムをプレビュー。\n2. ⭐ **レビュー投稿**：1〜10 評価、AI モデレーション。\n3. 🪙 **Sonar Coins 獲得**：聴く(+5)、レビュー(+50)、デイリークレート(+100)。\n4. 🛒 **スキンブティック**：カセット＆VU メーター。\n5. 🔒 **ペアレンタルコントロール**：Junior + PIN。\n6. 📰 **ニュース＆レター**：週刊ニュースレター。',
    },
    suggestions: [
      { title: 'Aja', artist: 'Steely Dan', year: '1977', genre: 'Jazz Rock / Hi-Fi', reason: 'Álbum destacado en SONAR.', deezerQuery: 'Steely Dan Aja' },
      { title: 'Random Access Memories', artist: 'Daft Punk', year: '2013', genre: 'Nu-Disco / Hi-Fi', reason: 'Masterizado por Bob Ludwig.', deezerQuery: 'Daft Punk Random Access Memories' },
    ],
    quickReplies: {
      es: ['🪙 ¿Cómo ganar Sonar Coins?', '⭐ ¿Cómo publicar una reseña?', '🛒 Ver Boutique', '🔒 Control Parental'],
      en: ['🪙 How to earn Sonar Coins?', '⭐ How to publish a review?', '🛒 View Boutique', '🔒 Parental Control'],
      zh: ['🪙 如何赚 Sonar Coins？', '⭐ 如何发表评论？', '🛒 查看精品店', '🔒 家长控制'],
      fr: ['🪙 Gagner des Sonar Coins ?', '⭐ Publier une critique ?', '🛒 Voir Boutique', '🔒 Contrôle Parental'],
      it: ['🪙 Guadagnare Sonar Coins?', '⭐ Pubblicare una recensione?', '🛒 Vedi Boutique', '🔒 Controllo Parentale'],
      ja: ['🪙 Sonar Coins 獲得方法？', '⭐ レビュー投稿方法？', '🛒 ブティック', '🔒 ペアレンタルコントロール'],
    },
  },
  {
    keywords: ['resena', 'reseña', 'critica', 'calificar', 'estrellas', 'opinar', 'review', 'rate', 'rating', 'stars', 'critique'],
    reply: {
      es: 'En **SONAR**, publicar reseñas es sencillo y otorga **+50 Sonar Coins**:\n\n1. Ve a cualquier álbum en el **Catálogo** o presiona **"Reseñar"**.\n2. Calificación de **1 a 10 estrellas**.\n3. Escribe tu análisis de sonido, producción y dinámica.\n4. La moderación automática **IA en n8n** evalúa y publica tu reseña.',
      en: 'On **SONAR**, publishing reviews is simple and earns **+50 Sonar Coins**:\n\n1. Go to any album in the **Catalog** or press **"Review"**.\n2. Rate from **1 to 10 stars**.\n3. Write your analysis of sound, production and dynamics.\n4. Automatic **AI moderation via n8n** evaluates and publishes your review.',
      zh: '在 **SONAR** 发表评论很简单，获得 **+50 Sonar Coins**：\n\n1. 前往**目录**中的专辑或点击**"评论"**。\n2. 评分 **1-10 星**。\n3. 写下音质、制作和动态分析。\n4. **n8n AI 审核**自动评估并发布。',
      fr: 'Sur **SONAR**, publier des critiques est simple et rapporte **+50 Sonar Coins** :\n\n1. Allez sur un album du **Catalogue** ou cliquez **"Critiquer"**.\n2. Note de **1 à 10 étoiles**.\n3. Rédigez votre analyse sonore.\n4. La **modération IA via n8n** évalue et publie.',
      it: 'Su **SONAR**, pubblicare recensioni è semplice e fa guadagnare **+50 Sonar Coins**:\n\n1. Vai a un album nel **Catalogo** o premi **"Recensisci"**.\n2. Valutazione da **1 a 10 stelle**.\n3. Scrivi la tua analisi del suono.\n4. La **moderazione IA via n8n** valuta e pubblica.',
      ja: '**SONAR** でレビュー投稿は簡単で **+50 Sonar Coins** 獲得：\n\n1. **カタログ**のアルバムへ行くか**「レビュー」**を押す。\n2. **1〜10 星**で評価。\n3. 音質、プロダクション、ダイナミクスの分析を記述。\n4. **n8n 経由の AI モデレーション**が評価・公開。',
    },
    suggestions: [
      { title: 'The Dark Side of the Moon', artist: 'Pink Floyd', year: '1973', genre: 'Progressive Rock', reason: 'Most reviewed on SONAR.', deezerQuery: 'Pink Floyd Dark Side of the Moon' },
    ],
    quickReplies: {
      es: ['🪙 ¿Para qué sirven las Sonar Coins?', '💿 Ir al Catálogo', '👤 Ver mi Perfil'],
      en: ['🪙 What are Sonar Coins for?', '💿 Go to Catalog', '👤 View my Profile'],
      zh: ['🪙 Sonar Coins 有什么用？', '💿 前往目录', '👤 我的资料'],
      fr: ['🪙 À quoi servent les Coins ?', '💿 Aller au Catalogue', '👤 Mon Profil'],
      it: ['🪙 A cosa servono i Coins?', '💿 Vai al Catalogo', '👤 Il mio Profilo'],
      ja: ['🪙 Coins の用途？', '💿 カタログへ', '👤 プロフィール'],
    },
  },
  {
    keywords: ['coins', 'monedas', 'sonar coins', 'puntos', 'recompensas', 'ganar', 'xp', 'nivel', 'earn', 'points', 'rewards', 'level'],
    reply: {
      es: 'Las **Sonar Coins** 🪙 son la moneda oficial de SONAR:\n\n• 🎧 **+5 Coins**: Por cada canción escuchada.\n• ⭐ **+50 Coins**: Por cada reseña publicada.\n• 🎁 **+100 Coins**: Al abrir tu **Daily Crate Drop**.\n• 🔥 **Racha diaria**: Bonificación por días consecutivos.\n\nGástalas en la **Boutique** para skins de Casete y VU Meters.',
      en: '**Sonar Coins** 🪙 are SONAR\'s official currency:\n\n• 🎧 **+5 Coins**: For each song listened.\n• ⭐ **+50 Coins**: For each review published.\n• 🎁 **+100 Coins**: Opening your **Daily Crate Drop**.\n• 🔥 **Daily streak**: Bonus for consecutive days.\n\nSpend them at the **Boutique** for Cassette skins and VU Meters.',
      zh: '**Sonar Coins** 🪙 是 SONAR 的官方货币：\n\n• 🎧 **+5 Coins**：每听一首歌。\n• ⭐ **+50 Coins**：每发表评论。\n• 🎁 **+100 Coins**：打开**每日宝箱**。\n• 🔥 **连续登录奖励**。\n\n在**精品店**消费解锁皮肤。',
      fr: 'Les **Sonar Coins** 🪙 sont la monnaie officielle :\n\n• 🎧 **+5 Coins** : Par chanson écoutée.\n• ⭐ **+50 Coins** : Par critique publiée.\n• 🎁 **+100 Coins** : Caisse Quotidienne.\n• 🔥 **Série quotidienne** : Bonus consécutif.\n\nDépensez à la **Boutique** pour des skins.',
      it: 'Le **Sonar Coins** 🪙 sono la valuta ufficiale:\n\n• 🎧 **+5 Coins**: Per ogni canzone ascoltata.\n• ⭐ **+50 Coins**: Per ogni recensione.\n• 🎁 **+100 Coins**: Cassa Giornaliera.\n• 🔥 **Serie giornaliera**: Bonus consecutivo.\n\nSpendile nella **Boutique** per skin.',
      ja: '**Sonar Coins** 🪙 は公式通貨：\n\n• 🎧 **+5 Coins**：曲を聴くごと。\n• ⭐ **+50 Coins**：レビュー投稿ごと。\n• 🎁 **+100 Coins**：デイリークレート。\n• 🔥 **連続ログインボーナス**。\n\n**ブティック**でスキンをアンロック。',
    },
    suggestions: [],
    quickReplies: {
      es: ['🛒 ¿Qué hay en la Boutique?', '🎁 Caja Diaria', '⭐ Publicar reseña'],
      en: ['🛒 What\'s in the Boutique?', '🎁 Daily Crate', '⭐ Publish a review'],
      zh: ['🛒 精品店有什么？', '🎁 每日宝箱', '⭐ 发表评论'],
      fr: ['🛒 Voir la Boutique', '🎁 Caisse Quotidienne', '⭐ Publier critique'],
      it: ['🛒 Vedi Boutique', '🎁 Cassa Giornaliera', '⭐ Pubblica recensione'],
      ja: ['🛒 ブティック', '🎁 デイリークレート', '⭐ レビュー投稿'],
    },
  },
  {
    keywords: ['boutique', 'tienda', 'skin', 'skins', 'casete', 'cassette', 'vu meter', 'personalizar', 'comprar', 'shop', 'store', 'customize'],
    reply: {
      es: 'En la **Boutique de SONAR** 🛒 puedes personalizar tu reproductor:\n\n• 📼 **Skins de Casete Vintage**: Diseños retro de cromo, metal y ediciones limitadas.\n• 🎛️ **Medidores VU Analógicos**: Estilos con agujas retroiluminadas.\n• 👑 **Insignias de Melómano**: Títulos de prestigio para tus reseñas.',
      en: 'In the **SONAR Boutique** 🛒 you can customize your player:\n\n• 📼 **Vintage Cassette Skins**: Retro chrome, metal, and limited edition designs.\n• 🎛️ **Analog VU Meters**: Styles with backlit needles.\n• 👑 **Audiophile Badges**: Prestige titles for your reviews.',
      zh: '在 **SONAR 精品店** 🛒 自定义你的播放器：\n\n• 📼 **复古磁带皮肤**：铬、金属和限量版设计。\n• 🎛️ **模拟 VU 表**：背光指针风格。\n• 👑 **音乐爱好者徽章**：荣誉头衔。',
      fr: 'Dans la **Boutique SONAR** 🛒 personnalisez votre lecteur :\n\n• 📼 **Skins Cassette Vintage** : Designs rétro chrome et métal.\n• 🎛️ **VU Mètres Analogiques** : Aiguilles rétroéclairées.\n• 👑 **Badges Mélomane** : Titres de prestige.',
      it: 'Nella **Boutique SONAR** 🛒 personalizza il tuo lettore:\n\n• 📼 **Skin Cassetta Vintage**: Design retrò cromo e metallo.\n• 🎛️ **VU Meter Analogici**: Aghi retroilluminati.\n• 👑 **Badge Audiofilo**: Titoli di prestigio.',
      ja: '**SONAR ブティック** 🛒 でプレーヤーをカスタマイズ：\n\n• 📼 **ヴィンテージカセットスキン**：クローム、メタル、限定版デザイン。\n• 🎛️ **アナログ VU メーター**：バックライト付き。\n• 👑 **オーディオファイルバッジ**：名誉称号。',
    },
    suggestions: [],
    quickReplies: {
      es: ['🪙 ¿Cómo ganar Coins?', '💿 Escuchar música', '👤 Mi Perfil'],
      en: ['🪙 How to earn Coins?', '💿 Listen to music', '👤 My Profile'],
      zh: ['🪙 如何赚 Coins？', '💿 听音乐', '👤 我的资料'],
      fr: ['🪙 Gagner des Coins ?', '💿 Écouter', '👤 Mon Profil'],
      it: ['🪙 Guadagnare Coins?', '💿 Ascolta', '👤 Il mio Profilo'],
      ja: ['🪙 Coins を稼ぐ？', '💿 音楽を聴く', '👤 プロフィール'],
    },
  },
  {
    keywords: ['caja', 'crate', 'daily', 'diaria', 'drop', 'regalo', 'gift', 'daily reward'],
    reply: {
      es: 'El **Daily Crate Drop** 🎁 es una recompensa gratuita diaria en tu **Perfil**.\n\nObtendrás **100 Sonar Coins**, XP y la oportunidad de cosméticos exclusivos.',
      en: 'The **Daily Crate Drop** 🎁 is a free daily reward in your **Profile**.\n\nYou\'ll get **100 Sonar Coins**, XP, and a chance for exclusive cosmetics.',
      zh: '**每日宝箱** 🎁 是你**个人资料**中的每日免费奖励。\n\n获得 **100 Sonar Coins**、XP 和独家外观。',
      fr: 'Le **Daily Crate Drop** 🎁 est une récompense gratuite dans votre **Profil**.\n\nVous obtiendrez **100 Sonar Coins**, XP et des cosmétiques.',
      it: 'Il **Daily Crate Drop** 🎁 è un premio gratuito nel tuo **Profilo**.\n\nOttieni **100 Sonar Coins**, XP e cosmetici esclusivi.',
      ja: '**デイリークレート** 🎁 は**プロフィール**で毎日もらえる無料報酬。\n\n**100 Sonar Coins**、XP、限定コスメティック獲得。',
    },
    suggestions: [],
    quickReplies: {
      es: ['👤 Mi Perfil', '🪙 Ver saldo', '🛒 Boutique'],
      en: ['👤 My Profile', '🪙 Check balance', '🛒 Boutique'],
      zh: ['👤 我的资料', '🪙 查看余额', '🛒 精品店'],
      fr: ['👤 Mon Profil', '🪙 Voir solde', '🛒 Boutique'],
      it: ['👤 Profilo', '🪙 Vedi saldo', '🛒 Boutique'],
      ja: ['👤 プロフィール', '🪙 残高確認', '🛒 ブティック'],
    },
  },
  {
    keywords: ['parental', 'junior', 'ninos', 'hijos', 'pin', 'filtro', 'explicito', 'familiar', 'children', 'kids', 'family', 'explicit'],
    reply: {
      es: 'El **Control Parental** 🔒 de SONAR:\n\n1. **Perfil Junior**: Oculta contenido explícito.\n2. **PIN de 4 dígitos**: Solo padres pueden modificar.\n3. **Activación rápida**: En registro o ajustes de cuenta.',
      en: '**Parental Control** 🔒 on SONAR:\n\n1. **Junior Profile**: Hides explicit content.\n2. **4-digit PIN**: Only parents can modify.\n3. **Quick activation**: During registration or in account settings.',
      zh: '**家长控制** 🔒：\n\n1. **Junior 配置文件**：隐藏不当内容。\n2. **4 位 PIN**：仅家长可修改。\n3. **快速激活**：注册时或账户设置中。',
      fr: '**Contrôle Parental** 🔒 :\n\n1. **Profil Junior** : Masque le contenu explicite.\n2. **PIN 4 chiffres** : Seuls les parents modifient.\n3. **Activation rapide** : Inscription ou paramètres.',
      it: '**Controllo Parentale** 🔒:\n\n1. **Profilo Junior**: Nasconde contenuti espliciti.\n2. **PIN a 4 cifre**: Solo i genitori modificano.\n3. **Attivazione rapida**: Registrazione o impostazioni.',
      ja: '**ペアレンタルコントロール** 🔒：\n\n1. **Junior プロフィール**：不適切なコンテンツを非表示。\n2. **4 桁 PIN**：保護者のみ変更可。\n3. **クイック有効化**：登録時またはアカウント設定で。',
    },
    suggestions: [],
    quickReplies: {
      es: ['⚙️ Ajustes', '💿 Música Familiar', '📰 Noticias'],
      en: ['⚙️ Settings', '💿 Family Music', '📰 News'],
      zh: ['⚙️ 设置', '💿 家庭音乐', '📰 新闻'],
      fr: ['⚙️ Paramètres', '💿 Musique Familiale', '📰 Actualités'],
      it: ['⚙️ Impostazioni', '💿 Musica Familiare', '📰 Notizie'],
      ja: ['⚙️ 設定', '💿 ファミリー音楽', '📰 ニュース'],
    },
  },
  {
    keywords: ['reproductor', 'musica', 'escuchar', 'player', 'cancion', 'track', 'audio', 'preescucha', 'listen', 'song', 'preview'],
    reply: {
      es: 'El **Reproductor Hi-Fi de SONAR** 🎧 está en la barra inferior:\n\n• Preescuchas Hi-Fi con Deezer.\n• Controles: Play/Pausa, anterior, siguiente y volumen.\n• Modo inmersivo con VU Meter dinámico.\n• ¡Cada pista suma **+5 Sonar Coins**!',
      en: 'The **SONAR Hi-Fi Player** 🎧 is in the bottom bar:\n\n• Hi-Fi previews with Deezer.\n• Controls: Play/Pause, previous, next and volume.\n• Immersive mode with dynamic VU Meter.\n• Every track earns **+5 Sonar Coins**!',
      zh: '**SONAR Hi-Fi 播放器** 🎧 在底部栏：\n\n• Deezer Hi-Fi 预览。\n• 控制：播放/暂停、上/下一首、音量。\n• 动态 VU 表沉浸模式。\n• 每首歌获 **+5 Sonar Coins**！',
      fr: 'Le **Lecteur Hi-Fi** 🎧 est dans la barre inférieure :\n\n• Pré-écoutes Hi-Fi avec Deezer.\n• Contrôles : Lecture/Pause, précédent, suivant, volume.\n• Mode immersif avec VU Mètre.\n• Chaque piste rapporte **+5 Sonar Coins** !',
      it: 'Il **Lettore Hi-Fi** 🎧 è nella barra inferiore:\n\n• Anteprime Hi-Fi con Deezer.\n• Controlli: Play/Pausa, precedente, successivo, volume.\n• Modalità immersiva con VU Meter.\n• Ogni brano fa guadagnare **+5 Sonar Coins**!',
      ja: '**SONAR Hi-Fi プレーヤー** 🎧 は下部バーにあります：\n\n• Deezer 連携 Hi-Fi プレビュー。\n• コントロール：再生/停止、前/次、音量。\n• VU メーター付き没入モード。\n• 毎曲 **+5 Sonar Coins** 獲得！',
    },
    suggestions: [
      { title: 'Scenery', artist: 'Ryo Fukui', year: '1976', genre: 'Modal Jazz', reason: 'Perfect for testing.', deezerQuery: 'Ryo Fukui Scenery' },
    ],
    quickReplies: {
      es: ['💿 Buscar en Catálogo', '🛒 Skins VU Meter', '🪙 Mis Coins'],
      en: ['💿 Search Catalog', '🛒 VU Meter Skins', '🪙 My Coins'],
      zh: ['💿 搜索目录', '🛒 VU 表皮肤', '🪙 我的 Coins'],
      fr: ['💿 Chercher', '🛒 Skins VU', '🪙 Mes Coins'],
      it: ['💿 Cerca nel Catalogo', '🛒 Skin VU', '🪙 I miei Coins'],
      ja: ['💿 カタログ検索', '🛒 VU スキン', '🪙 コイン確認'],
    },
  },
  {
    keywords: ['catalogo', 'buscar', 'filtros', 'albumes', 'artistas', 'generos', 'disco', 'vinilo', 'catalog', 'search', 'albums', 'artists', 'genres', 'vinyl'],
    reply: {
      es: 'El **Catálogo de SONAR** 💿 tiene miles de obras maestras:\n\n• **Géneros**: Jazz, Rock, Electrónica, City Pop, Clásica, Hip-Hop, Metal.\n• **Filtros Audiófilos**: Hi-Fi, vinilo, dinamismo acústico.\n• **Buscador Inteligente**: Escribe el nombre del álbum o artista.',
      en: 'The **SONAR Catalog** 💿 features thousands of masterpieces:\n\n• **Genres**: Jazz, Rock, Electronic, City Pop, Classical, Hip-Hop, Metal.\n• **Audiophile Filters**: Hi-Fi, vinyl, acoustic dynamics.\n• **Smart Search**: Type album or artist name.',
      zh: '**SONAR 目录** 💿 汇集了数千部杰作：\n\n• **类型**：爵士、摇滚、电子、City Pop、古典、嘻哈、金属。\n• **发烧友筛选**：Hi-Fi、黑胶、声学动态。\n• **智能搜索**：输入专辑或艺术家名称。',
      fr: 'Le **Catalogue SONAR** 💿 rassemble des chefs-d\'œuvre :\n\n• **Genres** : Jazz, Rock, Électronique, City Pop, Classique, Hip-Hop, Métal.\n• **Filtres Audiophiles** : Hi-Fi, vinyle, dynamique.\n• **Recherche Intelligente** : Tapez le nom.',
      it: 'Il **Catalogo SONAR** 💿 raccoglie migliaia di capolavori:\n\n• **Generi**: Jazz, Rock, Elettronica, City Pop, Classica, Hip-Hop, Metal.\n• **Filtri Audiofili**: Hi-Fi, vinile, dinamica.\n• **Ricerca Intelligente**: Digita il nome.',
      ja: '**SONAR カタログ** 💿 は数千の名作を収録：\n\n• **ジャンル**：ジャズ、ロック、エレクトロニカ、シティポップ、クラシック、ヒップホップ、メタル。\n• **オーディオファイルフィルター**：Hi-Fi、ビニール、音響ダイナミクス。\n• **スマート検索**：アルバムやアーティスト名を入力。',
    },
    suggestions: [
      { title: 'Mint Jams', artist: 'Casiopea', year: '1982', genre: 'Jazz Fusion', reason: 'Live recording.', deezerQuery: 'Casiopea Mint Jams' },
    ],
    quickReplies: {
      es: ['⭐ Escribir Reseña', '🎧 Probar Reproductor', '🪙 Ganar Coins'],
      en: ['⭐ Write a Review', '🎧 Try the Player', '🪙 Earn Coins'],
      zh: ['⭐ 写评论', '🎧 试用播放器', '🪙 赚取 Coins'],
      fr: ['⭐ Écrire Critique', '🎧 Essayer Lecteur', '🪙 Gagner Coins'],
      it: ['⭐ Scrivi Recensione', '🎧 Prova Lettore', '🪙 Guadagna Coins'],
      ja: ['⭐ レビューを書く', '🎧 プレーヤー', '🪙 Coins 獲得'],
    },
  },
  {
    keywords: ['noticias', 'newsletter', 'boletin', 'correo', 'suscripcion', 'articulos', 'news', 'subscribe', 'articles'],
    reply: {
      es: '**Noticias y Boletín** 📰 de SONAR:\n\n• Artículos sobre historia del vinilo, acústica e ingeniería.\n• **Boletín Semanal** vía n8n directo a tu correo.',
      en: '**News & Newsletter** 📰 on SONAR:\n\n• Articles about vinyl history, acoustics and sound engineering.\n• **Weekly Bulletin** via n8n straight to your email.',
      zh: '**新闻和简报** 📰：\n\n• 黑胶历史、声学和音频工程文章。\n• 通过 n8n **每周简报**直达邮箱。',
      fr: '**Actualités & Newsletter** 📰 :\n\n• Articles sur vinyle, acoustique et ingénierie sonore.\n• **Bulletin Hebdomadaire** via n8n par email.',
      it: '**Notizie & Newsletter** 📰:\n\n• Articoli su vinile, acustica e ingegneria del suono.\n• **Bollettino Settimanale** via n8n per email.',
      ja: '**ニュース＆ニュースレター** 📰：\n\n• ビニール歴史、音響学、サウンドエンジニアリング記事。\n• n8n 経由**週刊ニュースレター**をメールで。',
    },
    suggestions: [],
    quickReplies: {
      es: ['📰 Ir a Noticias', '💿 Ver Catálogo', '⭐ Publicar Reseña'],
      en: ['📰 Go to News', '💿 View Catalog', '⭐ Publish Review'],
      zh: ['📰 前往新闻', '💿 查看目录', '⭐ 发表评论'],
      fr: ['📰 Voir Actualités', '💿 Catalogue', '⭐ Publier Critique'],
      it: ['📰 Notizie', '💿 Catalogo', '⭐ Pubblica Recensione'],
      ja: ['📰 ニュースへ', '💿 カタログ', '⭐ レビュー投稿'],
    },
  },
  {
    keywords: ['pasaporte', 'passport', 'sellos', 'stamps', 'certificacion', 'certificar', 'horas de escucha', 'diploma', 'descargar pasaporte'],
    reply: {
      es: 'El **Pasaporte Audiófilo** 🛂 de SONAR certifica tu trayectoria musical:\n\n• ⏱️ **Registro de Horas**: Totaliza tu tiempo de escucha en alta fidelidad.\n• 🏅 **Sellos de Fidelidad**: Sellos coleccionables según tus géneros y reseñas.\n• 🎓 **Nivel Melómano**: Muestra tu evolución auditiva y rango dinámico evaluado.\n• 📥 **Descarga Gráfica**: Puedes descargar tu pasaporte oficial en alta resolución desde la pestaña Perfil.',
      en: 'The **Audiophile Passport** 🛂 certifies your listening journey on SONAR:\n\n• ⏱️ **Listening Hours**: Records your total Hi-Fi listening time.\n• 🏅 **Fidelity Stamps**: Collectible stamps based on genres and reviews.\n• 🎓 **Audiophile Rank**: Displays your acoustic maturity and dynamic range analysis.\n• 📥 **Hi-Res Export**: Download your official verified passport from your Profile tab.',
      zh: '**发烧友护照** 🛂 认证你在 SONAR 的聆听历程：\n\n• ⏱️ **聆听时长**：记录你在 Hi-Fi 音频中的总收听时间。\n• 🏅 **忠诚度印章**：根据流派和评论收集专属印章。\n• 🎓 **发烧友等级**：展示你的声学鉴赏能力与动态分析。\n• 📥 **高清导出**：在个人资料标签页下载官方认证护照。',
      fr: 'Le **Passeport Audiophile** 🛂 certifie votre parcours sur SONAR :\n\n• ⏱️ **Heures d\'écoute** : Cumule votre temps d\'écoute en haute fidélité.\n• 🏅 **Tampons de Fidélité** : Badges selon vos genres et critiques.\n• 🎓 **Rang Audiophile** : Évolution et dynamique acoustique évaluée.\n• 📥 **Export Haute Résolution** : Téléchargez votre passeport officiel depuis votre profil.',
      it: 'Il **Passaporto Audiofilo** 🛂 certifica il tuo percorso su SONAR:\n\n• ⏱️ **Ore di Ascolto**: Registra il tempo trascorso in alta fedeltà.\n• 🏅 **Timbri di Fedeltà**: Timbri collezionabili in base a generi e recensioni.\n• 🎓 **Rango Audiofilo**: Mostra la maturità di ascolto e dinamica valutata.\n• 📥 **Download HD**: Scarica il tuo passaporto ufficiale dalla scheda Profilo.',
      ja: '**オーディオファイルパスポート** 🛂 はSONARでのリスニング体験を証明します：\n\n• ⏱️ **リスニング時間**：Hi-Fiオーディオの総再生時間を記録。\n• 🏅 **フィデリティスタンプ**：ジャンルやレビューに応じた限定スタンプ。\n• 🎓 **オーディオファイルランク**：音響ダイナミクスの分析とランク。\n• 📥 **高解像度エクスポート**：プロフィールから公式パスポートをダウンロード可能。',
    },
    suggestions: [],
    quickReplies: {
      es: ['👤 Ver mi Pasaporte', '🪙 Ver mis Coins', '🎮 Jugar Trivia'],
      en: ['👤 View Passport', '🪙 Check Coins', '🎮 Play Trivia'],
      zh: ['👤 查看护照', '🪙 查看金币', '🎮 音乐竞猜'],
      fr: ['👤 Mon Passeport', '🪙 Mes Coins', '🎮 Jouer Trivia'],
      it: ['👤 Mio Passaporto', '🪙 Miei Coins', '🎮 Gioca Trivia'],
      ja: ['👤 パスポート確認', '🪙 Coins確認', '🎮 トリビア挑戦'],
    },
  },
  {
    keywords: ['trivia', 'duelo', 'quiz', 'preguntas', 'juego', 'musica trivia', 'combos', 'jugar'],
    reply: {
      es: '¡Los **Duelos de Trivia Musical** 🎮 de SONAR ponen a prueba tus conocimientos melómanos!\n\n• 🎯 **Más de 400 Preguntas**: En 6 idiomas sobre vinilos, historia, masterización y leyendas.\n• ⏱️ **Rondas Cronometradas**: Responde antes de que se agote el tiempo.\n• 🔥 **Sistema de Combos**: Multiplica tu puntaje por respuestas correctas consecutivas.\n• 🪙 **Premios en Sonar Coins**: Gana monedas para canjear en la Boutique.',
      en: '**Musical Trivia Duels** 🎮 test your audiophile knowledge on SONAR!\n\n• 🎯 **400+ Questions**: In 6 languages covering vinyl history, mastering, and legends.\n• ⏱️ **Timed Rounds**: Answer before the clock runs out.\n• 🔥 **Combo Streaks**: Multiply your score with consecutive correct answers.\n• 🪙 **Sonar Coins Rewards**: Earn coins to spend in the Boutique.',
      zh: '**音乐竞猜对决** 🎮 考验你在 SONAR 的音乐知识！\n\n• 🎯 **400+ 道题目**：涵盖黑胶历史、母带制作与传奇大师（支持 6 种语言）。\n• ⏱️ **计时挑战**：在倒计时结束前作答。\n• 🔥 **连击系统**：连续答对获取倍数积分。\n• 🪙 **Sonar Coins 奖励**：赢取金币在精品店兑换奖励。',
      fr: 'Les **Duels de Trivia Musicale** 🎮 testent votre culture mélomane sur SONAR !\n\n• 🎯 **400+ Questions** : En 6 langues sur le vinyle, le mastering et les légendes.\n• ⏱️ **Manches Chronométrées** : Répondez avant la fin du temps imparti.\n• 🔥 **Système de Combos** : Multipliez vos points en enchaînant les bonnes réponses.\n• 🪙 **Récompenses Coins** : Gagnez des pièces pour la Boutique.',
      it: 'I **Duelli di Trivia Musicale** 🎮 mettono alla prova la tua cultura audiofila su SONAR!\n\n• 🎯 **Oltre 400 Domande**: In 6 lingue su vinili, mastering e leggende.\n• ⏱️ **Round a Tempo**: Rispondi prima dello scadere del timer.\n• 🔥 **Sistema Combo**: Moltiplica il punteggio con risposte esatte consecutive.\n• 🪙 **Premi in Sonar Coins**: Guadagna monete da spendere nella Boutique.',
      ja: '**ミュージックトリビアデュエル** 🎮 はあなたの音楽知識を試します！\n\n• 🎯 **400問以上の問題**：ビニール史、マスタリング、伝説の名盤（6言語対応）。\n• ⏱️ **制限時間マッチ**：時間内に正確に回答。\n• 🔥 **コンボシステム**：連続正解でスコア倍率アップ。\n• 🪙 **Sonar Coins 獲得**：ブティックで使えるコインを獲得。',
    },
    suggestions: [],
    quickReplies: {
      es: ['🎮 Jugar Trivia', '🛒 Boutique de Recompensas', '🪙 Ganar Coins'],
      en: ['🎮 Play Trivia', '🛒 Rewards Boutique', '🪙 Earn Coins'],
      zh: ['🎮 开始竞猜', '🛒 奖励精品店', '🪙 赚取金币'],
      fr: ['🎮 Lancer Trivia', '🛒 Boutique Récompenses', '🪙 Gagner Coins'],
      it: ['🎮 Avvia Trivia', '🛒 Boutique Premi', '🪙 Guadagna Coins'],
      ja: ['🎮 トリビア開始', '🛒 ブティック', '🪙 Coins獲得'],
    },
  },
  {
    keywords: ['avatar', 'blobatar', 'marcos', 'studio', 'identidad visual', 'cara', 'mascota'],
    reply: {
      es: 'En el **Avatar Studio** 🎨 de SONAR puedes crear tu identidad visual única:\n\n• 👾 **Caras Blobatar Interactivas**: Personajes que reaccionan y siguen tu cursor con la mirada.\n• 🌈 **Más de 34 Combinaciones**: Tonos cromáticos, paletas personalizadas e iniciales.\n• 🖼️ **Marcos Coleccionables**: Marco Vinilo Oro 24K, Neón Cyber, Válvula de Vacío, Prisma Pink Floyd y Madera Vintage.',
      en: 'In the **Avatar Studio** 🎨 on SONAR you can craft your unique visual identity:\n\n• 👾 **Interactive Blobatars**: Animated characters that look and react to your mouse pointer.\n• 🌈 **34+ Chromatic Palettes**: Tailored color tones, initial styles and custom avatars.\n• 🖼️ **Collectible Frames**: 24K Gold Vinyl, Neon Cyber, Tube Valve, Pink Floyd Prism, and Vintage Wood.',
      zh: '在 **Avatar Studio** 🎨 打造你的专属视觉形象：\n\n• 👾 **互动 Blobatar 形象**：眼神能够跟随鼠标指针移动的生动角色。\n• 🌈 **34+ 种色彩组合**：定制色调、首字母与图层风格。\n• 🖼️ **珍藏头像框**：24K 黄金黑胶、赛博霓虹、电子管、平克弗洛伊德三棱镜及复古实木框。',
      fr: 'Dans l\'**Avatar Studio** 🎨 de SONAR, créez votre identité visuelle unique :\n\n• 👾 **Blobatars Interactifs** : Personnages animés dont les yeux suivent votre curseur.\n• 🌈 **34+ Combinaisons** : Teintes chromatiques personnalisées et initiales.\n• 🖼️ **Cadres de Collection** : Vinyle Or 24K, Cyber Néon, Tube Lampe, Prisme Pink Floyd et Bois Vintage.',
      it: 'Nell\'**Avatar Studio** 🎨 di SONAR puoi creare la tua identità visiva unica:\n\n• 👾 **Blobatar Interattivi**: Personaggi animati con sguardo reattivo al puntatore.\n• 🌈 **Oltre 34 Combinazioni**: Tonalità cromatiche e stili personalizzati.\n• 🖼️ **Cornici da Collezione**: Vinile Oro 24K, Cyber Neon, Valvola Termoionica, Prisma Pink Floyd e Legno Vintage.',
      ja: '**Avatar Studio** 🎨 であなただけのビジュアルアイデンティティを作成：\n\n• 👾 **インタラクティブ Blobatar**：カーソルを目線で追従するアニメーションキャラクター。\n• 🌈 **34種類以上のカラーコンビネーション**：カスタムカラーとイニシャルスタイル。\n• 🖼️ **コレクタブルフレーム**：24Kゴールドレコード、サイバーネオン、真空管、ピンクフロイドプリズム、ヴィンテージウッド。',
    },
    suggestions: [],
    quickReplies: {
      es: ['🎨 Ir al Avatar Studio', '🛒 Ver Marcos en Boutique', '👤 Ver mi Perfil'],
      en: ['🎨 Go to Avatar Studio', '🛒 Frames in Boutique', '👤 View Profile'],
      zh: ['🎨 前往头像工作室', '🛒 精品店头像框', '👤 个人资料'],
      fr: ['🎨 Avatar Studio', '🛒 Cadres en Boutique', '👤 Mon Profil'],
      it: ['🎨 Avatar Studio', '🛒 Cornici Boutique', '👤 Mio Profilo'],
      ja: ['🎨 アバタースタジオ', '🛒 ブティックのフレーム', '👤 プロフィール'],
    },
  },
  {
    keywords: ['recompensas', '220', 'carrusel', 'dsp', 'skins', 'presets', 'valvular', 'temas'],
    reply: {
      es: 'El **Catálogo de Recompensas de SONAR** 🛒 cuenta con **más de 220 artículos** navegables mediante rieles deslizantes:\n\n1. 🖼️ **Marcos de Avatar**: Acabados holográficos, dorados y vintage.\n2. 🎛️ **Skins de Reproductor**: Tornamesas, medidores VU y decks de casete.\n3. 🎚️ **Presets DSP**: Calidez Valvular 1970, Cinta Master Otari y Espacio Binaural.\n4. 🔊 **Packs de Sonidos UI**: Clicks mecánicos y agujas de tocadiscos.\n5. 🎨 **Temas Visuales**: Dark Hi-Fi, Cyber Neon, Monocromo y Retro Amber.\n6. 🎟️ **Pases VIP**: Salones de debate acústico y salas exclusivas.',
      en: 'The **SONAR Rewards Catalog** 🛒 offers **220+ items** with smooth horizontal sliding rails:\n\n1. 🖼️ **Avatar Frames**: Holographic, golden, and vintage finishes.\n2. 🎛️ **Player Skins**: Turntables, VU meters, and cassette decks.\n3. 🎚️ **DSP Presets**: 1970 Tube Warmth, Otari Master Tape, and Binaural Space.\n4. 🔊 **UI Sound Packs**: Mechanical clicks and turntable needle drops.\n5. 🎨 **Visual Themes**: Dark Hi-Fi, Cyber Neon, Monochrome, and Retro Amber.\n6. 🎟️ **VIP Passes**: Acoustic listening lounges and exclusive rooms.',
      zh: '**SONAR 奖励目录** 🛒 拥有 **220+ 款专属物品**，支持横向滑轨流畅浏览：\n\n1. 🖼️ **头像边框**：全息、镀金与复古质感。\n2. 🎛️ **播放器皮肤**：直驱黑胶机、VU 电平表与磁带卡座。\n3. 🎚️ **DSP 预设**：1970 电子管温润音色、Otari 母带磁带与双耳立体声。\n4. 🔊 **UI 音效包**：机械按键音与黑胶落针音效。\n5. 🎨 **界面主题**：暗黑 Hi-Fi、赛博霓虹、单色与复古琥珀。\n6. 🎟️ **VIP 通行证**：声学沙龙与专属品鉴空间。',
      fr: 'Le **Catalogue des Récompenses SONAR** 🛒 propose **plus de 220 articles** sur rails coulissants :\n\n1. 🖼️ **Cadres d\'Avatar** : Finitions holographiques, dorées et vintage.\n2. 🎛️ **Skins de Lecteur** : Platines vinyle, VU-mètres et magnétophones à cassette.\n3. 🎚️ **Préréglages DSP** : Chaleur à Lampes 1970, Bande Master Otari et Espace Binaural.\n4. 🔊 **Packs Sons UI** : Clics mécaniques et descentes de diamant vinyle.\n5. 🎨 **Thèmes Visuels** : Dark Hi-Fi, Cyber Neon, Monochrome et Ambre Rétro.\n6. 🎟️ **Pass VIP** : Salons de débat acoustique et salles exclusives.',
      it: 'Il **Catalogo Premi di SONAR** 🛒 offre **oltre 220 articoli** con guide scorrevoli orizzontali:\n\n1. 🖼️ **Cornici Avatar**: Finiture olografiche, dorate e vintage.\n2. 🎛️ **Skin Lettore**: Giradischi, indicatori VU e riproduttori a cassetta.\n3. 🎚️ **Preset DSP**: Calore Valvolare 1970, Nastro Master Otari e Spazio Binaurale.\n4. 🔊 **Pacchetti Suoni UI**: Click meccanici e drop puntina su vinile.\n5. 🎨 **Temi Visivi**: Dark Hi-Fi, Cyber Neon, Monocromatico e Ambra Retrò.\n6. 🎟️ **Pass VIP**: Salotti di ascolto acustico e sale esclusive.',
      ja: '**SONAR リワードカタログ** 🛒 ではスライドレールで **220以上のアイテム** を閲覧できます：\n\n1. 🖼️ **アバターフレーム**：ホログラフィック、ゴールド、ヴィンテージ仕上げ。\n2. 🎛️ **プレーヤースキン**：ダイレクトドライブターンテーブル、VUメーター、カセットデッキ。\n3. 🎚️ **DSPプリセット**：1970年製真空管の温もり、Otariマスターテープ、バイノーラル音響。\n4. 🔊 **UIサウンドパック**：メカニカルクリックやレコードの針落とし音。\n5. 🎨 **ビジュアルテーマ**：ダークHi-Fi、サイバーネオン、モノクローム、レトロアンバー。\n6. 🎟️ **VIPパス**：アコースティックディベートサロンと限定ルーム。',
    },
    suggestions: [],
    quickReplies: {
      es: ['🛒 Explorar Boutique', '🪙 Ganar Coins', '🎮 Jugar Trivia'],
      en: ['🛒 Explore Boutique', '🪙 Earn Coins', '🎮 Play Trivia'],
      zh: ['🛒 探索精品店', '🪙 赚取金币', '🎮 音乐竞猜'],
      fr: ['🛒 Explorer Boutique', '🪙 Gagner Coins', '🎮 Jouer Trivia'],
      it: ['🛒 Esplora Boutique', '🪙 Guadagna Coins', '🎮 Gioca Trivia'],
      ja: ['🛒 ブティック探索', '🪙 Coins獲得', '🎮 トリビア挑戦'],
    },
  },
  {
    keywords: ['login', 'registro', 'cuenta', 'perfil', 'password', 'recuperar', 'otp', 'clave', 'seguridad', 'account', 'profile', 'security', 'recover'],
    reply: {
      es: 'Seguridad en **SONAR** 🛡️:\n\n• **Alertas de Inicio de Sesión** mediante n8n.\n• **Recuperación OTP**: Código de 6 dígitos por correo.\n• **Perfil**: Biografía, avatar, nivel XP y colecciones.',
      en: 'Security on **SONAR** 🛡️:\n\n• **Login Alerts** via n8n.\n• **OTP Recovery**: 6-digit code sent by email.\n• **Profile**: Biography, avatar, XP level and collections.',
      zh: '**SONAR** 🛡️ 安全：\n\n• 通过 n8n **登录警报**。\n• **OTP 恢复**：邮件发送 6 位验证码。\n• **个人资料**：简介、头像、XP 等级。',
      fr: 'Sécurité **SONAR** 🛡️ :\n\n• **Alertes de Connexion** via n8n.\n• **Récupération OTP** : Code 6 chiffres par email.\n• **Profil** : Bio, avatar, niveau XP.',
      it: 'Sicurezza **SONAR** 🛡️:\n\n• **Avvisi di Accesso** via n8n.\n• **Recupero OTP**: Codice 6 cifre via email.\n• **Profilo**: Bio, avatar, livello XP.',
      ja: '**SONAR** 🛡️ セキュリティ：\n\n• n8n 経由**ログインアラート**。\n• **OTP 復旧**：6 桁コードをメール送信。\n• **プロフィール**：自己紹介、アバター、XP レベル。',
    },
    suggestions: [],
    quickReplies: {
      es: ['👤 Mi Perfil', '🔒 Control Parental', '🪙 Mis Sonar Coins'],
      en: ['👤 My Profile', '🔒 Parental Control', '🪙 My Sonar Coins'],
      zh: ['👤 我的资料', '🔒 家长控制', '🪙 我的 Coins'],
      fr: ['👤 Mon Profil', '🔒 Contrôle Parental', '🪙 Mes Coins'],
      it: ['👤 Profilo', '🔒 Controllo Parentale', '🪙 I miei Coins'],
      ja: ['👤 プロフィール', '🔒 ペアレンタル', '🪙 Coins 確認'],
    },
  },
]

export async function sendChatMessage(message, sessionId = 'default-session', context = {}) {
  const cleanMsg = (message || '').trim()
  if (!cleanMsg) {
    throw new Error('El mensaje no puede estar vacío.')
  }

  const isPlaybackCommand =
    /^(?:reproduce|reproducir|pon|ponme|play|toca|escuchar|dale play|quiero escuchar)\\b/i.test(cleanMsg) ||
    /(?:reproducir|reproduceme|tocar|ponerme)\\b/i.test(cleanMsg)

  // 1. Intentar llamar al Webhook de n8n
  for (const endpoint of DEFAULT_ENDPOINTS) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanMsg,
          sessionId,
          userName: context.userName || 'Melómano',
          preferences: context.preferences || [],
          language: context.language || 'es',
        }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (res.ok) {
        const data = await res.json()
        if (data && data.message) {
          console.info('[Sonaria Service] Respuesta recibida exitosamente desde n8n:', endpoint)
          return {
            success: true,
            source: 'n8n-gemini',
            message: data.message,
            suggestions: data.suggestions || [],
            quickReplies: data.quickReplies || getLangStrings(context.language || 'es').defaultQuickReplies,
            autoPlay: Boolean(data.autoPlay || isPlaybackCommand),
            sessionId: data.sessionId || sessionId,
            timestamp: data.timestamp || new Date().toISOString(),
          }
        }
      } else {
        console.warn(`[Sonaria Service] Endpoint ${endpoint} respondió con status: ${res.status}`)
      }
    } catch (err) {
      console.warn(`[Sonaria Service] No se pudo conectar con ${endpoint}:`, err?.message || err)
    }
  }

  // 2. Fallback Inteligente Local centrado en la plataforma SONAR
  await new Promise((r) => setTimeout(r, 350))

  const lower = cleanMsg.toLowerCase()
  const lang = context.language || 'es'

  // Si es un comando directo de reproducción
  if (isPlaybackCommand) {
    const strings = getLangStrings(lang)
    let playTitle = 'Aja'
    let playArtist = 'Steely Dan'
    let playGenre = 'Jazz Rock / Hi-Fi'
    let playReason = 'Iniciando reproducción de alta fidelidad en el reproductor de SONAR.'

    if (lower.includes('daft punk') || lower.includes('random access') || lower.includes('discovery')) {
      playTitle = 'Random Access Memories'
      playArtist = 'Daft Punk'
      playGenre = 'Nu-Disco / Hi-Fi'
    } else if (lower.includes('pink floyd') || lower.includes('dark side') || lower.includes('moon')) {
      playTitle = 'The Dark Side of the Moon'
      playArtist = 'Pink Floyd'
      playGenre = 'Progressive Rock'
    } else if (lower.includes('radiohead') || lower.includes('in rainbows') || lower.includes('kid a')) {
      playTitle = 'In Rainbows'
      playArtist = 'Radiohead'
      playGenre = 'Art Rock'
    } else if (lower.includes('jazz') || lower.includes('fukui') || lower.includes('scenery')) {
      playTitle = 'Scenery'
      playArtist = 'Ryo Fukui'
      playGenre = 'Modal Jazz'
    } else if (lower.includes('casiopea') || lower.includes('mint jams') || lower.includes('fusion')) {
      playTitle = 'Mint Jams'
      playArtist = 'Casiopea'
      playGenre = 'Jazz Fusion'
    } else if (lower.includes('kendrick') || lower.includes('butterfly') || lower.includes('hip hop')) {
      playTitle = 'To Pimp a Butterfly'
      playArtist = 'Kendrick Lamar'
      playGenre = 'Conscious Hip-Hop'
    }

    return {
      success: true,
      source: 'local-sommelier',
      message: strings.playMsg(playTitle, playArtist),
      suggestions: [
        {
          title: playTitle,
          artist: playArtist,
          year: 'Master Hi-Fi',
          genre: playGenre,
          reason: playReason,
          deezerQuery: `${playArtist} ${playTitle}`,
        },
      ],
      quickReplies: strings.playQuickReplies,
      autoPlay: true,
      sessionId,
      timestamp: new Date().toISOString(),
    }
  }

  const match = LOCAL_KNOWLEDGE.find((item) =>
    item.keywords.some((kw) => lower.includes(kw))
  )

  if (match) {
    const localized = getLocalReply(match, lang)
    return {
      success: true,
      source: 'local-sommelier',
      message: localized.reply,
      suggestions: match.suggestions,
      quickReplies: localized.quickReplies,
      autoPlay: false,
      sessionId,
      timestamp: new Date().toISOString(),
    }
  }

  // Respuesta predeterminada centrada exclusivamente en SONAR
  const strings = getLangStrings(lang)
  return {
    success: true,
    source: 'local-sommelier',
    message: strings.defaultMsg,
    suggestions: [
      {
        title: 'Aja',
        artist: 'Steely Dan',
        year: '1977',
        genre: 'Jazz Rock / Hi-Fi',
        reason: 'Álbum de referencia en el catálogo de SONAR con preescucha disponible.',
        deezerQuery: 'Steely Dan Aja',
      },
      {
        title: 'Random Access Memories',
        artist: 'Daft Punk',
        year: '2013',
        genre: 'Nu-Disco / Hi-Fi',
        reason: 'Producción multipremiada disponible para reproducir y reseñar.',
        deezerQuery: 'Daft Punk Random Access Memories',
      },
    ],
    quickReplies: strings.defaultQuickReplies,
    autoPlay: false,
    sessionId,
    timestamp: new Date().toISOString(),
  }
}

export default {
  sendChatMessage,
}
