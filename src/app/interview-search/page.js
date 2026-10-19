"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaBriefcase,
  FaBuilding,
  FaCheckCircle,
  FaLightbulb,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaCode,
  FaChevronDown,
  FaChevronUp,
  FaBolt,
  FaCog,
  FaLayerGroup
} from "react-icons/fa";

export default function InterviewSearchPage() {
  const [company, setCompany] = useState("Google");
  const [customCompany, setCustomCompany] = useState("");
  const [role, setRole] = useState("Software Development Engineer");
  const [topic, setTopic] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiSource, setApiSource] = useState("");
  const [isDynamic, setIsDynamic] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const toggleQuestion = (expId, qIdx) => {
    const key = `${expId}-${qIdx}`;
    setExpandedQuestions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const fetchExperiences = async (overrideCompany = null) => {
    setLoading(true);
    const targetComp = overrideCompany || (customCompany.trim() ? customCompany.trim() : company);

    try {
      const res = await fetch("/api/interviews/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: targetComp,
          role,
          difficulty,
          topic,
          searchQuery,
        }),
      });

      const data = await res.json();
      setExperiences(data.experiences || []);
      setApiSource(data.source || "");
      setIsDynamic(Boolean(data.isDynamic));

      // Auto expand first question
      if (data.experiences?.[0]?.questions?.[0]) {
        setExpandedQuestions({ "exp-1-0": true, "0-0": true });
      }
    } catch (e) {
      console.error("Failed to load interview questions:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [company, difficulty, topic]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExperiences();
  };

  return (
    <div className="page-wrapper container">
      <div className="page-header">
        <span className="badge-tag">
          <FaBolt style={{ marginRight: "6px", color: "#ec4899" }} /> Live AI Placement Question Bank
        </span>
        <h1 className="page-title">Company Interview Archives & Questions</h1>
        <p className="page-subtitle">
          Real technical questions, coding problems, and round-by-round assessment breakdowns fetched dynamically via AI API for any target firm.
        </p>
      </div>

      {/* Dynamic API Source Indicator Banner */}
      <div className="api-status-banner card-glass">
        <div className="status-badge-wrap">
          <span className={`status-pill ${isDynamic ? "live-ai" : "archived"}`}>
            {isDynamic ? "⚡ Live Groq AI Generated" : "📁 Repository Archive"}
          </span>
          <span className="status-text">{apiSource}</span>
        </div>
        <Link href="/settings" className="settings-shortcut-btn">
          <FaCog /> Change / Manage API Key
        </Link>
      </div>

      {/* Search & Filter Card */}
      <form onSubmit={handleSearchSubmit} className="search-filter-card card-glass">
        <div className="search-row">
          <div className="search-input-wrap">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search company (e.g. Google, Amazon, TCS, Zoho, Atlassian) or topic (e.g. Dynamic Programming, LRU Cache)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-search-action" disabled={loading}>
            {loading ? <FaSpinner className="spin" /> : <FaBolt />} Fetch Questions via API
          </button>
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">Target Company</label>
            <select
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
                setCustomCompany("");
              }}
              className="clean-select"
            >
              <option value="All">All Top Tech Companies</option>
              <option value="Google">Google</option>
              <option value="Amazon">Amazon</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Meta">Meta</option>
              <option value="Apple">Apple</option>
              <option value="TCS">TCS Digital / Prime</option>
              <option value="Infosys">Infosys Specialist Programmer</option>
              <option value="Zoho">Zoho Corporation</option>
              <option value="Accenture">Accenture</option>
              <option value="Goldman Sachs">Goldman Sachs</option>
              <option value="Custom">Custom Company Name...</option>
            </select>
          </div>

          {company === "Custom" && (
            <div className="filter-group">
              <label className="filter-label">Custom Company</label>
              <input
                type="text"
                placeholder="Type any company name..."
                value={customCompany}
                onChange={(e) => setCustomCompany(e.target.value)}
                className="clean-select"
              />
            </div>
          )}

          <div className="filter-group">
            <label className="filter-label">Focus Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="clean-select"
            >
              <option value="All">All Technical Areas</option>
              <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
              <option value="System Design">System Design & Architecture</option>
              <option value="Operating Systems & Networking">Operating Systems & Networking</option>
              <option value="DBMS & SQL">DBMS & SQL</option>
              <option value="Full Stack & Frontend">Full Stack & Frontend</option>
              <option value="Behavioral & Leadership">Behavioral & Leadership</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="clean-select"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy (Campus Standard)</option>
              <option value="Medium">Medium (Product Standard)</option>
              <option value="Hard">Hard (Tier-1 Advanced)</option>
            </select>
          </div>
        </div>
      </form>

      {/* Experience & Question Cards */}
      <div className="experiences-list">
        {loading ? (
          <div className="loading-container card-glass">
            <FaSpinner className="spin loading-icon" />
            <h3 className="loading-title">Generating Real-Time Placement Questions...</h3>
            <p className="loading-desc">
              Querying AI API for authentic technical rounds and problem statements.
            </p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="empty-container card-glass">
            <FaBuilding style={{ fontSize: "2.5rem", color: "#94a3b8", marginBottom: "12px" }} />
            <h3>No interview experiences found for this query</h3>
            <p>Try searching for a different company or topic, or click Fetch Questions to generate new questions.</p>
          </div>
        ) : (
          experiences.map((exp, expIdx) => {
            const expId = exp.id || expIdx;
            return (
              <div key={expId} className="exp-card card-glass">
                {/* Header */}
                <div className="exp-card-header">
                  <div className="company-badge-row">
                    <span className="company-pill">
                      <FaBuilding style={{ marginRight: "6px" }} /> {exp.company}
                    </span>
                    <span className={`diff-pill diff-${(exp.difficulty || "medium").toLowerCase().replace(/[^a-z]/g, "")}`}>
                      {exp.difficulty || "Medium"}
                    </span>
                    {exp.date && <span className="date-pill">{exp.date}</span>}
                    {exp.offerStatus && (
                      <span className="status-offered">
                        <FaCheckCircle style={{ marginRight: "4px" }} /> {exp.offerStatus}
                      </span>
                    )}
                  </div>
                  <h2 className="exp-role-title">{exp.role}</h2>
                  {exp.rounds && typeof exp.rounds === "string" && (
                    <p className="rounds-summary-text">
                      <FaLayerGroup style={{ marginRight: "6px", color: "#6366f1" }} />
                      <strong>Rounds:</strong> {exp.rounds}
                    </p>
                  )}
                </div>

                {/* Process Overview */}
                {exp.process && (
                  <div className="process-overview-box">
                    <h4 className="section-label">Hiring Process Overview:</h4>
                    <p>{exp.process}</p>
                  </div>
                )}

                {/* Legacy Structured Rounds (if available) */}
                {Array.isArray(exp.rounds) && (
                  <div className="rounds-container">
                    <h4 className="section-label">Assessment & Technical Rounds:</h4>
                    <div className="rounds-timeline">
                      {exp.rounds.map((round, rIdx) => (
                        <div key={rIdx} className="round-item">
                          <div className="round-dot" />
                          <div className="round-body">
                            <span className="round-name">{round.roundName}</span>
                            <p className="round-details">{round.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specific Real-Time Questions List */}
                {Array.isArray(exp.questions) && exp.questions.length > 0 && (
                  <div className="questions-section">
                    <h4 className="section-label">Specific Technical Questions Asked:</h4>
                    <div className="questions-grid">
                      {exp.questions.map((q, qIdx) => {
                        const isExpanded = expandedQuestions[`${expId}-${qIdx}`];
                        const qTitle = typeof q === "string" ? q : q.title;
                        const qDesc = typeof q === "object" ? q.description : null;
                        const qApproach = typeof q === "object" ? q.approach : null;
                        const qSolution = typeof q === "object" ? q.solution : null;
                        const qFollowUp = typeof q === "object" ? q.followUp : null;
                        const qCat = typeof q === "object" ? q.category : "Technical";

                        return (
                          <div key={qIdx} className={`question-accordion-item ${isExpanded ? "open" : ""}`}>
                            <button
                              type="button"
                              className="question-header-btn"
                              onClick={() => toggleQuestion(expId, qIdx)}
                            >
                              <div className="q-left">
                                <span className="q-badge">Q{qIdx + 1}</span>
                                <span className="q-category-tag">{qCat}</span>
                                <span className="q-title-text">{qTitle}</span>
                              </div>
                              <span className="q-toggle-icon">
                                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                              </span>
                            </button>

                            {isExpanded && (
                              <div className="question-content-body">
                                {qDesc && (
                                  <div className="q-desc-box">
                                    <span className="q-sub-title">Problem Statement:</span>
                                    <p>{qDesc}</p>
                                  </div>
                                )}

                                {qApproach && (
                                  <div className="q-approach-box">
                                    <span className="q-sub-title">Optimal Approach & Complexity:</span>
                                    <p>{qApproach}</p>
                                  </div>
                                )}

                                {qSolution && (
                                  <div className="q-solution-box">
                                    <span className="q-sub-title">
                                      <FaCode style={{ marginRight: "6px" }} /> Solution Concept / Implementation Logic:
                                    </span>
                                    <pre className="code-block">{qSolution}</pre>
                                  </div>
                                )}

                                {qFollowUp && (
                                  <div className="q-followup-box">
                                    <span className="q-sub-title">Interviewer Follow-Up:</span>
                                    <p>{qFollowUp}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Candidate Tips */}
                {exp.tips && (
                  <div className="tips-box">
                    <FaLightbulb className="tips-icon" />
                    <div>
                      <strong>Preparation Tips:</strong>{" "}
                      {Array.isArray(exp.tips) ? (
                        <ul className="tips-list">
                          {exp.tips.map((t, tIdx) => (
                            <li key={tIdx}>{t}</li>
                          ))}
                        </ul>
                      ) : (
                        exp.tips
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <style jsx>{`
        .api-status-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          margin-bottom: 24px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          gap: 16px;
        }

        .status-badge-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .status-pill {
          font-size: 0.78rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 999px;
          letter-spacing: 0.04em;
        }

        .status-pill.live-ai {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }

        .status-pill.archived {
          background: #f1f5f9;
          color: #64748b;
          border: 1px solid #cbd5e1;
        }

        .status-text {
          font-size: 0.88rem;
          color: #475569;
          font-weight: 500;
        }

        .settings-shortcut-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #6366f1;
          white-space: nowrap;
        }

        .settings-shortcut-btn:hover {
          color: #4f46e5;
          text-decoration: underline;
        }

        .search-filter-card {
          padding: 24px 28px;
          margin-bottom: 32px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .search-row {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .search-input-wrap {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          color: #94a3b8;
          font-size: 1rem;
        }

        .search-input {
          width: 100%;
          padding: 13px 16px 13px 44px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: var(--radius-sm);
          font-size: 0.95rem;
          color: #0f172a;
          outline: none;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          border-color: #6366f1;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }

        .btn-search-action {
          padding: 13px 24px;
          white-space: nowrap;
          font-size: 0.95rem;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .filter-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 6px;
        }

        .clean-select {
          width: 100%;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .clean-select:focus {
          border-color: #6366f1;
        }

        .experiences-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .exp-card {
          padding: 32px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .company-badge-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .company-pill {
          background: var(--grad-primary);
          color: white;
          font-weight: 700;
          padding: 4px 14px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
        }

        .diff-pill {
          font-size: 0.78rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
        }

        .diff-easy {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }

        .diff-medium {
          background: #fffbeb;
          color: #d97706;
          border: 1px solid #fde68a;
        }

        .diff-hard {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .date-pill {
          font-size: 0.78rem;
          color: #64748b;
          background: #f1f5f9;
          padding: 3px 10px;
          border-radius: 999px;
        }

        .status-offered {
          font-size: 0.78rem;
          font-weight: 700;
          color: #059669;
          display: flex;
          align-items: center;
        }

        .exp-role-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .rounds-summary-text {
          font-size: 0.9rem;
          color: #475569;
          display: flex;
          align-items: center;
        }

        .section-label {
          font-size: 0.92rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .process-overview-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 16px 20px;
          margin: 18px 0;
          font-size: 0.92rem;
          color: #334155;
          line-height: 1.6;
        }

        /* Timeline for Legacy format */
        .rounds-container {
          margin: 20px 0;
        }

        .rounds-timeline {
          display: flex;
          flex-direction: column;
          gap: 14px;
          border-left: 2px solid #e2e8f0;
          margin-left: 8px;
          padding-left: 20px;
        }

        .round-item {
          position: relative;
        }

        .round-dot {
          position: absolute;
          left: -26px;
          top: 4px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #6366f1;
          border: 2px solid #ffffff;
        }

        .round-name {
          font-weight: 700;
          font-size: 0.95rem;
          color: #0f172a;
          display: block;
          margin-bottom: 4px;
        }

        .round-details {
          color: #475569;
          font-size: 0.88rem;
          line-height: 1.5;
        }

        /* Interactive Accordion for Questions */
        .questions-section {
          margin: 24px 0;
        }

        .questions-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .question-accordion-item {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
          background: #f8fafc;
          transition: all 0.2s ease;
        }

        .question-accordion-item.open {
          border-color: #cbd5e1;
          background: #ffffff;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
        }

        .question-header-btn {
          width: 100%;
          padding: 14px 18px;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          cursor: pointer;
          gap: 12px;
        }

        .q-left {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .q-badge {
          background: #eef2ff;
          color: #4f46e5;
          font-weight: 800;
          font-size: 0.75rem;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .q-category-tag {
          font-size: 0.75rem;
          font-weight: 700;
          background: #f1f5f9;
          color: #475569;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .q-title-text {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
        }

        .q-toggle-icon {
          color: #64748b;
          font-size: 0.85rem;
        }

        .question-content-body {
          padding: 18px 20px;
          border-top: 1px solid #e2e8f0;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .q-sub-title {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #64748b;
          margin-bottom: 4px;
        }

        .q-desc-box p,
        .q-approach-box p,
        .q-followup-box p {
          font-size: 0.92rem;
          color: #334155;
          line-height: 1.6;
          margin: 0;
        }

        .q-approach-box {
          background: #f8fafc;
          padding: 12px 16px;
          border-radius: 8px;
          border-left: 3px solid #6366f1;
        }

        .code-block {
          background: #0f172a;
          color: #f8fafc;
          padding: 14px 16px;
          border-radius: 8px;
          font-family: var(--font-mono);
          font-size: 0.88rem;
          line-height: 1.5;
          overflow-x: auto;
          margin: 0;
        }

        .q-followup-box {
          background: #fffbeb;
          padding: 10px 14px;
          border-radius: 8px;
          border-left: 3px solid #f59e0b;
        }

        /* Tips */
        .tips-box {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 10px;
          padding: 14px 18px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 0.9rem;
          color: #92400e;
          margin-top: 20px;
        }

        .tips-icon {
          color: #d97706;
          font-size: 1.2rem;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .tips-list {
          padding-left: 20px;
          margin-top: 6px;
        }

        .tips-list li {
          margin-bottom: 4px;
        }

        .loading-container,
        .empty-container {
          padding: 60px 24px;
          text-align: center;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .loading-icon {
          font-size: 2.5rem;
          color: #6366f1;
          margin-bottom: 16px;
        }

        .loading-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 6px;
        }

        .loading-desc {
          color: #64748b;
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .search-row {
            flex-direction: column;
          }
          .btn-search-action {
            width: 100%;
          }
          .api-status-banner {
            flex-direction: column;
            align-items: flex-start;
          }
          .exp-card {
            padding: 20px 16px;
          }
        }
      `}</style>
    </div>
  );
}
