import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';

const OrdersPage = () => {
  const { user } = useAuth();
  const { orders, loadOrders } = useProducts();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id) {
        try {
          await loadOrders();
        } catch (error) {
          console.error('Failed to load orders:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id, loadOrders]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Delivered': { class: 'bg-success', text: 'Delivered' },
      'Processing': { class: 'bg-warning', text: 'Processing' },
      'Shipped': { class: 'bg-info', text: 'Shipped' },
      'Cancelled': { class: 'bg-danger', text: 'Cancelled' },
      'Pending': { class: 'bg-secondary', text: 'Pending' },
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="display-5 fw-bold text-dark mb-4">My Orders</h1>
        </div>
      </div>

      {orders && orders.length > 0 ? (
        <div className="row">
          {orders.map(order => (
            <div key={order._id || order.id} className="col-12 mb-4">
              <div className="card">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-3">
                      <h6 className="mb-1">Order #{order._id || order.id}</h6>
                      <p className="text-muted mb-0">
                        {new Date(order.createdAt || order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="col-md-3">
                      <h6 className="mb-1">Items</h6>
                      <p className="text-muted mb-0">
                        {order.items && order.items.length > 0 
                          ? order.items.map(item => 
                              `${item.name || item.productName} (${item.quantity} ${item.unit || 'unit'})`
                            ).join(', ')
                          : 'No items'
                        }
                      </p>
                    </div>
                    <div className="col-md-2">
                      <h6 className="mb-1">Total</h6>
                      <p className="fw-bold mb-0">₹{order.total || 0}</p>
                    </div>
                    <div className="col-md-2">
                      <h6 className="mb-1">Status</h6>
                      <div>{getStatusBadge(order.status)}</div>
                    </div>
                    <div className="col-md-2 text-end">
                      <Link to={`/orders/${order._id || order.id}`} className="btn btn-outline-primary">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-box text-muted" style={{ fontSize: '4rem' }}></i>
          </div>
          <h3 className="text-muted mb-3">No orders yet</h3>
          <p className="text-muted mb-4">Start shopping to see your orders here</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            <i className="bi bi-shop me-2"></i>
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrdersPage; 