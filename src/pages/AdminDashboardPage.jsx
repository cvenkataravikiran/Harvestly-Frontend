import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [pendingProducts, setPendingProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/auth/signin');
      return;
    }
    loadDashboardData();
  }, [isAdmin, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Load dashboard statistics
      const statsResponse = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Load pending products
      const productsResponse = await fetch('/api/admin/products/pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const productsData = await productsResponse.json();
      if (productsData.success) {
        setPendingProducts(productsData.data.products);
      }

      // Load recent users
      const usersResponse = await fetch('/api/admin/users?limit=5', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const usersData = await usersResponse.json();
      if (usersData.success) {
        setUsers(usersData.data.users);
      }

      // Load recent orders
      const ordersResponse = await fetch('/api/admin/orders?limit=5', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const ordersData = await ordersResponse.json();
      if (ordersData.success) {
        setOrders(ordersData.data.orders);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProduct = async (productId) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isFeatured: false })
      });
      
      if (response.ok) {
        loadDashboardData();
      }
    } catch (error) {
      console.error('Error approving product:', error);
    }
  };

  const handleRejectProduct = async (productId, reason) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reason })
      });
      
      if (response.ok) {
        loadDashboardData();
      }
    } catch (error) {
      console.error('Error rejecting product:', error);
    }
  };

  const handleUpdateUserStatus = async (userId, isActive) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive })
      });
      
      if (response.ok) {
        loadDashboardData();
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
          <div className="position-sticky pt-3">
            <div className="text-center mb-4">
              <h5 className="text-primary">Admin Dashboard</h5>
              <small className="text-muted">Welcome, {user?.firstName}</small>
            </div>
            
            <ul className="nav flex-column">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <i className="bi bi-speedometer2 me-2"></i>
                  Overview
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
                  onClick={() => setActiveTab('products')}
                >
                  <i className="bi bi-box me-2"></i>
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
                  <i className="bi bi-cart me-2"></i>
                  Orders
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                  onClick={() => setActiveTab('analytics')}
                >
                  <i className="bi bi-graph-up me-2"></i>
                  Analytics
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group me-2">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={loadDashboardData}>
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              {/* Stats Cards */}
              <div className="row mb-4">
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Total Users
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {stats.overview?.totalUsers || 0}
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-people fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-success shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                            Total Products
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {stats.overview?.totalProducts || 0}
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-box fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-info shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                            Total Orders
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {stats.overview?.totalOrders || 0}
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-cart fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-warning shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                            Pending Products
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {stats.overview?.pendingProducts || 0}
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-clock fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="row">
                <div className="col-lg-6">
                  <div className="card shadow mb-4">
                    <div className="card-header py-3">
                      <h6 className="m-0 font-weight-bold text-primary">Recent Products</h6>
                    </div>
                    <div className="card-body">
                      {stats.recentProducts?.length > 0 ? (
                        <div className="list-group list-group-flush">
                          {stats.recentProducts.map((product, index) => (
                            <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                              <div>
                                <h6 className="mb-1">{product.name}</h6>
                                <small className="text-muted">₹{product.price}</small>
                              </div>
                              <span className={`badge bg-${product.status === 'Approved' ? 'success' : 'warning'} rounded-pill`}>
                                {product.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted">No recent products</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="card shadow mb-4">
                    <div className="card-header py-3">
                      <h6 className="m-0 font-weight-bold text-primary">Recent Orders</h6>
                    </div>
                    <div className="card-body">
                      {stats.recentOrders?.length > 0 ? (
                        <div className="list-group list-group-flush">
                          {stats.recentOrders.map((order, index) => (
                            <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                              <div>
                                <h6 className="mb-1">Order #{order.orderId}</h6>
                                <small className="text-muted">₹{order.totalAmount}</small>
                              </div>
                              <span className={`badge bg-${order.status === 'Delivered' ? 'success' : 'primary'} rounded-pill`}>
                                {order.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted">No recent orders</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              <h3>Pending Products</h3>
              <div className="table-responsive">
                <table className="table table-striped table-sm">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Seller</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingProducts.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={product.image || '/placeholder-product.jpg'} 
                              alt={product.name}
                              className="rounded me-2"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                            <div>
                              <strong>{product.name}</strong>
                              <br />
                              <small className="text-muted">{product.description?.substring(0, 50)}...</small>
                            </div>
                          </div>
                        </td>
                        <td>{product.sellerName}</td>
                        <td>₹{product.price}</td>
                        <td>{product.category}</td>
                        <td>
                          <span className="badge bg-warning">{product.status}</span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-success"
                              onClick={() => handleApproveProduct(product._id)}
                            >
                              <i className="bi bi-check"></i> Approve
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleRejectProduct(product._id, 'Quality issues')}
                            >
                              <i className="bi bi-x"></i> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <h3>User Management</h3>
              <div className="table-responsive">
                <table className="table table-striped table-sm">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge bg-${user.role === 'admin' ? 'danger' : user.role === 'farmer' ? 'warning' : 'primary'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${user.isActive ? 'success' : 'secondary'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className={`btn btn-${user.isActive ? 'warning' : 'success'}`}
                              onClick={() => handleUpdateUserStatus(user._id, !user.isActive)}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h3>Order Management</h3>
              <div className="table-responsive">
                <table className="table table-striped table-sm">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>#{order.orderId}</td>
                        <td>{order.buyerName}</td>
                        <td>₹{order.totalAmount}</td>
                        <td>
                          <span className={`badge bg-${order.status === 'Delivered' ? 'success' : order.status === 'Cancelled' ? 'danger' : 'primary'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${order.paymentStatus === 'Paid' ? 'success' : 'warning'}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <h3>Analytics</h3>
              <div className="row">
                <div className="col-lg-6">
                  <div className="card shadow mb-4">
                    <div className="card-header py-3">
                      <h6 className="m-0 font-weight-bold text-primary">User Statistics</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">Buyers: {stats.userStats?.buyers || 0}</label>
                        <div className="progress">
                          <div 
                            className="progress-bar bg-primary" 
                            style={{ width: `${(stats.userStats?.buyers / stats.overview?.totalUsers) * 100 || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Farmers: {stats.userStats?.farmers || 0}</label>
                        <div className="progress">
                          <div 
                            className="progress-bar bg-warning" 
                                                          style={{ width: `${(stats.userStats?.farmers / stats.overview?.totalUsers) * 100 || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Admins: {stats.userStats?.admins || 0}</label>
                        <div className="progress">
                          <div 
                            className="progress-bar bg-danger" 
                            style={{ width: `${(stats.userStats?.admins / stats.overview?.totalUsers) * 100 || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="card shadow mb-4">
                    <div className="card-header py-3">
                      <h6 className="m-0 font-weight-bold text-primary">Order Statistics</h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label">Total Revenue: ₹{stats.orderStats?.totalRevenue || 0}</label>
                        <div className="progress">
                          <div 
                            className="progress-bar bg-success" 
                            style={{ width: '100%' }}
                          ></div>
                        </div>
                      </div>
                      <div className="row text-center">
                        <div className="col-4">
                          <h5 className="text-primary">{stats.orderStats?.pending || 0}</h5>
                          <small className="text-muted">Pending</small>
                        </div>
                        <div className="col-4">
                          <h5 className="text-success">{stats.orderStats?.delivered || 0}</h5>
                          <small className="text-muted">Delivered</small>
                        </div>
                        <div className="col-4">
                          <h5 className="text-danger">{stats.orderStats?.cancelled || 0}</h5>
                          <small className="text-muted">Cancelled</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 