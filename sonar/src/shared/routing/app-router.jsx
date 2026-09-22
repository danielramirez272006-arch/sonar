import React, { useState, useEffect, createContext, useContext } from 'react';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '../components/ui/page-transition';

// Páginas Públicas
import HomePage from '../../pages/public/home-page';
import LoginPage from '../../pages/public/login-page';
import RegisterPage from '../../pages/public/register-page';
import CommunityPage from '../../pages/public/community-page';
import AlbumDetailPage from '../../pages/public/album-detail-page';
import AboutPage from '../../pages/public/about-page';
import TermsPage from '../../pages/public/terms-page';
import NotFoundPage from '../../pages/public/not-found-page';

// Páginas de Usuario y Administración
import UserDashboardPage from '../../pages/user/user-dashboard-page';
import AdminDashboardPage from '../../pages/admin/admin-dashboard-page.jsx';
import { AdminConsole } from '../../App';
import AdminRoute from './admin-route';

// Contexto de Navegación Liviano
const RouterContext = createContext({
  currentPath: '/',
  navigate: () => {},
});

export const useRouter = () => useContext(RouterContext);

export const AppRouter = () => {
  const [currentPath, setCurrentPath] = useState(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || window.location.pathname || '/';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
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
      window.location.hash = `#${path.replace(/^\//, '')}`;
    }
    setCurrentPath(path.replace(/^[#/]/, ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Selector dinámico de componentes por ruta
  const renderCurrentPage = () => {
    const rawPath = currentPath.toLowerCase().replace(/^\//, '');

    if (rawPath === '' || rawPath === 'explore' || rawPath === 'home') {
      return <HomePage />;
    }
    if (rawPath === 'login') {
      return <LoginPage />;
    }
    if (rawPath === 'register') {
      return <RegisterPage />;
    }
    if (rawPath === 'community') {
      return <CommunityPage />;
    }
    if (rawPath.startsWith('album')) {
      return <AlbumDetailPage />;
    }
    if (rawPath === 'about') {
      return <AboutPage />;
    }
    if (rawPath === 'terms') {
      return <TermsPage />;
    }
    if (rawPath === 'profile' || rawPath === 'user-dashboard' || rawPath === 'saved') {
      return <UserDashboardPage />;
    }
    if (rawPath.startsWith('admin') || rawPath.startsWith('dashboard') || rawPath.startsWith('moderacion')) {
      return (
        <AdminRoute>
          <AdminConsole />
        </AdminRoute>
      );
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
