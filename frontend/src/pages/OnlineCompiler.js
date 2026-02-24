import React, { useState } from 'react';
import { FaCode, FaPlay, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import apiService from '../services/apiService';

const OnlineCompiler = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [input, setInput] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const languages = [
    { value: 'java', label: 'Java', template: 'public class Main {\n    public static void main(String[] args) {\n        // Your code here\n        System.out.println("Hello, World!");\n    }\n}' },
    { value: 'python', label: 'Python', template: '# Your code here\nprint("Hello, World!")' },
    { value: 'javascript', label: 'JavaScript', template: '// Your code here\nconsole.log("Hello, World!");' },
    { value: 'cpp', label: 'C++', template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    cout << "Hello, World!" << endl;\n    return 0;\n}' },
    { value: 'c', label: 'C', template: '#include <stdio.h>\n\nint main() {\n    // Your code here\n    printf("Hello, World!\\n");\n    return 0;\n}' }
  ];

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    const template = languages.find(l => l.value === selectedLang)?.template || '';
    setCode(template);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      setCode(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    } else if (e.key === 'Enter') {
      // Basic auto-indentation
      const start = e.target.selectionStart;
      const value = e.target.value;
      const lines = value.substring(0, start).split('\n');
      const lastLine = lines[lines.length - 1];
      const indentation = lastLine.match(/^\s*/)[0];

      if (indentation) {
        e.preventDefault();
        const end = e.target.selectionEnd;
        const newValue = value.substring(0, start) + '\n' + indentation + value.substring(end);
        setCode(newValue);
        setTimeout(() => {
          e.target.selectionStart = e.target.selectionEnd = start + indentation.length + 1;
        }, 0);
      }
    }
  };

  const handleRun = async () => {
    if (!code.trim()) {
      alert('Please write some code');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.executeCode({
        code,
        language,
        input,
        expectedOutput
      });
      setResult(response.data);
    } catch (err) {
      alert('Failed to execute code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="online-compiler">
      <div className="page-header">
        <div className="container">
          <h1><FaCode style={{ marginRight: '12px' }} /> Online Compiler</h1>
          <p>Write, run, and test your code with professional tools</p>
        </div>
      </div>

      <div className="page-content">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Code Editor Section */}
          <div className="card" style={{ marginBottom: '25px', padding: '0', overflow: 'hidden' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              background: '#2d3748',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Editor</h3>
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="form-select"
                  style={{
                    width: 'auto',
                    background: '#1a202c',
                    color: 'white',
                    borderColor: '#4a5568',
                    padding: '4px 12px'
                  }}
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleRun}
                disabled={loading}
                className="btn btn-primary"
                style={{
                  padding: '8px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {loading ? (
                  <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span>
                ) : (
                  <><FaPlay size={14} /> Run Code</>
                )}
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className="form-textarea"
              rows="25"
              style={{
                fontFamily: '"Fira Code", "Courier New", monospace',
                fontSize: '15px',
                background: '#1a202c',
                color: '#e2e8f0',
                resize: 'vertical',
                padding: '20px',
                border: 'none',
                width: '100%',
                lineHeight: '1.6',
                outline: 'none'
              }}
              placeholder="Write your code here..."
            />
          </div>

          {/* Input & Expected Output Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
            <div className="card">
              <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>Program Input</h3>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="form-textarea"
                rows="6"
                style={{ fontFamily: 'monospace', fontSize: '14px', background: '#f8fafc' }}
                placeholder="Standard input (stdin)..."
              />
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '16px', fontSize: '1rem' }}>Expected Output (Optional)</h3>
              <textarea
                value={expectedOutput}
                onChange={(e) => setExpectedOutput(e.target.value)}
                className="form-textarea"
                rows="6"
                style={{ fontFamily: 'monospace', fontSize: '14px', background: '#f8fafc' }}
                placeholder="Comparison baseline..."
              />
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className="card" style={{ borderLeft: `6px solid ${result.passed ? '#059669' : result.status === 'SUCCESS' ? '#2563eb' : '#dc2626'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {result.passed ? (
                    <FaCheckCircle size={24} color="#059669" />
                  ) : result.status === 'SUCCESS' ? (
                    <FaCheckCircle size={24} color="#2563eb" />
                  ) : (
                    <FaTimesCircle size={24} color="#dc2626" />
                  )}
                  <h3 style={{ margin: 0 }}>Execution Result: <span style={{ color: result.passed ? '#059669' : result.status === 'SUCCESS' ? '#2563eb' : '#dc2626' }}>{result.status}</span></h3>
                </div>
                {result.executionTimeMs && (
                  <span style={{ fontSize: '14px', color: '#64748b', background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px' }}>
                    <FaClock size={12} style={{ marginRight: '4px' }} /> {result.executionTimeMs}ms
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: result.actualOutput && expectedOutput ? '1fr' : '1fr', gap: '20px' }}>
                {result.output && (
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Standard Output (stdout):</p>
                    <pre style={{
                      background: '#1a202c',
                      color: '#48bb78',
                      padding: '16px',
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      overflow: 'auto',
                      maxHeight: '300px'
                    }}>
                      {result.output}
                    </pre>
                  </div>
                )}

                {result.error && (
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626', marginBottom: '8px' }}>Error Details:</p>
                    <pre style={{
                      background: '#fff5f5',
                      padding: '16px',
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      color: '#c53030',
                      overflow: 'auto',
                      maxHeight: '300px',
                      border: '1px solid #feb2b2'
                    }}>
                      {result.error}
                    </pre>
                  </div>
                )}

                {expectedOutput && result.actualOutput && (
                  <div style={{ marginTop: '10px', padding: '20px', background: '#f1f5f9', borderRadius: '10px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px' }}>Output Comparison:</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <div>
                        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>EXPECTED</p>
                        <pre style={{
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          padding: '12px',
                          borderRadius: '6px',
                          fontFamily: 'monospace',
                          fontSize: '13px'
                        }}>
                          {expectedOutput}
                        </pre>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>ACTUAL</p>
                        <pre style={{
                          background: result.passed ? '#f0fdf4' : '#fef2f2',
                          border: result.passed ? '1px solid #bbf7d0' : '1px solid #fecaca',
                          padding: '12px',
                          borderRadius: '6px',
                          fontFamily: 'monospace',
                          fontSize: '13px'
                        }}>
                          {result.actualOutput}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnlineCompiler;
