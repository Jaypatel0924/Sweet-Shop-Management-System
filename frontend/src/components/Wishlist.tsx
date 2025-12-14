import React from 'react';
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

interface WishlistProps {
  onBack?: () => void;
}

export const Wishlist: React.FC<WishlistProps> = ({ onBack }) => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (item: any) => {
    addItem({
      _id: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      selectedSize: '200g',
      image: item.image,
      emoji: item.emoji,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold mb-4 transition-colors"
            >
              <ArrowLeft size={20} /> Back to Shopping
            </button>
          )}
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Heart size={40} fill="currentColor" className="text-red-600" />
            <span className="bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent">
              My Wishlist
            </span>
          </h1>
          <p className="text-gray-600">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-6">
              Start adding your favorite sweets to your wishlist!
            </p>
            {onBack && (
              <button
                onClick={onBack}
                className="inline-block bg-gradient-to-r from-red-600 to-red-700 text-white font-bold px-8 py-3 rounded-lg hover:shadow-lg transition-shadow"
              >
                Continue Shopping
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Image Section */}
                <div className="relative h-64 bg-gradient-to-b from-pink-100 to-pink-50 flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-56 w-56 object-cover rounded-full border-4 border-pink-300 group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-6xl">{item.emoji || '🍬'}</div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(item._id)}
                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-110"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={20} className="text-red-500 hover:text-red-700" />
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 capitalize">{item.category}</p>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-red-600">₹{item.price}</span>
                    <Heart
                      size={24}
                      fill="currentColor"
                      className="text-red-600 animate-pulse"
                    />
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart size={20} /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
