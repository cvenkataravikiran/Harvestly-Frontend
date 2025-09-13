import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, showSeller = false, onAddToCart }) => {
  const { 
    id, 
    name, 
    description = '', 
    price, 
    category, 
    image, 
    sellerName, 
    farmName, 
    farmLocation, 
    farmCity, 
    farmState, 
    stock = 0, 
    unit = 'unit' 
  } = product;

  const getCategoryBadgeClass = () => {
    return category === 'Organic' ? 'bg-success' : 'bg-warning';
  };

  const getCategoryTextColor = () => {
    return category === 'Organic' ? 'text-success' : 'text-warning';
  };

  return (
    <div className="card h-100 product-card shadow-sm">
      <div className="position-relative">
        <img 
          src={image || '/images/placeholder.jpg'} 
          className="card-img-top" 
          alt={name}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <div className="position-absolute top-0 start-0 m-2">
          <span className={`badge ${getCategoryBadgeClass()} fs-6`}>
            {category || 'Product'}
          </span>
        </div>
        {stock <= 10 && stock > 0 && (
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-danger fs-6">
              Low Stock
            </span>
          </div>
        )}
        {stock === 0 && (
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-secondary fs-6">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold mb-2">{name}</h5>
        
        {showSeller && (
          <div className="mb-2">
            <small className="text-muted">
              <i className="bi bi-person me-1"></i>
              {sellerName || 'Unknown Seller'}
            </small>
            <br />
            <small className="text-muted">
              <i className="bi bi-house me-1"></i>
              {farmName || 'Unknown Farm'}
            </small>
            {farmLocation && (
              <>
                <br />
                <small className="text-muted">
                  <i className="bi bi-geo-alt me-1"></i>
                  {farmLocation}, {farmCity}, {farmState}
                </small>
              </>
            )}
          </div>
        )}
        
        {description && (
          <p className="card-text text-muted flex-grow-1">
            {description.length > 100 
              ? `${description.substring(0, 100)}...` 
              : description
            }
          </p>
        )}
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <span className="fs-4 fw-bold text-primary">₹{price}</span>
            <small className="text-muted ms-1">per {unit}</small>
          </div>
          <div className="text-end">
            <small className={`fw-bold ${getCategoryTextColor()}`}>
              {category || 'Product'}
            </small>
            <br />
            <small className="text-muted">
              Stock: {stock} {unit}
            </small>
          </div>
        </div>
        
        <div className="d-grid gap-2">
          {stock > 0 ? (
            <>
              <button 
                className="btn btn-primary"
                onClick={() => onAddToCart && onAddToCart(product)}
                disabled={!onAddToCart}
              >
                <i className="bi bi-cart-plus me-2"></i>
                Add to Cart
              </button>
              <Link 
                to={`/product/${id}`} 
                className="btn btn-outline-secondary"
              >
                <i className="bi bi-eye me-2"></i>
                View Details
              </Link>
            </>
          ) : (
            <button className="btn btn-secondary" disabled>
              <i className="bi bi-x-circle me-2"></i>
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 