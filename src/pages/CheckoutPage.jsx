import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';
import RazorpayPayment from '../components/RazorpayPayment';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, getTotal, clearCart } = useCart();
  const { createOrder } = useProducts();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    landmark: user?.landmark || '',
    paymentMethod: 'razorpay',
  });
  
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  const cartItems = items;
  const subtotal = getTotal();
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    // Phone number validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // ZIP code validation (Indian format)
    const zipRegex = /^[1-9][0-9]{5}$/;
    if (formData.zipCode && !zipRegex.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 6-digit ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSuccess = (response) => {
    setIsProcessing(true);
    
    try {
      // Create order
      const orderData = {
        buyerId: user.id,
        buyerName: formData.fullName,
        buyerEmail: formData.email,
        buyerPhone: formData.phone,
        deliveryAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          landmark: formData.landmark
        },
        items: cartItems,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        paymentMethod: 'razorpay',
        paymentId: response.razorpay_payment_id,
        status: 'Order Confirmed',
        logistics: {
          status: 'Order Confirmed',
          updates: [
            {
              status: 'Order Confirmed',
              timestamp: new Date().toISOString(),
              description: 'Your order has been confirmed and is being processed'
            }
          ]
        }
      };

      const newOrder = createOrder(orderData);
      setOrderId(newOrder.id);
      setOrderPlaced(true);
      clearCart();
      
      // Redirect to order success page after 3 seconds
      setTimeout(() => {
        navigate(`/orders/${newOrder.id}`);
      }, 3000);
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentFailure = (error) => {
    alert(`Payment failed: ${error}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add some products before checkout.');
      navigate('/products');
      return;
    }
  };

  if (orderPlaced) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="card">
              <div className="card-body py-5">
                <div className="text-success mb-4">
                  <i className="bi bi-check-circle" style={{ fontSize: '4rem' }}></i>
                </div>
                <h2 className="text-success mb-3">Order Placed Successfully!</h2>
                <p className="lead mb-4">
                  Your order #{orderId} has been confirmed and payment has been processed.
                </p>
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  You will be redirected to your order details page shortly...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="display-5 fw-bold text-dark mb-4">Checkout</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-truck me-2"></i>
                Delivery Information
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="fullName" className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                    {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter 10-digit phone number"
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Complete Address *</label>
                  <textarea
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    id="address"
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="House/Flat number, Street, Area"
                  ></textarea>
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="city" className="form-label">City *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="state" className="form-label">State *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                    {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="zipCode" className="form-label">ZIP Code *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`}
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      placeholder="6-digit ZIP code"
                    />
                    {errors.zipCode && <div className="invalid-feedback">{errors.zipCode}</div>}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="landmark" className="form-label">Landmark (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="landmark"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    placeholder="Nearby landmark for easy delivery"
                  />
                </div>

                <div className="card-header bg-success text-white mt-4">
                  <h5 className="mb-0">
                    <i className="bi bi-credit-card me-2"></i>
                    Payment Method
                  </h5>
                </div>
                <div className="mt-3">
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Secure Payment:</strong> All payments are processed securely through Razorpay.
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-cart-check me-2"></i>
                Order Summary
              </h5>
            </div>
            <div className="card-body">
              {cartItems.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-cart-x text-muted" style={{ fontSize: '3rem' }}></i>
                  <p className="text-muted mt-2">Your cart is empty</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/products')}
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <>
                  {cartItems.map((item, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h6 className="mb-1">{item.name}</h6>
                        <small className="text-muted">
                          {item.quantity} {item.unit} × ₹{item.price}
                        </small>
                      </div>
                      <span className="fw-bold">₹{item.quantity * item.price}</span>
                    </div>
                  ))}
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Delivery Fee:</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <strong>Total:</strong>
                    <strong className="text-primary">₹{total}</strong>
                  </div>
                  
                  <RazorpayPayment
                    amount={total}
                    orderId={`ORD${Date.now()}`}
                    customerName={formData.fullName}
                    customerEmail={formData.email}
                    customerPhone={formData.phone}
                    onSuccess={handlePaymentSuccess}
                    onFailure={handlePaymentFailure}
                  />
                  
                  <div className="text-center mt-3">
                    <small className="text-muted">
                      <i className="bi bi-shield-check me-1"></i>
                      Secure payment powered by Razorpay
                    </small>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 