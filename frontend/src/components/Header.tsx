import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from '../hooks/useNavigate';

export const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-2xl">🍬</span>
          <h1 className="text-2xl font-bold">Sweet Shop</h1>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm">
                Welcome, <span className="font-semibold">{user?.username}</span>
                {user?.isAdmin && <span className="ml-2 bg-yellow-400 text-purple-600 px-2 py-1 rounded text-xs font-bold">ADMIN</span>}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-purple-600 font-semibold py-1 px-4 rounded-lg hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-purple-600 font-semibold py-1 px-4 rounded-lg hover:bg-gray-100 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
