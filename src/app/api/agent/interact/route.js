import { NextResponse } from "next/server";
import { callGroq } from "@/lib/groq";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      message = "",
      context = "",
      sessionId = "session-" + Date.now(),
      interactionType = "GENERAL",
    } = body;

    if (!message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const systemPrompt = `You are "Placement Copilot", an elite AI Career Advisor built into the Placement Prep Platform.
You assist engineering candidates with:
- Interview guidance, DSA advice, resume optimization, and mock interview coaching
- Engineering domain selection, semester preparation, and roadmaps
- Smart navigation to features within this platform:
  Available paths:
  - "/mock-interview" : Voice & webcam AI Mock Interview simulator
  - "/domain-selection" : Engineering domain prediction and course recommender
  - "/study-planner" : Personalized daily study roadmap generator
  - "/job-search" : Job openings and placement listings
  - "/interview-search" : Company interview experiences & questions
  - "/resume-builder" : Interactive ATS resume builder
  - "/resume-matcher" : ATS resume scanner vs job description
  - "/compiler" : Online code runner (Java, Python, C++, JS)
  - "/forum" : Community discussion board
  - "/blog" : Placement guides and tips

When a user's intent clearly matches a feature (e.g. "I want to practice an interview for SDE" or "Create a 30-day study plan for Java"), you can append a navigation command at the very end of your response:
Format:
[NAVIGATE: /target-path | DATA: {"subject":"Java","durationDays":30,"autoSubmit":true}]

Keep your textual response warm, encouraging, and structured with concise bullet points.`;

    const userPrompt = `User Message: "${message}"
Interaction Type: ${interactionType}
Context / History: ${context || "None"}`;

    let aiResponse = "";
    try {
      aiResponse = await callGroq({
        prompt: userPrompt,
        systemPrompt,
        temperature: 0.5,
        maxTokens: 1500,
      });
    } catch (e) {
      console.warn("Groq agent fallback:", e.message);
      aiResponse = `Hello! I am your AI Placement Copilot. I can help guide your placement strategy, whether you're brushing up on Data Structures, crafting an ATS-friendly resume, or practicing voice mock interviews. What role or company are you targeting this season?`;
    }

    let redirectPath = null;
    let targetState = null;

    if (aiResponse.includes("[NAVIGATE:")) {
      const start = aiResponse.indexOf("[NAVIGATE:");
      const end = aiResponse.indexOf("]", start);
      if (end > start) {
        const navRaw = aiResponse.substring(start + 10, end).trim();
        const parts = navRaw.split("|");
        redirectPath = parts[0].trim();

        if (parts.length > 1) {
          const dataPart = parts.slice(1).join("|").trim();
          if (dataPart.startsWith("DATA:")) {
            try {
              targetState = JSON.parse(dataPart.substring(5).trim());
            } catch (err) {
              console.warn("Could not parse navigation state JSON:", err);
            }
          }
        }
        // Remove the [NAVIGATE: ...] tag from the clean user display
        aiResponse = (aiResponse.substring(0, start) + aiResponse.substring(end + 1)).trim();
      }
    }

    return NextResponse.json({
      response: aiResponse,
      redirectPath,
      targetState,
      sessionId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in AI agent:", error);
    return NextResponse.json(
      { error: "Failed to interact with AI agent: " + error.message },
      { status: 500 }
    );
  }
}
