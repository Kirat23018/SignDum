import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 45px)', fontFamily: 'system-ui, -apple-system, sans-serif', boxSizing: 'border-box', overflowY: 'auto' }}>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: 'white', padding: '45px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        
        {/* Header Badge */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ backgroundColor: '#e0f2fe', color: '#004080', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '800', display: 'inline-block' }}>
            🌍 Our Mission & Vision
          </span>
          <h1 style={{ color: '#0f172a', fontSize: '36px', fontWeight: '800', margin: '14px 0 10px 0', letterSpacing: '-0.5px' }}>
            About SignVerse 3D Platform
          </h1>
          <p style={{ color: '#64748b', fontSize: '16.5px', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            Empowering inclusivity and breaking communication barriers through next-generation 3D sign language avatar technology and real-time camera gesture recognition.
          </p>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '30px 0' }} />

        {/* TEAM / CREATORS SECTION WITH 3 MEMBERS & BALANCED ROLES */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#0f172a', fontSize: '24px', fontWeight: '800', textAlign: 'center', marginBottom: '25px' }}>
            ✨ Meet the Creators & Engineering Team
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            
            {/* 1. Hardeep Singh Card */}
            <div style={{ backgroundColor: '#f8fafc', padding: '28px 24px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '84px', height: '84px', borderRadius: '50%', backgroundColor: '#004080', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px', margin: '0 auto 15px auto', border: '3px solid #f59e0b', overflow: 'hidden', boxShadow: '0 4px 12px rgba(245,158,11,0.25)' }}>
                👨‍💻
              </div>
              <h3 style={{ color: '#0f172a', fontSize: '20px', fontWeight: '800', margin: '0 0 4px 0' }}>Hardeep Singh</h3>
              <p style={{ color: '#d97706', fontSize: '13px', fontWeight: '800', margin: '0 0 12px 0' }}>Lead Full-Stack & 3D Avatar Architect</p>
              <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6', margin: 0, flex: 1 }}>
                Architects core React application infrastructure, 3D CWASA avatar rendering, WebGL synthesis, SiGML gesture pipelines, and cross-platform performance.
              </p>
            </div>

            {/* 2. Dilpreet Singh Card */}
            <div style={{ backgroundColor: '#f8fafc', padding: '28px 24px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '84px', height: '84px', borderRadius: '50%', backgroundColor: '#004080', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px', margin: '0 auto 15px auto', border: '3px solid #10b981', overflow: 'hidden', boxShadow: '0 4px 12px rgba(16,185,129,0.25)' }}>
                ⚡
              </div>
              <h3 style={{ color: '#0f172a', fontSize: '20px', fontWeight: '800', margin: '0 0 4px 0' }}>Dilpreet Singh</h3>
              <p style={{ color: '#059669', fontSize: '13px', fontWeight: '800', margin: '0 0 12px 0' }}>AI, Computer Vision & Gesture Recognition Lead</p>
              <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6', margin: 0, flex: 1 }}>
                Leads the real-time webcam Sign-to-Text camera recognition pipeline, gesture classification models, natural language synonym processing, and Groq/Gemini AI integrations.
              </p>
            </div>

            {/* 3. Prabhkirat Kaur Card */}
            <div style={{ backgroundColor: '#f8fafc', padding: '28px 24px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '84px', height: '84px', borderRadius: '50%', backgroundColor: '#004080', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px', margin: '0 auto 15px auto', border: '3px solid #6366f1', overflow: 'hidden', boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }}>
                👩‍💻
              </div>
              <h3 style={{ color: '#0f172a', fontSize: '20px', fontWeight: '800', margin: '0 0 4px 0' }}>Prabhkirat Kaur</h3>
              <p style={{ color: '#4f46e5', fontSize: '13px', fontWeight: '800', margin: '0 0 12px 0' }}>UI/UX Design Lead & Educational Curriculum Developer</p>
              <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6', margin: 0, flex: 1 }}>
                Designs accessible user experiences, responsive layouts, interactive flashcards, gamified timed quizzes, and structured sign language learning curricula.
              </p>
            </div>

          </div>
        </div>

        {/* Section: Why We Built This */}
        <div style={{ backgroundColor: '#e0f2fe', padding: '28px 32px', borderRadius: '16px', marginBottom: '32px', borderLeft: '5px solid #004080' }}>
          <h2 style={{ color: '#004080', fontSize: '20px', fontWeight: '800', margin: '0 0 8px 0' }}>💡 The Vision Behind SignVerse</h2>
          <p style={{ color: '#1e293b', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
            Built for Hackathon 2026, SignVerse bridges the communication gap for deaf and hard-of-hearing communities. By combining rule-based text translation, real-time webcam gesture recognition, and responsive 3D WebGL avatars, we make sign language universally accessible, engaging, and cost-effective.
          </p>
        </div>

        {/* Action Button */}
        <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '14px' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: '#004080', color: 'white', border: 'none', padding: '13px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,64,128,0.25)' }}>
              Explore Dashboard ➔
            </button>
          </Link>
          <Link to="/pricing" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: '#ffffff', color: '#004080', border: '2px solid #004080', padding: '13px 24px', borderRadius: '10px', fontSize: '15px', fontWeight: '800', cursor: 'pointer' }}>
              View Plans & Trial 💎
            </button>
          </Link>
        </div>

      </div>

    </div>
  );
}