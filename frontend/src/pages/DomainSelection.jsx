import React, { useState } from 'react';
import { 
  FaCompass, FaRobot, FaLightbulb, FaBookOpen, 
  FaYoutube, FaSpinner, FaArrowRight, FaRedo, 
  FaGraduationCap, FaCheckCircle, FaPlay 
} from 'react-icons/fa';
import apiService from '../services/apiService';
import '../styles/DomainSelection.css';

const DomainSelection = () => {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const examplePrompts = [
    "I have a strong interest in writing programs, solving logical algorithms, and building software applications.",
    "I love working with data analysis, machine learning models, neural networks, and Python statistical libraries.",
    "I am fascinated by circuits, microcontrollers, embedded systems, and robotics hardware.",
    "I enjoy 3D mechanical CAD designing, thermodynamics, automobile engines, and manufacturing systems.",
    "I am passionate about network security, ethical hacking, cryptography, and defending digital systems."
  ];

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim()) {
      setError('Please type a short description of your interests, goals, or hobbies.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiService.predictDomain({ userInput: userInput.trim() });
      setResult(response.data);
    } catch (err) {
      console.error('Failed to predict domain:', err);
      setError('Failed to analyze domain using AI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (promptText) => {
    setUserInput(promptText);
    setError('');
  };

  const resetSelection = () => {
    setResult(null);
    setUserInput('');
    setError('');
  };

  // Helper to extract YouTube video ID if standard link
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  // Fallback subjects if backend returns empty or legacy structure
  const defaultFallbackSubjects = [
    {
      subjectName: "Data Structures & Algorithms",
      description: "Core foundation for writing efficient code and clearing coding placement rounds.",
      keyTopics: "Arrays, Linked Lists, Trees, Graphs, Sorting, Dynamic Programming",
      videoTitle: "Data Structures and Algorithms for Beginners",
      videoUrl: "https://www.youtube.com/watch?v=8hly31xKLI0",
      videoChannel: "freeCodeCamp.org"
    },
    {
      subjectName: "Database Management Systems (DBMS)",
      description: "Teaches data storage, SQL queries, normalization, and relational databases.",
      keyTopics: "Relational Algebra, SQL, Normalization, Indexing, ACID Properties",
      videoTitle: "Database Management System Full Course",
      videoUrl: "https://www.youtube.com/watch?v=dl00fOOYLOM",
      videoChannel: "Gate Smashers"
    },
    {
      subjectName: "Operating Systems",
      description: "Covers process management, memory allocation, multi-threading, and file systems.",
      keyTopics: "Process Scheduling, Deadlocks, Virtual Memory, Paging, System Calls",
      videoTitle: "Operating System Complete Course",
      videoUrl: "https://www.youtube.com/watch?v=bkWHS474qHw",
      videoChannel: "Gate Smashers"
    },
    {
      subjectName: "Computer Networks",
      description: "Explores OSI layers, TCP/IP protocols, routing algorithms, and network security.",
      keyTopics: "OSI Model, TCP/IP, IP Addressing, HTTP/HTTPS, Routing Protocols",
      videoTitle: "Computer Networks Full Course",
      videoUrl: "https://www.youtube.com/watch?v=IPvYjXCsTg8",
      videoChannel: "freeCodeCamp.org"
    }
  ];

  const getRecommendedDomainTitle = () => {
    if (!result) return "";
    let domain = result.recommendedDomain || result.domain || result.domainName || "B.Tech in Computer Science and Engineering";
    if (!domain.startsWith("B.E.") && !domain.startsWith("B.Tech")) {
      domain = "B.Tech in " + domain.replace(/^(BA|B\.A\.|BSc|B\.Sc\.|BCom|B\.Com\.|Bachelor of Arts in|Bachelor of Science in)\s*/i, "");
    }
    return domain;
  };

  const getSubjectsList = () => {
    if (!result) return [];
    if (result.importantSubjects && Array.isArray(result.importantSubjects) && result.importantSubjects.length > 0) {
      return result.importantSubjects;
    }
    if (result.subjects && Array.isArray(result.subjects) && result.subjects.length > 0) {
      return result.subjects;
    }
    return defaultFallbackSubjects;
  };

  return (
    <div className="domain-selection-page">
      {/* Header Banner */}
      <div className="domain-header">
        <div className="header-badge">
          <FaRobot /> AI Career Counselor
        </div>
        <h1>B.E. / B.Tech Domain & Exam Subject Guide</h1>
        <p>Describe your interests, hobbies, or coding passion in plain words. AI Assistant will analyze your statement, recommend your ideal B.E. / B.Tech Engineering branch, and list 4 essential exam subjects with demo videos.</p>
      </div>

      {!result ? (
        /* INPUT CARD SECTION */
        <div className="domain-input-card card-glass">
          <form onSubmit={handlePredict}>
            <div className="form-group">
              <label htmlFor="user-interest-input">
                <FaCompass className="input-icon" /> Describe Your Interests & Technical Goals:
              </label>
              <textarea
                id="user-interest-input"
                value={userInput}
                onChange={(e) => {
                  setUserInput(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g., I have a strong interest in writing programs, solving algorithmic puzzles, and building software applications..."
                rows={5}
                className="interest-textarea"
              />
            </div>

            {/* Example Prompt Pills */}
            <div className="example-prompts">
              <span className="prompts-label"><FaLightbulb /> Or click an example prompt:</span>
              <div className="pills-wrapper">
                {examplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    type="button"
                    className="prompt-pill"
                    onClick={() => handleExampleClick(prompt)}
                  >
                    "{prompt.substring(0, 65)}..."
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary btn-large" disabled={loading}>
              {loading ? (
                <>
                  <FaSpinner className="icon-spin" /> Analyzing B.E. / B.Tech Fit with AI Assistant...
                </>
              ) : (
                <>
                  Recommend Engineering Branch & Demo Videos <FaArrowRight />
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* RESULTS DASHBOARD SECTION */
        <div className="domain-result-container">
          {/* Main Domain Recommendation Card */}
          <div className="recommendation-banner banner-glass">
            <div className="banner-top">
              <div className="domain-icon-circle">
                <FaGraduationCap />
              </div>
              <div className="domain-title-group">
                <div className="fit-badge">Recommended B.E. / B.Tech Branch ({Math.round(result.confidenceScore || 95)}% Match)</div>
                <h2>{getRecommendedDomainTitle()}</h2>
              </div>
            </div>

            <div className="domain-details-body">
              <div className="fit-reason-box">
                <h4><FaCheckCircle className="check-icon" /> Why This Branch Fits You:</h4>
                <p>{result.fitReason || result.reason || "This engineering branch matches your expressed technical interests and career aspirations."}</p>
              </div>
              <div className="domain-overview-box">
                <h4><FaLightbulb className="light-icon" /> Engineering Branch Overview:</h4>
                <p>{result.description || result.overview || "Focuses on fundamental engineering principles, practical system development, and modern technologies."}</p>
              </div>
            </div>
          </div>

          {/* 4 Important Subjects & Demo Videos */}
          <div className="subjects-section">
            <div className="section-title-box">
              <h3><FaBookOpen /> 4 Core Semester Subjects & Demo Videos</h3>
              <p>Essential subjects to master for your engineering university exams and placement interviews:</p>
            </div>

            <div className="subjects-grid">
              {getSubjectsList().map((sub, idx) => {
                const embedUrl = getEmbedUrl(sub.videoUrl);
                const searchLink = (sub.videoUrl && sub.videoUrl.includes && sub.videoUrl.includes("youtube"))
                  ? sub.videoUrl
                  : `https://www.youtube.com/results?search_query=${encodeURIComponent((sub.subjectName || sub.title || "Engineering Subject") + ' full course tutorial')}`;

                return (
                  <div key={idx} className="subject-card card-glass">
                    <div className="subject-card-header">
                      <span className="subject-num">0{idx + 1}</span>
                      <h4>{sub.subjectName || sub.name || sub.title || `Subject ${idx + 1}`}</h4>
                    </div>

                    <p className="subject-desc">{sub.description || sub.details || "Core semester subject essential for university examinations and placement technical rounds."}</p>

                    {(sub.keyTopics || sub.topics) && (
                      <div className="key-topics-box">
                        <strong>Key Topics:</strong>
                        <p>{sub.keyTopics || sub.topics}</p>
                      </div>
                    )}

                    {/* Demo Video Recommendation */}
                    <div className="video-recommendation-box">
                      <div className="video-header">
                        <FaYoutube className="yt-icon" />
                        <span className="yt-channel">{sub.videoChannel || "YouTube Tutorial"}</span>
                      </div>
                      <h5 className="video-title">{sub.videoTitle || `${sub.subjectName || "Subject"} Full Course`}</h5>
                      
                      {embedUrl ? (
                        <div className="video-embed-container">
                          <iframe
                            src={embedUrl}
                            title={sub.videoTitle || sub.subjectName}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : null}

                      <a 
                        href={searchLink}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="watch-video-btn"
                        style={{ marginTop: embedUrl ? '10px' : '0' }}
                      >
                        <FaPlay /> Watch Demo Video on YouTube
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="result-actions">
            <button onClick={resetSelection} className="btn-secondary btn-large">
              <FaRedo /> Test Another Engineering Interest
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainSelection;
