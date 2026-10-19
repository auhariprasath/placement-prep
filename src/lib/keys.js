import fs from "fs";
import path from "path";

// In-memory runtime override store (persists across requests during server runtime)
if (!global.__APP_RUNTIME_CONFIG) {
  global.__APP_RUNTIME_CONFIG = {
    GROQ_API_KEY: process.env.GROQ_API_KEY || "",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lhfroegebpddmjgnwdvk.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoZnJvZWdlYnBkZG1qZ253ZHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MTI5OTAsImV4cCI6MjEwNzk4ODk5MH0.BhbLNlcgWyfb6kdiA7crcZHEeoUeE7MQEBb-7RRna4s",
    GROQ_MODEL: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
  };
}

/**
 * Get active API key with fallback order:
 * 1. Client header override (x-groq-api-key)
 * 2. Runtime memory store
 * 3. process.env
 */
export function getActiveApiKey(keyName, clientOverride = null) {
  if (clientOverride && clientOverride.trim()) {
    return clientOverride.trim();
  }

  if (global.__APP_RUNTIME_CONFIG && global.__APP_RUNTIME_CONFIG[keyName]) {
    return global.__APP_RUNTIME_CONFIG[keyName];
  }

  return process.env[keyName] || "";
}

/**
 * Safely updates an environment key in runtime memory and .env.local file
 */
export function setActiveApiKey(keyName, value) {
  const cleanVal = (value || "").trim();

  // 1. Update in-memory runtime
  if (!global.__APP_RUNTIME_CONFIG) {
    global.__APP_RUNTIME_CONFIG = {};
  }
  global.__APP_RUNTIME_CONFIG[keyName] = cleanVal;

  // 2. Update process.env
  process.env[keyName] = cleanVal;

  // 3. Persist to .env.local
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    let content = "";
    if (fs.existsSync(envPath)) {
      content = fs.readFileSync(envPath, "utf-8");
    }

    const regex = new RegExp(`^${keyName}=.*$`, "m");
    if (regex.test(content)) {
      content = content.replace(regex, `${keyName}=${cleanVal}`);
    } else {
      content = content ? `${content.trim()}\n${keyName}=${cleanVal}\n` : `${keyName}=${cleanVal}\n`;
    }

    fs.writeFileSync(envPath, content, "utf-8");
    return true;
  } catch (err) {
    console.error("Failed to persist key to .env.local:", err);
    return false;
  }
}

/**
 * Tests a Groq API key directly against the Groq API
 * Attempts requested lightweight model, and gracefully checks available alternatives
 */
export async function testGroqApiKey(apiKey, model = "llama-3.1-8b-instant") {
  if (!apiKey || !apiKey.trim()) {
    return { valid: false, message: "API Key is empty" };
  }

  const cleanKey = apiKey.trim();
  const modelsToTry = [
    model || "llama-3.1-8b-instant",
    "llama-3.1-8b-instant",
    "qwen/qwen3.8-27b",
    "openai/gpt-oss-20b",
    "llama-3.3-70b-versatile"
  ].filter((m, i, arr) => m && arr.indexOf(m) === i);

  let lastErrorMsg = "";

  for (const m of modelsToTry) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cleanKey}`,
        },
        body: JSON.stringify({
          model: m,
          messages: [{ role: "user", content: "Ping" }],
          max_tokens: 5,
        }),
      });

      if (res.ok) {
        return {
          valid: true,
          message: `API Key is valid and active! (${m})`,
          workingModel: m,
        };
      }

      const err = await res.json().catch(() => ({}));
      lastErrorMsg = err?.error?.message || `HTTP ${res.status}: ${res.statusText}`;

      // If it's an authentication error (401), stop immediately
      if (res.status === 401 || lastErrorMsg.toLowerCase().includes("invalid api key")) {
        return { valid: false, message: "Invalid API key: Key is not recognized or has expired." };
      }
    } catch (error) {
      lastErrorMsg = error.message || "Failed to reach Groq server";
    }
  }

  return { valid: false, message: lastErrorMsg };
}

/**
 * Masks an API key for safe UI display (e.g., gsk_...a1b2)
 */
export function maskKey(key) {
  if (!key) return "";
  if (key.length <= 8) return "••••••••";
  return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
}
