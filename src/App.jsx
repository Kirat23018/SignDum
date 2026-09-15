import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';

import Home from './pages/home';
import Alphabets from './pages/alphabets';
import Words from './pages/words';
import Translate from './pages/translate';
import SignToText from './pages/SignToText';
import Practice from './pages/practice';
import Quiz from './pages/quiz';
import Dashboard from './pages/dashboard';
import Pricing from './pages/pricing';
import About from './pages/about';
import Login from './pages/login';
import Signup from './pages/signup';
import AIChatBot from './components/AIChatBot';
import { getSubscriptionStatus } from './utils/subscriptionManager';

// Navbar Component with Credits & 3-Day Trial Badge
function NavigationBar({ isAuthenticated, handleLogout }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [subStatus, setSubStatus] = useState(getSubscriptionStatus());

  useEffect(() => {
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
    <nav style={{ backgroundColor: '#004080', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', flexWrap: 'wrap', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>
          SignVerse 🤟
        </Link>

        {/* 3-Day Trial & Credits Badge */}
        <Link to="/pricing" style={{ textDecoration: 'none' }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', padding: '4px 10px',
            borderRadius: '16px', fontSize: '11.5px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px',
            border: '1px solid rgba(255,255,255,0.2)', transition: 'background 0.2s'
          }}>
            <span>🪙 {subStatus.credits}</span>
            <span style={{ opacity: 0.7 }}>•</span>
            <span>{subStatus.isPaidPlan ? 'Pro ✨' : `Trial: ${subStatus.trialDaysRemaining}d`}</span>
          </div>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/" style={linkStyle('/')}>Home</Link>
        <Link to="/about" style={linkStyle('/about')}>About Us</Link>
        <Link to="/pricing" style={linkStyle('/pricing')}>Pricing 💎</Link>
        
        {/* Protected Links (Logged in users only) */}
        {isAuthenticated && (
          <>
            <Link to="/alphabets" style={linkStyle('/alphabets')}>Alphabets</Link>
            <Link to="/words" style={linkStyle('/words')}>Words</Link>
            <Link to="/translate" style={linkStyle('/translate')}>3D Translate</Link>
            <Link to="/sign-to-text" style={linkStyle('/sign-to-text')}>🤟 Sign to Text</Link>
            <Link to="/practice" style={linkStyle('/practice')}>Practice</Link>
            <Link to="/quiz" style={linkStyle('/quiz')}>Quiz</Link>
            <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {isAuthenticated ? (
          <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13.5px' }}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.6)', padding: '7px 14px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13.5px' }}>Login</button>
            </Link>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <button style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13.5px' }}>Sign Up</button>
            </Link>
          </>
        )}
      </div>
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
        
        <div style={{ flex: 1 }}>
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
            <Route path="/sign-to-text" element={<ProtectedRoute isAuthenticated={isAuthenticated}><SignToText /></ProtectedRoute>} />
            <Route path="/practice" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Practice /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Quiz /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Dashboard /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        {/* Global AI Assistant Floating Bot */}
        <AIChatBot />
      </div>
    </Router>
  );
}
