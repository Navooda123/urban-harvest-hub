import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, Mail, Plus, Minus, AlertCircle, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function BookingForm({ item }) {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [date, setDate] = useState(item.date || new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleQtyChange = (amount) => {
    setQuantity(prev => {
      const next = prev + amount;
      if (next < 1) return 1;
      if (next > item.availability) return item.availability;
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name,
          email,
          itemId: item.id,
          date,
          quantity
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process reservation.');
      }

      setSuccess(true);
      // update state
      item.availability -= quantity;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-md text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-850 dark:text-white">
          {t('booking.success')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          We have sent a confirmation email to <strong className="text-slate-700 dark:text-slate-350">{email}</strong>.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="btn-eco w-full"
        >
          Browse More Items
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-md space-y-5">
      <h2 className="text-lg font-bold text-slate-850 dark:text-white border-b border-slate-100 dark:border-slate-750 pb-3">
        {t('booking.title', { title: item.title })}
      </h2>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-450 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Name Input */}
      <div className="space-y-1">
        <label htmlFor="name" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {t('booking.name_label')}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-4.5 w-4.5 text-slate-450" />
          </div>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-250 dark:border-slate-755 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-eco-green text-sm"
          />
        </div>
      </div>

      {/* Email Input */}
      <div className="space-y-1">
        <label htmlFor="email" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {t('booking.email_label')}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-4.5 w-4.5 text-slate-450" />
          </div>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-250 dark:border-slate-755 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-eco-green text-sm"
          />
        </div>
      </div>

      {/* Date Input */}
      <div className="space-y-1">
        <label htmlFor="date" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {t('booking.date_label')}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-4.5 w-4.5 text-slate-450" />
          </div>
          <input
            id="date"
            type="date"
            required
            value={date}
            disabled={!!item.date} // Lock if event date is fixed
            onChange={(e) => setDate(e.target.value)}
            className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-250 dark:border-slate-755 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white focus:outline-none focus:ring-2 focus:ring-eco-green text-sm disabled:opacity-75 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {t('booking.qty_label')}
        </label>
        <div className="flex items-center space-x-4">
          <div className="flex items-center border border-slate-250 dark:border-slate-750 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => handleQtyChange(-1)}
              disabled={quantity <= 1}
              className="p-3 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-sm font-bold text-slate-800 dark:text-white">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => handleQtyChange(1)}
              disabled={quantity >= item.availability}
              className="p-3 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            ({item.availability} slots max)
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3 pt-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-sm font-semibold rounded-lg text-slate-605 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800 cursor-pointer text-center"
        >
          {t('booking.cancel')}
        </button>
        <button
          type="submit"
          disabled={loading || item.availability <= 0}
          className="flex-1 btn-eco cursor-pointer"
        >
          {loading ? '...' : t('booking.submit')}
        </button>
      </div>
    </form>
  );
}
