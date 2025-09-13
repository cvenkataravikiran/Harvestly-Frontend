import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import NotificationBell from './NotificationBell';

const Navigation = () => {
  const { user, isAuthenticated, isBuyer, isFarmer, isAdmin, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
      setIsMenuOpen(false);
    }
  };

  const getRoleDisplayName = () => {
    if (isAdmin) return 'Admin';
    if (isFarmer) return 'Farmer';
    if (isBuyer) return 'Buyer';
    return 'Guest';
  };

  const getRoleBadgeClass = () => {
    if (isAdmin) return 'bg-danger';
    if (isFarmer) return 'bg-warning';
    if (isBuyer) return 'bg-success';
    return 'bg-secondary';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold text-primary" to="/">
          <i className="bi bi-flower1 me-2"></i>
          Harvestly
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-house me-1"></i>
                Home
              </Link>
            </li>
            
            {isAuthenticated && (
              <>
                {isBuyer && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/products" onClick={() => setIsMenuOpen(false)}>
                        <i className="bi bi-grid me-1"></i>
                        Products
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/orders" onClick={() => setIsMenuOpen(false)}>
                        <i className="bi bi-box me-1"></i>
                        My Orders
                      </Link>
                    </li>
                  </>
                )}
                
                {isFarmer && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <i className="bi bi-speedometer2 me-1"></i>
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/products/manage" onClick={() => setIsMenuOpen(false)}>
                        <i className="bi bi-box-seam me-1"></i>
                        My Products
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/orders" onClick={() => setIsMenuOpen(false)}>
                        <i className="bi bi-list-check me-1"></i>
                        Orders
                      </Link>
                    </li>
                  </>
                )}
                
                {isAdmin && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin" onClick={() => setIsMenuOpen(false)}>
                        <i className="bi bi-shield-check me-1"></i>
                        Admin Panel
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/products" onClick={() => setIsMenuOpen(false)}>
                        <i className="bi bi-box-seam me-1"></i>
                        Manage Products
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/users" onClick={() => setIsMenuOpen(false)}>
                        <i className="bi bi-people me-1"></i>
                        Manage Users
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>

          {/* Right Side Navigation */}
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                {/* Cart for Buyers */}
                {isBuyer && (
                  <li className="nav-item">
                    <Link className="nav-link position-relative" to="/cart" onClick={() => setIsMenuOpen(false)}>
                      <i className="bi bi-cart3 fs-5"></i>
                      {getCartCount() > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {getCartCount()}
                        </span>
                      )}
                    </Link>
                  </li>
                )}

                {/* Notification Bell for Farmers */}
                {isFarmer && (
                  <li className="nav-item">
                    <NotificationBell />
                  </li>
                )}

                {/* User Dropdown */}
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    data-bs-toggle="dropdown"
                  >
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                         style={{ width: '32px', height: '32px' }}>
                      <span className="text-white fw-bold small">
                        {user?.firstName?.charAt(0)}
                      </span>
                    </div>
                    <div className="text-start">
                      <div className="small fw-bold">{user?.firstName} {user?.lastName}</div>
                      <div className="small text-muted">{user?.email}</div>
                    </div>
                  </button>
                  
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <div className="dropdown-header">
                        <span className={`badge ${getRoleBadgeClass()} me-2`}>
                          {getRoleDisplayName()}
                        </span>
                        <small className="text-muted">{user?.email}</small>
                      </div>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    
                    <li>
                      <Link className="dropdown-item" to="/profile" onClick={() => setIsMenuOpen(false)}>
                        <i className="bi bi-person me-2"></i>
                        Profile
                      </Link>
                    </li>
                    
                    {isBuyer && (
                      <>
                        <li>
                          <Link className="dropdown-item" to="/orders" onClick={() => setIsMenuOpen(false)}>
                            <i className="bi bi-box me-2"></i>
                            My Orders
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/wishlist" onClick={() => setIsMenuOpen(false)}>
                            <i className="bi bi-heart me-2"></i>
                            Wishlist
                          </Link>
                        </li>
                      </>
                    )}
                    
                                         {isFarmer && (
                       <>
                         <li>
                           <Link className="dropdown-item" to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                             <i className="bi bi-speedometer2 me-2"></i>
                             Farmer Dashboard
                           </Link>
                         </li>
                         <li>
                           <Link className="dropdown-item" to="/products/manage" onClick={() => setIsMenuOpen(false)}>
                             <i className="bi bi-box-seam me-2"></i>
                             My Products
                           </Link>
                         </li>
                       </>
                     )}
                    
                    {isAdmin && (
                      <>
                        <li>
                          <Link className="dropdown-item" to="/admin" onClick={() => setIsMenuOpen(false)}>
                            <i className="bi bi-shield-check me-2"></i>
                            Admin Panel
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/admin/analytics" onClick={() => setIsMenuOpen(false)}>
                            <i className="bi bi-graph-up me-2"></i>
                            Analytics
                          </Link>
                        </li>
                      </>
                    )}
                    
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/auth/signin" onClick={() => setIsMenuOpen(false)}>
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Sign In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary" to="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                    <i className="bi bi-person-plus me-1"></i>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 