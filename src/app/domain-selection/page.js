"use client";

import React, { useState } from "react";
import {
  FaCompass,
  FaLightbulb,
  FaYoutube,
  FaPlay,
  FaSpinner,
  FaBook,
  FaGraduationCap,
  FaRedo,
  FaCheckCircle,
  FaMoneyBillWave,
  FaArrowRight
} from "react-icons/fa";

export default function DomainSelectionPage() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const samplePrompts = [
    "I love building web applications, designing user interfaces in React, and writing clean backend APIs.",
    "I have a passion for machine learning, Python, data analysis, neural networks, and generative AI models.",
    "I enjoy low-level programming, operating systems, Linux internals, microcontrollers, and IoT devices.",
    "I want to protect systems from cyber attacks, learn ethical hacking, network protocols, and cloud security."
  ];

  const handlePredict = async (statement) => {
    const textToSubmit = statement || userInput;
    if (!textToSubmit.trim()) {
      setError("Please describe your interests or select one of the sample interests below.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/domain/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: textToSubmit }),
      });

      if (!res.ok) throw new Error("Prediction failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to predict engineering domain.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper container">
      <div className="page-header">
        <span className="badge-tag">
          <FaCompass style={{ marginRight: "6px" }} /> AI Academic & Career Mapping
        </span>
        <h1 className="page-title">Engineering Domain Selection & Curriculum</h1>
        <p className="page-subtitle">
          Describe your technical interests, coding passions, or career dreams to uncover your best-fit engineering domain, placement outlook, and video courses.
        </p>
      </div>

      {/* Input Section */}
      <div className="domain-input-card card-glass">
        <label className="form-label">
          What are your technical interests, hobbies, or dream project ideas?
        </label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="e.g. I enjoy coding in Java, building REST APIs, working with MySQL databases, and solving algorithmic problems on LeetCode..."
          className="form-textarea"
          style={{ minHeight: "110px", marginBottom: "16px" }}
        />

        <div className="sample-prompts-box">
          <span className="sample-label">
            <FaLightbulb style={{ color: "#f59e0b" }} /> Try a sample interest:
          </span>
          <div className="prompt-chips">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setUserInput(p);
                  handlePredict(p);
                }}
                className="chip-btn"
              >
                {p.slice(0, 48)}...
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => handlePredict()}
          disabled={loading}
          className="btn btn-primary btn-large"
          style={{ width: "100%", marginTop: "20px" }}
        >
          {loading ? (
            <>
              <FaSpinner className="spin" /> Analyzing Your Engineering Aptitude...
            </>
          ) : (
            <>
              <FaCompass /> Predict Engineering Domain & Curriculum
            </>
          )}
        </button>

        {error && <p className="error-text">{error}</p>}
      </div>

      {/* Result Section */}
      {result && (
        <div className="result-container">
          {/* Domain Overview Banner */}
          <div className="domain-overview-card card-glass">
            <div className="domain-header-row">
              <div>
                <span className="badge-tag" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34d399", borderColor: "rgba(16, 185, 129, 0.3)" }}>
                  <FaCheckCircle style={{ marginRight: "6px" }} /> Best Match ({result.confidence || 92}%)
                </span>
                <h2 className="predicted-domain-name">{result.predictedDomain}</h2>
              </div>
              <div className="salary-badge">
                <FaMoneyBillWave style={{ marginRight: "6px" }} />
                <span>Avg Package: {result.averageSalary || "₹8 - ₹18 LPA"}</span>
              </div>
            </div>

            <p className="domain-desc">{result.domainDescription}</p>

            {Array.isArray(result.topCareerRoles) && (
              <div className="roles-row">
                <span className="roles-label">Target Placement Roles:</span>
                <div className="role-tags">
                  {result.topCareerRoles.map((r, i) => (
                    <span key={i} className="pill-chip role-pill">{r}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Core Semester Subjects & Video Courses */}
          <div className="subjects-section">
            <div className="section-header">
              <h3 className="section-heading">
                <FaBook style={{ color: "#818cf8", marginRight: "10px" }} /> Recommended Semester Subjects & Courses
              </h3>
              <p className="section-sub">
                Key subjects tested during campus recruitment technical rounds, coupled with video lessons.
              </p>
            </div>

            <div className="subjects-grid">
              {(result.subjects || []).map((sub, idx) => {
                const searchLink = `https://www.youtube.com/results?search_query=${encodeURIComponent(
                  sub.searchQuery || `${sub.subjectName} Full Course ${sub.videoChannel || ""}`
                )}`;

                return (
                  <div key={idx} className="subject-card card-glass">
                    <div className="subject-card-header">
                      <span className="sub-index">0{idx + 1}</span>
                      <div>
                        <h4 className="subject-title">{sub.subjectName}</h4>
                        <span className="subject-sem">{sub.semester || "Core Curriculum"}</span>
                      </div>
                    </div>

                    <p className="subject-desc">{sub.description}</p>

                    {sub.keyTopics && (
                      <div className="key-topics-box">
                        <strong>Key Focus Topics:</strong>
                        <p>{sub.keyTopics}</p>
                      </div>
                    )}

                    {/* YouTube Video Recommendation */}
                    <div className="video-box">
                      <div className="video-meta">
                        <FaYoutube className="yt-icon" />
                        <span className="yt-channel">{sub.videoChannel || "Recommended Tutorial"}</span>
                      </div>
                      <h5 className="video-title">{sub.videoTitle || `${sub.subjectName} Complete Lecture Series`}</h5>

                      <a
                        href={searchLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary video-btn"
                      >
                        <FaPlay style={{ fontSize: "0.8rem", color: "#f43f5e" }} /> Watch Course on YouTube
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Learning Roadmap */}
          {Array.isArray(result.learningRoadmap) && result.learningRoadmap.length > 0 && (
            <div className="roadmap-card card-glass">
              <h3 className="section-heading" style={{ marginBottom: "20px" }}>
                <FaGraduationCap style={{ color: "#ec4899", marginRight: "10px" }} /> Placement Roadmap Phases
              </h3>
              <div className="roadmap-phases-grid">
                {result.learningRoadmap.map((phase, i) => (
                  <div key={i} className="phase-card">
                    <span className="phase-num">Phase {i + 1}</span>
                    <p>{phase}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <button
              onClick={() => {
                setResult(null);
                setUserInput("");
              }}
              className="btn btn-secondary btn-large"
            >
              <FaRedo /> Test Another Engineering Interest
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .domain-input-card {
          max-width: 860px;
          margin: 0 auto 40px;
          padding: 32px;
        }

        .sample-prompts-box {
          margin-top: 14px;
        }

        .sample-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .prompt-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chip-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          color: #cbd5e1;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .chip-btn:hover {
          background: rgba(99, 102, 241, 0.2);
          border-color: rgba(99, 102, 241, 0.4);
          color: #ffffff;
        }

        .error-text {
          color: #f87171;
          font-size: 0.9rem;
          margin-top: 12px;
        }

        /* Result View */
        .result-container {
          max-width: 1040px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .domain-overview-card {
          padding: 36px;
        }

        .domain-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .predicted-domain-name {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0f172a;
          margin-top: 8px;
          letter-spacing: -0.02em;
        }

        .salary-badge {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          background: #ecfdf5;
          color: #059669;
          font-weight: 700;
          font-size: 0.95rem;
          border: 1px solid #a7f3d0;
        }

        .domain-desc {
          color: #334155;
          font-size: 1.05rem;
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .roles-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          border-top: 1px solid #e2e8f0;
          padding-top: 18px;
        }

        .roles-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .role-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .role-pill {
          background: #eef2ff;
          color: #4338ca;
          border: 1px solid #c7d2fe;
          font-size: 0.85rem;
          padding: 4px 12px;
        }

        .subjects-section {
          margin-top: 8px;
        }

        .section-heading {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
        }

        .section-sub {
          color: #64748b;
          font-size: 0.95rem;
          margin-bottom: 24px;
        }

        .subjects-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .subject-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .subject-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 14px;
        }

        .sub-index {
          font-size: 1.3rem;
          font-weight: 800;
          color: #4f46e5;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .subject-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
        }

        .subject-sem {
          font-size: 0.78rem;
          color: #64748b;
          font-weight: 600;
        }

        .subject-desc {
          color: #334155;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .key-topics-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.85rem;
          color: #475569;
          margin-bottom: 18px;
        }

        .key-topics-box strong {
          color: #0f172a;
        }

        .video-box {
          margin-top: auto;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 14px;
        }

        .video-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .yt-icon {
          color: #ef4444;
          font-size: 1.1rem;
        }

        .yt-channel {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 600;
        }

        .video-title {
          font-size: 0.9rem;
          color: #0f172a;
          font-weight: 600;
          margin-bottom: 12px;
          line-height: 1.4;
        }

        .video-btn {
          width: 100%;
          font-size: 0.85rem;
          padding: 8px 12px;
        }

        .roadmap-card {
          padding: 32px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .roadmap-phases-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .phase-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 20px;
        }

        .phase-num {
          font-weight: 800;
          color: #ec4899;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 8px;
        }

        .phase-card p {
          color: #334155;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .subjects-grid {
            grid-template-columns: 1fr;
          }
          .roadmap-phases-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
