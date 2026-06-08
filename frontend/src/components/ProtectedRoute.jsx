import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protects a route behind authentication.
 * @param {string} [requiredRole] - Optional role ('admin') required to access this route.
 * @param {string} [redirectTo='/login'] - Where to redirect if auth check fails.
 */
export default function ProtectedRoute({ children, requiredRole, redirectTo = '/login' }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Wait until the auth context has resolved the token
  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4"
        aria-busy="true"
        aria-label="Checking authentication…"
      >
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-eco-green" />
        <span className="text-sm font-medium">Checking access…</span>
      </div>
    );
  }

  // Not authenticated — redirect to login, preserving the intended URL
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Authenticated but wrong role — show access denied redirect
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
