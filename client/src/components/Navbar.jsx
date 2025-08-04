import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      {user && <Link to={`/profile/${user._id}`}>Profile</Link>}
      {user && <button onClick={handleLogout}>Logout</button>}
      <button onClick={() => document.body.classList.toggle("dark")}>Dark Mode</button>

    </nav>
  );
}