import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import './App.css';

import Home from './pages/home';
import Alphabets from './pages/alphabets';
import Words from './pages/words';
import Translate from './pages/translate';
import Practice from './pages/practice';
import Quiz from './pages/quiz';
import Dashboard from './pages/dashboard';
import Pricing from './pages/pricing';
import About from './pages/about';
import Login from './pages/login';
import Signup from './pages/signup';
import AIChatBot from './components/AIChatBot';
import { getSubscriptionStatus } from './utils/subscriptionManager';

// Responsive NavigationBar Component with Hamburger Menu and Credits Badge
function NavigationBar({ isAuthenticated, handleLogout }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [subStatus, setSubStatus] = useState(getSubscriptionStatus());

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setSubStatus(getSubscriptionStatus());
  }, [location.pathname]);

  const linkStyle = (path) => ({
    color: 'white',
    textDecoration: 'none',
    fontSize: '14.5px',
    fontWeight: isActive(path) ? 'bold' : '500',
    borderBottom: isActive(path) ? '2px solid #38bdf8' : 'none',
    paddingBottom: '2px',
    transition: 'all 0.2s ease-in-out'
  });

  return (
    <nav className="signverse-navbar">
      {/* Brand & Credits Pill */}
      <div className="navbar-brand-section">
        <Link to="/" className="navbar-brand-logo">
          SignVerse 🤟
        </Link>

        {/* 3-Day Trial & Credits Badge */}
        <Link to="/pricing" style={{ textDecoration: 'none' }}>
          <div className="navbar-badge-pill">
            <span>🪙 {subStatus.credits}</span>
            <span style={{ opacity: 0.7 }}>•</span>
            <span>{subStatus.isPaidPlan ? 'Pro ✨' : `Trial: ${subStatus.trialDaysRemaining}d`}</span>
          </div>
        </Link>
      </div>

      {/* Desktop Links (Hidden on Mobile) */}
      <div className="navbar-links-desktop">
        <Link to="/" style={linkStyle('/')}>Home</Link>
        <Link to="/about" style={linkStyle('/about')}>About Us</Link>
        <Link to="/pricing" style={linkStyle('/pricing')}>Pricing 💎</Link>
        
        {/* Protected Links (Logged in users only) */}
        {isAuthenticated && (
          <>
            <Link to="/alphabets" style={linkStyle('/alphabets')}>Alphabets</Link>
            <Link to="/words" style={linkStyle('/words')}>Words</Link>
            <Link to="/translate" style={linkStyle('/translate')}>3D Translate</Link>
            <Link to="/practice" style={linkStyle('/practice')}>Practice</Link>
            <Link to="/quiz" style={linkStyle('/quiz')}>Quiz</Link>
            <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
          </>
        )}
      </div>

      {/* Desktop Auth Buttons (Hidden on Mobile) */}
      <div className="navbar-auth-desktop">
        {isAuthenticated ? (
          <button 
            onClick={handleLogout} 
            style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13.5px' }}
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.6)', padding: '7px 14px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13.5px' }}>
                Login
              </button>
            </Link>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <button style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13.5px' }}>
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Hamburger Toggle Button (Visible only on <= 880px) */}
      <button 
        className="navbar-hamburger-btn"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Dropdown Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="navbar-mobile-drawer">
          <Link to="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <span>🏠 Home</span>
            {isActive('/') && <span>✓</span>}
          </Link>
          <Link to="/about" className={`mobile-nav-link ${isActive('/about') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <span>ℹ️ About Us</span>
            {isActive('/about') && <span>✓</span>}
          </Link>
          <Link to="/pricing" className={`mobile-nav-link ${isActive('/pricing') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
            <span>💎 Pricing & Plans</span>
            {isActive('/pricing') && <span>✓</span>}
          </Link>

          {isAuthenticated ? (
            <>
              <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.15)', margin: '4px 0' }} />
              <Link to="/alphabets" className={`mobile-nav-link ${isActive('/alphabets') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <span>🔤 Alphabets (A-Z)</span>
                {isActive('/alphabets') && <span>✓</span>}
              </Link>
              <Link to="/words" className={`mobile-nav-link ${isActive('/words') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <span>📖 Words & Dictionary</span>
                {isActive('/words') && <span>✓</span>}
              </Link>
              <Link to="/translate" className={`mobile-nav-link ${isActive('/translate') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <span>🤖 3D Translate</span>
                {isActive('/translate') && <span>✓</span>}
              </Link>
              <Link to="/practice" className={`mobile-nav-link ${isActive('/practice') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <span>🃏 Practice Cards</span>
                {isActive('/practice') && <span>✓</span>}
              </Link>
              <Link to="/quiz" className={`mobile-nav-link ${isActive('/quiz') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <span>⚡ Timed Quiz</span>
                {isActive('/quiz') && <span>✓</span>}
              </Link>
              <Link to="/dashboard" className={`mobile-nav-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
                <span>📊 Dashboard</span>
                {isActive('/dashboard') && <span>✓</span>}
              </Link>

              <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.15)', margin: '4px 0' }} />
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }} 
                style={{ 
                  backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '12px', 
                  borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '15px', 
                  width: '100%', marginTop: '6px', textAlign: 'center' 
                }}
              >
                Logout 🚪
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <Link to="/login" style={{ flex: 1, textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                <button style={{ width: '100%', backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.6)', padding: '10px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
                  Login
                </button>
              </Link>
              <Link to="/signup" style={{ flex: 1, textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                <button style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

// Protected Route Component
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <NavigationBar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
            
            {/* Protected Routes */}
            <Route path="/alphabets" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Alphabets /></ProtectedRoute>} />
            <Route path="/words" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Words /></ProtectedRoute>} />
            <Route path="/translate" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Translate /></ProtectedRoute>} />
            <Route path="/practice" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Practice /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Quiz /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Dashboard /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        {/* Global AI Assistant Floating Circular Bot */}
        <AIChatBot />
      </div>
    </Router>
  );
}
