"use client";

import React, { useState } from "react";
import {
  FaFileAlt,
  FaPrint,
  FaPlus,
  FaTrash,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaDownload
} from "react-icons/fa";

export default function ResumeBuilderPage() {
  const [personal, setPersonal] = useState({
    fullName: "Hariprasath A U",
    email: "hari24prasath2005@gmail.com",
    phone: "+91 98765 43210",
    linkedin: "linkedin.com/in/auhariprasath",
    github: "github.com/auhariprasath",
    summary:
      "Passionate Computer Science engineering graduate with expertise in full-stack web development, AI application architecture, and algorithm optimization. Seeking SDE role to solve complex scalability challenges.",
  });

  const [skills, setSkills] = useState({
    languages: "Java, Python, JavaScript (ES6+), SQL, C++",
    frameworks: "React, Next.js, Spring Boot, Node.js, Express",
    tools: "Git, GitHub, Docker, Postman, Linux",
    databases: "MySQL, PostgreSQL, MongoDB, Redis",
  });

  const [education, setEducation] = useState([
    {
      degree: "B.E. in Computer Science and Engineering",
      institution: "Anna University Affiliated College",
      cgpa: "8.8 / 10.0",
      year: "2022 - 2026",
    },
  ]);

  const [projects, setProjects] = useState([
    {
      title: "Placement Preparation & AI Mock Interview Suite",
      tech: "Next.js, React, Groq AI, Web Speech API, Spring Boot",
      desc: "Architected a full-stack placement portal with real-time AI speech recognition, domain roadmaps, and ATS matching.",
      link: "https://github.com/auhariprasath/placement-prep",
    },
    {
      title: "Distributed Task Scheduler & Execution Engine",
      tech: "Java, Spring Boot, Redis, RabbitMQ, Docker",
      desc: "Engineered an asynchronous queue system handling 2,000+ jobs/sec with automatic dead-letter retries.",
      link: "https://github.com/auhariprasath",
    },
  ]);

  const [experiences, setExperiences] = useState([
    {
      role: "Software Engineering Intern",
      company: "Tech Solutions India",
      duration: "May 2025 - July 2025",
      points: [
        "Built responsive client portals with React and Next.js, improving page speed scores by 35%.",
        "Developed 12+ RESTful microservice endpoints with Spring Boot and optimized MySQL database indexing.",
      ],
    },
  ]);

  const addProject = () => {
    setProjects([
      ...projects,
      {
        title: "New Technical Project",
        tech: "React, Node.js, MongoDB",
        desc: "Description of your problem statement, technical solution, and measurable results.",
        link: "",
      },
    ]);
  };

  const removeProject = (idx) => {
    setProjects(projects.filter((_, i) => i !== idx));
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="page-wrapper container">
      <div className="page-header no-print">
        <span className="badge-tag">
          <FaFileAlt style={{ marginRight: "6px" }} /> ATS Standard Format
        </span>
        <h1 className="page-title">Interactive ATS Resume Builder</h1>
        <p className="page-subtitle">
          Build a clean, recruiter-approved technical resume with live preview and 1-click print/export.
        </p>
      </div>

      <div className="builder-layout">
        {/* Editor Column */}
        <div className="editor-col no-print">
          <div className="editor-card card-glass">
            <h2 className="editor-section-title">Personal Details</h2>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={personal.fullName}
                onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={personal.email}
                  onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group flex-1">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  value={personal.phone}
                  onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label">LinkedIn URL</label>
                <input
                  type="text"
                  value={personal.linkedin}
                  onChange={(e) => setPersonal({ ...personal, linkedin: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group flex-1">
                <label className="form-label">GitHub URL</label>
                <input
                  type="text"
                  value={personal.github}
                  onChange={(e) => setPersonal({ ...personal, github: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Professional Summary</label>
              <textarea
                value={personal.summary}
                onChange={(e) => setPersonal({ ...personal, summary: e.target.value })}
                className="form-textarea"
                style={{ minHeight: "80px" }}
              />
            </div>

            <h2 className="editor-section-title" style={{ marginTop: "24px" }}>Technical Skills</h2>
            <div className="form-group">
              <label className="form-label">Languages</label>
              <input
                type="text"
                value={skills.languages}
                onChange={(e) => setSkills({ ...skills, languages: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Frameworks & Libraries</label>
              <input
                type="text"
                value={skills.frameworks}
                onChange={(e) => setSkills({ ...skills, frameworks: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Developer Tools & Databases</label>
              <input
                type="text"
                value={skills.tools}
                onChange={(e) => setSkills({ ...skills, tools: e.target.value })}
                className="form-input"
              />
            </div>

            {/* Projects */}
            <div className="section-header-row" style={{ marginTop: "24px" }}>
              <h2 className="editor-section-title" style={{ margin: 0 }}>Projects</h2>
              <button type="button" onClick={addProject} className="btn btn-secondary btn-sm">
                <FaPlus /> Add Project
              </button>
            </div>

            {projects.map((proj, idx) => (
              <div key={idx} className="project-editor-box">
                <div className="proj-box-top">
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[idx].title = e.target.value;
                      setProjects(updated);
                    }}
                    placeholder="Project Title"
                    className="form-input proj-title-input"
                  />
                  <button
                    type="button"
                    onClick={() => removeProject(idx)}
                    className="btn-delete"
                    title="Remove Project"
                  >
                    <FaTrash />
                  </button>
                </div>
                <input
                  type="text"
                  value={proj.tech}
                  onChange={(e) => {
                    const updated = [...projects];
                    updated[idx].tech = e.target.value;
                    setProjects(updated);
                  }}
                  placeholder="Tech Stack Used (e.g. React, Spring Boot, MySQL)"
                  className="form-input"
                  style={{ marginBottom: "8px" }}
                />
                <textarea
                  value={proj.desc}
                  onChange={(e) => {
                    const updated = [...projects];
                    updated[idx].desc = e.target.value;
                    setProjects(updated);
                  }}
                  placeholder="Key contributions and measurable results..."
                  className="form-textarea"
                  style={{ minHeight: "65px" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="preview-col">
          <div className="preview-actions-bar no-print">
            <span className="preview-badge">
              <FaCheckCircle style={{ color: "#10b981", marginRight: "6px" }} /> ATS Standard Template
            </span>
            <button onClick={handlePrint} className="btn btn-accent print-btn">
              <FaPrint /> Print / Save as PDF
            </button>
          </div>

          {/* Printable White Resume Sheet */}
          <div className="resume-sheet" id="resume-printable-sheet">
            <header className="sheet-header">
              <h1 className="sheet-name">{personal.fullName}</h1>
              <div className="sheet-contact-line">
                <span>{personal.phone}</span> • <span>{personal.email}</span> • <span>{personal.linkedin}</span> • <span>{personal.github}</span>
              </div>
            </header>

            {personal.summary && (
              <section className="sheet-section">
                <h2 className="sheet-section-title">Professional Summary</h2>
                <div className="sheet-divider"></div>
                <p className="sheet-summary-p">{personal.summary}</p>
              </section>
            )}

            <section className="sheet-section">
              <h2 className="sheet-section-title">Education</h2>
              <div className="sheet-divider"></div>
              {education.map((edu, idx) => (
                <div key={idx} className="sheet-item">
                  <div className="sheet-item-row">
                    <strong>{edu.institution}</strong>
                    <span>{edu.year}</span>
                  </div>
                  <div className="sheet-item-row sub">
                    <span>{edu.degree}</span>
                    <span>CGPA: {edu.cgpa}</span>
                  </div>
                </div>
              ))}
            </section>

            <section className="sheet-section">
              <h2 className="sheet-section-title">Technical Skills</h2>
              <div className="sheet-divider"></div>
              <ul className="sheet-skills-list">
                <li><strong>Languages:</strong> {skills.languages}</li>
                <li><strong>Frameworks:</strong> {skills.frameworks}</li>
                <li><strong>Tools & Platforms:</strong> {skills.tools}</li>
                <li><strong>Databases:</strong> {skills.databases}</li>
              </ul>
            </section>

            <section className="sheet-section">
              <h2 className="sheet-section-title">Featured Technical Projects</h2>
              <div className="sheet-divider"></div>
              {projects.map((proj, idx) => (
                <div key={idx} className="sheet-item">
                  <div className="sheet-item-row">
                    <strong>{proj.title}</strong>
                    <span className="sheet-tech-italic">| {proj.tech}</span>
                  </div>
                  <p className="sheet-proj-desc">• {proj.desc}</p>
                </div>
              ))}
            </section>

            <section className="sheet-section">
              <h2 className="sheet-section-title">Work Experience</h2>
              <div className="sheet-divider"></div>
              {experiences.map((exp, idx) => (
                <div key={idx} className="sheet-item">
                  <div className="sheet-item-row">
                    <strong>{exp.role} — {exp.company}</strong>
                    <span>{exp.duration}</span>
                  </div>
                  <ul className="sheet-bullet-list">
                    {exp.points.map((pt, pIdx) => (
                      <li key={pIdx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>

      <style jsx>{`
        .builder-layout {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 28px;
          align-items: flex-start;
        }

        .editor-card {
          padding: 28px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .editor-section-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 14px;
        }

        .form-row {
          display: flex;
          gap: 14px;
        }

        .flex-1 { flex: 1; }

        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .btn-sm {
          font-size: 0.8rem;
          padding: 6px 12px;
        }

        .project-editor-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 16px;
          border-radius: var(--radius-sm);
          margin-bottom: 14px;
        }

        .proj-box-top {
          display: flex;
          gap: 10px;
          margin-bottom: 8px;
        }

        .proj-title-input {
          flex: 1;
          font-weight: 600;
        }

        .btn-delete {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          width: 38px;
          border-radius: 6px;
          cursor: pointer;
        }

        /* Preview Sheet */
        .preview-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .preview-actions-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          background: #ffffff;
          border-radius: var(--radius-sm);
          border: 1px solid #e2e8f0;
        }

        .preview-badge {
          font-size: 0.85rem;
          font-weight: 600;
          color: #0f172a;
          display: flex;
          align-items: center;
        }

        /* Printable Resume Paper Sheet */
        .resume-sheet {
          background: #ffffff;
          color: #1a1a1a;
          padding: 48px;
          border-radius: 6px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          font-family: 'Times New Roman', Times, serif;
          min-height: 900px;
        }

        .sheet-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .sheet-name {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }

        .sheet-contact-line {
          font-size: 0.9rem;
          color: #374151;
        }

        .sheet-section {
          margin-bottom: 18px;
        }

        .sheet-section-title {
          font-size: 1.05rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #111827;
          margin-bottom: 4px;
        }

        .sheet-divider {
          height: 1.5px;
          background: #111827;
          margin-bottom: 8px;
        }

        .sheet-summary-p {
          font-size: 0.92rem;
          line-height: 1.5;
          color: #1f2937;
        }

        .sheet-item {
          margin-bottom: 10px;
        }

        .sheet-item-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
          color: #111827;
        }

        .sheet-item-row.sub {
          font-size: 0.9rem;
          color: #4b5563;
        }

        .sheet-tech-italic {
          font-style: italic;
          font-size: 0.88rem;
          color: #4b5563;
        }

        .sheet-skills-list {
          list-style: none;
          font-size: 0.92rem;
          color: #1f2937;
          line-height: 1.6;
        }

        .sheet-proj-desc {
          font-size: 0.9rem;
          color: #374151;
          margin-top: 3px;
          line-height: 1.45;
        }

        .sheet-bullet-list {
          margin-left: 18px;
          font-size: 0.9rem;
          color: #374151;
          margin-top: 4px;
          line-height: 1.45;
        }

        /* Print Media Styles */
        @media print {
          .no-print {
            display: none !important;
          }
          body, html {
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .container, .page-wrapper {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .builder-layout {
            display: block !important;
          }
          .resume-sheet {
            box-shadow: none !important;
            padding: 20px !important;
            width: 100% !important;
            min-height: auto !important;
          }
        }

        @media (max-width: 900px) {
          .builder-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
