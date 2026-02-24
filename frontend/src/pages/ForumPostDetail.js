import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaUser, FaClock, FaTag, FaThumbsUp, FaCheckCircle, FaArrowLeft, FaReply, FaCommentAlt } from 'react-icons/fa';
import apiService from '../services/apiService';

const ForumPostDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const fetchPost = async () => {
        try {
            const response = await apiService.getForumPost(postId);
            setPost(response.data);
        } catch (err) {
            console.error('Failed to fetch post');
        } finally {
            setLoading(false);
        }
    };

    const handleUpvote = async () => {
        try {
            await apiService.upvoteForumPost(postId);
            fetchPost();
        } catch (err) {
            console.error('Failed to upvote');
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            await apiService.addForumComment(postId, 1, { content: newComment });
            setNewComment('');
            fetchPost();
        } catch (err) {
            alert('Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Just now';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="loading"><div className="spinner"></div></div>;
    }

    if (!post) {
        return (
            <div className="page-content" style={{ textAlign: 'center' }}>
                <div className="card">
                    <h2>Post not found</h2>
                    <Link to="/forum" className="btn btn-secondary" style={{ marginTop: '20px' }}>
                        <FaArrowLeft style={{ marginRight: '8px' }} /> Back to Forum
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="forum-detail">
            <div className="page-header">
                <div className="container">
                    <div style={{ textAlign: 'left', marginBottom: '16px' }}>
                        <Link to="/forum" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9 }}>
                            <FaArrowLeft /> Back to discussions
                        </Link>
                    </div>
                    <h1>{post.title}</h1>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaUser /> {post.authorName || post.userName} {post.company && <span style={{ opacity: 0.8 }}>({post.company})</span>}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaClock /> {formatDate(post.createdAt)}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaTag /> {post.category}
                        </span>
                    </div>
                </div>
            </div>

            <div className="page-content">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
                    {/* Main Content */}
                    <div>
                        <div className="card" style={{ marginBottom: '24px' }}>
                            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#334155', fontSize: '16px', marginBottom: '24px' }}>
                                {post.content}
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: '20px',
                                borderTop: '1px solid #e2e8f0'
                            }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <button
                                        onClick={handleUpvote}
                                        className="btn btn-secondary"
                                        style={{ gap: '8px', background: '#f1f5f9' }}
                                    >
                                        <FaThumbsUp color="#667eea" /> {post.upvotes} Upvotes
                                    </button>
                                    {post.resolved && (
                                        <span style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            color: '#059669',
                                            fontWeight: '600',
                                            fontSize: '14px'
                                        }}>
                                            <FaCheckCircle /> Resolved
                                        </span>
                                    )}
                                </div>
                                <div style={{ color: '#64748b', fontSize: '14px' }}>
                                    {post.views} views
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="comments-section">
                            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <FaCommentAlt color="#667eea" /> Comments ({post.comments?.length || 0})
                            </h3>

                            {/* Add Comment */}
                            <div className="card" style={{ marginBottom: '24px' }}>
                                <form onSubmit={handleAddComment}>
                                    <div className="form-group">
                                        <label className="form-label">Add a comment</label>
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Share your thoughts..."
                                            className="form-textarea"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                                        {submitting ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </form>
                            </div>

                            {/* Comments List */}
                            {post.comments && post.comments.length > 0 ? (
                                post.comments.map(comment => (
                                    <div key={comment.id} className="card" style={{ marginBottom: '16px', borderLeft: comment.acceptedAnswer ? '4px solid #059669' : 'none' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    background: '#667eea',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '12px'
                                                }}>
                                                    {comment.userName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{comment.userName}</div>
                                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{formatDate(comment.createdAt)}</div>
                                                </div>
                                            </div>
                                            {comment.acceptedAnswer && (
                                                <span style={{ color: '#059669', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <FaCheckCircle /> Accepted Answer
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ color: '#475569', lineHeight: '1.6', marginBottom: '16px' }}>
                                            {comment.content}
                                        </div>
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <button style={{ background: 'none', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <FaThumbsUp size={12} /> {comment.upvotes}
                                            </button>
                                            <button style={{ background: 'none', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <FaReply size={12} /> Reply
                                            </button>
                                        </div>

                                        {/* Replies */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div style={{ marginTop: '16px', paddingLeft: '24px', borderLeft: '2px solid #e2e8f0' }}>
                                                {comment.replies.map(reply => (
                                                    <div key={reply.id} style={{ marginBottom: '12px' }}>
                                                        <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>{reply.userName}</div>
                                                        <div style={{ color: '#475569', fontSize: '13px' }}>{reply.content}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="card" style={{ textAlign: 'center', color: '#64748b' }}>
                                    No comments yet. Be the first to join the conversation!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="sidebar">
                        <div className="card">
                            <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Community Guidelines</h3>
                            <ul style={{ paddingLeft: '20px', color: '#64748b', fontSize: '14px', lineHeight: '1.8' }}>
                                <li>Be respectful to others</li>
                                <li>Stay on topic</li>
                                <li>Don't spam or post advertisements</li>
                                <li>Help others whenever possible</li>
                            </ul>
                        </div>

                        <div className="card" style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)' }}>
                            <h3 style={{ marginBottom: '12px', fontSize: '18px', color: '#4338ca' }}>Related Discussions</h3>
                            <p style={{ fontSize: '14px', color: '#64748b' }}>Coming soon: Smart recommendations based on this topic.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForumPostDetail;
