import React from 'react';
import { useAuth } from '../context/auth-context';

export const AdminRoute = ({ children, fallback = null }) => {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return fallback;
  }

  return <>{children}</>;
};

export default AdminRoute;
