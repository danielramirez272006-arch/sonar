import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

/**
 * Protege rutas que requieren sesión iniciada.
 * - Como ruta de diseño (`<Route element={<PrivateRoute />}>`) renderiza `<Outlet />`.
 * - Como envoltorio (`<PrivateRoute>{children}</PrivateRoute>`) renderiza sus hijos.
 * Sin sesión redirige a `/login`, salvo que se indique un `fallback`.
 */
export const PrivateRoute = ({ children, fallback, redirectTo = '/login' }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated && !user) {
    return fallback ?? <Navigate to={redirectTo} replace />;
  }

  return children ?? <Outlet />;
};

export default PrivateRoute;
