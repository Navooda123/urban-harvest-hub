import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, Sprout } from 'lucide-react';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login(email, password);
      // Redirect to original destination or fallback by role
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/products');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-800 p-6 sm:p-8 border border-slate-205 dark:border-slate-700 rounded-3xl shadow-md">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2 rounded-xl bg-eco-green/10 text-eco-green">
            <Sprout className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-850 dark:text-white tracking-tight">
            {t('auth.login_title')}
          </h1>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-450 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('auth.email_label')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4.5 w-4.5 text-slate-450" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-250 dark:border-slate-755 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-eco-green text-sm"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <label htmlFor="password" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('auth.password_label')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4.5 w-4.5 text-slate-450" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-250 dark:border-slate-755 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white placeholder-slate-455 focus:outline-none focus:ring-2 focus:ring-eco-green text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-eco w-full cursor-pointer mt-4"
          >
            {loading ? '...' : t('auth.submit_login')}
          </button>
        </form>

        <div className="text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-750 pt-4">
          <span>{t('auth.no_account')} </span>
          <Link to="/register" className="text-eco-green hover:underline font-semibold focus:outline-none">
            {t('auth.register_now')}
          </Link>
        </div>

      </div>
    </main>
  );
}
