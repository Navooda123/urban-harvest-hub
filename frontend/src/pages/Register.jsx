import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, AlertCircle, Sprout, Shield } from 'lucide-react';

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member'); // default to member, can switch to admin for dev testing
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await register(name, email, password, role);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/products');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Email might already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-800 p-6 sm:p-8 border border-slate-205 dark:border-slate-700 rounded-3xl shadow-md">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2 rounded-xl bg-eco-green/10 text-eco-green">
            <Sprout className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-850 dark:text-white tracking-tight">
            {t('auth.register_title')}
          </h1>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-455 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field */}
          <div className="space-y-1">
            <label htmlFor="name" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('auth.name_label')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="h-4.5 w-4.5 text-slate-450" />
              </div>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-250 dark:border-slate-755 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-eco-green text-sm"
              />
            </div>
          </div>

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
                <Lock className="h-4.5 w-4.5 text-slate-455" />
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

          {/* Role selector (useful for testing) */}
          <div className="space-y-1">
            <label htmlFor="role" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('auth.role_label')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Shield className="h-4.5 w-4.5 text-slate-450" />
              </div>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-250 dark:border-slate-755 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-eco-green text-sm cursor-pointer"
              >
                <option value="member">{t('auth.member_option')}</option>
                <option value="admin">{t('auth.admin_option')}</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-eco w-full cursor-pointer mt-4"
          >
            {loading ? '...' : t('auth.submit_register')}
          </button>
        </form>

        <div className="text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-750 pt-4">
          <span>{t('auth.have_account')} </span>
          <Link to="/login" className="text-eco-green hover:underline font-semibold focus:outline-none">
            {t('auth.login_now')}
          </Link>
        </div>

      </div>
    </main>
  );
}
