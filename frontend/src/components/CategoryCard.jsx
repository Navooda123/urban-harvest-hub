import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Salad, GraduationCap, ChevronRight } from 'lucide-react';

export default function CategoryCard({ category }) {
  const { t } = useTranslation();

  const details = {
    food: {
      title: t('categories.food'),
      desc: t('categories.food_desc'),
      icon: Salad,
      color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20',
      borderHover: 'hover:border-emerald-500 hover:shadow-emerald-500/5'
    },
    lifestyle: {
      title: t('categories.lifestyle'),
      desc: t('categories.lifestyle_desc'),
      icon: ShoppingBag,
      color: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border-indigo-500/20',
      borderHover: 'hover:border-indigo-500 hover:shadow-indigo-500/5'
    },
    education: {
      title: t('categories.education'),
      desc: t('categories.education_desc'),
      icon: GraduationCap,
      color: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20',
      borderHover: 'hover:border-amber-500 hover:shadow-amber-500/5'
    }
  };

  const info = details[category] || details.food;
  const IconComponent = info.icon;

  return (
    <Link
      to={`/categories/${category}`}
      className={`block p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-eco-green ${info.borderHover}`}
      aria-label={`Browse category: ${info.title}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3.5 rounded-xl border ${info.color} group-hover:scale-105 transition-transform duration-200`}>
            <IconComponent className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-eco-green transition-colors">
              {info.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 pr-4">
              {info.desc}
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-eco-green transition-all" />
      </div>
    </Link>
  );
}
