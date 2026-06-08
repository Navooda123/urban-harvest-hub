import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import Home from './pages/Home';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Book from './pages/Book';
import Subscribe from './pages/Subscribe';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import { WifiOff } from 'lucide-react';
import './App.css';

function AppContent() {
  const { t } = useTranslation();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">

      {/* Offline Status Banner */}
      {isOffline && (
        <div
          className="bg-amber-500 text-white text-xs font-bold text-center py-2 px-4 flex items-center justify-center space-x-2 shadow-sm animate-pulse sticky top-0 z-50"
          role="alert"
          aria-live="assertive"
        >
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>{t('pwa.offline_alert')}</span>
        </div>
      )}

      <Navbar />

      {/* Page Routing Views */}
      <div className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:category" element={<CategoryDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected member routes (must be authenticated) */}
          <Route
            path="/book/:id"
            element={
              <ProtectedRoute>
                <Book />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscribe"
            element={
              <ProtectedRoute>
                <Subscribe />
              </ProtectedRoute>
            }
          />

          {/* Protected admin route (must be admin role) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <main className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-4">
                <p className="text-6xl font-extrabold text-eco-green">404</p>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Page Not Found</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  The page you're looking for doesn't exist or has been moved.
                </p>
                <a href="/" className="btn-eco mt-2">Back to Home</a>
              </main>
            }
          />
        </Routes>
      </div>

      <Footer />

      {/* PWA Install Prompt — shows after 3s on supported mobile browsers */}
      <PWAInstallPrompt />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
