import React, { useState } from 'react';
import { FaFileAlt, FaPlus, FaTrash, FaDownload, FaEye } from 'react-icons/fa';
import apiService from '../services/apiService';

const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedIn: '',
    portfolio: '',
    summary: '',
    education: [{ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '' }],
    experience: [{ company: '', position: '', startDate: '', endDate: '', responsibilities: [''] }],
    skills: [''],
    projects: [{ name: '', description: '', technologies: '', link: '' }],
    certifications: ['']
  });

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleChange = (e, section, index, subIndex) => {
    const { name, value } = e.target;
    
    if (section) {
      const updatedSection = [...formData[section]];
      if (subIndex !== undefined) {
        updatedSection[index][name][subIndex] = value;
      } else {
        updatedSection[index][name] = value;
      }
      setFormData(prev => ({ ...prev, [section]: updatedSection }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (e, section, index) => {
    const { value } = e.target;
    const updatedSection = [...formData[section]];
    updatedSection[index] = value;
    setFormData(prev => ({ ...prev, [section]: updatedSection }));
  };

  const handleResponsibilityChange = (e, expIndex, respIndex) => {
    const { value } = e.target;
    const updatedExperience = [...formData.experience];
    updatedExperience[expIndex].responsibilities[respIndex] = value;
    setFormData(prev => ({ ...prev, experience: updatedExperience }));
  };

  const addItem = (section, defaultItem) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], defaultItem]
    }));
  };

  const removeItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const addResponsibility = (expIndex) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[expIndex].responsibilities.push('');
    setFormData(prev => ({ ...prev, experience: updatedExperience }));
  };

  const removeResponsibility = (expIndex, respIndex) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[expIndex].responsibilities = updatedExperience[expIndex].responsibilities.filter((_, i) => i !== respIndex);
    setFormData(prev => ({ ...prev, experience: updatedExperience }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiService.generateResume(formData);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${formData.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to generate resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    try {
      const response = await apiService.previewResume(formData);
      setPreview(response.data);
    } catch (err) {
      alert('Failed to generate preview.');
    }
  };

  return (
    <div className="resume-builder">
      <div className="page-header">
        <div className="container">
          <h1><FaFileAlt style={{ marginRight: '12px' }} /> Resume Builder</h1>
          <p>Create a professional resume in minutes</p>
        </div>
      </div>

      <div className="page-content">
        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ color: '#667eea', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
                Personal Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">LinkedIn</label>
                  <input
                    type="url"
                    name="linkedIn"
                    value={formData.linkedIn}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Portfolio</label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '20px' }}>
                <label className="form-label">Professional Summary</label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Brief summary of your professional background..."
                  rows="4"
                />
              </div>
            </div>

            {/* Education */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ color: '#667eea', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
                Education
              </h3>
              {formData.education.map((edu, index) => (
                <div key={index} style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Institution</label>
                      <input
                        type="text"
                        name="institution"
                        value={edu.institution}
                        onChange={(e) => handleChange(e, 'education', index)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Degree</label>
                      <input
                        type="text"
                        name="degree"
                        value={edu.degree}
                        onChange={(e) => handleChange(e, 'education', index)}
                        className="form-input"
                        placeholder="e.g., Bachelor of Science"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Field of Study</label>
                      <input
                        type="text"
                        name="fieldOfStudy"
                        value={edu.fieldOfStudy}
                        onChange={(e) => handleChange(e, 'education', index)}
                        className="form-input"
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Start Date</label>
                      <input
                        type="text"
                        name="startDate"
                        value={edu.startDate}
                        onChange={(e) => handleChange(e, 'education', index)}
                        className="form-input"
                        placeholder="e.g., Sep 2018"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Date</label>
                      <input
                        type="text"
                        name="endDate"
                        value={edu.endDate}
                        onChange={(e) => handleChange(e, 'education', index)}
                        className="form-input"
                        placeholder="e.g., May 2022"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">GPA</label>
                      <input
                        type="text"
                        name="gpa"
                        value={edu.gpa}
                        onChange={(e) => handleChange(e, 'education', index)}
                        className="form-input"
                        placeholder="e.g., 3.8/4.0"
                      />
                    </div>
                  </div>
                  {formData.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem('education', index)}
                      className="btn btn-secondary"
                      style={{ marginTop: '12px', fontSize: '12px' }}
                    >
                      <FaTrash style={{ marginRight: '6px' }} /> Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addItem('education', { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '' })}
                className="btn btn-secondary"
              >
                <FaPlus style={{ marginRight: '6px' }} /> Add Education
              </button>
            </div>

            {/* Experience */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ color: '#667eea', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
                Work Experience
              </h3>
              {formData.experience.map((exp, expIndex) => (
                <div key={expIndex} style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Company</label>
                      <input
                        type="text"
                        name="company"
                        value={exp.company}
                        onChange={(e) => handleChange(e, 'experience', expIndex)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Position</label>
                      <input
                        type="text"
                        name="position"
                        value={exp.position}
                        onChange={(e) => handleChange(e, 'experience', expIndex)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Start Date</label>
                      <input
                        type="text"
                        name="startDate"
                        value={exp.startDate}
                        onChange={(e) => handleChange(e, 'experience', expIndex)}
                        className="form-input"
                        placeholder="e.g., Jan 2022"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Date</label>
                      <input
                        type="text"
                        name="endDate"
                        value={exp.endDate}
                        onChange={(e) => handleChange(e, 'experience', expIndex)}
                        className="form-input"
                        placeholder="e.g., Present"
                      />
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '16px' }}>
                    <label className="form-label">Responsibilities</label>
                    {exp.responsibilities.map((resp, respIndex) => (
                      <div key={respIndex} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input
                          type="text"
                          value={resp}
                          onChange={(e) => handleResponsibilityChange(e, expIndex, respIndex)}
                          className="form-input"
                          placeholder="Describe a responsibility..."
                        />
                        {exp.responsibilities.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeResponsibility(expIndex, respIndex)}
                            className="btn btn-secondary"
                            style={{ padding: '8px 12px' }}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addResponsibility(expIndex)}
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', marginTop: '8px' }}
                    >
                      <FaPlus style={{ marginRight: '6px' }} /> Add Responsibility
                    </button>
                  </div>

                  {formData.experience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem('experience', expIndex)}
                      className="btn btn-secondary"
                      style={{ marginTop: '12px', fontSize: '12px' }}
                    >
                      <FaTrash style={{ marginRight: '6px' }} /> Remove Experience
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addItem('experience', { company: '', position: '', startDate: '', endDate: '', responsibilities: [''] })}
                className="btn btn-secondary"
              >
                <FaPlus style={{ marginRight: '6px' }} /> Add Experience
              </button>
            </div>

            {/* Skills */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ color: '#667eea', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
                Skills
              </h3>
              {formData.skills.map((skill, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleArrayChange(e, 'skills', index)}
                    className="form-input"
                    placeholder="e.g., JavaScript, Python, Project Management"
                  />
                  {formData.skills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem('skills', index)}
                      className="btn btn-secondary"
                      style={{ padding: '8px 12px' }}
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addItem('skills', '')}
                className="btn btn-secondary"
              >
                <FaPlus style={{ marginRight: '6px' }} /> Add Skill
              </button>
            </div>

            {/* Projects */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ color: '#667eea', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
                Projects
              </h3>
              {formData.projects.map((project, index) => (
                <div key={index} style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Project Name</label>
                      <input
                        type="text"
                        name="name"
                        value={project.name}
                        onChange={(e) => handleChange(e, 'projects', index)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Technologies Used</label>
                      <input
                        type="text"
                        name="technologies"
                        value={project.technologies}
                        onChange={(e) => handleChange(e, 'projects', index)}
                        className="form-input"
                        placeholder="e.g., React, Node.js, MongoDB"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Project Link</label>
                      <input
                        type="url"
                        name="link"
                        value={project.link}
                        onChange={(e) => handleChange(e, 'projects', index)}
                        className="form-input"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop: '16px' }}>
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      value={project.description}
                      onChange={(e) => handleChange(e, 'projects', index)}
                      className="form-textarea"
                      placeholder="Describe your project..."
                      rows="3"
                    />
                  </div>
                  {formData.projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem('projects', index)}
                      className="btn btn-secondary"
                      style={{ marginTop: '12px', fontSize: '12px' }}
                    >
                      <FaTrash style={{ marginRight: '6px' }} /> Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addItem('projects', { name: '', description: '', technologies: '', link: '' })}
                className="btn btn-secondary"
              >
                <FaPlus style={{ marginRight: '6px' }} /> Add Project
              </button>
            </div>

            {/* Certifications */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ color: '#667eea', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
                Certifications
              </h3>
              {formData.certifications.map((cert, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={cert}
                    onChange={(e) => handleArrayChange(e, 'certifications', index)}
                    className="form-input"
                    placeholder="e.g., AWS Certified Solutions Architect"
                  />
                  {formData.certifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem('certifications', index)}
                      className="btn btn-secondary"
                      style={{ padding: '8px 12px' }}
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addItem('certifications', '')}
                className="btn btn-secondary"
              >
                <FaPlus style={{ marginRight: '6px' }} /> Add Certification
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handlePreview}
                className="btn btn-secondary"
                style={{ flex: 1, minWidth: '150px' }}
              >
                <FaEye style={{ marginRight: '8px' }} /> Preview
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ flex: 2, minWidth: '200px' }}
              >
                {loading ? (
                  <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span>
                ) : (
                  <><FaDownload style={{ marginRight: '8px' }} /> Download Resume PDF</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Modal */}
        {preview && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
          }}>
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              maxWidth: '800px', 
              width: '100%', 
              maxHeight: '80vh', 
              overflow: 'auto',
              padding: '32px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Resume Preview</h3>
                <button 
                  onClick={() => setPreview(null)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    fontSize: '24px', 
                    cursor: 'pointer',
                    color: '#64748b'
                  }}
                >
                  ×
                </button>
              </div>
              <pre style={{ 
                whiteSpace: 'pre-wrap', 
                fontFamily: 'monospace', 
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#333'
              }}>
                {preview}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
