import { apiHelper } from './api';

class PaymentService {
  // Create Razorpay order
  async createPaymentOrder(orderData) {
    try {
      const response = await apiHelper.post('/payments/create-order', orderData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Verify payment signature
  async verifyPayment(paymentData) {
    try {
      const response = await apiHelper.post('/payments/verify', paymentData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get payment details
  async getPaymentDetails(orderId) {
    try {
      const response = await apiHelper.get(`/payments/details/${orderId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Process refund
  async refundPayment(orderId, reason) {
    try {
      const response = await apiHelper.post(`/payments/refund/${orderId}`, { reason });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get payment statistics
  async getPaymentStats() {
    try {
      const response = await apiHelper.get('/payments/stats');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get payment history
  async getPaymentHistory(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `/payments/history${queryString ? `?${queryString}` : ''}`;
      const response = await apiHelper.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get payment methods
  async getPaymentMethods() {
    try {
      const response = await apiHelper.get('/payments/methods');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Save payment method
  async savePaymentMethod(paymentMethodData) {
    try {
      const response = await apiHelper.post('/payments/methods', paymentMethodData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete payment method
  async deletePaymentMethod(methodId) {
    try {
      const response = await apiHelper.delete(`/payments/methods/${methodId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get payment analytics
  async getPaymentAnalytics(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `/payments/analytics${queryString ? `?${queryString}` : ''}`;
      const response = await apiHelper.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Export payment reports
  async exportPaymentReport(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `/payments/export${queryString ? `?${queryString}` : ''}`;
      const response = await apiHelper.get(url, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get payment notifications
  async getPaymentNotifications(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `/payments/notifications${queryString ? `?${queryString}` : ''}`;
      const response = await apiHelper.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Mark payment notification as read
  async markPaymentNotificationAsRead(notificationId) {
    try {
      const response = await apiHelper.put(`/payments/notifications/${notificationId}/read`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Validate payment data
  async validatePayment(paymentData) {
    try {
      const response = await apiHelper.post('/payments/validate', paymentData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get payment gateway status
  async getGatewayStatus() {
    try {
      const response = await apiHelper.get('/payments/gateway-status');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Test payment connection
  async testPaymentConnection() {
    try {
      const response = await apiHelper.get('/payments/test-connection');
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new PaymentService(); 