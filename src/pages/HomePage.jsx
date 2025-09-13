import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';
import HeroSection from '../components/ui/HeroSection';
import FeatureCard from '../components/ui/FeatureCard';
import TestimonialCard from '../components/ui/TestimonialCard';
import StatsSection from '../components/ui/StatsSection';
import CTASection from '../components/ui/CTASection';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { approvedProducts } = useProducts();
  const [showWelcome, setShowWelcome] = useState(false);

  // Show welcome message for new users
  useEffect(() => {
    if (isAuthenticated && user?.createdAt) {
      const userCreated = new Date(user.createdAt);
      const now = new Date();
      const diffInHours = (now - userCreated) / (1000 * 60 * 60);
      
      if (diffInHours < 1) { // Show welcome if account was created less than 1 hour ago
        setShowWelcome(true);
        setTimeout(() => setShowWelcome(false), 5000);
      }
    }
  }, [isAuthenticated, user]);

  const features = [
    {
      icon: '🌱',
      title: 'Fresh from Farm',
      description: 'Get the freshest produce directly from local farmers'
    },
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Same-day delivery to your doorstep'
    },
    {
      icon: '💰',
      title: 'Best Prices',
      description: 'Competitive prices with no hidden fees'
    },
    {
      icon: '🌿',
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

  const stats = [
    { number: '500+', label: 'Happy Farmers' },
    { number: '10K+', label: 'Satisfied Customers' },
    { number: '50+', label: 'Cities Served' },
    { number: '24h', label: 'Delivery Time' }
  ];

  return (
    <div>
      {/* Welcome Message for New Users */}
      {showWelcome && (
        <div className="alert alert-success alert-dismissible fade show m-3" role="alert" style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 1000, maxWidth: '400px' }}>
          <i className="bi bi-emoji-smile me-2"></i>
          <strong>Welcome to Harvestly!</strong> Your account has been created successfully. You can now browse products and start shopping!
          <button type="button" className="btn-close" onClick={() => setShowWelcome(false)}></button>
        </div>
      )}
      
      {/* Hero Section */}
      <HeroSection 
        title="Fresh Farm Products Direct to Your Door"
        subtitle="Connect directly with local farmers and get fresh, organic produce delivered to your doorstep. Support local agriculture while enjoying the best quality food."
        primaryButtonText="Browse Products"
        primaryButtonLink="/products"
        secondaryButtonText="Learn More"
        secondaryButtonLink="/welcome"
        stats={stats}
      />

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold text-dark mb-3">Why Choose Harvestly?</h2>
              <p className="lead text-muted">Experience the difference of farm-fresh produce delivered to your doorstep</p>
            </div>
          </div>
          
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {approvedProducts && approvedProducts.length > 0 && (
        <section className="py-5">
          <div className="container">
            <div className="row text-center mb-5">
              <div className="col-12">
                <h2 className="display-5 fw-bold text-dark mb-3">Featured Products</h2>
                <p className="lead text-muted">Discover our handpicked selection of fresh produce</p>
              </div>
            </div>
            
            <div className="row g-4">
              {approvedProducts.slice(0, 4).map((product) => (
                <div key={product._id} className="col-md-6 col-lg-3">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center">
                      <div className="mb-3">
                        <span className="display-4">🥬</span>
                      </div>
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text text-muted">{product.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-primary">₹{product.price}</span>
                        <Link to={`/product/${product._id}`} className="btn btn-outline-primary btn-sm">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-4">
              <Link to="/products" className="btn btn-primary btn-lg">
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold text-dark mb-3">What Our Customers Say</h2>
              <p className="lead text-muted">Real stories from real customers</p>
            </div>
          </div>
          
          <div className="row g-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="col-md-4">
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* CTA Section */}
      <CTASection 
        title="Ready to Experience Fresh Farm Products?"
        subtitle="Join thousands of customers who trust Harvestly for their daily fresh produce needs."
        primaryButtonText="Get Started"
        primaryButtonLink="/auth/signup"
        secondaryButtonText="Learn More"
        secondaryButtonLink="/welcome"
      />
    </div>
  );
};

export default HomePage; 