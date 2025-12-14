import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onNavigate: (page: 'login' | 'register' | 'dashboard') => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<'user' | 'admin'>('user');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // For admin login, add a prefix or flag
      const loginEmail = loginMode === 'admin' ? `admin_${email}` : email;
      await login(loginEmail, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-candy-pink via-purple-300 to-candy-blue flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-candy-pink rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-candy-blue rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="card-elevated p-8 backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4 animate-bounce-soft">{loginMode === 'user' ? '🍬' : '👑'}</div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              {loginMode === 'user' ? 'Welcome Back' : 'Admin Portal'}
            </h1>
            <p className="text-gray-600">
              {loginMode === 'user' 
                ? 'Sign in to your Sweet Shop account' 
                : 'Secure admin access to manage inventory'}
            </p>
          </div>

          {/* Login Mode Tabs */}
          <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => {
                setLoginMode('user');
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                loginMode === 'user'
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              👤 Customer
            </button>
            <button
              onClick={() => {
                setLoginMode('admin');
                setError('');
              }}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                loginMode === 'admin'
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ⚙️ Admin
            </button>
          </div>

          {/* Admin Notice */}
          {loginMode === 'admin' && (
            <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
              <p className="font-semibold">🔒 Admin Only</p>
              <p className="text-xs mt-1">Use your admin credentials to access the inventory management system.</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-fade-in">
              <p className="text-red-700 font-semibold text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-sm">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder={loginMode === 'admin' ? 'admin@sweetshop.com' : 'you@example.com'}
                required
              />
              {loginMode === 'admin' && (
                <p className="text-xs text-gray-500 mt-2">
                  💡 Use your admin email address to login
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-3 rounded-lg transition-all duration-200 ${
                loginMode === 'admin'
                  ? 'bg-gradient-to-r from-candy-yellow to-candy-orange text-white hover:shadow-lg hover:scale-105'
                  : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg hover:scale-105'
              } disabled:opacity-50 disabled:cursor-not-allowed active:scale-95`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Logging in...
                </span>
              ) : (
                `${loginMode === 'admin' ? '🔓 Admin Login' : '✓ Sign In'}`
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            {loginMode === 'user' ? (
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => onNavigate('register')}
                  className="gradient-text font-bold hover:underline cursor-pointer transition"
                >
                  Create one
                </button>
              </p>
            ) : (
              <p className="text-gray-600 text-sm">
                Need admin access?{' '}
                <span className="text-xs block mt-2 text-gray-500">
                  Contact the system administrator
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
