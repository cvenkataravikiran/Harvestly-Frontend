import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';

const AdminPage = () => {
  const { user } = useAuth();
  const { products, orders, loading, error } = useProducts();
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate real statistics
  const stats = {
    totalUsers: 0, // This would come from user management API
    totalProducts: products.length,
    pendingProducts: products.filter(p => p.status === 'Pending').length,
    approvedProducts: products.filter(p => p.status === 'Approved').length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0)
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="display-5 fw-bold text-dark mb-4">
            <i className="bi bi-shield-check me-3"></i>
            Admin Dashboard
          </h1>
          <p className="text-muted">Welcome back, {user?.firstName || 'Admin'}!</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-house me-2"></i>
            Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <i className="bi bi-box-seam me-2"></i>
            Products
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="bi bi-people me-2"></i>
            Users
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="bi bi-list-check me-2"></i>
            Orders
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="card bg-primary text-white">
              <div className="card-body text-center">
                <h3 className="mb-0">{stats.totalUsers}</h3>
                <small>Total Users</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card bg-success text-white">
              <div className="card-body text-center">
                <h3 className="mb-0">{stats.totalProducts}</h3>
                <small>Total Products</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card bg-warning text-white">
              <div className="card-body text-center">
                <h3 className="mb-0">{stats.pendingProducts}</h3>
                <small>Pending Products</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card bg-info text-white">
              <div className="card-body text-center">
                <h3 className="mb-0">{stats.totalOrders}</h3>
                <small>Total Orders</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Product Management</h5>
          </div>
          <div className="card-body">
            {products.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Farmer</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id || product.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={product.image || '/images/placeholder.jpg'}
                              alt={product.name}
                              className="rounded me-2"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                            <div>
                              <strong>{product.name}</strong>
                              <br />
                              <small className="text-muted">{product.description}</small>
                            </div>
                          </div>
                        </td>
                        <td>{product.sellerName || 'Unknown'}</td>
                        <td>
                          <span className={`badge bg-${product.category === 'Organic' ? 'success' : 'warning'}`}>
                            {product.category}
                          </span>
                        </td>
                        <td>₹{product.price}</td>
                        <td>
                          <span className={`badge bg-${product.status === 'Approved' ? 'success' : product.status === 'Pending' ? 'warning' : 'danger'}`}>
                            {product.status}
                          </span>
                        </td>
                        <td>
                          {product.status === 'Pending' && (
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-success">Approve</button>
                              <button className="btn btn-danger">Reject</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="bi bi-box text-muted" style={{ fontSize: '3rem' }}></i>
                <h5 className="text-muted mt-3">No products found</h5>
                <p className="text-muted">Products will appear here once farmers add them</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">User Management</h5>
          </div>
          <div className="card-body">
            <div className="text-center py-4">
              <i className="bi bi-people text-muted" style={{ fontSize: '3rem' }}></i>
              <h5 className="text-muted mt-3">User Management</h5>
              <p className="text-muted">User management features will be implemented here</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Order Management</h5>
          </div>
          <div className="card-body">
            {orders.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Buyer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id || order.id}>
                        <td>#{order._id || order.id}</td>
                        <td>{order.buyerName || 'Unknown'}</td>
                        <td>
                          {order.items && order.items.length > 0 
                            ? `${order.items.length} item${order.items.length !== 1 ? 's' : ''}`
                            : 'No items'
                          }
                        </td>
                        <td>₹{order.total || 0}</td>
                        <td>
                          <span className={`badge bg-${order.status === 'Delivered' ? 'success' : order.status === 'Processing' ? 'warning' : 'info'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          {order.createdAt 
                            ? new Date(order.createdAt).toLocaleDateString()
                            : 'Unknown'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="bi bi-list-check text-muted" style={{ fontSize: '3rem' }}></i>
                <h5 className="text-muted mt-3">No orders found</h5>
                <p className="text-muted">Orders will appear here once buyers place them</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage; 