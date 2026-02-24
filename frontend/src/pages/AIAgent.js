import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaPaperPlane, FaMicrophone, FaMicrophoneSlash, FaUser, FaLightbulb, FaBriefcase, FaCode, FaFileAlt, FaComments } from 'react-icons/fa';
import apiService from '../services/apiService';

const AIAgent = () => {
  const [messages, setMessages] = useState([
    { type: 'agent', content: 'Hello! I\'m your Placement Prep AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const quickActions = [
    { icon: <FaBriefcase />, label: 'Interview Prep', query: 'Help me prepare for technical interviews' },
    { icon: <FaFileAlt />, label: 'Resume Tips', query: 'How can I improve my resume?' },
    { icon: <FaCode />, label: 'Coding Help', query: 'I need help with data structures and algorithms' },
    { icon: <FaComments />, label: 'Career Advice', query: 'What career path should I choose?' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await apiService.agentInteract({
        message: userMessage,
        sessionId: sessionId,
        voiceMode: voiceMode,
        userId: 1
      });

      setSessionId(response.data.sessionId);
      setMessages(prev => [...prev, {
        type: 'agent',
        content: response.data.response,
        suggestedActions: response.data.suggestedActions?.split(',')
      }]);

      if (response.data.redirectPath) {
        setTimeout(() => {
          navigate(response.data.redirectPath);
        }, 1500);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        type: 'agent',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (query) => {
    setInput(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ai-agent">
      <div className="page-header">
        <div className="container">
          <h1><FaRobot style={{ marginRight: '12px' }} /> AI Assistant</h1>
          <p>Your personal placement preparation companion - Ask anything!</p>
        </div>
      </div>

      <div className="page-content">
        <div className="card" style={{ maxWidth: '900px', margin: '0 auto', height: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column' }}>
          {/* Messages */}
          <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '16px'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  maxWidth: '80%',
                  flexDirection: msg.type === 'user' ? 'row-reverse' : 'row'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: msg.type === 'user' ? '#667eea' : '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    {msg.type === 'user' ? <FaUser size={16} /> : <FaRobot size={16} />}
                  </div>
                  <div>
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '16px',
                      background: msg.type === 'user' ? '#667eea' : '#f1f5f9',
                      color: msg.type === 'user' ? 'white' : '#1a202c',
                      lineHeight: '1.6'
                    }}>
                      {msg.content}
                    </div>
                    {msg.suggestedActions && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                        {msg.suggestedActions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => handleQuickAction(action)}
                            style={{
                              padding: '6px 12px',
                              background: 'white',
                              border: '1px solid #e2e8f0',
                              borderRadius: '16px',
                              fontSize: '12px',
                              color: '#667eea',
                              cursor: 'pointer'
                            }}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <FaRobot size={16} />
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', background: '#cbd5e1', borderRadius: '50%', animation: 'bounce 1s infinite' }}></span>
                  <span style={{ width: '8px', height: '8px', background: '#cbd5e1', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }}></span>
                  <span style={{ width: '8px', height: '8px', background: '#cbd5e1', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div style={{ padding: '0 20px 16px', borderBottom: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                <FaLightbulb style={{ marginRight: '6px' }} /> Quick Actions
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.query)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      background: '#f1f5f9',
                      border: 'none',
                      borderRadius: '20px',
                      fontSize: '13px',
                      color: '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#e2e8f0'}
                    onMouseLeave={(e) => e.target.style.background = '#f1f5f9'}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
              <button
                onClick={() => setVoiceMode(!voiceMode)}
                style={{
                  padding: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  background: voiceMode ? '#667eea' : '#f1f5f9',
                  color: voiceMode ? 'white' : '#64748b',
                  cursor: 'pointer'
                }}
                title={voiceMode ? 'Voice mode on' : 'Voice mode off'}
              >
                {voiceMode ? <FaMicrophone /> : <FaMicrophoneSlash />}
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '24px',
                  resize: 'none',
                  fontSize: '14px',
                  minHeight: '48px',
                  maxHeight: '120px'
                }}
                rows="1"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                style={{
                  padding: '12px 20px',
                  borderRadius: '24px',
                  border: 'none',
                  background: loading || !input.trim() ? '#e2e8f0' : '#667eea',
                  color: loading || !input.trim() ? '#94a3b8' : 'white',
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default AIAgent;
