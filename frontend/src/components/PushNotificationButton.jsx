import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { usePushNotification } from '../hooks/usePushNotification';

export default function PushNotificationButton({ compact = false }) {
  const { t } = useTranslation();
  const { isSupported, isSubscribed, subscribeUser, loading, error } = usePushNotification();

  if (!isSupported) return null;

  if (compact) {
    return (
      <button
        onClick={subscribeUser}
        disabled={loading || isSubscribed}
        className={`p-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-eco-green cursor-pointer ${
          isSubscribed
            ? 'text-eco-green bg-eco-green/10 dark:bg-eco-green/20'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
        title={isSubscribed ? 'Notifications enabled' : t('pwa.notification_allow')}
        aria-label={isSubscribed ? 'Push notifications enabled' : t('pwa.notification_allow')}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isSubscribed ? (
          <Bell className="w-5 h-5" />
        ) : (
          <BellOff className="w-5 h-5" />
        )}
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={subscribeUser}
        disabled={loading || isSubscribed}
        className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-eco-green cursor-pointer ${
          isSubscribed
            ? 'bg-eco-green/10 text-eco-green border border-eco-green/20 dark:bg-eco-green/20 cursor-default'
            : 'bg-eco-green text-white hover:bg-eco-green/90 shadow-md shadow-eco-green/20 hover:shadow-eco-green/30 disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
        aria-label={isSubscribed ? t('pwa.notification_success') : t('pwa.notification_allow')}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isSubscribed ? (
          <Bell className="w-4 h-4" />
        ) : (
          <BellOff className="w-4 h-4" />
        )}
        <span>
          {loading
            ? 'Enabling...'
            : isSubscribed
            ? t('pwa.notification_success')
            : t('pwa.notification_allow')}
        </span>
      </button>

      {error && (
        <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
      )}

      {!isSubscribed && !loading && (
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {t('pwa.notification_notify')}
        </p>
      )}
    </div>
  );
}
