import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import './index.css';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    if (!isAuthenticated && currentPage === 'dashboard') {
      setCurrentPage('login');
    }
  }, [isAuthenticated, currentPage]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {!isAuthenticated ? (
        <div>
          {currentPage === 'login' && <Login />}
          {currentPage === 'register' && (
            <div className="relative">
              <Register />
              <button
                onClick={() => handleNavigate('login')}
                className="hidden"
              />
            </div>
          )}
        </div>
      ) : (
        <Dashboard />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
