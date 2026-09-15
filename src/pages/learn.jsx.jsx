import React, { useState, useRef, useEffect } from 'react';

export default function Learn() {
  // A se Z tak ke alphabets ki list jiska file path exact "A", "B", "C"... hai
  const alphabetList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => ({
    label: l,
    file: l // Yeh 'A', 'B', 'C' banega jo "SignFiles/A.sigml" load karega
  }));

  // ================= STATES =================
  const [activeItem, setActiveItem] = useState(alphabetList[0]); 
  const [focusedIndex, setFocusedIndex] = useState(0); 
  const [viewMode, setViewMode] = useState('3d');
  const iframeRef = useRef(null);

  // ================= FUNCTIONS =================
  const handleItemClick = (item, index) => {
    setActiveItem(item);
    setFocusedIndex(index); 
    
    if (viewMode === '3d' && iframeRef.current) {
      const sigmlFilePath = `SignFiles/${item.file}.sigml`; 
      try {
        iframeRef.current.contentWindow.startPlayer(sigmlFilePath);
      } catch (err) {
        console.log("Player not ready", err);
      }
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

  // ================= KEYBOARD NAVIGATION (6-COLUMN GRID) =================
  useEffect(() => {
    const handleKeyDown = (e) => {
      const listLength = alphabetList.length;
      const columns = 6; // 6 columns grid

      if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
        e.preventDefault(); 
      }

      if (e.key === 'Enter') {
        const itemToPlay = alphabetList[focusedIndex];
        if (itemToPlay) handleItemClick(itemToPlay, focusedIndex);
        return;
      }

      setFocusedIndex((prev) => {
        let nextIndex = prev;

        if (e.key === 'ArrowRight') {
          nextIndex = prev < listLength - 1 ? prev + 1 : prev;
        } 
        else if (e.key === 'ArrowLeft') {
          nextIndex = prev > 0 ? prev - 1 : prev;
        } 
        else if (e.key === 'ArrowDown') {
          nextIndex = prev + columns < listLength ? prev + columns : Math.min(prev + columns, listLength - 1);
        } 
        else if (e.key === 'ArrowUp') {
          nextIndex = prev - columns >= 0 ? prev - columns : prev;
        }

        if (nextIndex !== prev) {
          document.getElementById(`alpha-btn-${nextIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return nextIndex;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    
  }, [focusedIndex]); 

  return (
    <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 45px)', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      
      {/* ----- LEFT PANEL (ALPHABETS GRID) ----- */}
      <div style={{ width: '45%', padding: '40px', backgroundColor: '#ffffff', overflowY: 'auto', borderRight: '2px solid #ecf0f1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ color: '#008CBA', marginTop: 0, marginBottom: '10px', fontSize: '28px', textAlign: 'center' }}>Learn Alphabets (A-Z)</h2>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '30px', textAlign: 'center' }}>Click on any letter or use arrow keys to learn sign language alphabets.</p>
          
          {/* 6-Column Grid for A to Z */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(6, 1fr)', 
            gap: '10px',
            marginBottom: '30px'
          }}>
            {alphabetList.map((item, index) => (
              <button
                key={item.label}
                id={`alpha-btn-${index}`} 
                onClick={() => handleItemClick(item, index)}
                style={{
                  padding: '12px 0', fontSize: '18px', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer',
                  border: activeItem.file === item.file ? 'none' : (focusedIndex === index ? '2px solid #008CBA' : '1px solid #ccc'),
                  backgroundColor: activeItem.file === item.file ? '#689f38' : (focusedIndex === index ? '#e6f7ff' : '#f8f9fa'),
                  color: activeItem.file === item.file ? 'white' : '#333',
                  transition: 'all 0.2s ease', 
                  textAlign: 'center'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Play Animation Button */}
        <div>
          <button 
            onClick={playAnimation}
            style={{
              width: '100%', padding: '15px', backgroundColor: '#689f38', color: 'white', border: 'none', 
              borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            Play Animation ({activeItem ? activeItem.label : ''})
          </button>
        </div>
      </div>

      {/* ----- RIGHT PANEL (AVATAR PLAYER) ----- */}
      <div style={{ width: '55%', display: 'flex', flexDirection: 'column', backgroundColor: '#e5e7eb' }}>
        <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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