import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'buyer',
    adminCode: '', // Add admin code field
    // Buyer fields
    address: '',
    city: '',
    state: '',
    zipCode: '',
    landmark: '',
    // Farmer fields
    farmName: '',
    farmLocation: '',
    farmAddress: '',
    farmCity: '',
    farmState: '',
    farmZipCode: '',
    farmPhone: '',
    // Admin fields - SEPARATE from farmer fields
    adminOrgName: '',
    adminOfficeLocation: '',
    adminOfficeAddress: '',
    adminOfficeCity: '',
    adminOfficeState: '',
    adminOfficeZipCode: '',
    adminOfficePhone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, setShowProfileModal } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // Validate Indian phone number (more flexible to match backend)
    const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid Indian phone number');
      return false;
    }

    // Validate Indian ZIP code
    const zipRegex = /^[1-9][0-9]{5}$/;
    if (formData.role === 'buyer' && !zipRegex.test(formData.zipCode)) {
      setError('Please enter a valid Indian ZIP code');
      return false;
    }
    if (formData.role === 'farmer' && !zipRegex.test(formData.farmZipCode)) {
      setError('Please enter a valid Indian ZIP code for farm');
      return false;
    }

    if (formData.role === 'buyer') {
      if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
        setError('Please fill in all address details');
        return false;
      }
    }

    if (formData.role === 'farmer') {
      if (!formData.farmName || !formData.farmLocation || !formData.farmAddress || 
          !formData.farmCity || !formData.farmState || !formData.farmZipCode || !formData.farmPhone) {
        setError('Please fill in all farm details');
        return false;
      }
    }

    if (formData.role === 'admin') {
      if (!formData.adminCode) {
        setError('Admin code is required for admin registration');
        return false;
      }
      if (!formData.adminOrgName || !formData.adminOfficeLocation || !formData.adminOfficeAddress || 
          !formData.adminOfficeCity || !formData.adminOfficeState || !formData.adminOfficeZipCode || !formData.adminOfficePhone) {
        setError('Please fill in all admin details');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Prepare user data based on role
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role
      };

      // Add role-specific fields
      if (formData.role === 'buyer') {
        userData.address = formData.address;
        userData.city = formData.city;
        userData.state = formData.state;
        userData.zipCode = formData.zipCode;
        userData.landmark = formData.landmark;
      } else if (formData.role === 'farmer') {
        userData.farmName = formData.farmName;
        userData.farmLocation = formData.farmLocation;
        userData.farmAddress = formData.farmAddress;
        userData.farmCity = formData.farmCity;
        userData.farmState = formData.farmState;
        userData.farmZipCode = formData.farmZipCode;
        userData.farmPhone = formData.farmPhone;
      } else if (formData.role === 'admin') {
        userData.adminCode = formData.adminCode;
        userData.adminOrgName = formData.adminOrgName;
        userData.adminOfficeLocation = formData.adminOfficeLocation;
        userData.adminOfficeAddress = formData.adminOfficeAddress;
        userData.adminOfficeCity = formData.adminOfficeCity;
        userData.adminOfficeState = formData.adminOfficeState;
        userData.adminOfficeZipCode = formData.adminOfficeZipCode;
        userData.adminOfficePhone = formData.adminOfficePhone;
      }

      const result = await register(userData);
      
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
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      // Use the improved error message from API interceptor
      const errorMessage = error.userMessage || error.message || 'An error occurred during registration';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary mb-2">Join Harvestly</h2>
                  <p className="text-muted">Create your account to start your farm-to-table journey</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="firstName" className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lastName" className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

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
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">Account Type</label>
                    <select
                      className="form-select"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="buyer">Buyer (Consumer)</option>
                      <option value="farmer">Farmer (Producer)</option>
                      <option value="admin">Admin (System Administrator)</option>
                    </select>
                  </div>

                  {/* Admin Code Field - Only visible when admin is selected */}
                  {formData.role === 'admin' && (
                    <div className="mb-3">
                      <label htmlFor="adminCode" className="form-label">Admin Code</label>
                      <input
                        type="password"
                        className="form-control"
                        id="adminCode"
                        name="adminCode"
                        value={formData.adminCode}
                        onChange={handleChange}
                        required
                        placeholder="Enter admin code"
                      />
                      <small className="text-muted">Admin code is required for admin registration</small>
                    </div>
                  )}

                  <div className="row">
                    <div className="col-md-6 mb-3">
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
                          placeholder="Enter password"
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
                    <div className="col-md-6 mb-3">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                      <div className="input-group">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="form-control"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          placeholder="Confirm password"
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  {formData.role === 'buyer' && (
                    <div className="border rounded p-3 mb-3">
                      <h6 className="mb-3">Delivery Address</h6>
                      <div className="row">
                        <div className="col-12 mb-3">
                          <label htmlFor="address" className="form-label">Address</label>
                          <input
                            type="text"
                            className="form-control"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            placeholder="Enter your address"
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="city" className="form-label">City</label>
                          <input
                            type="text"
                            className="form-control"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            placeholder="Enter city"
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="state" className="form-label">State</label>
                          <input
                            type="text"
                            className="form-control"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                            placeholder="Enter state"
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="zipCode" className="form-label">ZIP Code</label>
                          <input
                            type="text"
                            className="form-control"
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            required
                            placeholder="Enter ZIP code"
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label htmlFor="landmark" className="form-label">Landmark (Optional)</label>
                          <input
                            type="text"
                            className="form-control"
                            id="landmark"
                            name="landmark"
                            value={formData.landmark}
                            onChange={handleChange}
                            placeholder="Enter landmark"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.role === 'farmer' && (
                    <div className="border rounded p-3 mb-3">
                      <h6 className="mb-3">Farm Details</h6>
                      <div className="row">
                        <div className="col-12 mb-3">
                          <label htmlFor="farmName" className="form-label">Farm Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="farmName"
                            name="farmName"
                            value={formData.farmName}
                            onChange={handleChange}
                            required
                            placeholder="Enter farm name"
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label htmlFor="farmLocation" className="form-label">Farm Location</label>
                          <input
                            type="text"
                            className="form-control"
                            id="farmLocation"
                            name="farmLocation"
                            value={formData.farmLocation}
                            onChange={handleChange}
                            required
                            placeholder="Enter farm location"
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label htmlFor="farmAddress" className="form-label">Farm Address</label>
                          <input
                            type="text"
                            className="form-control"
                            id="farmAddress"
                            name="farmAddress"
                            value={formData.farmAddress}
                            onChange={handleChange}
                            required
                            placeholder="Enter farm address"
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="farmCity" className="form-label">Farm City</label>
                          <input
                            type="text"
                            className="form-control"
                            id="farmCity"
                            name="farmCity"
                            value={formData.farmCity}
                            onChange={handleChange}
                            required
                            placeholder="Enter farm city"
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="farmState" className="form-label">Farm State</label>
                          <input
                            type="text"
                            className="form-control"
                            id="farmState"
                            name="farmState"
                            value={formData.farmState}
                            onChange={handleChange}
                            required
                            placeholder="Enter farm state"
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="farmZipCode" className="form-label">Farm ZIP Code</label>
                          <input
                            type="text"
                            className="form-control"
                            id="farmZipCode"
                            name="farmZipCode"
                            value={formData.farmZipCode}
                            onChange={handleChange}
                            required
                            placeholder="Enter farm ZIP code"
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label htmlFor="farmPhone" className="form-label">Farm Phone</label>
                          <input
                            type="tel"
                            className="form-control"
                            id="farmPhone"
                            name="farmPhone"
                            value={formData.farmPhone}
                            onChange={handleChange}
                            required
                            placeholder="Enter farm phone number"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* {formData.role === 'admin' && (
                    <div className="border rounded p-3 mb-3">
                      <h6 className="mb-3">Admin Details</h6>
                      <div className="row">
                        <div className="col-12 mb-3">
                          <label htmlFor="adminOrgName" className="form-label">Organization Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="adminOrgName"
                            name="adminOrgName"
                            value={formData.adminOrgName}
                            onChange={handleChange}
                            required
                            placeholder="Enter organization name"
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label htmlFor="adminOfficeLocation" className="form-label">Office Location</label>
                          <input
                            type="text"
                            className="form-control"
                            id="adminOfficeLocation"
                            name="adminOfficeLocation"
                            value={formData.adminOfficeLocation}
                            onChange={handleChange}
                            required
                            placeholder="Enter office location"
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label htmlFor="adminOfficeAddress" className="form-label">Office Address</label>
                          <input
                            type="text"
                            className="form-control"
                            id="adminOfficeAddress"
                            name="adminOfficeAddress"
                            value={formData.adminOfficeAddress}
                            onChange={handleChange}
                            required
                            placeholder="Enter office address"
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="adminOfficeCity" className="form-label">Office City</label>
                          <input
                            type="text"
                            className="form-control"
                            id="adminOfficeCity"
                            name="adminOfficeCity"
                            value={formData.adminOfficeCity}
                            onChange={handleChange}
                            required
                            placeholder="Enter office city"
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="adminOfficeState" className="form-label">Office State</label>
                          <input
                            type="text"
                            className="form-control"
                            id="adminOfficeState"
                            name="adminOfficeState"
                            value={formData.adminOfficeState}
                            onChange={handleChange}
                            required
                            placeholder="Enter office state"
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label htmlFor="adminOfficeZipCode" className="form-label">Office ZIP Code</label>
                          <input
                            type="text"
                            className="form-control"
                            id="adminOfficeZipCode"
                            name="adminOfficeZipCode"
                            value={formData.adminOfficeZipCode}
                            onChange={handleChange}
                            required
                            placeholder="Enter office ZIP code"
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label htmlFor="adminOfficePhone" className="form-label">Office Phone</label>
                          <input
                            type="text"
                            className="form-control"
                            id="adminOfficePhone"
                            name="adminOfficePhone"
                            value={formData.adminOfficePhone}
                            onChange={handleChange}
                            required
                            placeholder="Enter office phone"
                          />
                        </div>
                      </div>
                    </div>
                  )} */}

                  <div className="d-grid mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/auth/signin" className="text-primary text-decoration-none">
                      Sign in here
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

export default SignUpPage; 