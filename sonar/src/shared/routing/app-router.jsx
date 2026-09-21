import React, { useState, useEffect, createContext, useContext } from 'react';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '../components/ui/page-transition';

// Páginas del Proyecto Sonar
import HomePage from '../../pages/public/home-page';
import LoginPage from '../../pages/public/login-page';
import CommunityPage from '../../pages/public/community-page';
import AlbumDetailPage from '../../pages/public/album-detail-page';
import UserDashboardPage from '../../pages/user/user-dashboard-page';
import AdminDashboardPage from '../../pages/admin/admin-dashboard-page';
import NotFoundPage from '../../pages/public/not-found-page';

// Contexto de Navegación Liviano
const RouterContext = createContext({
  currentPath: '/',
  navigate: () => {},
});

export const useRouter = () => useContext(RouterContext);

export const AppRouter = () => {
  const [currentPath, setCurrentPath] = useState(() => {
    // Soporte tanto para hash routing como para path routing
    const hash = window.location.hash.replace('#', '');
    return hash || window.location.pathname || '/';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentPath(hash || window.location.pathname || '/');
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (path) => {
    if (path.startsWith('#')) {
      window.location.hash = path;
    } else {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path.replace('#', ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Selector dinámico de componentes por ruta
  const renderCurrentPage = () => {
    const normalizedPath = currentPath.toLowerCase();

    if (normalizedPath === '/' || normalizedPath === '' || normalizedPath === 'explore' || normalizedPath === '/explore') {
      return <HomePage />;
    }
    if (normalizedPath === '/login' || normalizedPath === 'login') {
      return <LoginPage />;
    }
    if (normalizedPath === '/community' || normalizedPath === 'community') {
      return <CommunityPage />;
    }
    if (normalizedPath.startsWith('/album') || normalizedPath.startsWith('album')) {
      return <AlbumDetailPage />;
    }
    if (normalizedPath === '/dashboard' || normalizedPath === 'dashboard' || normalizedPath === '/profile' || normalizedPath === 'profile') {
      return <UserDashboardPage />;
    }
    if (normalizedPath === '/admin' || normalizedPath === 'admin') {
      return <AdminDashboardPage />;
    }

    return <NotFoundPage />;
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      <AnimatePresence mode="wait">
        <PageTransition key={currentPath}>
          {renderCurrentPage()}
        </PageTransition>
      </AnimatePresence>
    </RouterContext.Provider>
  );
};

export default AppRouter;
