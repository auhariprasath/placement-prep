import React, { useState } from 'react';
import { FaFileAlt, FaUpload, FaCheckCircle, FaTimesCircle, FaLightbulb, FaChartBar } from 'react-icons/fa';
import apiService from '../services/apiService';

const ResumeMatcher = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !jobDescription.trim()) {
      alert('Please upload a resume and enter a job description');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);
      
      const response = await apiService.analyzeResume(formData);
      setResult(response.data);
    } catch (err) {
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#059669';
    if (score >= 60) return '#d97706';
    return '#dc2626';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <div className="resume-matcher">
      <div className="page-header">
        <div className="container">
          <h1><FaFileAlt style={{ marginRight: '12px' }} /> Resume Matcher</h1>
          <p>Check how well your resume matches job descriptions - ATS Score Checker</p>
        </div>
      </div>

      <div className="page-content">
        {!result ? (
          <div className="card">
            <h2 style={{ marginBottom: '24px', color: '#1a202c' }}>Upload Your Resume</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Resume (PDF)</label>
                <div 
                  style={{ 
                    border: '2px dashed #ddd', 
                    borderRadius: '12px', 
                    padding: '40px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: resumeFile ? '#f0fdf4' : '#f8fafc'
                  }}
                  onClick={() => document.getElementById('resume-input').click()}
                >
                  <input
                    id="resume-input"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <FaUpload size={40} color="#667eea" style={{ marginBottom: '12px' }} />
                  <p style={{ color: '#64748b' }}>
                    {resumeFile ? resumeFile.name : 'Click to upload your resume (PDF)'}
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="form-textarea"
                  rows="8"
                  placeholder="Paste the job description here..."
                  required
                />
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
                  'Analyze Resume'
                )}
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* Overall Score */}
            <div className="card" style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ marginBottom: '20px' }}>ATS Compatibility Score</h2>
              <div 
                style={{ 
                  width: '150px', 
                  height: '150px', 
                  borderRadius: '50%', 
                  background: `conic-gradient(${getScoreColor(result.atsScore)} ${result.atsScore * 3.6}deg, #e2e8f0 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}
              >
                <div style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  background: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '36px', fontWeight: 'bold', color: getScoreColor(result.atsScore) }}>
                    {result.atsScore}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>/ 100</span>
                </div>
              </div>
              <p style={{ 
                fontSize: '18px', 
                fontWeight: 600, 
                color: getScoreColor(result.atsScore),
                marginBottom: '8px'
              }}>
                {getScoreLabel(result.atsScore)}
              </p>
              <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto' }}>
                {result.overallFeedback}
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaChartBar /> Score Breakdown
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Keyword Match</p>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: getScoreColor(result.keywordMatchScore) }}>
                    {result.keywordMatchScore}%
                  </p>
                </div>
                <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Format</p>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: getScoreColor(result.formatScore) }}>
                    {result.formatScore}%
                  </p>
                </div>
                <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>Content</p>
                  <p style={{ fontSize: '32px', fontWeight: 'bold', color: getScoreColor(result.contentScore) }}>
                    {result.contentScore}%
                  </p>
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              <div className="card">
                <h4 style={{ marginBottom: '16px', color: '#059669', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaCheckCircle /> Matched Keywords
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {result.matchedKeywords?.map((keyword, index) => (
                    <span key={index} style={{ 
                      padding: '6px 12px', 
                      background: '#d1fae5', 
                      color: '#059669',
                      borderRadius: '16px',
                      fontSize: '13px'
                    }}>
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card">
                <h4 style={{ marginBottom: '16px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaTimesCircle /> Missing Keywords
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {result.missingKeywords?.map((keyword, index) => (
                    <span key={index} style={{ 
                      padding: '6px 12px', 
                      background: '#fee2e2', 
                      color: '#dc2626',
                      borderRadius: '16px',
                      fontSize: '13px'
                    }}>
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaLightbulb /> Suggestions for Improvement
              </h3>
              <ul style={{ paddingLeft: '20px' }}>
                {result.suggestions?.map((suggestion, index) => (
                  <li key={index} style={{ color: '#475569', marginBottom: '8px', lineHeight: '1.6' }}>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            {result.improvements?.length > 0 && (
              <div className="card" style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px' }}>Priority Improvements</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {result.improvements.map((item, index) => (
                    <div key={index} style={{ 
                      padding: '16px', 
                      background: '#fef3c7', 
                      borderRadius: '8px',
                      borderLeft: '4px solid #d97706'
                    }}>
                      <p style={{ fontWeight: 600, color: '#1a202c', marginBottom: '4px' }}>
                        {item.category}: {item.issue}
                      </p>
                      <p style={{ color: '#64748b', fontSize: '14px' }}>{item.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setResult(null)}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              Analyze Another Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeMatcher;
