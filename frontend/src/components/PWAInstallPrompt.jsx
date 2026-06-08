import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

/**
 * PWA Install Prompt — intercepts the browser's beforeinstallprompt event
 * and surfaces a polished, branded install banner for mobile users.
 */
export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const dismissed = sessionStorage.getItem('pwa-install-dismissed');
    if (dismissed) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show banner after a brief delay so it doesn't clash with page load
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowBanner(false);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pwa-install-dismissed', 'true');
    setShowBanner(false);
  };

  if (!showBanner || installed) return null;

  return (
    <div
      role="banner"
      aria-label="Install Urban Harvest Hub as an app"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm animate-slide-down"
    >
      <div className="bg-slate-900 border border-eco-green/30 rounded-2xl shadow-2xl shadow-black/40 p-4 flex items-center space-x-4">
        {/* Icon */}
        <div className="w-10 h-10 bg-eco-green/15 rounded-xl flex items-center justify-center shrink-0">
          <Smartphone className="w-5 h-5 text-eco-green" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-tight">Install the App</p>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            Add Urban Harvest Hub to your home screen for offline access.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleInstall}
            className="flex items-center px-3 py-1.5 bg-eco-green text-white text-xs font-bold rounded-lg hover:bg-eco-green/90 transition-colors focus:outline-none focus:ring-2 focus:ring-eco-green cursor-pointer"
            aria-label="Install app"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 text-slate-500 hover:text-white transition-colors focus:outline-none rounded-lg cursor-pointer"
            aria-label="Dismiss install prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
