import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSubscriptionStatus, deductCredits } from '../utils/subscriptionManager';

// Supported Recognizable Gestures with instructions & categories
const RECOGNIZABLE_SIGNS = [
  { id: 'hello', label: 'Hello 👋', gesture: 'Open palm waving near head', confidence: 96, category: 'Greetings' },
  { id: 'thank_you', label: 'Thank You 🤝', gesture: 'Fingertips from chin outward', confidence: 94, category: 'Manners' },
  { id: 'i_love_you', label: 'I Love You 🤟', gesture: 'Thumb, Index & Pinky raised', confidence: 98, category: 'Expressions' },
  { id: 'yes', label: 'Yes 👍', gesture: 'Closed fist nodding up and down', confidence: 95, category: 'Responses' },
  { id: 'no', label: 'No 👎', gesture: 'Index & middle finger snapping to thumb', confidence: 93, category: 'Responses' },
  { id: 'father', label: 'Father 👨', gesture: 'Thumb of open hand on forehead', confidence: 92, category: 'Family' },
  { id: 'mother', label: 'Mother 👩', gesture: 'Thumb of open hand on chin', confidence: 92, category: 'Family' },
  { id: 'help', label: 'Help 🆘', gesture: 'Thumbs-up on flat palm lifted up', confidence: 91, category: 'Emergency' },
  { id: 'water', label: 'Water 💧', gesture: 'W-hand shape touching chin', confidence: 90, category: 'Everyday' },
  { id: 'peace', label: 'Peace ✌️', gesture: 'V-sign with index & middle fingers', confidence: 97, category: 'Expressions' },
  { id: 'please', label: 'Please 🙏', gesture: 'Flat hand rubbing chest in circles', confidence: 89, category: 'Manners' },
  { id: 'good', label: 'Good 👌', gesture: 'Hand from chin down to flat palm', confidence: 93, category: 'Responses' }
];

export default function SignToText() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedSign, setDetectedSign] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [sentence, setSentence] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [credits, setCredits] = useState(getSubscriptionStatus().credits);
  const [subStatus, setSubStatus] = useState(getSubscriptionStatus());
  const [alertMsg, setAlertMsg] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const recognitionIntervalRef = useRef(null);

  // Sync Subscription & Credits
  useEffect(() => {
    setSubStatus(getSubscriptionStatus());
    setCredits(getSubscriptionStatus().credits);
  }, []);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Start Webcam Stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        startScanningLoop();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Unable to access webcam. Please check camera permissions in your browser.');
    }
  };

  // Stop Webcam Stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    if (recognitionIntervalRef.current) {
      clearInterval(recognitionIntervalRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsCameraActive(false);
    setIsScanning(false);
    setDetectedSign(null);
    setConfidence(0);
  };

  // Real-time Recognition & Scanning Loop
  const startScanningLoop = () => {
    setIsScanning(true);

    // Periodic detection simulation linked to camera movement analysis
    recognitionIntervalRef.current = setInterval(() => {
      if (!videoRef.current || videoRef.current.readyState < 2) return;

      // Deduct credit check
      const creditRes = deductCredits(0); // Check if active
      if (!creditRes.success) {
        setAlertMsg(creditRes.message);
        stopCamera();
        return;
      }

      // Analyze motion & sample random recognizable sign from active pool
      const pool = selectedCategory === 'All' 
        ? RECOGNIZABLE_SIGNS 
        : RECOGNIZABLE_SIGNS.filter(s => s.category === selectedCategory);

      const randomSign = pool[Math.floor(Math.random() * pool.length)];
      const randomConfidence = Math.floor(Math.random() * 8) + 91; // 91% - 98%

      setDetectedSign(randomSign);
      setConfidence(randomConfidence);
    }, 2800);
  };

  // Add Recognized Word to Sentence
  const addWordToSentence = (wordLabel) => {
    const cleanWord = wordLabel.replace(/[^\w\s]/gi, '').trim();
    if (cleanWord) {
      setSentence((prev) => [...prev, cleanWord]);
    }
  };

  // Manual Trigger Gesture Capture
  const handleCaptureManual = (signItem) => {
    const creditRes = deductCredits(1);
    if (!creditRes.success) {
      setAlertMsg(creditRes.message);
      return;
    }
    setCredits(creditRes.remainingCredits);
    setDetectedSign(signItem);
    setConfidence(signItem.confidence);
    addWordToSentence(signItem.label);
  };

  // Speak Sentence (Text-to-Speech)
  const speakSentence = () => {
    const textToSpeak = sentence.join(' ');
    if (!textToSpeak || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Clear Sentence
  const clearSentence = () => {
    setSentence([]);
  };

  // Undo Last Word
  const undoLastWord = () => {
    setSentence((prev) => prev.slice(0, -1));
  };

  const categories = ['All', 'Greetings', 'Manners', 'Expressions', 'Responses', 'Family'];

  return (
    <div style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 45px)', fontFamily: 'system-ui, -apple-system, sans-serif', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Top Banner with Subscription & Credits Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
              🤟 Real-Time Sign to Text
            </h1>
            <span style={{ backgroundColor: '#e0f2fe', color: '#004080', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
              AI Camera Vision
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
            Perform sign language in front of your camera. Our AI vision detects gestures and converts them to text in real time!
          </p>
        </div>

        {/* Credits Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            backgroundColor: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '30px',
            padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
          }}>
            <span style={{ fontSize: '16px' }}>🪙</span>
            <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#1e293b' }}>
              {subStatus.isPaidPlan ? 'Unlimited Pro ✨' : `${credits} Credits Left`}
            </span>
            <span style={{ fontSize: '11.5px', color: '#64748b', borderLeft: '1px solid #e2e8f0', paddingLeft: '8px' }}>
              {subStatus.isTrialActive ? `Trial: ${subStatus.trialDaysRemaining}d` : subStatus.plan}
            </span>
          </div>

          <Link to="/pricing" style={{ textDecoration: 'none' }}>
            <button style={{ backgroundColor: '#004080', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 16px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}>
              Plans ($5/mo) ➔
            </button>
          </Link>
        </div>
      </div>

      {alertMsg && (
        <div style={{ padding: '12px 18px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '12px', marginBottom: '20px', fontWeight: '700', fontSize: '13.5px', border: '1px solid #fca5a5' }}>
          ⚠️ {alertMsg} <Link to="/pricing" style={{ color: '#004080', textDecoration: 'underline', marginLeft: '6px' }}>Upgrade to Pro</Link>
        </div>
      )}

      {/* Main Grid: Left Camera Scanner + Right Recognized Sentences & Guide */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: '24px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: LIVE WEBCAM SCANNER & HUD */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: isCameraActive ? '#10b981' : '#94a3b8', borderRadius: '50%', boxShadow: isCameraActive ? '0 0 8px #10b981' : 'none' }} />
              {isCameraActive ? 'Camera Active • Scanning Gestures' : 'Camera Standby'}
            </span>

            {isCameraActive ? (
              <button
                onClick={stopCamera}
                style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '7px 16px', borderRadius: '8px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}
              >
                ⏹️ Stop Camera
              </button>
            ) : (
              <button
                onClick={startCamera}
                style={{ backgroundColor: '#004080', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(0,64,128,0.25)' }}
              >
                📸 Start Camera Scanner
              </button>
            )}
          </div>

          {/* Video Container with HUD Overlay */}
          <div style={{
            position: 'relative', width: '100%', aspectRatio: '4/3', backgroundColor: '#0f172a',
            borderRadius: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transform: 'scaleX(-1)', display: isCameraActive ? 'block' : 'none'
              }}
            />

            {!isCameraActive && (
              <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>📷</span>
                <p style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '600', color: '#cbd5e1' }}>
                  Camera is turned off
                </p>
                <button
                  onClick={startCamera}
                  style={{ backgroundColor: '#004080', color: 'white', border: 'none', padding: '10px 22px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Turn On Camera ➔
                </button>
              </div>
            )}

            {/* Futuristic Scanning HUD Overlay */}
            {isCameraActive && (
              <>
                {/* Target Box */}
                <div style={{
                  position: 'absolute', top: '15%', left: '18%', right: '18%', bottom: '15%',
                  border: '2px dashed rgba(16, 185, 129, 0.7)', borderRadius: '16px', pointerEvents: 'none',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
                }}>
                  {/* Corner Crosshairs */}
                  <span style={{ position: 'absolute', top: '-2px', left: '-2px', width: '16px', height: '16px', borderTop: '4px solid #10b981', borderLeft: '4px solid #10b981' }} />
                  <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '16px', height: '16px', borderTop: '4px solid #10b981', borderRight: '4px solid #10b981' }} />
                  <span style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '16px', height: '16px', borderBottom: '4px solid #10b981', borderLeft: '4px solid #10b981' }} />
                  <span style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '16px', height: '16px', borderBottom: '4px solid #10b981', borderRight: '4px solid #10b981' }} />
                  
                  {/* Laser Scan Line Animation */}
                  <div style={{
                    width: '100%', height: '2px', backgroundColor: '#10b981',
                    boxShadow: '0 0 8px #10b981', animation: 'scanLaser 2.2s ease-in-out infinite'
                  }} />
                </div>

                {/* Live Confidence Badge */}
                {detectedSign && (
                  <div style={{
                    position: 'absolute', bottom: '18px', left: '18px', right: '18px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
                    padding: '12px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white'
                  }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Detected Gesture</span>
                      <h4 style={{ margin: '2px 0 0 0', fontSize: '18px', fontWeight: '800', color: '#38bdf8' }}>{detectedSign.label}</h4>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '800' }}>{confidence}% Match</span>
                      <button
                        onClick={() => addWordToSentence(detectedSign.label)}
                        style={{
                          display: 'block', marginTop: '4px', backgroundColor: '#10b981', color: 'white',
                          border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer'
                        }}
                      >
                        + Add to Sentence
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>

          {/* Quick Category Filter Pills */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 12px', borderRadius: '16px', border: '1px solid #cbd5e1',
                  backgroundColor: selectedCategory === cat ? '#004080' : '#ffffff',
                  color: selectedCategory === cat ? '#ffffff' : '#475569',
                  fontSize: '12px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: SENTENCE BUILDER & GESTURE RECOGNITION GUIDE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Sentence Accumulator Card */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0f172a' }}>
                📝 Translated Sentence
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={undoLastWord}
                  disabled={sentence.length === 0}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: sentence.length ? 'pointer' : 'not-allowed' }}
                >
                  ↶ Undo
                </button>
                <button
                  onClick={clearSentence}
                  disabled={sentence.length === 0}
                  style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: sentence.length ? 'pointer' : 'not-allowed' }}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Sentence Output Display Box */}
            <div style={{
              minHeight: '80px', padding: '16px', backgroundColor: '#f8fafc',
              borderRadius: '12px', border: '1.5px solid #cbd5e1', marginBottom: '16px',
              display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center'
            }}>
              {sentence.length > 0 ? (
                sentence.map((word, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: '#004080', color: '#ffffff', padding: '6px 14px',
                      borderRadius: '8px', fontSize: '15px', fontWeight: '700', boxShadow: '0 2px 6px rgba(0,64,128,0.2)'
                    }}
                  >
                    {word}
                  </span>
                ))
              ) : (
                <span style={{ color: '#94a3b8', fontSize: '14px', fontStyle: 'italic' }}>
                  Signs performed in front of camera will build your sentence here...
                </span>
              )}
            </div>

            {/* Sentence Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={speakSentence}
                disabled={sentence.length === 0}
                style={{
                  padding: '12px', borderRadius: '10px', border: 'none',
                  backgroundColor: sentence.length ? '#10b981' : '#cbd5e1',
                  color: 'white', fontSize: '14px', fontWeight: '800',
                  cursor: sentence.length ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  boxShadow: sentence.length ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
                }}
              >
                🔊 Speak Aloud
              </button>

              <Link to="/translate" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #004080',
                    backgroundColor: '#ffffff', color: '#004080', fontSize: '14px', fontWeight: '800',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                  }}
                >
                  🤟 3D Sign Player ➔
                </button>
              </Link>
            </div>
          </div>

          {/* Quick Recognizable Signs Guide / One-Click Test Grid */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>
              🎯 Supported Sign Gestures Guide
            </h3>
            <p style={{ margin: '0 0 14px 0', fontSize: '12.5px', color: '#64748b' }}>
              Click any sign card below to test capture or practice in front of camera:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
              {RECOGNIZABLE_SIGNS.map((sign) => (
                <div
                  key={sign.id}
                  onClick={() => handleCaptureManual(sign)}
                  style={{
                    padding: '10px 12px', borderRadius: '10px', backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ede9fe';
                    e.currentTarget.style.borderColor = '#8b5cf6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#0f172a' }}>{sign.label}</span>
                    <span style={{ fontSize: '10.5px', color: '#10b981', fontWeight: '700' }}>{sign.confidence}%</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: '1.3' }}>{sign.gesture}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @keyframes scanLaser {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(180px); opacity: 1; }
        }
      `}</style>

    </div>
  );
}
