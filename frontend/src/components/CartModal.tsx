import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout?: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onCheckout }) => {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const total = getTotalPrice();
  const tax = Math.round(total * 0.05 * 100) / 100; // 5% tax
  const shipping = total > 500 ? 0 : 50; // Free shipping above 500
  const grandTotal = total + tax + shipping;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end animate-fade-in">
      {/* Modal */}
      <div className="bg-white w-full max-w-md h-screen flex flex-col shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart size={24} />
            <h2 className="text-xl font-bold">Shopping Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-red-800 p-1 rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500 font-semibold mb-2">Your cart is empty</p>
              <p className="text-gray-400 text-sm">Add some sweets to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  {/* Item Header */}
                  <div className="flex gap-3 mb-3">
                    <img
                      src={item.image || 'https://via.placeholder.com/80'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border-2 border-pink-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
                      <p className="text-red-600 font-bold">₹{item.price}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between bg-white rounded-lg border border-gray-300 p-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="hover:bg-gray-100 p-1 rounded transition-colors"
                    >
                      <Minus size={16} className="text-gray-600" />
                    </button>
                    <span className="font-semibold text-gray-800 w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="hover:bg-gray-100 p-1 rounded transition-colors"
                    >
                      <Plus size={16} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="mt-3 text-right">
                    <p className="text-sm text-gray-600">
                      Subtotal: <span className="font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="p-4 space-y-3 bg-gray-50">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span className="font-semibold">₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax (5%):</span>
              <span className="font-semibold">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                Shipping:
              </span>
              <span className="font-semibold">
                {shipping === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  `₹${shipping.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="border-t border-gray-300 pt-3 flex justify-between bg-white p-3 rounded-lg">
              <span className="text-lg font-bold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-red-600">₹{grandTotal.toFixed(2)}</span>
            </div>

            {shipping > 0 && (
              <p className="text-xs text-green-600 text-center">
                Add ₹{(500 - total).toFixed(2)} more for FREE shipping!
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          {items.length > 0 && (
            <>
              <button 
                onClick={() => {
                  onCheckout?.();
                  onClose();
                }}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl">
                Proceed to Checkout
              </button>
              <button
                onClick={clearCart}
                className="w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear Cart
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
