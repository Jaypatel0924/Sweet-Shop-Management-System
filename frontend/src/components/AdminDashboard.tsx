import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2, Edit2, X, HelpCircle } from 'lucide-react';
import AdminGuide from './AdminGuide';

interface Sweet {
  _id?: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  emoji: string;
}

interface AdminDashboardProps {}

export default function AdminDashboard({}: AdminDashboardProps) {
  const [products, setProducts] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Sweet>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    category: 'sweets',
    image: '',
    emoji: '🍬',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [stats, setStats] = useState({ totalProducts: 0, totalValue: 0, lowStock: 0 });

  const categories = ['sweets', 'namkeen', 'cookies', 'dry-fruits', 'mathi'];

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sweets');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.sweets || []);
        
        // Calculate stats
        const total = data.sweets?.length || 0;
        const value = data.sweets?.reduce((sum: number, p: Sweet) => sum + (p.price * p.quantity), 0) || 0;
        const low = data.sweets?.filter((p: Sweet) => p.quantity < 10).length || 0;
        
        setStats({
          totalProducts: total,
          totalValue: value,
          lowStock: low
        });
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const url = editingId 
        ? `http://localhost:5000/api/sweets/${editingId}`
        : 'http://localhost:5000/api/sweets';
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          stock: formData.quantity,
          imageUrl: formData.image
        }),
      });

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: editingId 
            ? `${formData.name} updated successfully! ✅` 
            : `${formData.name} added successfully! 🎉` 
        });
        setFormData({
          name: '',
          description: '',
          price: 0,
          quantity: 0,
          category: 'sweets',
          image: '',
          emoji: '🍬',
        });
        setEditingId(null);
        setShowModal(false);
        fetchProducts();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to save sweet' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error connecting to server' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Sweet) => {
    setFormData(product);
    setEditingId(product._id || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      category: 'sweets',
      image: '',
      emoji: '🍬',
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/sweets/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Product deleted successfully!' });
        fetchProducts();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete product' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ChevronLeft size={24} />
            Back to Shop
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-candy-yellow to-candy-orange bg-clip-text text-transparent">
            Admin Inventory 🎯
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowGuide(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors"
              title="Show admin guide"
            >
              <HelpCircle size={20} />
              Help
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4 animate-slide-up">
            Manage Your Sweet Store ✨
          </h2>
          <p className="text-white/90 text-lg animate-fade-in">
            Add, edit, and manage all your delicious sweets and namkeens in one place
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Products */}
          <div className="card-elevated p-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Products</p>
                <p className="text-4xl font-bold text-purple-600 mt-2">{stats.totalProducts}</p>
              </div>
              <div className="text-5xl">📦</div>
            </div>
          </div>

          {/* Inventory Value */}
          <div className="card-elevated p-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Inventory Value</p>
                <p className="text-4xl font-bold text-candy-yellow mt-2">₹{stats.totalValue.toFixed(0)}</p>
              </div>
              <div className="text-5xl">💰</div>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="card-elevated p-6 bg-orange-50 border border-orange-200 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-700 text-sm font-medium">Low Stock Items</p>
                <p className="text-4xl font-bold text-orange-600 mt-2">{stats.lowStock}</p>
              </div>
              <div className="text-5xl">⚠️</div>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-8 p-4 rounded-lg animate-fade-in ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Products Grid */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Products</h3>
          {products.length === 0 ? (
            <div className="card-elevated p-12 text-center animate-fade-in">
              <p className="text-4xl mb-4">📭</p>
              <p className="text-xl text-gray-600">No products yet</p>
              <p className="text-gray-500 mt-2">Click "Add Product" to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div key={product._id} className="card-elevated overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  {/* Image */}
                  <div className="relative overflow-hidden bg-gray-100 h-40">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-candy flex items-center justify-center text-4xl">
                        {product.emoji || '🍬'}
                      </div>
                    )}
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white ${
                      product.quantity > 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of Stock'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-gray-800 text-lg">{product.name}</h4>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-700 font-semibold">
                        {product.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-bold text-candy-purple">₹{product.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Stock:</span>
                        <span className={`font-bold ${product.quantity < 10 ? 'text-orange-600' : 'text-green-600'}`}>
                          {product.quantity} units
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => product._id && handleDelete(product._id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">
                {editingId ? 'Edit Product ✏️' : 'Add New Product ✨'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Row 1: Name and Emoji */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Gulab Jamun"
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Emoji 😋
                  </label>
                  <input
                    type="text"
                    name="emoji"
                    value={formData.emoji}
                    onChange={handleInputChange}
                    maxLength={2}
                    placeholder="🍬"
                    className="input-field text-2xl text-center"
                  />
                </div>
              </div>

              {/* Row 2: Category and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleInputChange}
                    placeholder="299.99"
                    step="0.01"
                    required
                    className="input-field"
                  />
                </div>
              </div>

              {/* Row 3: Stock and Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity || ''}
                    onChange={handleInputChange}
                    placeholder="50"
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    required
                    className="input-field"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your product..."
                  required
                  rows={4}
                  className="input-field resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {editingId 
                    ? (loading ? 'Updating...' : 'Update Product')
                    : (loading ? 'Adding...' : 'Add Product')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Guide Modal */}
      {showGuide && <AdminGuide onClose={() => setShowGuide(false)} />}
    </div>
  );
}
