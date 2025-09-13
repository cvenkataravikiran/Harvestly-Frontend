import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ui/ProductCard';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const { products, loading, error, searchProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    if (searchTerm) {
      searchProducts({ query: searchTerm, category: categoryFilter, sortBy });
    }
  }, [searchTerm, categoryFilter, sortBy, searchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchProducts({ query: searchTerm, category: categoryFilter, sortBy });
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Searching products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="display-5 fw-bold text-dark mb-4">
            <i className="bi bi-search me-3"></i>
            Search Products
          </h1>
        </div>
      </div>

      {/* Search Form */}
      <div className="row mb-4">
        <div className="col-12">
          <form onSubmit={handleSearch} className="card">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Grains">Grains</option>
                    <option value="Spices">Spices</option>
                  </select>
                </div>
                <div className="col-md-3">
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
              <div className="mt-3">
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-search me-2"></i>
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Search Results */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {searchTerm && (
        <div className="row mb-4">
          <div className="col-12">
            <h4>Search Results for "{searchTerm}"</h4>
            <p className="text-muted">
              Found {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {products.length > 0 ? (
        <div className="row">
          {products.map(product => (
            <div key={product._id || product.id} className="col-md-6 col-lg-4 mb-4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : searchTerm ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
          </div>
          <h3 className="text-muted mb-3">No products found</h3>
          <p className="text-muted mb-4">
            Try adjusting your search terms or browse all products
          </p>
          <a href="/products" className="btn btn-primary btn-lg">
            <i className="bi bi-shop me-2"></i>
            Browse All Products
          </a>
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
          </div>
          <h3 className="text-muted mb-3">Start your search</h3>
          <p className="text-muted mb-4">
            Enter keywords to find fresh products from local farmers
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage; 