import React, { useState, useRef, useMemo, useEffect } from 'react';
import modulesData from '../modulesData.json';
import { updateStreak } from '../utils/streakManager';

export default function Quiz() {
  const iframeRef = useRef(null);

  // App States: 'setup' -> 'playing' -> 'gameover' -> 'history'
  const [quizState, setQuizState] = useState('setup'); 
  const [selectedTotal, setSelectedTotal] = useState(10); 
  const [timeLeft, setTimeLeft] = useState(60); 

  const [currentWord, setCurrentWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [hasGuessed, setHasGuessed] = useState(false);
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
    const savedHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];
    setHistory(savedHistory);
  }, []);

  // --- STATS CALCULATION LOGIC ---
  const totalCorrectMarks = history.reduce((acc, curr) => acc + curr.score, 0);
  const totalPossibleMarks = history.reduce((acc, curr) => acc + curr.total, 0);
  
  // Calculate average accuracy percentage
  const averageScorePercent = totalPossibleMarks > 0 
    ? ((totalCorrectMarks / totalPossibleMarks) * 100).toFixed(1) 
    : 0;

  // Level / Tag Generator based on Average Percentage
  const getQuizLevel = (percent, totalQuizzes) => {
    if (totalQuizzes === 0) return "Newbie 🥚";
    if (percent >= 90) return "Master 👑";
    if (percent >= 80) return "Pro 🚀";
    if (percent >= 60) return "Explorer 🔍";
    if (percent >= 40) return "Learner 📚";
    return "Beginner 🌱";
  };

  const userLevel = getQuizLevel(averageScorePercent, history.length);

  // Timer Logic
  useEffect(() => {
    let timer;
    if (quizState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && quizState === 'playing') {
      handleGameOver(true); 
    }
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [quizState, timeLeft]);

  // Format Time (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getRandomWord = (list) => list[Math.floor(Math.random() * list.length)];
  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  // 2. Start Quiz
  const startQuiz = (totalQs) => {
    setSelectedTotal(totalQs);
    setTimeLeft(totalQs * 6); 
    setScore(0);
    setAttempts(0);
    setFeedback('');
    setHasGuessed(false);
    setQuizState('playing');
    
    setTimeout(() => {
      generateQuestion();
    }, 500); 
  };

  // 3. Generate Question
  const generateQuestion = () => {
    setFeedback('');
    setHasGuessed(false);

    const correct = getRandomWord(allWords);
    setCurrentWord(correct);

    let wrongOptions = [];
    while (wrongOptions.length < 3) {
      const wrong = getRandomWord(allWords);
      if (wrong.label !== correct.label && !wrongOptions.find(w => w.label === wrong.label)) {
        wrongOptions.push(wrong);
      }
    }

    const allOptions = shuffleArray([correct, ...wrongOptions]);
    setOptions(allOptions);
    playAnimation(correct);
  };

  // 4. Play Animation
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

  // 5. Handle Guess
  const handleGuess = (selectedItem) => {
    if (hasGuessed || quizState !== 'playing') return;

    setHasGuessed(true);
    setAttempts(prev => prev + 1);

    if (selectedItem.label === currentWord.label) {
      setScore(prev => prev + 1);
      setFeedback('🎉 Correct!');
    } else {
      setFeedback(`❌ Incorrect. Answer: "${currentWord.label}".`);
    }
  };

  // 6. Next Button
  const handleNext = () => {
    if (attempts >= selectedTotal) {
      handleGameOver(false);
    } else {
      generateQuestion();
    }
  };

  // 7. Game Over
  const handleGameOver = (isTimeUp = false) => {
    setQuizState('gameover');
    if (isTimeUp) {
      setFeedback("⏰ Time's Up!");
    }
    
    const newRecord = {
      id: Date.now(),
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score: score,
      total: selectedTotal,
      timeOut: isTimeUp
    };
    
    const updatedHistory = [newRecord, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('quizHistory', JSON.stringify(updatedHistory));
    updateStreak();
  };

  const clearHistory = () => {
    if(window.confirm("Clear all quiz history? Your overall level will reset to Newbie.")) {
      setHistory([]);
      localStorage.removeItem('quizHistory');
    }
  };

  return (
    <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 45px)', overflow: 'hidden', fontFamily: 'sans-serif', width: '100%' }}>
      
      {/* Left Panel */}
      <div style={{ width: '45%', padding: '30px', backgroundColor: '#ffffff', overflowY: 'auto', borderRight: '2px solid #ecf0f1', display: 'flex', flexDirection: 'column' }}>
        
        {/* --- SETUP SCREEN --- */}
        {quizState === 'setup' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            
            {/* User Level Banner */}
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              backgroundColor: '#003366', padding: '15px 20px', borderRadius: '12px', 
              marginBottom: '25px', color: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Your Quiz Rank</h3>
                <span style={{ backgroundColor: '#f39c12', padding: '4px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', color: 'white' }}>
                  {userLevel}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '20px', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2ecc71' }}>{averageScorePercent}%</div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>Overall Accuracy</div>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{history.length}</div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>Quizzes Played</div>
                </div>
              </div>
            </div>

            <h1 style={{ color: '#003366', fontSize: '28px', margin: '0 0 10px 0' }}>Sign Language Quiz</h1>
            <p style={{ color: '#666', fontSize: '15px', marginBottom: '30px' }}>
              Test your knowledge and increase your rank! Select the number of questions. You get 1 minute for every 10 questions.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
              {[10, 20, 30, 40, 50].map(num => (
                <button
                  key={num}
                  onClick={() => startQuiz(num)}
                  style={{
                    padding: '20px', backgroundColor: '#f8f9fa', border: '2px solid #3498db', 
                    borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', color: '#003366',
                    cursor: 'pointer', transition: 'all 0.2s ease', outline: 'none',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                  }}
                  onMouseOver={(e) => { e.target.style.backgroundColor = '#e3f2fd'; e.target.style.transform = 'translateY(-2px)'}}
                  onMouseOut={(e) => { e.target.style.backgroundColor = '#f8f9fa'; e.target.style.transform = 'translateY(0)'}}
                >
                  {num} Questions <br/>
                  <span style={{ fontSize: '14px', color: '#e67e22' }}>⏱️ {num / 10} Min</span>
                </button>
              ))}
            </div>

            {history.length > 0 && (
               <button 
                onClick={() => setQuizState('history')}
                style={{
                  width: '100%', padding: '14px', backgroundColor: 'transparent', border: '2px solid #003366',
                  color: '#003366', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f0f4f8'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
               >
                 📜 View Full History
               </button>
            )}
          </div>
        )}

        {/* --- HISTORY SCREEN (Pre-game) --- */}
        {quizState === 'history' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ color: '#003366', margin: '0 0 20px 0', fontSize: '26px' }}>Your Past Scores</h2>
            
            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ccc', borderRadius: '8px', padding: '10px', backgroundColor: '#fafafa', marginBottom: '20px' }}>
              {history.map((record) => (
                <div key={record.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee', fontSize: '15px' }}>
                  <span style={{ color: '#555' }}>
                    {record.date} {record.timeOut && <span style={{color: '#c0392b', fontSize: '12px'}}> (Time Out)</span>}
                  </span>
                  <span style={{ fontWeight: 'bold', color: (record.score / record.total) >= 0.7 ? '#2e7d32' : '#c0392b' }}>
                    {record.score}/{record.total}
                  </span>
                </div>
              ))}
            </div>

            <button 
              onClick={clearHistory}
              style={{ padding: '10px', backgroundColor: '#fdedec', color: '#c0392b', border: '1px solid #f5b7b1', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '15px' }}
            >
              🗑️ Clear All History
            </button>

            <button 
              onClick={() => setQuizState('setup')}
              style={{ width: '100%', padding: '15px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              🔙 Back to Menu
            </button>
          </div>
        )}

        {/* --- PLAYING SCREEN --- */}
        {quizState === 'playing' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#e3f2fd', padding: '8px 15px', borderRadius: '8px', border: '1px solid #90caf9' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1565c0' }}>Score: {score} / {selectedTotal}</span>
              </div>
              <div style={{ backgroundColor: timeLeft <= 10 ? '#fdedec' : '#fff3cd', padding: '8px 15px', borderRadius: '8px', border: `1px solid ${timeLeft <= 10 ? '#f5b7b1' : '#f5c6cb'}` }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: timeLeft <= 10 ? '#c0392b' : '#d35400' }}>
                  ⏳ {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#666', fontSize: '15px' }}>
              <span>Watch the Avatar & guess!</span>
              <span style={{ fontWeight: 'bold' }}>Question {attempts + (hasGuessed ? 0 : 1)} of {selectedTotal}</span>
            </div>

            <button 
              onClick={() => playAnimation(currentWord)}
              style={{ width: '100%', padding: '12px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '30px' }}
            >
              🔄 Replay Animation
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              {options.map((item, index) => {
                let bgColor = '#f8f9fa'; let textColor = '#333'; let borderColor = '#e0e0e0';
                if (hasGuessed) {
                  if (item.label === currentWord.label) {
                    bgColor = '#689f38'; textColor = 'white'; borderColor = '#558b2f';
                  } else {
                    bgColor = '#eaeded'; textColor = '#999';
                  }
                }
                return (
                  <div
                    key={index} role="button" tabIndex={hasGuessed ? -1 : 0}
                    onClick={() => handleGuess(item)}
                    style={{
                      padding: '15px', borderRadius: '8px', cursor: hasGuessed ? 'default' : 'pointer', 
                      fontSize: '16px', fontWeight: 'bold', textAlign: 'center', backgroundColor: bgColor, 
                      color: textColor, border: `2px solid ${borderColor}`, transition: 'all 0.2s ease', outline: 'none'
                    }}
                  >
                    {item.label}
                  </div>
                );
              })}
            </div>

            {feedback && (
              <div style={{ padding: '15px', borderRadius: '8px', textAlign: 'center', backgroundColor: feedback.includes('Correct') ? '#e8f5e9' : '#fdedec', border: `1px solid ${feedback.includes('Correct') ? '#a5d6a7' : '#f5b7b1'}`, marginBottom: '20px' }}>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: feedback.includes('Correct') ? '#2e7d32' : '#c0392b' }}>{feedback}</p>
              </div>
            )}

            {hasGuessed && (
              <button 
                onClick={handleNext} autoFocus 
                style={{ width: '100%', padding: '16px', backgroundColor: attempts >= selectedTotal ? '#2980b9' : '#689f38', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {attempts >= selectedTotal ? 'See Final Score 🏆' : 'Next Question ➔'}
              </button>
            )}
          </>
        )}

        {/* --- GAME OVER SCREEN --- */}
        {quizState === 'gameover' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px', border: '1px solid #e0e0e0', marginBottom: '20px' }}>
              <h1 style={{ fontSize: '40px', margin: '0 0 10px 0' }}>
                {feedback === "⏰ Time's Up!" ? '⏳' : (score / selectedTotal >= 0.7 ? '🏆' : '👍')}
              </h1>
              <h2 style={{ color: '#003366', margin: '0 0 10px 0' }}>
                {feedback === "⏰ Time's Up!" ? "Time's Up!" : 'Quiz Completed!'}
              </h2>
              <p style={{ fontSize: '18px', color: '#555', margin: 0 }}>
                You scored <b style={{ color: '#689f38', fontSize: '22px' }}>{score}</b> out of {selectedTotal}.
              </p>
            </div>

            <button 
              onClick={() => setQuizState('setup')}
              style={{ width: '100%', padding: '15px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '25px' }}
            >
              🏠 Back to Quiz Menu
            </button>

            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Your Recent Scores</h3>
            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ccc', borderRadius: '8px', padding: '10px', backgroundColor: '#fafafa' }}>
              {history.map((record) => (
                <div key={record.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee', fontSize: '15px' }}>
                  <span style={{ color: '#555' }}>
                    {record.date} {record.timeOut && <span style={{color: '#c0392b', fontSize: '12px'}}>(Time Out)</span>}
                  </span>
                  <span style={{ fontWeight: 'bold', color: (record.score / record.total) >= 0.7 ? '#2e7d32' : '#c0392b' }}>
                    {record.score}/{record.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Panel: Avatar with Mask */}
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
             <span style={{color: '#666', fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px'}}>NO CHEATING! 👀</span>
          </div>
        </div>
      </div>

    </div>
  );
}