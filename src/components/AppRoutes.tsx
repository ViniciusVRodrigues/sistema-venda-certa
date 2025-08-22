import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from './layout';
import { LoadingSpinner } from './ui';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Customer Pages
import { HomePage } from '../pages/customer/HomePage';
import { ProductDetailPage } from '../pages/customer/ProductDetailPage';
import { CartPage } from '../pages/customer/CartPage';
import { CheckoutPage } from '../pages/customer/CheckoutPage';
import { CustomerMenuPage } from '../pages/customer/CustomerMenuPage';
import { CustomerAddressesPage } from '../pages/customer/CustomerAddressesPage';
import { CustomerOrdersPage } from '../pages/customer/CustomerOrdersPage';
import { CustomerProfilePage } from '../pages/customer/CustomerProfilePage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { ProductsList } from '../components/admin/products/ProductsList';
import { OrdersList } from '../components/admin/orders/OrdersList';
import { CustomersList } from '../components/admin/customers/CustomersList';

// Delivery Pages
import { DeliveryDashboardPage } from '../pages/delivery/DeliveryDashboardPage';
import { DeliveryOrdersPage } from '../pages/delivery/DeliveryOrdersPage';
import { DeliveryHistoryPage } from '../pages/delivery/DeliveryHistoryPage';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'customer' | 'delivery';
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  redirectTo = '/auth/login'
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    const fallbackRoute = user?.role === 'admin' ? '/admin' : 
                          user?.role === 'delivery' ? '/delivery' : '/';
    return <Navigate to={fallbackRoute} replace />;
  }
  
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/auth/login"
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'admin' ? '/admin' : 
                          user?.role === 'delivery' ? '/delivery' : '/'} replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/auth/register"
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'admin' ? '/admin' : 
                          user?.role === 'delivery' ? '/delivery' : '/'} replace />
          ) : (
            <RegisterPage />
          )
        }
      />
      
      {/* Customer Routes */}
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      
      <Route
        path="/product/:id"
        element={
          <Layout>
            <ProductDetailPage />
          </Layout>
        }
      />
      
      <Route
        path="/cart"
        element={
          <ProtectedRoute requiredRole="customer">
            <Layout>
              <CartPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/checkout"
        element={
          <ProtectedRoute requiredRole="customer">
            <Layout>
              <CheckoutPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/customer/menu"
        element={
          <ProtectedRoute requiredRole="customer">
            <Layout>
              <CustomerMenuPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/customer/addresses"
        element={
          <ProtectedRoute requiredRole="customer">
            <Layout>
              <CustomerAddressesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/customer/orders"
        element={
          <ProtectedRoute requiredRole="customer">
            <Layout>
              <CustomerOrdersPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute requiredRole="customer">
            <Layout>
              <CustomerProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/orders"
        element={
          <ProtectedRoute requiredRole="customer">
            <Layout>
              <CustomerOrdersPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <Layout showFooter={false}>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute requiredRole="admin">
            <Layout showFooter={false}>
              <ProductsList />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute requiredRole="admin">
            <Layout showFooter={false}>
              <OrdersList />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/customers"
        element={
          <ProtectedRoute requiredRole="admin">
            <Layout showFooter={false}>
              <CustomersList />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      {/* Delivery Routes */}
      <Route
        path="/delivery"
        element={
          <ProtectedRoute requiredRole="delivery">
            <Layout showFooter={false}>
              <DeliveryDashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/delivery/orders"
        element={
          <ProtectedRoute requiredRole="delivery">
            <Layout showFooter={false}>
              <DeliveryOrdersPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/delivery/history"
        element={
          <ProtectedRoute requiredRole="delivery">
            <Layout showFooter={false}>
              <DeliveryHistoryPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      {/* 404 Route */}
      <Route
        path="*"
        element={
          <Layout>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-8">Página não encontrada</p>
                <a
                  href="/"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Voltar ao início
                </a>
              </div>
            </div>
          </Layout>
        }
      />
    </Routes>
  );
};