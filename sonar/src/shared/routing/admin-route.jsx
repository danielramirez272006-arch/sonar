import { Navigate, Outlet } from 'react-router-dom';
import { useUIText } from '../i18n/use-ui-text.js';
import { useAuth } from '../context/auth-context';

/**
 * Protege rutas exclusivas del rol `admin` (rol almacenado en db.json).
 * - Sin sesión: redirige a `/login`.
 * - Con sesión pero sin rol admin: redirige al panel del usuario (`/usuario`).
 * Un `fallback` explícito reemplaza ambas redirecciones.
 */
export const AdminRoute = ({ children, fallback }) => {
  const ui = useUIText();
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-sonar-base text-sonar-text">{ui("Cargando permisos...")}</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    if (fallback !== undefined) return fallback;
    return <Navigate to={isAuthenticated ? '/usuario' : '/login'} replace />;
  }

  return children ?? <Outlet />;
};

export default AdminRoute;
