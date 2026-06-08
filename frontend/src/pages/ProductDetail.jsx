import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { useWeather } from '../hooks/useWeather';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import { ChevronLeft, MapPin, Calendar, Clock, Navigation, Info, Thermometer, ShieldAlert } from 'lucide-react';
import staticItems from '../assets/items.json';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProductDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetailAndReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch item
      const itemRes = await fetch(`${API_URL}/api/items/${id}`);
      if (!itemRes.ok) throw new Error('Item not found.');
      const itemData = await itemRes.json();
      setItem(itemData);

      // 2. Fetch reviews
      const reviewsRes = await fetch(`${API_URL}/api/reviews?itemId=${id}`);
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      }
    } catch (err) {
      console.warn('Failed to fetch details from API, using static JSON fallback:', err);
      const localItem = staticItems.find(item => item.id === parseInt(id));
      if (localItem) {
        setItem(localItem);
        setError('Connection failed. Showing static offline fallback details.');
      } else {
        setError(err.message || 'Item details unavailable.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailAndReviews();
  }, [id]);

  // Hook into Geolocation distance calculator
  const { distance, error: geoError, loading: loadingGeo } = useGeolocation(item?.location);
  
  // Hook into weather details at the location
  const { weather, loading: loadingWeather } = useWeather(item?.location);

  const handleReviewAdded = (newReview) => {
    // Append the new review to the list
    setReviews((prev) => [newReview, ...prev]);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green mx-auto mb-4" />
        {t('home.weather_loading')}
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-center text-sm">
          {error || 'Item details unavailable.'}
        </div>
      </div>
    );
  }

  const isAvailable = item.availability > 0;
  const isWorkshop = item.date !== null;

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Back navigation */}
      <nav aria-label="Breadcrumb" className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-semibold text-slate-550 dark:text-slate-400 hover:text-eco-green transition-colors focus:outline-none focus:ring-1 focus:ring-eco-green rounded p-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>
      </nav>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs">
          <span>{error}</span>
        </div>
      )}

      {/* Item Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Image and Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative pt-[56.25%] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 shadow-sm">
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="eco-badge">
                {t(`categories.${item.category}`)}
              </span>
            </div>
          </div>

          <div className="space-y-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-850 dark:text-white tracking-tight">
              {item.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-650 dark:text-slate-300 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>

        {/* Right Column: Metadata Sidebar Widget */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-5">
            
            {/* Price & availability info */}
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-semibold text-slate-450 dark:text-slate-500">{t('detail.price')}</span>
              <span className="text-2xl font-extrabold text-slate-850 dark:text-white">
                {item.price > 0 ? `$${parseFloat(item.price).toFixed(2)}` : t('products.free')}
              </span>
            </div>
            
            <div className="flex justify-between items-baseline border-b border-slate-100 dark:border-slate-750 pb-4">
              <span className="text-sm font-semibold text-slate-450 dark:text-slate-500">{t('detail.availability')}</span>
              <span className={`text-sm font-bold ${isAvailable ? 'text-eco-green' : 'text-red-500'}`}>
                {isAvailable 
                  ? t('products.slots_left', { count: item.availability })
                  : t('products.out_of_stock')
                }
              </span>
            </div>

            {/* Event Specific Location and Date details */}
            <div className="space-y-3.5 text-sm">
              {item.date && (
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-eco-green mr-3 shrink-0" />
                  <div>
                    <span className="block font-bold text-slate-800 dark:text-white">{t('detail.date')}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{item.date}</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-eco-green mr-3 shrink-0" />
                <div>
                  <span className="block font-bold text-slate-800 dark:text-white">{t('detail.location')}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block truncate max-w-[180px]">Coordinates: {item.location}</span>
                </div>
              </div>
            </div>

            {/* Geolocation Distance and map trigger */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-2xl p-4 space-y-3">
              <div className="flex items-start space-x-2 text-xs">
                <Navigation className="w-4 h-4 text-eco-green shrink-0 mt-0.5 animate-pulse" />
                <div className="flex-1">
                  <strong className="block text-slate-750 dark:text-slate-300">{t('detail.distance')}</strong>
                  <span className="text-slate-500 dark:text-slate-400">
                    {loadingGeo && t('detail.calculating_distance')}
                    {!loadingGeo && geoError && t('detail.distance_failed')}
                    {!loadingGeo && !geoError && distance !== null && `${distance.toFixed(1)} km away`}
                  </span>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${item.location}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center py-2 px-3 border border-slate-205 dark:border-slate-700 text-xs font-semibold rounded-lg text-slate-650 hover:bg-slate-100 dark:text-slate-350 dark:hover:bg-slate-850 transition-colors focus:outline-none"
              >
                {t('detail.view_map')}
              </a>
            </div>

            {/* Dynamic Weather Widget */}
            {weather && (
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-750 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Thermometer className="w-5 h-5 text-eco-green shrink-0" />
                  <div className="text-xs">
                    <strong className="block text-slate-705 dark:text-slate-300">Weather on-site</strong>
                    <span className="text-slate-500 dark:text-slate-400 capitalize">{weather.temp}°C, {weather.description}</span>
                  </div>
                </div>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                  alt=""
                  className="w-10 h-10 shrink-0"
                />
              </div>
            )}

            {/* CTA Book Button */}
            <Link
              to={isAvailable ? `/book/${item.id}` : '#'}
              onClick={(e) => !isAvailable && e.preventDefault()}
              className={`w-full text-center block ${isAvailable ? 'btn-eco' : 'bg-slate-200 text-slate-400 cursor-not-allowed py-2.5 rounded-lg text-sm font-semibold'}`}
            >
              {isWorkshop ? t('detail.book_now') : t('detail.buy_now')}
            </Link>

          </div>
        </div>

      </div>

      {/* Bottom Row: Reviews Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800" aria-label="Community Reviews">
        <div className="lg:col-span-2">
          <ReviewList reviews={reviews} />
        </div>
        <div>
          <ReviewForm itemId={id} onReviewAdded={handleReviewAdded} />
        </div>
      </section>

    </main>
  );
}
