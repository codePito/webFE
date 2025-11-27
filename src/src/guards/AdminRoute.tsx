import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
interface AdminRouteProps {
  children: React.ReactNode;
}
export function AdminRoute({
  children
}: AdminRouteProps) {
  const {
    isAuthenticated,
    isAdmin
  } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=admin" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}