import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Mail, CheckCircle2, AlertCircle, Sprout, Recycle, ShieldCheck } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function SubscribeForm() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [email, setEmail] = useState(user ? user.email : '');
  const [frequency, setFrequency] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${API_URL}/api/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, frequency })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit subscription.');
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: Sprout, text: t('subscribe.benefit_1') },
    { icon: Recycle, text: t('subscribe.benefit_2') },
    { icon: ShieldCheck, text: t('subscribe.benefit_3') }
  ];

  if (success) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-md text-center max-w-lg mx-auto space-y-4">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 animate-scale" />
        </div>
        <h2 className="text-xl font-bold text-slate-850 dark:text-white">
          {t('subscribe.success')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your active sub: <strong className="text-slate-850 dark:text-white capitalize">{frequency}</strong> box sent to <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
      
      {/* Box Description Column */}
      <div className="bg-eco-green/5 dark:bg-slate-800/40 border border-eco-green/10 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-850 dark:text-white tracking-tight">
            {t('subscribe.title')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-450 leading-relaxed mt-4">
            {t('subscribe.subtitle')}
          </p>

          <div className="mt-8 space-y-4">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <div key={i} className="flex items-start space-x-3.5">
                  <div className="p-2 rounded-xl bg-eco-green/10 text-eco-green dark:bg-eco-green/20 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-305 leading-relaxed pt-1">
                    {benefit.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-850 text-xs text-slate-400 flex items-center space-x-2">
          <span>Cancel or modify frequency anytime in your dashboard.</span>
        </div>
      </div>

      {/* Subscription Form Column */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6">
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-slate-850 dark:text-white border-b border-slate-100 dark:border-slate-750 pb-3">
            Box Details
          </h3>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-450 text-sm flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* Email field */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('subscribe.email_label')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4.5 w-4.5 text-slate-450" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-250 dark:border-slate-755 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-eco-green text-sm"
              />
            </div>
          </div>

          {/* Frequency Selector */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('subscribe.frequency_label')}
            </label>
            <div className="space-y-2">
              {[
                { value: 'weekly', label: t('subscribe.weekly') },
                { value: 'biweekly', label: t('subscribe.biweekly') },
                { value: 'monthly', label: t('subscribe.monthly') }
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all ${
                    frequency === opt.value
                      ? 'border-eco-green bg-eco-green/5 text-eco-green dark:bg-eco-green/10'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="frequency"
                      value={opt.value}
                      checked={frequency === opt.value}
                      onChange={() => setFrequency(opt.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 ${
                      frequency === opt.value ? 'border-eco-green' : 'border-slate-300 dark:border-slate-650'
                    }`}>
                      {frequency === opt.value && <div className="w-2 h-2 bg-eco-green rounded-full" />}
                    </div>
                    <span className="text-sm font-semibold capitalize">{opt.value}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-450 dark:text-slate-500">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-eco w-full cursor-pointer mt-4"
        >
          {loading ? '...' : t('subscribe.submit')}
        </button>
      </form>

    </div>
  );
}
