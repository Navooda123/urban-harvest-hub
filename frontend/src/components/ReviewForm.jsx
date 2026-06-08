import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Star, AlertCircle, CheckCircle2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ReviewForm({ itemId, onReviewAdded }) {
  const { t } = useTranslation();
  const { token, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          itemId: parseInt(itemId, 10),
          rating,
          comment
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review.');
      }

      setSuccess(true);
      setComment('');
      setRating(5);
      if (onReviewAdded) {
        onReviewAdded(data.review);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-4 text-center text-sm font-semibold text-slate-500 dark:text-slate-450">
        {t('detail.reviews_login_prompt')}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
      <h3 className="text-base font-bold text-slate-800 dark:text-white">
        {t('detail.write_review')}
      </h3>

      {/* Success Alert */}
      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-450 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{t('detail.review_success')}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-450 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Star Selector */}
      <div className="space-y-1">
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {t('detail.rating_label')}
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 focus:outline-none focus:ring-2 focus:ring-eco-green rounded-md transition-transform active:scale-90"
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <Star
                className={`w-7 h-7 ${
                  star <= (hoverRating || rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-200 dark:text-slate-700'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment Input */}
      <div className="space-y-1">
        <label htmlFor="comment" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {t('detail.comment_label')}
        </label>
        <textarea
          id="comment"
          rows="3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t('detail.comment_placeholder')}
          required
          className="block w-full px-3.5 py-2.5 border border-slate-250 dark:border-slate-755 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-eco-green text-sm resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-eco w-full cursor-pointer"
      >
        {loading ? '...' : t('detail.submit_review')}
      </button>
    </form>
  );
}
