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
  FaSyncAlt,
  FaDatabase
} from "react-icons/fa";

export default function SettingsPage() {
  const [groqKey, setGroqKey] = useState("");
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [groqModel, setGroqModel] = useState("llama-3.3-70b-versatile");
  const [supabaseUrl, setSupabaseUrl] = useState("https://lhfroegebpddmjgnwdvk.supabase.co");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [showSupabaseKey, setShowSupabaseKey] = useState(false);

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
        setSupabaseUrl(data.settings.supabaseUrl || "https://lhfroegebpddmjgnwdvk.supabase.co");
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
    if (!groqKey.trim()) {
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
          groqApiKey: groqKey.trim(),
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
        supabaseUrl: supabaseUrl.trim(),
      };

      if (groqKey.trim()) {
        payload.groqApiKey = groqKey.trim();
      }

      if (supabaseAnonKey.trim()) {
        payload.supabaseAnonKey = supabaseAnonKey.trim();
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
        showToast("All settings saved! Entire software is now using this API key.");
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
          <FaKey style={{ marginRight: "6px" }} /> API & System Settings
        </span>
        <h1 className="page-title">Manage API Keys & Configuration</h1>
        <p className="page-subtitle">
          If an API key expires or needs updating, enter your new key below.
          The entire placement platform will immediately switch to using the new key.
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

      <div className="settings-grid">
        {/* Groq AI Settings Card */}
        <div className="settings-card card-glass">
          <div className="card-top-header">
            <div className="icon-header-box">
              <FaRobot />
            </div>
            <div>
              <h2 className="card-title">Groq AI Engine Key</h2>
              <p className="card-desc">
                Powers AI Voice Mock Interviews, Domain Prediction, Dynamic Placement Questions, and Copilot.
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

          <div className="form-group">
            <label className="form-label">
              Groq API Key
              {serverSettings?.groqApiKeyMasked && (
                <span className="current-key-badge">
                  Current Key: {serverSettings.groqApiKeyMasked}
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
          </div>

          <div className="form-group">
            <label className="form-label">AI Model</label>
            <select
              value={groqModel}
              onChange={(e) => setGroqModel(e.target.value)}
              className="form-select"
            >
              <option value="llama-3.3-70b-versatile">
                Llama 3.3 70B Versatile (Recommended - Deepest reasoning & best interview quality)
              </option>
              <option value="llama-3.1-8b-instant">
                Llama 3.1 8B Instant (Ultra-fast response & highest throughput)
              </option>
            </select>
          </div>

          {/* Test Status Banner */}
          {groqTestStatus && (
            <div className={`test-status-box ${groqTestStatus.valid ? "valid" : "invalid"}`}>
              {groqTestStatus.valid ? <FaCheckCircle /> : <FaExclamationTriangle />}
              <span>{groqTestStatus.message}</span>
            </div>
          )}

          <div className="card-actions-row">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleTestGroqKey}
              disabled={testingGroq || !groqKey.trim()}
            >
              {testingGroq ? (
                <>
                  <FaSpinner className="spin" /> Verifying Key...
                </>
              ) : (
                <>
                  <FaServer /> Test Key Validity
                </>
              )}
            </button>

            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="groq-help-link"
            >
              Get a Free Groq Key <FaExternalLinkAlt style={{ fontSize: "0.75rem" }} />
            </a>
          </div>
        </div>

        {/* Supabase Cloud Database Card */}
        <div className="settings-card card-glass">
          <div className="card-top-header">
            <div className="icon-header-box supabase-icon">
              <FaDatabase />
            </div>
            <div>
              <h2 className="card-title">Supabase Database Connection</h2>
              <p className="card-desc">
                Stores your completed mock interviews, community discussion posts, and candidate profiles.
              </p>
            </div>
            <div className="status-indicator-badge">
              {serverSettings?.isSupabaseConfigured ? (
                <span className="status-pill active">
                  <FaCheckCircle /> Connected
                </span>
              ) : (
                <span className="status-pill neutral">
                  Local Memory Mode
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Supabase Project URL</label>
            <input
              type="text"
              className="form-input"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Supabase Anon / Public Key
              {serverSettings?.supabaseAnonKeyMasked && (
                <span className="current-key-badge">
                  Current Key: {serverSettings.supabaseAnonKeyMasked}
                </span>
              )}
            </label>
            <div className="input-with-action">
              <input
                type={showSupabaseKey ? "text" : "password"}
                className="form-input key-input"
                placeholder="Paste your Supabase anon/public key here"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
              />
              <button
                type="button"
                className="btn-toggle-view"
                onClick={() => setShowSupabaseKey(!showSupabaseKey)}
                aria-label="Toggle key visibility"
              >
                {showSupabaseKey ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Save Action Bar */}
      <div className="settings-save-bar card-glass">
        <div className="save-bar-info">
          <h3 className="save-bar-title">Apply & Activate New Keys</h3>
          <p className="save-bar-desc">
            Clicking Save updates both the server runtime environment and your configuration.
            No server restart required.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-save-all"
          onClick={handleSaveSettings}
          disabled={saving}
        >
          {saving ? (
            <>
              <FaSpinner className="spin" /> Updating Software Keys...
            </>
          ) : (
            <>
              <FaSave /> Save & Apply Across Entire App
            </>
          )}
        </button>
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

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          margin-bottom: 32px;
        }

        .settings-card {
          padding: 32px;
          display: flex;
          flex-direction: column;
        }

        .card-top-header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
        }

        .icon-header-box {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: var(--grad-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
        }

        .icon-header-box.supabase-icon {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
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

        .status-pill.neutral {
          background: #f1f5f9;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }

        .current-key-badge {
          display: inline-block;
          margin-left: 10px;
          font-size: 0.78rem;
          font-weight: 500;
          color: #6366f1;
          background: #eef2ff;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .input-with-action {
          position: relative;
          display: flex;
          align-items: center;
        }

        .key-input {
          padding-right: 46px;
          font-family: var(--font-mono);
          font-size: 0.9rem;
        }

        .btn-toggle-view {
          position: absolute;
          right: 12px;
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          font-size: 1.05rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-toggle-view:hover {
          color: #0f172a;
        }

        .test-status-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .test-status-box.valid {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }

        .test-status-box.invalid {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .card-actions-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
        }

        .groq-help-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #6366f1;
        }

        .groq-help-link:hover {
          color: #4f46e5;
          text-decoration: underline;
        }

        /* Save Bar */
        .settings-save-bar {
          padding: 24px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .save-bar-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .save-bar-desc {
          font-size: 0.88rem;
          color: #64748b;
        }

        .btn-save-all {
          padding: 13px 28px;
          font-size: 1rem;
          white-space: nowrap;
        }

        @media (max-width: 900px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
          .settings-save-bar {
            flex-direction: column;
            text-align: center;
          }
          .btn-save-all {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
