import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminPanel from '../components/AdminPanel';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function Admin() {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green mx-auto mb-4" />
        Loading...
      </div>
    );
  }

  // 1. If not authenticated at all, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. If authenticated but not an admin, display access denied page
  if (!isAdmin) {
    return (
      <main className="max-w-md mx-auto px-4 py-24 text-center space-y-5" aria-labelledby="denied-heading">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-950/20 text-red-650 dark:text-red-400 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-9 h-9" />
        </div>
        <h1 id="denied-heading" className="text-2xl font-extrabold text-slate-850 dark:text-white tracking-tight">
          Access Denied
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          You do not have administrative privileges to access this area. If you believe this is an error, please log in with an administrator account.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-slate-205 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850 focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  // 3. Otherwise render admin dashboard panel
  return (
    <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <AdminPanel />
    </main>
  );
}
