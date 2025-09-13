import React, { useEffect } from 'react';

const RazorpayPayment = ({ amount, orderId, customerName, customerEmail, customerPhone, onSuccess, onFailure }) => {
  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    // Check if Razorpay key is configured
    const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE';
    
    if (razorpayKey === 'rzp_test_YOUR_KEY_HERE') {
      onFailure('Payment gateway not configured. Please contact support.');
      return;
    }

    const options = {
      key: razorpayKey,
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      name: 'Harvestly',
      description: `Order #${orderId}`,
      order_id: orderId,
      handler: function (response) {
        // Payment successful - call success handler
        onSuccess(response);
      },
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone
      },
      theme: {
        color: '#2C5F2D'
      },
      modal: {
        ondismiss: function() {
          onFailure('Payment cancelled by user');
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      onFailure('Failed to initialize payment gateway: ' + error.message);
    }
  };

  return (
    <button 
      className="btn btn-primary btn-lg w-100"
      onClick={handlePayment}
    >
      <i className="bi bi-credit-card me-2"></i>
      Pay ₹{amount} with Razorpay
    </button>
  );
};

export default RazorpayPayment; 