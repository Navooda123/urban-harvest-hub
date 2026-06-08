import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Calendar, FileText, Mail, ShoppingCart, Info, MapPin, Bell, Send } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminPanel() {
  const { t } = useTranslation();
  const { token } = useAuth();
  
  const [activeTab, setActiveTab] = useState('items'); // items, bookings, subscriptions, notifications
  
  // Data lists
  const [items, setItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  // Push notification broadcast state
  const [notifTitle, setNotifTitle] = useState('🌿 Urban Harvest Hub');
  const [notifBody, setNotifBody] = useState('A new event or workshop is available — check it out!');
  const [notifUrl, setNotifUrl] = useState('/products');
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifResult, setNotifResult] = useState(null);
  const [notifError, setNotifError] = useState(null);
  
  // Form states
  const [editingItem, setEditingItem] = useState(null); // null for list, 'create' for new, or item object for edit
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('food');
  const [formPrice, setFormPrice] = useState(0);
  const [formImage, setFormImage] = useState('');
  const [formAvailability, setFormAvailability] = useState(10);
  const [formLocation, setFormLocation] = useState('40.7128,-74.0060');
  const [formDate, setFormDate] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Fetch data on mount / tab change
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'items') {
        const res = await fetch(`${API_URL}/api/items`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load catalog');
        setItems(data);
      } else if (activeTab === 'bookings') {
        const res = await fetch(`${API_URL}/api/bookings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load bookings');
        setBookings(data);
      } else if (activeTab === 'subscriptions') {
        const res = await fetch(`${API_URL}/api/subscriptions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load subscriptions');
        setSubscriptions(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleOpenCreate = () => {
    setEditingItem('create');
    setFormTitle('');
    setFormDescription('');
    setFormCategory('food');
    setFormPrice(0);
    setFormImage('https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=600');
    setFormAvailability(10);
    setFormLocation('40.7128,-74.0060');
    setFormDate('');
    setError(null);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormDescription(item.description);
    setFormCategory(item.category);
    setFormPrice(item.price);
    setFormImage(item.image);
    setFormAvailability(item.availability);
    setFormLocation(item.location);
    setFormDate(item.date || '');
    setError(null);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    const payload = {
      title: formTitle,
      description: formDescription,
      category: formCategory,
      price: parseFloat(formPrice),
      image: formImage,
      availability: parseInt(formAvailability, 10),
      location: formLocation,
      date: formDate || null
    };

    try {
      const url = editingItem === 'create' 
        ? `${API_URL}/api/items` 
        : `${API_URL}/api/items/${editingItem.id}`;
      
      const method = editingItem === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (data.errors ? data.errors.map(e => e.message).join(', ') : 'Failed to save item'));
      }

      setSuccessMsg(editingItem === 'create' ? 'Item created successfully' : 'Item updated successfully');
      setEditingItem(null);
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm(t('admin.delete_confirm'))) return;
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/items/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete item');
      setSuccessMsg('Item deleted successfully');
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and alerts */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-850 dark:text-white tracking-tight flex items-center">
            {t('admin.title')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-455">
            Manage your hub catalog listings, review guest bookings, and track sub boxes.
          </p>
        </div>
        
        {activeTab === 'items' && !editingItem && (
          <button
            onClick={handleOpenCreate}
            className="btn-eco flex items-center cursor-pointer font-bold"
          >
            <Plus className="w-5 h-5 mr-1.5" />
            {t('admin.add_item')}
          </button>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-450 text-sm flex items-center space-x-2">
          <Info className="w-5 h-5 shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-450 text-sm flex items-center space-x-2">
          <Info className="w-5 h-5 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      {!editingItem && (
        <div className="flex border-b border-slate-200 dark:border-slate-800" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === 'items'}
            onClick={() => setActiveTab('items')}
            className={`flex items-center px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer focus:outline-none ${
              activeTab === 'items'
                ? 'border-eco-green text-eco-green'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            {t('admin.items_tab')}
          </button>
          
          <button
            role="tab"
            aria-selected={activeTab === 'bookings'}
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer focus:outline-none ${
              activeTab === 'bookings'
                ? 'border-eco-green text-eco-green'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {t('admin.bookings_tab')}
          </button>
          
          <button
            role="tab"
            aria-selected={activeTab === 'subscriptions'}
            onClick={() => setActiveTab('subscriptions')}
            className={`flex items-center px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer focus:outline-none ${
              activeTab === 'subscriptions'
                ? 'border-eco-green text-eco-green'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4 mr-2" />
            {t('admin.subscriptions_tab')}
          </button>

          <button
            role="tab"
            aria-selected={activeTab === 'notifications'}
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer focus:outline-none ${
              activeTab === 'notifications'
                ? 'border-eco-green text-eco-green'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Bell className="w-4 h-4 mr-2" />
            Push Notifications
          </button>
        </div>
      )}

      {/* Editing / Create Form Panel */}
      {editingItem ? (
        <form onSubmit={handleSaveItem} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-850 dark:text-white border-b border-slate-100 dark:border-slate-750 pb-3">
            {editingItem === 'create' ? t('admin.add_item') : t('admin.edit_item')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="space-y-1">
              <label htmlFor="formTitle" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('admin.item_title')}</label>
              <input
                id="formTitle"
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="block w-full px-3.5 py-2.5 border border-slate-250 dark:border-slate-755 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-eco-green"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label htmlFor="formCategory" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('admin.item_category')}</label>
              <select
                id="formCategory"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="block w-full px-3.5 py-2.5 border border-slate-250 dark:border-slate-755 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-eco-green"
              >
                <option value="food">{t('categories.food')}</option>
                <option value="lifestyle">{t('categories.lifestyle')}</option>
                <option value="education">{t('categories.education')}</option>
              </select>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label htmlFor="formPrice" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('admin.item_price')}</label>
              <input
                id="formPrice"
                type="number"
                step="0.01"
                min="0"
                required
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                className="block w-full px-3.5 py-2.5 border border-slate-250 dark:border-slate-755 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-eco-green"
              />
            </div>

            {/* Availability */}
            <div className="space-y-1">
              <label htmlFor="formAvailability" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('admin.item_avail')}</label>
              <input
                id="formAvailability"
                type="number"
                min="0"
                required
                value={formAvailability}
                onChange={(e) => setFormAvailability(e.target.value)}
                className="block w-full px-3.5 py-2.5 border border-slate-250 dark:border-slate-755 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-eco-green"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-1">
              <label htmlFor="formImage" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('admin.item_image')}</label>
              <input
                id="formImage"
                type="text"
                required
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
                className="block w-full px-3.5 py-2.5 border border-slate-250 dark:border-slate-755 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-eco-green"
              />
            </div>

            {/* Location (Coordinates) */}
            <div className="space-y-1">
              <label htmlFor="formLocation" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('admin.item_location')}</label>
              <input
                id="formLocation"
                type="text"
                required
                placeholder="40.7128,-74.0060"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                className="block w-full px-3.5 py-2.5 border border-slate-250 dark:border-slate-755 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-eco-green"
              />
            </div>

            {/* Date */}
            <div className="space-y-1">
              <label htmlFor="formDate" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('admin.item_date')}</label>
              <input
                id="formDate"
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="block w-full px-3.5 py-2.5 border border-slate-250 dark:border-slate-755 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-eco-green"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="formDescription" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('admin.item_desc')}</label>
            <textarea
              id="formDescription"
              required
              rows="4"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="block w-full px-3.5 py-2.5 border border-slate-250 dark:border-slate-755 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-eco-green resize-none"
            />
          </div>

          <div className="flex items-center space-x-3 pt-4 border-t border-slate-100 dark:border-slate-750">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="flex-1 px-4 py-2.5 border border-slate-250 dark:border-slate-700 text-slate-605 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold rounded-xl cursor-pointer text-center"
            >
              {t('admin.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-eco cursor-pointer"
            >
              {loading ? '...' : t('admin.save')}
            </button>
          </div>
        </form>
      ) : (
        /* Data Views lists */
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-slate-500">{t('home.weather_loading')}</div>
          ) : activeTab === 'items' ? (
            /* Items Catalog CRUD Table */
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-750 text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xxs">
                  <tr>
                    <th scope="col" className="px-6 py-4">{t('admin.item_title')}</th>
                    <th scope="col" className="px-6 py-4">{t('admin.item_category')}</th>
                    <th scope="col" className="px-6 py-4">{t('admin.item_price')}</th>
                    <th scope="col" className="px-6 py-4">{t('admin.item_avail')}</th>
                    <th scope="col" className="px-6 py-4">{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-750 text-slate-700 dark:text-slate-300">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30">
                      <td className="px-6 py-4 flex items-center space-x-3">
                        <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 bg-slate-100 dark:bg-slate-900" />
                        <span className="font-bold text-slate-850 dark:text-white truncate max-w-xs">{item.title}</span>
                      </td>
                      <td className="px-6 py-4 capitalize">{item.category}</td>
                      <td className="px-6 py-4 font-semibold">{item.price > 0 ? `$${parseFloat(item.price).toFixed(2)}` : t('products.free')}</td>
                      <td className="px-6 py-4 font-semibold">{item.availability}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-eco-green hover:bg-eco-green/5 text-slate-600 hover:text-eco-green dark:border-slate-700 dark:hover:bg-eco-green/10 dark:text-slate-400 cursor-pointer"
                            title={t('admin.edit_item')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-red-500 hover:bg-red-50 text-slate-600 hover:text-red-650 dark:border-slate-700 dark:hover:bg-red-950/20 dark:text-slate-400 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'bookings' ? (
            /* Bookings Table */
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-750 text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xxs">
                  <tr>
                    <th scope="col" className="px-6 py-4">User Details</th>
                    <th scope="col" className="px-6 py-4">Item booked</th>
                    <th scope="col" className="px-6 py-4">Selected Date</th>
                    <th scope="col" className="px-6 py-4">Qty</th>
                    <th scope="col" className="px-6 py-4">Booked at</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-750 text-slate-700 dark:text-slate-300">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30">
                      <td className="px-6 py-4 flex flex-col">
                        <span className="font-bold text-slate-850 dark:text-white">{booking.name}</span>
                        <span className="text-xs text-slate-450 dark:text-slate-500">{booking.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 dark:text-white">{booking.itemTitle}</span>
                          <span className="text-xxs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-500 capitalize w-max mt-1">{booking.itemCategory}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{booking.date}</td>
                      <td className="px-6 py-4 font-bold">{booking.quantity}</td>
                      <td className="px-6 py-4 text-xs text-slate-450 dark:text-slate-500">{new Date(booking.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                        {t('admin.empty_bookings')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'notifications' ? (
            /* Push Notification Broadcast Panel */
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">Broadcast Push Notification</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Send an instant push notification to all subscribed users.</p>
              </div>

              {notifResult && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 text-sm flex items-center space-x-2">
                  <Bell className="w-5 h-5 shrink-0" />
                  <span className="font-semibold">{notifResult}</span>
                </div>
              )}
              {notifError && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-400 text-sm flex items-center space-x-2">
                  <Info className="w-5 h-5 shrink-0" />
                  <span className="font-semibold">{notifError}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="notifTitle" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Notification Title</label>
                  <input
                    id="notifTitle"
                    type="text"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    className="block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-eco-green"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="notifBody" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Notification Message</label>
                  <textarea
                    id="notifBody"
                    rows="3"
                    value={notifBody}
                    onChange={(e) => setNotifBody(e.target.value)}
                    className="block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-eco-green resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="notifUrl" className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Link URL (optional)</label>
                  <input
                    id="notifUrl"
                    type="text"
                    value={notifUrl}
                    onChange={(e) => setNotifUrl(e.target.value)}
                    placeholder="/products"
                    className="block w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-eco-green"
                  />
                </div>

                <button
                  onClick={async () => {
                    setNotifLoading(true);
                    setNotifResult(null);
                    setNotifError(null);
                    try {
                      const res = await fetch(`${API_URL}/api/notifications/send`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ title: notifTitle, body: notifBody, url: notifUrl })
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error || 'Broadcast failed');
                      setNotifResult(data.message);
                    } catch (err) {
                      setNotifError(err.message);
                    } finally {
                      setNotifLoading(false);
                    }
                  }}
                  disabled={notifLoading}
                  className="btn-eco flex items-center cursor-pointer"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {notifLoading ? 'Sending...' : 'Broadcast to All Subscribers'}
                </button>
              </div>
            </div>
          ) : (
            /* Subscriptions Table */
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-750 text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-xxs">
                  <tr>
                    <th scope="col" className="px-6 py-4">Subscribed Email</th>
                    <th scope="col" className="px-6 py-4">Delivery Frequency</th>
                    <th scope="col" className="px-6 py-4">Registered at</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-750 text-slate-700 dark:text-slate-300">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30">
                      <td className="px-6 py-4 font-semibold text-slate-850 dark:text-white">{sub.email}</td>
                      <td className="px-6 py-4 capitalize font-semibold text-eco-green">{sub.frequency}</td>
                      <td className="px-6 py-4 text-xs text-slate-455 dark:text-slate-500">{new Date(sub.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {subscriptions.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                        {t('admin.empty_subs')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
