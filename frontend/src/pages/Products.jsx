import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SearchFilter from '../components/SearchFilter';
import ItemCard from '../components/ItemCard';
import { ShoppingBag, Loader2, RefreshCw } from 'lucide-react';
import staticItems from '../assets/items.json';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Products() {
  const { t } = useTranslation();
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    availableOnly: false,
    sort: 'newest'
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounced/Triggered REST fetching when filters change
  const fetchFilteredItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort) params.append('sort', filters.sort);

      const res = await fetch(`${API_URL}/api/items?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to load items from server');
      }
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.warn('Fetch catalog items error, using static JSON fallback:', err);
      
      // Fallback: filter local static JSON data
      let filtered = [...staticItems];
      if (filters.category) {
        filtered = filtered.filter(item => item.category === filters.category);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query)
        );
      }
      if (filters.sort === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (filters.sort === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (filters.sort === 'date') {
        filtered.sort((a, b) => {
          if (!a.date) return 1;
          if (!b.date) return -1;
          return new Date(a.date) - new Date(b.date);
        });
      } else {
        // newest or default, sort by id desc
        filtered.sort((a, b) => b.id - a.id);
      }
      setItems(filtered);
      setError('Connection failed. Showing static offline fallback data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Run the API call
    fetchFilteredItems();
  }, [filters.search, filters.category, filters.sort]);

  // Client side filtering for availability
  const displayedItems = filters.availableOnly
    ? items.filter((item) => item.availability > 0)
    : items;

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-850 dark:text-white tracking-tight flex items-center">
          <ShoppingBag className="w-8 h-8 mr-2.5 text-eco-green" />
          {t('products.title')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-455">
          {t('products.subtitle')}
        </p>
      </header>

      {/* Filter controls */}
      <SearchFilter filters={filters} onFilterChange={setFilters} />

      {/* Catalog Grid */}
      <section aria-label="Eco catalog items" className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs">
            <span>{error}</span>
            <button
              onClick={fetchFilteredItems}
              className="flex items-center text-eco-green hover:underline font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Retry Connection
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-eco-green mb-4" />
            <p className="text-sm font-semibold">{t('home.weather_loading')}</p>
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-455 dark:text-slate-500 bg-white dark:bg-slate-800/10">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-350" />
            <p className="text-base font-bold">{t('products.no_items')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
