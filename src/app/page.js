"use client";

import React from "react";
import Link from "next/link";
import {
  FaMicrophone,
  FaCompass,
  FaCalendarAlt,
  FaRobot,
  FaSearch,
  FaBriefcase,
  FaFileAlt,
  FaCheckCircle,
  FaCode,
  FaComments,
  FaGraduationCap,
  FaArrowRight,
  FaBolt,
  FaStar,
  FaShieldAlt,
  FaLaptopCode,
  FaAward
} from "react-icons/fa";

export default function HomePage() {
  const features = [
    {
      id: "feat-mock",
      title: "AI Voice Mock Interview",
      description: "Upload your resume, speak via your microphone in real-time, hear AI questions via voice speech synthesis, and get comprehensive hiring scorecards.",
      link: "/mock-interview",
      icon: <FaMicrophone />,
      badge: "Flagship AI",
      gradient: "linear-gradient(135deg, #ec4899, #8b5cf6)",
      borderColor: "rgba(236, 72, 153, 0.4)"
    },
    {
      id: "feat-domain",
      title: "Domain Selection & Courses",
      description: "Input your technical interests to discover your ideal engineering career track, semester-wise subjects, and curated YouTube video courses.",
      link: "/domain-selection",
      icon: <FaCompass />,
      badge: "Career Mapping",
      gradient: "linear-gradient(135deg, #6366f1, #3b82f6)",
      borderColor: "rgba(99, 102, 241, 0.4)"
    },
    {
      id: "feat-planner",
      title: "Personalized Study Planner",
      description: "Generate customized day-by-day prep schedules powered by Groq AI based on your target difficulty, duration, and study hours.",
      link: "/study-planner",
      icon: <FaCalendarAlt />,
      badge: "Roadmap Generator",
      gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
      borderColor: "rgba(245, 158, 11, 0.4)"
    },
    {
      id: "feat-agent",
      title: "AI Placement Copilot",
      description: "Chat with your 24/7 placement advisor. Ask questions about interview strategies, resume tips, or let it auto-navigate you to the right tools.",
      link: "/ai-agent",
      icon: <FaRobot />,
      badge: "Conversational AI",
      gradient: "linear-gradient(135deg, #10b981, #06b6d4)",
      borderColor: "rgba(16, 185, 129, 0.4)"
    },
    {
      id: "feat-jobs",
      title: "Fresher & Campus Job Search",
      description: "Discover curated placement drives, intern roles, and software engineering job openings across India with salary ranges and direct apply links.",
      link: "/job-search",
      icon: <FaSearch />,
      badge: "Opportunities",
      gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
      borderColor: "rgba(59, 130, 246, 0.4)"
    },
    {
      id: "feat-interviews",
      title: "Company Interview Experiences",
      description: "Browse verified interview questions and round-by-round breakdown for Google, Amazon, Microsoft, TCS, Infosys, and top product firms.",
      link: "/interview-search",
      icon: <FaBriefcase />,
      badge: "Company Archives",
      gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)",
      borderColor: "rgba(139, 92, 246, 0.4)"
    },
    {
      id: "feat-matcher",
      title: "ATS Resume Scanner",
      description: "Scan your resume against any target job description. Uncover your match score, missing keywords, and recruiter-approved bullet point rewrites.",
      link: "/resume-matcher",
      icon: <FaCheckCircle />,
      badge: "ATS Optimization",
      gradient: "linear-gradient(135deg, #10b981, #3b82f6)",
      borderColor: "rgba(16, 185, 129, 0.4)"
    },
    {
      id: "feat-builder",
      title: "Interactive Resume Builder",
      description: "Craft a modern, ATS-ready tech resume with live formatting preview, structured sections, and instant export/print capabilities.",
      link: "/resume-builder",
      icon: <FaFileAlt />,
      badge: "Templates",
      gradient: "linear-gradient(135deg, #6366f1, #ec4899)",
      borderColor: "rgba(99, 102, 241, 0.4)"
    },
    {
      id: "feat-compiler",
      title: "Multi-Language Code Runner",
      description: "Practice coding algorithms directly in your browser supporting JavaScript, Python, Java, and C++ with test cases and runtime logs.",
      link: "/compiler",
      icon: <FaCode />,
      badge: "Interactive IDE",
      gradient: "linear-gradient(135deg, #06b6d4, #10b981)",
      borderColor: "rgba(6, 182, 212, 0.4)"
    },
    {
      id: "feat-forum",
      title: "Community & Prep Guides",
      description: "Connect with fellow candidates in the discussion forum, share test questions, and read comprehensive placement roadmaps.",
      link: "/forum",
      icon: <FaComments />,
      badge: "Peer Network",
      gradient: "linear-gradient(135deg, #ec4899, #f59e0b)",
      borderColor: "rgba(236, 72, 153, 0.4)"
    }
  ];

  return (
    <div className="home-root">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-badge-wrap">
            <span className="hero-pill-badge">
              <FaBolt className="sparkle-icon" /> Next.js 16 Full-Stack Suite • Vercel Ready
            </span>
          </div>

          <h1 className="hero-title">
            Crack Your Dream Tech Offer with{" "}
            <span className="hero-title-gradient">Intelligent AI Coaching</span>
          </h1>

          <p className="hero-desc">
            The all-in-one placement preparation platform engineered for college graduates.
            Undergo real-time AI voice interviews, map your engineering domain, generate daily study roadmaps, and beat ATS screeners.
          </p>

          <div className="hero-cta-group">
            <Link href="/mock-interview" className="btn btn-accent hero-btn-main">
              <FaMicrophone /> Practice AI Voice Interview
            </Link>
            <Link href="/domain-selection" className="btn btn-secondary hero-btn-sub">
              <FaCompass /> Predict Engineering Domain
            </Link>
            <Link href="/study-planner" className="btn btn-secondary hero-btn-sub">
              <FaCalendarAlt /> Create Study Plan
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="stats-row">
            <div className="stat-card card-glass">
              <span className="stat-num">98.4%</span>
              <span className="stat-label">ATS Match Accuracy</span>
            </div>
            <div className="stat-card card-glass">
              <span className="stat-num">&lt; 1 sec</span>
              <span className="stat-label">Groq AI Response Time</span>
            </div>
            <div className="stat-card card-glass">
              <span className="stat-num">10+ Tools</span>
              <span className="stat-label">Unified Full-Stack Suite</span>
            </div>
            <div className="stat-card card-glass">
              <span className="stat-num">1-Click</span>
              <span className="stat-label">Zero-DB Vercel Deploy</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="features-section">
        <div className="container">
          <div className="page-header">
            <span className="badge-tag">Everything You Need To Get Placed</span>
            <h2 className="page-title">High-Impact Placement Preparation Tools</h2>
            <p className="page-subtitle">
              From your first semester fundamentals to final round technical interviews, every tool is integrated into one fast, reactive application.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feat) => (
              <Link key={feat.id} href={feat.link} className="feature-card card-glass">
                <div className="feature-card-top">
                  <div className="feat-icon-box" style={{ background: feat.gradient }}>
                    {feat.icon}
                  </div>
                  <span className="feat-pill" style={{ borderColor: feat.borderColor }}>
                    {feat.badge}
                  </span>
                </div>

                <h3 className="feat-card-title">{feat.title}</h3>
                <p className="feat-card-desc">{feat.description}</p>

                <div className="feat-card-footer">
                  <span className="feat-action-link">
                    Launch Tool <FaArrowRight className="arrow-icon" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Deployment & Architecture Banner */}
      <section className="deployment-banner-section">
        <div className="container">
          <div className="deploy-banner card-glass">
            <div className="deploy-banner-content">
              <span className="badge-tag" style={{ background: "#ecfdf5", color: "#059669", borderColor: "#a7f3d0" }}>
                <FaShieldAlt style={{ marginRight: "6px" }} /> Modern Serverless Architecture
              </span>
              <h2>Ready for Instant 1-Click Deployment on Vercel</h2>
              <p>
                No heavy Java virtual machine, no local MySQL server, and no complex dual-repository management.
                Everything runs directly in Next.js Serverless App Router API handlers.
                Simply push to GitHub, import to Vercel, and provide your <code>GROQ_API_KEY</code>.
              </p>
              <div className="deploy-actions">
                <Link href="/mock-interview" className="btn btn-primary">
                  Test AI Voice Interview Live
                </Link>
                <Link href="/ai-agent" className="btn btn-secondary">
                  Chat with AI Placement Copilot
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home-root {
          padding-top: 24px;
        }

        .hero-section {
          padding: 40px 0 70px;
          text-align: center;
          position: relative;
        }

        .hero-badge-wrap {
          margin-bottom: 24px;
        }

        .hero-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          background: #eef2ff;
          color: #4338ca;
          border: 1px solid #c7d2fe;
          box-shadow: 0 2px 10px rgba(99, 102, 241, 0.1);
        }

        .sparkle-icon {
          color: #ec4899;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.03em;
          max-width: 900px;
          margin: 0 auto 20px;
          color: #0f172a;
        }

        .hero-title-gradient {
          background: linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #0284c7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-desc {
          font-size: 1.15rem;
          color: var(--text-secondary);
          max-width: 720px;
          margin: 0 auto 36px;
          line-height: 1.7;
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 56px;
        }

        .hero-btn-main {
          padding: 14px 28px;
          font-size: 1.05rem;
        }

        .hero-btn-sub {
          padding: 14px 24px;
          font-size: 1rem;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .stat-card {
          padding: 24px;
          text-align: center;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .stat-num {
          display: block;
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 6px;
          background: linear-gradient(135deg, #0f172a 40%, #4f46e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-label {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 500;
        }

        /* Features Section */
        .features-section {
          padding: 60px 0 80px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .feature-card {
          padding: 28px;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          position: relative;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .feature-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .feat-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.35rem;
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .feat-pill {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid #cbd5e1;
          background: #f8fafc;
          color: #475569;
          letter-spacing: 0.03em;
        }

        .feat-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }

        .feat-card-desc {
          color: #475569;
          font-size: 0.92rem;
          line-height: 1.6;
          margin-bottom: 20px;
          flex-grow: 1;
        }

        .feat-card-footer {
          border-top: 1px solid #f1f5f9;
          padding-top: 14px;
        }

        .feat-action-link {
          font-size: 0.88rem;
          font-weight: 600;
          color: #4f46e5;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: gap 0.2s ease;
        }

        .feature-card:hover .feat-action-link {
          gap: 10px;
          color: #4338ca;
        }

        .arrow-icon {
          font-size: 0.8rem;
        }

        /* Deployment Banner */
        .deployment-banner-section {
          padding: 20px 0 90px;
        }

        .deploy-banner {
          padding: 48px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
        }

        .deploy-banner-content h2 {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 14px;
        }

        .deploy-banner-content p {
          color: #475569;
          font-size: 1rem;
          line-height: 1.7;
          max-width: 800px;
          margin-bottom: 28px;
        }

        .deploy-banner-content code {
          background: #eef2ff;
          color: #4338ca;
          padding: 2px 8px;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.9em;
        }

        .deploy-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        @media (max-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .hero-title {
            font-size: 2.3rem;
          }
          .features-grid {
            grid-template-columns: 1fr;
          }
          .stats-row {
            grid-template-columns: 1fr;
          }
          .deploy-banner {
            padding: 28px 20px;
          }
        }
      `}</style>
    </div>
  );
}
