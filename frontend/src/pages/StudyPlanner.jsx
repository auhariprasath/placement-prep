import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaBook, FaLightbulb, FaCheckCircle } from 'react-icons/fa';
import apiService from '../services/apiService';

const StudyPlanner = () => {
  const [formData, setFormData] = useState({
    subject: '',
    durationDays: 30,
    hoursPerDay: 4,
    difficultyLevel: 'intermediate',
    targetGoal: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'durationDays' || name === 'hoursPerDay' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.generateStudyPlan(formData);
      setResult(response.data);
    } catch (err) {
      setError('Failed to generate study plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return '#059669';
      case 'medium': return '#d97706';
      case 'hard': return '#dc2626';
      default: return '#64748b';
    }
  };

  const getPriorityClass = (priority) => {
    if (priority >= 4) return 'priority-high';
    if (priority >= 3) return 'priority-medium';
    return 'priority-low';
  };

  return (
    <div className="study-planner">
      <div className="page-header">
        <div className="container">
          <h1><FaCalendarAlt style={{ marginRight: '12px' }} /> Study Planner</h1>
          <p>Get a personalized study plan powered by Gemini AI</p>
        </div>
      </div>

      <div className="page-content">
        {!result ? (
          <div className="card">
            <h2 style={{ marginBottom: '24px', color: '#1a202c' }}>Create Your Study Plan</h2>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <div style={{ position: 'relative' }}>
                    <FaBook style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g., Data Structures, Machine Learning"
                      className="form-input"
                      style={{ paddingLeft: '40px' }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (Days) *</label>
                  <input
                    type="number"
                    name="durationDays"
                    value={formData.durationDays}
                    onChange={handleChange}
                    min="1"
                    max="365"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hours Per Day *</label>
                  <div style={{ position: 'relative' }}>
                    <FaClock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="number"
                      name="hoursPerDay"
                      value={formData.hoursPerDay}
                      onChange={handleChange}
                      min="1"
                      max="16"
                      className="form-input"
                      style={{ paddingLeft: '40px' }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Difficulty Level</label>
                  <select
                    name="difficultyLevel"
                    value={formData.difficultyLevel}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Target Goal (Optional)</label>
                <textarea
                  name="targetGoal"
                  value={formData.targetGoal}
                  onChange={handleChange}
                  placeholder="e.g., Prepare for Google interview, Master Python for data science..."
                  className="form-textarea"
                  rows="3"
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
                  'Generate Study Plan'
                )}
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* Study Plan Overview */}
            <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <h2 style={{ marginBottom: '16px' }}>{result.subject} Study Plan</h2>
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ opacity: 0.8, fontSize: '14px' }}>Duration</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{result.totalDays} Days</p>
                </div>
                <div>
                  <p style={{ opacity: 0.8, fontSize: '14px' }}>Daily Study Time</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{result.hoursPerDay} Hours</p>
                </div>
                <div>
                  <p style={{ opacity: 0.8, fontSize: '14px' }}>Total Study Hours</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{result.totalDays * result.hoursPerDay} Hours</p>
                </div>
              </div>
            </div>

            {/* Overall Strategy */}
            {result.overallStrategy && (
              <div className="card" style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#667eea', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaLightbulb /> Overall Strategy
                </h3>
                <p style={{ color: '#475569', lineHeight: '1.6' }}>{result.overallStrategy}</p>
              </div>
            )}

            {/* Tips */}
            {result.tips && result.tips.length > 0 && (
              <div className="card" style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#667eea', marginBottom: '16px' }}>Study Tips</h3>
                <ul style={{ paddingLeft: '20px' }}>
                  {result.tips.map((tip, index) => (
                    <li key={index} style={{ color: '#475569', marginBottom: '8px', lineHeight: '1.6' }}>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Daily Plans */}
            <h3 style={{ marginBottom: '20px', color: '#1a202c' }}>Daily Schedule</h3>
            {result.dailyPlans && result.dailyPlans.map((day, index) => (
              <div key={index} className="study-plan-day">
                <h4>
                  Day {day.day} - {day.focusArea}
                  <span style={{ 
                    float: 'right', 
                    fontSize: '14px', 
                    color: '#64748b',
                    fontWeight: 'normal'
                  }}>
                    {day.date}
                  </span>
                </h4>
                
                {day.topics && day.topics.map((topic, topicIndex) => (
                  <div key={topicIndex} className="topic-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <h5 style={{ color: '#1a202c', margin: 0 }}>{topic.name}</h5>
                      <div className="topic-meta">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaClock size={12} />
                          {topic.hours} hours
                        </span>
                        <span style={{ 
                          color: getDifficultyColor(topic.difficulty),
                          fontWeight: 600
                        }}>
                          {topic.difficulty}
                        </span>
                        <span className={`priority-badge ${getPriorityClass(topic.priority)}`}>
                          Priority {topic.priority}
                        </span>
                      </div>
                    </div>
                    {topic.description && (
                      <p style={{ color: '#64748b', fontSize: '14px', marginTop: '8px', marginBottom: 0 }}>
                        {topic.description}
                      </p>
                    )}
                  </div>
                ))}

                <div style={{ 
                  marginTop: '16px', 
                  padding: '12px 16px', 
                  background: '#f1f5f9', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaCheckCircle style={{ color: '#667eea' }} />
                  <span style={{ fontWeight: 600, color: '#1a202c' }}>
                    Total: {day.totalHours} hours
                  </span>
                </div>
              </div>
            ))}

            <button
              onClick={() => setResult(null)}
              className="btn btn-secondary"
              style={{ marginTop: '24px', width: '100%' }}
            >
              Create New Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPlanner;
