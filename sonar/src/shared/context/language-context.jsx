import React, { createContext, useContext, useState, useEffect } from 'react';

export const LANGUAGES = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

const TRANSLATIONS = {
  es: {
    // Nav
    'nav.home': 'Inicio',
    'nav.explore': 'Explorar',
    'nav.albums': 'Álbumes',
    'nav.reviews': 'Reseñas',
    'nav.news': 'Noticias',
    'nav.community': 'Comunidad',
    'nav.podcasts': 'Podcasts',
    'nav.collections': 'Colecciones',
    'nav.profile': 'Mi Perfil',
    'nav.admin': 'Administración',
    'nav.login': 'Iniciar Sesión',
    'nav.register': 'Registrarse',
    'nav.logout': 'Cerrar Sesión',
    'nav.all': 'Todo',
    'nav.tracks': 'Canciones',
    'nav.search_placeholder': 'Buscar por álbum, artista o género...',
    'nav.search_hint': 'Busca canciones, artistas o noticias…',
    'nav.accessibility': 'Accesibilidad',
    'nav.notifications': 'Notificaciones',
    
    // Footer
    'footer.tagline': 'Tu diario sonoro te estaba esperando.',
    'footer.curated': 'CURADO CON CRITERIO AUDIÓFILO',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.platform': 'Plataforma',
    'footer.explore_discs': 'Explorar Discos',
    'footer.reviews_month': 'Críticas del Mes',
    'footer.essential_lists': 'Listas Esenciales',
    'footer.community_audiophile': 'Comunidad Audiófila',
    'footer.resources': 'Recursos',
    'footer.collections_vinyl': 'Colecciones Vinilo',
    'footer.developer_api': 'API para Desarrolladores',
    'footer.news_radar': 'Noticias & Radar',
    'footer.blog': 'Blog Sonar',
    'footer.record_labels': 'Directorio de Sellos',
    'footer.legal_privacy': 'Legal & Privacidad',
    'footer.about_sonar': 'Acerca de Sonar',
    'footer.terms_of_use': 'Términos de Uso',
    'footer.editorial_guidelines': 'Pautas Editoriales',
    'footer.privacy': 'Privacidad',
    'footer.terms': 'Términos de servicio',
    'footer.cookies': 'Cookies',

    // Hero / Home
    'hero.title': 'Crítica Musical & Archivo Audiófilo',
    'hero.subtitle': 'Califica discos, descubre producciones en vinilo de 33⅓ RPM y comparte con una comunidad dedicada a la escucha atenta.',
    'hero.explore_btn': 'Explorar Catálogo',
    'hero.listen_btn': 'Escuchar Ahora',

    // Profile & Community & Reviews
    'profile.title': 'Mi Perfil',
    'profile.edit': 'Editar Perfil',
    'profile.saved': 'Guardados',
    'profile.reviews': 'Mis Reseñas',
    'profile.rewards': 'Recompensas & Boutique',
    'profile.parental': 'Control Parental',
    'community.title': 'Comunidad Audiófila',
    'community.subtitle': 'Conecta con melómanos y críticos de todo el mundo.',
    'reviews.title': 'Críticas del Mes & Análisis Líricos',
    'albums.title': 'Catálogo Audiófilo de Vinilos & Álbumes',

    // Auth
    'auth.welcome': '¡Hola de nuevo!',
    'auth.login_subtitle': 'Ingresa a tu cuenta de SONAR para continuar explorando la mejor música audiófila.',
    'auth.google_login': 'Continuar con Google',
    'auth.or_email': 'o ingresa con tu correo',
    'auth.email_label': 'Correo Electrónico',
    'auth.password_label': 'Contraseña',
    'auth.forgot_password': '¿Olvidaste tu contraseña?',
    'auth.enter_btn': 'Entrar a SONAR',
    'auth.no_account': '¿No tienes una cuenta?',
    'auth.create_account': 'Crear una cuenta',
    'auth.register_title': 'Únete a SONAR',
    'auth.register_subtitle': 'Crea tu cuenta y vive la mejor experiencia de escucha.',

    // Player & UI
    'player.now_playing': 'Reproduciendo ahora',
    'player.pause': 'Pausar',
    'player.play': 'Reproducir',
    'common.language': 'Idioma',
    'common.select_language': 'Seleccionar idioma',
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.close': 'Cerrar',
  },
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.explore': 'Explore',
    'nav.albums': 'Albums',
    'nav.reviews': 'Reviews',
    'nav.news': 'News',
    'nav.community': 'Community',
    'nav.podcasts': 'Podcasts',
    'nav.collections': 'Collections',
    'nav.profile': 'My Profile',
    'nav.admin': 'Administration',
    'nav.login': 'Sign In',
    'nav.register': 'Sign Up',
    'nav.logout': 'Sign Out',
    'nav.all': 'All',
    'nav.tracks': 'Songs',
    'nav.search_placeholder': 'Search by album, artist, or genre...',
    'nav.search_hint': 'Search songs, artists, or news…',
    'nav.accessibility': 'Accessibility',
    'nav.notifications': 'Notifications',

    // Footer
    'footer.tagline': 'Your sound journal was waiting for you.',
    'footer.curated': 'CURATED WITH AUDIOPHILE DISCERNMENT',
    'footer.rights': 'All rights reserved.',
    'footer.platform': 'Platform',
    'footer.explore_discs': 'Explore Records',
    'footer.reviews_month': 'Monthly Reviews',
    'footer.essential_lists': 'Essential Lists',
    'footer.community_audiophile': 'Audiophile Community',
    'footer.resources': 'Resources',
    'footer.collections_vinyl': 'Vinyl Collections',
    'footer.developer_api': 'Developer API',
    'footer.news_radar': 'News & Radar',
    'footer.blog': 'Sonar Blog',
    'footer.record_labels': 'Record Labels',
    'footer.legal_privacy': 'Legal & Privacy',
    'footer.about_sonar': 'About Sonar',
    'footer.terms_of_use': 'Terms of Use',
    'footer.editorial_guidelines': 'Editorial Guidelines',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.cookies': 'Cookies',

    // Hero / Home
    'hero.title': 'Music Criticism & Audiophile Archive',
    'hero.subtitle': 'Rate records, discover 33⅓ RPM vinyl productions and share with a community dedicated to attentive listening.',
    'hero.explore_btn': 'Explore Catalog',
    'hero.listen_btn': 'Listen Now',

    // Profile & Community & Reviews
    'profile.title': 'My Profile',
    'profile.edit': 'Edit Profile',
    'profile.saved': 'Saved',
    'profile.reviews': 'My Reviews',
    'profile.rewards': 'Rewards & Boutique',
    'profile.parental': 'Parental Control',
    'community.title': 'Audiophile Community',
    'community.subtitle': 'Connect with music lovers and critics worldwide.',
    'reviews.title': 'Monthly Reviews & Lyrical Analysis',
    'albums.title': 'Audiophile Vinyl & Album Catalog',

    // Auth
    'auth.welcome': 'Welcome back!',
    'auth.login_subtitle': 'Log in to your SONAR account to keep exploring audiophile quality music.',
    'auth.google_login': 'Continue with Google',
    'auth.or_email': 'or log in with your email',
    'auth.email_label': 'Email Address',
    'auth.password_label': 'Password',
    'auth.forgot_password': 'Forgot your password?',
    'auth.enter_btn': 'Enter SONAR',
    'auth.no_account': "Don't have an account?",
    'auth.create_account': 'Create an account',
    'auth.register_title': 'Join SONAR',
    'auth.register_subtitle': 'Create your account and experience premium listening.',

    // Player & UI
    'player.now_playing': 'Now Playing',
    'player.pause': 'Pause',
    'player.play': 'Play',
    'common.language': 'Language',
    'common.select_language': 'Select language',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
  },
  zh: {
    // Nav
    'nav.home': '首页',
    'nav.explore': '探索',
    'nav.albums': '专辑',
    'nav.reviews': '乐评',
    'nav.news': '资讯',
    'nav.community': '社区',
    'nav.podcasts': '播客',
    'nav.collections': '收藏',
    'nav.profile': '个人资料',
    'nav.admin': '后台管理',
    'nav.login': '登录',
    'nav.register': '注册',
    'nav.logout': '退出',
    'nav.all': '全部',
    'nav.tracks': '歌曲',
    'nav.search_placeholder': '按专辑、艺术家或流派搜索...',
    'nav.search_hint': '搜索歌曲、艺术家或新闻…',
    'nav.accessibility': '无障碍设置',
    'nav.notifications': '通知',

    // Footer
    'footer.tagline': '您的声音日志一直在等待着您。',
    'footer.curated': '以发烧友标准精选',
    'footer.rights': '保留所有权利。',
    'footer.platform': '平台',
    'footer.explore_discs': '探索唱片',
    'footer.reviews_month': '本月乐评',
    'footer.essential_lists': '精选歌单',
    'footer.community_audiophile': '发烧友社区',
    'footer.resources': '资源',
    'footer.collections_vinyl': '黑胶收藏',
    'footer.developer_api': '开发者 API',
    'footer.news_radar': '资讯与雷达',
    'footer.blog': 'Sonar 博客',
    'footer.record_labels': '厂牌目录',
    'footer.legal_privacy': '法律与隐私',
    'footer.about_sonar': '关于 Sonar',
    'footer.terms_of_use': '使用条款',
    'footer.editorial_guidelines': '编辑指南',
    'footer.privacy': '隐私政策',
    'footer.terms': '服务条款',
    'footer.cookies': 'Cookie 设置',

    // Hero / Home
    'hero.title': '乐评与发烧音乐档案',
    'hero.subtitle': '评价唱片，探索 33⅓ RPM 黑胶制作，与专业听众社区共享乐感。',
    'hero.explore_btn': '探索目录',
    'hero.listen_btn': '立即聆听',

    // Profile & Community & Reviews
    'profile.title': '个人资料',
    'profile.edit': '编辑个人资料',
    'profile.saved': '我的收藏',
    'profile.reviews': '我的乐评',
    'profile.rewards': '奖励与精品店',
    'profile.parental': '家长控制',
    'community.title': '发烧友社区',
    'community.subtitle': '与来自世界各地的爱乐者和影评人联系。',
    'reviews.title': '本月乐评与歌词分析',
    'albums.title': '发烧级黑胶与专辑目录',

    // Auth
    'auth.welcome': '欢迎回来！',
    'auth.login_subtitle': '登录您的 SONAR 帐户，继续探索高品质发烧音乐。',
    'auth.google_login': '使用 Google 账号登录',
    'auth.or_email': '或使用电子邮箱登录',
    'auth.email_label': '电子邮箱',
    'auth.password_label': '密码',
    'auth.forgot_password': '忘记密码？',
    'auth.enter_btn': '进入 SONAR',
    'auth.no_account': '还没有帐户？',
    'auth.create_account': '创建新帐户',
    'auth.register_title': '加入 SONAR',
    'auth.register_subtitle': '创建您的帐户，开启尊享听觉体验。',

    // Player & UI
    'player.now_playing': '正在播放',
    'player.pause': '暂停',
    'player.play': '播放',
    'common.language': '语言',
    'common.select_language': '选择语言',
    'common.loading': '加载中...',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.close': '关闭',
  },
  fr: {
    // Nav
    'nav.home': 'Accueil',
    'nav.explore': 'Explorer',
    'nav.albums': 'Albums',
    'nav.reviews': 'Critiques',
    'nav.news': 'Actualités',
    'nav.community': 'Communauté',
    'nav.podcasts': 'Podcasts',
    'nav.collections': 'Collections',
    'nav.profile': 'Mon Profil',
    'nav.admin': 'Administration',
    'nav.login': 'Se connecter',
    'nav.register': "S'inscrire",
    'nav.logout': 'Déconnexion',
    'nav.all': 'Tout',
    'nav.tracks': 'Chansons',
    'nav.search_placeholder': 'Rechercher par album, artiste ou genre...',
    'nav.search_hint': 'Rechercher des chansons, artistes ou actualités…',
    'nav.accessibility': 'Accessibilité',
    'nav.notifications': 'Notifications',

    // Footer
    'footer.tagline': 'Votre journal sonore vous attendait.',
    'footer.curated': 'EXIGENCES ET QUALITÉ AUDIOPHILE',
    'footer.rights': 'Tous droits réservés.',
    'footer.platform': 'Plateforme',
    'footer.explore_discs': 'Explorer les disques',
    'footer.reviews_month': 'Critiques du mois',
    'footer.essential_lists': 'Listes essentielles',
    'footer.community_audiophile': 'Communauté audiophile',
    'footer.resources': 'Ressources',
    'footer.collections_vinyl': 'Collections vinyle',
    'footer.developer_api': 'API Développeur',
    'footer.news_radar': 'Actualités & Radar',
    'footer.blog': 'Blog Sonar',
    'footer.record_labels': 'Répertoire des labels',
    'footer.legal_privacy': 'Mentions légales & Confidentialité',
    'footer.about_sonar': 'À propos de Sonar',
    'footer.terms_of_use': "Conditions d'utilisation",
    'footer.editorial_guidelines': 'Directives éditoriales',
    'footer.privacy': 'Confidentialité',
    'footer.terms': "Conditions d'utilisation",
    'footer.cookies': 'Cookies',

    // Hero / Home
    'hero.title': 'Critique Musicale & Archives Audiophiles',
    'hero.subtitle': 'Évaluez vos vinyles, découvrez des pressages 33⅓ RPM et échangez avec une communauté d’écoute exigeante.',
    'hero.explore_btn': 'Explorer le catalogue',
    'hero.listen_btn': 'Écouter maintenant',

    // Profile & Community & Reviews
    'profile.title': 'Mon Profil',
    'profile.edit': 'Modifier le profil',
    'profile.saved': 'Enregistrés',
    'profile.reviews': 'Mes critiques',
    'profile.rewards': 'Récompenses & Boutique',
    'profile.parental': 'Contrôle parental',
    'community.title': 'Communauté Audiophile',
    'community.subtitle': 'Connectez-vous avec des mélomanes du monde entier.',
    'reviews.title': 'Critiques du mois & Analyses lyriques',
    'albums.title': 'Catalogue Vinyles & Albums Audiophiles',

    // Auth
    'auth.welcome': 'Bon retour !',
    'auth.login_subtitle': 'Connectez-vous à votre compte SONAR pour poursuivre votre exploration musicale.',
    'auth.google_login': 'Continuer avec Google',
    'auth.or_email': 'ou connectez-vous par e-mail',
    'auth.email_label': 'Adresse e-mail',
    'auth.password_label': 'Mot de passe',
    'auth.forgot_password': 'Mot de passe oublié ?',
    'auth.enter_btn': 'Entrer dans SONAR',
    'auth.no_account': "Vous n'avez pas de compte ?",
    'auth.create_account': 'Créer un compte',
    'auth.register_title': 'Rejoignez SONAR',
    'auth.register_subtitle': 'Créez votre compte et vivez une expérience d’écoute exceptionnelle.',

    // Player & UI
    'player.now_playing': 'En lecture',
    'player.pause': 'Pause',
    'player.play': 'Lecture',
    'common.language': 'Langue',
    'common.select_language': 'Choisir la langue',
    'common.loading': 'Chargement...',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.close': 'Fermer',
  },
  it: {
    // Nav
    'nav.home': 'Home',
    'nav.explore': 'Esplora',
    'nav.albums': 'Album',
    'nav.reviews': 'Recensioni',
    'nav.news': 'Notizie',
    'nav.community': 'Comunità',
    'nav.podcasts': 'Podcast',
    'nav.collections': 'Collezioni',
    'nav.profile': 'Il Mio Profilo',
    'nav.admin': 'Amministrazione',
    'nav.login': 'Accedi',
    'nav.register': 'Registrati',
    'nav.logout': 'Esci',
    'nav.all': 'Tutto',
    'nav.tracks': 'Brani',
    'nav.search_placeholder': 'Cerca per album, artista o genere...',
    'nav.search_hint': 'Cerca brani, artisti o notizie…',
    'nav.accessibility': 'Accessibilità',
    'nav.notifications': 'Notifiche',

    // Footer
    'footer.tagline': 'Il tuo diario sonoro ti stava aspettando.',
    'footer.curated': 'CURATO CON CRITERIO AUDIOFILO',
    'footer.rights': 'Tutti i diritti riservati.',
    'footer.platform': 'Piattaforma',
    'footer.explore_discs': 'Esplora Dischi',
    'footer.reviews_month': 'Recensioni del Mese',
    'footer.essential_lists': 'Liste Essenziali',
    'footer.community_audiophile': 'Comunità Audiofila',
    'footer.resources': 'Risorse',
    'footer.collections_vinyl': 'Collezioni Vinile',
    'footer.developer_api': 'API per Sviluppatori',
    'footer.news_radar': 'Notizie & Radar',
    'footer.blog': 'Blog Sonar',
    'footer.record_labels': 'Elenco Etichette',
    'footer.legal_privacy': 'Note Legali & Privacy',
    'footer.about_sonar': 'Informazioni su Sonar',
    'footer.terms_of_use': "Termini d'Uso",
    'footer.editorial_guidelines': 'Linee Guida Editoriali',
    'footer.privacy': 'Informativa sulla Privacy',
    'footer.terms': 'Termini di Servizio',
    'footer.cookies': 'Cookie',

    // Hero / Home
    'hero.title': 'Critica Musicale & Archivio Audiofilo',
    'hero.subtitle': 'Valuta vinili, scopri produzioni a 33⅓ RPM e condividi con una comunità di ascoltatori attenti.',
    'hero.explore_btn': 'Esplora Catalogo',
    'hero.listen_btn': 'Ascolta Ora',

    // Profile & Community & Reviews
    'profile.title': 'Il Mio Profilo',
    'profile.edit': 'Modifica Profilo',
    'profile.saved': 'Salvati',
    'profile.reviews': 'Le Mie Recensioni',
    'profile.rewards': 'Premi & Boutique',
    'profile.parental': 'Controllo Genitori',
    'community.title': 'Comunità Audiofila',
    'community.subtitle': 'Connettiti con amanti della musica in tutto il mondo.',
    'reviews.title': 'Recensioni del Mese & Analisi Lirica',
    'albums.title': 'Catalogo Vinili & Album Audiofili',

    // Auth
    'auth.welcome': 'Bentornato!',
    'auth.login_subtitle': 'Accedi al tuo account SONAR per continuare ad ascoltare la musica migliore.',
    'auth.google_login': 'Continua con Google',
    'auth.or_email': 'o accedi con la tua email',
    'auth.email_label': 'Indirizzo Email',
    'auth.password_label': 'Password',
    'auth.forgot_password': 'Password dimenticata?',
    'auth.enter_btn': 'Entra in SONAR',
    'auth.no_account': 'Non hai un account?',
    'auth.create_account': 'Crea un account',
    'auth.register_title': 'Unisciti a SONAR',
    'auth.register_subtitle': 'Crea il tuo account per una straordinaria esperienza d’ascolto.',

    // Player & UI
    'player.now_playing': 'In riproduzione',
    'player.pause': 'Pausa',
    'player.play': 'Riproduci',
    'common.language': 'Lingua',
    'common.select_language': 'Seleziona lingua',
    'common.loading': 'Caricamento...',
    'common.save': 'Salva',
    'common.cancel': 'Annulla',
    'common.close': 'Chiudi',
  },
  ja: {
    // Nav
    'nav.home': 'ホーム',
    'nav.explore': '探索',
    'nav.albums': 'アルバム',
    'nav.reviews': 'レビュー',
    'nav.news': 'ニュース',
    'nav.community': 'コミュニティ',
    'nav.podcasts': 'ポッドキャスト',
    'nav.collections': 'コレクション',
    'nav.profile': 'マイプロフィール',
    'nav.admin': '管理者',
    'nav.login': 'ログイン',
    'nav.register': '新規登録',
    'nav.logout': 'ログアウト',
    'nav.all': 'すべて',
    'nav.tracks': '楽曲',
    'nav.search_placeholder': 'アルバム、アーティスト、ジャンルで検索...',
    'nav.search_hint': '楽曲、アーティスト、ニュースを検索…',
    'nav.accessibility': 'アクセシビリティ',
    'nav.notifications': '通知',

    // Footer
    'footer.tagline': 'あなたのサウンドジャーナルが待っていました。',
    'footer.curated': 'オーディオファイル基準による厳選コレクション',
    'footer.rights': 'All rights reserved.',
    'footer.platform': 'プラットフォーム',
    'footer.explore_discs': 'レコードを探索',
    'footer.reviews_month': '今月のレビュー',
    'footer.essential_lists': '必听リスト',
    'footer.community_audiophile': 'オーディオファイルコミュニティ',
    'footer.resources': 'リソース',
    'footer.collections_vinyl': 'ヴァイナルコレクション',
    'footer.developer_api': '開発者API',
    'footer.news_radar': 'ニュース＆レーダー',
    'footer.blog': 'Sonarブログ',
    'footer.record_labels': 'レーベルディレクトリ',
    'footer.legal_privacy': '法的情報とプライバシー',
    'footer.about_sonar': 'Sonarについて',
    'footer.terms_of_use': '利用規約',
    'footer.editorial_guidelines': '編集ガイドライン',
    'footer.privacy': 'プライバシーポリシー',
    'footer.terms': '利用規約',
    'footer.cookies': 'クッキー設定',

    // Hero / Home
    'hero.title': '音楽レビュー ＆ オーディオファイルアーカイブ',
    'hero.subtitle': 'レコードを評価し、33⅓ RPMのLPレコード作品を発見し、リスナーコミュニティと共有しましょう。',
    'hero.explore_btn': 'カタログを探索',
    'hero.listen_btn': '今すぐ聴く',

    // Profile & Community & Reviews
    'profile.title': 'マイプロフィール',
    'profile.edit': 'プロフィール編集',
    'profile.saved': '保存済み',
    'profile.reviews': 'マイレビュー',
    'profile.rewards': '特典＆ブティック',
    'profile.parental': 'ペアレンタルコントロール',
    'community.title': 'オーディオファイルコミュニティ',
    'community.subtitle': '世界中の音楽ファンとつながりましょう。',
    'reviews.title': '今月のレビュー＆歌詞分析',
    'albums.title': 'オーディオファイルLP＆アルバムカタログ',

    // Auth
    'auth.welcome': 'おかえりなさい！',
    'auth.login_subtitle': 'SONARアカウントにログインして、究極の音楽体験を続けましょう。',
    'auth.google_login': 'Googleでログイン',
    'auth.or_email': 'またはメールアドレスでログイン',
    'auth.email_label': 'メールアドレス',
    'auth.password_label': 'パスワード',
    'auth.forgot_password': 'パスワードをお忘れですか？',
    'auth.enter_btn': 'SONARに入る',
    'auth.no_account': 'アカウントをお持ちではありませんか？',
    'auth.create_account': 'アカウントを作成',
    'auth.register_title': 'SONARに参加',
    'auth.register_subtitle': 'アカウントを作成して、プレミアムなリスニング体験を。',

    // Player & UI
    'player.now_playing': '再生中',
    'player.pause': '一時停止',
    'player.play': '再生',
    'common.language': '言語',
    'common.select_language': '言語を選択',
    'common.loading': '読み込み中...',
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.close': '閉じる',
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('sonar_language') || 'es';
  });

  const changeLanguage = (langCode) => {
    if (TRANSLATIONS[langCode]) {
      setCurrentLang(langCode);
      localStorage.setItem('sonar_language', langCode);
      document.documentElement.lang = langCode;
      window.dispatchEvent(new CustomEvent('sonar:language-changed', { detail: langCode }));
    }
  };

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const t = (key, fallback = '') => {
    const langDict = TRANSLATIONS[currentLang] || TRANSLATIONS.es;
    if (langDict[key] !== undefined) {
      return langDict[key];
    }
    const defaultDict = TRANSLATIONS.es;
    return defaultDict[key] !== undefined ? defaultDict[key] : fallback || key;
  };

  const currentLanguageObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ currentLang, changeLanguage, t, languages: LANGUAGES, currentLanguageObj }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
