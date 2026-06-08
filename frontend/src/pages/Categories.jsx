import React from 'react';
import { useTranslation } from 'react-i18next';
import CategoryCard from '../components/CategoryCard';
import { LayoutGrid } from 'lucide-react';

export default function Categories() {
  const { t } = useTranslation();

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      <header className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex p-2.5 bg-eco-green/10 text-eco-green dark:bg-eco-green/20 rounded-xl mb-2">
          <LayoutGrid className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-850 dark:text-white tracking-tight sm:text-4xl">
          {t('categories.title')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('categories.subtitle')}
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <CategoryCard category="food" />
        <CategoryCard category="lifestyle" />
        <CategoryCard category="education" />
      </section>
    </main>
  );
}
