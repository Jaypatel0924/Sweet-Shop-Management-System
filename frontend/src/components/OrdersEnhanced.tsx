import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { Package, Truck, CheckCircle, AlertCircle, X, Clock } from 'lucide-react';

interface OrderItem {
  sweetId?: string;
  id?: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  size?: string;
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

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount?: number;
  totalPrice?: number;
  deliveryInfo?: DeliveryInfo;
  deliveryAddress?: string;
  orderStatus?: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  razorpayOrderId?: string;
  deliveryDate?: string;
  estimatedDeliveryDate?: string;
  createdAt: string;
  estimatedDelivery?: string;
}

export const OrdersEnhanced: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [user?.id]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiService.getUserOrders();
      // Filter: Only show orders with completed payment status
      const completedOrders = Array.isArray(response.orders) 
        ? response.orders.filter((order: Order) => order.paymentStatus === 'completed')
        : [];
      setOrders(completedOrders);
    } catch (err) {
      // Show error message instead of demo data
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again later.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      // Call API to cancel order
      await apiService.api.post(`/orders/${orderId}/cancel`);
      
      // Update order status locally
      setOrders(orders.map(o =>
        o._id === orderId ? { ...o, orderStatus: 'cancelled', status: 'cancelled' } : o
      ));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: 'cancelled', status: 'cancelled' });
      }
      setShowCancelModal(null);
    } catch (err) {
      alert('Failed to cancel order');
    }
  };

  const getOrderStatus = (order: Order): string => {
    return order.orderStatus || order.status || 'pending';
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

  const OrderStatusTimeline: React.FC<{ status: string }> = ({ status }) => {
    const statuses = ['pending', 'confirmed', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(status as any);

    return (
      <div className="mt-6 mb-6">
        <div className="flex justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-300 -z-10"></div>
          <div
            className="absolute top-5 left-0 h-1 bg-gradient-to-r from-red-600 to-red-500 -z-10 transition-all duration-500"
            style={{ width: `${currentIndex >= 0 ? ((currentIndex + 1) / statuses.length) * 100 : 0}%` }}
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

  // Show selected order detail
  if (selectedOrder && selectedOrder._id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold mb-6 transition-colors"
          >
            ← Back to Orders
          </button>

          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Order Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Order #{selectedOrder._id.slice(-6).toUpperCase()}</h1>
                  <p className="text-red-100">
                    Placed on {new Date(selectedOrder.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-lg border-2 font-bold flex items-center gap-2 ${getStatusColor(getOrderStatus(selectedOrder))}`}>
                  {getStatusIcon(getOrderStatus(selectedOrder))}
                  {getOrderStatus(selectedOrder).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Status</h2>
              <OrderStatusTimeline status={getOrderStatus(selectedOrder)} />
            </div>

            {/* Order Items */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Items</h2>
              <div className="space-y-4">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} {item.size ? `(${item.size})` : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">₹{item.price} each</p>
                      <p className="font-bold text-red-600 text-lg">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-300">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Total Items:</span>
                  <span className="font-bold text-gray-800">{(selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0) || 0).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center bg-white p-4 rounded-lg border-2 border-red-300">
                <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                <span className="text-3xl font-bold text-red-600">₹{(selectedOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0).toFixed(2)}</span>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-green-50 border-2 border-green-300 text-green-700 font-bold text-center">
                ✓ Payment Completed Successfully
              </div>
            </div>

            {/* Action Buttons */}
            {getOrderStatus(selectedOrder) !== 'delivered' && getOrderStatus(selectedOrder) !== 'cancelled' && (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2">
                    <Truck size={20} /> Track Order
                  </button>
                  <button
                    onClick={() => setShowCancelModal(selectedOrder._id)}
                    className="bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <X size={20} /> Cancel Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Cancel Order?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCancelModal(null)}
                  className="flex-1 bg-gray-300 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Keep Order
                </button>
                <button
                  onClick={() => handleCancelOrder(selectedOrder._id)}
                  className="flex-1 bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Orders List
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
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
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-3">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders with completed payments yet. Start shopping for delicious sweets!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <div key={order._id} className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all overflow-hidden animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setSelectedOrder(order);
                    setExpandedOrder(expandedOrder === order._id ? null : order._id);
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-full ${getStatusColor(getOrderStatus(order))}`}>
                        {getStatusIcon(getOrderStatus(order))}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-red-600">₹{(order.totalAmount || order.totalPrice || 0).toFixed(2)}</p>
                      <span className={`inline-block mt-2 px-4 py-1 rounded-lg border-2 font-bold text-sm ${getStatusColor(getOrderStatus(order))}`}>
                        {getOrderStatus(order).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Item Preview */}
                  <div className="flex gap-2 mt-4">
                    {order.items.slice(0, 4).map((item, i) => (
                      <div key={i} className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                        {item.name}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                        +{order.items.length - 4} more
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  {getOrderStatus(order) !== 'delivered' && getOrderStatus(order) !== 'cancelled' && (
                    <div className="mt-4 flex gap-3">
                      <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1">
                        <Truck size={16} /> Track
                      </button>
                      {getOrderStatus(order) !== 'shipped' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCancelModal(order._id);
                          }}
                          className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-1"
                        >
                          <X size={16} /> Cancel
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && !selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cancel Order?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelModal(null)}
                className="flex-1 bg-gray-300 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={() => {
                  if (showCancelModal) handleCancelOrder(showCancelModal);
                }}
                className="flex-1 bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

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
      `}</style>
    </div>
  );
};
