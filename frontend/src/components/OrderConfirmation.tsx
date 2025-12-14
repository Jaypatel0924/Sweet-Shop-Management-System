import React from 'react';
import { CheckCircle, Package, MapPin } from 'lucide-react';

interface OrderConfirmationProps {
  orderId: string;
  deliveryDate: string;
  onContinueShopping: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderId,
  deliveryDate,
  onContinueShopping,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center animate-fade-in">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={80} className="text-green-600" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Order Confirmed! 🎉</h1>
          <p className="text-gray-600 text-lg mb-8">Thank you for your order! We're preparing your delicious sweets.</p>

          {/* Order Details */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-700 font-semibold">Order ID:</span>
              <span className="text-green-600 font-bold text-lg"># {orderId.slice(-8).toUpperCase()}</span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b">
              <span className="flex items-center gap-2 text-gray-700 font-semibold">
                <Package size={20} className="text-orange-600" />
                Estimated Delivery
              </span>
              <span className="font-bold text-gray-800">{deliveryDate}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-gray-700 font-semibold">
                <MapPin size={20} className="text-red-600" />
                Status
              </span>
              <span className="px-4 py-2 bg-green-200 text-green-800 font-bold rounded-full">
                Processing
              </span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8 text-left">
            <h3 className="font-bold text-blue-900 mb-3">📧 What Happens Next?</h3>
            <ul className="text-blue-800 space-y-2 text-sm">
              <li>✓ Order confirmation email has been sent to your registered email</li>
              <li>✓ We'll start preparing your sweets immediately</li>
              <li>✓ You'll receive a tracking update soon</li>
              <li>✓ Delivery expected by {deliveryDate}</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm mb-1">📞 Support</p>
              <p className="font-bold text-gray-800">+91-XXXX-XXXX-XX</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm mb-1">📧 Email</p>
              <p className="font-bold text-gray-800">support@sweetshop.com</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onContinueShopping}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition"
            >
              Continue Shopping 🛍️
            </button>
            <button
              onClick={() => window.print()}
              className="w-full py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
            >
              Print Order Receipt
            </button>
          </div>

          {/* Bottom Message */}
          <p className="text-gray-500 text-sm mt-8">
            Order ID: {orderId} - Keep this for your records
          </p>
        </div>
      </div>
    </div>
  );
};
