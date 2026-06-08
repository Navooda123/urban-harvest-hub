import { useState, useEffect } from 'react';

// Haversine formula to calculate distance between two coordinates in km
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // distance in km
  return distance;
}

export function useGeolocation(targetLocationStr) {
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!targetLocationStr) {
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      setError('Geolocation not supported by browser');
      setLoading(false);
      return;
    }

    const coords = targetLocationStr.split(',').map(Number);
    if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
      setError('Invalid target coordinates');
      setLoading(false);
      return;
    }
    const [targetLat, targetLon] = coords;

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        const dist = calculateHaversineDistance(userLat, userLon, targetLat, targetLon);
        setDistance(dist);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.warn('Geolocation capture failed:', err);
        setError(err.message || 'Permission denied or timed out');
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  }, [targetLocationStr]);

  return { distance, error, loading };
}
