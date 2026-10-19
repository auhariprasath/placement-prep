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
  FaKey
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
      if (window.innerWidth > 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Single menu group with exact item order from the first design
  const menuItems = [
    { href: "/", label: "Home", icon: <FaHome /> },
    { href: "/mock-interview", label: "AI Mock Interview", icon: <FaMicrophone /> },
    { href: "/domain-selection", label: "Domain Selection", icon: <FaCompass /> },
    { href: "/study-planner", label: "Study Planner", icon: <FaCalendarAlt /> },
    { href: "/ai-agent", label: "AI Copilot", icon: <FaRobot /> },
    { href: "/job-search", label: "Job Search", icon: <FaSearch /> },
    { href: "/interview-search", label: "Interviews", icon: <FaBriefcase /> },
    { href: "/resume-matcher", label: "ATS Scanner", icon: <FaCheckCircle /> },
    { href: "/resume-builder", label: "Resume Builder", icon: <FaFileAlt /> },
    { href: "/compiler", label: "Online Compiler", icon: <FaCode /> },
    { href: "/forum", label: "Community Forum", icon: <FaComments /> },
    { href: "/blog", label: "Placement Guides", icon: <FaGraduationCap /> },
    { href: "/settings", label: "Groq API Settings", icon: <FaKey /> },
  ];

  return (
    <>
      {/* Mobile Top Bar (Only visible <= 768px) */}
      <header className="mobile-topbar">
        <Link href="/" className="mobile-brand">
          <div className="brand-logo-icon">
            <FaGraduationCap />
          </div>
          <span className="brand-title" style={{ color: "#0f172a" }}>PlacementPrep</span>
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

      {/* Sideways Navigation Sidebar: Dark Navy #111827 */}
      <aside
        className={`sidebar-aside ${mobileOpen ? "open" : ""}`}
        style={{
          backgroundColor: "#111827",
          width: "280px",
        }}
      >
        <div className="sidebar-inner">
          {/* Brand Header: Clean logo and title, no extra subtitle or divider */}
          <div className="sidebar-header">
            <Link href="/" className="sidebar-brand">
              <div className="brand-logo-icon">
                <FaGraduationCap />
              </div>
              <span
                className="brand-title"
                style={{ color: "#ffffff", fontWeight: 700, fontSize: "1.08rem" }}
              >
                PlacementPrep
              </span>
            </Link>
          </div>

          {/* Single Section Heading: MAIN MENU */}
          <div className="menu-section-header">
            <span
              className="menu-heading-text"
              style={{
                color: "#94a3b8",
                fontWeight: 700,
                fontSize: "0.72rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              MAIN MENU
            </span>
          </div>

          {/* Navigation Links: Horizontal layout with icon on left and label beside it */}
          <nav className="sidebar-nav">
            <ul className="nav-list">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href} className="nav-list-item">
                    <Link
                      href={item.href}
                      className={`sidebar-nav-link ${isActive ? "active" : ""}`}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 14px",
                        borderRadius: "6px",
                        textDecoration: "none",
                        width: "100%",
                        boxSizing: "border-box",
                        backgroundColor: isActive ? "rgba(168, 85, 247, 0.14)" : "transparent",
                        borderLeft: isActive ? "3px solid #a855f7" : "3px solid transparent",
                        color: isActive ? "#c084fc" : "#94a3b8",
                      }}
                    >
                      <span
                        className="nav-link-icon"
                        style={{
                          width: "20px",
                          height: "20px",
                          fontSize: "1.05rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          color: isActive ? "#a855f7" : "#94a3b8",
                        }}
                      >
                        {item.icon}
                      </span>
                      <span
                        className="nav-link-label"
                        style={{
                          flex: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontSize: "0.9rem",
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? "#c084fc" : "#94a3b8",
                        }}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
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

        /* Sidebar Container: Dark Navy #111827 and 280px width */
        .sidebar-aside {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 280px;
          height: 100vh;
          background-color: #111827;
          border-right: 1px solid #1f2937;
          z-index: 1002;
          overflow: hidden;
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sidebar-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 22px 14px 20px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #374151 transparent;
        }

        .sidebar-inner::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-inner::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 4px;
        }

        /* Brand Header: Logo + Title without extra subtitle or divider */
        .sidebar-header {
          padding: 0 6px 18px;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .brand-logo-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-size: 1.1rem;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.35);
        }

        /* Section Heading: Small uppercase in muted gray-blue */
        .menu-section-header {
          padding: 6px 12px 10px;
        }

        /* Nav List & Items */
        .sidebar-nav {
          flex: 1;
        }

        .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin: 0;
          padding: 0;
        }

        .nav-list-item {
          width: 100%;
        }

        .sidebar-nav-link:hover {
          color: #f1f5f9 !important;
          background-color: rgba(255, 255, 255, 0.06) !important;
        }

        /* Responsive: Only collapse on small mobile devices (<= 768px) */
        @media (max-width: 768px) {
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
