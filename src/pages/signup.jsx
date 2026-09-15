import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { resetFreeTrial } from '../utils/subscriptionManager';

export default function Signup({ setIsAuthenticated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    // Initialize 3-Day Free Trial & Save User
    resetFreeTrial();
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);

    if (setIsAuthenticated) {
      setIsAuthenticated(true);
    }

    // Redirect to dashboard
    navigate('/dashboard');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 65px)', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', width: '100%', maxWidth: '420px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
        
        {/* Trial Badge */}
        <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', display: 'inline-block', marginBottom: '12px' }}>
          🎁 3-Day Free Trial + 50 AI Credits
        </span>

        <h1 style={{ color: '#0f172a', fontSize: '28px', fontWeight: '800', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>Create Your Account</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Join SignVerse and start learning with 3D avatars today</p>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} onSubmit={handleSignup}>
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '15px', outline: 'none', boxSizing: 'border-box', color: '#0f172a', backgroundColor: '#ffffff' }} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '15px', outline: 'none', boxSizing: 'border-box', color: '#0f172a', backgroundColor: '#ffffff' }} 
            required 
          />
          <input 
            type="password" 
            placeholder="Create Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '15px', outline: 'none', boxSizing: 'border-box', color: '#0f172a', backgroundColor: '#ffffff' }} 
            required 
          />

          <button 
            type="submit" 
            style={{ 
              backgroundColor: '#004080', color: 'white', border: 'none', padding: '14px', 
              borderRadius: '10px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', 
              marginTop: '8px', boxShadow: '0 4px 14px rgba(0,64,128,0.25)' 
            }}
          >
            Start 3-Day Free Trial ➔
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '13.5px', color: '#64748b' }}>
          Already have an account? <Link to="/login" style={{ color: '#004080', fontWeight: '700', textDecoration: 'none' }}>Login</Link>
        </div>
      </div>
    </div>
  );
}