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
  FaLayerGroup,
  FaSearch
} from "react-icons/fa";

export default function DomainSelectionPage() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showAllBranches, setShowAllBranches] = useState(false);
  const [branchFilter, setBranchFilter] = useState("");

  // The 20 approved engineering courses/disciplines
  const approvedBranches = [
    { name: "Computer Science & Engineering (CSE)", icon: "💻", sample: "I love solving complex algorithms, full-stack software development in Java and React, operating system internals, and scalable cloud architectures." },
    { name: "Artificial Intelligence & Machine Learning (AI/ML)", icon: "🧠", sample: "I am passionate about neural networks, deep learning with PyTorch, computer vision, natural language processing, and building LLM applications." },
    { name: "Artificial Intelligence & Data Science (AI & DS)", icon: "📊", sample: "I enjoy working with big data pipelines, statistical modeling, machine learning with Pandas/Spark, data warehousing, and business intelligence." },
    { name: "Electronics & Communication Engineering (ECE)", icon: "📡", sample: "I am interested in digital signal processing, 5G wireless networks, antenna design, microprocessors, and embedded hardware communication." },
    { name: "Cyber Security", icon: "🛡️", sample: "I want to master ethical hacking, network penetration testing, cryptography, defensive security operations (SOC), and cloud security hardening." },
    { name: "Information Technology (IT)", icon: "🌐", sample: "I want to specialize in DevOps pipelines, cloud computing on AWS, enterprise system architecture, container orchestration, and server administration." },
    { name: "Electrical & Electronics Engineering (EEE)", icon: "⚡", sample: "I am fascinated by electrical machines, high-voltage power grids, power electronics, motor drives, and electric vehicle battery systems." },
    { name: "Computer Science & Business Systems (CSBS)", icon: "📈", sample: "I want to combine computer science with business systems, financial engineering, enterprise product management, agile delivery, and ERP." },
    { name: "Mechanical Engineering", icon: "⚙️", sample: "I love 3D CAD modeling in SolidWorks, engineering thermodynamics, fluid dynamics, stress analysis, and manufacturing machinery." },
    { name: "Robotics & Automation", icon: "🤖", sample: "I am passionate about robot kinematics, ROS 2 autonomous navigation, industrial PLCs, computer vision, and robotic actuators." },
    { name: "Internet of Things (IoT)", icon: "📶", sample: "I love building smart connected devices with ESP32 and Arduino, sensor networks, MQTT wireless protocols, and cloud edge analytics." },
    { name: "Electronics/VLSI Design & Technology", icon: "🔲", sample: "I want to design semiconductor silicon chips, write Verilog HDL code for FPGAs, CMOS VLSI physical design, and ASIC timing closure." },
    { name: "Mechatronics Engineering", icon: "🦾", sample: "I enjoy combining mechanical mechanisms, electronic sensors, hydraulic/pneumatic actuators, and closed-loop control systems." },
    { name: "Automobile Engineering", icon: "🚗", sample: "I have a deep passion for vehicle dynamics, electric vehicle powertrains, automotive chassis design, crash safety, and suspension tuning." },
    { name: "Civil Engineering", icon: "🏗️", sample: "I want to design structural buildings and bridges, work with BIM in Revit, soil mechanics, and modern smart city transportation systems." },
    { name: "Aeronautical Engineering", icon: "✈️", sample: "I am fascinated by aircraft aerodynamics, jet engine propulsion cycles, flight dynamics, and thin-walled structural analysis." },
    { name: "Biotechnology", icon: "🧬", sample: "I am interested in genetic engineering, molecular biology, CRISPR gene editing, bioprocess fermentation, and computational bioinformatics." },
    { name: "Biomedical Engineering", icon: "🩺", sample: "I want to build life-saving medical devices, MRI and ultrasound imaging systems, biosensors, and prosthetic biomechanical implants." },
    { name: "Chemical Engineering", icon: "🧪", sample: "I am interested in chemical reaction engineering, distillation columns, mass transfer operations, and industrial plant simulations in Aspen Plus." },
    { name: "Aerospace Engineering", icon: "🚀", sample: "I want to work on rocket propulsion, orbital mechanics, satellite trajectory design, space missions, and hypersonic re-entry heat shields." }
  ];

  const quickPrompts = [
    { label: "Full Stack & Algorithms", text: "I love building scalable web applications, designing user interfaces in React, and writing clean backend APIs with database optimizations." },
    { label: "AI & Neural Networks", text: "I have a strong passion for deep neural networks, computer vision, PyTorch, natural language processing, and Generative AI." },
    { label: "Ethical Hacking & Defense", text: "I want to protect computer systems from cyber threats, perform penetration testing, analyze network protocols, and secure cloud environments." },
    { label: "Autonomous Robotics & ROS", text: "I enjoy building autonomous mobile robots, programming in ROS 2, integrating LiDAR sensors, and working with industrial PLCs." },
    { label: "Semiconductor & VLSI", text: "I am interested in silicon microchips, FPGA synthesis, RTL coding in Verilog, and CMOS physical layout design." },
    { label: "Rocket Propulsion & Space", text: "I dream of designing rocket engines, orbital flight trajectories, satellite constellations, and spacecraft thermal shielding." }
  ];

  const handlePredict = async (statement) => {
    const textToSubmit = statement || userInput;
    if (!textToSubmit.trim()) {
      setError("Please describe your interests or click one of the 20 branches / sample prompts below.");
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

  const filteredBranches = approvedBranches.filter(b =>
    b.name.toLowerCase().includes(branchFilter.toLowerCase())
  );

  return (
    <div className="page-wrapper container" suppressHydrationWarning>
      <div className="page-header">
        <span className="badge-tag">
          <FaCompass style={{ marginRight: "6px" }} /> AI Academic & Career Mapping
        </span>
        <h1 className="page-title">Engineering Domain Selection & Curriculum</h1>
        <p className="page-subtitle">
          Describe your technical interests, coding passions, or career dreams. Groq AI evaluates your statement and recommends the best-fit discipline strictly from <strong>20 premier engineering courses</strong>.
        </p>
      </div>

      {/* Input Section */}
      <div className="domain-input-card card-glass">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <label className="form-label" style={{ marginBottom: 0 }}>
            What are your technical interests, passions, or dream projects?
          </label>
          <span className="branch-count-badge">
            <FaLayerGroup style={{ marginRight: "5px" }} /> 20 Engineering Courses
          </span>
        </div>

        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="e.g. I enjoy coding in Java, building REST APIs, working with MySQL databases, or designing robotics and VLSI chips..."
          className="form-textarea"
          style={{ minHeight: "115px", marginBottom: "16px" }}
        />

        {/* Quick Sample Prompts */}
        <div className="sample-prompts-box">
          <span className="sample-label">
            <FaLightbulb style={{ color: "#f59e0b" }} /> Try a quick prompt:
          </span>
          <div className="prompt-chips">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setUserInput(p.text);
                  handlePredict(p.text);
                }}
                className="chip-btn"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Explore all 20 Branches Accordion/Pills */}
        <div className="all-branches-container">
          <div className="all-branches-header">
            <button
              type="button"
              className="toggle-branches-btn"
              onClick={() => setShowAllBranches(!showAllBranches)}
            >
              <FaLayerGroup /> {showAllBranches ? "Hide 20 Target Engineering Branches" : "Browse All 20 Target Engineering Courses & Click to Test"}
            </button>
          </div>

          {showAllBranches && (
            <div className="branches-drawer">
              <div className="branch-search-bar">
                <FaSearch style={{ color: "#94a3b8" }} />
                <input
                  type="text"
                  placeholder="Filter the 20 branches..."
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="branch-filter-input"
                />
              </div>

              <div className="branches-grid">
                {filteredBranches.map((branch, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="branch-card-btn"
                    onClick={() => {
                      setUserInput(branch.sample);
                      handlePredict(branch.sample);
                    }}
                    title="Click to evaluate AI prediction for this branch"
                  >
                    <span className="branch-icon">{branch.icon}</span>
                    <span className="branch-name">{branch.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => handlePredict()}
          disabled={loading}
          className="btn btn-primary btn-large"
          style={{ width: "100%", marginTop: "20px" }}
        >
          {loading ? (
            <>
              <FaSpinner className="spin" /> Groq AI Analyzing Across 20 Engineering Branches...
            </>
          ) : (
            <>
              <FaCompass /> Recommend Best Engineering Course & Curriculum
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
                  <FaCheckCircle style={{ marginRight: "6px" }} /> Top Matched Course ({result.confidence || 92}%)
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

        .branch-count-badge {
          display: inline-flex;
          align-items: center;
          font-size: 0.8rem;
          color: #4f46e5;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-weight: 600;
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
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #334155;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .chip-btn:hover {
          background: #e0e7ff;
          border-color: #a5b4fc;
          color: #4338ca;
          transform: translateY(-1px);
        }

        /* 20 Branches Drawer */
        .all-branches-container {
          margin-top: 18px;
          border-top: 1px dashed #e2e8f0;
          padding-top: 14px;
        }

        .toggle-branches-btn {
          background: transparent;
          border: none;
          color: #4f46e5;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 0;
          transition: color 0.2s;
        }

        .toggle-branches-btn:hover {
          color: #3730a3;
          text-decoration: underline;
        }

        .branches-drawer {
          margin-top: 12px;
          padding: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          animation: fadeIn 0.25s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .branch-search-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 8px 12px;
          margin-bottom: 12px;
        }

        .branch-filter-input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 0.85rem;
          color: #0f172a;
        }

        .branches-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 8px;
          max-height: 280px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .branch-card-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 12px;
          text-align: left;
          font-size: 0.82rem;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .branch-card-btn:hover {
          border-color: #818cf8;
          background: #eef2ff;
          color: #3730a3;
          transform: translateY(-1px);
        }

        .branch-icon {
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .branch-name {
          font-weight: 600;
          line-height: 1.3;
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
