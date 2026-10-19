"use client";

import React, { useState } from "react";
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
  FaCheckCircle
} from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", icon: <FaHome /> },
    { href: "/mock-interview", label: "AI Mock Interview", icon: <FaMicrophone />, isHot: true },
    { href: "/domain-selection", label: "Domain Selection", icon: <FaCompass /> },
    { href: "/study-planner", label: "Study Planner", icon: <FaCalendarAlt /> },
    { href: "/ai-agent", label: "AI Assistant", icon: <FaRobot /> },
    { href: "/job-search", label: "Jobs", icon: <FaSearch /> },
    { href: "/interview-search", label: "Interviews", icon: <FaBriefcase /> },
    { href: "/resume-builder", label: "Resume Builder", icon: <FaFileAlt /> },
    { href: "/resume-matcher", label: "ATS Scanner", icon: <FaCheckCircle /> },
    { href: "/compiler", label: "Compiler", icon: <FaCode /> },
    { href: "/forum", label: "Forum", icon: <FaComments /> },
    { href: "/blog", label: "Guides", icon: <FaGraduationCap /> },
  ];

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <Link href="/" className="navbar-brand">
          <div className="brand-logo-icon">
            <FaGraduationCap />
          </div>
          <div className="brand-text">
            <span className="brand-title">PlacementPrep</span>
            <span className="brand-tag">AI SUITE</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-nav desktop-nav">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link-item ${isActive ? "active" : ""} ${item.isHot ? "hot-item" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.isHot && <span className="hot-pill">AI VOICE</span>}
              </Link>
            );
          })}
        </nav>

        {/* Quick Action Button & Mobile Toggle */}
        <div className="navbar-actions">
          <Link href="/mock-interview" className="btn btn-accent action-cta">
            <FaMicrophone /> Practice Interview
          </Link>

          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-links">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`mobile-nav-item ${isActive ? "active" : ""}`}
                >
                  <span className="mobile-nav-icon">{item.icon}</span>
                  <span className="mobile-nav-text">{item.label}</span>
                  {item.isHot && <span className="hot-pill">AI</span>}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .navbar-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 72px;
          background: rgba(9, 13, 22, 0.82);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          z-index: 1000;
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          height: 100%;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
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
          font-size: 1.2rem;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-weight: 800;
          font-size: 1.15rem;
          letter-spacing: -0.01em;
          background: linear-gradient(135deg, #fff 40%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-tag {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #ec4899;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 4px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .desktop-nav::-webkit-scrollbar {
          display: none;
        }

        .nav-link-item {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #94a3b8;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-link-item:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .nav-link-item.active {
          color: #ffffff;
          background: rgba(99, 102, 241, 0.16);
          font-weight: 600;
          border: 1px solid rgba(99, 102, 241, 0.35);
        }

        .nav-link-item.hot-item {
          color: #f472b6;
        }

        .nav-link-item.hot-item:hover {
          color: #ffffff;
        }

        .hot-pill {
          font-size: 0.6rem;
          padding: 2px 6px;
          border-radius: 999px;
          background: var(--grad-accent);
          color: #ffffff;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .action-cta {
          font-size: 0.85rem;
          padding: 8px 14px;
          white-space: nowrap;
        }

        .mobile-toggle-btn {
          display: none;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }

        .mobile-drawer {
          position: absolute;
          top: 72px;
          left: 0;
          right: 0;
          background: #090d16;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 16px 20px 24px;
          box-shadow: 0 20px 30px rgba(0, 0, 0, 0.7);
        }

        .mobile-drawer-links {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 8px;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.04);
          color: #cbd5e1;
          font-size: 0.9rem;
          text-decoration: none;
        }

        .mobile-nav-item.active {
          background: rgba(99, 102, 241, 0.2);
          border: 1px solid rgba(99, 102, 241, 0.4);
          color: #ffffff;
          font-weight: 600;
        }

        @media (max-width: 1200px) {
          .desktop-nav {
            display: none;
          }
          .mobile-toggle-btn {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}
