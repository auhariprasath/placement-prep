import React, { useState } from 'react';
import { FaBriefcase, FaBuilding, FaSearch, FaStar } from 'react-icons/fa';
import apiService from '../services/apiService';

const InterviewSearch = () => {
  const [formData, setFormData] = useState({
    companyId: '',
    page: '1',
    sort: 'POPULAR',
    jobFunction: 'ANY',
    jobTitle: '',
    location: '',
    locationType: 'ANY',
    receivedOfferOnly: 'false'
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.searchInterviews(formData);
      setResults(response.data);
    } catch (err) {
      setError('Failed to search interviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyClass = (difficulty) => {
    if (!difficulty) return '';
    const diff = difficulty.toLowerCase();
    if (diff.includes('easy')) return 'difficulty-easy';
    if (diff.includes('medium')) return 'difficulty-medium';
    if (diff.includes('hard') || diff.includes('difficult')) return 'difficulty-hard';
    return '';
  };

  const renderInterviews = () => {
    if (!results || !results.data || !results.data.interviews) return null;

    const interviews = results.data.interviews;
    if (!Array.isArray(interviews) || interviews.length === 0) {
      return <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>No interviews found. Try different search criteria.</p>;
    }

    return interviews.map((interview, index) => (
      <div key={index} className="interview-card">
        <h4>{interview.job_title || 'Interview Experience'}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <FaBuilding style={{ color: '#667eea' }} />
          <span style={{ fontWeight: 600 }}>{formData.companyId || 'Company'}</span>
          {interview.location && (
            <span style={{ color: '#64748b', fontSize: '14px' }}>• {interview.location}</span>
          )}
        </div>

        {interview.process_description && (
          <div className="process">
            <strong>Interview Process:</strong>
            <p>{interview.process_description}</p>
          </div>
        )}

        {interview.questions && interview.questions.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            <strong>Sample Questions:</strong>
            <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
              {interview.questions.slice(0, 3).map((q, i) => (
                <li key={i} style={{ color: '#475569', fontSize: '14px', marginBottom: '4px' }}>{q}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
          {interview.difficulty && (
            <span className={`difficulty ${getDifficultyClass(interview.difficulty)}`}>
              {interview.difficulty}
            </span>
          )}
          {interview.experience && (
            <span style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FaStar style={{ color: '#fbbf24' }} />
              {interview.experience}
            </span>
          )}
          {interview.outcome && (
            <span style={{
              fontSize: '13px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: interview.outcome.toLowerCase().includes('accepted') ? '#d1fae5' : '#fee2e2',
              color: interview.outcome.toLowerCase().includes('accepted') ? '#059669' : '#dc2626'
            }}>
              {interview.outcome}
            </span>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="interview-search">
      <div className="page-header">
        <div className="container">
          <h1><FaBriefcase style={{ marginRight: '12px' }} /> Interview Questions</h1>
          <p>Access real interview experiences from top companies</p>
        </div>
      </div>

      <div className="page-content">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Company Name or ID</label>
                <div style={{ position: 'relative' }}>
                  <FaBuilding style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleChange}
                    placeholder="e.g., Amazon or 1138"
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Job Title (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <FaBriefcase style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="e.g., Software Engineer"
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location (Optional)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., New York"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sort By</label>
                <select
                  name="sort"
                  value={formData.sort}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="POPULAR">Most Popular</option>
                  <option value="MOST_RECENT">Most Recent</option>
                  <option value="OLDEST">Oldest First</option>
                  <option value="EASIEST">Easiest First</option>
                  <option value="MOST_DIFFICULT">Most Difficult First</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Job Function</label>
                <select
                  name="jobFunction"
                  value={formData.jobFunction}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="ANY">Any</option>
                  <option value="INFORMATION_TECHNOLOGY">Information Technology</option>
                  <option value="ENGINEERING">Engineering</option>
                  <option value="SALES">Sales</option>
                  <option value="MARKETING">Marketing</option>
                  <option value="FINANCE">Finance</option>
                  <option value="HUMAN_RESOURCES">Human Resources</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Received Offer Only</label>
                <select
                  name="receivedOfferOnly"
                  value={formData.receivedOfferOnly}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? (
                <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span>
              ) : (
                <><FaSearch style={{ marginRight: '8px' }} /> Search Interviews</>
              )}
            </button>
          </form>
        </div>

        {error && <div className="error-message">{error}</div>}

        {results && (
          <div className="results-section">
            <h3>Interview Experiences</h3>
            {renderInterviews()}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSearch;
