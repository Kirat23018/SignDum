import React from 'react';

export default function Feedback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 65px)', backgroundColor: '#f4f7f6', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', width: '100%', maxWidth: '500px', textAlign: 'center' }}>
        
        <h1 style={{ color: '#003366', fontSize: '28px', margin: '0 0 10px 0' }}>We Value Your Feedback</h1>
        <p style={{ color: '#666', fontSize: '15px', marginBottom: '30px' }}>
          Help us improve SignVerse! Let us know about your learning experience.
        </p>

        <form onSubmit={(e) => { e.preventDefault(); alert("Feedback Submitted! Thank you."); }} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
          
          <div>
            <label style={{ fontSize: '14px', color: '#333', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Rate your experience</label>
            <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none' }}>
              <option>⭐⭐⭐⭐⭐ - Excellent</option>
              <option>⭐⭐⭐⭐ - Good</option>
              <option>⭐⭐⭐ - Average</option>
              <option>⭐⭐ - Poor</option>
              <option>⭐ - Very Bad</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '14px', color: '#333', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Your Suggestions</label>
            <textarea 
              rows="4" 
              placeholder="What can we do better?" 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none', resize: 'vertical' }}
              required
            ></textarea>
          </div>

          <button type="submit" style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
            Submit Feedback
          </button>
        </form>

      </div>
    </div>
  );
}