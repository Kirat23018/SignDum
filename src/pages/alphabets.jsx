import React, { useState, useRef } from 'react';

export default function Alphabets() {
  const alphabetList = Array.from({ length: 26 }, (_, i) => {
    const letter = String.fromCharCode(65 + i); // 'A' to 'Z'
    return { label: letter, file: letter.toUpperCase() }; 
  });

  const [activeItem, setActiveItem] = useState(alphabetList[0]);
  const iframeRef = useRef(null);

  const handleAction = (item) => {
    setActiveItem(item);
    if (iframeRef.current) {
      const sigmlFilePath = `SignFiles/${item.file}.sigml`;
      try {
        iframeRef.current.contentWindow.startPlayer(sigmlFilePath);
      } catch (err) {
        console.log("Player not ready", err);
      }
    }
  };

  // Keyboard Event Handler for Enter and Space
  const handleKeyDown = (e, item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); 
      handleAction(item);
    }
  };

  const playAnimation = () => {
    if (activeItem && iframeRef.current) {
      const sigmlFilePath = `SignFiles/${activeItem.file}.sigml`;
      try {
        iframeRef.current.contentWindow.startPlayer(sigmlFilePath);
      } catch (err) {
        console.log("Player not ready", err);
      }
    }
  };

  return (
    <div className="signverse-split-container">
      
      {/* Left Panel: Grid of Alphabets */}
      <div className="signverse-panel-left" style={{ justifyContent: 'space-between' }}>
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
      <div className="signverse-panel-right">
        <div className="signverse-avatar-frame">
          <iframe 
            ref={iframeRef} 
            src="/player-applet.html" 
            title="CWASA Avatar Player"
            className="signverse-avatar-iframe"
            onLoad={() => {
              if (activeItem && iframeRef.current) {
                try {
                  iframeRef.current.contentWindow.startPlayer(`SignFiles/${activeItem.file}.sigml`);
                } catch (err) {
                  console.log("Player not ready yet", err);
                }
              }
            }}
          />
        </div>
      </div>

    </div>
  );
}