import React from 'react';
import { Link } from 'react-router-dom';
import { FaCompass, FaSearch, FaBriefcase, FaFileAlt, FaCalendarAlt, FaArrowRight, FaComments, FaBlog, FaRobot, FaCode, FaCheckCircle } from 'react-icons/fa';

const Home = () => {
  const features = [
    {
      icon: <FaCompass />,
      title: 'Domain Selection',
      description: 'Discover your ideal career domain using our AI-powered logistic regression model based on your interests and skills.',
      link: '/domain-selection',
      color: '#667eea'
    },
    {
      icon: <FaSearch />,
      title: 'Job Search',
      description: 'Search for jobs from Glassdoor with advanced filters for location, remote work, and more.',
      link: '/job-search',
      color: '#f093fb'
    },
    {
      icon: <FaBriefcase />,
      title: 'Interview Questions',
      description: 'Access real interview experiences and questions from top companies worldwide.',
      link: '/interview-search',
      color: '#4facfe'
    },
    {
      icon: <FaFileAlt />,
      title: 'Resume Builder',
      description: 'Create professional resumes with our easy-to-use builder. Download as PDF instantly.',
      link: '/resume-builder',
      color: '#43e97b'
    },
    {
      icon: <FaCheckCircle />,
      title: 'ATS Checker',
      description: 'Check how well your resume matches job descriptions and improve your chances.',
      link: '/resume-matcher',
      color: '#f59e0b'
    },
    {
      icon: <FaCalendarAlt />,
      title: 'Study Planner',
      description: 'Get personalized study plans powered by Gemini AI based on your goals and timeline.',
      link: '/study-planner',
      color: '#fa709a'
    },
    {
      icon: <FaCode />,
      title: 'Online Compiler',
      description: 'Write, run, and test your code with custom inputs in multiple languages.',
      link: '/compiler',
      color: '#10b981'
    },
    {
      icon: <FaComments />,
      title: 'Community Forum',
      description: 'Ask questions, share knowledge, and connect with fellow students and professionals.',
      link: '/forum',
      color: '#8b5cf6'
    },
    {
      icon: <FaRobot />,
      title: 'AI Assistant',
      description: 'Get instant help with interview prep, resume tips, coding help, and career guidance.',
      link: '/ai-agent',
      color: '#06b6d4'
    }
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>Your Complete Placement Preparation Platform</h1>
          <p>Discover your career path, find jobs, prepare for interviews, build resumes, practice coding, connect with the community, and get AI-powered guidance - all in one place.</p>
          <div className="hero-buttons">
            <Link to="/domain-selection" className="hero-btn hero-btn-primary">
              Get Started <FaArrowRight style={{ marginLeft: '8px' }} />
            </Link>
            <Link to="/ai-agent" className="hero-btn hero-btn-secondary">
              <FaRobot style={{ marginRight: '8px' }} /> Ask AI Assistant
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Everything You Need for Placement Success</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <Link to={feature.link} key={index} className="feature-card">
                <div className="feature-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="how-it-works" style={{ padding: '80px 0', background: 'white' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '50px', color: '#1a202c' }}>
            How It Works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0 auto 20px'
              }}>
                1
              </div>
              <h3 style={{ marginBottom: '10px', color: '#1a202c' }}>Discover</h3>
              <p style={{ color: '#64748b' }}>Find your ideal career domain using our AI assessment</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0 auto 20px'
              }}>
                2
              </div>
              <h3 style={{ marginBottom: '10px', color: '#1a202c' }}>Prepare</h3>
              <p style={{ color: '#64748b' }}>Get personalized study plans, practice coding, and prepare for interviews</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0 auto 20px'
              }}>
                3
              </div>
              <h3 style={{ marginBottom: '10px', color: '#1a202c' }}>Connect</h3>
              <p style={{ color: '#64748b' }}>Join the community, share experiences, and get AI guidance</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0 auto 20px'
              }}>
                4
              </div>
              <h3 style={{ marginBottom: '10px', color: '#1a202c' }}>Apply</h3>
              <p style={{ color: '#64748b' }}>Search jobs and apply with your optimized resume</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Ready to Start Your Journey?</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '40px', opacity: 0.9 }}>
            Join thousands of students who have successfully landed their dream jobs
          </p>
          <Link to="/ai-agent" className="hero-btn hero-btn-primary" style={{ background: 'white', color: '#667eea' }}>
            <FaRobot style={{ marginRight: '8px' }} /> Chat with AI Assistant
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
