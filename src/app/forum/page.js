"use client";

import React, { useState, useEffect } from "react";
import {
  FaComments,
  FaThumbsUp,
  FaUserCircle,
  FaPlus,
  FaSearch,
  FaFilter,
  FaCommentDots,
  FaSpinner,
  FaCheck
} from "react-icons/fa";

export default function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("All");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);

  // New post modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("Placements");
  const [newAuthor, setNewAuthor] = useState("");

  // Comment state per post
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentInput, setCommentInput] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (category && category !== "All") q.set("category", category);
      if (keyword) q.set("keyword", keyword);

      const res = await fetch(`/api/forum?${q.toString()}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (e) {
      console.error("Error loading forum posts:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const handleUpvote = async (postId) => {
    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upvote", postId }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, upvotes: (p.upvotes || 0) + 1 } : p))
        );
      }
    } catch (e) {
      console.error("Upvote failed:", e);
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentInput.trim()) return;
    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "comment",
          postId,
          commentText: commentInput,
          author: "Campus Peer",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, comments: [...(p.comments || []), data.comment] }
              : p
          )
        );
        setCommentInput("");
        setActiveCommentPostId(null);
      }
    } catch (e) {
      console.error("Add comment failed:", e);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          category: newCategory,
          author: newAuthor || "Placement Candidate",
        }),
      });

      if (res.ok) {
        setModalOpen(false);
        setNewTitle("");
        setNewContent("");
        fetchPosts();
      }
    } catch (err) {
      console.error("Create post failed:", err);
    }
  };

  return (
    <div className="page-wrapper container">
      <div className="page-header">
        <span className="badge-tag">
          <FaComments style={{ marginRight: "6px" }} /> Peer Placement Network
        </span>
        <h1 className="page-title">Community Discussion Forum</h1>
        <p className="page-subtitle">
          Ask questions, discuss company online assessments, share interview experiences, and prepare together with engineering peers.
        </p>
      </div>

      {/* Top Controls */}
      <div className="forum-controls-bar card-glass">
        <div className="search-wrap">
          <FaSearch className="search-icon" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchPosts()}
            placeholder="Search discussion threads, questions, or companies..."
            className="search-input"
          />
        </div>

        <div className="category-chips">
          {["All", "Placements", "Exam Patterns", "Resume & Portfolio"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`cat-chip ${category === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button onClick={() => setModalOpen(true)} className="btn btn-primary new-post-btn">
          <FaPlus /> Ask Question
        </button>
      </div>

      {/* New Post Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-dialog card-glass">
            <h2 className="modal-title">Ask a Community Question</h2>
            <form onSubmit={handleCreatePost}>
              <div className="form-group">
                <label className="form-label">Question / Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Tips for clearing Cognizant GenC Elevate coding test?"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="form-select"
                >
                  <option value="Placements">Placements</option>
                  <option value="Exam Patterns">Exam Patterns</option>
                  <option value="Resume & Portfolio">Resume & Portfolio</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Explanation</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Provide context, constraints, and specific queries..."
                  className="form-textarea"
                  style={{ minHeight: "110px" }}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-accent">
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="posts-container">
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <FaSpinner className="spin" style={{ fontSize: "2rem", color: "#818cf8" }} />
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card card-glass">
              <div className="post-header-line">
                <div className="author-box">
                  <FaUserCircle className="author-icon" />
                  <div>
                    <span className="author-name">{post.author}</span>
                    <span className="author-role">{post.authorRole || "Student"}</span>
                  </div>
                </div>
                <span className="pill-chip">{post.category}</span>
              </div>

              <h3 className="post-title">{post.title}</h3>
              <p className="post-body">{post.content}</p>

              {/* Action Bar */}
              <div className="post-actions-bar">
                <button
                  type="button"
                  onClick={() => handleUpvote(post.id)}
                  className="btn-action-upvote"
                >
                  <FaThumbsUp /> {post.upvotes || 0} Upvotes
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)
                  }
                  className="btn-action-comment"
                >
                  <FaCommentDots /> {(post.comments || []).length} Replies
                </button>
              </div>

              {/* Comment Thread */}
              {activeCommentPostId === post.id && (
                <div className="comment-thread">
                  <div className="existing-comments">
                    {(post.comments || []).map((c) => (
                      <div key={c.id} className="comment-bubble">
                        <span className="comment-author">{c.author}:</span>
                        <p>{c.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="comment-input-row">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Write your advice or answer..."
                      className="form-input flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddComment(post.id)}
                      className="btn btn-primary"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .forum-controls-bar {
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .search-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: var(--radius-sm);
          padding: 8px 14px;
          min-width: 240px;
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
          font-size: 0.9rem;
        }

        .category-chips {
          display: flex;
          gap: 8px;
        }

        .cat-chip {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #334155;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cat-chip.active {
          background: var(--grad-primary);
          color: white;
          border-color: transparent;
        }

        .new-post-btn {
          white-space: nowrap;
        }

        /* Modal */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }

        .modal-dialog {
          width: 100%;
          max-width: 580px;
          padding: 32px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .modal-title {
          font-size: 1.4rem;
          color: #0f172a;
          margin-bottom: 20px;
          font-weight: 800;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 20px;
        }

        /* Posts */
        .posts-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .post-card {
          padding: 28px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }

        .post-header-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .author-box {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .author-icon {
          font-size: 1.8rem;
          color: #6366f1;
        }

        .author-name {
          font-weight: 700;
          font-size: 0.95rem;
          color: #0f172a;
          display: block;
        }

        .author-role {
          font-size: 0.78rem;
          color: #64748b;
        }

        .post-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .post-body {
          color: #475569;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 18px;
        }

        .post-actions-bar {
          display: flex;
          gap: 14px;
          border-top: 1px solid #f1f5f9;
          padding-top: 14px;
        }

        .btn-action-upvote, .btn-action-comment {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #334155;
          padding: 6px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .btn-action-upvote:hover {
          background: #eef2ff;
          color: #4338ca;
        }

        .btn-action-comment:hover {
          background: #fdf2f8;
          color: #be185d;
        }

        .comment-thread {
          margin-top: 18px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-sm);
          padding: 16px;
        }

        .existing-comments {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 14px;
        }

        .comment-bubble {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.88rem;
          color: #334155;
        }

        .comment-author {
          font-weight: 700;
          color: #4f46e5;
          margin-right: 6px;
        }

        .comment-input-row {
          display: flex;
          gap: 10px;
        }
      `}</style>
    </div>
  );
}
