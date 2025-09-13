import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import productService from '../services/productService';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { getOrderById, updateOrderStatus } = useProducts();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to get order from context first
        let orderData = getOrderById(id);
        
        // If not found in context, try to fetch from API
        if (!orderData) {
          const response = await productService.getOrderById(id);
          if (response.success) {
            orderData = response.data.order;
          } else {
            setError('Order not found');
            setLoading(false);
            return;
          }
        }
        
        setOrder(orderData);
      } catch (error) {
        console.error('Failed to fetch order:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, getOrderById]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Order Confirmed': { class: 'bg-success', icon: 'bi-check-circle' },
      'Processing': { class: 'bg-warning', icon: 'bi-gear' },
      'Out for Delivery': { class: 'bg-info', icon: 'bi-truck' },
      'Delivered': { class: 'bg-success', icon: 'bi-house-check' },
      'Cancelled': { class: 'bg-danger', icon: 'bi-x-circle' },
      'Returned': { class: 'bg-secondary', icon: 'bi-arrow-return-left' },
      'Pending': { class: 'bg-secondary', icon: 'bi-clock' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', icon: 'bi-question-circle' };
    return (
      <span className={`badge ${config.class} fs-6`}>
        <i className={`${config.icon} me-1`}></i>
        {status}
      </span>
    );
  };

  const getLogisticsStepClass = (currentStatus, stepStatus) => {
    if (currentStatus === stepStatus) return 'active';
    if (getStatusPriority(currentStatus) > getStatusPriority(stepStatus)) return 'completed';
    return 'pending';
  };

  const getStatusPriority = (status) => {
    const priorities = {
      'Order Confirmed': 1,
      'Processing': 2,
      'Out for Delivery': 3,
      'Delivered': 4
    };
    return priorities[status] || 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
          <h3 className="mt-3">Order Not Found</h3>
          <p className="text-muted">The order you're looking for doesn't exist.</p>
          <Link to="/orders" className="btn btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="display-5 fw-bold text-dark mb-0">Order #{order.id}</h1>
              <p className="text-muted mb-0">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <div className="text-end">
              {getStatusBadge(order.status)}
              <br />
              <Link to="/orders" className="btn btn-outline-primary mt-2">
                <i className="bi bi-arrow-left me-2"></i>
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          {/* Logistics Tracking */}
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-truck me-2"></i>
                Order Tracking
              </h5>
            </div>
            <div className="card-body">
              <div className="logistics-timeline">
                <div className={`timeline-step ${getLogisticsStepClass(order.status, 'Order Confirmed')}`}>
                  <div className="timeline-icon">
                    <i className="bi bi-check-circle"></i>
                  </div>
                  <div className="timeline-content">
                    <h6>Order Confirmed</h6>
                    <p className="text-muted mb-0">Your order has been confirmed and is being processed</p>
                    <small className="text-muted">{formatDate(order.createdAt)}</small>
                  </div>
                </div>

                <div className={`timeline-step ${getLogisticsStepClass(order.status, 'Processing')}`}>
                  <div className="timeline-icon">
                    <i className="bi bi-gear"></i>
                  </div>
                  <div className="timeline-content">
                    <h6>Processing</h6>
                    <p className="text-muted mb-0">Your order is being prepared for delivery</p>
                    {order.logistics?.updates?.find(u => u.status === 'Processing') && (
                      <small className="text-muted">
                        {formatDate(order.logistics.updates.find(u => u.status === 'Processing').timestamp)}
                      </small>
                    )}
                  </div>
                </div>

                <div className={`timeline-step ${getLogisticsStepClass(order.status, 'Out for Delivery')}`}>
                  <div className="timeline-icon">
                    <i className="bi bi-truck"></i>
                  </div>
                  <div className="timeline-content">
                    <h6>Out for Delivery</h6>
                    <p className="text-muted mb-0">Your order is on its way to you</p>
                    {order.logistics?.updates?.find(u => u.status === 'Out for Delivery') && (
                      <small className="text-muted">
                        {formatDate(order.logistics.updates.find(u => u.status === 'Out for Delivery').timestamp)}
                      </small>
                    )}
                  </div>
                </div>

                <div className={`timeline-step ${getLogisticsStepClass(order.status, 'Delivered')}`}>
                  <div className="timeline-icon">
                    <i className="bi bi-house-check"></i>
                  </div>
                  <div className="timeline-content">
                    <h6>Delivered</h6>
                    <p className="text-muted mb-0">Your order has been delivered successfully</p>
                    {order.logistics?.updates?.find(u => u.status === 'Delivered') && (
                      <small className="text-muted">
                        {formatDate(order.logistics.updates.find(u => u.status === 'Delivered').timestamp)}
                      </small>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Updates */}
              {order.logistics?.updates && order.logistics.updates.length > 0 && (
                <div className="mt-4">
                  <h6>Recent Updates</h6>
                  <div className="list-group list-group-flush">
                    {order.logistics.updates.slice(-3).reverse().map((update, index) => (
                      <div key={index} className="list-group-item border-0 px-0">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <strong>{update.status}</strong>
                            <p className="text-muted mb-0 small">{update.description}</p>
                          </div>
                          <small className="text-muted">{formatDate(update.timestamp)}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-box-seam me-2"></i>
                Order Items
              </h5>
            </div>
            <div className="card-body">
              {order.items.map((item, index) => (
                <div key={index} className="d-flex align-items-center py-3 border-bottom">
                  <div className="flex-shrink-0 me-3">
                    <div className="bg-light rounded p-3">
                      <span className="fs-4">🥬</span>
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.name}</h6>
                    <p className="text-muted mb-0">₹{item.price}/{item.unit}</p>
                    {item.sellerName && (
                      <small className="text-muted">
                        <i className="bi bi-shop me-1"></i>
                        {item.sellerName} • {item.farmName}
                      </small>
                    )}
                  </div>
                  <div className="text-end">
                    <p className="mb-1">Qty: {item.quantity} {item.unit}</p>
                    <h6 className="mb-0">₹{item.quantity * item.price}</h6>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-geo-alt me-2"></i>
                Delivery Address
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-8">
                  <p className="mb-1"><strong>{order.buyerName}</strong></p>
                  <p className="mb-1">{order.deliveryAddress.address}</p>
                  <p className="mb-1">{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}</p>
                  {order.deliveryAddress.landmark && (
                    <p className="mb-1">Landmark: {order.deliveryAddress.landmark}</p>
                  )}
                  <p className="mb-0">Phone: {order.buyerPhone}</p>
                </div>
                <div className="col-md-4 text-end">
                  <span className="badge bg-primary">Delivery Address</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Order Summary */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-receipt me-2"></i>
                Order Summary
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Fee:</span>
                <span>₹{order.deliveryFee}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong className="text-primary">₹{order.total}</strong>
              </div>
              
              <div className="alert alert-info">
                <h6 className="alert-heading">
                  <i className="bi bi-credit-card me-2"></i>
                  Payment Information
                </h6>
                <p className="mb-1"><strong>Method:</strong> {order.paymentMethod}</p>
                {order.paymentId && (
                  <p className="mb-0"><strong>Payment ID:</strong> {order.paymentId}</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-lightning me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary">
                  <i className="bi bi-download me-2"></i>
                  Download Invoice
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="bi bi-chat me-2"></i>
                  Contact Support
                </button>
                <button className="btn btn-outline-success">
                  <i className="bi bi-star me-2"></i>
                  Rate Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .logistics-timeline {
          position: relative;
          padding-left: 30px;
        }
        
        .timeline-step {
          position: relative;
          margin-bottom: 30px;
        }
        
        .timeline-step:not(:last-child)::before {
          content: '';
          position: absolute;
          left: 15px;
          top: 40px;
          bottom: -30px;
          width: 2px;
          background-color: #e9ecef;
        }
        
        .timeline-icon {
          position: absolute;
          left: -30px;
          top: 0;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e9ecef;
          color: #6c757d;
        }
        
        .timeline-step.active .timeline-icon {
          background-color: #007bff;
          color: white;
        }
        
        .timeline-step.completed .timeline-icon {
          background-color: #28a745;
          color: white;
        }
        
        .timeline-step.completed:not(:last-child)::before {
          background-color: #28a745;
        }
        
        .timeline-content h6 {
          margin-bottom: 5px;
        }
      `}</style>
    </div>
  );
};

export default OrderDetailPage; 