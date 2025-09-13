import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminProductsPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, [filter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/products/${filter}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data.products || []);
      }
    } catch (error) {
      console.error('Error loading products:', error);
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
        // Send notification to farmer
        await sendNotificationToFarmer(productId, 'approved');
        loadProducts();
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
        // Send notification to farmer
        await sendNotificationToFarmer(productId, 'rejected', reason);
        loadProducts();
      }
    } catch (error) {
      console.error('Error rejecting product:', error);
    }
  };

  const sendNotificationToFarmer = async (productId, action, reason = '') => {
    try {
      const product = products.find(p => p._id === productId);
      if (!product) return;

      const notificationData = {
        farmerId: product.sellerId,
        type: action === 'approved' ? 'product_approved' : 'product_rejected',
        title: action === 'approved' ? 'Product Approved!' : 'Product Rejected',
        message: action === 'approved' 
          ? `Your product "${product.name}" has been approved and is now visible to buyers.`
          : `Your product "${product.name}" was rejected. Reason: ${reason}`,
        productId: productId
      };

      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(notificationData)
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) return;

    try {
      const response = await fetch(`/api/admin/products/bulk-${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          productIds: selectedProducts,
          reason: action === 'reject' ? 'Quality standards not met' : undefined
        })
      });
      
      if (response.ok) {
        setSelectedProducts([]);
        loadProducts();
      }
    } catch (error) {
      console.error(`Error bulk ${action}ing products:`, error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { class: 'bg-warning', icon: 'bi-clock' },
      'Approved': { class: 'bg-success', icon: 'bi-check-circle' },
      'Rejected': { class: 'bg-danger', icon: 'bi-x-circle' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', icon: 'bi-question-circle' };
    return (
      <span className={`badge ${config.class}`}>
        <i className={`${config.icon} me-1`}></i>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading products...</p>
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
              <h1 className="display-5 fw-bold text-dark mb-0">Product Management</h1>
              <p className="text-muted mb-0">Manage and approve farmer products</p>
            </div>
            <div className="btn-group">
              <button
                type="button"
                className={`btn btn-outline-primary ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Pending ({products.filter(p => p.status === 'Pending').length})
              </button>
              <button
                type="button"
                className={`btn btn-outline-success ${filter === 'approved' ? 'active' : ''}`}
                onClick={() => setFilter('approved')}
              >
                Approved ({products.filter(p => p.status === 'Approved').length})
              </button>
              <button
                type="button"
                className={`btn btn-outline-danger ${filter === 'rejected' ? 'active' : ''}`}
                onClick={() => setFilter('rejected')}
              >
                Rejected ({products.filter(p => p.status === 'Rejected').length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Bulk Actions */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-end gap-2">
            {filter === 'pending' && selectedProducts.length > 0 && (
              <>
                <button
                  className="btn btn-success"
                  onClick={() => handleBulkAction('approve')}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Approve Selected ({selectedProducts.length})
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleBulkAction('reject')}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Reject Selected ({selectedProducts.length})
                </button>
              </>
            )}
            <button
              className="btn btn-outline-secondary"
              onClick={loadProducts}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts(filteredProducts.map(p => p._id));
                        } else {
                          setSelectedProducts([]);
                        }
                      }}
                    />
                  </th>
                  <th>Product</th>
                  <th>Farmer</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedProducts.includes(product._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([...selectedProducts, product._id]);
                          } else {
                            setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                          }
                        }}
                      />
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={product.image || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="rounded me-3"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                        <div>
                          <h6 className="mb-1">{product.name}</h6>
                          <small className="text-muted">
                            {product.description?.substring(0, 60)}...
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{product.sellerName}</strong>
                        <br />
                        <small className="text-muted">{product.farmName}</small>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-info">{product.category}</span>
                    </td>
                    <td>
                      <strong>₹{product.price}</strong>
                      <br />
                      <small className="text-muted">per {product.unit}</small>
                    </td>
                    <td>
                      <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {product.stock} {product.unit}
                      </span>
                    </td>
                    <td>{getStatusBadge(product.status)}</td>
                    <td>
                      {new Date(product.createdAt).toLocaleDateString()}
                      <br />
                      <small className="text-muted">
                        {new Date(product.createdAt).toLocaleTimeString()}
                      </small>
                    </td>
                    <td>
                      {product.status === 'Pending' && (
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-success"
                            onClick={() => handleApproveProduct(product._id)}
                            title="Approve Product"
                          >
                            <i className="bi bi-check"></i>
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              const reason = prompt('Enter rejection reason:');
                              if (reason) {
                                handleRejectProduct(product._id, reason);
                              }
                            }}
                            title="Reject Product"
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      )}
                      {product.status === 'Rejected' && product.rejectionReason && (
                        <small className="text-danger d-block">
                          Reason: {product.rejectionReason}
                        </small>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-5">
              <div className="fs-1 mb-3">📦</div>
              <h4 className="text-muted">No products found</h4>
              <p className="text-muted">
                {filter === 'pending' && 'No products pending approval'}
                {filter === 'approved' && 'No approved products'}
                {filter === 'rejected' && 'No rejected products'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage; 