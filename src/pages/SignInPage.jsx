import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, setShowProfileModal } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData);
      
      if (result.success) {
        // Check if user needs to complete profile
        const user = result.user;
        const needsProfileCompletion = !user.address || !user.city || !user.state || !user.zipCode;
        
        if (needsProfileCompletion) {
          setShowProfileModal(true);
        }
        
        // Navigate based on user role
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (user.role === 'farmer') {
          navigate('/dashboard');
        } else {
          navigate('/products');
        }
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setIsLoading(true);
    setError('');

    let demoCredentials;
    switch (role) {
      case 'buyer':
        demoCredentials = { email: 'buyer@example.com', password: 'password123' };
        break;
      case 'farmer':
        demoCredentials = { email: 'farmer@example.com', password: 'password123' };
        break;
      case 'admin':
        demoCredentials = { email: 'admin@example.com', password: 'password123' };
        break;
      default:
        demoCredentials = { email: 'buyer@example.com', password: 'password123' };
    }

    try {
      const result = await login(demoCredentials);
      
      if (result.success) {
        const user = result.user;
        const needsProfileCompletion = !user.address || !user.city || !user.state || !user.zipCode;
        
        if (needsProfileCompletion) {
          setShowProfileModal(true);
        }
        
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (user.role === 'farmer') {
          navigate('/dashboard');
        } else {
          navigate('/products');
        }
      } else {
        setError(result.error || 'Demo login failed');
      }
    } catch (error) {
      setError(error.message || 'An error occurred during demo login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary mb-2">Welcome Back</h2>
                  <p className="text-muted">Sign in to your Harvestly account</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="d-grid mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center mb-3">
                  <span className="text-muted">Or try demo accounts:</span>
                </div>

                <div className="d-grid gap-2 mb-3">
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={() => handleDemoLogin('buyer')}
                    disabled={isLoading}
                  >
                    <i className="bi bi-person me-2"></i>
                    Demo Buyer
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    onClick={() => handleDemoLogin('farmer')}
                    disabled={isLoading}
                  >
                    <i className="bi bi-shop me-2"></i>
                    Demo Farmer
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => handleDemoLogin('admin')}
                    disabled={isLoading}
                  >
                    <i className="bi bi-shield-check me-2"></i>
                    Demo Admin
                  </button>
                </div>

                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Link to="/auth/signup" className="text-primary text-decoration-none">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage; 