import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotification() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSupport = async () => {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        setIsSupported(true);
        try {
          // Wait for service worker to be ready
          const registration = await navigator.serviceWorker.ready;
          const sub = await registration.pushManager.getSubscription();
          setSubscription(sub);
        } catch (err) {
          console.warn('Error checking existing push subscription:', err);
        }
      }
      setLoading(false);
    };
    checkSupport();
  }, []);

  const subscribeUser = async () => {
    setError(null);
    setLoading(true);
    try {
      // 1. Fetch public VAPID key from API
      const keyRes = await fetch(`${API_URL}/api/notifications/vapid-key`);
      if (!keyRes.ok) throw new Error('Failed to retrieve VAPID key from server.');
      const { publicKey } = await keyRes.json();

      // 2. Subscribe browser push manager
      const registration = await navigator.serviceWorker.ready;
      const convertedKey = urlBase64ToUint8Array(publicKey);
      
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey
      });

      // 3. Register subscription on the server
      const res = await fetch(`${API_URL}/api/notifications/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit push registration to server.');
      }

      setSubscription(sub);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Failed to configure push subscription:', err);
      setError(err.message || 'Push subscription failed.');
      setLoading(false);
      return false;
    }
  };

  return {
    isSupported,
    subscription,
    subscribeUser,
    loading,
    error,
    isSubscribed: !!subscription
  };
}
