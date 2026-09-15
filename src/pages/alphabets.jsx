import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import modulesData from '../modulesData.json';

export default function Alphabets() {
  const [handMode, setHandMode] = useState('double'); // 'double' | 'single'

  const doubleHandedList = useMemo(() => {
    if (Array.isArray(modulesData['Alphabets double handed'])) {
      return modulesData['Alphabets double handed'];
    }
    return Array.from({ length: 26 }, (_, i) => {
      const letter = String.fromCharCode(65 + i);
      return { label: letter, file: `DictionarySigns/alphabets_double_handed/${letter.toLowerCase()}` };
    });
  }, []);

  const singleHandedList = useMemo(() => {
    if (Array.isArray(modulesData['Alphabets single handed'])) {
      return modulesData['Alphabets single handed'];
    }
    return Array.from({ length: 26 }, (_, i) => {
      const letter = String.fromCharCode(65 + i);
      return { label: letter, file: `DictionarySigns/alphabets_single_handed/${letter.toLowerCase()}` };
    });
  }, []);

  const alphabetList = handMode === 'double' ? doubleHandedList : singleHandedList;
  const [activeItem, setActiveItem] = useState(alphabetList[0]);
  const iframeRef = useRef(null);

  const playSigml = useCallback((itemOrFile) => {
    if (!itemOrFile) return;
    let filePath = typeof itemOrFile === 'object' ? itemOrFile.file : itemOrFile;
    let sigmlPath = '';
    if (filePath.endsWith('.sigml')) {
      sigmlPath = filePath;
    } else if (filePath.includes('DictionarySigns') || filePath.includes('SignFiles')) {
      sigmlPath = `${filePath}.sigml`;
    } else {
      sigmlPath = `DictionarySigns/alphabets_double_handed/${filePath.toLowerCase()}.sigml`;
    }

    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        if (typeof iframeRef.current.contentWindow.startPlayer === 'function') {
          iframeRef.current.contentWindow.startPlayer(sigmlPath);
        }
      } catch (err) {
        console.warn("Direct startPlayer call failed, trying postMessage:", err);
      }
      try {
        iframeRef.current.contentWindow.postMessage({ type: 'PLAY_SIGML', file: sigmlPath }, '*');
      } catch (e) {}
    }
  }, []);

  const handleAction = (item) => {
    setActiveItem(item);
    playSigml(item);
  };

  const handleModeChange = (newMode) => {
    setHandMode(newMode);
    const list = newMode === 'double' ? doubleHandedList : singleHandedList;
    const currentLetter = activeItem ? activeItem.label : 'A';
    const nextItem = list.find(x => x.label.toUpperCase() === currentLetter.toUpperCase()) || list[0];
    setActiveItem(nextItem);
    playSigml(nextItem);
  };

  // Auto-play initial letter A when the component mounts after avatar loads
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeItem) {
        playSigml(activeItem);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [playSigml, activeItem]);

  // Keyboard Event Handler for Enter and Space
  const handleKeyDown = (e, item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); 
      handleAction(item);
    }
  };

  const playAnimation = () => {
    if (activeItem) {
      playSigml(activeItem);
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
          <h2 style={{ color: '#003366', marginTop: 0, marginBottom: '6px', fontSize: '24px', textAlign: 'left' }}>Learn Sign Alphabets (A-Z)</h2>
          <p style={{ color: '#666', fontSize: '13.5px', marginBottom: '14px', textAlign: 'left' }}>Click or use Tab & Enter on any alphabet to view its sign language animation.</p>
          
          {/* Hand Mode Toggle */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
            <button
              type="button"
              onClick={() => handleModeChange('double')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '700',
                border: handMode === 'double' ? '2px solid #003366' : '1px solid #cbd5e1',
                backgroundColor: handMode === 'double' ? '#003366' : '#ffffff',
                color: handMode === 'double' ? '#ffffff' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🤲 Double Handed (ISL)
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('single')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '700',
                border: handMode === 'single' ? '2px solid #003366' : '1px solid #cbd5e1',
                backgroundColor: handMode === 'single' ? '#003366' : '#ffffff',
                color: handMode === 'single' ? '#ffffff' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              ✋ Single Handed
            </button>
          </div>

          {/* Responsive Alphabet Grid */}
          <div className="signverse-alpha-grid">
            {alphabetList.map((item) => {
              const isSelected = activeItem && activeItem.label.toUpperCase() === item.label.toUpperCase();
              return (
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
                    border: isSelected ? 'none' : '1px solid #ccc',
                    backgroundColor: isSelected ? '#689f38' : '#f8f9fa',
                    color: isSelected ? 'white' : '#333',
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
              );
            })}
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
            Play Animation ({activeItem ? activeItem.label : 'A'})
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
              if (activeItem) {
                playSigml(activeItem);
              }
            }}
          />
        </div>
      </div>

    </div>
  );
}