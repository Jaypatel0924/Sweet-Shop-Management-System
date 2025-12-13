import React, { useState, useEffect } from 'react';
import { Sweet } from '../types';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {sweet.image && (
        <img
          src={sweet.image}
          alt={sweet.name}
          className="w-full h-48 object-cover bg-gray-200"
        />
      )}
      {!sweet.image && <div className="w-full h-48 bg-gradient-to-br from-pink-300 to-purple-300" />}

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800">{sweet.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{sweet.category}</p>

        {sweet.description && (
          <p className="text-gray-600 text-sm mb-3">{sweet.description}</p>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-purple-600">₹{sweet.price}</span>
          <span className={`text-sm font-semibold ${sweet.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
            Stock: {sweet.quantity}
          </span>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm mb-2">
            {error}
          </div>
        )}

        {sweet.quantity > 0 && (
          <div className="flex gap-2 mb-3">
            <input
              type="number"
              min="1"
              max={sweet.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(parseInt(e.target.value) || 1, sweet.quantity))}
              className="w-16 px-2 py-1 border border-gray-300 rounded"
            />
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="flex-1 bg-green-500 text-white font-semibold py-1 rounded hover:bg-green-600 transition disabled:bg-gray-400"
            >
              {loading ? 'Purchasing...' : 'Buy'}
            </button>
          </div>
        )}

        {sweet.quantity === 0 && (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-600 font-semibold py-2 rounded cursor-not-allowed"
          >
            Out of Stock
          </button>
        )}

        {user?.isAdmin && (
          <div className="flex gap-2 mt-3 pt-3 border-t">
            <button
              onClick={() => onEdit && onEdit(sweet)}
              className="flex-1 bg-blue-500 text-white font-semibold py-1 rounded hover:bg-blue-600 transition"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-500 text-white font-semibold py-1 rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
