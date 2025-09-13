import React, { createContext, useContext, useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  });

  // Load products from API
  const loadProducts = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.getProducts(params);
      
      if (response.success) {
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || 'Failed to load products');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load products';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load featured products
  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.getFeaturedProducts();
      
      if (response.success) {
        setProducts(response.data.products);
      } else {
        setError(response.error || 'Failed to load featured products');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load featured products';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load products by category
  const loadProductsByCategory = async (category, params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.getProductsByCategory(category, params);
      
      if (response.success) {
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || 'Failed to load products');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load products';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Search products
  const searchProducts = async (searchParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.searchProducts(searchParams);
      
      if (response.success) {
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || 'Search failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Search failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get single product
  const getProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.getProduct(productId);
      
      if (response.success) {
        return response.data.product;
      } else {
        setError(response.error || 'Failed to load product');
        return null;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load product';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new product (farmer only)
  const createProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.createProduct(productData);
      
      if (response.success) {
        // Refresh products list
        await loadProducts();
        return response;
      } else {
        setError(response.error || 'Failed to create product');
        return response;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update product (farmer only)
  const updateProduct = async (productId, productData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.updateProduct(productId, productData);
      
      if (response.success) {
        // Refresh products list
        await loadProducts();
        return response;
      } else {
        setError(response.error || 'Failed to update product');
        return response;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Delete product (farmer only)
  const deleteProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.deleteProduct(productId);
      
      if (response.success) {
        // Refresh products list
        await loadProducts();
        return response;
      } else {
        setError(response.error || 'Failed to delete product');
        return response;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Get farmer's products
  const getMyProducts = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.getMyProducts(params);
      
      if (response.success) {
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || 'Failed to load your products');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load your products';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get product statistics
  const getProductStats = async () => {
    try {
      const response = await productService.getProductStats();
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Failed to get product stats:', error);
      return null;
    }
  };

  // Increment product views
  const incrementProductViews = async (productId) => {
    try {
      await productService.incrementViews(productId);
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
  };

  // Get product categories
  const getCategories = async () => {
    try {
      const response = await productService.getCategories();
      return response.success ? response.data.categories : [];
    } catch (error) {
      console.error('Failed to get categories:', error);
      return [];
    }
  };

  // Get product tags
  const getTags = async () => {
    try {
      const response = await productService.getTags();
      return response.success ? response.data.tags : [];
    } catch (error) {
      console.error('Failed to get tags:', error);
      return [];
    }
  };

  // Load user orders
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.getOrders();
      
      if (response.success) {
        setOrders(response.data.orders || []);
      } else {
        setError(response.error || 'Failed to load orders');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load orders';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get order by ID
  const getOrderById = (orderId) => {
    return orders.find(order => order._id === orderId || order.id === orderId);
  };

  // Create new order
  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productService.createOrder(orderData);
      
      if (response.success) {
        // Add the new order to the orders list
        setOrders(prevOrders => [response.data.order, ...prevOrders]);
        return response;
      } else {
        setError(response.error || 'Failed to create order');
        return response;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create order';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await productService.updateOrderStatus(orderId, status);
      
      if (response.success) {
        // Update the order in the orders list
        setOrders(prevOrders => 
          prevOrders.map(order => 
            (order._id === orderId || order.id === orderId) 
              ? { ...order, status: status }
              : order
          )
        );
        return response;
      } else {
        return response;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update order status';
      return { success: false, error: errorMessage };
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Load initial products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const value = {
    products,
    orders,
    loading,
    error,
    pagination,
    approvedProducts: products.filter(product => product.status === 'Approved'),
    loadProducts,
    loadFeaturedProducts,
    loadProductsByCategory,
    searchProducts,
    getProduct,
    createProduct,
    addProduct: createProduct, // Alias for createProduct
    updateProduct,
    deleteProduct,
    getMyProducts,
    getProductStats,
    incrementProductViews,
    getCategories,
    getTags,
    loadOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    clearError
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}; 