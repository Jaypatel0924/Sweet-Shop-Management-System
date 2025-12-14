import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, MapPin } from 'lucide-react';
import apiService from '../services/api';

interface CheckoutProps {
  onBack: () => void;
  onSuccess: (orderId: string, deliveryDate: string) => void;
}

interface DeliveryInfo {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

// Estimated delivery days by state
const DELIVERY_DAYS: { [key: string]: number } = {
  'Delhi': 1,
  'Maharashtra': 2,
  'Karnataka': 2,
  'Tamil Nadu': 2,
  'Uttar Pradesh': 2,
  'Rajasthan': 2,
  'Gujarat': 2,
  'Haryana': 1,
  'Punjab': 2,
  'West Bengal': 3,
  'Telangana': 3,
  'Andhra Pradesh': 3,
  'Madhya Pradesh': 3,
  'Bihar': 3,
  'Other': 5,
};

export const Checkout: React.FC<CheckoutProps> = ({ onBack, onSuccess }) => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  const totalAmount = getTotalPrice() * 1.18; // Including 18% tax
  const deliveryDays = DELIVERY_DAYS[deliveryInfo.state] || DELIVERY_DAYS['Other'];

  const calculateDeliveryDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + deliveryDays);
    return today.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDeliveryInfo({
      ...deliveryInfo,
      [e.target.name]: e.target.value,
    });
  };

  const initiatePayment = async () => {
    // Check authentication first
    if (!isAuthenticated) {
      setError('Please log in to place an order');
      return;
    }

    // Validate form
    if (!deliveryInfo.fullName || !deliveryInfo.email || !deliveryInfo.phone || 
        !deliveryInfo.street || !deliveryInfo.city || !deliveryInfo.state || !deliveryInfo.pincode) {
      setError('Please fill all delivery information fields');
      return;
    }

    if (!/^\d{10}$/.test(deliveryInfo.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    if (!/^\d{6}$/.test(deliveryInfo.pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Create order in backend
      const orderResponse = await apiService.createOrder({
        items: items.map(item => ({
          sweetId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
        })),
        totalAmount,
        deliveryInfo,
        estimatedDeliveryDate: calculateDeliveryDate(),
      });

      const orderId = orderResponse.order._id;
      const razorpayOrderId = orderResponse.order.razorpayOrderId;
      const amountInPaise = Math.round(totalAmount * 100);

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_DoDqVroQiFWCCE',
        amount: amountInPaise,
        currency: 'INR',
        name: 'Sweet Shop',
        description: `Order #${orderId}`,
        order_id: razorpayOrderId,
        prefill: {
          name: deliveryInfo.fullName,
          email: deliveryInfo.email,
          contact: deliveryInfo.phone,
        },
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await apiService.verifyPayment({
              orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (verifyResponse.success) {
              clearCart();
              onSuccess(orderId, calculateDeliveryDate());
            }
          } catch (err) {
            setError('Payment verification failed. Please try again.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError('Payment cancelled');
          },
        },
      };

      // Check if Razorpay is loaded
      if (!(window as any).Razorpay) {
        setError('Payment system not loaded. Please refresh the page and try again.');
        setLoading(false);
        return;
      }

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      let message = 'Failed to create order';
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'object' && err !== null) {
        const axiosError = err as any;
        if (axiosError.response?.data?.message) {
          message = axiosError.response.data.message;
        } else if (axiosError.response?.statusText) {
          message = axiosError.response.statusText;
        }
      }
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-amber-600 hover:text-orange-600 font-semibold mb-8"
        >
          <ChevronLeft size={20} />
          Back to Cart
        </button>

        <h1 className="text-4xl font-bold text-gray-800 mb-8">Checkout</h1>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Delivery Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <MapPin size={24} className="text-orange-600" />
                Delivery Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name *"
                  value={deliveryInfo.fullName}
                  onChange={handleInputChange}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={deliveryInfo.email}
                  onChange={handleInputChange}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone (10 digits) *"
                  value={deliveryInfo.phone}
                  onChange={handleInputChange}
                  maxLength={10}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <input
                  type="text"
                  name="street"
                  placeholder="Street Address *"
                  value={deliveryInfo.street}
                  onChange={handleInputChange}
                  className="md:col-span-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={deliveryInfo.city}
                  onChange={handleInputChange}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <select
                  name="state"
                  value={deliveryInfo.state}
                  onChange={handleInputChange}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                >
                  <option value="">Select State *</option>
                  {Object.keys(DELIVERY_DAYS).map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode (6 digits) *"
                  value={deliveryInfo.pincode}
                  onChange={handleInputChange}
                  maxLength={6}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-green-700 font-semibold">
                  📦 Estimated Delivery: {calculateDeliveryDate()} ({deliveryDays} day{deliveryDays !== 1 ? 's' : ''})
                </p>
              </div>
            </div>

            {/* Order Items Summary */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Items</h2>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item._id} className="flex justify-between items-center pb-4 border-b">
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.selectedSize} × {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Payment */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Total</h2>

              <div className="space-y-3 mb-6 border-b pb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (18%)</span>
                  <span>₹{(getTotalPrice() * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-800 mb-6">
                <span>Total</span>
                <span className="text-orange-600">₹{totalAmount.toFixed(2)}</span>
              </div>

              <button
                onClick={initiatePayment}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition disabled:bg-gray-400 mb-3"
              >
                {loading ? '⏳ Processing...' : '💳 Pay with Razorpay'}
              </button>

              <p className="text-xs text-gray-600 text-center">
                🔒 Secure payment powered by Razorpay
              </p>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-700 text-sm font-semibold mb-2">🧪 Test Card Details:</p>
                <p className="text-blue-600 text-xs">Card: 4111 1111 1111 1111</p>
                <p className="text-blue-600 text-xs">Exp: 12/25 | CVV: 123</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  );
};
