import { NextResponse } from "next/server";
import { callGroq, extractJSON } from "@/lib/groq";

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let role = "Software Development Engineer (SDE-1)";
    let resumeText = "";
    let difficulty = "Medium";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      role = formData.get("role") || role;
      difficulty = formData.get("difficulty") || difficulty;
      resumeText = formData.get("resumeText") || "";

      const file = formData.get("file");
      if (file && typeof file === "object" && file.name) {
        try {
          const text = await file.text();
          // Keep ASCII printable text for basic PDF/Text stream
          const cleanText = text.replace(/[^\x20-\x7E\n]/g, " ").replace(/\s+/g, " ");
          if (cleanText.length > 50) {
            resumeText = (resumeText ? resumeText + "\n" : "") + cleanText.slice(0, 4000);
          }
        } catch (e) {
          console.warn("Could not read uploaded file as text:", e);
        }
      }
    } else {
      const body = await req.json().catch(() => ({}));
      role = body.role || role;
      difficulty = body.difficulty || difficulty;
      resumeText = body.resumeText || "";
    }

    const systemPrompt = `You are an elite Tech Hiring Manager conducting a realistic technical and behavioral placement interview.
You will generate exactly 5 interview questions tailored to the candidate's chosen target role, background, and difficulty.
Respond ONLY with a valid JSON object matching this schema:
{
  "interviewId": "unique-id-string",
  "role": "${role}",
  "difficulty": "${difficulty}",
  "candidateSummary": "2-sentence summary of candidate background and focus areas",
  "questions": [
    {
      "id": 1,
      "category": "Introduction & Resume Deep-Dive",
      "question": "Clear, direct interview question",
      "hint": "What the interviewer is specifically evaluating in this question",
      "expectedKeyPoints": ["Key point 1", "Key point 2"]
    }
  ]
}`;

    const userPrompt = `Target Role: ${role}
Difficulty Level: ${difficulty}
Candidate Resume / Skills:
${resumeText || "Candidate is a Final Year Computer Science / IT engineering student with knowledge in Data Structures, Algorithms, Web Development, Databases, and Object-Oriented Design."}

Please generate exactly 5 progressive interview questions:
1. Warmup / Project or Resume Deep-dive
2. Core Technical Concept (DSA / OOP / Architecture)
3. Problem Solving / Scenario-based Technical Challenge
4. System Design or Database / API optimization
5. Behavioral / Culture Fit (STAR scenario)`;

    let parsed = null;
    try {
      const rawAI = await callGroq({
        prompt: userPrompt,
        systemPrompt,
        temperature: 0.4,
        maxTokens: 2000,
        responseFormat: "json",
      });
      parsed = extractJSON(rawAI);
    } catch (groqErr) {
      console.warn("Groq AI failed in interview start, falling back to curated questions:", groqErr.message);
    }

    if (!parsed || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      parsed = {
        interviewId: "intv-" + Date.now(),
        role,
        difficulty,
        candidateSummary: `Interview for ${role} with focus on problem solving, computer science fundamentals, and real-world system architecture.`,
        questions: [
          {
            id: 1,
            category: "Project Deep Dive",
            question: "Walk me through the most technically challenging project on your resume. What architectural choices did you make, and how did you handle performance bottlenecks?",
            hint: "Focus on problem statement, tech stack rationale, measurable impact, and trade-offs.",
            expectedKeyPoints: ["Clear architecture explanation", "Handling bottlenecks", "Individual contribution"]
          },
          {
            id: 2,
            category: "Data Structures & Algorithms",
            question: "How would you design an algorithm to find the Longest Substring Without Repeating Characters in O(N) time? Explain your pointer movement and data structures.",
            hint: "Mention Sliding Window technique with a Hash Map or array for last seen indices.",
            expectedKeyPoints: ["Sliding Window approach", "Hash Map lookup O(1)", "O(N) time and O(min(N, M)) space complexity"]
          },
          {
            id: 3,
            category: "System Design & Optimization",
            question: "Suppose your application's database is experiencing heavy read latency during campus placement traffic spikes. What caching and indexing strategies would you implement?",
            hint: "Discuss Redis caching layer, Read Replicas, Composite B-Tree Indexes, and cache invalidation policies.",
            expectedKeyPoints: ["Redis / Memcached layer", "B-Tree indexing on query fields", "Cache eviction like LRU"]
          },
          {
            id: 4,
            category: "Database & Concurrency",
            question: "Explain the difference between Optimistic Locking and Pessimistic Locking. In what scenarios would you choose one over the other in a ticketing system?",
            hint: "Focus on collision probability, database lock overhead, and retry mechanisms.",
            expectedKeyPoints: ["Version column for optimistic", "SELECT FOR UPDATE for pessimistic", "High contention trade-offs"]
          },
          {
            id: 5,
            category: "Behavioral & Conflict Resolution",
            question: "Tell me about a time when you disagreed with a teammate or project partner regarding technical direction. How did you resolve the conflict and deliver on time?",
            hint: "Use STAR (Situation, Task, Action, Result) method emphasizing empathy, objective benchmarks, and team alignment.",
            expectedKeyPoints: ["Objective data-driven decision", "Respectful communication", "Successful delivery"]
          }
        ]
      };
    }

    if (!parsed.interviewId) {
      parsed.interviewId = "intv-" + Date.now();
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error in mock interview start:", error);
    return NextResponse.json(
      { error: "Failed to initialize mock interview: " + error.message },
      { status: 500 }
    );
  }
}
