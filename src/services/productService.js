import { apiHelper } from './api';

const productService = {
  // Get all products
  getProducts: async (params = {}) => {
    try {
      const response = await apiHelper.get('/products', { params });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to load products'
      };
    }
  },

  // Get single product
  getProduct: async (productId) => {
    try {
      const response = await apiHelper.get(`/products/${productId}`);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to load product'
      };
    }
  },

  // Get featured products
  getFeaturedProducts: async () => {
    try {
      const response = await apiHelper.get('/products/featured');
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to load featured products'
      };
    }
  },

  // Get products by category
  getProductsByCategory: async (category, params = {}) => {
    try {
      const response = await apiHelper.get(`/products/category/${category}`, { params });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to load products by category'
      };
    }
  },

  // Search products
  searchProducts: async (searchParams) => {
    try {
      const response = await apiHelper.get('/products/search', { params: searchParams });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to search products'
      };
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const response = await apiHelper.post('/products', productData);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to create product'
      };
    }
  },

  // Update product
  updateProduct: async (productId, productData) => {
    try {
      const response = await apiHelper.put(`/products/${productId}`, productData);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update product'
      };
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      const response = await apiHelper.delete(`/products/${productId}`);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to delete product'
      };
    }
  },

  // Get farmer's products
  getMyProducts: async (params = {}) => {
    try {
      const response = await apiHelper.get('/products/farmer/my-products', { params });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to load your products'
      };
    }
  },

  // Upload product image
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await apiHelper.post('/products/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to upload image'
      };
    }
  },

  // Get product statistics
  getProductStats: async () => {
    try {
      const response = await apiHelper.get('/products/stats');
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get product statistics'
      };
    }
  },

  // Increment product views
  incrementViews: async (productId) => {
    try {
      const response = await apiHelper.patch(`/products/${productId}/views`);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to increment views'
      };
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await apiHelper.get('/products/categories');
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get categories'
      };
    }
  },

  // Get tags
  getTags: async () => {
    try {
      const response = await apiHelper.get('/products/tags');
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get tags'
      };
    }
  },

  // Bulk update products
  bulkUpdateProducts: async (productIds, updateData) => {
    try {
      const response = await apiHelper.put('/products/bulk-update', { productIds, updateData });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to bulk update products'
      };
    }
  },

  // Bulk delete products
  bulkDeleteProducts: async (productIds) => {
    try {
      const response = await apiHelper.delete('/products/bulk-delete', { data: { productIds } });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to bulk delete products'
      };
    }
  },

  // Get user orders
  getOrders: async () => {
    try {
      const response = await apiHelper.get('/orders');
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to load orders'
      };
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await apiHelper.post('/orders', orderData);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to create order'
      };
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await apiHelper.patch(`/orders/${orderId}/status`, { status });
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update order status'
      };
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await apiHelper.get(`/orders/${orderId}`);
      return response;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get order details'
      };
    }
  }
};

export default productService; 