import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { usePageScroll } from './use-page-scroll.js';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '../components/ui/page-transition';
import { ErrorBoundary } from '../components/ui/error-boundary';
import { catalogTypes } from '../services/catalog-service.js';

// Páginas Públicas
import HomePage from '../../pages/public/home-page';
import LoginPage from '../../pages/public/login-page';
import RegisterPage from '../../pages/public/register-page';
import ForgotPasswordPage from '../../pages/public/forgot-password-page';
import CommunityPage from '../../pages/public/community-page';
import AlbumDetailPage from '../../pages/public/album-detail-page';
import AboutPage from '../../pages/public/about-page';
import TermsPage from '../../pages/public/terms-page';
import NotFoundPage from '../../pages/public/not-found-page';
import ReviewsFeedPage from '../../pages/public/reviews-feed-page';
import CuratedListsPage from '../../pages/public/curated-lists-page';
import VinylCollectionsPage from '../../pages/public/vinyl-collections-page';
import DeveloperApiPage from '../../pages/public/developer-api-page';
import BlogPage from '../../pages/public/blog-page';
import RecordLabelsPage from '../../pages/public/record-labels-page';
import EditorialGuidelinesPage from '../../pages/public/editorial-guidelines-page';
import PodcastsPage from '../../pages/public/podcasts-page';
import NewsPage from '../../pages/public/news-page';
import VinylModePage from '../../pages/public/vinyl-mode-page';
import RssPage from '../../pages/public/rss-page';

// Páginas de Usuario y Administración
import UserDashboardPage from '../../pages/user/user-dashboard-page';
import ProfileSettingsPage from '../../pages/user/profile-settings-page';
import { AdminConsole } from '../../App';
import PrivateRoute from './private-route';
import AdminRoute from './admin-route';

/**
 * Tabla de rutas de la aplicación.
 * Cada entrada declara las URL (incluidos alias en español) y la página que renderiza.
 * Se usa con HashRouter, por lo que `#login` y `#/login` resuelven a la misma ruta.
 */
export const PUBLIC_ROUTES = [
  { paths: ['/', 'explore', 'home'], Page: HomePage },
  { paths: ['login'], Page: LoginPage },
  { paths: ['register'], Page: RegisterPage },
  { paths: ['forgot-password', 'recuperar-password', 'recuperar-contrasena', 'reset-password'], Page: ForgotPasswordPage },
  { paths: ['community'], Page: CommunityPage },
  { paths: ['reviews', 'criticas'], Page: ReviewsFeedPage },
  { paths: ['lists', 'listas'], Page: CuratedListsPage },
  { paths: ['collections', 'colecciones'], Page: VinylCollectionsPage },
  { paths: ['blog'], Page: BlogPage },
  { paths: ['labels', 'sellos'], Page: RecordLabelsPage },
  { paths: ['guidelines', 'pautas'], Page: EditorialGuidelinesPage },
  { paths: ['podcasts', 'podcast'], Page: PodcastsPage },
  { paths: ['noticias', 'news', 'radar'], Page: NewsPage },
  { paths: ['album', 'vinyl', 'tocadiscos'], Page: VinylModePage },
  { paths: ['album/:albumId'], Page: AlbumDetailPage },
  { paths: ['rss_feed', 'rss', 'feed'], Page: RssPage },
  { paths: ['about'], Page: AboutPage },
  { paths: ['terms'], Page: TermsPage },
];

/** Rutas privadas: requieren sesión iniciada (cualquier rol). */
export const PRIVATE_ROUTES = [
  { paths: ['profile-settings', 'perfil/configuracion', 'configuracion', 'ajustes'], Page: ProfileSettingsPage },
  { paths: ['usuario', 'profile', 'user-dashboard', 'saved'], Page: UserDashboardPage },
];

/** Rutas de administración: requieren sesión con rol `admin` (definido en db.json). */
export const ADMIN_ROUTES = [
  { paths: ['api', 'developers'], Page: DeveloperApiPage },
  {
    // La consola resuelve internamente la sección activa a partir de la URL.
    paths: [
      'admin/*', 'dashboard/*', 'moderacion', 'usuarios',
      'admin-reports', 'admin-reviews', 'admin-ai', 'admin-hub', 'sonar-ai', 'ai-assistant',
      ...Object.keys(catalogTypes).map(type => `admin-catalog-${type}`),
    ],
    Page: AdminConsole,
  },
];

const renderRoutes = routes => routes.flatMap(({ paths, Page }) =>
  paths.map(path => <Route key={path} path={path} element={<Page />} />),
);

// Contexto de navegación conservado por compatibilidad con componentes existentes.
const RouterContext = createContext({
  currentPath: '/',
  navigate: (path) => { window.location.hash = `#${String(path).replace(/^[#/]+/, '')}`; },
});

export const useRouter = () => useContext(RouterContext);

/** Convierte el hash actual (`#login`, `#/login?x=1`) en una ruta de React Router. */
const hashToPath = () => `/${window.location.hash.replace(/^#\/?/, '')}`;

export const AppRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentKey = `${location.pathname}${location.search}`;
  const latestKey = useRef(currentKey);
  usePageScroll(location.pathname);

  // Varios componentes escuchan `hashchange`. React Router navega con la History API,
  // que no emite ese evento, así que se notifica cada cambio de ruta.
  useEffect(() => {
    if (latestKey.current === currentKey) return;
    latestKey.current = currentKey;
    window.dispatchEvent(new Event('hashchange'));
  }, [currentKey]);

  // Si el hash cambia sin `popstate` (p. ej. history.replaceState), se sincroniza el router.
  useEffect(() => {
    let timer = null;
    const syncFromHash = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const target = hashToPath();
        if (target !== latestKey.current) navigate(target, { replace: true });
      }, 0);
    };
    window.addEventListener('hashchange', syncFromHash);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, [navigate]);

  const routerValue = useMemo(() => ({
    currentPath: location.pathname.replace(/^\//, ''),
    navigate: (path) => navigate(`/${String(path).replace(/^[#/]+/, '')}`),
  }), [location.pathname, navigate]);

  return (
    <RouterContext.Provider value={routerValue}>
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <ErrorBoundary key={location.pathname}>
            <Routes location={location}>
              {/* Rutas públicas */}
              {renderRoutes(PUBLIC_ROUTES)}

              {/* Rutas privadas: cualquier usuario autenticado */}
              <Route element={<PrivateRoute />}>
                {renderRoutes(PRIVATE_ROUTES)}
              </Route>

              {/* Rutas privadas: solo administradores */}
              <Route element={<AdminRoute />}>
                {renderRoutes(ADMIN_ROUTES)}
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ErrorBoundary>
        </PageTransition>
      </AnimatePresence>
    </RouterContext.Provider>
  );
};

export default AppRouter;
