import React, { useState, useEffect } from 'react';
import { Sweet } from '../types';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingCart, Trash2, Edit2, Star, Heart, Phone, Mail, MapPin } from 'lucide-react';

interface DashboardProps {
  onNavigateToCart?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [likedSweets, setLikedSweets] = useState<string[]>([]);
  const { user } = useAuth();
  const { addItem } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const sizeOptions = ['200g', '400g', '500g', '1kg'];

  useEffect(() => {
    fetchSweets();
  }, []);

  useEffect(() => {
    filterByCategory(selectedCategory);
  }, [sweets, selectedCategory]);

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

  const filterByCategory = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredSweets(sweets);
    } else {
      setFilteredSweets(sweets.filter(s => s.category.toUpperCase() === category.toUpperCase()));
    }
  };

  const handleAddToCart = (sweet: Sweet) => {
    addItem({
      _id: sweet._id,
      name: sweet.name,
      price: sweet.price,
      quantity: 1,
      selectedSize: sizeOptions[0],
      image: sweet.image,
      emoji: sweet.emoji,
    });
  };

  const toggleLike = (sweet: Sweet) => {
    setLikedSweets(prev => 
      prev.includes(sweet._id) 
        ? prev.filter(id => id !== sweet._id)
        : [...prev, sweet._id]
    );
    
    // Also sync with wishlist
    if (isInWishlist(sweet._id)) {
      removeFromWishlist(sweet._id);
    } else {
      addToWishlist(sweet);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        await apiService.deleteSweet(id);
        setSweets(sweets.filter(s => s._id !== id));
      } catch (err) {
        alert('Failed to delete sweet');
      }
    }
  };

  const BestsellerCard: React.FC<{ sweet: Sweet; index: number }> = ({ sweet, index }) => (
    <div className="animate-fade-in group" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        <div className="relative h-64 bg-gradient-to-b from-pink-100 to-pink-50 flex items-center justify-center overflow-hidden">
          <img src={sweet.image || 'https://via.placeholder.com/200'} alt={sweet.name} className="h-48 w-48 object-cover rounded-full border-4 border-pink-300 shadow-lg" />
          <button
            onClick={() => toggleLike(sweet)}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-110"
          >
            <Heart size={20} fill={isInWishlist(sweet._id) ? '#EF4444' : 'none'} color={isInWishlist(sweet._id) ? '#EF4444' : '#999'} />
          </button>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{sweet.name}</h3>
          <p className="text-yellow-600 font-semibold text-sm mb-3">₹{sweet.price}</p>
          <button
            onClick={() => handleAddToCart(sweet)}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
          >
            <ShoppingCart size={18} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  const NewArrivalCard: React.FC<{ sweet: Sweet; index: number }> = ({ sweet, index }) => (
    <div className="animate-fade-in group" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
        <div className="h-48 bg-gradient-to-b from-blue-100 to-blue-50 flex items-center justify-center">
          <img src={sweet.image || 'https://via.placeholder.com/150'} alt={sweet.name} className="h-40 w-40 object-cover rounded-full shadow-md" />
        </div>
        <div className="p-3">
          <h4 className="text-sm font-bold text-gray-700 mb-1">{sweet.name}</h4>
          <p className="text-yellow-600 font-semibold text-sm mb-2">₹{sweet.price}</p>
          <button
            onClick={() => handleAddToCart(sweet)}
            className="w-full bg-red-500 text-white py-1 text-sm rounded hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-2xl text-red-600 font-bold">Loading...</div>;
  }

  return (
    <div className="w-full bg-white overflow-hidden">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out;
        }
        .hover-bounce:hover {
          animation: bounce 0.6s ease-in-out;
        }
        .emoji-float {
          animation: float 3s ease-in-out infinite;
        }
      `}
      </style>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-700 text-white py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl emoji-float">🍭</div>
          <div className="absolute top-20 right-20 text-6xl emoji-float" style={{ animationDelay: '0.5s' }}>🍪</div>
          <div className="absolute bottom-10 left-1/3 text-6xl emoji-float" style={{ animationDelay: '1s' }}>🌰</div>
          <div className="absolute bottom-20 right-10 text-5xl emoji-float" style={{ animationDelay: '1.5s' }}>✨</div>
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="animate-slide-in-left">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">OM SWEETS</h1>
              <p className="text-xl md:text-2xl mb-6 text-yellow-100">Pure Taste of Tradition</p>
              <p className="text-lg mb-6 opacity-90">Handcrafted sweets and snacks prepared with love and finest ingredients</p>
              <button
                onClick={() => document.getElementById('bestsellers')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-yellow-400 text-red-700 px-8 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Shop Now
              </button>
            </div>
            <div className="animate-slide-in-right flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-20"></div>
                <div className="w-72 h-72 bg-gradient-to-br from-yellow-100 to-pink-100 rounded-full flex items-center justify-center text-8xl shadow-2xl">🍭</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tagline */}
      <section className="text-center py-8 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-red-600 italic mb-2 animate-fade-in">
          Making traditions sweet
        </h2>
      </section>

      {/* Shop by Range */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 animate-fade-in">Shop by range</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: 'SWEETS', emoji: '🍭', color: 'from-red-400 to-red-500' },
              { name: 'NAMKEENS', emoji: '🍪', color: 'from-orange-400 to-orange-500' },
              { name: 'COOKIES', emoji: '🍩', color: 'from-yellow-400 to-yellow-500' },
              { name: 'DRY FRUITS', emoji: '🌰', color: 'from-green-400 to-green-500' },
            ].map((cat, idx) => (
              <button
                key={idx}
                onClick={() => filterByCategory(cat.name)}
                className="animate-fade-in group hover-bounce"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`bg-gradient-to-b ${cat.color} p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2`}>
                  <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">{cat.emoji}</div>
                  <h3 className="text-lg font-bold text-white">{cat.name}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Timeless Taste of Tradition */}
      <section className="py-12 bg-gradient-to-r from-pink-300 to-pink-200 relative overflow-hidden">
        <div className="absolute right-0 top-0 text-9xl opacity-10 emoji-float">🎉</div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Timeless Taste of Tradition</h2>
            <p className="text-white text-lg">Experience the authentic flavors passed down through generations</p>
          </div>
        </div>
      </section>

      {/* Our Bestsellers */}
      <section id="bestsellers" className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2 animate-fade-in">Our Bestsellers</h2>
          <p className="text-center text-gray-600 mb-12 animate-fade-in">Customer favorites that keep them coming back</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sweets.slice(0, 3).map((sweet, idx) => (
              <BestsellerCard key={sweet._id} sweet={sweet} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Festival Special Section */}
      <section className="py-12 bg-gradient-to-r from-amber-600 to-yellow-600 relative overflow-hidden">
        <div className="absolute left-0 top-1/2 text-9xl opacity-10 emoji-float">🏆</div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-2 animate-fade-in">Festival Special</h2>
          <p className="text-center text-white text-lg mb-8 animate-fade-in">Celebrate with our exclusive festival collection</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sweets.slice(3, 6).map((sweet, idx) => (
              <div key={sweet._id} className="animate-fade-in bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="h-56 bg-gradient-to-b from-yellow-100 to-yellow-50 flex items-center justify-center relative">
                  <img src={sweet.image || 'https://via.placeholder.com/150'} alt={sweet.name} className="h-40 w-40 object-cover rounded-full border-4 border-yellow-200 shadow-lg" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{sweet.name}</h3>
                  <p className="text-yellow-600 font-semibold mb-3">₹{sweet.price}</p>
                  <button
                    onClick={() => handleAddToCart(sweet)}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-2 animate-fade-in">New Arrivals</h2>
          <p className="text-center text-gray-600 mb-12 animate-fade-in">Fresh additions to our collection</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sweets.slice(-4).map((sweet, idx) => (
              <NewArrivalCard key={sweet._id} sweet={sweet} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Sweetest News and Updates */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 animate-fade-in">Sweetest News And Updates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'New Diwali Collection', desc: 'Experience traditional sweets with modern twist', emoji: '🪔' },
              { title: 'Express Delivery', desc: 'Get your favorite sweets delivered within 2 hours', emoji: '🚚' },
              { title: 'Festival Offers', desc: 'Special discounts on bulk orders for celebrations', emoji: '🎊' },
            ].map((news, idx) => (
              <div key={idx} className="animate-fade-in bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full mb-4 flex items-center justify-center text-3xl shadow-lg">{news.emoji}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{news.title}</h3>
                <p className="text-gray-600">{news.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop All Year Inside */}
      <section className="py-12 bg-gradient-to-r from-pink-300 to-pink-200 relative overflow-hidden">
        <div className="absolute left-0 bottom-0 text-9xl opacity-10 emoji-float">🏪</div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12 animate-fade-in">Shop All Year Inside</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Main Store', addr: 'Downtown Delhi', emoji: '🏬' },
              { name: 'Festival Mall', addr: 'Shopping District', emoji: '🏢' },
              { name: 'Heritage Corner', addr: 'Old City Market', emoji: '🏛️' },
            ].map((store, idx) => (
              <div key={idx} className="animate-fade-in bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="h-40 bg-gradient-to-b from-gray-300 to-gray-200 flex items-center justify-center text-6xl">{store.emoji}</div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-bold text-gray-800">{store.name}</h3>
                  <p className="text-gray-600">{store.addr}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 animate-fade-in">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Rajesh Kumar', rating: 5, text: 'Best sweets in town! Fresh and delicious every time.', emoji: '👨' },
              { name: 'Priya Singh', rating: 5, text: 'Perfect quality and fast delivery. Highly recommended!', emoji: '👩' },
              { name: 'Amit Patel', rating: 5, text: 'Authentic taste with traditional preparation methods.', emoji: '🧔' },
            ].map((testimonial, idx) => (
              <div key={idx} className="animate-fade-in bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{testimonial.emoji}</div>
                  <div>
                    <p className="font-bold text-gray-800">{testimonial.name}</p>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} fill="#FFD700" color="#FFD700" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-12 bg-gradient-to-r from-red-600 to-red-700 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 text-9xl opacity-10 emoji-float">💌</div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Subscribe To Our List</h2>
              <p className="text-lg mb-6 text-yellow-100">Get exclusive offers, new arrivals, and special deals delivered to your inbox</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                />
                <button className="bg-yellow-400 text-red-700 px-8 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="animate-slide-in-right flex justify-center text-8xl opacity-80">💌</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="animate-fade-in">
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">OM SWEETS</h3>
              <p className="text-gray-300">Traditional sweets, modern taste. Since 1995.</p>
            </div>
            <div className="animate-fade-in">
              <h4 className="font-bold mb-4 text-yellow-400">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-yellow-400 transition-colors duration-300">About Us</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors duration-300">Contact</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors duration-300">Delivery Info</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors duration-300">FAQs</a></li>
              </ul>
            </div>
            <div className="animate-fade-in">
              <h4 className="font-bold mb-4 text-yellow-400">Follow Us</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-yellow-400 transition-colors duration-300">Facebook</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors duration-300">Instagram</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors duration-300">Twitter</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors duration-300">YouTube</a></li>
              </ul>
            </div>
            <div className="animate-fade-in">
              <h4 className="font-bold mb-4 text-yellow-400">Contact Info</h4>
              <p className="text-gray-300 flex items-center gap-2 mb-2">
                <Phone size={16} /> +91 98765 23504
              </p>
              <p className="text-gray-300 flex items-center gap-2 mb-2">
                <Mail size={16} /> info@omsweet&co.com
              </p>
              <p className="text-gray-300 flex items-center gap-2">
                <MapPin size={16} /> New Delhi, India
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2025 OM SWEETS & CO. All rights reserved. Crafted with love 💛</p>
          </div>
        </div>
      </footer>

      {/* Admin Panel */}
      {user?.isAdmin && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 animate-fade-in">Admin Panel</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="mb-8 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {showAddForm ? '✕ Cancel' : '+ Add New Sweet'}
            </button>

            {showAddForm && <AdminSweetForm onSuccess={() => { setShowAddForm(false); fetchSweets(); }} />}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sweets.map((sweet) => (
                <div key={sweet._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <img src={sweet.image} alt={sweet.name} className="w-full h-40 object-cover rounded-lg mb-3 shadow-md" />
                  <h3 className="text-lg font-bold text-gray-800">{sweet.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{sweet.category}</p>
                  <p className="font-bold text-red-600 mb-3">₹{sweet.price}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingSweet(sweet)}
                      className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sweet._id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {editingSweet && <AdminSweetForm sweet={editingSweet} onSuccess={() => { setEditingSweet(null); fetchSweets(); }} />}
    </div>
  );
};

interface AdminSweetFormProps {
  sweet?: Sweet;
  onSuccess?: () => void;
}

const AdminSweetForm: React.FC<AdminSweetFormProps> = ({ sweet, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: sweet?.name || '',
    price: sweet?.price || 0,
    category: sweet?.category || '',
    image: sweet?.image || '',
    description: sweet?.description || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (sweet) {
        await apiService.updateSweet(sweet._id, formData);
      } else {
        await apiService.createSweet(formData);
      }
      onSuccess?.();
    } catch (err) {
      alert('Failed to save sweet');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-96 overflow-y-auto shadow-2xl transform transition-all duration-300 animate-fade-in">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">{sweet ? 'Edit' : 'Add'} Sweet</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
            required
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
            required
          >
            <option value="">Select Category</option>
            <option value="SWEETS">SWEETS</option>
            <option value="NAMKEENS">NAMKEENS</option>
            <option value="COOKIES">COOKIES</option>
            <option value="DRY FRUITS">DRY FRUITS</option>
            <option value="MATHI">MATHI</option>
          </select>
          <input
            type="text"
            placeholder="Image URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2 rounded hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            {sweet ? 'Update' : 'Create'} Sweet
          </button>
        </form>
      </div>
    </div>
  );
};


