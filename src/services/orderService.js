import { apiHelper } from './api';

class OrderService {
  // Get all orders (with filtering and pagination)
  async getOrders(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `/orders${queryString ? `?${queryString}` : ''}`;
      const response = await apiHelper.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get single order by ID
  async getOrder(orderId) {
    try {
      const response = await apiHelper.get(`/orders/${orderId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create new order
  async createOrder(orderData) {
    try {
      const response = await apiHelper.post('/orders', orderData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId, statusData) {
    try {
      const response = await apiHelper.put(`/orders/${orderId}/status`, statusData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Cancel order
  async cancelOrder(orderId, reason) {
    try {
      const response = await apiHelper.put(`/orders/${orderId}/cancel`, { reason });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get buyer's orders
  async getMyOrders(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `/orders/my-orders${queryString ? `?${queryString}` : ''}`;
      const response = await apiHelper.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get seller's orders
  async getSellerOrders(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `/orders/seller-orders${queryString ? `?${queryString}` : ''}`;
      const response = await apiHelper.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get order statistics
  async getOrderStats() {
    try {
      const response = await apiHelper.get('/orders/stats');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get order tracking information
  async getOrderTracking(orderId) {
    try {
      const response = await apiHelper.get(`/orders/${orderId}/tracking`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Add tracking update to order
  async addTrackingUpdate(orderId, trackingData) {
    try {
      const response = await apiHelper.post(`/orders/${orderId}/tracking`, trackingData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get order history
  async getOrderHistory(orderId) {
    try {
      const response = await apiHelper.get(`/orders/${orderId}/history`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get orders by status
  async getOrdersByStatus(status, params = {}) {
    try {
      const queryParams = { ...params, status };
      const queryString = new URLSearchParams(queryParams).toString();
      const url = `/orders${queryString ? `?${queryString}` : ''}`;
      const response = await apiHelper.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get orders by date range
  async getOrdersByDateRange(startDate, endDate, params = {}) {
    try {
      const queryParams = { 
        ...params, 
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };
      const queryString = new URLSearchParams(queryParams).toString();
      const url = `/orders${queryString ? `?${queryString}` : ''}`;
      const response = await apiHelper.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get order summary
  async getOrderSummary(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `/orders/summary${queryString ? `?${queryString}` : ''}`;
      const response = await apiHelper.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Export orders (admin only)
  async exportOrders(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `/orders/export${queryString ? `?${queryString}` : ''}`;
      const response = await apiHelper.get(url, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Bulk update orders (admin only)
  async bulkUpdateOrders(orderIds, updateData) {
    try {
      const response = await apiHelper.put('/orders/bulk-update', {
        orderIds,
        updateData
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get order analytics
  async getOrderAnalytics(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `/orders/analytics${queryString ? `?${queryString}` : ''}`;
      const response = await apiHelper.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get order notifications
  async getOrderNotifications(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `/orders/notifications${queryString ? `?${queryString}` : ''}`;
      const response = await apiHelper.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Mark order notification as read
  async markNotificationAsRead(notificationId) {
    try {
      const response = await apiHelper.put(`/orders/notifications/${notificationId}/read`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get order reports
  async getOrderReports(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `/orders/reports${queryString ? `?${queryString}` : ''}`;
      const response = await apiHelper.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Generate order invoice
  async generateInvoice(orderId) {
    try {
      const response = await apiHelper.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Send order confirmation email
  async sendOrderConfirmation(orderId) {
    try {
      const response = await apiHelper.post(`/orders/${orderId}/send-confirmation`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get order shipping options
  async getShippingOptions(orderData) {
    try {
      const response = await apiHelper.post('/orders/shipping-options', orderData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Calculate order totals
  async calculateOrderTotals(orderData) {
    try {
      const response = await apiHelper.post('/orders/calculate-totals', orderData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Validate order data
  async validateOrder(orderData) {
    try {
      const response = await apiHelper.post('/orders/validate', orderData);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new OrderService(); 