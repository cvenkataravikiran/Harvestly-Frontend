import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const WelcomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [showLearnMore, setShowLearnMore] = useState(false);

  const features = [
    {
      icon: 'bi-flower1',
      title: 'Fresh from Farm',
      description: 'Get the freshest produce directly from local farmers'
    },
    {
      icon: 'bi-truck',
      title: 'Fast Delivery',
      description: 'Same-day delivery to your doorstep'
    },
    {
      icon: 'bi-currency-rupee',
      title: 'Best Prices',
      description: 'Competitive prices with no hidden fees'
    },
    {
      icon: 'bi-leaf',
      title: 'Organic Options',
      description: 'Wide selection of organic and natural products'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Home Chef',
      content: 'The quality of vegetables I get from Harvestly is unmatched. Fresh, crisp, and delivered right to my kitchen!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Restaurant Owner',
      content: 'As a restaurant owner, I need reliable suppliers. Harvestly has never let me down with their consistent quality.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Health Enthusiast',
      content: 'I love that I can get organic produce delivered weekly. It has made healthy eating so much easier for my family.',
      rating: 5
    }
  ];

  const getDashboardLink = () => {
    if (!user) return '/auth/signup';
    if (user.role === 'buyer') return '/products';
    if (user.role === 'farmer') return '/dashboard';
    if (user.role === 'admin') return '/admin';
    return '/products';
  };

  const getBrowseLink = () => {
    if (!user) return '/auth/signup';
    if (user.role === 'buyer') return '/products';
    if (user.role === 'farmer') return '/dashboard';
    if (user.role === 'admin') return '/admin';
    return '/products';
  };

  return (
    <div className="welcome-page">
      {/* Hero Section */}
      <section className="hero-section text-white position-relative py-5">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <h1 className="display-3 fw-bold mb-4">
                Welcome to Harvestly
              </h1>
              <p className="lead mb-4">
                Your gateway to fresh, local produce delivered straight from farm to table. 
                Experience the difference that fresh, quality ingredients make in your cooking.
              </p>
              <div className="d-flex gap-3">
                {isAuthenticated ? (
                  <Link to={getDashboardLink()} className="btn btn-light btn-lg">
                    {user?.role === 'buyer' ? 'Browse Products' : 
                     user?.role === 'farmer' ? 'Farmer Dashboard' : 
                     user?.role === 'admin' ? 'Admin Panel' : 'Go to Dashboard'}
                  </Link>
                ) : (
                  <>
                    <Link to="/auth/signup" className="btn btn-light btn-lg">
                      Get Started
                    </Link>
                    <Link to="/auth/signin" className="btn btn-outline-light btn-lg">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="bg-white bg-opacity-10 rounded p-4">
                <h3 className="mb-3">Why Choose Harvestly?</h3>
                <div className="row g-3">
                  {features.map((feature, index) => (
                    <div key={index} className="col-6">
                      <div className="bg-white bg-opacity-20 rounded p-3">
                        <div className="fs-1 mb-2">
                          <i className={`bi ${feature.icon} text-white`}></i>
                        </div>
                        <h6 className="mb-1">{feature.title}</h6>
                        <small>{feature.description}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-4">About Harvestly</h2>
              <p className="lead mb-4">
                We connect local farmers with consumers, ensuring you get the freshest produce 
                while supporting sustainable farming practices.
              </p>
              <div className="row g-4">
                <div className="col-6">
                  <div className="text-center">
                    <h3 className="text-primary fw-bold">500+</h3>
                    <p className="text-muted">Happy Farmers</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center">
                    <h3 className="text-primary fw-bold">10K+</h3>
                    <p className="text-muted">Satisfied Customers</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center">
                    <h3 className="text-primary fw-bold">50+</h3>
                    <p className="text-muted">Cities Served</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center">
                    <h3 className="text-primary fw-bold">24h</h3>
                    <p className="text-muted">Delivery Time</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="bg-white rounded shadow p-4">
                <h4 className="mb-3">Our Mission</h4>
                <p className="mb-3">
                  To revolutionize the way people access fresh, local produce by creating a 
                  direct connection between farmers and consumers.
                </p>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Support local farmers and sustainable agriculture
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Provide fresh, high-quality produce to consumers
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Reduce food waste and carbon footprint
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Create transparent and fair pricing
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">How It Works</h2>
            <p className="lead text-muted">
              Simple steps to get fresh produce delivered to your doorstep
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-search text-white fs-2"></i>
              </div>
              <h4>1. Browse Products</h4>
              <p className="text-muted">Explore fresh produce from local farmers in your area</p>
            </div>
            <div className="col-md-4 text-center">
              <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-cart-check text-white fs-2"></i>
              </div>
              <h4>2. Order & Pay</h4>
              <p className="text-muted">Add items to cart and pay securely with Razorpay</p>
            </div>
            <div className="col-md-4 text-center">
              <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-house-check text-white fs-2"></i>
              </div>
              <h4>3. Get Delivery</h4>
              <p className="text-muted">Fresh produce delivered to your doorstep within 24 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">What Our Customers Say</h2>
            <p className="lead text-muted">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>
          <div className="row g-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="col-lg-4">
                <div className="testimonial-card h-100 p-4 rounded shadow bg-white">
                  <div className="mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                    ))}
                  </div>
                  <blockquote className="fs-5 mb-3">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="d-flex align-items-center">
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{ width: '50px', height: '50px' }}>
                      <span className="text-white fw-bold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h6 className="mb-0">{testimonial.name}</h6>
                      <small className="text-muted">{testimonial.role}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 text-white">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-4">
                Ready to Experience Fresh Produce?
              </h2>
              <p className="lead mb-4">
                Join thousands of customers who have already discovered the difference 
                that fresh, local produce makes in their daily lives.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                {isAuthenticated ? (
                  <Link to={getBrowseLink()} className="btn btn-light btn-lg">
                                         {user?.role === 'buyer' ? 'Browse Products' : 
                      user?.role === 'farmer' ? 'Farmer Dashboard' : 
                      user?.role === 'admin' ? 'Admin Panel' : 'Start Shopping'}
                  </Link>
                ) : (
                  <>
                    <Link to="/auth/signup" className="btn btn-light btn-lg">
                      Start Shopping
                    </Link>
                    <button 
                      onClick={() => setShowLearnMore(!showLearnMore)} 
                      className="btn btn-outline-light btn-lg"
                    >
                      Learn More
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learn More Modal */}
      {showLearnMore && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-info-circle me-2"></i>
                  Learn More About Harvestly
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowLearnMore(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <h6><i className="bi bi-shield-check text-success me-2"></i>Quality Assurance</h6>
                    <p className="text-muted small">All products are carefully verified and approved by our quality team before reaching you.</p>
                  </div>
                  <div className="col-md-6 mb-4">
                    <h6><i className="bi bi-truck text-primary me-2"></i>Fast Delivery</h6>
                    <p className="text-muted small">Same-day delivery in most areas, ensuring your produce stays fresh and crisp.</p>
                  </div>
                  <div className="col-md-6 mb-4">
                    <h6><i className="bi bi-currency-rupee text-warning me-2"></i>Fair Pricing</h6>
                    <p className="text-muted small">Direct farm-to-consumer model eliminates middlemen, ensuring better prices for both farmers and consumers.</p>
                  </div>
                  <div className="col-md-6 mb-4">
                    <h6><i className="bi bi-leaf text-success me-2"></i>Sustainable Farming</h6>
                    <p className="text-muted small">We support farmers who practice sustainable and organic farming methods.</p>
                  </div>
                </div>
                
                <hr />
                
                <h6>Our Commitment</h6>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    <strong>Freshness Guarantee:</strong> All products are harvested within 24 hours of delivery
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    <strong>Local Support:</strong> Supporting local farmers and communities
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    <strong>Transparent Pricing:</strong> No hidden fees or surprise charges
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    <strong>Customer Satisfaction:</strong> 100% satisfaction guarantee or your money back
                  </li>
                </ul>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowLearnMore(false)}
                >
                  Close
                </button>
                <Link 
                  to="/auth/signup" 
                  className="btn btn-primary"
                  onClick={() => setShowLearnMore(false)}
                >
                  Get Started Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="display-5 fw-bold mb-4">Get in Touch</h2>
              <p className="lead mb-4">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="text-center">
                    <i className="bi bi-envelope-fill text-primary fs-1 mb-3"></i>
                    <h5>Email</h5>
                    <p className="text-muted">support@harvestly.com</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <i className="bi bi-telephone-fill text-primary fs-1 mb-3"></i>
                    <h5>Phone</h5>
                    <p className="text-muted">+91 98765 43210</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <i className="bi bi-geo-alt-fill text-primary fs-1 mb-3"></i>
                    <h5>Address</h5>
                    <p className="text-muted">123 Farm Street, Mumbai, Maharashtra 400001</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WelcomePage; 