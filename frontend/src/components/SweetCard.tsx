import React, { useState } from 'react';
import { Sweet } from '../types';
import { useAuth } from '../context/AuthContext';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: string, quantity: number) => Promise<void>;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (id: string) => Promise<void>;
}

export const SweetCard: React.FC<SweetCardProps> = ({ sweet, onPurchase, onEdit, onDelete }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handlePurchase = async () => {
    setError('');
    setLoading(true);
    try {
      await onPurchase(sweet._id, quantity);
      setQuantity(1);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Purchase failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return;
    try {
      if (onDelete) {
        await onDelete(sweet._id);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      setError(message);
    }
  };

  const isInStock = sweet.quantity > 0;
  const stockPercentage = (sweet.quantity / 100) * 100;

  return (
    <div
      className="card-elevated overflow-hidden group animate-fade-in hover:shadow-xl"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-100 h-48">
        {sweet.image && (
          <img
            src={sweet.image}
            alt={sweet.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        )}
        {!sweet.image && (
          <div className="w-full h-full bg-gradient-candy flex items-center justify-center text-4xl">
            {sweet.emoji || '🍬'}
          </div>
        )}

        {/* Stock Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white ${isInStock ? 'bg-green-500' : 'bg-red-500'}`}>
          {isInStock ? '✓ In Stock' : '✗ Out of Stock'}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-semibold text-candy-purple">
          {sweet.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Name */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:gradient-text transition">
          {sweet.name}
        </h3>

        {/* Description */}
        {sweet.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{sweet.description}</p>
        )}

        {/* Price and Stock */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Price</p>
            <p className="text-3xl font-bold gradient-text">₹{sweet.price.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Stock</p>
            <p className="text-lg font-bold text-gray-800">{sweet.quantity}</p>
          </div>
        </div>

        {/* Stock Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full transition-all duration-500 ${
              stockPercentage > 50
                ? 'bg-gradient-to-r from-green-400 to-green-500'
                : stockPercentage > 25
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                : 'bg-gradient-to-r from-red-400 to-red-500'
            }`}
            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
          ></div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
            <p className="text-red-700 font-semibold text-xs">{error}</p>
          </div>
        )}

        {/* Purchase Section */}
        {isInStock ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max={sweet.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(parseInt(e.target.value) || 1, sweet.quantity))}
                className="w-16 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-candy-purple focus:ring-2 focus:ring-purple-500/20 font-semibold"
              />
              <button
                onClick={handlePurchase}
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">🛒</span> Processing...
                  </>
                ) : (
                  <>
                    🛒 Buy Now
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <button
            disabled
            className="w-full py-3 bg-gray-200 text-gray-600 font-semibold rounded-lg cursor-not-allowed"
          >
            Out of Stock
          </button>
        )}

        {/* Admin Actions */}
        {user?.isAdmin && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => onEdit && onEdit(sweet)}
              className="flex-1 btn-secondary text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 btn-secondary text-red-600 border-red-600 hover:bg-red-50"
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
