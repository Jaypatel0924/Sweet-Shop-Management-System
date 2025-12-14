import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigation } from '../App';
import { ShoppingCart, Heart } from 'lucide-react';
import { CartModal } from './CartModal';

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { navigateTo } = useNavigation();
  const { getTotalItems } = useCart();
  const { getWishlistCount } = useWishlist();
  const [showCartModal, setShowCartModal] = useState(false);
  const cartItemCount = getTotalItems();
  const wishlistCount = getWishlistCount();

  const handleLogout = () => {
    logout();
    navigateTo('login');
  };

  const handleAdminClick = () => {
    navigateTo('admin');
  };

  return (
    <>
      {/* Delivery Banner */}
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 text-gray-800 py-2 px-6 text-center font-semibold text-sm">
        🚚 Free Delivery on Orders Above ₹500 | Fresh Sweets Delivered Daily
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 border-b-2 border-yellow-300 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          {/* Top Row - Logo and Main Nav */}
          <div className="flex items-center justify-between mb-3">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group hover:opacity-80 transition-opacity"
              onClick={() => navigateTo('dashboard')}
            >
              <div className="text-4xl animate-bounce-soft">🍬</div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                  Sweet Shop
                </h1>
                <p className="text-xs text-gray-500 font-semibold">Premium Confectionery Store</p>
              </div>
            </div>

            {/* Right Side - User & Actions */}
            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <>
                  {/* Cart Icon */}
                  <button
                    onClick={() => setShowCartModal(true)}
                    className="relative hover:scale-110 transition-transform duration-300 group"
                    title="View Cart"
                  >
                    <div className="bg-gradient-to-br from-red-600 to-red-700 p-2.5 rounded-full text-white hover:shadow-lg transition-shadow">
                      <ShoppingCart size={24} />
                    </div>
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-700 font-bold px-2 py-1 rounded-full text-xs animate-pulse shadow-lg">
                        {cartItemCount}
                      </span>
                    )}
                  </button>

                  {/* Wishlist Icon */}
                  <button
                    onClick={() => navigateTo('wishlist')}
                    className="relative hover:scale-110 transition-transform duration-300 group"
                    title="View Wishlist"
                  >
                    <div className="bg-pink-100 p-2.5 rounded-full text-pink-600 hover:bg-pink-200 hover:shadow-lg transition-all">
                      <Heart size={24} />
                    </div>
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white font-bold px-2 py-1 rounded-full text-xs animate-pulse shadow-lg">
                        {wishlistCount}
                      </span>
                    )}
                  </button>

                  {/* User Info */}
                  <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">
                        {user?.username}
                      </p>
                      {user?.isAdmin && (
                        <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 px-2 py-0.5 rounded-full text-xs font-bold">
                          👑 ADMIN
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Orders Button */}
                  <button
                    onClick={() => navigateTo('orders')}
                    className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap"
                  >
                    📦 Orders
                  </button>

                  {/* Admin Button */}
                  {user?.isAdmin && (
                    <button
                      onClick={handleAdminClick}
                      className="px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800 font-semibold rounded-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap"
                    >
                      ⚙️ Admin
                    </button>
                  )}

                  {/* Delivery Manager Button */}
                  {(user?.isAdmin || (user as any)?.role === 'delivery') && (
                    <button
                      onClick={() => navigateTo('delivery')}
                      className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap"
                    >
                      🚚 Delivery
                    </button>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-red-600 font-semibold border-2 border-red-600 rounded-lg hover:bg-red-50 active:scale-95 transition-all duration-200 whitespace-nowrap"
                  >
                    Logout
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <button
                  onClick={() => navigateTo('login')}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  Login / Register
                </button>
              )}
            </div>
          </div>

         
        </div>
      </header>

      {/* Cart Modal */}
      <CartModal 
        isOpen={showCartModal} 
        onClose={() => setShowCartModal(false)}
        onCheckout={() => {
          navigateTo('checkout');
          setShowCartModal(false);
        }}
      />
    </>
  );
};
