import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { orders, products, loadOrders } = useProducts();
  const { items: cartItems } = useCart();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    role: user?.role || 'buyer'
  });

  // Load user-specific data
  useEffect(() => {
    const loadUserData = async () => {
      if (user?.id) {
        try {
          await loadOrders();
        } catch (error) {
          console.error('Failed to load user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user?.id, loadOrders]);

  // Calculate real-time statistics
  const getStatistics = () => {
    if (loading) {
      return {
        totalOrders: 0,
        wishlistItems: 0,
        reviewsGiven: 0,
        totalProducts: 0,
        totalRevenue: 0
      };
    }

    // Get user's orders
    const userOrders = orders.filter(order => 
      order.buyerId === user?.id || order.buyerId === user?._id
    );

    // Get user's products (for farmers)
    const userProducts = user?.role === 'farmer' ? 
      products.filter(product => 
        product.sellerId === user?.id || product.sellerId === user?._id
      ) : [];

    // Get wishlist items from localStorage
    let wishlistItems = 0;
    try {
      const savedWishlist = localStorage.getItem(`wishlist_${user?.id}`);
      if (savedWishlist) {
        const wishlistIds = JSON.parse(savedWishlist);
        wishlistItems = wishlistIds.length;
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }

    // Calculate total revenue (for farmers)
    const totalRevenue = user?.role === 'farmer' ? 
      userOrders.reduce((sum, order) => sum + (order.total || 0), 0) : 0;

    return {
      totalOrders: userOrders.length,
      wishlistItems: wishlistItems,
      reviewsGiven: 0, // Reviews feature not implemented yet
      totalProducts: userProducts.length,
      totalRevenue: totalRevenue
    };
  };

  const stats = getStatistics();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      zipCode: user?.zipCode || '',
      role: user?.role || 'buyer'
    });
    setIsEditing(false);
  };

  if (!user) {
    navigate('/auth/signin');
    return null;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Profile</h2>
            </div>
            <div className="card-body">
              {showSuccess && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="bi bi-check-circle me-2"></i>
                  Profile updated successfully!
                  <button type="button" className="btn-close" onClick={() => setShowSuccess(false)}></button>
                </div>
              )}
              <div className="row mb-4">
                <div className="col-md-3 text-center">
                  <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
                    <i className="bi bi-person fs-1 text-muted"></i>
                  </div>
                  <h5 className="mt-2">{user.firstName} {user.lastName}</h5>
                  <span className="badge bg-secondary">{user.role}</span>
                </div>
                <div className="col-md-9">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Personal Information</h4>
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Phone</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div className="row">
                      {user?.role === 'admin' && (
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Role</label>
                          <select
                            className="form-select"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          >
                            <option value="buyer">Buyer (Consumer)</option>
                            <option value="farmer">Farmer (Producer)</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      )}
                      <div className={`mb-3 ${user?.role === 'admin' ? 'col-md-6' : 'col-md-12'}`}>
                        <label className="form-label">Account Created</label>
                        <input
                          type="text"
                          className="form-control"
                          value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          disabled
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          className="form-control"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          className="form-control"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">ZIP Code</label>
                        <input
                          type="text"
                          className="form-control"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    {isEditing && (
                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                          Save Changes
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
              
              <hr />
              
              <div className="row">
                <div className="col-md-6">
                  <h5>Account Statistics</h5>
                  {loading ? (
                    <div className="text-center py-3">
                      <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <small className="text-muted">Loading statistics...</small>
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      <div className="list-group-item d-flex justify-content-between">
                        <span>Total Orders</span>
                        <span className="badge bg-primary">{stats.totalOrders}</span>
                      </div>
                      <div className="list-group-item d-flex justify-content-between">
                        <span>Wishlist Items</span>
                        <span className="badge bg-warning">{stats.wishlistItems}</span>
                      </div>
                      <div className="list-group-item d-flex justify-content-between">
                        <span>Reviews Given</span>
                        <span className="badge bg-success">{stats.reviewsGiven}</span>
                      </div>
                      {user?.role === 'farmer' && (
                        <>
                          <div className="list-group-item d-flex justify-content-between">
                            <span>Total Products</span>
                            <span className="badge bg-info">{stats.totalProducts}</span>
                          </div>
                          <div className="list-group-item d-flex justify-content-between">
                            <span>Total Revenue</span>
                            <span className="badge bg-success">₹{stats.totalRevenue.toFixed(2)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <h5>Quick Actions</h5>
                  <div className="d-grid gap-2">
                    {user?.role === 'buyer' && (
                      <>
                        <button className="btn btn-outline-primary" onClick={() => navigate('/orders')}>
                          <i className="bi bi-list-check me-2"></i>
                          View Orders
                        </button>
                        <button className="btn btn-outline-secondary" onClick={() => navigate('/products')}>
                          <i className="bi bi-shop me-2"></i>
                          Browse Products
                        </button>
                        <button className="btn btn-outline-info" onClick={() => navigate('/cart')}>
                          <i className="bi bi-cart me-2"></i>
                          View Cart
                        </button>
                        <button className="btn btn-outline-warning" onClick={() => navigate('/wishlist')}>
                          <i className="bi bi-heart me-2"></i>
                          View Wishlist
                        </button>
                      </>
                    )}
                    
                    {user?.role === 'farmer' && (
                      <>
                        <button className="btn btn-outline-primary" onClick={() => navigate('/dashboard')}>
                          <i className="bi bi-speedometer2 me-2"></i>
                          Farmer Dashboard
                        </button>
                        <button className="btn btn-outline-success" onClick={() => navigate('/products/add')}>
                          <i className="bi bi-plus-circle me-2"></i>
                          Add Product
                        </button>
                        <button className="btn btn-outline-info" onClick={() => navigate('/products/manage')}>
                          <i className="bi bi-box-seam me-2"></i>
                          Manage Products
                        </button>
                        <button className="btn btn-outline-warning" onClick={() => navigate('/orders')}>
                          <i className="bi bi-list-check me-2"></i>
                          View Orders
                        </button>
                      </>
                    )}
                    
                    {user?.role === 'admin' && (
                      <>
                        <button className="btn btn-outline-primary" onClick={() => navigate('/admin')}>
                          <i className="bi bi-shield-check me-2"></i>
                          Admin Dashboard
                        </button>
                        <button className="btn btn-outline-success" onClick={() => navigate('/admin/products')}>
                          <i className="bi bi-box-seam me-2"></i>
                          Manage Products
                        </button>
                        <button className="btn btn-outline-info" onClick={() => navigate('/admin/users')}>
                          <i className="bi bi-people me-2"></i>
                          Manage Users
                        </button>
                        <button className="btn btn-outline-warning" onClick={() => navigate('/orders')}>
                          <i className="bi bi-list-check me-2"></i>
                          View All Orders
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <hr />
              
              <div className="row">
                <div className="col-12">
                  <h5>Role Information</h5>
                  <div className="alert alert-info">
                    <div className="row">
                      <div className="col-md-4">
                        <h6><i className="bi bi-person me-2"></i>Buyer (Consumer)</h6>
                        <small className="text-muted">Browse and purchase products, track orders, manage profile</small>
                      </div>
                      <div className="col-md-4">
                        <h6><i className="bi bi-shop me-2"></i>Farmer (Producer)</h6>
                        <small className="text-muted">Add products, manage inventory, view orders</small>
                      </div>
                      <div className="col-md-4">
                        <h6><i className="bi bi-shield-check me-2"></i>Admin</h6>
                        <small className="text-muted">Approve products, manage users, view analytics</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 