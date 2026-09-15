import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { askGeminiRealtime, QUICK_SUGGESTIONS } from '../utils/aiBotEngine';

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "👋 Hi! I'm **SignBot AI**, your 24/7 ultra-fast assistant.\n\nAsk me **ANY question** — from 3D sign translations, deaf culture, and platform shortcuts to science, coding, and general knowledge! ⚡",
      action: null,
      provider: 'Groq AI ⚡',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechPaused, setIsSpeechPaused] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState(null);
  const [hasUnread, setHasUnread] = useState(false);
  
  // API Key Settings Modal
  const activeKey = localStorage.getItem('groq_api_key') || localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '';
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(activeKey);
  const [isKeySaved, setIsKeySaved] = useState(!!activeKey);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen, isTyping]);

  // Clean up speech on unmount or window close
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop / Cancel all active speech
  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsSpeechPaused(false);
      setCurrentSpeakingId(null);
    }
  };

  // Pause speech
  const pauseSpeech = () => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsSpeechPaused(true);
    }
  };

  // Resume speech
  const resumeSpeech = () => {
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsSpeechPaused(false);
    }
  };

  // Text to Speech
  const speakText = (text, messageId = null) => {
    if (!('speechSynthesis' in window)) return;
    
    // If currently speaking this same message, toggle stop
    if (isSpeaking && currentSpeakingId === messageId) {
      stopSpeech();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#`_•]/g, '').replace(/👉.*$/, '').replace(/\[\[ACTION:.*?\]\]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsSpeechPaused(false);
        setCurrentSpeakingId(messageId);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsSpeechPaused(false);
        setCurrentSpeakingId(null);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsSpeechPaused(false);
        setCurrentSpeakingId(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.log('TTS error', e);
      setIsSpeaking(false);
      setIsSpeechPaused(false);
      setCurrentSpeakingId(null);
    }
  };

  // Handle Send Message (Real-Time Async LLM)
  const handleSend = async (textToSend) => {
    const text = (typeof textToSend === 'string' ? textToSend : inputText).trim();
    if (!text || isTyping) return;

    // Stop any active speech before generating new response
    stopSpeech();

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const botReply = await askGeminiRealtime(text, messages, apiKeyInput || null);
      const newBotId = Date.now() + 1;

      const botMessage = {
        id: newBotId,
        sender: 'bot',
        text: botReply.text,
        action: botReply.action,
        isRealtimeAI: botReply.isRealtimeAI,
        provider: botReply.provider,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      if (!isOpen) {
        setHasUnread(true);
      }

      if (ttsEnabled) {
        speakText(botReply.text, newBotId);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: "I encountered a momentary connection issue. Please try asking again!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Voice Input for Chatbot
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    // Stop AI speech if user starts speaking
    stopSpeech();

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognitionRef.current = recognition;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleSend(transcript);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  // Save Groq or Gemini API Key
  const handleSaveApiKey = () => {
    const key = apiKeyInput.trim();
    if (key) {
      if (key.startsWith('gsk_')) {
        localStorage.setItem('groq_api_key', key);
        localStorage.removeItem('gemini_api_key');
      } else {
        localStorage.setItem('gemini_api_key', key);
        localStorage.removeItem('groq_api_key');
      }
      setIsKeySaved(true);
      setShowSettings(false);
      const providerName = key.startsWith('gsk_') ? 'Groq Llama-3.3 70B' : 'Google Gemini AI';
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'bot',
          text: `🎉 **${providerName} Connected Successfully!**\n\nI can now answer ANY question in real-time with ultra-fast AI intelligence.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else {
      localStorage.removeItem('groq_api_key');
      localStorage.removeItem('gemini_api_key');
      setIsKeySaved(false);
      setShowSettings(false);
    }
  };

  // Clear Chat History
  const clearChat = () => {
    stopSpeech();
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: "✨ Chat cleared! Ask me anything about **SignVerse** or the universe.",
        action: null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Modern Formatted Markdown Renderer
  const renderFormattedText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={partIdx} style={{ color: '#1e1b4b', fontWeight: '700' }}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={partIdx} style={{ backgroundColor: '#ede9fe', color: '#6b21a8', padding: '2px 5px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>{part.slice(1, -1)}</code>;
        }
        return part;
      });

      if (line.startsWith('### ')) {
        return <h4 key={lineIdx} style={{ margin: '10px 0 4px 0', color: '#4338ca', fontSize: '14.5px', fontWeight: '700' }}>{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={lineIdx} style={{ display: 'flex', gap: '8px', margin: '3px 0 3px 6px', alignItems: 'flex-start' }}>
            <span style={{ color: '#7c3aed', fontWeight: 'bold' }}>•</span>
            <div style={{ flex: 1 }}>{formattedLine}</div>
          </div>
        );
      }
      return <p key={lineIdx} style={{ margin: lineIdx === 0 ? '0' : '5px 0 0 0', lineHeight: '1.5' }}>{formattedLine}</p>;
    });
  };

  return (
    <>
      {/* 1. Eye-Catching Futuristic Floating Trigger Button (Bottom-Right) */}
      <div 
        style={{ 
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          display: 'flex', alignItems: 'center'
        }}
      >
        <button
          onClick={() => {
            if (isOpen) stopSpeech();
            setIsOpen(!isOpen);
          }}
          aria-label="Open AI Assistant"
          style={{
            position: 'relative',
            background: isOpen 
              ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' 
              : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 45%, #ec4899 100%)',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.35)',
            borderRadius: '50px',
            padding: isOpen ? '12px 20px' : '10px 22px 10px 14px',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: isOpen 
              ? '0 8px 24px rgba(30, 27, 75, 0.4)'
              : '0 10px 30px rgba(124, 58, 237, 0.5), 0 0 20px rgba(236, 72, 153, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            backdropFilter: 'blur(10px)',
            transform: 'scale(1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)';
            e.currentTarget.style.boxShadow = '0 14px 38px rgba(124, 58, 237, 0.65), 0 0 25px rgba(236, 72, 153, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = isOpen 
              ? '0 8px 24px rgba(30, 27, 75, 0.4)'
              : '0 10px 30px rgba(124, 58, 237, 0.5), 0 0 20px rgba(236, 72, 153, 0.3)';
          }}
        >
          {/* Animated Glowing Orb Avatar */}
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 12px rgba(255, 255, 255, 0.8)',
            position: 'relative', overflow: 'visible', flexShrink: 0
          }}>
            <span style={{ fontSize: '20px', animation: 'floatOrb 2.5s ease-in-out infinite' }}>
              {isOpen ? '✕' : '✨'}
            </span>
            
            {/* Live Online Green Halo */}
            <span style={{
              position: 'absolute', bottom: '-1px', right: '-1px', width: '11px', height: '11px',
              backgroundColor: '#10b981', borderRadius: '50%', border: '2px solid #ffffff',
              boxShadow: '0 0 8px #10b981'
            }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ letterSpacing: '0.3px', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              {isOpen ? 'Close Assistant' : 'Ask SignAI ⚡'}
            </span>
            {!isOpen && (
              <span style={{ fontSize: '10.5px', opacity: 0.9, fontWeight: '500', color: '#fdf2f8' }}>
                Real-Time LLM Assistant
              </span>
            )}
          </div>

          {hasUnread && !isOpen && (
            <span style={{
              position: 'absolute', top: '-4px', right: '-4px', width: '14px', height: '14px',
              backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid white',
              boxShadow: '0 0 10px #ef4444', animation: 'pulseDot 1.2s infinite'
            }} />
          )}
        </button>
      </div>

      {/* 2. Floating AI Chatbot Window */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed', bottom: '92px', right: '24px', zIndex: 9998,
            width: '420px', maxWidth: 'calc(100vw - 32px)', height: '600px', maxHeight: 'calc(100vh - 120px)',
            backgroundColor: '#ffffff', borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(15, 23, 42, 0.25), 0 0 1px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            fontFamily: 'system-ui, -apple-system, sans-serif', 
            animation: 'chatSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Futuristic Cosmic Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
            color: 'white', padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '2px solid rgba(139, 92, 246, 0.4)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px', height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 16px rgba(168, 85, 247, 0.6)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                fontSize: '20px', flexShrink: 0
              }}>
                🤖
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', letterSpacing: '0.3px' }}>SignBot Real-Time AI</h3>
                  <span style={{ fontSize: '10px', backgroundColor: '#4f46e5', color: '#e0e7ff', padding: '2px 6px', borderRadius: '8px', fontWeight: '700' }}>v2.5</span>
                </div>
                <span style={{ fontSize: '11.5px', color: '#c7d2fe', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                  <span style={{ width: '7px', height: '7px', backgroundColor: isKeySaved ? '#10b981' : '#f59e0b', borderRadius: '50%', boxShadow: isKeySaved ? '0 0 6px #10b981' : 'none' }} />
                  {isKeySaved ? (apiKeyInput.startsWith('gsk_') ? 'Groq Llama-3.3 70B Active ⚡' : 'Gemini 1.5 Flash Active ⚡') : 'Smart Local Mode'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {/* Settings / API Key */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                title="AI Settings & API Key"
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '15px', cursor: 'pointer', padding: '6px 8px', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              >
                ⚙️
              </button>

              {/* Audio TTS Auto-Read Toggle */}
              <button
                onClick={() => {
                  if (ttsEnabled) {
                    stopSpeech();
                    setTtsEnabled(false);
                  } else {
                    setTtsEnabled(true);
                  }
                }}
                title={ttsEnabled ? 'Mute Auto Voice' : 'Enable Auto Voice Audio'}
                style={{
                  background: ttsEnabled ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255,255,255,0.1)',
                  border: ttsEnabled ? '1px solid #a855f7' : 'none', borderRadius: '8px', color: 'white', fontSize: '15px',
                  cursor: 'pointer', padding: '6px 8px', transition: 'background 0.2s'
                }}
              >
                {ttsEnabled ? '🔊' : '🔇'}
              </button>

              {/* Clear Chat */}
              <button
                onClick={clearChat}
                title="Clear Conversation"
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '15px', cursor: 'pointer', padding: '6px 8px' }}
              >
                🗑️
              </button>

              {/* Close Window */}
              <button
                onClick={() => {
                  stopSpeech();
                  setIsOpen(false);
                }}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '16px', cursor: 'pointer', padding: '6px 8px' }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Active Audio Playback Controller Bar (Displayed when AI is speaking) */}
          {isSpeaking && (
            <div style={{
              background: 'linear-gradient(135deg, #ede9fe 0%, #fae8ff 100%)',
              borderBottom: '1.5px solid #d8b4fe', padding: '8px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              animation: 'fadeIn 0.25s ease-out', boxShadow: '0 2px 8px rgba(168, 85, 247, 0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', animation: 'waveSpeech 1s infinite' }}>🗣️</span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#6b21a8' }}>
                    {isSpeechPaused ? 'Speech Paused' : 'AI Reading Aloud...'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {/* Pause / Resume Button */}
                <button
                  onClick={isSpeechPaused ? resumeSpeech : pauseSpeech}
                  title={isSpeechPaused ? "Resume Reading" : "Pause Reading"}
                  style={{
                    backgroundColor: '#ffffff', color: '#6b21a8', border: '1px solid #c084fc',
                    borderRadius: '6px', padding: '4px 10px', fontSize: '11.5px', fontWeight: '700',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                  }}
                >
                  {isSpeechPaused ? '▶️ Resume' : '⏸️ Pause'}
                </button>

                {/* Stop Speech Button */}
                <button
                  onClick={stopSpeech}
                  title="Stop Audio Speech"
                  style={{
                    backgroundColor: '#ef4444', color: '#ffffff', border: 'none',
                    borderRadius: '6px', padding: '4px 10px', fontSize: '11.5px', fontWeight: '700',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                    boxShadow: '0 2px 6px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  ⏹️ Stop Speech
                </button>
              </div>
            </div>
          )}

          {/* Settings Modal (API Key configuration) */}
          {showSettings && (
            <div style={{ backgroundColor: '#f8fafc', padding: '14px 18px', borderBottom: '1px solid #e2e8f0', animation: 'fadeIn 0.25s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e1b4b' }}>⚙️ Connected AI Provider</span>
                <button onClick={() => setShowSettings(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#64748b' }}>Close</button>
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: '11.5px', color: '#475569', lineHeight: '1.4' }}>
                Supports ultra-fast <strong>Groq API Keys</strong> (<a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" style={{ color: '#6366f1', fontWeight: 'bold' }}>console.groq.com</a>) and <strong>Gemini Keys</strong>.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="password"
                  placeholder="Paste Groq or Gemini Key..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  style={{ flex: 1, padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', outline: 'none' }}
                />
                <button
                  onClick={handleSaveApiKey}
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', border: 'none', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Quick Suggestion Pills */}
          <div style={{
            backgroundColor: '#f8fafc', padding: '8px 12px', borderBottom: '1px solid #edf2f7',
            display: 'flex', gap: '6px', overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none'
          }}>
            {QUICK_SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(suggestion)}
                style={{
                  backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px',
                  padding: '5px 12px', fontSize: '11.5px', color: '#4338ca', cursor: 'pointer',
                  fontWeight: '600', transition: 'all 0.2s', flexShrink: 0,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ede9fe';
                  e.currentTarget.style.borderColor = '#8b5cf6';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div style={{
            flex: 1, padding: '16px', overflowY: 'auto', backgroundColor: '#f8fafc',
            display: 'flex', flexDirection: 'column', gap: '12px'
          }}>
            {messages.map((msg) => {
              const isThisSpeaking = isSpeaking && currentSpeakingId === msg.id;
              return (
                <div 
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div 
                    style={{
                      maxWidth: '88%', padding: '12px 16px', borderRadius: '16px',
                      background: msg.sender === 'user' 
                        ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' 
                        : '#ffffff',
                      color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                      fontSize: '13.5px', lineHeight: '1.5',
                      boxShadow: msg.sender === 'user' 
                        ? '0 4px 14px rgba(79, 70, 229, 0.3)' 
                        : '0 2px 10px rgba(0,0,0,0.05)',
                      border: msg.sender === 'user' ? 'none' : '1px solid rgba(226, 232, 240, 0.9)',
                      borderTopRightRadius: msg.sender === 'user' ? '3px' : '16px',
                      borderTopLeftRadius: msg.sender === 'bot' ? '3px' : '16px',
                      wordBreak: 'break-word', position: 'relative'
                    }}
                  >
                    {renderFormattedText(msg.text)}

                    {msg.action && (
                      <button
                        onClick={() => {
                          stopSpeech();
                          setIsOpen(false);
                          navigate(msg.action.route);
                        }}
                        style={{
                          marginTop: '10px', width: '100%', padding: '9px 12px',
                          background: 'linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%)',
                          color: '#4338ca', border: '1px solid #c7d2fe',
                          borderRadius: '10px', fontSize: '12.5px', fontWeight: '700',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                          transition: 'all 0.2s', boxShadow: '0 2px 6px rgba(99, 102, 241, 0.15)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #ddd6fe 0%, #c7d2fe 100%)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <span>👉 {msg.action.label}</span>
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', padding: '0 4px' }}>
                    <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500' }}>
                      {msg.time} {msg.provider && `• ✨ ${msg.provider}`}
                    </span>

                    {/* Individual Play / Stop Voice Button for Bot Messages */}
                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => speakText(msg.text, msg.id)}
                        title={isThisSpeaking ? "Stop Voice" : "Read Aloud"}
                        style={{
                          background: isThisSpeaking ? '#fee2e2' : '#f1f5f9',
                          border: isThisSpeaking ? '1px solid #fca5a5' : '1px solid #e2e8f0',
                          borderRadius: '12px', padding: '1px 6px', fontSize: '11px',
                          color: isThisSpeaking ? '#dc2626' : '#64748b', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '3px', fontWeight: '600'
                        }}
                      >
                        <span>{isThisSpeaking ? '⏹️ Stop' : '🔊 Listen'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
                backgroundColor: '#ffffff', borderRadius: '16px', width: 'fit-content',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0'
              }}>
                <span style={{ fontSize: '12px', color: '#4f46e5', fontWeight: '700' }}>AI Thinking</span>
                <span className="dot" style={{ width: '6px', height: '6px', backgroundColor: '#7c3aed', borderRadius: '50%', animation: 'dotPulse 1.2s infinite' }} />
                <span className="dot" style={{ width: '6px', height: '6px', backgroundColor: '#7c3aed', borderRadius: '50%', animation: 'dotPulse 1.2s infinite 0.2s' }} />
                <span className="dot" style={{ width: '6px', height: '6px', backgroundColor: '#7c3aed', borderRadius: '50%', animation: 'dotPulse 1.2s infinite 0.4s' }} />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: '12px 16px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            {/* Mic Voice Button */}
            <button
              onClick={toggleVoiceInput}
              title="Speak Question"
              style={{
                backgroundColor: isListening ? '#ef4444' : '#f1f5f9',
                color: isListening ? '#ffffff' : '#4f46e5',
                border: 'none', borderRadius: '50%', width: '40px', height: '40px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '17px', flexShrink: 0, transition: 'all 0.25s',
                boxShadow: isListening ? '0 0 16px rgba(239, 68, 68, 0.6)' : 'none',
                animation: isListening ? 'micPulse 1.2s infinite' : 'none'
              }}
            >
              🎙️
            </button>

            <input
              type="text"
              placeholder={isListening ? "Listening... Speak now!" : "Ask ANY question in real-time..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              style={{
                flex: 1, padding: '11px 16px', borderRadius: '30px', border: '1.5px solid #e2e8f0',
                fontSize: '13.5px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#7c3aed';
                e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isTyping}
              style={{
                background: inputText.trim() && !isTyping 
                  ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' 
                  : '#cbd5e1',
                color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px',
                cursor: inputText.trim() && !isTyping ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', flexShrink: 0, transition: 'all 0.25s',
                boxShadow: inputText.trim() && !isTyping ? '0 4px 14px rgba(79, 70, 229, 0.4)' : 'none'
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Embedded Modern Animations */}
      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes micPulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes waveSpeech {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </>
  );
}
