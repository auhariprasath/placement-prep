"use client";

import React, { useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUpload,
  FaFileAlt,
  FaSpinner,
  FaLightbulb,
  FaRedo,
  FaArrowRight
} from "react-icons/fa";

export default function ResumeMatcherPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const sampleJD = `Software Development Engineer (SDE-1)
Requirements:
- Strong foundations in Data Structures, Algorithms, and Object-Oriented Programming (Java / C++).
- Hands-on experience developing RESTful APIs with Spring Boot or Node.js.
- Knowledge of relational databases (MySQL, PostgreSQL) including query optimization and indexing.
- Familiarity with Git version control, Docker containers, and CI/CD pipelines.
- Bachelor's degree in Computer Science, IT, or related engineering discipline.`;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume content or upload a resume file.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/resume-matcher/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper container">
      <div className="page-header">
        <span className="badge-tag">
          <FaCheckCircle style={{ marginRight: "6px" }} /> ATS Resume Scanner & Optimizer
        </span>
        <h1 className="page-title">ATS Resume Matcher vs Job Description</h1>
        <p className="page-subtitle">
          Test your resume against modern Applicant Tracking System algorithms. Discover your keyword match score and recruiter-approved bullet point improvements.
        </p>
      </div>

      {/* Input Section */}
      <div className="matcher-input-grid">
        <div className="input-panel card-glass">
          <h2 className="panel-title">1. Your Resume</h2>
          <div className="upload-dropzone">
            <input
              type="file"
              id="resume-ats-file"
              accept=".txt,.pdf,.docx"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <label htmlFor="resume-ats-file" className="upload-label">
              <FaUpload className="upload-icon" />
              {fileName ? (
                <span className="file-name"><FaFileAlt /> {fileName}</span>
              ) : (
                <span>Upload resume (.pdf, .txt) or drag & drop</span>
              )}
            </label>
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Or paste your resume text here..."
            className="form-textarea panel-textarea"
          />
        </div>

        <div className="input-panel card-glass">
          <div className="panel-header-row">
            <h2 className="panel-title">2. Target Job Description</h2>
            <button
              type="button"
              onClick={() => setJobDescription(sampleJD)}
              className="btn btn-secondary load-sample-btn"
            >
              Load Sample SDE-1 JD
            </button>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description from LinkedIn, Glassdoor, or campus placement drive..."
            className="form-textarea panel-textarea full-height"
          />
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "24px", marginBottom: "40px" }}>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="btn btn-primary btn-large"
          style={{ padding: "14px 36px", fontSize: "1.1rem" }}
        >
          {loading ? (
            <>
              <FaSpinner className="spin" /> Scanning Resume with ATS Algorithm...
            </>
          ) : (
            <>
              <FaCheckCircle /> Scan Resume Against Job Description
            </>
          )}
        </button>

        {error && <p className="error-text">{error}</p>}
      </div>

      {/* Analysis Results */}
      {result && (
        <div className="analysis-result-container">
          {/* Top Scorecard */}
          <div className="scorecard-card card-glass">
            <div className="score-top-row">
              <div className="score-gauge-box">
                <span className="score-number">{result.matchScore}%</span>
                <span className="score-gauge-label">ATS Match Score</span>
              </div>
              <div className="score-summary-col">
                <span className="badge-tag" style={{ background: result.matchScore >= 75 ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)", color: result.matchScore >= 75 ? "#34d399" : "#fbbf24" }}>
                  {result.matchScore >= 75 ? "Strong ATS Alignment" : "Optimization Recommended"}
                </span>
                <h3 className="score-summary-title">Recruiter Profile Assessment</h3>
                <p className="score-summary-desc">{result.summary}</p>
              </div>
            </div>

            {/* Sub Scores */}
            <div className="sub-scores-row">
              <div className="sub-score-item">
                <span className="sub-val">{result.formattingScore || 85}%</span>
                <span className="sub-label">Format Parsability</span>
              </div>
              <div className="sub-score-item">
                <span className="sub-val">{result.readabilityScore || 90}%</span>
                <span className="sub-label">Recruiter Readability</span>
              </div>
              <div className="sub-score-item">
                <span className="sub-val">{result.matchedSkills?.length || 0}</span>
                <span className="sub-label">Matching Keywords</span>
              </div>
              <div className="sub-score-item">
                <span className="sub-val" style={{ color: "#f87171" }}>{result.missingSkills?.length || 0}</span>
                <span className="sub-label">Missing Critical Skills</span>
              </div>
            </div>
          </div>

          {/* Skills Breakdown Grid */}
          <div className="skills-breakdown-grid">
            <div className="skills-col card-glass border-green">
              <h3 className="col-heading text-green">
                <FaCheckCircle /> Matched Keywords Found ({result.matchedSkills?.length || 0})
              </h3>
              <div className="skills-pill-wrap">
                {(result.matchedSkills || []).map((skill, i) => (
                  <span key={i} className="skill-chip chip-matched">{skill}</span>
                ))}
              </div>
            </div>

            <div className="skills-col card-glass border-red">
              <h3 className="col-heading text-red">
                <FaTimesCircle /> Missing Skills to Add ({result.missingSkills?.length || 0})
              </h3>
              <div className="skills-pill-wrap">
                {(result.missingSkills || []).map((skill, i) => (
                  <span key={i} className="skill-chip chip-missing">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Recruiter Bullet Point Rewrites */}
          {Array.isArray(result.bulletPointImprovements) && result.bulletPointImprovements.length > 0 && (
            <div className="bullet-rewrite-card card-glass">
              <h3 className="section-heading">
                <FaLightbulb style={{ color: "#f59e0b", marginRight: "10px" }} />
                High-Impact Bullet Point Rewrites (STAR Method)
              </h3>
              <div className="rewrites-list">
                {result.bulletPointImprovements.map((item, idx) => (
                  <div key={idx} className="rewrite-item">
                    <div className="rewrite-before">
                      <span className="tag-before">Before (Passive)</span>
                      <p>{item.original}</p>
                    </div>
                    <div className="rewrite-after">
                      <span className="tag-after">Optimized for ATS & Recruiter</span>
                      <p>{item.improved}</p>
                    </div>
                    {item.reason && <p className="rewrite-reason">💡 {item.reason}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ATS Compliance Checklist */}
          {Array.isArray(result.atsChecklist) && (
            <div className="checklist-card card-glass">
              <h3 className="section-heading">ATS Compliance Checklist</h3>
              <div className="checklist-grid">
                {result.atsChecklist.map((c, i) => (
                  <div key={i} className="check-item">
                    {c.passed ? (
                      <FaCheckCircle className="icon-pass" />
                    ) : (
                      <FaTimesCircle className="icon-fail" />
                    )}
                    <span>{c.check}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .matcher-input-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .input-panel {
          padding: 28px;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .panel-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 16px;
        }

        .panel-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .load-sample-btn {
          font-size: 0.75rem;
          padding: 4px 10px;
        }

        .upload-dropzone {
          border: 2px dashed #cbd5e1;
          border-radius: var(--radius-sm);
          padding: 16px;
          text-align: center;
          cursor: pointer;
          background: #f8fafc;
          margin-bottom: 14px;
        }

        .upload-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          color: #475569;
          font-size: 0.85rem;
        }

        .upload-icon {
          color: #6366f1;
          font-size: 1.2rem;
        }

        .file-name {
          color: #059669;
          font-weight: 600;
        }

        .panel-textarea {
          flex: 1;
          min-height: 220px;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .full-height {
          min-height: 310px;
        }

        .error-text {
          color: #dc2626;
          font-size: 0.9rem;
          margin-top: 12px;
        }

        /* Result */
        .analysis-result-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 1040px;
          margin: 0 auto;
        }

        .scorecard-card {
          padding: 36px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .score-top-row {
          display: flex;
          align-items: center;
          gap: 32px;
          margin-bottom: 28px;
        }

        .score-gauge-box {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: #f8fafc;
          border: 4px solid #6366f1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.15);
        }

        .score-number {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0f172a;
        }

        .score-gauge-label {
          font-size: 0.7rem;
          font-weight: 600;
          color: #6366f1;
        }

        .score-summary-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #0f172a;
          margin: 8px 0;
        }

        .score-summary-desc {
          color: #475569;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .sub-scores-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 20px;
          text-align: center;
        }

        .sub-val {
          display: block;
          font-size: 1.4rem;
          font-weight: 800;
          color: #ffffff;
        }

        .sub-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .skills-breakdown-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .skills-col {
          padding: 24px;
        }

        .border-green { border-left: 4px solid #10b981; }
        .border-red { border-left: 4px solid #ef4444; }

        .col-heading {
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .text-green { color: #34d399; }
        .text-red { color: #f87171; }

        .skills-pill-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .skill-chip {
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .chip-matched {
          background: rgba(16, 185, 129, 0.15);
          color: #6ee7b7;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .chip-missing {
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .bullet-rewrite-card {
          padding: 32px;
        }

        .section-heading {
          font-size: 1.3rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
        }

        .rewrites-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .rewrite-item {
          background: rgba(13, 20, 36, 0.7);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          padding: 20px;
        }

        .rewrite-before {
          margin-bottom: 12px;
        }

        .tag-before {
          font-size: 0.7rem;
          font-weight: 700;
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          padding: 2px 8px;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 4px;
        }

        .rewrite-before p {
          color: #94a3b8;
          font-size: 0.9rem;
          text-decoration: line-through;
        }

        .tag-after {
          font-size: 0.7rem;
          font-weight: 700;
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          padding: 2px 8px;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 4px;
        }

        .rewrite-after p {
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 500;
          line-height: 1.5;
        }

        .rewrite-reason {
          font-size: 0.85rem;
          color: #a5b4fc;
          margin-top: 8px;
        }

        .checklist-card {
          padding: 28px;
        }

        .checklist-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .check-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: #cbd5e1;
        }

        .icon-pass { color: #34d399; font-size: 1.1rem; }
        .icon-fail { color: #f87171; font-size: 1.1rem; }

        @media (max-width: 768px) {
          .matcher-input-grid {
            grid-template-columns: 1fr;
          }
          .skills-breakdown-grid {
            grid-template-columns: 1fr;
          }
          .score-top-row {
            flex-direction: column;
            text-align: center;
          }
          .sub-scores-row {
            grid-template-columns: repeat(2, 1fr);
          }
          .checklist-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
