import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBriefcase, FaSearch, FaFileAlt, FaCalendarAlt, FaCompass, FaComments, FaRobot, FaCode, FaCheckCircle, FaHome } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/domain-selection', label: 'Domain Selection', icon: <FaCompass /> },
    { path: '/job-search', label: 'Job Search', icon: <FaSearch /> },
    { path: '/interview-search', label: 'Interviews', icon: <FaBriefcase /> },
    { path: '/resume-builder', label: 'Resume Builder', icon: <FaFileAlt /> },
    { path: '/resume-matcher', label: 'ATS Checker', icon: <FaCheckCircle /> },
    { path: '/study-planner', label: 'Study Planner', icon: <FaCalendarAlt /> },
    { path: '/compiler', label: 'Compiler', icon: <FaCode /> },
    { path: '/forum', label: 'Community', icon: <FaComments /> },
    { path: '/ai-agent', label: 'AI Assistant', icon: <FaRobot /> },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-container">
        <Link to="/" className="sidebar-logo">
          <span className="logo-icon">P</span>
          <span className="logo-text">Placement Prep</span>
        </Link>

        <div className="sidebar-menu-container">
          <p className="menu-heading">Main Menu</p>
          <ul className="sidebar-menu">
            {navItems.map((item) => (
              <li key={item.path} className="sidebar-item">
                <Link
                  to={item.path}
                  className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-footer">
          <p>© 2026 Placement Prep</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
