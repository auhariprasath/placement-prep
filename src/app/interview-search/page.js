"use client";

import React, { useState, useEffect } from "react";
import {
  FaBriefcase,
  FaBuilding,
  FaCheckCircle,
  FaLightbulb,
  FaStar,
  FaFilter,
  FaSpinner
} from "react-icons/fa";

export default function InterviewSearchPage() {
  const [company, setCompany] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/interviews/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, difficulty }),
      });
      const data = await res.json();
      setExperiences(data.experiences || []);
    } catch (e) {
      console.error("Failed to load interview archives:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [company, difficulty]);

  return (
    <div className="page-wrapper container">
      <div className="page-header">
        <span className="badge-tag">
          <FaBriefcase style={{ marginRight: "6px" }} /> Placement Interview Question Bank
        </span>
        <h1 className="page-title">Company Interview Archives & Experiences</h1>
        <p className="page-subtitle">
          Real technical questions, round-by-round assessments, and preparation advice from candidates who cleared top tech companies.
        </p>
      </div>

      {/* Filters */}
      <div className="filter-card card-glass">
        <div className="filters-row">
          <div className="filter-group">
            <label className="filter-label">Filter by Company</label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="clean-select"
            >
              <option value="All">All Companies</option>
              <option value="Google">Google</option>
              <option value="Amazon">Amazon</option>
              <option value="Microsoft">Microsoft</option>
              <option value="TCS">TCS Digital</option>
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
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Experience Cards */}
      <div className="experiences-list">
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <FaSpinner className="spin" style={{ fontSize: "2rem", color: "#818cf8" }} />
          </div>
        ) : (
          experiences.map((exp) => (
            <div key={exp.id} className="exp-card card-glass">
              <div className="exp-card-header">
                <div>
                  <div className="company-badge-row">
                    <span className="company-pill">
                      <FaBuilding style={{ marginRight: "5px" }} /> {exp.company}
                    </span>
                    <span className={`diff-pill diff-${exp.difficulty.toLowerCase().replace(/[^a-z]/g, "")}`}>
                      {exp.difficulty}
                    </span>
                    <span className="status-offered">
                      <FaCheckCircle style={{ marginRight: "4px" }} /> {exp.offerStatus}
                    </span>
                  </div>
                  <h3 className="exp-role-title">{exp.role}</h3>
                </div>
              </div>

              {/* Rounds Breakdown */}
              <div className="rounds-container">
                <h4 className="rounds-heading">Assessment & Technical Rounds:</h4>
                <div className="rounds-timeline">
                  {(exp.rounds || []).map((round, rIdx) => (
                    <div key={rIdx} className="round-item">
                      <div className="round-dot"></div>
                      <div className="round-body">
                        <span className="round-name">{round.roundName}</span>
                        <p className="round-details">{round.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proven Tips */}
              {exp.tips && (
                <div className="tips-box">
                  <FaLightbulb style={{ color: "#f59e0b", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong>Candidate's Key Advice:</strong> {exp.tips}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .filter-card {
          padding: 20px 24px;
          margin-bottom: 32px;
        }

        .filters-row {
          display: flex;
          gap: 20px;
        }

        .filter-group {
          flex: 1;
        }

        .filter-label {
          display: block;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 6px;
          font-weight: 600;
        }

        .clean-select {
          width: 100%;
          background: rgba(13, 20, 36, 0.7);
          border: 1px solid var(--border-light);
          color: white;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          outline: none;
        }

        .clean-select option {
          background: #090d16;
        }

        .experiences-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .exp-card {
          padding: 32px;
        }

        .company-badge-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .company-pill {
          background: var(--grad-primary);
          color: white;
          font-weight: 700;
          padding: 3px 12px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          display: flex;
          align-items: center;
        }

        .diff-pill {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 999px;
        }

        .diff-medium { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
        .diff-hard { background: rgba(239, 68, 68, 0.15); color: #f87171; }
        .diff-mediumhard { background: rgba(236, 72, 153, 0.15); color: #f472b6; }

        .status-offered {
          font-size: 0.75rem;
          font-weight: 700;
          color: #34d399;
          display: flex;
          align-items: center;
        }

        .exp-role-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #ffffff;
        }

        .rounds-container {
          margin: 20px 0;
        }

        .rounds-heading {
          font-size: 0.95rem;
          font-weight: 700;
          color: #cbd5e1;
          margin-bottom: 14px;
        }

        .rounds-timeline {
          display: flex;
          flex-direction: column;
          gap: 14px;
          border-left: 2px solid rgba(99, 102, 241, 0.3);
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
          background: #818cf8;
          border: 2px solid #090d16;
        }

        .round-name {
          font-weight: 700;
          font-size: 0.95rem;
          color: #ffffff;
          display: block;
          margin-bottom: 4px;
        }

        .round-details {
          color: var(--text-secondary);
          font-size: 0.88rem;
          line-height: 1.5;
        }

        .tips-box {
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: 8px;
          padding: 14px 18px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.9rem;
          color: #fde68a;
        }
      `}</style>
    </div>
  );
}
