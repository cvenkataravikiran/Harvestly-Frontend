import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { isBuyer } = useAuth();
  
  const [quantity, setQuantity] = useState(1);
  
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Product not found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert('Product added to cart!');
  };

  const getCategoryBadgeClass = () => {
    return product.category === 'Organic' ? 'bg-success' : 'bg-warning';
  };

  const getStatusBadgeClass = () => {
    return product.status === 'Approved' ? 'bg-success' : 
           product.status === 'Pending' ? 'bg-warning' : 'bg-secondary';
  };

  return (
    <div className="container py-5">
      <div className="row">
        {/* Product Image */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <img
              src={product.image}
              className="card-img-top"
              alt={product.name}
              style={{ height: '400px', objectFit: 'cover' }}
            />
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <span className={`badge ${getCategoryBadgeClass()} fs-6`}>
                  {product.category}
                </span>
                <span className={`badge ${getStatusBadgeClass()} fs-6`}>
                  {product.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <h1 className="display-5 fw-bold mb-3">{product.name}</h1>
          
          <div className="mb-3">
            <span className="display-6 fw-bold text-primary">₹{product.price}</span>
            <span className="text-muted ms-2">per {product.unit}</span>
          </div>

          <div className="mb-4">
            <p className="lead">{product.description}</p>
          </div>

          {/* Seller Information */}
          <div className="card mb-4">
            <div className="card-body">
              <h6 className="card-title">
                <i className="bi bi-person me-2"></i>
                Seller Information
              </h6>
              <div className="row">
                <div className="col-6">
                  <small className="text-muted">Seller:</small><br />
                  <strong>{product.sellerName}</strong>
                </div>
                <div className="col-6">
                  <small className="text-muted">Farm:</small><br />
                  <strong>{product.farmName}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">Available Stock:</span>
              <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'} fs-6`}>
                {product.stock} {product.unit}
              </span>
            </div>
            {product.stock <= 10 && product.stock > 0 && (
              <div className="alert alert-warning mt-2">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Low stock! Only {product.stock} {product.unit} remaining.
              </div>
            )}
          </div>

          {/* Add to Cart Section */}
          {isBuyer && product.status === 'Approved' && (
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Add to Cart</h6>
                
                {product.stock > 0 ? (
                  <>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label className="form-label">Quantity:</label>
                        <div className="input-group">
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <input
                            type="number"
                            className="form-control text-center"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            max={product.stock}
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Total Price:</label>
                        <div className="h5 text-primary">
                          ₹{(product.price * quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      className="btn btn-primary btn-lg w-100"
                      onClick={handleAddToCart}
                    >
                      <i className="bi bi-cart-plus me-2"></i>
                      Add to Cart
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="alert alert-secondary">
                      <i className="bi bi-x-circle me-2"></i>
                      This product is currently out of stock.
                    </div>
                    <button className="btn btn-outline-primary" disabled>
                      Out of Stock
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {!isBuyer && (
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              Please sign in as a buyer to purchase this product.
            </div>
          )}

          {product.status !== 'Approved' && (
            <div className="alert alert-warning">
              <i className="bi bi-clock me-2"></i>
              This product is pending approval and not available for purchase.
            </div>
          )}

          {/* Back Button */}
          <div className="mt-4">
            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate('/products')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Products
            </button>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Product Details</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <strong>Category:</strong><br />
                  <span className={`badge ${getCategoryBadgeClass()}`}>
                    {product.category}
                  </span>
                </div>
                <div className="col-md-3">
                  <strong>Unit:</strong><br />
                  {product.unit}
                </div>
                <div className="col-md-3">
                  <strong>Added:</strong><br />
                  {new Date(product.createdAt).toLocaleDateString()}
                </div>
                <div className="col-md-3">
                  <strong>Status:</strong><br />
                  <span className={`badge ${getStatusBadgeClass()}`}>
                    {product.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 