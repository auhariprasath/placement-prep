"use client";

import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaBook,
  FaCheckCircle,
  FaSpinner,
  FaLightbulb,
  FaRedo,
  FaCheck,
  FaArrowRight,
  FaExternalLinkAlt
} from "react-icons/fa";

export default function StudyPlannerPage() {
  const [formData, setFormData] = useState({
    subject: "Data Structures & Algorithms",
    durationDays: 30,
    hoursPerDay: 4,
    difficultyLevel: "intermediate",
    targetGoal: "Cracking Top Product Company Placements",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [completedDays, setCompletedDays] = useState({});

  // Auto-generate on quick submit or check query params
  const handleGenerate = async (customPayload) => {
    const payload = customPayload || formData;
    if (!payload.subject.trim()) {
      setError("Please provide a subject or technology name.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/study-planner/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to generate plan");
      const data = await res.json();
      setResult(data);
      setCompletedDays({});
    } catch (err) {
      setError(err.message || "Failed to generate study plan.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDayCompletion = (dayNum) => {
    setCompletedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum],
    }));
  };

  const totalPlans = result?.dailyPlans?.length || 0;
  const completedCount = Object.values(completedDays).filter(Boolean).length;
  const progressPct = totalPlans > 0 ? Math.round((completedCount / totalPlans) * 100) : 0;

  return (
    <div className="page-wrapper container">
      <div className="page-header">
        <span className="badge-tag">
          <FaCalendarAlt style={{ marginRight: "6px" }} /> AI Curriculum Engine
        </span>
        <h1 className="page-title">Personalized Placement Study Planner</h1>
        <p className="page-subtitle">
          Generate an intelligent, topic-specific daily preparation roadmap tailored to your timeline, daily hours, and target company standards.
        </p>
      </div>

      {/* Form Card */}
      <div className="planner-form-card card-glass">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Subject / Topic to Master</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g. Data Structures & Algorithms, Java Spring Boot, System Design"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Goal / Company Type</label>
            <input
              type="text"
              value={formData.targetGoal}
              onChange={(e) => setFormData({ ...formData, targetGoal: e.target.value })}
              placeholder="e.g. Amazon SDE-1, TCS Digital, Full Stack Internship"
              className="form-input"
            />
          </div>

          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Timeline (Days)</label>
              <select
                value={formData.durationDays}
                onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                className="form-select"
              >
                <option value={7}>7 Days (Sprint Review)</option>
                <option value={14}>14 Days (Intensive Prep)</option>
                <option value={30}>30 Days (Standard Prep)</option>
                <option value={60}>60 Days (Comprehensive)</option>
                <option value={90}>90 Days (Complete Mastery)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Hours / Day</label>
              <select
                value={formData.hoursPerDay}
                onChange={(e) => setFormData({ ...formData, hoursPerDay: Number(e.target.value) })}
                className="form-select"
              >
                <option value={2}>2 Hours / day</option>
                <option value={4}>4 Hours / day</option>
                <option value={6}>6 Hours / day</option>
                <option value={8}>8 Hours / day (Full-time)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty Level</label>
              <select
                value={formData.difficultyLevel}
                onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value })}
                className="form-select"
              >
                <option value="beginner">Beginner (Foundations)</option>
                <option value="intermediate">Intermediate (Standard)</option>
                <option value="advanced">Advanced (Product Tier-1)</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={() => handleGenerate()}
          disabled={loading}
          className="btn btn-primary btn-large"
          style={{ width: "100%", marginTop: "16px" }}
        >
          {loading ? (
            <>
              <FaSpinner className="spin" /> Generating Personalized Curriculum...
            </>
          ) : (
            <>
              <FaCalendarAlt /> Generate Daily Study Plan
            </>
          )}
        </button>

        {error && <p className="error-text">{error}</p>}
      </div>

      {/* Result Section */}
      {result && (
        <div className="planner-result-container">
          {/* Plan Overview & Progress Card */}
          <div className="plan-summary-card card-glass">
            <div className="plan-summary-header">
              <div>
                <span className="badge-tag">Roadmap Generated</span>
                <h2 className="plan-title">{result.subject}</h2>
                <p className="plan-overview-text">{result.overview}</p>
              </div>

              <div className="progress-box">
                <div className="progress-info">
                  <span className="progress-text">Progress Tracker</span>
                  <span className="progress-pct">{progressPct}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
                </div>
                <span className="progress-sub">
                  {completedCount} of {totalPlans} daily modules completed
                </span>
              </div>
            </div>

            {/* Milestones */}
            {Array.isArray(result.milestones) && result.milestones.length > 0 && (
              <div className="milestones-row">
                {result.milestones.map((m, i) => (
                  <div key={i} className="milestone-chip">
                    <span className="m-phase">{m.phase}</span>
                    <span className="m-goal">{m.goal}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Daily Schedule List */}
          <div className="daily-plans-list">
            {(result.dailyPlans || []).map((day) => {
              const isDone = !!completedDays[day.dayNumber];

              return (
                <div key={day.dayNumber} className={`day-card card-glass ${isDone ? "day-done" : ""}`}>
                  <div className="day-card-left">
                    <button
                      type="button"
                      onClick={() => toggleDayCompletion(day.dayNumber)}
                      className={`check-btn ${isDone ? "checked" : ""}`}
                      title={isDone ? "Mark as incomplete" : "Mark as completed"}
                    >
                      {isDone ? <FaCheck /> : null}
                    </button>
                    <div>
                      <div className="day-badge-line">
                        <span className="day-number">Day {day.dayNumber}</span>
                        <span className="day-hours">
                          <FaClock style={{ fontSize: "0.75rem", marginRight: "4px" }} />
                          {day.hoursAllocated || 4} Hours
                        </span>
                        <span className={`priority-pill priority-${day.priority || 1}`}>
                          Priority {day.priority || 1}
                        </span>
                      </div>
                      <h3 className="day-topic">{day.topic}</h3>
                    </div>
                  </div>

                  {/* Subtopics Checklist */}
                  {Array.isArray(day.subtopics) && (
                    <div className="subtopics-list">
                      <strong>Focus Checklist:</strong>
                      <ul>
                        {day.subtopics.map((sub, sIdx) => (
                          <li key={sIdx}>{sub}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Study Tip */}
                  {day.studyTips && (
                    <div className="day-tip">
                      <FaLightbulb style={{ color: "#f59e0b", flexShrink: 0, marginTop: "2px" }} />
                      <span>{day.studyTips}</span>
                    </div>
                  )}

                  {/* Practice Resource */}
                  {day.practiceResource && (
                    <div className="day-practice">
                      <FaBook style={{ color: "#818cf8" }} />
                      <span>{day.practiceResource}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <button
              onClick={() => {
                setResult(null);
                setCompletedDays({});
              }}
              className="btn btn-secondary btn-large"
            >
              <FaRedo /> Create Another Study Plan
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .planner-form-card {
          max-width: 920px;
          margin: 0 auto 40px;
          padding: 36px;
        }

        .form-grid {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .form-row-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .error-text {
          color: #f87171;
          font-size: 0.9rem;
          margin-top: 12px;
        }

        /* Result */
        .planner-result-container {
          max-width: 1040px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .plan-summary-card {
          padding: 36px;
        }

        .plan-summary-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .plan-title {
          font-size: 2rem;
          font-weight: 800;
          color: #ffffff;
          margin-top: 6px;
          margin-bottom: 8px;
        }

        .plan-overview-text {
          color: #cbd5e1;
          font-size: 1rem;
          line-height: 1.6;
          max-width: 600px;
        }

        .progress-box {
          background: rgba(13, 20, 36, 0.7);
          border: 1px solid var(--border-light);
          padding: 20px 24px;
          border-radius: var(--radius-sm);
          min-width: 260px;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .progress-text {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .progress-pct {
          font-size: 1.3rem;
          font-weight: 800;
          color: #10b981;
        }

        .progress-track {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--grad-emerald);
          transition: width 0.3s ease;
        }

        .progress-sub {
          font-size: 0.75rem;
          color: #94a3b8;
        }

        .milestones-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 20px;
        }

        .milestone-chip {
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 8px;
          padding: 8px 14px;
          display: flex;
          gap: 8px;
          font-size: 0.85rem;
        }

        .m-phase {
          font-weight: 700;
          color: #a5b4fc;
        }

        .m-goal {
          color: #cbd5e1;
        }

        /* Daily Plans */
        .daily-plans-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .day-card {
          padding: 24px;
          transition: all 0.25s ease;
        }

        .day-done {
          opacity: 0.75;
          border-color: rgba(16, 185, 129, 0.35);
          background: rgba(16, 185, 129, 0.04);
        }

        .day-card-left {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 14px;
        }

        .check-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 2px solid rgba(255, 255, 255, 0.25);
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          margin-top: 3px;
        }

        .check-btn:hover {
          border-color: #34d399;
        }

        .check-btn.checked {
          background: #10b981;
          border-color: #10b981;
        }

        .day-badge-line {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }

        .day-number {
          font-weight: 800;
          font-size: 0.9rem;
          color: #818cf8;
        }

        .day-hours {
          display: flex;
          align-items: center;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .priority-pill {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
        }
        .priority-1 { background: rgba(239, 68, 68, 0.2); color: #f87171; }
        .priority-2 { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
        .priority-3 { background: rgba(99, 102, 241, 0.2); color: #a5b4fc; }

        .day-topic {
          font-size: 1.2rem;
          font-weight: 700;
          color: #ffffff;
        }

        .subtopics-list {
          margin-left: 44px;
          margin-bottom: 12px;
          font-size: 0.9rem;
          color: #cbd5e1;
        }

        .subtopics-list ul {
          list-style: disc;
          margin-left: 18px;
          margin-top: 6px;
        }

        .subtopics-list li {
          margin-bottom: 4px;
        }

        .day-tip {
          margin-left: 44px;
          background: rgba(245, 158, 11, 0.08);
          border-left: 3px solid #f59e0b;
          padding: 8px 14px;
          border-radius: 0 6px 6px 0;
          font-size: 0.85rem;
          color: #cbd5e1;
          display: flex;
          gap: 8px;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .day-practice {
          margin-left: 44px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #a5b4fc;
        }

        @media (max-width: 768px) {
          .form-row-3 {
            grid-template-columns: 1fr;
          }
          .plan-summary-header {
            flex-direction: column;
          }
          .progress-box {
            width: 100%;
          }
          .subtopics-list, .day-tip, .day-practice {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}
