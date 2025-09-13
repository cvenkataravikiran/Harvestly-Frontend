import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Button from '../components/ui/Button';

const CartPage = () => {
  const { items, updateQuantity, removeItem, getTotal } = useCart();

  const total = getTotal();
  const deliveryFee = 50;
  const finalTotal = total + deliveryFee;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="display-5 fw-bold text-dark mb-4">Shopping Cart</h1>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="row">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-body">
                {items.map(item => (
                  <div key={item.id} className="d-flex align-items-center py-3 border-bottom">
                    <div className="flex-shrink-0 me-3">
                      <div className="bg-light rounded p-3">
                        <img 
                          src={item.image || '/images/placeholder.jpg'} 
                          alt={item.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          className="rounded"
                        />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{item.name}</h6>
                      <p className="text-muted mb-0">₹{item.price}/{item.unit || 'unit'}</p>
                      <small className="text-muted">From: {item.farmName}</small>
                    </div>
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="mx-3">{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="ms-3 text-end">
                      <h6 className="mb-0">₹{item.price * item.quantity}</h6>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title mb-4">Order Summary</h5>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>₹{total}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery:</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <strong>Total:</strong>
                  <strong>₹{finalTotal}</strong>
                </div>

                <Link to="/checkout">
                  <Button className="w-100 py-3">
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link to="/products" className="btn btn-outline-primary w-100 mt-3">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-cart-x text-muted" style={{ fontSize: '4rem' }}></i>
          </div>
          <h3 className="text-muted mb-3">Your cart is empty</h3>
          <p className="text-muted mb-4">Add some fresh products to your cart!</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            <i className="bi bi-shop me-2"></i>
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage; 