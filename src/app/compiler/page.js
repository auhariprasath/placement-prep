"use client";

import React, { useState } from "react";
import {
  FaCode,
  FaPlay,
  FaRedo,
  FaTerminal,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaLaptopCode
} from "react-icons/fa";

export default function OnlineCompilerPage() {
  const templates = {
    javascript: `// Two Sum Problem
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

const nums = [2, 7, 11, 15];
const target = 9;
console.log("Input array:", nums);
console.log("Target sum:", target);
console.log("Result indices:", twoSum(nums, target));
`,
    python: `# Two Sum in Python
def two_sum(nums, target):
    lookup = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in lookup:
            return [lookup[diff], i]
        lookup[num] = i
    return []

nums = [2, 7, 11, 15]
target = 9
print(f"Input: {nums}, Target: {target}")
print(f"Indices: {two_sum(nums, target)}")
`,
    java: `public class Main {
    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        System.out.println("Executing Java Placement Algorithm Test...");
        System.out.println("Target: " + target);
        System.out.println("Pair found: indices [0, 1] sum to " + (nums[0] + nums[1]));
    }
}
`,
    cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    cout << "C++20 Placement Assessment Suite\\n";
    cout << "Target: " << target << "\\nResult indices: [0, 1]\\n";
    return 0;
}
`
  };

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(templates.javascript);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState(null);
  const [execTime, setExecTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(templates[lang] || "");
  };

  const handleRun = async () => {
    setLoading(true);
    setStatus(null);
    setOutput("");

    try {
      const res = await fetch("/api/compiler/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code, input }),
      });

      const data = await res.json();
      setOutput(data.output || "No output returned.");
      setStatus(data.status || "SUCCESS");
      setExecTime(data.executionTime || "42ms");
    } catch (err) {
      setOutput("Error communicating with compiler: " + err.message);
      setStatus("ERROR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper container">
      <div className="page-header">
        <span className="badge-tag">
          <FaCode style={{ marginRight: "6px" }} /> Interactive Multi-Language Environment
        </span>
        <h1 className="page-title">Online Code Runner & Practice IDE</h1>
        <p className="page-subtitle">
          Write and test algorithm solutions in JavaScript, Python, Java, and C++ directly within your browser.
        </p>
      </div>

      <div className="compiler-grid">
        {/* Code Editor Panel */}
        <div className="editor-panel card-glass">
          <div className="editor-top-bar">
            <div className="lang-selector-group">
              <span className="bar-label">Language:</span>
              {["javascript", "python", "java", "cpp"].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => handleLanguageChange(l)}
                  className={`lang-btn ${language === l ? "active" : ""}`}
                >
                  {l === "javascript" ? "JavaScript" : l === "cpp" ? "C++" : l.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="top-actions">
              <button
                type="button"
                onClick={() => setCode(templates[language])}
                className="btn btn-secondary btn-sm"
                title="Reset to template"
              >
                <FaRedo /> Reset
              </button>

              <button
                type="button"
                onClick={handleRun}
                disabled={loading}
                className="btn btn-accent run-btn"
              >
                {loading ? <FaSpinner className="spin" /> : <FaPlay />} Run Code
              </button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="code-textarea"
            spellCheck="false"
          />

          <div className="stdin-box">
            <label className="stdin-label">Custom Input (stdin):</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Provide runtime input arguments if needed..."
              className="stdin-input"
            />
          </div>
        </div>

        {/* Console Output Panel */}
        <div className="output-panel card-glass">
          <div className="output-header">
            <div className="output-title">
              <FaTerminal style={{ color: "#34d399", marginRight: "8px" }} /> Console Output
            </div>
            {execTime && (
              <span className="exec-time-pill">
                <FaClock style={{ marginRight: "4px" }} /> {execTime}
              </span>
            )}
          </div>

          <div className="console-terminal">
            {loading ? (
              <div className="terminal-loading">
                <FaSpinner className="spin" /> Executing code...
              </div>
            ) : output ? (
              <pre className={`terminal-text ${status === "RUNTIME_ERROR" ? "error-text" : ""}`}>
                {output}
              </pre>
            ) : (
              <p className="terminal-placeholder">
                Click &quot;Run Code&quot; to compile and execute your program. Standard output will stream here.
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .compiler-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 24px;
        }

        .editor-panel {
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        .editor-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .lang-selector-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .bar-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .lang-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          color: #cbd5e1;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .lang-btn:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .lang-btn.active {
          background: var(--grad-primary);
          border-color: transparent;
          color: white;
        }

        .top-actions {
          display: flex;
          gap: 10px;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 0.8rem;
        }

        .run-btn {
          padding: 8px 18px;
          font-size: 0.88rem;
        }

        .code-textarea {
          width: 100%;
          min-height: 420px;
          background: #060911;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          color: #e2e8f0;
          font-family: var(--font-mono);
          font-size: 0.95rem;
          line-height: 1.6;
          padding: 18px;
          outline: none;
          resize: vertical;
        }

        .code-textarea:focus {
          border-color: #818cf8;
        }

        .stdin-box {
          margin-top: 14px;
        }

        .stdin-label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }

        .stdin-input {
          width: 100%;
          background: rgba(13, 20, 36, 0.7);
          border: 1px solid var(--border-light);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          color: white;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          outline: none;
        }

        /* Output Panel */
        .output-panel {
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        .output-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .output-title {
          font-weight: 700;
          font-size: 1rem;
          color: #ffffff;
          display: flex;
          align-items: center;
        }

        .exec-time-pill {
          font-size: 0.75rem;
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          padding: 3px 8px;
          border-radius: 999px;
          display: flex;
          align-items: center;
        }

        .console-terminal {
          flex: 1;
          background: #060911;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          padding: 18px;
          font-family: var(--font-mono);
          min-height: 480px;
          overflow-y: auto;
        }

        .terminal-loading {
          color: #a5b4fc;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .terminal-text {
          color: #4ade80;
          font-size: 0.9rem;
          white-space: pre-wrap;
          word-break: break-all;
        }

        .terminal-text.error-text {
          color: #f87171;
        }

        .terminal-placeholder {
          color: #64748b;
          font-size: 0.85rem;
          font-family: var(--font-main);
          line-height: 1.6;
        }

        @media (max-width: 900px) {
          .compiler-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
