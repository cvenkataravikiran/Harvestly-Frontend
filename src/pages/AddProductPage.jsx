import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../contexts/ProductContext';

const AddProductPage = () => {
  const { user } = useAuth();
  const { addProduct } = useProducts();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Organic',
    stock: '',
    unit: 'kg',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
    farmLocation: '',
    farmAddress: '',
    farmCity: '',
    farmState: '',
    farmZipCode: '',
    farmPhone: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate form data
      if (!formData.name || !formData.description || !formData.price || !formData.stock) {
        throw new Error('Please fill in all required fields');
      }

      if (parseFloat(formData.price) <= 0) {
        throw new Error('Price must be greater than 0');
      }

      if (parseInt(formData.stock) < 0) {
        throw new Error('Stock cannot be negative');
      }

      // Create product data
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        sellerId: user.id,
        sellerName: `${user.firstName} ${user.lastName}`,
        farmName: user.farmName || 'Your Farm',
        farmLocation: formData.farmLocation || user.farmLocation || '',
        farmAddress: formData.farmAddress || user.farmAddress || '',
        farmCity: formData.farmCity || user.farmCity || '',
        farmState: formData.farmState || user.farmState || '',
        farmZipCode: formData.farmZipCode || user.farmZipCode || '',
        farmPhone: formData.farmPhone || user.phone || ''
      };

      // Add product
      const result = await addProduct(productData);
      
      if (result.success) {
        // Show success message and redirect
        alert('Product added successfully! It will be reviewed by admin before approval.');
        navigate('/products/manage');
      } else {
        throw new Error(result.error || 'Failed to add product');
      }
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll use a placeholder
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">
                <i className="bi bi-plus-circle me-2"></i>
                Add New Product
              </h3>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Product Image */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Product Image</label>
                    <div className="text-center">
                      <img
                        src={formData.image}
                        alt="Product preview"
                        className="img-fluid rounded mb-2"
                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                      />
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <small className="text-muted">
                        Upload a clear image of your product
                      </small>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          <i className="bi bi-tag me-1"></i>
                          Product Name *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g., Fresh Organic Tomatoes"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          <i className="bi bi-currency-rupee me-1"></i>
                          Price per Unit (₹) *
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">₹</span>
                          <input
                            type="number"
                            className="form-control"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                            min="0"
                            step="1"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          <i className="bi bi-box me-1"></i>
                          Stock Quantity *
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                          required
                          min="0"
                          placeholder="0"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          <i className="bi bi-rulers me-1"></i>
                          Unit of Measurement
                        </label>
                        <select
                          className="form-select"
                          name="unit"
                          value={formData.unit}
                          onChange={handleInputChange}
                        >
                          <option value="kg">Kilogram (kg)</option>
                          <option value="piece">Piece</option>
                          <option value="bunch">Bunch</option>
                          <option value="head">Head</option>
                          <option value="dozen">Dozen</option>
                          <option value="lb">Pound (lb)</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        <i className="bi bi-shield-check me-1"></i>
                        Category *
                      </label>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="category"
                              id="organic"
                              value="Organic"
                              checked={formData.category === 'Organic'}
                              onChange={handleInputChange}
                            />
                            <label className="form-check-label" htmlFor="organic">
                              <span className="badge bg-success me-2">Organic</span>
                              Grown without synthetic pesticides or fertilizers
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="category"
                              id="fertilized"
                              value="Fertilized"
                              checked={formData.category === 'Fertilized'}
                              onChange={handleInputChange}
                            />
                            <label className="form-check-label" htmlFor="fertilized">
                              <span className="badge bg-warning me-2">Fertilized</span>
                              Grown with approved fertilizers
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        <i className="bi bi-card-text me-1"></i>
                        Description *
                      </label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows="4"
                        placeholder="Describe your product, including quality, freshness, growing methods, etc."
                      ></textarea>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                {/* Farm Location Section */}
                <div className="mb-4">
                  <h5 className="mb-3">
                    <i className="bi bi-geo-alt me-2"></i>
                    Farm Location Details
                  </h5>
                  <p className="text-muted mb-3">
                    This information will be visible to buyers to show where the product is coming from.
                  </p>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Farm Location/Area</label>
                      <input
                        type="text"
                        className="form-control"
                        name="farmLocation"
                        value={formData.farmLocation}
                        onChange={handleInputChange}
                        placeholder="e.g., Village Road, Near Lake, Rural District"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Farm Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="farmPhone"
                        value={formData.farmPhone}
                        onChange={handleInputChange}
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Complete Farm Address</label>
                    <textarea
                      className="form-control"
                      name="farmAddress"
                      value={formData.farmAddress}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="Complete farm address including farm name, street, area"
                    ></textarea>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="farmCity"
                        value={formData.farmCity}
                        onChange={handleInputChange}
                        placeholder="City"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        className="form-control"
                        name="farmState"
                        value={formData.farmState}
                        onChange={handleInputChange}
                        placeholder="State"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">ZIP Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="farmZipCode"
                        value={formData.farmZipCode}
                        onChange={handleInputChange}
                        placeholder="6-digit ZIP code"
                      />
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/products/manage')}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding Product...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-2"></i>
                        Add Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Information Card */}
          <div className="card mt-4">
            <div className="card-body">
              <h6 className="card-title">
                <i className="bi bi-info-circle me-2"></i>
                Important Information
              </h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  All products are reviewed by admin before approval
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Ensure accurate product descriptions and pricing
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Upload clear, high-quality product images
                </li>
                <li className="mb-0">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Products will be visible to buyers once approved
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage; 