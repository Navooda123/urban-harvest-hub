import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BookingForm from '../components/BookingForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Book() {
  const { id } = useParams();
  const { t } = useTranslation();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/items/${id}`);
        if (!res.ok) {
          throw new Error('Workshop/product not found.');
        }
        const data = await res.json();
        setItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItemDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eco-green mx-auto mb-4" />
        {t('home.weather_loading')}
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-750 dark:text-red-400 text-center text-sm">
          {error || 'Target details are currently unavailable.'}
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <BookingForm item={item} />
    </main>
  );
}
