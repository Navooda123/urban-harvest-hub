import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Sun, Moon, Globe, LogOut, Menu, X, Sprout, User, ShieldCheck } from 'lucide-react';
import PushNotificationButton from './PushNotificationButton';

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/categories', label: t('nav.categories') },
    { path: '/products', label: t('nav.products') },
    { path: '/subscribe', label: t('nav.subscribe') }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 shadow-sm" aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-eco-green hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-eco-green rounded-md p-1" aria-label="Urban Harvest Hub Home">
              <Sprout className="w-8 h-8 animate-bounce" style={{ animationDuration: '3s' }} />
              <span className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-white">
                Urban<span className="text-eco-green">Harvest</span>Hub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-eco-green ${
                  isActive(link.path)
                    ? 'bg-eco-green/10 text-eco-green dark:bg-eco-green/20'
                    : 'text-slate-650 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-350 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-eco-green ${
                  isActive('/admin')
                    ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                    : 'text-amber-650 hover:bg-amber-50 dark:text-amber-400/90 dark:hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4 mr-1" />
                {t('nav.admin')}
              </Link>
            )}
          </div>

          {/* User & Settings Panel */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Language Switcher */}
            <button
              onClick={() => changeLanguage(language === 'en' ? 'es' : 'en')}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 focus:outline-none focus:ring-2 focus:ring-eco-green cursor-pointer"
              title="Switch language"
              aria-label="Switch Language"
            >
              <div className="flex items-center text-xs font-bold uppercase tracking-wider">
                <Globe className="w-4 h-4 mr-1" />
                {language === 'en' ? 'ES' : 'EN'}
              </div>
            </button>

            {/* Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 focus:outline-none focus:ring-2 focus:ring-eco-green cursor-pointer"
              title={t('nav.toggle_theme')}
              aria-label={t('nav.toggle_theme')}
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Push Notifications for logged-in users */}
            {isAuthenticated && <PushNotificationButton compact />}

            {/* Auth Buttons */}
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2" />
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <User className="w-4 h-4 mr-1 text-eco-green" />
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 dark:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-eco-green transition-colors focus:outline-none focus:ring-2 focus:ring-eco-green rounded-lg"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="btn-eco !py-2"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={() => changeLanguage(language === 'en' ? 'es' : 'en')}
              className="p-1 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase"
              aria-label="Switch Language"
            >
              {language === 'en' ? 'ES' : 'EN'}
            </button>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label={t('nav.toggle_theme')}
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-eco-green cursor-pointer"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-eco-green/10 text-eco-green'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  isActive('/admin')
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-350 dark:hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-5 h-5 mr-1" />
                {t('nav.admin')}
              </Link>
            )}
          </div>
          <div className="pt-4 pb-4 border-t border-slate-200 dark:border-slate-800 px-4">
            {isAuthenticated && (
              <div className="mb-3">
                <PushNotificationButton compact={false} />
              </div>
            )}
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center text-base font-semibold text-slate-850 dark:text-slate-200">
                  <User className="w-5 h-5 mr-2 text-eco-green" />
                  {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-2 border border-slate-200 dark:border-slate-700 text-base font-medium rounded-lg text-red-650 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 cursor-pointer"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center px-4 py-2 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-lg text-center"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center px-4 py-2 text-base font-medium text-white bg-eco-green rounded-lg text-center font-semibold"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
