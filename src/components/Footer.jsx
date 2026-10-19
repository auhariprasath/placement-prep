"use client";

import React from "react";
import Link from "next/link";
import { FaGraduationCap, FaGithub, FaLinkedin, FaHeart } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col-brand">
            <div className="footer-brand">
              <div className="footer-logo">
                <FaGraduationCap />
              </div>
              <span className="footer-title">PlacementPrep</span>
            </div>
            <p className="footer-desc">
              Next-generation AI-powered placement preparation suite. Master technical coding rounds, simulate voice mock interviews, and land your dream product company offer.
            </p>
            <div className="footer-socials">
              <a href="https://github.com/auhariprasath/placement-prep" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaGithub />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaLinkedin />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>AI Prep Suite</h4>
            <ul>
              <li><Link href="/mock-interview">AI Voice Mock Interview</Link></li>
              <li><Link href="/domain-selection">Domain Selection & Courses</Link></li>
              <li><Link href="/study-planner">Smart Study Planner</Link></li>
              <li><Link href="/ai-agent">AI Placement Assistant</Link></li>
              <li><Link href="/resume-matcher">ATS Resume Scanner</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Practice & Placement</h4>
            <ul>
              <li><Link href="/job-search">Explore Placement Jobs</Link></li>
              <li><Link href="/interview-search">Company Questions Bank</Link></li>
              <li><Link href="/resume-builder">Interactive Resume Builder</Link></li>
              <li><Link href="/compiler">Multi-Language Compiler</Link></li>
              <li><Link href="/forum">Community Discussion</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Deployment Ready</h4>
            <div className="deploy-badge-box">
              <span className="badge-tag" style={{ margin: 0 }}>Vercel Ready</span>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "8px" }}>
                Full-stack Next.js architecture with zero database setup needed. Instant 1-click cloud deploy.
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 PlacementPrep. Built with <FaHeart style={{ color: "#ec4899", verticalAlign: "middle" }} /> for ambitious engineers.</p>
        </div>
      </div>

      <style jsx>{`
        .footer-root {
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          padding: 60px 0 30px;
          position: relative;
          z-index: auto;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.2fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .footer-logo {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--grad-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1rem;
        }

        .footer-title {
          font-weight: 800;
          font-size: 1.2rem;
          color: #0f172a;
        }

        .footer-desc {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .footer-socials {
          display: flex;
          gap: 12px;
        }

        .social-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #475569;
          transition: all 0.2s ease;
        }

        .social-icon:hover {
          background: var(--grad-primary);
          color: white;
          transform: translateY(-2px);
        }

        .footer-col h4 {
          color: #0f172a;
          font-size: 0.92rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 16px;
        }

        .footer-col ul {
          list-style: none;
        }

        .footer-col li {
          margin-bottom: 10px;
        }

        .footer-col a {
          color: #64748b;
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }

        .footer-col a:hover {
          color: #4f46e5;
        }

        .deploy-badge-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 16px;
          border-radius: 12px;
        }

        .footer-bottom {
          border-top: 1px solid #f1f5f9;
          padding-top: 24px;
          text-align: center;
          color: #64748b;
          font-size: 0.85rem;
        }

        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
