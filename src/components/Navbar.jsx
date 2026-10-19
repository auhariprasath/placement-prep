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
      title: "Preparation",
      items: [
        { href: "/", label: "Home", icon: <FaHome /> },
        {
          href: "/mock-interview",
          label: "AI Mock Interview",
          icon: <FaMicrophone />,
          badge: "AI"
        },
        { href: "/domain-selection", label: "Domain Selection", icon: <FaCompass /> },
        { href: "/study-planner", label: "Study Planner", icon: <FaCalendarAlt /> },
        { href: "/ai-agent", label: "AI Copilot", icon: <FaRobot /> },
      ]
    },
    {
      title: "Tools & Practice",
      items: [
        { href: "/compiler", label: "Online Compiler", icon: <FaCode /> },
        { href: "/interview-search", label: "Interview Questions", icon: <FaBriefcase /> },
        { href: "/resume-matcher", label: "ATS Scanner", icon: <FaCheckCircle /> },
        { href: "/resume-builder", label: "Resume Builder", icon: <FaFileAlt /> },
        { href: "/job-search", label: "Job Search", icon: <FaSearch /> },
      ]
    },
    {
      title: "General & Settings",
      items: [
        { href: "/forum", label: "Community Forum", icon: <FaComments /> },
        { href: "/blog", label: "Placement Guides", icon: <FaGraduationCap /> },
        { href: "/settings", label: "Settings & API Keys", icon: <FaKey /> },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Top Bar */}
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
                <span className="brand-tag">AI CAREER SUITE</span>
              </div>
            </Link>
          </div>

          {/* Navigation Sections */}
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
                            <span className="nav-link-badge">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Clean Minimalist Footer */}
          <div className="sidebar-footer">
            <div className="sidebar-status-pill">
              <span className="status-dot-pulse" />
              <span className="status-label">Groq AI Connected</span>
            </div>
            <Link href="/settings" className="footer-settings-btn" title="Settings">
              <FaCog />
            </Link>
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
          font-size: 1.1rem;
          color: #0f172a;
        }

        .mobile-hamburger-btn {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          border-radius: 8px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .mobile-hamburger-btn:hover {
          background: #e2e8f0;
        }

        /* Backdrop */
        .sidebar-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
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
          background: #090e17;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          z-index: 1002;
          overflow: hidden;
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sidebar-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 18px 12px 14px;
          overflow-y: auto;
          scrollbar-width: none;
        }

        .sidebar-inner::-webkit-scrollbar {
          display: none;
        }

        /* Brand */
        .sidebar-header {
          padding: 2px 6px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          margin-bottom: 12px;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
        }

        .brand-logo-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 1.05rem;
          box-shadow: 0 2px 10px rgba(124, 58, 237, 0.4);
          flex-shrink: 0;
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-weight: 700;
          font-size: 1.02rem;
          letter-spacing: -0.01em;
          color: #ffffff;
          line-height: 1.2;
        }

        .brand-tag {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #94a3b8;
          margin-top: 1px;
        }

        /* Nav Sections */
        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .nav-section {
          display: flex;
          flex-direction: column;
        }

        .nav-section-title {
          font-size: 0.66rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #64748b;
          padding: 0 10px;
          margin-bottom: 4px;
        }

        .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-nav-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 8px 12px;
          border-radius: 8px;
          color: #cbd5e1 !important;
          font-size: 0.88rem;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .sidebar-nav-link:hover {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.06);
        }

        .sidebar-nav-link.active {
          color: #ffffff !important;
          background: #7c3aed !important;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.4);
        }

        .nav-link-icon {
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          color: #94a3b8;
          transition: color 0.15s ease;
          flex-shrink: 0;
        }

        .sidebar-nav-link:hover .nav-link-icon {
          color: #ffffff;
        }

        .sidebar-nav-link.active .nav-link-icon {
          color: #ffffff !important;
        }

        .nav-link-label {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: inherit;
        }

        .nav-link-badge {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 1px 6px;
          border-radius: 4px;
          background: rgba(124, 58, 237, 0.25);
          color: #c4b5fd;
          border: 1px solid rgba(124, 58, 237, 0.4);
        }

        .sidebar-nav-link.active .nav-link-badge {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.4);
        }

        /* Clean Minimal Footer */
        .sidebar-footer {
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: 6px;
          padding-right: 4px;
        }

        .sidebar-status-pill {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .status-dot-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
          animation: statusPulse 2s infinite;
        }

        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }

        .status-label {
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .footer-settings-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 0.88rem;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .footer-settings-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
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
