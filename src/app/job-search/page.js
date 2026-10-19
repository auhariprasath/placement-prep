"use client";

import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaBriefcase,
  FaMoneyBillWave,
  FaExternalLinkAlt,
  FaBuilding,
  FaFilter,
  FaSpinner
} from "react-icons/fa";

export default function JobSearchPage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("All");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, location, jobType }),
      });
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (e) {
      console.error("Job fetch failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="page-wrapper container">
      <div className="page-header">
        <span className="badge-tag">
          <FaSearch style={{ marginRight: "6px" }} /> Fresher & Campus Placement Openings
        </span>
        <h1 className="page-title">Explore Tech & Software Engineering Jobs</h1>
        <p className="page-subtitle">
          Search curated placement opportunities, software trainee programs, and high-impact internships across India.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="filter-card card-glass">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchJobs();
          }}
          className="search-form"
        >
          <div className="input-wrap flex-2">
            <FaSearch className="field-icon" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by job title, company, or tech stack (e.g. Java, React, SDE)"
              className="clean-input"
            />
          </div>

          <div className="input-wrap flex-1">
            <FaMapMarkerAlt className="field-icon" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (e.g. Bengaluru, Remote, Pune)"
              className="clean-input"
            />
          </div>

          <div className="input-wrap flex-1">
            <FaFilter className="field-icon" />
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="clean-select"
            >
              <option value="All">All Job Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary search-submit-btn">
            {loading ? <FaSpinner className="spin" /> : <FaSearch />} Find Jobs
          </button>
        </form>
      </div>

      {/* Jobs List */}
      <div className="jobs-list">
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <FaSpinner className="spin" style={{ fontSize: "2rem", color: "#818cf8" }} />
            <p style={{ marginTop: "12px", color: "#94a3b8" }}>Searching available placement listings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="card-glass" style={{ padding: "40px", textAlign: "center" }}>
            <p style={{ color: "#94a3b8" }}>No specific matching jobs found. Try adjusting your keyword or location.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="job-card card-glass">
              <div className="job-card-main">
                <div className="company-logo-avatar">
                  {job.company ? job.company.charAt(0) : "T"}
                </div>
                <div className="job-details">
                  <div className="job-title-row">
                    <h3 className="job-title">{job.title}</h3>
                    <span className="job-type-pill">{job.type}</span>
                  </div>
                  <div className="company-sub-line">
                    <span className="comp-name">
                      <FaBuilding style={{ marginRight: "4px" }} /> {job.company}
                    </span>
                    <span className="comp-loc">
                      <FaMapMarkerAlt style={{ marginRight: "4px" }} /> {job.location}
                    </span>
                    <span className="comp-sal">
                      <FaMoneyBillWave style={{ marginRight: "4px" }} /> {job.salary}
                    </span>
                  </div>
                  <p className="job-desc">{job.description}</p>
                  <div className="job-skills-row">
                    {(job.skills || []).map((skill, sIdx) => (
                      <span key={sIdx} className="skill-pill">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="job-apply-col">
                <a
                  href={job.applyLink || "https://linkedin.com/jobs"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-accent apply-btn"
                >
                  Apply Now <FaExternalLinkAlt style={{ fontSize: "0.8rem" }} />
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .filter-card {
          padding: 20px 24px;
          margin-bottom: 32px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .search-form {
          display: flex;
          gap: 14px;
          align-items: center;
          flex-wrap: wrap;
        }

        .input-wrap {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: var(--radius-sm);
          padding: 4px 14px;
        }

        .flex-2 { flex: 2; min-width: 240px; }
        .flex-1 { flex: 1; min-width: 160px; }

        .field-icon {
          color: #6366f1;
          margin-right: 10px;
        }

        .clean-input, .clean-select {
          background: transparent;
          border: none;
          color: #0f172a;
          padding: 10px 0;
          font-size: 0.95rem;
          width: 100%;
          outline: none;
        }

        .clean-select option {
          background: #ffffff;
          color: #0f172a;
        }

        .search-submit-btn {
          padding: 14px 24px;
        }

        .jobs-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .job-card {
          padding: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .job-card-main {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          flex: 1;
        }

        .company-logo-avatar {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: var(--grad-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          font-weight: 800;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.25);
          flex-shrink: 0;
        }

        .job-details {
          flex: 1;
        }

        .job-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }

        .job-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
        }

        .job-type-pill {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }

        .company-sub-line {
          display: flex;
          gap: 16px;
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .comp-sal {
          color: #059669;
          font-weight: 600;
        }

        .job-desc {
          font-size: 0.9rem;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 14px;
        }

        .job-skills-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .skill-pill {
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          color: #4338ca;
        }

        .apply-btn {
          white-space: nowrap;
          padding: 12px 20px;
        }

        @media (max-width: 768px) {
          .job-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .apply-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
