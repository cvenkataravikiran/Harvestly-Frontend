import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ui/ProductCard';

const FarmerProductsPage = () => {
  const { user } = useAuth();
  const { getMyProducts, products } = useProducts();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      if (user?.id) {
        try {
          await getMyProducts();
        } catch (error) {
          console.error('Failed to load products:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadProducts();
  }, [user?.id, getMyProducts]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading your products...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Products</h2>
        <Link to="/products/add" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Product
        </Link>
      </div>

      {products.length > 0 ? (
        <div className="row">
          {products.map(product => (
            <div key={product.id} className="col-md-4 mb-4">
              <ProductCard product={product} showSeller={false} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-box-seam text-muted" style={{ fontSize: '4rem' }}></i>
          <h5 className="text-muted mt-3">No Products Yet</h5>
          <p className="text-muted">Start by adding your first product.</p>
          <Link to="/products/add" className="btn btn-primary">
            <i className="bi bi-plus-circle me-2"></i>
            Add Your First Product
          </Link>
        </div>
      )}
    </div>
  );
};

export default FarmerProductsPage; 