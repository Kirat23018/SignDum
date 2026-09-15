import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updateStreak } from '../utils/streakManager';
import { getSubscriptionStatus } from '../utils/subscriptionManager';

export default function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Update login status, daily streak, and trial status
    setIsAuthenticated(true);
    localStorage.setItem('isLoggedIn', 'true');
    getSubscriptionStatus();
    updateStreak();
    navigate('/dashboard'); // Login hote hi dashboard par le jao
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 65px)', backgroundColor: '#f4f7f6', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ color: '#003366', fontSize: '28px', margin: '0 0 10px 0' }}>Welcome Back!</h1>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '30px' }}>Login to access your 3D Sign Language Hub</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="email" placeholder="Email Address" required style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Password" required style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
          <button type="submit" style={{ backgroundColor: '#004080', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>Login</button>
        </form>

        <div style={{ marginTop: '25px', fontSize: '14px', color: '#555' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#d9534f', fontWeight: 'bold', textDecoration: 'none' }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
}