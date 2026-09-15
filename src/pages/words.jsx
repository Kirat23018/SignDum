import React, { useState, useRef, useMemo } from 'react';
import modulesData from '../modulesData.json';

export default function Words() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);
  const iframeRef = useRef(null);

  const allWords = useMemo(() => {
    let list = [];
    for (const category in modulesData) {
      if (Array.isArray(modulesData[category])) {
        modulesData[category].forEach(item => {
          if (item.type !== 'video') list.push(item);
        });
      }
    }
    return list;
  }, []);

  const basicLabels = [
    'Family', 'Mother', 'Father', 'Brother', 'Sister', 'Daughter', 'Son', 'Grandmother',
    'Friend', 'Hello', 'Welcome', 'Please', 'No', 'Thank you', 'How', 'Good morning',
    'Good afternoon', 'Good friday', 'Help', 'Bad', 'Happy', 'Boss'
  ];

  const basicWords = useMemo(() => {
    return basicLabels.map(label => {
      const foundItem = allWords.find(w => (w.label || '').toLowerCase() === label.toLowerCase());
      return foundItem || { label, file: `SignFiles/${label.toLowerCase()}` };
    });
  }, [allWords]);

  const displayedWords = searchTerm.trim() === '' 
    ? basicWords 
    : allWords.filter(item => (item.label || '').toLowerCase().includes(searchTerm.toLowerCase()));

  const handleWordAction = (item) => {
    setSelectedWord(item);
    
    let sigmlFilePath = '';
    if (item.file.includes('DictionarySigns') || item.file.includes('SignFiles')) {
        sigmlFilePath = `${item.file}.sigml`;
    } else {
        sigmlFilePath = `SignFiles/${item.file}.sigml`;
    }

    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow.startPlayer(sigmlFilePath);
      } catch (err) {
        console.log("Player error:", err);
      }
    }
  };

  // NAYA: ARROW KEY LOGIC YAHAN HAI
  const handleKeyDown = (e, item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleWordAction(item);
    } 
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      // Focus agle element par shift karo
      e.currentTarget.nextElementSibling?.focus();
    } 
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      // Focus pichle element par shift karo
      e.currentTarget.previousElementSibling?.focus();
    }
  };

  return (
    <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 45px)', overflow: 'hidden', fontFamily: 'sans-serif', width: '100%' }}>
      
      {/* Left Panel */}
      <div style={{ width: '45%', padding: '30px', backgroundColor: '#ffffff', overflowY: 'auto', borderRight: '2px solid #ecf0f1', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: '#003366', marginTop: 0, marginBottom: '10px', fontSize: '26px' }}>Sign Dictionary & Words</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Learn basic words instantly or search our full database.</p>
        
        <input 
          type="text"
          placeholder="Search from 12,000+ words..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '20px', boxSizing: 'border-box', fontSize: '15px' }}
        />

        <h4 style={{ color: '#333', marginBottom: '10px', fontSize: '14px' }}>
          {searchTerm.trim() === '' ? 'Basic Examples (Use ↑ ↓ arrows & Enter):' : 'Search Results:'}
        </h4>

        {/* List of Words */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '5px' }}>
          {displayedWords.length > 0 ? (
            displayedWords.map((item, index) => {
              const isSelected = selectedWord === item;
              return (
                <div
                  key={index}
                  tabIndex={0} 
                  role="button"
                  onClick={() => handleWordAction(item)}
                  onKeyDown={(e) => handleKeyDown(e, item)} // Arrow Key Handler Attached Here
                  style={{
                    padding: '12px 15px', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    fontSize: '15px', 
                    fontWeight: '500',
                    textAlign: 'left',
                    backgroundColor: isSelected ? '#689f38' : '#f8f9fa',
                    color: isSelected ? 'white' : '#333',
                    border: '1px solid #e0e0e0',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #003366'}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                >
                  {item.label}
                </div>
              );
            })
          ) : (
            <p style={{ color: '#888', textAlign: 'center', marginTop: '30px' }}>No words found.</p>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: '55%', display: 'flex', flexDirection: 'column', backgroundColor: '#e5e7eb' }}>
        <div style={{ flex: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <iframe 
            ref={iframeRef} 
            src="/player-applet.html" 
            title="CWASA Avatar Player"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </div>
      </div>

    </div>
  );
}