"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaCompass,
  FaSearch,
  FaBriefcase,
  FaFileAlt,
  FaCalendarAlt,
  FaComments,
  FaRobot,
  FaCode,
  FaHome,
  FaMicrophone,
  FaBars,
  FaTimes,
  FaGraduationCap,
  FaCheckCircle,
  FaChevronRight,
  FaSparkles,
  FaKey,
  FaCog
} from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change or resize
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navSections = [
    {
      title: "Core AI Prep",
      items: [
        { href: "/", label: "Home", icon: <FaHome /> },
        {
          href: "/mock-interview",
          label: "AI Mock Interview",
          icon: <FaMicrophone />,
          badge: "AI VOICE",
          badgeColor: "pink"
        },
        { href: "/domain-selection", label: "Domain Selection", icon: <FaCompass /> },
        { href: "/study-planner", label: "Study Planner", icon: <FaCalendarAlt /> },
        { href: "/ai-agent", label: "AI Copilot", icon: <FaRobot /> },
      ]
    },
    {
      title: "Placement Tools",
      items: [
        { href: "/job-search", label: "Job Search", icon: <FaSearch /> },
        { href: "/interview-search", label: "Interviews", icon: <FaBriefcase /> },
        { href: "/resume-matcher", label: "ATS Scanner", icon: <FaCheckCircle /> },
        { href: "/resume-builder", label: "Resume Builder", icon: <FaFileAlt /> },
        { href: "/compiler", label: "Online Compiler", icon: <FaCode /> },
      ]
    },
    {
      title: "Community & Learn",
      items: [
        { href: "/forum", label: "Community Forum", icon: <FaComments /> },
        { href: "/blog", label: "Placement Guides", icon: <FaGraduationCap /> },
      ]
    },
    {
      title: "System & API",
      items: [
        {
          href: "/settings",
          label: "API Keys & Settings",
          icon: <FaKey />,
          badge: "API",
          badgeColor: "blue",
        },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Top Bar (Visible only on <= 1024px) */}
      <header className="mobile-topbar">
        <Link href="/" className="mobile-brand">
          <div className="brand-logo-icon">
            <FaGraduationCap />
          </div>
          <span className="brand-title">PlacementPrep</span>
        </Link>
        <button
          className="mobile-hamburger-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation sidebar"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sideways Navigation Sidebar */}
      <aside className={`sidebar-aside ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-inner">
          {/* Brand Header */}
          <div className="sidebar-header">
            <Link href="/" className="sidebar-brand">
              <div className="brand-logo-icon">
                <FaGraduationCap />
              </div>
              <div className="brand-text">
                <span className="brand-title">PlacementPrep</span>
                <span className="brand-tag">AI SUITE</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="sidebar-nav">
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="nav-section">
                <p className="nav-section-title">{section.title}</p>
                <ul className="nav-list">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.href} className="nav-list-item">
                        <Link
                          href={item.href}
                          className={`sidebar-nav-link ${isActive ? "active" : ""}`}
                        >
                          <span className="nav-link-icon">{item.icon}</span>
                          <span className="nav-link-label">{item.label}</span>
                          {item.badge && (
                            <span className={`nav-link-badge badge-${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          )}
                          {isActive && <span className="active-glow-bar" />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Sidebar Bottom CTA & Status */}
          <div className="sidebar-footer">
            <Link href="/mock-interview" className="sidebar-cta-card">
              <div className="cta-icon-pill">
                <FaMicrophone />
              </div>
              <div className="cta-text">
                <span className="cta-title">Voice Interview</span>
                <span className="cta-sub">Practice with AI</span>
              </div>
              <FaChevronRight className="cta-arrow" />
            </Link>

            <div className="sidebar-status-row">
              <span className="status-dot-pulse" />
              <span className="status-label">Groq AI Engine Online</span>
            </div>

            <p className="sidebar-copy">© 2026 PlacementPrep AI</p>
          </div>
        </div>
      </aside>

      <style jsx>{`
        /* Mobile Topbar */
        .mobile-topbar {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          z-index: 1000;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .mobile-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .mobile-brand .brand-title {
          font-weight: 800;
          font-size: 1.12rem;
          color: #0f172a;
        }

        .mobile-hamburger-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          border-radius: 8px;
          font-size: 1.15rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-hamburger-btn:hover {
          background: #e2e8f0;
        }

        /* Backdrop */
        .sidebar-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 1001;
        }

        /* Sidebar Container */
        .sidebar-aside {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 260px;
          height: 100vh;
          background: #0b101c;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          z-index: 1002;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sidebar-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 20px 14px 16px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.12) transparent;
        }

        .sidebar-inner::-webkit-scrollbar {
          width: 5px;
        }

        .sidebar-inner::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 10px;
        }

        /* Brand */
        .sidebar-header {
          padding: 4px 6px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          margin-bottom: 16px;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .brand-logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--grad-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.15rem;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
          flex-shrink: 0;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-weight: 800;
          font-size: 1.12rem;
          letter-spacing: -0.01em;
          background: linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-tag {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #ec4899;
          margin-top: -1px;
        }

        /* Nav Sections */
        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .nav-section-title {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #64748b;
          padding: 0 10px;
          margin-bottom: 6px;
        }

        .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .sidebar-nav-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 9px 12px;
          border-radius: 9px;
          color: #94a3b8;
          font-size: 0.88rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .sidebar-nav-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }

        .sidebar-nav-link.active {
          color: #ffffff;
          background: rgba(99, 102, 241, 0.15);
          border: 1px solid rgba(99, 102, 241, 0.3);
          font-weight: 600;
        }

        .nav-link-icon {
          font-size: 1.05rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          color: #64748b;
          transition: color 0.2s ease;
        }

        .sidebar-nav-link:hover .nav-link-icon {
          color: #a5b4fc;
        }

        .sidebar-nav-link.active .nav-link-icon {
          color: #818cf8;
        }

        .nav-link-label {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .nav-link-badge {
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 2px 6px;
          border-radius: 999px;
        }

        .badge-pink {
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(236, 72, 153, 0.4);
        }

        .badge-blue {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
        }

        .active-glow-bar {
          position: absolute;
          left: 0;
          top: 6px;
          bottom: 6px;
          width: 3px;
          background: #818cf8;
          border-radius: 0 3px 3px 0;
          box-shadow: 0 0 10px #818cf8;
        }

        /* Sidebar Footer */
        .sidebar-footer {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sidebar-cta-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%);
          border: 1px solid rgba(236, 72, 153, 0.3);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .sidebar-cta-card:hover {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
          border-color: rgba(236, 72, 153, 0.5);
          transform: translateY(-1px);
        }

        .cta-icon-pill {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: var(--grad-accent);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          flex-shrink: 0;
        }

        .cta-text {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .cta-title {
          color: #ffffff;
          font-size: 0.82rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .cta-sub {
          color: #94a3b8;
          font-size: 0.68rem;
        }

        .cta-arrow {
          color: #f472b6;
          font-size: 0.75rem;
        }

        .sidebar-status-row {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0 4px;
        }

        .status-dot-pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
          animation: statusPulse 2s infinite;
        }

        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        .status-label {
          font-size: 0.7rem;
          color: #64748b;
          font-weight: 500;
        }

        .sidebar-copy {
          font-size: 0.66rem;
          color: #475569;
          text-align: center;
          margin-top: 2px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .mobile-topbar {
            display: flex;
          }

          .sidebar-backdrop {
            display: block;
          }

          .sidebar-aside {
            transform: translateX(-100%);
            box-shadow: 4px 0 25px rgba(0, 0, 0, 0.7);
          }

          .sidebar-aside.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
