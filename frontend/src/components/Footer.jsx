import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sprout, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors" aria-label="Footer Navigation">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <Sprout className="w-6 h-6 text-eco-green" />
              <span className="font-bold text-lg tracking-tight">
                Urban<span className="text-eco-green">Harvest</span>Hub
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('home.subtitle')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Navigation</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-eco-green transition-colors focus:outline-none focus:ring-1 focus:ring-eco-green rounded px-1">
                  {t('nav.home')}
                </a>
              </li>
              <li>
                <a href="/categories" className="hover:text-eco-green transition-colors focus:outline-none focus:ring-1 focus:ring-eco-green rounded px-1">
                  {t('nav.categories')}
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-eco-green transition-colors focus:outline-none focus:ring-1 focus:ring-eco-green rounded px-1">
                  {t('nav.products')}
                </a>
              </li>
              <li>
                <a href="/subscribe" className="hover:text-eco-green transition-colors focus:outline-none focus:ring-1 focus:ring-eco-green rounded px-1">
                  {t('nav.subscribe')}
                </a>
              </li>
            </ul>
          </div>

          {/* Categories Quick Link */}
          <div>
            <h2 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Categories</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/categories/food" className="hover:text-eco-green transition-colors focus:outline-none focus:ring-1 focus:ring-eco-green rounded px-1">
                  {t('categories.food')}
                </a>
              </li>
              <li>
                <a href="/categories/lifestyle" className="hover:text-eco-green transition-colors focus:outline-none focus:ring-1 focus:ring-eco-green rounded px-1">
                  {t('categories.lifestyle')}
                </a>
              </li>
              <li>
                <a href="/categories/education" className="hover:text-eco-green transition-colors focus:outline-none focus:ring-1 focus:ring-eco-green rounded px-1">
                  {t('categories.education')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact / Location Column */}
          <div className="space-y-3">
            <h2 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Contact & Location</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-eco-green mr-2 shrink-0" />
                <span>Greenwood Urban Farms, Suite 400, NY</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-eco-green mr-2 shrink-0" />
                <span>+1 (555) 902-1200</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-eco-green mr-2 shrink-0" />
                <span>info@urbanharvesthub.org</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center">
          <p>&copy; {currentYear} Urban Harvest Hub. All rights reserved.</p>
          <div className="mt-2 sm:mt-0 flex space-x-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
