import React, { useState } from 'react';
import { registerUser } from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Prepare registration data - only include location if provided
      const registrationData = { name, email, password, bio };
      if (location.trim()) {
        registrationData.location = location.trim();
      }
      
      const res = await registerUser(registrationData);
      // Use auth context to handle login
      login(res.data.user, res.data.token);
      console.log('Registration successful:', res.data);
      navigate('/home');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Join Mini LinkedIn</h2>
        <p className="text-gray mb-4">Create your professional profile today</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              id="name"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter your full name" 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email" 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Create a password (min 6 characters)" 
              type="password" 
              minLength="6"
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio (Optional)</label>
            <input 
              id="bio"
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              placeholder="Tell us about yourself" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location (Optional)</label>
            <input 
              id="location"
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="e.g., San Francisco, CA or London, UK" 
              maxLength="100"
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner" style={{width: '16px', height: '16px', marginRight: '8px'}}></div>
                Creating account...
              </>
            ) : 'Create Account'}
          </button>
        </form>
        <div className="auth-link">
          <p>Already have an account? <a href="/login">Sign in here</a></p>
        </div>
      </div>
    </div>
  );
}
