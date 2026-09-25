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
    'nav.profile': 'Mi Perfil',
    'nav.admin': 'Administración',
    'nav.login': 'Iniciar Sesión',
    'nav.register': 'Registrarse',
    'nav.logout': 'Cerrar Sesión',
    'nav.search_placeholder': 'Buscar por álbum, artista o género...',
    'nav.accessibility': 'Accesibilidad',
    'nav.notifications': 'Notificaciones',
    
    // Footer
    'footer.tagline': 'Tu diario sonoro te estaba esperando.',
    'footer.curated': 'CURADO CON CRITERIO AUDIÓFILO',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.nav_title': 'Navegación',
    'footer.legal_title': 'Legal y Términos',
    'footer.privacy': 'Privacidad',
    'footer.terms': 'Términos de servicio',
    'footer.cookies': 'Cookies',

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

    // Common / UI
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
    'nav.profile': 'My Profile',
    'nav.admin': 'Administration',
    'nav.login': 'Sign In',
    'nav.register': 'Sign Up',
    'nav.logout': 'Sign Out',
    'nav.search_placeholder': 'Search by album, artist, or genre...',
    'nav.accessibility': 'Accessibility',
    'nav.notifications': 'Notifications',

    // Footer
    'footer.tagline': 'Your sound journal was waiting for you.',
    'footer.curated': 'CURATED WITH AUDIOPHILE DISCERNMENT',
    'footer.rights': 'All rights reserved.',
    'footer.nav_title': 'Navigation',
    'footer.legal_title': 'Legal & Terms',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.cookies': 'Cookies',

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

    // Common / UI
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
    'nav.profile': '个人资料',
    'nav.admin': '后台管理',
    'nav.login': '登录',
    'nav.register': '注册',
    'nav.logout': '退出',
    'nav.search_placeholder': '按专辑、艺术家或流派搜索...',
    'nav.accessibility': '无障碍设置',
    'nav.notifications': '通知',

    // Footer
    'footer.tagline': '您的声音日志一直在等待着您。',
    'footer.curated': '以发烧友标准精选',
    'footer.rights': '保留所有权利。',
    'footer.nav_title': '导航',
    'footer.legal_title': '法律与条款',
    'footer.privacy': '隐私政策',
    'footer.terms': '服务条款',
    'footer.cookies': 'Cookie 设置',

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

    // Common / UI
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
    'nav.profile': 'Mon Profil',
    'nav.admin': 'Administration',
    'nav.login': 'Se connecter',
    'nav.register': "S'inscrire",
    'nav.logout': 'Déconnexion',
    'nav.search_placeholder': 'Rechercher par album, artiste ou genre...',
    'nav.accessibility': 'Accessibilité',
    'nav.notifications': 'Notifications',

    // Footer
    'footer.tagline': 'Votre journal sonore vous attendait.',
    'footer.curated': 'EXIGENCES ET QUALITÉ AUDIOPHILE',
    'footer.rights': 'Tous droits réservés.',
    'footer.nav_title': 'Navigation',
    'footer.legal_title': 'Mentions légales',
    'footer.privacy': 'Confidentialité',
    'footer.terms': "Conditions d'utilisation",
    'footer.cookies': 'Cookies',

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

    // Common / UI
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
    'nav.profile': 'Il Mio Profilo',
    'nav.admin': 'Amministrazione',
    'nav.login': 'Accedi',
    'nav.register': 'Registrati',
    'nav.logout': 'Esci',
    'nav.search_placeholder': 'Cerca per album, artista o genere...',
    'nav.accessibility': 'Accessibilità',
    'nav.notifications': 'Notifiche',

    // Footer
    'footer.tagline': 'Il tuo diario sonoro ti stava aspettando.',
    'footer.curated': 'CURATO CON CRITERIO AUDIOFILO',
    'footer.rights': 'Tutti i diritti riservati.',
    'footer.nav_title': 'Navigazione',
    'footer.legal_title': 'Note Legali',
    'footer.privacy': 'Informativa sulla Privacy',
    'footer.terms': 'Termini di Servizio',
    'footer.cookies': 'Cookie',

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

    // Common / UI
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
    'nav.profile': 'マイプロフィール',
    'nav.admin': '管理者',
    'nav.login': 'ログイン',
    'nav.register': '新規登録',
    'nav.logout': 'ログアウト',
    'nav.search_placeholder': 'アルバム、アーティスト、ジャンルで検索...',
    'nav.accessibility': 'アクセシビリティ',
    'nav.notifications': '通知',

    // Footer
    'footer.tagline': 'あなたのサウンドジャーナルが待っていました。',
    'footer.curated': 'オーディオファイル基準による厳選コレクション',
    'footer.rights': 'All rights reserved.',
    'footer.nav_title': 'ナビゲーション',
    'footer.legal_title': '法的情報',
    'footer.privacy': 'プライバシーポリシー',
    'footer.terms': '利用規約',
    'footer.cookies': 'クッキー設定',

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

    // Common / UI
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
