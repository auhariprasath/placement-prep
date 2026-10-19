/**
 * Groq AI Client & Utilities
 * Uses native fetch (Node 18+ and edge compatible) for zero-dependency AI calls.
 */

import { getActiveApiKey } from "@/lib/keys";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function callGroq({
  prompt,
  systemPrompt = "You are an elite Placement Preparation AI Assistant. Provide insightful, highly accurate, and practical advice for engineering and tech candidates.",
  temperature = 0.5,
  maxTokens = 2500,
  responseFormat = null,
  apiKey: explicitKey = null,
  model = null,
}) {
  const apiKey = getActiveApiKey("GROQ_API_KEY", explicitKey);
  const activeModel = model || getActiveApiKey("GROQ_MODEL") || "llama-3.3-70b-versatile";

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not configured or has expired. Please open the Settings page to add your active Groq API key."
    );
  }

  const messages = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const payload = {
    model: activeModel,
    messages,
    temperature,
    max_tokens: maxTokens,
  };

  if (responseFormat === "json") {
    payload.response_format = { type: "json_object" };
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Groq API error:", response.status, errorText);

    // Fallback model if the current one has rate limit or deprecation
    if (activeModel !== "llama-3.1-8b-instant") {
      try {
        console.warn("Retrying with llama-3.1-8b-instant fallback...");
        payload.model = "llama-3.1-8b-instant";
        const retryRes = await fetch(GROQ_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(payload),
        });
        if (retryRes.ok) {
          const data = await retryRes.json();
          return data.choices?.[0]?.message?.content || "";
        }
      } catch (e) {
        console.error("Fallback failed", e);
      }
    }

    throw new Error(`Groq API returned ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

/**
 * Safely extracts JSON from an LLM response string that might contain markdown backticks
 */
export function extractJSON(rawText) {
  if (!rawText) return null;
  const trimmed = rawText.trim();

  // Try direct parse
  try {
    return JSON.parse(trimmed);
  } catch (_) {
    // Continue
  }

  // Look for ```json ... ``` blocks
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch (_) {
      // Continue
    }
  }

  // Look for first '{' and last '}'
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(trimmed.substring(firstBrace, lastBrace + 1));
    } catch (_) {
      // Continue
    }
  }

  // Look for first '[' and last ']'
  const firstBracket = trimmed.indexOf("[");
  const lastBracket = trimmed.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    try {
      return JSON.parse(trimmed.substring(firstBracket, lastBracket + 1));
    } catch (_) {
      // Continue
    }
  }

  return null;
}
