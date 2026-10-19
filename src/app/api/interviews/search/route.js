import { NextResponse } from "next/server";
import { callGroq, extractJSON } from "@/lib/groq";
import { INITIAL_INTERVIEW_EXPERIENCES } from "@/lib/store";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      company = "All",
      role = "Software Development Engineer",
      difficulty = "All",
      topic = "All",
      searchQuery = "",
    } = body;

    const targetCompany = company === "All" ? "Top Tech Companies" : company;
    const targetDifficulty = difficulty === "All" ? "Medium to Hard" : difficulty;
    const targetTopic = topic === "All" ? "Data Structures, Algorithms & System Design" : topic;

    // Build the dynamic prompt for Groq AI
    const systemPrompt = `You are an elite Tech Interview Lead and Campus Placement Director. 
Generate authentic, high-quality placement interview experiences and specific technical questions asked during hiring drives at top technology and product firms.
Respond ONLY with a valid JSON object matching the requested schema.`;

    const userPrompt = `Generate 3 to 4 comprehensive, authentic interview experiences with real questions for candidates preparing for placements.
Target Company: "${targetCompany}"
Target Role: "${role}"
Target Difficulty: "${targetDifficulty}"
Focus Topic / Keywords: "${targetTopic}" ${searchQuery ? `(Search Keyword: "${searchQuery}")` : ""}

Return a JSON object with this exact structure:
{
  "source": "AI_DYNAMIC_API",
  "company": "${targetCompany}",
  "experiences": [
    {
      "id": "exp-1",
      "company": "Company Name (e.g. Google, Amazon, Microsoft, TCS, etc.)",
      "role": "Role Name (e.g. SDE-1, Software Engineer)",
      "date": "Recent 2026 Drive",
      "difficulty": "Easy" | "Medium" | "Hard",
      "rounds": "4 Rounds (OA, DSA, System Design, Behavioral)",
      "process": "Detailed summary of how the interview rounds were conducted...",
      "questions": [
        {
          "title": "Specific problem title (e.g., Lowest Common Ancestor in Binary Tree)",
          "category": "DSA" | "System Design" | "DBMS" | "Operating Systems" | "Behavioral",
          "difficulty": "Medium",
          "description": "Full problem statement and constraints as asked in the real interview.",
          "approach": "Optimal algorithm, time complexity (e.g. O(N)), and space complexity.",
          "solution": "Key solution logic or code implementation hint.",
          "followUp": "Follow-up question or edge case the interviewer pushed on."
        },
        {
          "title": "Second technical question...",
          "category": "System Design",
          "difficulty": "Hard",
          "description": "Problem statement...",
          "approach": "Architecture/design approach...",
          "solution": "Key trade-offs...",
          "followUp": "Scale or latency constraint..."
        }
      ],
      "tips": [
        "First practical recommendation for this company...",
        "Second tip regarding behavioral/coding rounds..."
      ]
    }
  ]
}`;

    let aiData = null;
    try {
      const rawResponse = await callGroq({
        prompt: userPrompt,
        systemPrompt,
        temperature: 0.6,
        maxTokens: 3000,
        responseFormat: "json",
      });

      aiData = extractJSON(rawResponse);
    } catch (groqError) {
      console.warn("Groq dynamic interview generation failed, using intelligent filter fallback:", groqError.message);
    }

    if (aiData && Array.isArray(aiData.experiences) && aiData.experiences.length > 0) {
      return NextResponse.json({
        success: true,
        isDynamic: true,
        source: "AI Groq Real-Time Generation",
        experiences: aiData.experiences,
        total: aiData.experiences.length,
      });
    }

    // Fallback if key missing or rate-limited: filter baseline store with friendly banner
    let filtered = [...INITIAL_INTERVIEW_EXPERIENCES];
    if (company && company !== "All") {
      const c = company.toLowerCase();
      filtered = filtered.filter((item) => item.company.toLowerCase().includes(c));
    }
    if (difficulty && difficulty !== "All") {
      const d = difficulty.toLowerCase();
      filtered = filtered.filter((item) => item.difficulty.toLowerCase().includes(d));
    }

    return NextResponse.json({
      success: true,
      isDynamic: false,
      source: "Archived Repository (Configure your free Groq API key in Settings for unlimited live AI questions)",
      experiences: filtered.length > 0 ? filtered : INITIAL_INTERVIEW_EXPERIENCES,
      total: filtered.length,
    });
  } catch (error) {
    console.error("Error in interview questions API:", error);
    return NextResponse.json(
      {
        success: false,
        experiences: INITIAL_INTERVIEW_EXPERIENCES,
        total: INITIAL_INTERVIEW_EXPERIENCES.length,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
