import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FaUpload, FaMicrophone, FaVolumeUp, FaVolumeMute, 
  FaRedo, FaCheckCircle, FaExclamationTriangle, 
  FaSpinner, FaFileAlt, FaRobot, FaAward, FaLightbulb, FaChevronRight 
} from 'react-icons/fa';
import apiService from '../services/apiService';
import '../styles/AIMockInterview.css';

const AIMockInterview = () => {
  // Navigation step: 1: Upload, 2: Interview In-Progress, 3: Final Report
  const [step, setStep] = useState(1);
  
  // Resume upload state
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Interview session state
  const [sessionId, setSessionId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { 0: "ans1", 1: "ans2", ... }
  const [currentAnswer, setCurrentAnswer] = useState('');

  // Voice Speech Synthesis & Recognition state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Evaluation & Final Report State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  // Helper speak function wrapped in useCallback
  const speakText = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any active speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // State to track if user explicitly wants mic on
  const shouldListenRef = useRef(false);

  // Initialize Speech Recognition on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          setCurrentAnswer((prev) => (prev ? `${prev.trim()} ${finalTranscript.trim()}` : finalTranscript.trim()));
        }
      };

      recognition.onerror = (err) => {
        console.error('Speech recognition error:', err);
        if (err.error === 'no-speech' || err.error === 'network' || err.error === 'audio-capture') {
          // Keep listening active if user hasn't explicitly stopped it
          if (shouldListenRef.current) {
            try {
              recognition.start();
              return;
            } catch (e) {
              // ignore if already started
            }
          }
        }
        setIsListening(false);
        shouldListenRef.current = false;
      };

      recognition.onend = () => {
        if (shouldListenRef.current) {
          try {
            recognition.start();
          } catch (e) {
            setIsListening(false);
            shouldListenRef.current = false;
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        shouldListenRef.current = false;
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speak question automatically when question index changes
  useEffect(() => {
    if (step === 2 && questions.length > 0) {
      const questionText = questions[currentIndex];
      setCurrentAnswer(answers[currentIndex] || '');
      speakText(questionText);
    }
  }, [currentIndex, step, questions, answers, speakText]);

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please type your answer or use Chrome/Edge.');
      return;
    }

    // Stop TTS if speaking when mic starts
    stopSpeaking();

    if (isListening) {
      shouldListenRef.current = false;
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
    } else {
      try {
        shouldListenRef.current = true;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Mic start error:", err);
        // If already running or threw error, reset state
        shouldListenRef.current = false;
        setIsListening(false);
      }
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setUploadError('');
    }
  };

  const handleStartInterview = async (e) => {
    e.preventDefault();
    if (!file && !resumeText.trim()) {
      setUploadError('Please upload a resume file (PDF/TXT) or paste your resume text to begin.');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      if (resumeText.trim()) {
        formData.append('resumeText', resumeText.trim());
      }

      const res = await apiService.startMockInterview(formData);
      const data = res.data;

      setSessionId(data.sessionId);
      setResumeText(data.resumeText || resumeText);
      setQuestions(data.questions || []);
      setCurrentIndex(0);
      setAnswers({});
      setStep(2);
    } catch (err) {
      console.error('Failed to start mock interview:', err);
      setUploadError(err.response?.data || 'Failed to parse resume and initialize AI interview. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnswerChange = (e) => {
    setCurrentAnswer(e.target.value);
  };

  const handleNextQuestion = () => {
    stopSpeaking();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const updatedAnswers = { ...answers, [currentIndex]: currentAnswer };
    setAnswers(updatedAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Final question answered -> trigger evaluation
      submitForEvaluation(updatedAnswers);
    }
  };

  const submitForEvaluation = async (finalAnswers) => {
    setIsEvaluating(true);
    setStep(3);

    const qaList = questions.map((q, idx) => ({
      questionNumber: idx + 1,
      question: q,
      userAnswer: finalAnswers[idx] || '[No Answer Provided]'
    }));

    try {
      const payload = {
        sessionId,
        resumeText,
        qaList
      };

      const res = await apiService.evaluateMockInterview(payload);
      setEvaluation(res.data);
    } catch (err) {
      console.error('Evaluation failed:', err);
      alert('Error connecting to AI evaluation server. Showing baseline report.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const resetInterview = () => {
    stopSpeaking();
    setStep(1);
    setFile(null);
    setResumeText('');
    setQuestions([]);
    setAnswers({});
    setCurrentAnswer('');
    setEvaluation(null);
    setUploadError('');
  };

  return (
    <div className="mock-interview-container">
      {/* Header Banner */}
      <div className="interview-header">
        <div className="header-badge">
          <FaRobot className="icon-spin" /> AI Powered Mock Interviewer
        </div>
        <h1>Voice & Text AI Technical Mock Interview</h1>
        <p>Upload your resume, take a live AI-driven 5-question mock interview with voice output & speech recognition, and receive deep AI evaluation.</p>
      </div>

      {/* Progress Steps Bar */}
      <div className="step-indicator">
        <div className={`step-item ${step >= 1 ? 'active' : ''}`}>
          <span className="step-num">1</span>
          <span className="step-title">Upload Resume</span>
        </div>
        <div className="step-line"></div>
        <div className={`step-item ${step >= 2 ? 'active' : ''}`}>
          <span className="step-num">2</span>
          <span className="step-title">Voice Interview (5 Questions)</span>
        </div>
        <div className="step-line"></div>
        <div className={`step-item ${step >= 3 ? 'active' : ''}`}>
          <span className="step-num">3</span>
          <span className="step-title">AI Evaluation & Score</span>
        </div>
      </div>

      {/* STEP 1: Upload & Initialization */}
      {step === 1 && (
        <div className="upload-card card-glass">
          <h2><FaFileAlt /> Step 1: Provide Your Resume</h2>
          <p className="subtitle">AI will extract your projects, tech stack, and background to tailor 5 realistic interview questions.</p>

          <form onSubmit={handleStartInterview} className="upload-form">
            <div className="file-drop-zone">
              <input 
                type="file" 
                id="resume-upload" 
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileChange}
                className="file-input-hidden" 
              />
              <label htmlFor="resume-upload" className="drop-zone-label">
                <FaUpload className="upload-icon" />
                {file ? (
                  <div className="selected-file">
                    <span className="filename">{file.name}</span>
                    <span className="filesize">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                ) : (
                  <div>
                    <span className="primary-text">Click to browse or drop your Resume (PDF / TXT)</span>
                    <span className="secondary-text">Maximum size 10MB</span>
                  </div>
                )}
              </label>
            </div>

            <div className="divider"><span>OR PASTE RESUME TEXT</span></div>

            <div className="text-input-group">
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste raw text of your resume here (e.g. skills, experience, education, projects)..."
                rows={5}
                className="resume-textarea"
              />
            </div>

            {uploadError && (
              <div className="error-banner">
                <FaExclamationTriangle /> {uploadError}
              </div>
            )}

            <button type="submit" className="btn-primary btn-large" disabled={isUploading}>
              {isUploading ? (
                <>
                  <FaSpinner className="icon-spin" /> AI Parsing Resume & Generating Questions...
                </>
              ) : (
                <>
                  Start AI Voice Interview <FaChevronRight />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: Interactive Voice & Text Interview */}
      {step === 2 && questions.length > 0 && (
        <div className="interview-card card-glass">
          <div className="question-progress-bar">
            <div className="progress-info">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}% Complete</span>
            </div>
            <div className="progress-track">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="question-box">
            <div className="ai-avatar-header">
              <div className="avatar-circle">
                <FaRobot />
              </div>
              <div className="ai-speaker-info">
                <h3>AI Interviewer</h3>
                <span className="speaking-status">
                  {isSpeaking ? <><span className="wave-dot"></span> AI is speaking...</> : 'Listening to your response'}
                </span>
              </div>
              <button 
                onClick={isSpeaking ? stopSpeaking : () => speakText(questions[currentIndex])}
                className={`voice-toggle-btn ${isSpeaking ? 'active' : ''}`}
                title={isSpeaking ? "Stop AI Voice" : "Replay AI Question Voice"}
              >
                {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />} {isSpeaking ? 'Mute' : 'Replay Voice'}
              </button>
            </div>

            <div className="question-text">
              <p>"{questions[currentIndex]}"</p>
            </div>
          </div>

          {/* User Answer Controls */}
          <div className="answer-section">
            <div className="answer-header">
              <label htmlFor="user-answer-input">Your Answer:</label>
              <button 
                type="button" 
                onClick={toggleListening}
                className={`mic-btn ${isListening ? 'listening' : ''}`}
                title={isListening ? "Stop Voice Recording" : "Start Voice Recording (Mic)"}
              >
                <FaMicrophone /> {isListening ? 'Stop Recording (Listening...)' : 'Answer with Voice (Mic)'}
              </button>
            </div>

            {isListening && (
              <div className="listening-animation">
                <span className="mic-pulse"></span>
                <span>Listening live... Speak clearly into your microphone</span>
              </div>
            )}

            <textarea
              id="user-answer-input"
              value={currentAnswer}
              onChange={handleAnswerChange}
              placeholder="Type your response or click 'Answer with Voice (Mic)' to dictate..."
              rows={6}
              className="answer-textarea"
            />

            <div className="action-row">
              <button 
                type="button" 
                onClick={handleNextQuestion}
                className="btn-primary btn-large"
              >
                {currentIndex === questions.length - 1 ? (
                  <>Submit & Evaluate Interview <FaCheckCircle /></>
                ) : (
                  <>Next Question <FaChevronRight /></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Evaluation Dashboard & Report */}
      {step === 3 && (
        <div className="evaluation-card card-glass">
          {isEvaluating ? (
            <div className="evaluating-loader">
              <FaSpinner className="icon-spin big-spinner" />
              <h2>AI is Evaluating Your Answers...</h2>
              <p>Comparing your technical responses with model benchmarks based on your resume profile.</p>
            </div>
          ) : evaluation ? (
            <div className="report-container">
              {/* Score Header */}
              <div className="score-summary-banner">
                <div className="score-badge-circle">
                  <span className="score-num">{evaluation.overallScore}</span>
                  <span className="score-max">/ 100</span>
                </div>
                <div className="score-details">
                  <h2>Interview Evaluation Summary</h2>
                  <p className="summary-text">{evaluation.summary}</p>
                  <div className="recommendation-pill">
                    Hiring Recommendation: <strong>{evaluation.hiringRecommendation}</strong>
                  </div>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="feedback-grid">
                <div className="feedback-col strengths-card">
                  <h3><FaCheckCircle className="green-icon" /> Key Strengths</h3>
                  <ul>
                    {evaluation.strengths?.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="feedback-col improvements-card">
                  <h3><FaLightbulb className="yellow-icon" /> Areas for Improvement</h3>
                  <ul>
                    {evaluation.areasForImprovement?.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Per-Question Detailed Breakdown */}
              <div className="breakdown-section">
                <h3><FaAward /> Question-by-Question Detailed Analysis</h3>
                <div className="qa-breakdown-list">
                  {evaluation.questionEvaluations?.map((item) => (
                    <div key={item.questionNumber} className="qa-eval-item">
                      <div className="qa-eval-header">
                        <span className="q-number">Q{item.questionNumber}</span>
                        <h4 className="q-title">{item.question}</h4>
                        <span className={`q-score-badge ${item.score >= 8 ? 'high' : item.score >= 6 ? 'mid' : 'low'}`}>
                          Score: {item.score}/10
                        </span>
                      </div>

                      <div className="qa-eval-body">
                        <div className="user-ans-box">
                          <strong>Your Answer:</strong>
                          <p>{item.userAnswer || 'No answer provided'}</p>
                        </div>
                        <div className="ai-feedback-box">
                          <strong>AI Feedback:</strong>
                          <p>{item.feedback}</p>
                        </div>
                        <div className="ideal-ans-box">
                          <strong>Benchmark / Ideal Answer Structure:</strong>
                          <p>{item.idealAnswer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="report-actions">
                <button onClick={resetInterview} className="btn-primary btn-large">
                  <FaRedo /> Take Another Mock Interview
                </button>
              </div>
            </div>
          ) : (
            <div className="error-state">
              <p>Failed to load evaluation. Please try again.</p>
              <button onClick={resetInterview} className="btn-primary">Restart</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIMockInterview;
