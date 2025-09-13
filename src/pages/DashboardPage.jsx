import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ui/ProductCard';

const DashboardPage = () => {
  const { user } = useAuth();
  const { getMyProducts, orders, products } = useProducts();
  const [activeTab, setActiveTab] = useState('overview');
  const [farmerProducts, setFarmerProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load farmer's products when component mounts
  useEffect(() => {
    const loadFarmerProducts = async () => {
      if (user?.id) {
        try {
          await getMyProducts();
          // The products will be available in the context after getMyProducts is called
        } catch (error) {
          console.error('Failed to load farmer products:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadFarmerProducts();
  }, [user?.id, getMyProducts]);

  // Use products from context (which gets updated by getMyProducts)
  const farmerOrders = orders.filter(order => 
    order.items?.some(item => 
      products.some(product => product.id === item.productId)
    )
  );

  const stats = {
    totalProducts: products.length || 0,
    approvedProducts: products.filter(p => p.status === 'Approved').length || 0,
    pendingProducts: products.filter(p => p.status === 'Pending').length || 0,
    totalOrders: farmerOrders.length || 0,
    totalRevenue: farmerOrders.reduce((sum, order) => sum + order.total, 0) || 0
  };

  const renderOverview = () => (
    <div>
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h3 className="mb-0">{stats.totalProducts}</h3>
              <small>Total Products</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h3 className="mb-0">{stats.approvedProducts}</h3>
              <small>Approved Products</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h3 className="mb-0">{stats.pendingProducts}</h3>
              <small>Pending Products</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h3 className="mb-0">₹{stats.totalRevenue.toFixed(2)}</h3>
              <small>Total Revenue</small>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <Link to="/products/add" className="btn btn-primary w-100">
                    <i className="bi bi-plus-circle me-2"></i>
                    Add New Product
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link to="/products/manage" className="btn btn-outline-primary w-100">
                    <i className="bi bi-box-seam me-2"></i>
                    Manage Products
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link to="/orders" className="btn btn-outline-success w-100">
                    <i className="bi bi-list-check me-2"></i>
                    View Orders
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Products</h5>
              <Link to="/products/manage" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {products.length > 0 ? (
                <div className="row">
                  {products.slice(0, 3).map(product => (
                    <div key={product.id} className="col-md-4 mb-3">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-box-seam text-muted" style={{ fontSize: '3rem' }}></i>
                  <p className="text-muted mt-2">No products yet. Add your first product to get started!</p>
                  <Link to="/products/add" className="btn btn-primary">
                    Add Product
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Orders</h5>
              <Link to="/orders" className="btn btn-sm btn-outline-success">
                View All
              </Link>
            </div>
            <div className="card-body">
              {farmerOrders.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {farmerOrders.slice(0, 5).map(order => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.buyerName}</td>
                          <td>{order.items?.length || 0}</td>
                          <td>₹{order.total?.toFixed(2) || '0.00'}</td>
                          <td>
                            <span className={`badge bg-${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-list-check text-muted" style={{ fontSize: '3rem' }}></i>
                  <p className="text-muted mt-2">No orders yet. Your orders will appear here!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>My Products</h4>
        <Link to="/products/add" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Product
        </Link>
      </div>
      
      {products.length > 0 ? (
        <div className="row">
          {products.map(product => (
            <div key={product.id} className="col-md-4 mb-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-box-seam text-muted" style={{ fontSize: '4rem' }}></i>
          <h5 className="text-muted mt-3">No Products Yet</h5>
          <p className="text-muted">Start selling by adding your first product.</p>
          <Link to="/products/add" className="btn btn-primary">
            Add Your First Product
          </Link>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div>
      <h4 className="mb-4">My Orders</h4>
      
      {farmerOrders.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {farmerOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.buyerName}</td>
                  <td>{order.items?.length || 0}</td>
                  <td>₹{order.total?.toFixed(2) || '0.00'}</td>
                  <td>
                    <span className={`badge bg-${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/orders/${order.id}`} className="btn btn-sm btn-outline-primary">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-list-check text-muted" style={{ fontSize: '4rem' }}></i>
          <h5 className="text-muted mt-3">No Orders Yet</h5>
          <p className="text-muted">Orders from your products will appear here.</p>
        </div>
      )}
    </div>
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'confirmed': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="container py-4">
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your dashboard...</p>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="mb-1">Farmer Dashboard</h2>
                <p className="text-muted mb-0">Welcome back, {user?.firstName || 'Farmer'}!</p>
              </div>
              <div className="d-flex gap-2">
                <Link to="/profile" className="btn btn-outline-primary">
                  <i className="bi bi-person me-2"></i>
                  Profile
                </Link>
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
                  className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <i className="bi bi-list-check me-2"></i>
                  Orders
                </button>
              </li>
            </ul>

            {/* Tab Content */}
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'orders' && renderOrders()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage; 