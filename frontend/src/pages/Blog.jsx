import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBlog, FaHeart, FaEye, FaSearch, FaPlus } from 'react-icons/fa';
import apiService from '../services/apiService';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Interview Experience', 'Placement Journey', 'Company Insights', 'Tips & Tricks', 'Success Stories'];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await apiService.getBlogPosts();
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
      const response = await apiService.searchBlogPosts(searchQuery);
      setPosts(response.data.content || []);
    } catch (err) {
      console.error('Search failed');
    }
  };

  const handleLike = async (postId) => {
    try {
      await apiService.likeBlogPost(postId);
      fetchPosts();
    } catch (err) {
      console.error('Failed to like');
    }
  };

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="blog">
      <div className="page-header">
        <div className="container">
          <h1><FaBlog style={{ marginRight: '12px' }} /> Placement Stories</h1>
          <p>Read and share placement experiences from students and professionals</p>
        </div>
      </div>

      <div className="page-content">
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
              <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button onClick={handleSearch} className="btn btn-secondary">Search</button>
            <Link to="/blog/new" className="btn btn-primary">
              <FaPlus style={{ marginRight: '8px' }} /> Share Your Story
            </Link>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  background: selectedCategory === cat ? '#667eea' : '#f1f5f9',
                  color: selectedCategory === cat ? 'white' : '#64748b'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {filteredPosts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>
              <p style={{ color: '#64748b' }}>No stories yet. Be the first to share your experience!</p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div key={post.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                {post.coverImage && (
                  <img 
                    src={post.coverImage} 
                    alt={post.title}
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <span style={{ 
                    fontSize: '12px', 
                    padding: '4px 12px', 
                    background: '#f1f5f9', 
                    borderRadius: '12px',
                    color: '#64748b'
                  }}>
                    {post.category}
                  </span>
                  <Link to={`/blog/post/${post.id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ color: '#1a202c', marginTop: '12px', marginBottom: '8px', fontSize: '18px' }}>
                      {post.title}
                    </h3>
                  </Link>
                  <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5', marginBottom: '16px' }}>
                    {post.excerpt || post.content.substring(0, 150)}...
                  </p>
                </div>
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        background: '#667eea',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px'
                      }}>
                        {post.userName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 500, color: '#1a202c' }}>{post.userName}</p>
                        <p style={{ fontSize: '12px', color: '#64748b' }}>{post.company} • {post.role}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FaEye size={14} /> {post.views}
                      </span>
                      <button 
                        onClick={() => handleLike(post.id)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '13px',
                          color: '#64748b'
                        }}
                      >
                        <FaHeart size={14} color="#ef4444" /> {post.likes}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
