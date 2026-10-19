"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVolumeUp,
  FaVolumeMute,
  FaVideo,
  FaVideoSlash,
  FaUpload,
  FaFileAlt,
  FaPlay,
  FaCheckCircle,
  FaSpinner,
  FaRedo,
  FaArrowRight,
  FaArrowLeft,
  FaLightbulb,
  FaAward,
  FaExclamationTriangle,
  FaRobot
} from "react-icons/fa";

export default function MockInterviewPage() {
  // Setup State
  const [stage, setStage] = useState("SETUP"); // SETUP | INTERVIEW | EVALUATION
  const [role, setRole] = useState("Software Development Engineer (SDE-1)");
  const [difficulty, setDifficulty] = useState("Medium");
  const [resumeText, setResumeText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Active Interview Session State
  const [interviewData, setInterviewData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingAI, setIsSpeakingAI] = useState(false);
  const [speechMuted, setSpeechMuted] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  // Evaluation Result State
  const [evaluation, setEvaluation] = useState(null);
  const [evaluating, setEvaluating] = useState(false);

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            setAnswers((prev) => {
              const currentAns = prev[currentIndex] || "";
              return {
                ...prev,
                [currentIndex]: currentAns ? currentAns + " " + currentTranscript : currentTranscript,
              };
            });
          }
        };

        recognition.onerror = (e) => {
          console.warn("Speech recognition error:", e.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [currentIndex]);

  // Read AI Question with Text-to-Speech
  const speakQuestion = (text) => {
    if (speechMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeakingAI(true);
    utterance.onend = () => setIsSpeakingAI(false);
    utterance.onerror = () => setIsSpeakingAI(false);
    window.speechSynthesis.speak(utterance);
  };

  // Toggle Camera
  const toggleCamera = async () => {
    if (cameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } catch (err) {
        console.warn("Camera access denied or unavailable:", err);
        alert("Camera preview could not be started. Check browser permissions.");
      }
    }
  };

  // Start Speech Recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition is not supported by your browser. Please type your answer directly.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Recognition start failed:", err);
      }
    }
  };

  // Handle File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        setResumeText(text);
      };
      reader.readAsText(file);
    }
  };

  // Start Interview
  const handleStartInterview = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/mock-interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, difficulty, resumeText }),
      });

      if (!res.ok) {
        throw new Error("Failed to start interview");
      }

      const data = await res.json();
      setInterviewData(data);
      setCurrentIndex(0);
      setAnswers({});
      setStage("INTERVIEW");

      // Auto-read first question
      if (data.questions && data.questions[0]) {
        setTimeout(() => speakQuestion(data.questions[0].question), 600);
      }
    } catch (err) {
      setError(err.message || "Something went wrong starting interview.");
    } finally {
      setLoading(false);
    }
  };

  // Switch questions
  const goToQuestion = (index) => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setCurrentIndex(index);
    if (interviewData && interviewData.questions && interviewData.questions[index]) {
      setTimeout(() => speakQuestion(interviewData.questions[index].question), 300);
    }
  };

  // Submit interview for AI evaluation
  const handleFinishInterview = async () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (cameraActive && videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      setCameraActive(false);
    }

    setEvaluating(true);
    setError(null);

    const qaList = (interviewData?.questions || []).map((q, idx) => ({
      id: q.id,
      category: q.category,
      question: q.question,
      hint: q.hint,
      answer: answers[idx] || "",
    }));

    try {
      const res = await fetch("/api/mock-interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, difficulty, qaList }),
      });

      if (!res.ok) {
        throw new Error("Evaluation request failed");
      }

      const evalData = await res.json();
      setEvaluation(evalData);
      setStage("EVALUATION");
    } catch (err) {
      setError(err.message || "Failed to evaluate interview.");
    } finally {
      setEvaluating(false);
    }
  };

  const currentQ = interviewData?.questions?.[currentIndex];
  const totalQ = interviewData?.questions?.length || 0;

  return (
    <div className="page-wrapper container">
      {/* Page Header */}
      <div className="page-header">
        <span className="badge-tag">
          <FaMicrophone style={{ marginRight: "6px", color: "#ec4899" }} /> Real-Time Voice Simulation
        </span>
        <h1 className="page-title">AI Mock Interview Room</h1>
        <p className="page-subtitle">
          Experience realistic technical & behavioral placement rounds with AI speech recognition, voice synthesis, and in-depth hiring scorecards.
        </p>
      </div>

      {error && (
        <div className="error-banner card-glass">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      {/* STAGE 1: SETUP */}
      {stage === "SETUP" && (
        <div className="setup-card card-glass">
          <h2 className="setup-heading">Configure Your Interview Session</h2>
          <p className="setup-sub">
            Select your target career role, difficulty level, and optionally upload your resume so our AI can customize questions to your exact background.
          </p>

          <form onSubmit={handleStartInterview}>
            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">Target Role / Designation</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-select"
                >
                  <option value="Software Development Engineer (SDE-1)">Software Development Engineer (SDE-1)</option>
                  <option value="Full Stack Java / Spring Boot Developer">Full Stack Java / Spring Boot Developer</option>
                  <option value="Frontend Engineer (React / Next.js)">Frontend Engineer (React / Next.js)</option>
                  <option value="AI / Machine Learning Engineer Trainee">AI / Machine Learning Engineer Trainee</option>
                  <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
                  <option value="Associate Software Engineer (Campus Mass Drive)">Associate Software Engineer (Campus Mass Drive)</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label className="form-label">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="form-select"
                >
                  <option value="Easy">Easy (Campus Screening / Foundation)</option>
                  <option value="Medium">Medium (Standard SDE-1 / Product Assessment)</option>
                  <option value="Hard">Hard (Tier-1 Product Companies: Google/Amazon/Uber)</option>
                </select>
              </div>
            </div>

            {/* Resume Upload / Text Area */}
            <div className="form-group">
              <label className="form-label">
                Upload Resume or Paste Resume Text <span style={{ color: "#94a3b8", fontWeight: 400 }}>(Optional - for personalized questions)</span>
              </label>
              
              <div className="upload-dropzone">
                <input
                  type="file"
                  id="resume-file"
                  accept=".txt,.pdf,.docx"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
                <label htmlFor="resume-file" className="upload-label">
                  <FaUpload className="upload-icon" />
                  {uploadedFileName ? (
                    <span className="file-name"><FaFileAlt /> {uploadedFileName}</span>
                  ) : (
                    <span>Click to upload resume (.pdf, .txt) or drag & drop</span>
                  )}
                </label>
              </div>

              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Or paste your skills, projects, and summary here..."
                className="form-textarea"
                style={{ marginTop: "12px", minHeight: "90px" }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-accent btn-large" style={{ width: "100%", padding: "15px" }}>
              {loading ? (
                <>
                  <FaSpinner className="spin" /> Generating Interview Room with AI...
                </>
              ) : (
                <>
                  <FaPlay /> Enter AI Interview Room
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* STAGE 2: INTERVIEW ROOM */}
      {stage === "INTERVIEW" && currentQ && (
        <div className="interview-room-grid">
          {/* Left Column: AI Interviewer & Video Simulation */}
          <div className="room-left-col">
            <div className="interviewer-avatar-card card-glass">
              <div className="avatar-header">
                <span className="badge-tag" style={{ margin: 0 }}>AI Technical Interviewer</span>
                <span className="live-pill">LIVE SESSION</span>
              </div>

              <div className="avatar-center">
                <div className={`avatar-circle ${isSpeakingAI ? "avatar-speaking" : ""}`}>
                  <FaRobot className="avatar-icon" />
                </div>
                {isSpeakingAI ? (
                  <p className="avatar-status status-speaking">
                    <span className="audio-wave-bar"></span>
                    <span className="audio-wave-bar"></span>
                    <span className="audio-wave-bar"></span>
                    AI Interviewer is speaking...
                  </p>
                ) : (
                  <p className="avatar-status">AI Interviewer is listening...</p>
                )}
              </div>

              {/* Candidate WebCam Preview */}
              <div className="webcam-preview-box">
                <video ref={videoRef} autoPlay playsInline muted className={`webcam-video ${cameraActive ? "active" : ""}`} />
                {!cameraActive && (
                  <div className="webcam-placeholder">
                    <FaVideoSlash />
                    <span>Camera is off</span>
                  </div>
                )}
              </div>

              {/* Media Controls */}
              <div className="media-controls-bar">
                <button
                  type="button"
                  onClick={() => {
                    setSpeechMuted(!speechMuted);
                    if (!speechMuted && typeof window !== "undefined") window.speechSynthesis.cancel();
                  }}
                  className={`btn-media ${speechMuted ? "muted" : ""}`}
                  title={speechMuted ? "Unmute AI Voice" : "Mute AI Voice"}
                >
                  {speechMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>

                <button
                  type="button"
                  onClick={toggleCamera}
                  className={`btn-media ${cameraActive ? "active" : ""}`}
                  title={cameraActive ? "Turn Off Camera" : "Turn On Camera"}
                >
                  {cameraActive ? <FaVideo /> : <FaVideoSlash />}
                </button>

                <button
                  type="button"
                  onClick={() => speakQuestion(currentQ.question)}
                  className="btn-media"
                  title="Repeat Question Audio"
                >
                  <FaRedo />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Question & Live Answer */}
          <div className="room-right-col">
            <div className="question-card card-glass">
              <div className="q-nav-bar">
                <span className="q-counter">
                  Question {currentIndex + 1} of {totalQ}
                </span>
                <span className="q-category pill-chip">{currentQ.category || "Technical Evaluation"}</span>
              </div>

              <h2 className="current-question-text">{currentQ.question}</h2>

              {currentQ.hint && (
                <div className="q-hint-box">
                  <FaLightbulb className="hint-icon" />
                  <span><strong>Interviewer Expectation:</strong> {currentQ.hint}</span>
                </div>
              )}

              {/* Live Answer Box */}
              <div className="answer-section">
                <div className="answer-header">
                  <label className="answer-label">Your Response</label>
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`btn-mic ${isListening ? "mic-recording" : ""}`}
                  >
                    {isListening ? (
                      <>
                        <FaMicrophoneSlash /> Stop Mic
                      </>
                    ) : (
                      <>
                        <FaMicrophone /> Speak Answer (Mic)
                      </>
                    )}
                  </button>
                </div>

                {isListening && (
                  <div className="recording-alert">
                    <span className="rec-dot"></span>
                    <span>Listening to your voice... Speak clearly into your microphone.</span>
                  </div>
                )}

                <textarea
                  value={answers[currentIndex] || ""}
                  onChange={(e) => setAnswers({ ...answers, [currentIndex]: e.target.value })}
                  placeholder="Speak via microphone or type your answer here. Provide structured points with real examples..."
                  className="form-textarea answer-textarea"
                />
              </div>

              {/* Question Navigation Actions */}
              <div className="q-action-footer">
                <button
                  type="button"
                  onClick={() => goToQuestion(currentIndex - 1)}
                  disabled={currentIndex === 0}
                  className="btn btn-secondary"
                >
                  <FaArrowLeft /> Previous
                </button>

                {currentIndex < totalQ - 1 ? (
                  <button
                    type="button"
                    onClick={() => goToQuestion(currentIndex + 1)}
                    className="btn btn-primary"
                  >
                    Next Question <FaArrowRight />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinishInterview}
                    disabled={evaluating}
                    className="btn btn-accent"
                  >
                    {evaluating ? (
                      <>
                        <FaSpinner className="spin" /> Generating AI Scorecard...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle /> Complete & Get Evaluation
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 3: EVALUATION REPORT MODAL / VIEW */}
      {stage === "EVALUATION" && evaluation && (
        <div className="eval-container">
          {/* Top Scorecard Header */}
          <div className="eval-scorecard card-glass">
            <div className="eval-header-top">
              <div>
                <span className="badge-tag">Final Placement Evaluation</span>
                <h2 className="eval-role-title">{role}</h2>
              </div>
              <div className="hiring-decision-badge">
                {evaluation.hiringDecision || "Hire Recommendation"}
              </div>
            </div>

            {/* Score Rings */}
            <div className="score-metrics-grid">
              <div className="metric-box">
                <div className="metric-circle circle-overall">
                  <span className="metric-val">{evaluation.overallScore}%</span>
                </div>
                <span className="metric-name">Overall Placement Readiness</span>
              </div>

              <div className="metric-box">
                <div className="metric-circle circle-tech">
                  <span className="metric-val">{evaluation.technicalScore}%</span>
                </div>
                <span className="metric-name">Technical Depth & Accuracy</span>
              </div>

              <div className="metric-box">
                <div className="metric-circle circle-comm">
                  <span className="metric-val">{evaluation.communicationScore}%</span>
                </div>
                <span className="metric-name">Communication Clarity</span>
              </div>

              <div className="metric-box">
                <div className="metric-circle circle-conf">
                  <span className="metric-val">{evaluation.confidenceScore}%</span>
                </div>
                <span className="metric-name">Confidence & Structure</span>
              </div>
            </div>

            <p className="eval-summary-text">{evaluation.summary}</p>
          </div>

          {/* Strengths & Improvements */}
          <div className="strengths-improvements-grid">
            <div className="feedback-card card-glass border-green">
              <h3 className="feedback-title title-green">
                <FaCheckCircle /> Key Strengths Observed
              </h3>
              <ul className="feedback-list">
                {(evaluation.strengths || []).map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="feedback-card card-glass border-amber">
              <h3 className="feedback-title title-amber">
                <FaLightbulb /> Areas to Elevate for Product Offers
              </h3>
              <ul className="feedback-list">
                {(evaluation.improvements || []).map((imp, idx) => (
                  <li key={idx}>{imp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detailed Question-by-Question Feedback */}
          {Array.isArray(evaluation.detailedFeedback) && evaluation.detailedFeedback.length > 0 && (
            <div className="detailed-qa-section card-glass">
              <h3 className="section-title">Question-by-Question Breakdown</h3>
              <div className="qa-feedback-list">
                {evaluation.detailedFeedback.map((item, idx) => (
                  <div key={idx} className="qa-feedback-item">
                    <div className="qa-item-header">
                      <span className="qa-num">Q{idx + 1}</span>
                      <h4 className="qa-question">{item.question}</h4>
                      <span className="qa-score-pill">{item.score || 80}/100</span>
                    </div>

                    <p className="qa-answer-quote">
                      <strong>Your Answer:</strong> {item.candidateAnswer || "[No answer provided]"}
                    </p>

                    <div className="qa-critique">
                      <strong>Interviewer Critique:</strong> {item.feedback}
                    </div>

                    {item.idealAnswerKey && (
                      <div className="qa-ideal-key">
                        <strong>Ideal Approach:</strong> {item.idealAnswerKey}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Plan */}
          {Array.isArray(evaluation.actionPlan) && evaluation.actionPlan.length > 0 && (
            <div className="action-plan-card card-glass">
              <h3 className="section-title">
                <FaAward style={{ color: "#ec4899", marginRight: "8px" }} /> Recommended 7-Day Action Plan
              </h3>
              <div className="action-plan-grid">
                {evaluation.actionPlan.map((step, idx) => (
                  <div key={idx} className="plan-step-box">
                    <span className="step-num">{idx + 1}</span>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="eval-actions-bar">
            <button
              onClick={() => {
                setStage("SETUP");
                setEvaluation(null);
                setInterviewData(null);
              }}
              className="btn btn-primary btn-large"
            >
              <FaRedo /> Practice Another Interview
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .setup-card {
          max-width: 820px;
          margin: 0 auto;
          padding: 36px;
        }

        .setup-heading {
          font-size: 1.75rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .setup-sub {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 28px;
        }

        .form-row {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }

        .flex-1 {
          flex: 1;
        }

        .upload-dropzone {
          border: 2px dashed rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-sm);
          padding: 24px;
          text-align: center;
          cursor: pointer;
          background: rgba(13, 20, 36, 0.6);
          transition: all 0.2s ease;
        }

        .upload-dropzone:hover {
          border-color: #818cf8;
          background: rgba(18, 26, 45, 0.8);
        }

        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .upload-icon {
          font-size: 1.8rem;
          color: #a5b4fc;
        }

        .file-name {
          color: #34d399;
          font-weight: 600;
        }

        .btn-large {
          font-size: 1.05rem;
        }

        .error-banner {
          max-width: 820px;
          margin: 0 auto 20px;
          padding: 16px;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Interview Room */
        .interview-room-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 24px;
          align-items: start;
        }

        .interviewer-avatar-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .avatar-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .live-pill {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 999px;
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.4);
        }

        .avatar-center {
          text-align: center;
        }

        .avatar-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: var(--grad-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
          transition: all 0.3s ease;
        }

        .avatar-speaking {
          animation: pulseGlow 1.2s infinite ease-in-out;
        }

        .avatar-icon {
          font-size: 2.5rem;
          color: white;
        }

        .avatar-status {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .status-speaking {
          color: #f472b6;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .audio-wave-bar {
          width: 3px;
          height: 12px;
          background: #f472b6;
          border-radius: 2px;
          display: inline-block;
          animation: waveJump 0.8s infinite ease-in-out;
        }
        .audio-wave-bar:nth-child(2) { animation-delay: 0.2s; height: 16px; }
        .audio-wave-bar:nth-child(3) { animation-delay: 0.4s; height: 10px; }

        @keyframes waveJump {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.3); }
        }

        .webcam-preview-box {
          width: 100%;
          height: 180px;
          background: #060911;
          border-radius: var(--radius-sm);
          overflow: hidden;
          position: relative;
          border: 1px solid var(--border-light);
        }

        .webcam-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: none;
        }

        .webcam-video.active {
          display: block;
        }

        .webcam-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #64748b;
          font-size: 0.85rem;
        }

        .media-controls-bar {
          display: flex;
          gap: 12px;
        }

        .btn-media {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #1e293b;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .btn-media:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .btn-media.active {
          background: var(--grad-primary);
          border-color: transparent;
          color: #ffffff;
        }

        .btn-media.muted {
          background: rgba(239, 68, 68, 0.2);
          color: #f87171;
        }

        /* Question Box */
        .question-card {
          padding: 32px;
        }

        .q-nav-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .q-counter {
          font-weight: 700;
          font-size: 0.95rem;
          color: #6366f1;
        }

        .current-question-text {
          font-size: 1.45rem;
          font-weight: 700;
          line-height: 1.45;
          color: #0f172a;
          margin-bottom: 16px;
        }

        .q-hint-box {
          background: #eef2ff;
          border-left: 3px solid #6366f1;
          padding: 12px 16px;
          border-radius: 0 8px 8px 0;
          font-size: 0.9rem;
          color: #334155;
          display: flex;
          gap: 10px;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .hint-icon {
          color: #f59e0b;
          font-size: 1.1rem;
          margin-top: 2px;
        }

        .answer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .answer-label {
          font-weight: 600;
          font-size: 0.95rem;
          color: #334155;
        }

        .btn-mic {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          background: rgba(236, 72, 153, 0.15);
          color: #ec4899;
          border: 1px solid rgba(236, 72, 153, 0.35);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-mic:hover {
          background: rgba(236, 72, 153, 0.25);
        }

        .mic-recording {
          background: #ec4899;
          color: white;
          animation: pulseGlow 1s infinite;
        }

        .recording-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #ec4899;
          margin-bottom: 8px;
        }

        .rec-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          animation: pulseGlow 0.8s infinite;
        }

        .answer-textarea {
          min-height: 160px;
          font-size: 1rem;
          line-height: 1.6;
        }

        .q-action-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
        }

        /* Evaluation View */
        .eval-container {
          max-width: 950px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .eval-scorecard {
          padding: 36px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .eval-header-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .eval-role-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #0f172a;
        }

        .hiring-decision-badge {
          background: var(--grad-accent);
          color: white;
          font-weight: 800;
          padding: 8px 18px;
          border-radius: var(--radius-full);
          font-size: 0.95rem;
          letter-spacing: 0.04em;
          box-shadow: 0 4px 16px rgba(236, 72, 153, 0.4);
        }

        .score-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }

        .metric-box {
          text-align: center;
        }

        .metric-circle {
          width: 84px;
          height: 84px;
          border-radius: 50%;
          margin: 0 auto 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          background: #ffffff;
        }

        .circle-overall { border-color: #ec4899; }
        .circle-tech { border-color: #6366f1; }
        .circle-comm { border-color: #10b981; }
        .circle-conf { border-color: #f59e0b; }

        .metric-val {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
        }

        .metric-name {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 600;
        }

        .eval-summary-text {
          font-size: 1rem;
          color: #334155;
          line-height: 1.7;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
        }

        .strengths-improvements-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .feedback-card {
          padding: 28px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .border-green { border-left: 4px solid #10b981; }
        .border-amber { border-left: 4px solid #f59e0b; }

        .feedback-title {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .title-green { color: #059669; }
        .title-amber { color: #d97706; }

        .feedback-list {
          list-style: none;
        }

        .feedback-list li {
          margin-bottom: 12px;
          padding-left: 20px;
          position: relative;
          color: #334155;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .feedback-list li::before {
          content: '•';
          position: absolute;
          left: 4px;
          font-size: 1.2rem;
          color: #6366f1;
        }

        .detailed-qa-section {
          padding: 32px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .section-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
        }

        .qa-feedback-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .qa-feedback-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-sm);
          padding: 20px;
        }

        .qa-item-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }

        .qa-num {
          background: #eef2ff;
          color: #4f46e5;
          font-weight: 800;
          font-size: 0.8rem;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .qa-question {
          font-size: 1.05rem;
          font-weight: 600;
          color: #0f172a;
          flex-grow: 1;
        }

        .qa-score-pill {
          font-size: 0.85rem;
          font-weight: 700;
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          padding: 3px 10px;
          border-radius: 999px;
        }

        .qa-answer-quote {
          font-size: 0.9rem;
          color: #94a3b8;
          font-style: italic;
          margin-bottom: 10px;
        }

        .qa-critique {
          font-size: 0.9rem;
          color: #cbd5e1;
          margin-bottom: 8px;
        }

        .qa-ideal-key {
          font-size: 0.88rem;
          color: #a5b4fc;
          background: rgba(99, 102, 241, 0.08);
          padding: 8px 12px;
          border-radius: 6px;
        }

        .action-plan-card {
          padding: 32px;
        }

        .action-plan-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .plan-step-box {
          background: rgba(13, 20, 36, 0.6);
          border: 1px solid var(--border-light);
          padding: 20px;
          border-radius: var(--radius-sm);
          position: relative;
        }

        .step-num {
          font-size: 1.4rem;
          font-weight: 800;
          color: #ec4899;
          display: block;
          margin-bottom: 8px;
        }

        .plan-step-box p {
          font-size: 0.9rem;
          color: #cbd5e1;
          line-height: 1.5;
        }

        .eval-actions-bar {
          text-align: center;
          margin-top: 10px;
        }

        @media (max-width: 900px) {
          .interview-room-grid {
            grid-template-columns: 1fr;
          }
          .strengths-improvements-grid {
            grid-template-columns: 1fr;
          }
          .action-plan-grid {
            grid-template-columns: 1fr;
          }
          .score-metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
