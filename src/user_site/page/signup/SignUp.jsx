import React, { useState } from 'react';
import './SignUp.css';
import { Link } from 'react-router-dom';
import { userSignUp } from '../../../services/Apis';
import {  toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const SignUp = () => {
  const navigate = useNavigate(); // Hook for navigation

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    avatar: null,
    contact:'',
    age:'',
    password: '',
    confirmPassword: ''
  });

  const [preview, setPreview] = useState(null);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) { // 2MB limit
      setErrors({
        ...errors,
        avatar: 'File size should be less than 2MB'
      });
      return;
    }
    
    setFormData({
      ...formData,
      avatar: file
    });
    setErrors({
      ...errors,
      avatar: null
    });

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    

    if (!formData.contact) {
      newErrors.password = 'Phone number is required';
    } else if (formData.contact.length != 10) {
      newErrors.password = 'Phone number must be 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Add your form submission logic here
      console.log(formData);
      try {
        const config = {
          'Content-Type': 'multipart/form-data'
        }
        const res = await userSignUp(formData, config);
        console.log(res);
        toast.success(`${res.data.message}!Redirecting to login...`);
        navigate('/login');
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
      // Reset form after submission
      setFormData({
        username: '',
        email: '',
        fullName: '',
        avatar: null,
        contact:'',
        age:'',
        password: '',
        confirmPassword: ''
      });
      setPreview(null);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <h2>Sign Up</h2>
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
              required
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">E-Mail Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? 'error' : ''}
              required
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="avatar">Profile Photo</label>
            <div className="file-input-container">
              <label htmlFor="avatar" className="file-label">
                Choose File
              </label>
              <span className="file-name">
                {formData.avatar ? formData.avatar.name : 'No file chosen'}
              </span>
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
            </div>
            {errors.avatar && <span className="error-message">{errors.avatar}</span>}
            {preview && (
              <div className="avatar-preview">
                <img src={preview} alt="Avatar preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="contact">Your Phone number</label>
            <input
              type='tel'
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className={errors.contact ? 'error' : ''}
              required
            />
            {errors.contact && <span className="error-message">{errors.contact}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="age">Enter your Age</label>
            <input
              type='number'
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>


          <div className="form-group">
            <label htmlFor="password">Create Password</label>
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              required
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>
          <div className="login-link">
            Have an account? <Link to="/login">Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;