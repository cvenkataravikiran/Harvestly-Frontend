import React, { createContext, useContext, useState, useEffect } from 'react';
import orderService from '../services/orderService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('harvestly_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        localStorage.removeItem('harvestly_cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('harvestly_cart', JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product._id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevCart.map(item =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevCart, {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          sellerId: product.sellerId,
          sellerName: product.sellerName,
          farmName: product.farmName,
          farmLocation: product.farmLocation,
          stock: product.stock
        }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate cart totals
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate cart item count
  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Check if cart is empty
  const isCartEmpty = () => {
    return cart.length === 0;
  };

  // Validate cart items (check stock availability)
  const validateCart = () => {
    const errors = [];
    
    cart.forEach(item => {
      if (item.quantity > item.stock) {
        errors.push(`${item.name} - Only ${item.stock} available`);
      }
    });

    return errors;
  };

  // Create order from cart
  const createOrder = async (shippingAddress) => {
    if (!user) {
      throw new Error('User must be logged in to create an order');
    }

    if (isCartEmpty()) {
      throw new Error('Cart is empty');
    }

    const validationErrors = validateCart();
    if (validationErrors.length > 0) {
      throw new Error(`Stock issues: ${validationErrors.join(', ')}`);
    }

    try {
      setLoading(true);
      setError(null);

      const orderData = {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress
      };

      const response = await orderService.createOrder(orderData);

      if (response.success) {
        // Clear cart after successful order creation
        clearCart();
        return { success: true, order: response.data.order };
      } else {
        setError(response.error || 'Failed to create order');
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create order';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Get order by ID
  const getOrder = async (orderId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderService.getOrder(orderId);

      if (response.success) {
        return response.data.order;
      } else {
        setError(response.error || 'Failed to load order');
        return null;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load order';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get user's orders
  const getMyOrders = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderService.getMyOrders(params);

      if (response.success) {
        return response.data;
      } else {
        setError(response.error || 'Failed to load orders');
        return { orders: [], pagination: {} };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load orders';
      setError(errorMessage);
      return { orders: [], pagination: {} };
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, statusData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderService.updateOrderStatus(orderId, statusData);

      if (response.success) {
        return { success: true, order: response.data.order };
      } else {
        setError(response.error || 'Failed to update order status');
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update order status';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId, reason) => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderService.cancelOrder(orderId, reason);

      if (response.success) {
        return { success: true, order: response.data.order };
      } else {
        setError(response.error || 'Failed to cancel order');
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to cancel order';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Get order statistics
  const getOrderStats = async () => {
    try {
      const response = await orderService.getOrderStats();
      return response.success ? response.data.stats : null;
    } catch (error) {
      console.error('Failed to get order stats:', error);
      return null;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getCartCount: getCartItemCount, // Alias for Navigation component
    isCartEmpty,
    validateCart,
    createOrder,
    getOrder,
    getMyOrders,
    updateOrderStatus,
    cancelOrder,
    getOrderStats,
    clearError
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 