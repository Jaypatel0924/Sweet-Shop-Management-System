import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { OrderConfirmation } from './components/OrderConfirmation';
import { OrdersEnhanced } from './components/OrdersEnhanced';
import { Wishlist } from './components/Wishlist';
import AdminDashboard from './components/AdminDashboard';
import { DeliveryManager } from './components/DeliveryManager';
import './index.css';

type Page = 'login' | 'register' | 'dashboard' | 'cart' | 'checkout' | 'order-confirmation' | 'orders' | 'wishlist' | 'admin' | 'delivery';

interface NavigationContextType {
  currentPage: Page;
  navigateTo: (page: Page) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<Page>('login');

  return (
    <NavigationContext.Provider value={{ currentPage, navigateTo: setCurrentPage }}>
      {children}
    </NavigationContext.Provider>
  );
};

interface OrderConfirmationData {
  orderId: string;
  deliveryDate: string;
}

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { currentPage, navigateTo } = useNavigation();
  const [orderData, setOrderData] = useState<OrderConfirmationData | null>(null);

  useEffect(() => {
    if (isAuthenticated && currentPage !== 'dashboard' && currentPage !== 'admin' && currentPage !== 'cart' && currentPage !== 'checkout' && currentPage !== 'order-confirmation' && currentPage !== 'orders') {
      navigateTo('dashboard');
    } else if (!isAuthenticated && (currentPage === 'dashboard' || currentPage === 'admin' || currentPage === 'cart' || currentPage === 'checkout' || currentPage === 'order-confirmation' || currentPage === 'orders')) {
      navigateTo('login');
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && currentPage !== 'admin' && <Header />}
      
      {!isAuthenticated ? (
        <div>
          {currentPage === 'login' && <Login onNavigate={navigateTo} />}
          {currentPage === 'register' && <Register onNavigate={navigateTo} />}
        </div>
      ) : (
        <div>
          {currentPage === 'dashboard' && <Dashboard onNavigateToCart={() => navigateTo('cart')} />}
          {currentPage === 'cart' && <Cart onCheckout={() => navigateTo('checkout')} />}
          {currentPage === 'checkout' && (
            <Checkout
              onBack={() => navigateTo('cart')}
              onSuccess={(orderId, deliveryDate) => {
                setOrderData({ orderId, deliveryDate });
                navigateTo('order-confirmation');
              }}
            />
          )}
          {currentPage === 'order-confirmation' && orderData && (
            <OrderConfirmation
              orderId={orderData.orderId}
              deliveryDate={orderData.deliveryDate}
              onContinueShopping={() => navigateTo('dashboard')}
            />
          )}
          {currentPage === 'orders' && <OrdersEnhanced />}
          {currentPage === 'wishlist' && <Wishlist onBack={() => navigateTo('dashboard')} />}
          {currentPage === 'admin' && <AdminDashboard />}
          {currentPage === 'delivery' && <DeliveryManager onBack={() => navigateTo('dashboard')} />}
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <NavigationProvider>
            <AppContent />
          </NavigationProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
