import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star, MessageSquare, User } from 'lucide-react';

export default function ReviewList({ reviews }) {
  const { t } = useTranslation();

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-0.5" aria-label={`Rating: ${rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < rating
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-200 dark:text-slate-700'
            }`}
          />
        ))}
      </div>
    );
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800/20">
        <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
        <p className="text-sm font-semibold">{t('detail.no_reviews')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center">
        <MessageSquare className="w-5 h-5 mr-2 text-eco-green" />
        {t('detail.reviews_title')} ({reviews.length})
      </h3>
      <div className="divide-y divide-slate-100 dark:divide-slate-750 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 sm:p-5 flex items-start space-x-3.5">
            {/* User Avatar */}
            <div className="w-9 h-9 rounded-full bg-eco-green/10 dark:bg-eco-green/20 text-eco-green flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>

            {/* Review content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                <span className="text-sm font-bold text-slate-800 dark:text-white truncate">
                  {review.userName || 'Hub Member'}
                </span>
                <div className="flex items-center space-x-3">
                  {renderStars(review.rating)}
                  <span className="text-xxs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-350 mt-2 leading-relaxed break-words">
                {review.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
