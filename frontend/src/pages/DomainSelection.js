import React, { useState } from 'react';
import { FaCompass, FaCheckCircle, FaTheaterMasks, FaMicrochip, FaBook, FaRunning, FaLanguage, FaFlask } from 'react-icons/fa';
import apiService from '../services/apiService';

const DomainSelection = () => {
  const featureList = [
    'Drawing', 'Dancing', 'Singing', 'Sports', 'Video Game', 'Acting', 'Travelling',
    'Gardening', 'Animals', 'Photography', 'Teaching', 'Exercise', 'Coding',
    'Electricity Components', 'Mechanic Parts', 'Computer Parts', 'Researching',
    'Architecture', 'Historic Collection', 'Botany', 'Zoology', 'Physics',
    'Accounting', 'Economics', 'Sociology', 'Geography', 'Psycology', 'History',
    'Science', 'Bussiness Education', 'Chemistry', 'Mathematics', 'Biology',
    'Makeup', 'Designing', 'Content writing', 'Crafting', 'Literature', 'Reading',
    'Cartooning', 'Debating', 'Asrtology', 'Hindi', 'French', 'English', 'Urdu',
    'Other Language', 'Solving Puzzles', 'Gymnastics', 'Yoga', 'Engeeniering',
    'Doctor', 'Pharmisist', 'Cycling', 'Knitting', 'Director', 'Journalism',
    'Bussiness', 'Listening Music'
  ];

  const categories = [
    {
      name: 'Arts & Creative',
      icon: <FaTheaterMasks />,
      features: ['Drawing', 'Dancing', 'Singing', 'Acting', 'Photography', 'Makeup', 'Designing', 'Content writing', 'Crafting', 'Cartooning', 'Listening Music', 'Knitting', 'Literature']
    },
    {
      name: 'Technical & Science',
      icon: <FaMicrochip />,
      features: ['Coding', 'Electricity Components', 'Mechanic Parts', 'Computer Parts', 'Researching', 'Physics', 'Chemistry', 'Science', 'Mathematics', 'Engineering']
    },
    {
      name: 'Humanities & Social',
      icon: <FaBook />,
      features: ['Sociology', 'Geography', 'Psycology', 'History', 'Accounting', 'Economics', 'Bussiness Education', 'Bussiness', 'Journalism']
    },
    {
      name: 'Life Science',
      icon: <FaFlask />,
      features: ['Botany', 'Zoology', 'Biology', 'Doctor', 'Pharmisist', 'Animals', 'Gardening']
    },
    {
      name: 'Lifestyle & Hobbies',
      icon: <FaRunning />,
      features: ['Sports', 'Video Game', 'Travelling', 'Teaching', 'Exercise', 'Gymnastics', 'Yoga', 'Cycling', 'Solving Puzzles', 'Reading']
    },
    {
      name: 'Languages & Others',
      icon: <FaLanguage />,
      features: ['Hindi', 'French', 'English', 'Urdu', 'Other Language', 'Debating', 'Asrtology', 'Director', 'Architecture', 'Historic Collection']
    }
  ];

  // Initialize all features as false
  const initialFeatures = {};
  featureList.forEach(f => initialFeatures[f] = false);

  const [features, setFeatures] = useState(initialFeatures);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckboxChange = (f) => {
    setFeatures(prev => ({
      ...prev,
      [f]: !prev[f]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.predictDomain({ features });
      setResult(response.data);
    } catch (err) {
      setError('Failed to get career recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="domain-selection">
      <div className="page-header">
        <div className="container">
          <h1><FaCompass style={{ marginRight: '12px' }} /> Career Path Finder</h1>
          <p>Select your interests and skills to find your ideal professional path powered by our AI model</p>
        </div>
      </div>

      <div className="page-content">
        {!result ? (
          <div className="card">
            <h2 style={{ marginBottom: '24px', color: '#1a202c', textAlign: 'center' }}>Tell us about yourself</h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="categories-grid">
                {categories.map((cat, idx) => (
                  <div key={idx} className="category-section" style={{ marginBottom: '32px' }}>
                    <h3 style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#667eea',
                      marginBottom: '16px',
                      borderBottom: '2px solid #f1f5f9',
                      paddingBottom: '8px'
                    }}>
                      {cat.icon} {cat.name}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                      {cat.features.map((f) => (
                        <div
                          key={f}
                          className={`feature-item ${features[f] ? 'active' : ''}`}
                          onClick={() => handleCheckboxChange(f)}
                          style={{
                            padding: '10px 15px',
                            background: features[f] ? '#eff6ff' : '#f8fafc',
                            border: `1px solid ${features[f] ? '#60a5fa' : '#e2e8f0'}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.2s'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={features[f]}
                            onChange={() => { }} // Controlled by div click
                            style={{ margin: 0 }}
                          />
                          <span style={{ fontSize: '14px', color: features[f] ? '#1e40af' : '#475569' }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '20px', fontSize: '18px', marginTop: '20px' }}
              >
                {loading ? (
                  <span className="spinner" style={{ width: '24px', height: '24px', borderWidth: '3px' }}></span>
                ) : (
                  'Predict Ideal Career Path'
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="domain-result" style={{ textAlign: 'center' }}>
            <FaCheckCircle style={{ fontSize: '64px', color: '#10b981', marginBottom: '20px' }} />
            <h3>Your Recommended Career Path</h3>
            <div className="confidence-score" style={{
              fontSize: '48px',
              fontWeight: 800,
              color: '#3b82f6',
              margin: '10px 0'
            }}>{result.confidenceScore}%</div>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>Match Confidence</p>

            <h2 style={{
              color: '#1e293b',
              fontSize: '32px',
              marginBottom: '32px',
              padding: '20px',
              background: '#f1f5f9',
              borderRadius: '12px',
              display: 'inline-block'
            }}>{result.recommendedDomain}</h2>

            <div className="domain-details" style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
              <div className="card">
                <h4 style={{ color: '#334155', borderLeft: '4px solid #3b82f6', paddingLeft: '12px' }}>Detailed Insights</h4>
                <p style={{ lineHeight: 1.6, color: '#475569' }}>{result.description}</p>

                <h4 style={{ color: '#334155', borderLeft: '4px solid #3b82f6', paddingLeft: '12px', marginTop: '20px' }}>Top Career Opportunities</h4>
                <p style={{ lineHeight: 1.6, color: '#475569' }}>{result.careerPaths}</p>

                <h4 style={{ color: '#334155', borderLeft: '4px solid #3b82f6', paddingLeft: '12px', marginTop: '20px' }}>Actionable Skills to Build</h4>
                <p style={{ lineHeight: 1.6, color: '#475569' }}>{result.skillsRequired}</p>
              </div>
            </div>

            <button
              onClick={() => setResult(null)}
              className="btn btn-secondary"
              style={{ marginTop: '40px', padding: '12px 32px' }}
            >
              Analyze Another Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainSelection;
