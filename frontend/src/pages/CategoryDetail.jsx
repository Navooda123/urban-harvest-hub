import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Info, Calendar } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import staticItems from '../assets/items.json';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function CategoryDetail() {
  const { category } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategoryItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/items?category=${category}`);
      if (!res.ok) {
        throw new Error('Failed to load items for category');
      }
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.warn('Fetch category items error, using static JSON fallback:', err);
      const filtered = staticItems.filter(item => item.category === category);
      setItems(filtered);
      setError('Connection failed. Showing static offline fallback data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryItems();
  }, [category]);

  const categoryName = t(`categories.${category}`) || category;

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb / Back Navigation */}
      <nav aria-label="Breadcrumb">
        <button
          onClick={() => navigate('/categories')}
          className="flex items-center text-sm font-semibold text-slate-550 dark:text-slate-400 hover:text-eco-green transition-colors focus:outline-none focus:ring-1 focus:ring-eco-green rounded p-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Categories
        </button>
      </nav>

      {/* Header */}
      <header className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-850 dark:text-white capitalize">
          {categoryName}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-455">
          {t('categories.items_in', { category: categoryName })}
        </p>
      </header>

      {/* Main Grid Content */}
      <section className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-955/20 text-amber-805 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs">
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl h-96" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-450 dark:text-slate-500 bg-white dark:bg-slate-800/20">
            <Info className="w-10 h-10 mx-auto mb-3 text-slate-350" />
            <p className="text-sm font-semibold">No items available in this category yet.</p>
            <Link to="/products" className="btn-eco mt-4 text-xs">
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
