import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export function useWeather(locationStr) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!locationStr) {
      setLoading(false);
      return;
    }

    const coords = locationStr.split(',').map(Number);
    if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
      setError('Invalid coordinates');
      setLoading(false);
      return;
    }

    const [lat, lon] = coords;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      
      // If API KEY is missing or placeholder, trigger mock weather response
      if (!API_KEY || API_KEY === 'YOUR_API_KEY' || API_KEY === 'undefined' || API_KEY === '') {
        setTimeout(() => {
          // Coordinate-based mock climate
          const baseTemp = lat > 38 ? 16 : 24;
          const temp = Math.round(baseTemp + (Math.sin(lon) * 4) + (Math.random() * 2));
          const humidity = Math.round(55 + (Math.cos(lat) * 10));
          const conditions = [
            { desc: 'Clear sky', icon: '01d' },
            { desc: 'Partly cloudy', icon: '02d' },
            { desc: 'Scattered clouds', icon: '03d' }
          ];
          const condition = conditions[Math.abs(Math.round(lat + lon)) % conditions.length];

          setWeather({
            temp,
            humidity,
            description: condition.desc,
            icon: condition.icon,
            name: `Coordinates (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
            isMock: true
          });
          setLoading(false);
        }, 600);
        return;
      }

      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Weather API request failed.');
        }
        const data = await res.json();
        setWeather({
          temp: Math.round(data.main.temp),
          humidity: data.main.humidity,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          name: data.name || 'Harvest Site',
          isMock: false
        });
      } catch (err) {
        console.warn('Weather API failed, resolving mock fallback:', err);
        setWeather({
          temp: 22,
          humidity: 60,
          description: 'Mild breeze',
          icon: '02d',
          name: 'Fallback Site',
          isMock: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [locationStr]);

  return { weather, loading, error };
}
