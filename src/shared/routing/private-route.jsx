import React from 'react';
import { useAuth } from '../context/auth-context';

export const PrivateRoute = ({ children, fallback = null }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated && !user) {
    return fallback;
  }

  return <>{children}</>;
};

export default PrivateRoute;
