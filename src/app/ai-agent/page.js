"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaRobot,
  FaPaperPlane,
  FaUser,
  FaLightbulb,
  FaArrowRight,
  FaSpinner,
  FaTrashAlt
} from "react-icons/fa";

export default function AIAgentPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I am your AI Placement Copilot. I can advise you on technical coding rounds, behavioral interviews, resume improvements, or immediately launch tools across this platform. What target company or role are you preparing for?",
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [navAlert, setNavAlert] = useState(null);

  const messagesEndRef = useRef(null);

  const samplePrompts = [
    "I want to practice an AI voice mock interview for SDE",
    "Create a 30-day study roadmap for Data Structures",
    "How to prepare for Amazon Leadership Principles?",
    "What are the best projects for an ATS resume?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!res.ok) throw new Error("Agent request failed");
      const data = await res.json();

      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: data.response,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);

      // If navigation action returned
      if (data.redirectPath) {
        setNavAlert({
          path: data.redirectPath,
          state: data.targetState,
        });

        setTimeout(() => {
          router.push(data.redirectPath);
        }, 2500);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: "I encountered a brief connection issue. Please make sure your GROQ_API_KEY is configured in your environment or retry your query.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper container">
      <div className="page-header">
        <span className="badge-tag">
          <FaRobot style={{ marginRight: "6px" }} /> 24/7 AI Placement Copilot
        </span>
        <h1 className="page-title">AI Career Assistant & Mentor</h1>
        <p className="page-subtitle">
          Ask questions about recruitment rounds, coding strategies, or tell the assistant what you need and let it guide you through the platform.
        </p>
      </div>

      {navAlert && (
        <div className="nav-redirect-banner card-glass">
          <FaArrowRight className="redirect-icon" />
          <span>Navigating you to <strong>{navAlert.path}</strong> in 2 seconds...</span>
          <button onClick={() => router.push(navAlert.path)} className="btn btn-accent btn-sm">
            Go Now
          </button>
        </div>
      )}

      {/* Chat Room */}
      <div className="chat-window card-glass">
        {/* Messages List */}
        <div className="chat-messages-scroll">
          {messages.map((m) => {
            const isAI = m.sender === "ai";
            return (
              <div key={m.id} className={`message-row ${isAI ? "row-ai" : "row-user"}`}>
                <div className={`avatar-pill ${isAI ? "pill-ai" : "pill-user"}`}>
                  {isAI ? <FaRobot /> : <FaUser />}
                </div>
                <div className="message-content">
                  <div className={`bubble ${isAI ? "bubble-ai" : "bubble-user"}`}>
                    <p>{m.text}</p>
                  </div>
                  <span className="msg-time">{m.time}</span>
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="message-row row-ai">
              <div className="avatar-pill pill-ai">
                <FaRobot />
              </div>
              <div className="bubble bubble-ai typing-bubble">
                <FaSpinner className="spin" style={{ marginRight: "8px" }} />
                <span>Placement Copilot is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Sample Prompts */}
        <div className="quick-prompts-bar">
          <span className="quick-label">
            <FaLightbulb style={{ color: "#f59e0b" }} /> Suggestions:
          </span>
          <div className="quick-chips">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p)}
                className="quick-chip-btn"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="chat-input-bar"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Placement Copilot anything about interviews, DSA, or system design..."
            className="chat-input-field"
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()} className="btn btn-primary send-btn">
            <FaPaperPlane />
          </button>
        </form>
      </div>

      <style jsx>{`
        .chat-window {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          height: 650px;
          overflow: hidden;
        }

        .nav-redirect-banner {
          max-width: 900px;
          margin: 0 auto 16px;
          padding: 14px 20px;
          background: rgba(99, 102, 241, 0.2);
          border: 1px solid rgba(99, 102, 241, 0.4);
          color: #c7d2fe;
          display: flex;
          align-items: center;
          gap: 12px;
          border-radius: var(--radius-sm);
        }

        .redirect-icon {
          color: #ec4899;
          font-size: 1.1rem;
        }

        .btn-sm {
          padding: 6px 14px;
          font-size: 0.8rem;
          margin-left: auto;
        }

        .chat-messages-scroll {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .message-row {
          display: flex;
          gap: 12px;
          max-width: 80%;
        }

        .row-ai {
          align-self: flex-start;
        }

        .row-user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .avatar-pill {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: white;
          flex-shrink: 0;
        }

        .pill-ai {
          background: var(--grad-primary);
        }

        .pill-user {
          background: var(--grad-accent);
        }

        .message-content {
          display: flex;
          flex-direction: column;
        }

        .row-user .message-content {
          align-items: flex-end;
        }

        .bubble {
          padding: 14px 18px;
          border-radius: 16px;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .bubble-ai {
          background: rgba(18, 26, 45, 0.9);
          border: 1px solid var(--border-light);
          color: #f1f5f9;
          border-top-left-radius: 4px;
        }

        .bubble-user {
          background: var(--grad-primary);
          color: #ffffff;
          border-top-right-radius: 4px;
        }

        .typing-bubble {
          display: flex;
          align-items: center;
          color: #a5b4fc;
          font-size: 0.88rem;
        }

        .msg-time {
          font-size: 0.72rem;
          color: #64748b;
          margin-top: 4px;
          padding: 0 4px;
        }

        .quick-prompts-bar {
          padding: 10px 20px;
          background: rgba(13, 20, 36, 0.5);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          gap: 10px;
          overflow-x: auto;
        }

        .quick-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }

        .quick-chips {
          display: flex;
          gap: 8px;
        }

        .quick-chip-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-light);
          color: #cbd5e1;
          padding: 5px 12px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .quick-chip-btn:hover {
          background: rgba(99, 102, 241, 0.2);
          border-color: rgba(99, 102, 241, 0.4);
          color: white;
        }

        .chat-input-bar {
          display: flex;
          gap: 12px;
          padding: 16px 20px;
          background: rgba(9, 13, 22, 0.8);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .chat-input-field {
          flex: 1;
          background: rgba(18, 26, 45, 0.8);
          border: 1px solid var(--border-light);
          padding: 12px 18px;
          border-radius: var(--radius-sm);
          color: white;
          font-size: 0.95rem;
          outline: none;
        }

        .chat-input-field:focus {
          border-color: #818cf8;
        }

        .send-btn {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
}
