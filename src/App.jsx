import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';

// Layout Components
import Navigation from './components/ui/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileCompletionModal from './components/ProfileCompletionModal';

// Pages
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import FarmerProductsPage from './pages/SellerProductsPage';
import FarmerOrdersPage from './pages/SellerOrdersPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import WishlistPage from './pages/WishlistPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminUsersPage from './pages/AdminUsersPage';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5">
          <div className="alert alert-danger">
            <h4>Something went wrong!</h4>
            <p>Error: {this.state.error?.message}</p>
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}



function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <Navigation />
              <ProfileCompletionModal />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/welcome" element={<WelcomePage />} />
                <Route path="/auth/signin" element={<SignInPage />} />
                <Route path="/auth/signup" element={<SignUpPage />} />
                
                {/* Buyer Routes */}
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                
                <Route 
                  path="/cart" 
                  element={
                    <ProtectedRoute allowedRoles={['buyer']}>
                      <CartPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute allowedRoles={['buyer']}>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/orders" 
                  element={
                    <ProtectedRoute allowedRoles={['buyer']}>
                      <OrdersPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/orders/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['buyer']}>
                      <OrderDetailPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute allowedRoles={['buyer', 'farmer', 'admin']}>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/wishlist" 
                  element={
                    <ProtectedRoute allowedRoles={['buyer']}>
                      <WishlistPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Farmer Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/products/manage" 
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <FarmerProductsPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/products/add" 
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <AddProductPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/products/edit/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <EditProductPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/orders" 
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <FarmerOrdersPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/admin/products" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminProductsPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/admin/users" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminUsersPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Catch all route */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App; 