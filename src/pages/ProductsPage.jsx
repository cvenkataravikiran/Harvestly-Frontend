import React, { useState, useEffect } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ui/ProductCard';

const ProductsPage = () => {
  const { approvedProducts } = useProducts();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    let filtered = approvedProducts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.sellerName && product.sellerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.farmName && product.farmName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'oldest':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [approvedProducts, searchTerm, categoryFilter, sortBy]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const getCategoryStats = () => {
    const stats = {
      total: approvedProducts.length,
      organic: approvedProducts.filter(p => p.category === 'Organic').length,
      fertilized: approvedProducts.filter(p => p.category === 'Fertilized').length
    };
    return stats;
  };

  const stats = getCategoryStats();

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-5 fw-bold text-primary mb-3">
            <i className="bi bi-grid me-3"></i>
            Fresh Products
          </h1>
          <p className="lead text-muted">
            Discover fresh, local produce from trusted farmers in your area
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h3 className="mb-0">{stats.total}</h3>
              <small>Total Products</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h3 className="mb-0">{stats.organic}</h3>
              <small>Organic Products</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h3 className="mb-0">{stats.fertilized}</h3>
              <small>Fertilized Products</small>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search products, farmers, or farms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Organic">Organic Only</option>
            <option value="Fertilized">Fertilized Only</option>
          </select>
        </div>
        <div className="col-md-3 mb-3">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Results Info */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0">
              Showing <strong>{filteredProducts.length}</strong> of <strong>{approvedProducts.length}</strong> products
            </p>
            {searchTerm && (
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setSearchTerm('')}
              >
                <i className="bi bi-x me-1"></i>
                Clear Search
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="row g-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="col-md-6 col-lg-4 col-xl-3">
              <ProductCard
                product={product}
                showSeller={true}
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-search display-1 text-muted"></i>
          </div>
          <h4 className="text-muted mb-3">No products found</h4>
          <p className="text-muted mb-4">
            {searchTerm 
              ? `No products match your search for "${searchTerm}"`
              : 'No products are currently available'
            }
          </p>
          {searchTerm && (
            <button
              className="btn btn-primary"
              onClick={() => setSearchTerm('')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Load More Button (if needed) */}
      {filteredProducts.length > 0 && filteredProducts.length < approvedProducts.length && (
        <div className="text-center mt-5">
          <button className="btn btn-outline-primary btn-lg">
            <i className="bi bi-arrow-down me-2"></i>
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage; 