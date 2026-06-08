import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, Calendar, Sparkles, CloudSun } from 'lucide-react';
import CategoryCard from '../components/CategoryCard';
import ItemCard from '../components/ItemCard';
import { useWeather } from '../hooks/useWeather';
import staticItems from '../assets/items.json';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Home() {
  const { t } = useTranslation();
  const [highlights, setHighlights] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  // Greenwood Hub coordinates for the weather widget
  const hubCoords = '40.7128,-74.0060'; 
  const { weather, loading: loadingWeather } = useWeather(hubCoords);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await fetch(`${API_URL}/api/items`);
        if (res.ok) {
          const data = await res.json();
          // Filter out-of-stock items and take first 3 for highlights
          const activeItems = data.filter(item => item.availability > 0).slice(0, 3);
          setHighlights(activeItems);
        } else {
          throw new Error('Server returned error status');
        }
      } catch (err) {
        console.warn('Failed to fetch catalog highlights from API, using static JSON fallback:', err);
        const activeItems = staticItems.filter(item => item.availability > 0).slice(0, 3);
        setHighlights(activeItems);
      } finally {
        setLoadingItems(false);
      }
    };
    fetchHighlights();
  }, []);

  return (
    <main className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-br from-eco-green/10 via-white to-earth-brown/5 dark:from-slate-900 dark:to-slate-950 py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-100 dark:border-slate-850 overflow-hidden" aria-label="Hero Introduction">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-eco-green/10 text-eco-green dark:bg-eco-green/20 text-xs font-bold uppercase tracking-wider animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>Empowering Green Communities</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-850 dark:text-white tracking-tight leading-tight">
            {t('home.title')}
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-350 max-w-2xl mx-auto leading-relaxed">
            {t('home.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/products" className="btn-eco w-full sm:w-auto">
              {t('home.cta_browse')}
            </Link>
            <Link to="/subscribe" className="btn-earth w-full sm:w-auto">
              {t('home.cta_subscribe')}
            </Link>
          </div>
        </div>
        
        {/* Abstract background graphics */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-eco-green/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-earth-brown/5 rounded-full filter blur-3xl" />
      </section>

      {/* Featured Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Product and Event Categories">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-850 dark:text-white tracking-tight">
            {t('home.featured_categories')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('home.featured_categories_sub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CategoryCard category="food" />
          <CategoryCard category="lifestyle" />
          <CategoryCard category="education" />
        </div>
      </section>

      {/* Upcoming Highlights and Weather API Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8" aria-label="Event Highlights and Weather">
        
        {/* Dynamic Highlights Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-850 dark:text-white flex items-center">
              <Calendar className="w-5.5 h-5.5 mr-2 text-eco-green" />
              {t('home.highlights')}
            </h2>
            <Link to="/products" className="text-sm font-semibold text-eco-green hover:underline">
              View All
            </Link>
          </div>

          {loadingItems ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="animate-pulse bg-slate-100 dark:bg-slate-850 rounded-2xl h-80" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {highlights.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Live Weather Widget Column */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-slate-850 dark:text-white flex items-center">
              <CloudSun className="w-5.5 h-5.5 mr-2 text-eco-green" />
              {t('home.weather_title')}
            </h2>
          </div>

          {loadingWeather ? (
            <div className="animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl h-52 flex items-center justify-center text-slate-400">
              {t('home.weather_loading')}
            </div>
          ) : weather ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-52 relative overflow-hidden group">
              <div>
                <span className="text-xs font-bold text-eco-green uppercase tracking-wider bg-eco-green/10 dark:bg-eco-green/20 px-2.5 py-1 rounded-md">
                  Greenwood Hub (HQ)
                </span>
                <h3 className="text-base font-bold text-slate-850 dark:text-white mt-3 truncate">
                  {weather.name}
                </h3>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-extrabold text-slate-850 dark:text-white">
                    {weather.temp}°C
                  </span>
                </div>
                <div className="text-right flex flex-col items-end">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt=""
                    className="w-16 h-16 -my-4 drop-shadow-sm group-hover:scale-105 transition-transform"
                  />
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 capitalize">
                    {weather.description}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-slate-100 dark:border-slate-700/50 pt-3 flex justify-between text-xxs text-slate-450 dark:text-slate-500 font-medium">
                <span>{t('home.weather_humidity')}: <strong>{weather.humidity}%</strong></span>
                {weather.isMock && <span className="text-amber-500 font-bold">Simulator Active</span>}
              </div>
            </div>
          ) : (
            <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 p-6 rounded-3xl text-sm text-center">
              Failed to load weather widget.
            </div>
          )}
        </div>

      </section>
    </main>
  );
}
