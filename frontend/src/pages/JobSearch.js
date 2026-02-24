import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaBriefcase, FaExternalLinkAlt } from 'react-icons/fa';
import apiService from '../services/apiService';

const JobSearch = () => {
  const [formData, setFormData] = useState({
    query: '',
    location: '',
    locationType: 'ANY',
    limit: 10,
    remoteOnly: false
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.searchJobs(formData);
      setResults(response.data);
    } catch (err) {
      setError('Failed to search jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderJobs = () => {
    if (!results || !results.data || !results.data.jobs) return null;

    const jobs = results.data.jobs;
    if (!Array.isArray(jobs) || jobs.length === 0) {
      return <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>No jobs found. Try different search criteria.</p>;
    }

    return jobs.map((job, index) => (
      <div key={index} className="job-card">
        <h4>{job.job_title || 'Job Title'}</h4>
        <div className="company">{job.company_name || 'Company Name'}</div>
        <div className="location">
          <FaMapMarkerAlt style={{ marginRight: '6px' }} />
          {job.location_name || 'Location'}
          {job.job_is_remote && <span style={{ marginLeft: '10px', color: '#667eea' }}>(Remote)</span>}
        </div>
        {job.job_description && (
          <div className="description">
            {job.job_description.substring(0, 200)}...
          </div>
        )}
        {job.job_apply_link && (
          <a
            href={job.job_apply_link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '12px',
              color: '#667eea',
              fontWeight: 500
            }}
          >
            Apply Now <FaExternalLinkAlt size={12} />
          </a>
        )}
      </div>
    ));
  };

  return (
    <div className="job-search">
      <div className="page-header">
        <div className="container">
          <h1><FaBriefcase style={{ marginRight: '12px' }} /> Job Search</h1>
          <p>Find your dream job from thousands of listings on Glassdoor</p>
        </div>
      </div>

      <div className="page-content">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Job Role</label>
                <div style={{ position: 'relative' }}>
                  <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    name="query"
                    value={formData.query}
                    onChange={handleChange}
                    placeholder="e.g., Software Engineer"
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <div style={{ position: 'relative' }}>
                  <FaMapMarkerAlt style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., New York"
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location Type</label>
                <select
                  name="locationType"
                  value={formData.locationType}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="ANY">Any</option>
                  <option value="CITY">City</option>
                  <option value="STATE">State</option>
                  <option value="COUNTRY">Country</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Results Limit</label>
                <select
                  name="limit"
                  value={formData.limit}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="checkbox-group" style={{ marginBottom: '20px' }}>
              <input
                type="checkbox"
                id="remoteOnly"
                name="remoteOnly"
                checked={formData.remoteOnly}
                onChange={handleChange}
              />
              <label htmlFor="remoteOnly">Remote Only</label>
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
                'Search Jobs'
              )}
            </button>
          </form>
        </div>

        {error && <div className="error-message">{error}</div>}

        {results && (
          <div className="results-section">
            <h3>Search Results</h3>
            {renderJobs()}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
