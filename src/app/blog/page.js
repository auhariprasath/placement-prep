"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FaGraduationCap,
  FaHeart,
  FaClock,
  FaUser,
  FaBookOpen,
  FaSearch,
  FaTimes,
  FaSpinner
} from "react-icons/fa";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeArticle, setActiveArticle] = useState(null);
  const [mounted, setMounted] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (keyword) q.set("keyword", keyword);
      const res = await fetch(`/api/blog?${q.toString()}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (e) {
      console.error("Failed to fetch blog posts:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchArticles();
  }, []);

  // Lock body scroll and listen for Escape key when article modal is open
  useEffect(() => {
    if (activeArticle) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          setActiveArticle(null);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [activeArticle]);

  const handleLike = async (postId, e) => {
    e.stopPropagation();
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like", postId }),
      });
      if (res.ok) {
        const data = await res.json();
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, likes: data.likes } : p))
        );
      }
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  return (
    <div className="page-wrapper container">
      <div className="page-header">
        <span className="badge-tag">
          <FaGraduationCap style={{ marginRight: "6px" }} /> Expert Placement Guides
        </span>
        <h1 className="page-title">Placement Preparation Articles & Masterclasses</h1>
        <p className="page-subtitle">
          Step-by-step roadmaps, algorithmic strategies, and behavioral coaching to elevate your placement preparation.
        </p>
      </div>

      {/* Search Bar */}
      <div className="blog-search-card card-glass">
        <div className="search-wrap">
          <FaSearch className="search-icon" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchArticles()}
            placeholder="Search articles on DSA, behavioral rounds, SQL queries, or roadmaps..."
            className="search-input"
          />
        </div>
        <button onClick={fetchArticles} className="btn btn-primary">
          Search
        </button>
      </div>

      {/* Articles Grid */}
      <div className="articles-grid">
        {loading ? (
          <div style={{ textAlign: "center", gridColumn: "1 / -1", padding: "40px" }}>
            <FaSpinner className="spin" style={{ fontSize: "2rem", color: "#818cf8" }} />
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              onClick={() => setActiveArticle(post)}
              className="article-card card-glass"
            >
              <div className="article-top">
                <span className="pill-chip">{post.category}</span>
                <span className="read-time">
                  <FaClock style={{ marginRight: "4px" }} /> {post.readTime}
                </span>
              </div>

              <h2 className="article-title">{post.title}</h2>
              <p className="article-summary">{post.summary}</p>

              <div className="article-footer">
                <div className="author-line">
                  <FaUser style={{ marginRight: "6px", color: "#818cf8" }} />
                  <span>{post.author}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleLike(post.id, e)}
                  className="like-btn"
                >
                  <FaHeart style={{ color: "#ec4899" }} /> {post.likes || 0}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Article Detail Modal (Top-level Overlay) */}
      {activeArticle &&
        (mounted && typeof document !== "undefined" ? (
          createPortal(
            <div
              className="modal-backdrop"
              onClick={() => setActiveArticle(null)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-article-title"
            >
              <div
                className="article-modal card-glass"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-top-bar">
                  <span className="pill-chip">{activeArticle.category}</span>
                  <button
                    onClick={() => setActiveArticle(null)}
                    className="close-btn"
                    title="Close"
                    aria-label="Close"
                  >
                    <FaTimes />
                  </button>
                </div>

                <h1 id="modal-article-title" className="modal-article-title">
                  {activeArticle.title}
                </h1>
                <div className="modal-meta-line">
                  <span>By {activeArticle.author}</span> •{" "}
                  <span>{activeArticle.date}</span> •{" "}
                  <span>{activeArticle.readTime}</span>
                </div>

                <div className="article-body-content">
                  {activeArticle.content.split("\n\n").map((para, i) => {
                    if (para.startsWith("### ")) {
                      return (
                        <h3 key={i} className="content-h3">
                          {para.replace("### ", "")}
                        </h3>
                      );
                    }
                    if (para.startsWith("1. ") || para.startsWith("- ")) {
                      return (
                        <div key={i} className="content-list-block">
                          {para.split("\n").map((line, lIdx) => (
                            <p key={lIdx} style={{ marginBottom: "6px" }}>
                              {line}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return (
                      <p key={i} className="content-p">
                        {para}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>,
            document.body
          )
        ) : (
          <div
            className="modal-backdrop"
            onClick={() => setActiveArticle(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-article-title"
          >
            <div
              className="article-modal card-glass"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-top-bar">
                <span className="pill-chip">{activeArticle.category}</span>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="close-btn"
                  title="Close"
                  aria-label="Close"
                >
                  <FaTimes />
                </button>
              </div>

              <h1 id="modal-article-title" className="modal-article-title">
                {activeArticle.title}
              </h1>
              <div className="modal-meta-line">
                <span>By {activeArticle.author}</span> •{" "}
                <span>{activeArticle.date}</span> •{" "}
                <span>{activeArticle.readTime}</span>
              </div>

              <div className="article-body-content">
                {activeArticle.content.split("\n\n").map((para, i) => {
                  if (para.startsWith("### ")) {
                    return (
                      <h3 key={i} className="content-h3">
                        {para.replace("### ", "")}
                      </h3>
                    );
                  }
                  if (para.startsWith("1. ") || para.startsWith("- ")) {
                    return (
                      <div key={i} className="content-list-block">
                        {para.split("\n").map((line, lIdx) => (
                          <p key={lIdx} style={{ marginBottom: "6px" }}>
                            {line}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <p key={i} className="content-p">
                      {para}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

      <style jsx>{`
        .blog-search-card {
          max-width: 760px;
          margin: 0 auto 36px;
          padding: 14px 20px;
          display: flex;
          gap: 12px;
          align-items: center;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .search-wrap {
          flex: 1;
          display: flex;
          align-items: center;
        }

        .search-icon {
          color: #6366f1;
          margin-right: 10px;
        }

        .search-input {
          background: transparent;
          border: none;
          color: #0f172a;
          width: 100%;
          outline: none;
          font-size: 0.95rem;
        }

        .articles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .article-card {
          padding: 28px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .article-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .read-time {
          font-size: 0.75rem;
          color: #64748b;
          display: flex;
          align-items: center;
        }

        .article-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.4;
          margin-bottom: 12px;
        }

        .article-summary {
          color: #475569;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 20px;
          flex-grow: 1;
        }

        .article-footer {
          border-top: 1px solid #f1f5f9;
          padding-top: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .author-line {
          font-size: 0.85rem;
          color: #64748b;
          display: flex;
          align-items: center;
        }

        .like-btn {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #475569;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .like-btn:hover {
          background: #fdf2f8;
          color: #be185d;
        }

        /* Modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
        }

        .article-modal {
          width: min(760px, calc(100vw - 32px));
          max-height: calc(100vh - 48px);
          overflow-y: auto;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
          padding: 32px;
          position: relative;
          z-index: 1001;
        }

        .modal-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          position: sticky;
          top: -32px;
          background: #ffffff;
          padding-top: 6px;
          padding-bottom: 8px;
          margin-top: -6px;
          z-index: 10;
        }

        .close-btn {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #475569;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: #fee2e2;
          color: #ef4444;
          border-color: #fca5a5;
          transform: scale(1.05);
        }

        .modal-article-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.35;
          margin-bottom: 10px;
        }

        .modal-meta-line {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 24px;
        }

        .article-body-content {
          color: #334155;
          font-size: 1rem;
          line-height: 1.8;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
          padding-bottom: 12px;
        }

        .content-h3 {
          color: #0f172a;
          font-size: 1.25rem;
          font-weight: 700;
          margin: 20px 0 10px;
        }

        .content-p {
          margin-bottom: 16px;
        }

        .content-list-block {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #6366f1;
          color: #334155;
          padding: 12px 18px;
          border-radius: 0 8px 8px 0;
          margin-bottom: 16px;
          font-size: 0.95rem;
        }

        @media (max-width: 1024px) {
          .articles-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .articles-grid {
            grid-template-columns: 1fr;
          }
          .article-modal {
            padding: 20px;
          }
          .modal-top-bar {
            top: -20px;
          }
          .modal-article-title {
            font-size: 1.35rem;
          }
        }
      `}</style>
    </div>
  );
}
