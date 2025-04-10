import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userLogin } from '../../../services/Apis';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate(); // Hook for navigation

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

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

    if (!formData.username.trim() && !formData.email.trim()) {
      newErrors.username = 'Username or email is required';
      newErrors.email = 'Username or email is required';
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
      // Add your form submission logic here
      console.log(formData);
      // Reset form after submission
      try {
        const config = {
          "Content-Type": "application/json"
        }
        const res = await userLogin(formData, config);
        console.log(res);
        toast.success(`${res.data.message}! Redirecting to home page...`);
        navigate('/');
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Login failed. Please try again.");
      }
      setFormData({
        username: '',
        email: '',
        password: ''
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="or-divider">
            <span>OR</span>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              required
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          <div className="forgot-password">
            <Link href="/forgot-password">Forgot Password?</Link>
          </div>

          <div className="signup-link">
            Don't have an account? <Link to="/signup">Register here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;