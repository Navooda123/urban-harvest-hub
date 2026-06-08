import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, MapPin, Calendar } from 'lucide-react';

export default function ItemCard({ item }) {
  const { t } = useTranslation();
  const isAvailable = item.availability > 0;

  // Render stars based on rating
  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-0.5" aria-label={`Rating: ${rating} stars`}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < Math.round(rating)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-200 dark:text-slate-650'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <article className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-205 flex flex-col group h-full">
      {/* Thumbnail Section */}
      <div className="relative pt-[56.25%] overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="eco-badge">
            {t(`categories.${item.category}`)}
          </span>
        </div>
        
        {/* Availability Overlay */}
        <div className="absolute bottom-3 right-3">
          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm ${
            isAvailable 
              ? 'bg-white text-slate-800 dark:bg-slate-800 dark:text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {isAvailable 
              ? t('products.slots_left', { count: item.availability })
              : t('products.out_of_stock')
            }
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          {item.reviewCount > 0 && (
            <div className="flex items-center space-x-2 mb-2">
              {renderStars(item.averageRating)}
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                ({item.reviewCount})
              </span>
            </div>
          )}

          <h3 className="text-base font-bold text-slate-850 dark:text-white line-clamp-1 group-hover:text-eco-green transition-colors">
            <Link to={`/products/${item.id}`} className="focus:outline-none focus:underline">
              {item.title}
            </Link>
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Date and Location */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
          {item.date && (
            <div className="flex items-center">
              <Calendar className="w-3.5 h-3.5 text-eco-green mr-1.5 shrink-0" />
              <span>{item.date}</span>
            </div>
          )}
          <div className="flex items-center">
            <MapPin className="w-3.5 h-3.5 text-eco-green mr-1.5 shrink-0" />
            <span className="truncate">Coordinates: {item.location}</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-450 dark:text-slate-500 font-medium">
              {t('products.price')}
            </span>
            <span className="text-lg font-extrabold text-slate-850 dark:text-white">
              {item.price > 0 ? `$${parseFloat(item.price).toFixed(2)}` : t('products.free')}
            </span>
          </div>
          
          <Link
            to={`/products/${item.id}`}
            className="btn-eco !px-3.5 !py-2 text-xs font-semibold"
          >
            {t('products.view_detail')}
          </Link>
        </div>
      </div>
    </article>
  );
}
