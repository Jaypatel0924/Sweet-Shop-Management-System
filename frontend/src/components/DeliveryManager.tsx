import React, { useState, useEffect } from 'react';
import { ChevronLeft, Truck, CheckCircle, Clock, AlertCircle, Edit2, Save, X } from 'lucide-react';
import apiService from '../services/api';

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
  totalAmount: number;
  totalPrice?: number;
  deliveryInfo: DeliveryInfo;
  deliveryAddress?: string;
  orderStatus: 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  estimatedDeliveryDate?: string;
  deliveryDate?: string;
}

interface DeliveryManagerProps {
  onBack: () => void;
}

export const DeliveryManager: React.FC<DeliveryManagerProps> = ({ onBack }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('placed');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const statusOptions = ['placed', 'confirmed', 'shipped', 'delivered'];
  const statusProgressMap: Record<string, number> = {
    'placed': 1,
    'confirmed': 2,
    'shipped': 3,
    'delivered': 4,
    'cancelled': 0,
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllOrders();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setMessage({ 
        type: 'error', 
        text: '⚠️ Backend API endpoint not yet implemented. Contact backend developer.' 
      });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const canChangeStatus = (currentStatus: string, targetStatus: string): boolean => {
    // Cancelled orders cannot change status
    if (currentStatus === 'cancelled') {
      return false;
    }
    
    // Can only move forward in the workflow
    const currentProgress = statusProgressMap[currentStatus] || 0;
    const targetProgress = statusProgressMap[targetStatus] || 0;
    
    return targetProgress >= currentProgress;
  };

  const handleUpdateStatus = async (orderId: string) => {
    const order = orders.find(o => o._id === orderId);
    if (!order) return;

    const currentStatus = order.orderStatus || order.status || 'placed';

    // Validate status change
    if (!canChangeStatus(currentStatus, newStatus)) {
      setMessage({ 
        type: 'error', 
        text: `Cannot change ${currentStatus} order to ${newStatus}. Orders can only progress forward.` 
      });
      setTimeout(() => setMessage(null), 4000);
      return;
    }

    // Update locally immediately
    const updatedOrders = orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o);
    setOrders(updatedOrders);
    setMessage({ type: 'success', text: `✅ Order updated to ${newStatus.toUpperCase()}` });
    setEditingId(null);
    setTimeout(() => setMessage(null), 3000);

    // Try to sync with API (fire and forget)
    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });
    } catch (error) {
      console.warn('Failed to sync with backend, but local update saved:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 border-yellow-300 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-50 border-blue-300 text-blue-800';
      case 'shipped':
        return 'bg-purple-50 border-purple-300 text-purple-800';
      case 'delivered':
        return 'bg-green-50 border-green-300 text-green-800';
      case 'cancelled':
        return 'bg-red-50 border-red-300 text-red-800';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} />;
      case 'confirmed':
        return <CheckCircle size={20} />;
      case 'shipped':
        return <Truck size={20} />;
      case 'delivered':
        return <CheckCircle size={20} />;
      case 'cancelled':
        return <AlertCircle size={20} />;
      default:
        return <Clock size={20} />;
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => (o.orderStatus || o.status || 'placed') === filterStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4 transition-colors"
          >
            <ChevronLeft size={24} />
            Back
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🚚 Delivery Manager</h1>
          <p className="text-gray-600">Update order delivery statuses</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-blue-400'
            }`}
          >
            All Orders ({orders.length})
          </button>
          {statusOptions.map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-blue-400'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({orders.filter(o => (o.orderStatus || o.status || 'placed') === status).length})
            </button>
          ))}
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-lg">
            <p className="text-gray-600 text-lg">No orders found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold text-gray-800">Order ID</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-800">Customer</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-800">Items</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-800">Address</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-800">Current Status</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-800">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, idx) => (
                    <tr key={order._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        User {order.userId.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm max-w-xs truncate">
                        {order.deliveryAddress || (order.deliveryInfo ? `${order.deliveryInfo.street}, ${order.deliveryInfo.city}` : 'N/A')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 font-bold text-sm ${getStatusColor(order.orderStatus || order.status || 'placed')}`}>
                          {getStatusIcon(order.orderStatus || order.status || 'placed')}
                          {(order.orderStatus || order.status || 'placed').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {editingId === order._id ? (
                          <div className="flex gap-2">
                            <select
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                              className="px-3 py-2 border-2 border-blue-400 rounded-lg focus:outline-none focus:border-blue-600"
                            >
                              {(order.orderStatus || order.status || 'placed') === 'cancelled' ? (
                                <option value={order.orderStatus || order.status || 'placed'}>Order Cancelled (Cannot Change)</option>
                              ) : (
                                <>
                                  <option value={order.orderStatus || order.status || 'placed'}>{(order.orderStatus || order.status || 'placed').charAt(0).toUpperCase() + (order.orderStatus || order.status || 'placed').slice(1)} (Current)</option>
                                  {statusOptions.map(status => {
                                    const isValid = canChangeStatus(order.orderStatus || order.status || 'placed', status);
                                    return isValid && status !== (order.orderStatus || order.status || 'placed') ? (
                                      <option key={status} value={status}>
                                        → {status.charAt(0).toUpperCase() + status.slice(1)}
                                      </option>
                                    ) : null;
                                  })}
                                </>
                              )}
                            </select>
                            <button
                              onClick={() => handleUpdateStatus(order._id)}
                              disabled={(order.orderStatus || order.status || 'placed') === 'cancelled' || newStatus === (order.orderStatus || order.status || 'placed')}
                              className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              <Save size={16} /> Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-gray-400 text-white px-3 py-2 rounded-lg hover:bg-gray-500 transition-colors flex items-center gap-1"
                            >
                              <X size={16} /> Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(order._id);
                              setNewStatus(order.orderStatus || order.status || 'placed');
                            }}
                            disabled={order.status === 'cancelled' || order.status === 'delivered'}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            <Edit2 size={16} /> {order.status === 'cancelled' ? 'Cancelled' : order.status === 'delivered' ? 'Completed' : 'Update'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
