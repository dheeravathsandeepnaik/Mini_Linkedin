import React from 'react';
import { useNavigate } from 'react-router-dom';

const Entry = () => {
  const navigate = useNavigate();
  return (
    // <div style={{ textAlign: 'center', padding: '3rem' }}>
      <div className="entry-container">
      <div className="entry-card">
      <h2>Welcome to Mini LinkedIn</h2>
      <p>Please choose an option:</p>
      <button style={{ margin:'10px'}} onClick={() => navigate('/login')}>Login</button>
      <button style={{ margin:'10px'}} onClick={() => navigate('/register')}>Register</button>
    </div>
    </div>
   
  );
};

export default Entry;