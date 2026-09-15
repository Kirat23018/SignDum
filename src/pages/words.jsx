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

  const handleKeyDown = (e, item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleWordAction(item);
    } 
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.currentTarget.nextElementSibling?.focus();
    } 
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.currentTarget.previousElementSibling?.focus();
    }
  };

  return (
    <div className="signverse-split-layout">
      
      {/* Top / Left Panel */}
      <div className="signverse-input-panel">
        <h2 style={{ color: '#003366', marginTop: 0, marginBottom: '6px', fontSize: '22px' }}>
          Sign Dictionary & Words
        </h2>
        <p style={{ color: '#666', fontSize: '13.5px', marginBottom: '14px' }}>
          Learn basic words instantly or search our full database.
        </p>
        
        <input 
          type="text"
          placeholder="Search from 12,000+ words..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', marginBottom: '12px', boxSizing: 'border-box', fontSize: '14px', outline: 'none' }}
        />

        <h4 style={{ color: '#333', marginBottom: '8px', fontSize: '13px', fontWeight: '700' }}>
          {searchTerm.trim() === '' ? 'Basic Examples (Use arrows & Enter):' : 'Search Results:'}
        </h4>

        {/* List of Words */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '4px' }}>
          {displayedWords.length > 0 ? (
            displayedWords.map((item, index) => {
              const isSelected = selectedWord === item;
              return (
                <div
                  key={index}
                  tabIndex={0} 
                  role="button"
                  onClick={() => handleWordAction(item)}
                  onKeyDown={(e) => handleKeyDown(e, item)}
                  style={{
                    padding: '10px 14px', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    fontSize: '14.5px', 
                    fontWeight: '600',
                    textAlign: 'left',
                    backgroundColor: isSelected ? '#689f38' : '#f8f9fa',
                    color: isSelected ? 'white' : '#333',
                    border: '1px solid #e2e8f0',
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
            <p style={{ color: '#888', textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>No words found.</p>
          )}
        </div>
      </div>

      {/* Bottom / Right Panel */}
      <div className="signverse-avatar-panel">
        <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
