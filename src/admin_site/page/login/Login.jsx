import React, { useState } from 'react';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { adminLogin, adminSignUp } from '../../../services/Apis';
import  {toast} from 'react-toastify';

const PoliceLogin = () => {
  const navigate=useNavigate();
  // List of police stations in West Bengal
  const westBengalPoliceStations = [
    "Kolkata Police Headquarters",
    "Lalbazar Police Station",
    "Hastings Police Station",
    "Taltala Police Station",
    "Jorasanko Police Station",
    "Burrabazar Police Station",
    "Posta Police Station",
    "Jorabagan Police Station",
    "Shyampukur Police Station",
    "Bartala Police Station",
    "Amherst Street Police Station",
    "Hare Street Police Station",
    "Bowbazar Police Station",
    "Muchipara Police Station",
    "Tollygunge Police Station",
    "Bhowanipore Police Station",
    "Alipore Police Station",
    "Park Street Police Station",
    "South Suburban Police Station",
    "Karaya Police Station",
    "Entally Police Station",
    "Beniapukur Police Station",
    "Narkeldanga Police Station",
    "Ultadanga Police Station",
    "Belgachia Police Station",
    "Shyambazar Police Station",
    "Cossipore Police Station",
    "Chitpur Police Station",
    "Sinthi Police Station",
    "Burtolla Police Station",
    "Joramandir Police Station",
    "Baranagar Police Station",
    "Dum Dum Police Station",
    "Bidhannagar Police Station",
    "Rajabagan Police Station",
    "Howrah Police Station",
    "Siliguri Police Station",
    "Darjeeling Police Station",
    "Asansol Police Station",
    "Durgapur Police Station",
    "Bardhaman Police Station",
    "Malda Police Station",
    "Krishnanagar Police Station",
    "Barasat Police Station",
    "Barrackpore Police Station",
    "Kalyani Police Station",
    "Haldia Police Station",
    "Medinipur Police Station",
    "Purulia Police Station",
    "Bankura Police Station"
  ];

  const [formData, setFormData] = useState({
    email: '',
    policeStation: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // At least one of email or police station must be provided
    if (!formData.email.trim() && !formData.policeStation.trim()) {
      newErrors.email = 'Email or Police Station is required';
      newErrors.policeStation = 'Email or Police Station is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Add your login logic here
      console.log('Login data:', formData);
      // You would typically send this to your backend for authentication
      try {
        const config = {
          "Content-Type": "application/json"
        }
        const res = await adminLogin(formData, config);
        console.log(res);
        toast.success(`${res.data.message}! Redirecting to login...`);
        navigate('/admin/home');
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Login failed. Please try again.");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="police-login-container">
      <div className="police-login-content">
        <h2>Police Officer Login</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="or-divider">
            <span>OR</span>
          </div>

          <div className="form-group">
            <label htmlFor="policeStation">Police Station</label>
            <select
              id="policeStation"
              name="policeStation"
              value={formData.policeStation}
              onChange={handleChange}
              className={errors.policeStation ? 'error' : ''}
            >
              <option value="">Select Police Station</option>
              {westBengalPoliceStations.map((station, index) => (
                <option key={index} value={station}>{station}</option>
              ))}
            </select>
            {errors.policeStation && <span className="error-message">{errors.policeStation}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" name="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          <div className="signup-link">
            Don't have an account? <Link to="/admin/signup">Register here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PoliceLogin;