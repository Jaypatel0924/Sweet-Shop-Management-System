import React, { useState, useEffect } from 'react';
import { Sweet } from '../types';
import { SweetCard } from './SweetCard';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchSweets();
  }, []);

  useEffect(() => {
    // Extract unique categories
    const uniqueCategories = Array.from(new Set(sweets.map(s => s.category)));
    setCategories(uniqueCategories);
  }, [sweets]);

  const fetchSweets = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.getAllSweets();
      setSweets(response.sweets || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch sweets';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await apiService.searchSweets(
        searchName || undefined,
        searchCategory || undefined,
        minPrice ? Number(minPrice) : undefined,
        maxPrice ? Number(maxPrice) : undefined
      );
      setSweets(response.sweets || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = async () => {
    setSearchName('');
    setSearchCategory('');
    setMinPrice('');
    setMaxPrice('');
    await fetchSweets();
  };

  const handlePurchase = async (id: string, quantity: number) => {
    try {
      await apiService.purchaseSweet(id, quantity);
      await fetchSweets();
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteSweet(id);
      await fetchSweets();
    } catch (err) {
      throw err;
    }
  };

  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setShowAddForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Sweet Shop</h1>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Search & Filter</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="bg-purple-500 text-white font-semibold py-2 rounded-lg hover:bg-purple-600 transition"
            >
              Search
            </button>
          </form>
          <button
            onClick={handleClearSearch}
            className="text-purple-500 hover:underline text-sm font-semibold"
          >
            Clear Search
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Admin Actions */}
        {user?.isAdmin && (
          <div className="mb-8">
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditingSweet(null);
              }}
              className="bg-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-600 transition"
            >
              {showAddForm ? 'Cancel' : 'Add New Sweet'}
            </button>

            {showAddForm && (
              <AdminSweetForm
                sweet={editingSweet || undefined}
                onSubmit={async () => {
                  setShowAddForm(false);
                  setEditingSweet(null);
                  await fetchSweets();
                }}
              />
            )}
          </div>
        )}

        {/* Sweets Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading sweets...</p>
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No sweets found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sweets.map(sweet => (
              <SweetCard
                key={sweet._id}
                sweet={sweet}
                onPurchase={handlePurchase}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface AdminSweetFormProps {
  sweet?: Sweet;
  onSubmit: () => void;
}

const AdminSweetForm: React.FC<AdminSweetFormProps> = ({ sweet, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: sweet?.name || '',
    category: sweet?.category || '',
    price: sweet?.price || '',
    quantity: sweet?.quantity || '',
    description: sweet?.description || '',
    image: sweet?.image || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (sweet) {
        await apiService.updateSweet(sweet._id, {
          ...formData,
          price: Number(formData.price),
          quantity: Number(formData.quantity),
        });
      } else {
        await apiService.createSweet({
          ...formData,
          price: Number(formData.price),
          quantity: Number(formData.quantity),
        });
      }
      onSubmit();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save sweet';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h3 className="text-2xl font-semibold mb-4">{sweet ? 'Edit Sweet' : 'Add New Sweet'}</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            required
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            rows={3}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-purple-500 text-white font-semibold py-2 rounded-lg hover:bg-purple-600 transition disabled:bg-gray-400"
        >
          {loading ? 'Saving...' : sweet ? 'Update Sweet' : 'Add Sweet'}
        </button>
      </form>
    </div>
  );
};
