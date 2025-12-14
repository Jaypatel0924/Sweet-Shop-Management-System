import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { Package, Truck, MapPin, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  deliveryAddress: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  razorpayOrderId?: string;
  deliveryDate?: string;
  createdAt: string;
  estimatedDelivery?: string;
}

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.getUserOrders();
      setOrders(response.orders || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'confirmed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={20} />;
      case 'shipped':
        return <Truck size={20} />;
      case 'confirmed':
        return <Package size={20} />;
      case 'pending':
        return <Clock size={20} />;
      case 'cancelled':
        return <AlertCircle size={20} />;
      default:
        return <Package size={20} />;
    }
  };

  const getDeliveryDays = (): number => {
    const states: Record<string, number> = {
      'Delhi': 1,
      'NCR': 2,
      'Haryana': 2,
      'Punjab': 3,
      'Rajasthan': 3,
      'UP': 4,
      'Bihar': 4,
      'MP': 5,
    };
    
    return 3; // Default
  };

  const calculateEstimatedDelivery = (createdDate: string): string => {
    const date = new Date(createdDate);
    date.setDate(date.getDate() + getDeliveryDays());
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const OrderStatusTimeline: React.FC<{ status: string }> = ({ status }) => {
    const statuses = ['pending', 'confirmed', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(status as any);

    return (
      <div className="mt-6 mb-4">
        <div className="flex justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-300 -z-10"></div>
          <div 
            className="absolute top-5 left-0 h-1 bg-gradient-to-r from-red-600 to-red-500 -z-10 transition-all duration-500"
            style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
          ></div>

          {statuses.map((stat, index) => (
            <div key={stat} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  index <= currentIndex
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {stat === 'pending' && <Clock size={18} />}
                {stat === 'confirmed' && <CheckCircle size={18} />}
                {stat === 'shipped' && <Truck size={18} />}
                {stat === 'delivered' && <CheckCircle size={18} />}
              </div>
              <p className="text-xs font-semibold mt-2 text-gray-700 capitalize">{stat}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Package size={48} className="text-red-600" />
          </div>
          <p className="text-xl text-gray-700 font-semibold">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-12">
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
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}
      </style>

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-800 mb-3 flex items-center gap-3">
            <Package size={40} className="text-red-600" />
            Your Orders
          </h1>
          <p className="text-gray-600 text-lg">Track and manage all your sweet purchases</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8 flex items-center gap-3">
            <AlertCircle size={24} />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center animate-fade-in">
            <Package size={64} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No Orders Yet</h2>
            <p className="text-gray-600 text-lg mb-6">You haven't placed any orders yet. Start shopping for delicious sweets!</p>
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg font-bold hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Shop Now
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={order._id}
                className="animate-fade-in bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Order Header */}
                <div
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 cursor-pointer hover:from-red-700 hover:to-red-800 transition-all duration-300"
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <p className="text-sm text-red-100 mb-1">Order ID</p>
                      <p className="font-bold text-lg">{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-red-100 mb-1">Date</p>
                      <p className="font-bold text-lg flex items-center gap-2">
                        <Calendar size={18} />
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-red-100 mb-1">Total Amount</p>
                      <p className="font-bold text-lg text-yellow-300">₹{order.totalPrice}</p>
                    </div>
                    <div className="flex justify-end">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold capitalize transition-all ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details - Expandable */}
                {expandedOrder === order._id && (
                  <div className="p-8 bg-gray-50 animate-fade-in">
                    {/* Status Timeline */}
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Order Status</h3>
                      <OrderStatusTimeline status={order.status} />
                    </div>

                    {/* Delivery Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-red-600">
                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Truck size={20} className="text-red-600" />
                          Delivery Information
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Delivery Address</p>
                            <p className="font-semibold text-gray-800 flex items-center gap-2">
                              <MapPin size={16} className="text-red-600" />
                              {order.deliveryAddress}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Estimated Delivery</p>
                            <p className="font-semibold text-red-600 text-lg">
                              {order.estimatedDelivery || calculateEstimatedDelivery(order.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-yellow-500">
                        <h4 className="font-bold text-gray-800 mb-4">Payment Status</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold capitalize ${
                              order.paymentStatus === 'completed'
                                ? 'bg-green-100 text-green-800 border-green-300'
                                : order.paymentStatus === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                : 'bg-red-100 text-red-800 border-red-300'
                            }`}>
                              <CheckCircle size={16} />
                              {order.paymentStatus}
                            </div>
                          </div>
                          {order.razorpayOrderId && (
                            <div>
                              <p className="text-sm text-gray-600">Payment ID</p>
                              <p className="font-mono text-sm text-gray-800">{order.razorpayOrderId}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-8">
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Package size={20} className="text-red-600" />
                        Order Items ({order.items.length})
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow duration-300">
                            <div className="flex-1">
                              <p className="font-bold text-gray-800">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                {item.quantity} × ₹{item.price} {item.size ? `(${item.size})` : ''}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-red-600 text-lg">₹{item.price * item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-6 border-2 border-red-200">
                      <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-red-200">
                        <p className="text-lg font-bold text-gray-800">Items Total</p>
                        <p className="text-lg font-bold text-gray-800">₹{order.totalPrice}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-2xl font-bold text-red-600">Total Amount</p>
                        <p className="text-3xl font-bold text-red-600">₹{order.totalPrice}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md">
                          Track Order
                        </button>
                        <button className="bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md">
                          Cancel Order
                        </button>
                      </div>
                    )}

                    {order.status === 'delivered' && (
                      <div className="mt-6 bg-green-100 border-2 border-green-500 rounded-lg p-4 text-center">
                        <p className="text-green-800 font-bold text-lg flex items-center justify-center gap-2">
                          <CheckCircle size={24} />
                          Order Delivered Successfully!
                        </p>
                        <p className="text-green-700 text-sm mt-2">Thank you for your purchase. We hope you enjoyed!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};