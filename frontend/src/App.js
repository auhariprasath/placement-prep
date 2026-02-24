import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DomainSelection from './pages/DomainSelection';
import JobSearch from './pages/JobSearch';
import InterviewSearch from './pages/InterviewSearch';
import ResumeBuilder from './pages/ResumeBuilder';
import StudyPlanner from './pages/StudyPlanner';
import Forum from './pages/Forum';
import ForumPostDetail from './pages/ForumPostDetail';
import Blog from './pages/Blog';
import ResumeMatcher from './pages/ResumeMatcher';
import OnlineCompiler from './pages/OnlineCompiler';
import AIAgent from './pages/AIAgent';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/domain-selection" element={<DomainSelection />} />
            <Route path="/job-search" element={<JobSearch />} />
            <Route path="/interview-search" element={<InterviewSearch />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
            <Route path="/study-planner" element={<StudyPlanner />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/post/:postId" element={<ForumPostDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/resume-matcher" element={<ResumeMatcher />} />
            <Route path="/compiler" element={<OnlineCompiler />} />
            <Route path="/ai-agent" element={<AIAgent />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
