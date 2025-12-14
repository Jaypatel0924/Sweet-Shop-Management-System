import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle, ShoppingBag } from 'lucide-react';

interface PaymentSummaryProps {
  onCheckout?: () => void;
  isCheckingOut?: boolean;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  onCheckout,
  isCheckingOut = false,
}) => {
  const { items, getTotalPrice, getTotalItems } = useCart();
  const subtotal = getTotalPrice();
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% tax
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping above 500
  const total = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600 font-semibold">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-xl p-6 border-2 border-red-100">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        💳 Order Summary
      </h2>

      {/* Items Count */}
      <div className="mb-4 pb-4 border-b-2 border-gray-200">
        <p className="text-gray-700">
          <span className="font-semibold">{getTotalItems()}</span> item{getTotalItems() !== 1 ? 's' : ''} in cart
        </p>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-4 pb-4 border-b-2 border-gray-300">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Subtotal:</span>
          <span className="text-xl font-bold text-gray-800">₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Tax (5%):</span>
          <span className="text-lg font-bold text-gray-800">₹{tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Shipping:</span>
          <span className={`text-lg font-bold ${shipping === 0 ? 'text-green-600' : 'text-gray-800'}`}>
            {shipping === 0 ? (
              <span className="flex items-center gap-1">
                <CheckCircle size={18} /> FREE
              </span>
            ) : (
              `₹${shipping.toFixed(2)}`
            )}
          </span>
        </div>

        {/* Free Shipping Message */}
        {shipping > 0 && (
          <p className="text-xs text-center text-green-600 bg-green-50 p-2 rounded mt-2">
            🎁 Add ₹{(500 - subtotal).toFixed(2)} more for FREE shipping!
          </p>
        )}
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-white font-bold text-lg">Total to Pay:</span>
          <span className="text-3xl font-bold text-white">₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={isCheckingOut}
        className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
          isCheckingOut
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-xl hover:scale-105 active:scale-95'
        }`}
      >
        {isCheckingOut ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            Processing...
          </>
        ) : (
          <>
            <CheckCircle size={24} />
            Proceed to Checkout
          </>
        )}
      </button>

      {/* Security Note */}
      <p className="text-center text-xs text-gray-500 mt-4">
        🔒 Secure & encrypted payment. Your information is safe with us.
      </p>

      {/* Terms */}
      <p className="text-center text-xs text-gray-400 mt-3">
        By clicking checkout, you agree to our Terms & Conditions
      </p>
    </div>
  );
};
