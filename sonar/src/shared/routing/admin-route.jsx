import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // 1. Mientras valida la sesión, mostramos un estado de carga (opcional pero recomendado)
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-sonar-base text-sonar-text">Cargando permisos...</div>;
  }

  // 2. Si no hay usuario autenticado o no tiene el rol de 'admin', lo expulsamos al inicio
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 3. Si es admin, renderiza los componentes hijos o las sub-rutas (Outlet)
  return children ? children : <Outlet />;
}
