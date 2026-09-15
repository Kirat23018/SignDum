import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#ffffff', minHeight: 'calc(100vh - 65px)', display: 'flex', flexDirection: 'column' }}>

      {/* ================= 1. HERO SECTION ================= */}
      <div style={{ textAlign: 'center', padding: '80px 20px 40px 20px' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#eef2ff', color: '#0056b3', padding: '8px 18px', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold', marginBottom: '25px', border: '1px solid #d1d5db' }}>
          ✨ Next-Gen Accessibility Platform
        </div>
        
        <h1 style={{ fontSize: '52px', fontWeight: '900', color: '#111827', maxWidth: '900px', margin: '0 auto 20px auto', lineHeight: '1.2' }}>
          Break Communication Barriers with <br/> 
          <span style={{ color: '#003366' }}>3D Sign Language</span>
        </h1>
        
        <p style={{ fontSize: '20px', color: '#4b5563', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
          An interactive platform to translate text, practice flashcards, and test your skills with intelligent 3D avatars.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: '#003366', color: 'white', border: 'none', padding: '14px 30px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Open Dashboard ➔
            </button>
          </Link>
          <Link to="/translate" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: 'white', color: '#111827', border: '1px solid #d1d5db', padding: '14px 30px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              Try Translator
            </button>
          </Link>
        </div>
      </div>

      {/* ================= 2. AVATARS SECTION (FIXED SIZING, DESIGN & SINGLE LINE) ================= */}
      <div style={{ maxWidth: '1200px', margin: '20px auto 40px auto', padding: '0 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#003366', fontSize: '28px', marginBottom: '30px' }}>Meet Our 3D Instructors</h2>
        
        {/* flexWrap: 'nowrap' ensures they stay in one line */}
        <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'center', gap: '15px', overflowX: 'auto', paddingBottom: '15px' }}>
          
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #eaeaea', width: '160px', flexShrink: 0, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
            <img src="/avatars/luna.png" alt="Luna" style={{ width: '100%', height: '170px', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
            <div style={{ padding: '15px 0' }}>
              <h3 style={{ margin: 0, color: '#111827', fontSize: '18px' }}>Luna</h3>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #eaeaea', width: '160px', flexShrink: 0, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
            <img src="/avatars/marc.png" alt="Marc" style={{ width: '100%', height: '170px', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
            <div style={{ padding: '15px 0' }}>
              <h3 style={{ margin: 0, color: '#111827', fontSize: '18px' }}>Marc</h3>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #eaeaea', width: '160px', flexShrink: 0, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
            <img src="/avatars/francoise.png" alt="Francoise" style={{ width: '100%', height: '170px', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
            <div style={{ padding: '15px 0' }}>
              <h3 style={{ margin: 0, color: '#111827', fontSize: '18px' }}>Francoise</h3>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #eaeaea', width: '160px', flexShrink: 0, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
            <img src="/avatars/anna.png" alt="Anna" style={{ width: '100%', height: '170px', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
            <div style={{ padding: '15px 0' }}>
              <h3 style={{ margin: 0, color: '#111827', fontSize: '18px' }}>Anna</h3>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #eaeaea', width: '160px', flexShrink: 0, overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
            <img src="/avatars/siggi.png" alt="Siggi" style={{ width: '100%', height: '170px', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
            <div style={{ padding: '15px 0' }}>
              <h3 style={{ margin: 0, color: '#111827', fontSize: '18px' }}>Siggi</h3>
            </div>
          </div>

        </div>
      </div>

      {/* ================= 3. FEATURES SECTION ================= */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', padding: '60px 20px', borderTop: '1px solid #eaeaea', backgroundColor: '#fafafa', flex: 1 }}>
        
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #eaeaea', width: '300px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <h3 style={{ color: '#003366', fontSize: '20px', marginBottom: '15px' }}>🗣️ Text to Sign AI</h3>
          <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.5' }}>Convert natural text sentences into smooth 3D avatar signing animations instantly.</p>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #eaeaea', width: '300px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <h3 style={{ color: '#003366', fontSize: '20px', marginBottom: '15px' }}>📚 Endless Practice</h3>
          <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.5' }}>Stress-free flashcards with self-evaluation to strengthen your memory at your own pace.</p>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #eaeaea', width: '300px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <h3 style={{ color: '#003366', fontSize: '20px', marginBottom: '15px' }}>🏆 Ranked Quizzes</h3>
          <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.5' }}>Test your skills against time, track your accuracy percentage, and level up your rank.</p>
        </div>

      </div>

      {/* ================= 4. FOOTER ================= */}
      <div style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid #eaeaea', color: '#888', fontSize: '14px', backgroundColor: '#ffffff' }}>
        Sign Language 3D Learning Platform 
      </div>

    </div>
  );
}