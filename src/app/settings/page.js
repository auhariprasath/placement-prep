"use client";

import React, { useState, useEffect } from "react";
import {
  FaKey,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaServer,
  FaRobot,
  FaExternalLinkAlt,
  FaSave,
  FaShieldAlt,
  FaInfoCircle
} from "react-icons/fa";

export default function SettingsPage() {
  const [groqKey, setGroqKey] = useState("");
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [groqModel, setGroqModel] = useState("llama-3.3-70b-versatile");

  // Status & Feedback
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingGroq, setTestingGroq] = useState(false);
  const [groqTestStatus, setGroqTestStatus] = useState(null); // { valid: boolean, message: string }
  const [serverSettings, setServerSettings] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Load current settings from backend & localStorage
  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setServerSettings(data.settings);
        setGroqModel(data.settings.groqModel || "llama-3.3-70b-versatile");
      }

      // Check if user has an override in localStorage
      const localGroq = localStorage.getItem("pp_groq_api_key");
      if (localGroq) {
        setGroqKey(localGroq);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const showToast = (msg, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Test Groq Key
  const handleTestGroqKey = async () => {
    const keyToTest = groqKey.trim() || (serverSettings?.isGroqConfigured ? "CURRENT_SERVER_KEY" : "");
    if (!keyToTest) {
      showToast("Please enter an API Key to test", true);
      return;
    }

    setTestingGroq(true);
    setGroqTestStatus(null);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groqApiKey: groqKey.trim() || undefined,
          groqModel,
          testOnly: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGroqTestStatus({ valid: true, message: data.message || "Key is active and responsive!" });
        showToast("Groq API Key is valid and active!");
      } else {
        setGroqTestStatus({ valid: false, message: data.message || "Invalid API key" });
        showToast(data.message || "Failed to validate key", true);
      }
    } catch (err) {
      setGroqTestStatus({ valid: false, message: err.message || "Network test failed" });
      showToast("Network error testing key", true);
    } finally {
      setTestingGroq(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e?.preventDefault();
    setSaving(true);

    try {
      const payload = {
        groqModel,
      };

      if (groqKey.trim()) {
        payload.groqApiKey = groqKey.trim();
      }

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        // Save to browser localStorage as well for client-side fallback
        if (groqKey.trim()) {
          localStorage.setItem("pp_groq_api_key", groqKey.trim());
        }
        showToast("Groq API key saved! Entire software is now using this active key.");
        loadSettings();
      } else {
        showToast(data.error || "Failed to save settings", true);
      }
    } catch (err) {
      showToast(err.message || "Failed to save settings", true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper container">
      <div className="page-header">
        <span className="badge-tag">
          <FaKey style={{ marginRight: "6px" }} /> AI Configuration
        </span>
        <h1 className="page-title">Groq API Key Settings</h1>
        <p className="page-subtitle">
          Manage your Groq AI credentials and model selection. If your API key ever expires,
          simply paste the new key below and click Save — all features will instantly switch to it.
        </p>
      </div>

      {toastMessage && (
        <div className={`toast-banner ${toastMessage.isError ? "error" : "success"}`}>
          {toastMessage.isError ? (
            <FaExclamationTriangle style={{ fontSize: "1.2rem", flexShrink: 0 }} />
          ) : (
            <FaCheckCircle style={{ fontSize: "1.2rem", flexShrink: 0 }} />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div className="settings-container">
        {/* Groq AI Settings Card */}
        <div className="settings-card card-glass">
          <div className="card-top-header">
            <div className="icon-header-box">
              <FaRobot />
            </div>
            <div className="header-text-group">
              <h2 className="card-title">Groq AI Engine Credentials</h2>
              <p className="card-desc">
                Powers AI Mock Interviews, Domain Prediction, Dynamic Placement Questions, and Copilot.
              </p>
            </div>
            <div className="status-indicator-badge">
              {serverSettings?.isGroqConfigured ? (
                <span className="status-pill active">
                  <FaCheckCircle /> Active
                </span>
              ) : (
                <span className="status-pill warning">
                  <FaExclamationTriangle /> Not Set
                </span>
              )}
            </div>
          </div>

          <form onSubmit={handleSaveSettings}>
            <div className="form-group">
              <label className="form-label">
                Groq API Key
                {serverSettings?.groqApiKeyMasked && (
                  <span className="current-key-badge">
                    Current Active: {serverSettings.groqApiKeyMasked}
                  </span>
                )}
              </label>
              <div className="input-with-action">
                <input
                  type={showGroqKey ? "text" : "password"}
                  className="form-input key-input"
                  placeholder="Paste your gsk_... API key here"
                  value={groqKey}
                  onChange={(e) => {
                    setGroqKey(e.target.value);
                    setGroqTestStatus(null);
                  }}
                />
                <button
                  type="button"
                  className="btn-toggle-view"
                  onClick={() => setShowGroqKey(!showGroqKey)}
                  aria-label="Toggle key visibility"
                >
                  {showGroqKey ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <span className="field-hint">
                Starts with <code>gsk_</code>. Saved directly to server runtime and <code>.env.local</code>.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">AI Model</label>
              <select
                value={groqModel}
                onChange={(e) => setGroqModel(e.target.value)}
                className="form-select"
              >
                <option value="llama-3.3-70b-versatile">
                  Llama 3.3 70B Versatile (Recommended — Deepest reasoning & best interview feedback)
                </option>
                <option value="llama-3.1-8b-instant">
                  Llama 3.1 8B Instant (Ultra-fast latency)
                </option>
              </select>
            </div>

            {/* Test Status Feedback */}
            {groqTestStatus && (
              <div className={`test-status-box ${groqTestStatus.valid ? "valid" : "invalid"}`}>
                {groqTestStatus.valid ? <FaCheckCircle /> : <FaExclamationTriangle />}
                <span>{groqTestStatus.message}</span>
              </div>
            )}

            <div className="action-buttons-bar">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleTestGroqKey}
                disabled={testingGroq || (!groqKey.trim() && !serverSettings?.isGroqConfigured)}
              >
                {testingGroq ? (
                  <>
                    <FaSpinner className="spin" /> Verifying Connection...
                  </>
                ) : (
                  <>
                    <FaServer /> Test API Key
                  </>
                )}
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <FaSpinner className="spin" /> Applying...
                  </>
                ) : (
                  <>
                    <FaSave /> Save & Apply Key
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Help & Key Rotation Guide Card */}
        <div className="settings-guide-card card-glass">
          <div className="guide-header">
            <FaShieldAlt className="guide-icon" />
            <h3 className="guide-title">How Groq Key Rotation Works</h3>
          </div>
          <p className="guide-text">
            When you enter and save a new Groq API key:
          </p>
          <ul className="guide-list">
            <li>
              <strong>Instant Live Switch:</strong> In-memory server runtime immediately routes all new AI requests to the updated key without server reboot.
            </li>
            <li>
              <strong>Safe Persistence:</strong> The key is safely updated in <code>.env.local</code> so it persists across local restarts.
            </li>
            <li>
              <strong>Client Fallback:</strong> Also saved in browser localStorage to ensure uninterrupted experience.
            </li>
          </ul>

          <div className="guide-footer">
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="groq-external-link"
            >
              Get a Free Groq API Key <FaExternalLinkAlt style={{ fontSize: "0.8rem" }} />
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .toast-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border-radius: var(--radius-sm);
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 28px;
          animation: slideDown 0.3s ease;
        }

        .toast-banner.success {
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .toast-banner.error {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .settings-container {
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .settings-card {
          padding: 32px;
          border-radius: 16px;
        }

        .card-top-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 26px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .icon-header-box {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
        }

        .header-text-group {
          flex: 1;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .card-desc {
          font-size: 0.88rem;
          color: #64748b;
          line-height: 1.5;
        }

        .status-indicator-badge {
          margin-left: auto;
          flex-shrink: 0;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .status-pill.active {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }

        .status-pill.warning {
          background: #fffbeb;
          color: #d97706;
          border: 1px solid #fde68a;
        }

        .current-key-badge {
          display: inline-block;
          margin-left: 10px;
          font-size: 0.78rem;
          font-weight: 500;
          color: #6366f1;
          background: #eef2ff;
          padding: 2px 8px;
          border-radius: 6px;
        }

        .form-group {
          margin-bottom: 22px;
        }

        .form-label {
          display: flex;
          align-items: center;
          font-size: 0.88rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .field-hint {
          display: block;
          font-size: 0.78rem;
          color: #64748b;
          margin-top: 6px;
        }

        .field-hint code {
          background: #f1f5f9;
          padding: 1px 4px;
          border-radius: 4px;
          font-family: var(--font-mono);
          color: #0f172a;
        }

        .input-with-action {
          position: relative;
          display: flex;
          align-items: center;
        }

        .form-input.key-input {
          padding-right: 48px;
          font-family: var(--font-mono);
          letter-spacing: 0.05em;
          font-size: 0.92rem;
        }

        .btn-toggle-view {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          font-size: 1.1rem;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s ease;
        }

        .btn-toggle-view:hover {
          color: #0f172a;
        }

        .test-status-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          margin-bottom: 22px;
        }

        .test-status-box.valid {
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .test-status-box.invalid {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .action-buttons-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 10px;
        }

        /* Guide Card */
        .settings-guide-card {
          padding: 24px 28px;
          border-radius: 14px;
          border-left: 4px solid #7c3aed;
        }

        .guide-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .guide-icon {
          color: #7c3aed;
          font-size: 1.2rem;
        }

        .guide-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0f172a;
        }

        .guide-text {
          font-size: 0.88rem;
          color: #475569;
          margin-bottom: 10px;
        }

        .guide-list {
          list-style: disc;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.5;
        }

        .guide-list code {
          background: #f1f5f9;
          padding: 1px 4px;
          border-radius: 4px;
          font-family: var(--font-mono);
          color: #0f172a;
        }

        .guide-footer {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid #e2e8f0;
        }

        .groq-external-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #7c3aed;
          font-size: 0.88rem;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .groq-external-link:hover {
          color: #6d28d9;
          text-decoration: underline;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 640px) {
          .settings-card {
            padding: 20px;
          }

          .action-buttons-bar {
            flex-direction: column;
          }

          .action-buttons-bar .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
