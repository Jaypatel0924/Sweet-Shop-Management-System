import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, CheckCircle, Clock, Truck } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  paymentStatus: 'completed' | 'pending';
}

interface OrderDisplayProps {
  onBack?: () => void;
}

export const OrderDisplay: React.FC<OrderDisplayProps> = ({ onBack }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Load orders from localStorage (in production, this would be from API)
    const savedOrders = localStorage.getItem('sweet_shop_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    setLoading(false);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={24} className="text-green-600" />;
      case 'shipped':
        return <Truck size={24} className="text-blue-600" />;
      case 'confirmed':
        return <Package size={24} className="text-orange-600" />;
      default:
        return <Clock size={24} className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'shipped':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'confirmed':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered ✓';
      case 'shipped':
        return 'On The Way 🚚';
      case 'confirmed':
        return 'Confirmed 📦';
      default:
        return 'Pending ⏳';
    }
  };

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-2 text-red-600 font-semibold mb-6 hover:text-red-700 transition-colors"
          >
            <ArrowLeft size={20} /> Back to Orders
          </button>

          {/* Order Details Card */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Order #{selectedOrder.orderNumber}</h1>
                  <p className="text-red-100">Placed on {new Date(selectedOrder.date).toLocaleDateString()}</p>
                </div>
                <div className={`px-4 py-2 rounded-lg border-2 font-bold flex items-center gap-2 ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusIcon(selectedOrder.status)}
                  {getStatusText(selectedOrder.status)}
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Items</h2>
              <div className="space-y-4">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg border-2 border-pink-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">Quantity: <span className="font-bold">{item.quantity}</span></p>
                      <p className="text-gray-600 text-sm">Price per item: <span className="font-bold">₹{item.price}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-red-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Summary</h2>
              <div className="space-y-3 mb-4 pb-4 border-b-2 border-gray-300">
                <div className="flex justify-between text-gray-700">
                  <span className="font-semibold">Subtotal:</span>
                  <span className="font-semibold">₹{selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-semibold">Tax (5%):</span>
                  <span className="font-semibold">₹{selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-semibold">
                    Shipping:
                  </span>
                  <span className={`font-semibold ${selectedOrder.shipping === 0 ? 'text-green-600' : ''}`}>
                    {selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center bg-white p-4 rounded-lg border-2 border-red-300">
                <span className="text-xl font-bold text-gray-800">Total Amount:</span>
                <span className="text-3xl font-bold text-red-600">₹{selectedOrder.total.toFixed(2)}</span>
              </div>

              {/* Payment Status */}
              <div className={`mt-4 p-4 rounded-lg border-2 font-bold text-center ${
                selectedOrder.paymentStatus === 'completed'
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-yellow-50 border-yellow-300 text-yellow-700'
              }`}>
                💳 Payment Status: {selectedOrder.paymentStatus === 'completed' ? 'COMPLETED ✓' : 'PENDING'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Orders List View
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-red-600 font-semibold mb-4 hover:text-red-700 transition-colors"
            >
              <ArrowLeft size={20} /> Back
            </button>
          )}
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent mb-2">
            My Orders
          </h1>
          <p className="text-gray-600">Track and manage your sweet shop orders</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping for delicious sweets!</p>
            <button className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold px-6 py-3 rounded-lg hover:shadow-lg transition-shadow">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-102 overflow-hidden"
              >
                <div className="flex items-center gap-4 p-6">
                  {/* Status Icon */}
                  <div className={`p-4 rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                  </div>

                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        Order #{order.orderNumber}
                      </h3>
                      <span className={`px-4 py-2 rounded-lg border-2 font-bold ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      Placed on {new Date(order.date).toLocaleDateString()} • {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex gap-4 items-center">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg border border-pink-200"
                          />
                          {item.quantity > 1 && (
                            <span className="absolute -bottom-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {item.quantity}
                            </span>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-gray-500 text-sm">+{order.items.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">₹{order.total.toFixed(2)}</p>
                    <p className={`text-sm font-semibold ${order.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {order.paymentStatus === 'completed' ? '✓ Paid' : '⏳ Pending'}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="text-gray-400">
                    <ArrowLeft size={20} className="transform rotate-180" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
