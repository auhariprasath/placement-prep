import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaComments, FaThumbsUp, FaCheckCircle, FaSearch, FaPlus, FaUser } from 'react-icons/fa';
import apiService from '../services/apiService';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General', authorName: '', company: '' });

  const categories = ['General', 'Interview Prep', 'Resume Help', 'Coding', 'Career Advice', 'Company Specific'];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await apiService.getForumPosts();
      setPosts(response.data.content || []);
    } catch (err) {
      console.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchPosts();
      return;
    }
    try {
      const response = await apiService.searchForumPosts(searchQuery);
      setPosts(response.data.content || []);
    } catch (err) {
      console.error('Search failed');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await apiService.createForumPost({ ...newPost, userId: 1 });
      setShowNewPost(false);
      setNewPost({ title: '', content: '', category: 'General', authorName: '', company: '' });
      fetchPosts();
    } catch (err) {
      alert('Failed to create post');
    }
  };

  const handleUpvote = async (postId) => {
    try {
      await apiService.upvoteForumPost(postId);
      fetchPosts();
    } catch (err) {
      console.error('Failed to upvote');
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="forum">
      <div className="page-header">
        <div className="container">
          <h1><FaComments style={{ marginRight: '12px' }} /> Community Forum</h1>
          <p>Ask questions, share knowledge, and connect with fellow students</p>
        </div>
      </div>

      <div className="page-content">
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
              <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button onClick={handleSearch} className="btn btn-secondary">Search</button>
            <button onClick={() => setShowNewPost(true)} className="btn btn-primary">
              <FaPlus style={{ marginRight: '8px' }} /> New Discussion
            </button>
          </div>
        </div>

        {showNewPost && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '16px' }}>Create New Discussion</h3>
            <form onSubmit={handleCreatePost}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    value={newPost.authorName}
                    onChange={(e) => setNewPost({ ...newPost, authorName: e.target.value })}
                    className="form-input"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label className="form-label">Company (Optional)</label>
                  <input
                    type="text"
                    value={newPost.company}
                    onChange={(e) => setNewPost({ ...newPost, company: e.target.value })}
                    className="form-input"
                    placeholder="Targeting/Working at..."
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="form-select"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="form-textarea"
                  rows="5"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn btn-primary">Post</button>
                <button type="button" onClick={() => setShowNewPost(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="posts-list">
          {posts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#64748b' }}>No discussions yet. Be the first to start one!</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="card" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <Link to={`/forum/post/${post.id}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ color: '#667eea', marginBottom: '8px' }}>{post.title}</h3>
                    </Link>
                    <p style={{ color: '#64748b', marginBottom: '12px', lineHeight: '1.5' }}>
                      {post.content.substring(0, 200)}...
                    </p>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaUser size={12} /> {post.authorName || post.userName}
                        {post.company && <span style={{ marginLeft: '4px', fontStyle: 'italic' }}>({post.company})</span>}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        padding: '4px 12px',
                        background: '#f1f5f9',
                        borderRadius: '12px',
                        color: '#64748b'
                      }}>
                        {post.category}
                      </span>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>
                        {post.commentCount} comments
                      </span>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>
                        {post.views} views
                      </span>
                      {post.resolved && (
                        <span style={{
                          fontSize: '12px',
                          padding: '4px 12px',
                          background: '#d1fae5',
                          borderRadius: '12px',
                          color: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <FaCheckCircle size={12} /> Resolved
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleUpvote(post.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <FaThumbsUp size={20} color="#667eea" />
                    <span style={{ fontSize: '14px', color: '#64748b' }}>{post.upvotes}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Forum;
