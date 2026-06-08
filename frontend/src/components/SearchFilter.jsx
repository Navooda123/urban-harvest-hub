import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

export default function SearchFilter({ filters, onFilterChange }) {
  const { t } = useTranslation();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFilterChange({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Search Input */}
      <div className="relative">
        <label htmlFor="search" className="sr-only">{t('products.search_placeholder')}</label>
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          id="search"
          name="search"
          type="text"
          value={filters.search}
          onChange={handleInputChange}
          placeholder={t('products.search_placeholder')}
          className="block w-full pl-10 pr-4 py-2.5 border border-slate-250 dark:border-slate-750 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-eco-green focus:border-eco-green text-sm transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div className="space-y-1">
          <label htmlFor="category" className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1 text-eco-green" />
            {t('nav.categories')}
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-slate-250 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-eco-green text-sm transition-all"
          >
            <option value="">{t('products.filter_category')}</option>
            <option value="food">{t('categories.food')}</option>
            <option value="lifestyle">{t('categories.lifestyle')}</option>
            <option value="education">{t('categories.education')}</option>
          </select>
        </div>

        {/* Sort Select */}
        <div className="space-y-1">
          <label htmlFor="sort" className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 mr-1 text-eco-green" />
            {t('products.sort_label')}
          </label>
          <select
            id="sort"
            name="sort"
            value={filters.sort}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-slate-250 dark:border-slate-750 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-eco-green text-sm transition-all"
          >
            <option value="newest">{t('products.sort_newest')}</option>
            <option value="price_asc">{t('products.sort_price_asc')}</option>
            <option value="price_desc">{t('products.sort_price_desc')}</option>
            <option value="date">{t('products.sort_date')}</option>
          </select>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center sm:pt-6">
          <label htmlFor="availableOnly" className="relative flex items-center cursor-pointer select-none">
            <input
              id="availableOnly"
              name="availableOnly"
              type="checkbox"
              checked={filters.availableOnly}
              onChange={handleInputChange}
              className="sr-only"
            />
            <div className={`w-10 h-6 rounded-full transition-colors ${
              filters.availableOnly ? 'bg-eco-green' : 'bg-slate-200 dark:bg-slate-700'
            }`} />
            <div className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${
              filters.availableOnly ? 'translate-x-4' : 'translate-x-0'
            }`} />
            <span className="ml-3 text-sm font-semibold text-slate-650 dark:text-slate-350">
              {t('products.filter_available_only')}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
