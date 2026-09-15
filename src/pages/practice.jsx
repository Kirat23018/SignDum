import React, { useState, useRef, useMemo, useEffect } from 'react';
import modulesData from '../modulesData.json';
import { updateStreak } from '../utils/streakManager';

export default function Practice() {
  const iframeRef = useRef(null);

  // App States: 'setup' -> 'playing' -> 'gameover' -> 'history'
  const [practiceState, setPracticeState] = useState('setup');
  const [selectedTotal, setSelectedTotal] = useState(10);

  const [currentWord, setCurrentWord] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  
  // Local session tracking
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [history, setHistory] = useState([]);

  // 1. Flatten the JSON data
  const allWords = useMemo(() => {
    let list = [];
    for (const category in modulesData) {
      if (Array.isArray(modulesData[category])) {
        modulesData[category].forEach(item => {
          if (item.type !== 'video' && item.label) {
            list.push(item);
          }
        });
      }
    }
    return list;
  }, []);

  // Load History
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('practiceHistory')) || [];
    setHistory(savedHistory);
  }, []);

  const getRandomWord = (list) => list[Math.floor(Math.random() * list.length)];

  // 2. Start Practice Session
  const startPractice = (totalCards) => {
    setSelectedTotal(totalCards);
    setSessionCorrect(0);
    setSessionTotal(0);
    setPracticeState('playing');
    
    setTimeout(() => {
      generatePractice();
    }, 500);
  };

  // 3. Generate a new practice word
  const generatePractice = () => {
    setIsRevealed(false);
    const word = getRandomWord(allWords);
    setCurrentWord(word);
    playAnimation(word);
  };

  // 4. Play Avatar Animation
  const playAnimation = (wordItem) => {
    if (!wordItem || !iframeRef.current) return;
    let sigmlFilePath = '';
    if (wordItem.file.includes('DictionarySigns') || wordItem.file.includes('SignFiles')) {
      sigmlFilePath = `${wordItem.file}.sigml`;
    } else {
      sigmlFilePath = `SignFiles/${wordItem.file}.sigml`;
    }
    try {
      iframeRef.current.contentWindow.startPlayer(sigmlFilePath);
    } catch (err) {
      console.log("Player error:", err);
    }
  };

  // 5. Handle Reveal
  const handleReveal = () => {
    setIsRevealed(true);
  };

  // 6. Handle Honesty System & End Point Logic
  const handleSelfEvaluation = (isCorrect) => {
    const newCorrect = isCorrect ? sessionCorrect + 1 : sessionCorrect;
    const newTotal = sessionTotal + 1;

    if (isCorrect) setSessionCorrect(newCorrect);
    setSessionTotal(newTotal);

    // END POINT CHECK
    if (newTotal >= selectedTotal) {
      handleGameOver(newCorrect, newTotal);
    } else {
      generatePractice(); // Go to next flashcard
    }
  };

  // 7. Game Over Logic
  const handleGameOver = (finalCorrect, finalTotal) => {
    setPracticeState('gameover');
    
    const newRecord = {
      id: Date.now(),
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score: finalCorrect,
      total: finalTotal
    };
    
    const updatedHistory = [newRecord, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('practiceHistory', JSON.stringify(updatedHistory));
    updateStreak();
  };

  const clearHistory = () => {
    if(window.confirm("Clear all practice history?")) {
      setHistory([]);
      localStorage.removeItem('practiceHistory');
    }
  };

  return (
    <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 45px)', overflow: 'hidden', fontFamily: 'sans-serif', width: '100%' }}>
      
      {/* Left Panel: Practice Interface */}
      <div style={{ width: '45%', padding: '30px', backgroundColor: '#ffffff', overflowY: 'auto', borderRight: '2px solid #ecf0f1', display: 'flex', flexDirection: 'column' }}>
        
        {/* --- SETUP SCREEN --- */}
        {practiceState === 'setup' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ color: '#003366', fontSize: '32px', marginBottom: '10px' }}>Flashcard Practice</h1>
            <p style={{ color: '#666', fontSize: '16px', marginBottom: '30px' }}>
              Practice at your own pace! No timers. Guess the sign, reveal the answer, and self-evaluate. Choose how many words you want to practice:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
              {[10, 20, 30, 40, 50].map(num => (
                <button
                  key={num}
                  onClick={() => startPractice(num)}
                  style={{
                    padding: '20px', backgroundColor: '#f8f9fa', border: '2px solid #2ecc71', 
                    borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', color: '#27ae60',
                    cursor: 'pointer', transition: 'all 0.2s ease', outline: 'none',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                  }}
                  onMouseOver={(e) => { e.target.style.backgroundColor = '#e8f5e9'; e.target.style.transform = 'translateY(-2px)'}}
                  onMouseOut={(e) => { e.target.style.backgroundColor = '#f8f9fa'; e.target.style.transform = 'translateY(0)'}}
                >
                  {num} Flashcards
                </button>
              ))}
            </div>

            {history.length > 0 && (
               <button 
                onClick={() => setPracticeState('history')}
                style={{
                  width: '100%', padding: '14px', backgroundColor: 'transparent', border: '2px solid #003366',
                  color: '#003366', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f0f4f8'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
               >
                 📜 View Practice History
               </button>
            )}
          </div>
        )}

        {/* --- HISTORY SCREEN --- */}
        {practiceState === 'history' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ color: '#003366', margin: '0 0 20px 0', fontSize: '26px' }}>Self-Evaluation History</h2>
            
            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ccc', borderRadius: '8px', padding: '10px', backgroundColor: '#fafafa', marginBottom: '20px' }}>
              {history.map((record) => (
                <div key={record.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee', fontSize: '15px' }}>
                  <span style={{ color: '#555' }}>{record.date}</span>
                  <span style={{ fontWeight: 'bold', color: (record.score / record.total) >= 0.7 ? '#2e7d32' : '#f39c12' }}>
                    Knew {record.score} out of {record.total}
                  </span>
                </div>
              ))}
            </div>

            <button 
              onClick={clearHistory}
              style={{ padding: '10px', backgroundColor: '#fdedec', color: '#c0392b', border: '1px solid #f5b7b1', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '15px' }}
            >
              🗑️ Clear History
            </button>

            <button 
              onClick={() => setPracticeState('setup')}
              style={{ width: '100%', padding: '15px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              🔙 Back to Menu
            </button>
          </div>
        )}

        {/* --- PLAYING SCREEN --- */}
        {practiceState === 'playing' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h2 style={{ color: '#003366', margin: 0, fontSize: '22px' }}>Practice Session</h2>
              <div style={{ backgroundColor: '#f0f4f8', padding: '8px 15px', borderRadius: '8px', border: '1px solid #d9e2ec' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#34495e' }}>
                  Card: {sessionTotal + 1} / {selectedTotal}
                </span>
              </div>
            </div>
            
            <p style={{ color: '#666', fontSize: '15px', marginBottom: '30px' }}>
              Guess the sign in your mind. Then reveal the answer and let us know if you got it right!
            </p>

            <button 
              onClick={() => playAnimation(currentWord)}
              style={{ 
                width: '100%', padding: '12px', backgroundColor: '#f39c12', color: 'white', 
                border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', 
                cursor: 'pointer', marginBottom: '30px', outline: 'none'
              }}
            >
              🔄 Replay Animation
            </button>

            <div style={{ 
              flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', 
              alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: '12px', 
              border: '2px dashed #bdc3c7', padding: '30px', textAlign: 'center' 
            }}>
              
              {!isRevealed ? (
                <>
                  <h3 style={{ color: '#7f8c8d', margin: '0 0 20px 0', fontSize: '18px' }}>
                    What is the meaning of this sign?
                  </h3>
                  <button 
                    onClick={handleReveal}
                    autoFocus
                    style={{
                      padding: '16px 40px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '30px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', outline: 'none'
                    }}
                  >
                    👁️ Show Answer
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <div style={{ 
                    backgroundColor: '#e3f2fd', width: '100%', padding: '20px', borderRadius: '8px', border: '2px solid #3498db', marginBottom: '25px' 
                  }}>
                    <h1 style={{ color: '#003366', margin: 0, fontSize: '36px', letterSpacing: '1px' }}>
                      {currentWord?.label}
                    </h1>
                  </div>

                  <h4 style={{ color: '#333', marginBottom: '15px', fontSize: '16px' }}>Did you guess it right?</h4>
                  
                  <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
                    <button 
                      onClick={() => handleSelfEvaluation(true)}
                      autoFocus
                      style={{
                        flex: 1, padding: '15px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', outline: 'none'
                      }}
                    >
                      ✅ Yes, I knew it!
                    </button>
                    <button 
                      onClick={() => handleSelfEvaluation(false)}
                      style={{
                        flex: 1, padding: '15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', outline: 'none'
                      }}
                    >
                      ❌ No, missed it.
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* --- GAME OVER SCREEN --- */}
        {practiceState === 'gameover' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ textAlign: 'center', padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '10px', border: '1px solid #e0e0e0', marginBottom: '20px' }}>
              <h1 style={{ fontSize: '50px', margin: '0 0 10px 0' }}>{sessionCorrect / selectedTotal >= 0.7 ? '🌟' : '📚'}</h1>
              <h2 style={{ color: '#003366', margin: '0 0 10px 0' }}>Practice Complete!</h2>
              <p style={{ fontSize: '18px', color: '#555', margin: 0 }}>
                You honestly knew <b style={{ color: '#27ae60', fontSize: '24px' }}>{sessionCorrect}</b> out of {selectedTotal} signs.
              </p>
            </div>

            <button 
              onClick={() => setPracticeState('setup')}
              style={{ width: '100%', padding: '15px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '25px' }}
            >
              🔄 Practice Again
            </button>

            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Your Honesty Log</h3>
            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ccc', borderRadius: '8px', padding: '10px', backgroundColor: '#fafafa' }}>
              {history.slice(0, 5).map((record) => ( // Showing only last 5 in summary
                <div key={record.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee', fontSize: '15px' }}>
                  <span style={{ color: '#555' }}>{record.date}</span>
                  <span style={{ fontWeight: 'bold', color: '#27ae60' }}>
                    {record.score} / {record.total} Correct
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Panel: 3D Avatar Viewer with Anti-Cheating Mask */}
      <div style={{ width: '55%', display: 'flex', flexDirection: 'column', backgroundColor: '#e5e7eb', position: 'relative', overflow: 'hidden' }}>
        <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
          <iframe 
            ref={iframeRef} 
            src="/player-applet.html" 
            title="CWASA Avatar Player"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', 
            backgroundColor: '#B5BCC7', zIndex: 10, display: 'flex', 
            alignItems: 'center', justifyContent: 'center', borderTop: '1px solid #999'
          }}>
             <span style={{color: '#666', fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px'}}>GUESS FIRST! 🤔</span>
          </div>
        </div>
      </div>

    </div>
  );
}