import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ui/ProductCard';

const FarmerDashboardPage = () => {
  const { user } = useAuth();
  const { getMyProducts, orders, products } = useProducts();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Load farmer's products when component mounts
  useEffect(() => {
    const loadFarmerProducts = async () => {
      if (user?.id) {
        try {
          await getMyProducts();
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
                  <Link to="/farmer/products/add" className="btn btn-primary w-100">
                    <i className="bi bi-plus-circle me-2"></i>
                    Add New Product
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link to="/farmer/products" className="btn btn-outline-primary w-100">
                    <i className="bi bi-box-seam me-2"></i>
                    Manage Products
                  </Link>
                </div>
                <div className="col-md-4">
                  <Link to="/farmer/orders" className="btn btn-outline-success w-100">
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
              <Link to="/farmer/products" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              {products.length > 0 ? (
                <div className="row g-3">
                  {products.slice(0, 4).map(product => (
                    <div key={product.id} className="col-md-6 col-lg-3">
                      <ProductCard product={product} showSeller={false} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-box-seam display-4 text-muted mb-3"></i>
                  <h5 className="text-muted">No products yet</h5>
                  <p className="text-muted">Start by adding your first product</p>
                  <Link to="/farmer/products/add" className="btn btn-primary">
                    <i className="bi bi-plus-circle me-2"></i>
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
              <Link to="/farmer/orders" className="btn btn-sm btn-outline-primary">
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
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {farmerOrders.slice(0, 5).map(order => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.buyerName}</td>
                          <td>₹{order.total}</td>
                          <td>
                            <span className={`badge bg-${
                              order.status === 'Processing' ? 'warning' :
                              order.status === 'Shipped' ? 'info' :
                              order.status === 'Delivered' ? 'success' : 'secondary'
                            }`}>
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
                  <i className="bi bi-list-check display-4 text-muted mb-3"></i>
                  <h5 className="text-muted">No orders yet</h5>
                  <p className="text-muted">Orders will appear here when customers purchase your products</p>
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
        <Link to="/farmer/products/add" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Product
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="row g-4">
          {products.map(product => (
            <div key={product.id} className="col-md-6 col-lg-4 col-xl-3">
              <ProductCard product={product} showSeller={false} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-box-seam display-1 text-muted mb-4"></i>
          <h4 className="text-muted mb-3">No products yet</h4>
          <p className="text-muted mb-4">Start selling by adding your first product</p>
          <Link to="/farmer/products/add" className="btn btn-primary btn-lg">
            <i className="bi bi-plus-circle me-2"></i>
            Add Your First Product
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-5 fw-bold text-primary mb-2">
                <i className="bi bi-speedometer2 me-3"></i>
                Farmer Dashboard
              </h1>
              <p className="lead text-muted mb-0">
                Welcome back, {user?.firstName}! Manage your products and track your sales.
              </p>
            </div>
            <div className="text-end">
              <h6 className="text-muted mb-1">Farm Name</h6>
              <h5 className="mb-0">{user?.farmName || 'Your Farm'}</h5>
            </div>
          </div>
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
      </ul>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'products' && renderProducts()}
    </div>
  );
};

export default FarmerDashboardPage; 