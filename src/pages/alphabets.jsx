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
    <div className="signverse-split-layout">
      
      {/* Top / Left Panel: Alphabet Grid Controls */}
      <div className="signverse-input-panel">
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <h2 style={{ color: '#003366', marginTop: 0, marginBottom: '6px', fontSize: '22px', textAlign: 'left' }}>
            Learn Sign Alphabets (A-Z)
          </h2>
          <p style={{ color: '#666', fontSize: '13.5px', marginBottom: '16px', textAlign: 'left' }}>
            Click or use Tab & Enter on any alphabet to view its sign language animation.
          </p>
          
          {/* Responsive Alphabet Grid (Auto fits columns cleanly) */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(52px, 1fr))', 
            gap: '8px', 
            marginBottom: '16px' 
          }}>
            {alphabetList.map((item) => (
              <div
                key={item.label}
                tabIndex={0}
                role="button"
                onClick={() => handleAction(item)}
                onKeyDown={(e) => handleKeyDown(e, item)}
                style={{
                  padding: '12px 0', 
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
              width: '100%', padding: '12px', backgroundColor: '#689f38', color: 'white', border: 'none', 
              borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', outline: 'none',
              transition: '0.2s'
            }}
            onFocus={(e) => e.target.style.boxShadow = '0 0 0 3px #003366'}
            onBlur={(e) => e.target.style.boxShadow = 'none'}
          >
            Play Animation ({activeItem ? activeItem.label : ''})
          </button>
        </div>
      </div>

      {/* Bottom / Right Panel: 3D Avatar Viewer */}
      <div className="signverse-avatar-panel">
        <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <iframe 
            ref={iframeRef} 
            src="/player-applet.html" 
            title="CWASA Avatar Player"
            style={{ width: '100%', height: '100%', border: 'none' }}
            onLoad={() => {
              if (activeItem && iframeRef.current) {
                try {
                  iframeRef.current.contentWindow.startPlayer(`SignFiles/${activeItem.file}.sigml`);
                } catch (err) {
                  console.log("Player not ready yet");
                }
              }
            }}
          />
        </div>
      </div>

    </div>
  );
}
