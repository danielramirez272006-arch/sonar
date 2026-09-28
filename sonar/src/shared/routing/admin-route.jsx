import { useUIText } from '../i18n/use-ui-text.js';
import { useAuth } from '../context/auth-context';

export const AdminRoute = ({ children, fallback = null }) => {
  const ui = useUIText();
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-sonar-base text-sonar-text">{ui("Cargando permisos...")}</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return fallback;
  }

  return children;
};

export default AdminRoute;
