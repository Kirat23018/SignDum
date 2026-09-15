import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function Alphabets() {
  const alphabetList = Array.from({ length: 26 }, (_, i) => {
    const letter = String.fromCharCode(65 + i); // 'A' to 'Z'
    return { label: letter, file: letter.toUpperCase() }; 
  });

  const [activeItem, setActiveItem] = useState(alphabetList[0]);
  const iframeRef = useRef(null);

  const playSigml = useCallback((fileOrLetter) => {
    const file = typeof fileOrLetter === 'object' ? fileOrLetter.file : fileOrLetter;
    const sigmlPath = `SignFiles/${file}.sigml`;

    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        if (typeof iframeRef.current.contentWindow.startPlayer === 'function') {
          iframeRef.current.contentWindow.startPlayer(sigmlPath);
        }
      } catch (err) {
        console.warn("Direct startPlayer call failed, falling back to postMessage:", err);
      }
      try {
        iframeRef.current.contentWindow.postMessage({ type: 'PLAY_SIGML', file: sigmlPath }, '*');
      } catch (err) {
        console.warn("postMessage dispatch failed:", err);
      }
    }
  }, []);

  const handleAction = (item) => {
    setActiveItem(item);
    playSigml(item.file);
  };

  // Auto-play initial letter A when the component mounts after avatar loads
  useEffect(() => {
    const timer = setTimeout(() => {
      playSigml('A');
    }, 1200);
    return () => clearTimeout(timer);
  }, [playSigml]);

  // Keyboard Event Handler for Enter and Space
  const handleKeyDown = (e, item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); 
      handleAction(item);
    }
  };

  const playAnimation = () => {
    if (activeItem) {
      playSigml(activeItem.file);
    }
  };

  return (
    <div 
      className="signverse-split-container"
      style={{
        display: 'flex',
        flex: 1,
        width: '100%',
        height: 'calc(100vh - 56px)',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#f8fafc',
        position: 'relative'
      }}
    >
      
      {/* Left Panel: Grid of Alphabets */}
      <div 
        className="signverse-panel-left" 
        style={{ 
          width: '45%',
          height: '100%',
          padding: '26px 30px',
          backgroundColor: '#ffffff',
          overflowY: 'auto',
          overflowX: 'hidden',
          borderRight: '2px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between' 
        }}
      >
        <div>
          <h2 style={{ color: '#003366', marginTop: 0, marginBottom: '8px', fontSize: '24px', textAlign: 'left' }}>Learn Sign Alphabets (A-Z)</h2>
          <p style={{ color: '#666', fontSize: '13.5px', marginBottom: '20px', textAlign: 'left' }}>Click or use Tab & Enter on any alphabet to view its sign language animation.</p>
          
          {/* Responsive Alphabet Grid */}
          <div className="signverse-alpha-grid">
            {alphabetList.map((item) => (
              <div
                key={item.label}
                tabIndex={0}
                role="button"
                onClick={() => handleAction(item)}
                onKeyDown={(e) => handleKeyDown(e, item)}
                style={{
                  padding: '14px 0', 
                  fontSize: '17px', 
                  fontWeight: 'bold', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  border: activeItem.file === item.file ? 'none' : '1px solid #ccc',
                  backgroundColor: activeItem.file === item.file ? '#689f38' : '#f8f9fa',
                  color: activeItem.file === item.file ? 'white' : '#333',
                  textAlign: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px #003366'}
                onBlur={(e) => e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ paddingTop: '10px' }}>
          <button 
            tabIndex={0}
            onClick={playAnimation}
            style={{
              width: '100%', padding: '13px', backgroundColor: '#689f38', color: 'white', border: 'none', 
              borderRadius: '6px', fontSize: '15.5px', fontWeight: 'bold', cursor: 'pointer', outline: 'none',
              transition: '0.2s'
            }}
            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px #003366'}
            onBlur={(e) => e.target.style.boxShadow = 'none'}
          >
            Play Animation ({activeItem ? activeItem.label : ''})
          </button>
        </div>
      </div>

      {/* Right Panel: Avatar Viewer */}
      <div 
        className="signverse-panel-right"
        style={{
          width: '55%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#e5e7eb',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div 
          className="signverse-avatar-frame"
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <iframe 
            ref={iframeRef} 
            src="/player-applet.html" 
            title="CWASA Avatar Player"
            className="signverse-avatar-iframe"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block'
            }}
            onLoad={() => {
              playSigml(activeItem ? activeItem.file : 'A');
            }}
          />
        </div>
      </div>

    </div>
  );
}