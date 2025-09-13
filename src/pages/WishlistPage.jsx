import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ui/ProductCard';

const WishlistPage = () => {
  const { user } = useAuth();
  const { products } = useProducts();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load wishlist from localStorage (in production, this would come from API)
    const loadWishlist = () => {
      try {
        const savedWishlist = localStorage.getItem(`wishlist_${user?.id}`);
        if (savedWishlist) {
          const wishlistIds = JSON.parse(savedWishlist);
          const wishlistProducts = products.filter(product => 
            wishlistIds.includes(product._id || product.id)
          );
          setWishlistItems(wishlistProducts);
        }
      } catch (error) {
        console.error('Failed to load wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadWishlist();
    } else {
      setLoading(false);
    }
  }, [user?.id, products]);

  const removeFromWishlist = (productId) => {
    try {
      const savedWishlist = localStorage.getItem(`wishlist_${user?.id}`);
      if (savedWishlist) {
        const wishlistIds = JSON.parse(savedWishlist);
        const updatedWishlist = wishlistIds.filter(id => id !== productId);
        localStorage.setItem(`wishlist_${user?.id}`, JSON.stringify(updatedWishlist));
        
        setWishlistItems(prev => prev.filter(item => 
          (item._id || item.id) !== productId
        ));
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="display-5 fw-bold text-dark mb-4">
            <i className="bi bi-heart-fill text-danger me-3"></i>
            My Wishlist
          </h1>
        </div>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="row">
          {wishlistItems.map(product => (
            <div key={product._id || product.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 position-relative">
                <button
                  className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2"
                  onClick={() => removeFromWishlist(product._id || product.id)}
                  style={{ zIndex: 1 }}
                >
                  <i className="bi bi-x"></i>
                </button>
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-heart text-muted" style={{ fontSize: '4rem' }}></i>
          </div>
          <h3 className="text-muted mb-3">Your wishlist is empty</h3>
          <p className="text-muted mb-4">Start adding products you love to your wishlist!</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            <i className="bi bi-shop me-2"></i>
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default WishlistPage; 