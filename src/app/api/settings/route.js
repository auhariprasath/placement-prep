import { NextResponse } from "next/server";
import { getActiveApiKey, setActiveApiKey, testGroqApiKey, maskKey } from "@/lib/keys";

export async function GET() {
  try {
    const groqKey = getActiveApiKey("GROQ_API_KEY");
    const groqModel = getActiveApiKey("GROQ_MODEL") || "llama-3.3-70b-versatile";

    return NextResponse.json({
      success: true,
      settings: {
        groqApiKeyMasked: maskKey(groqKey),
        isGroqConfigured: Boolean(groqKey && groqKey.startsWith("gsk_")),
        groqModel,
      },
    });
  } catch (error) {
    console.error("Error reading settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to read settings" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      groqApiKey,
      groqModel,
      testOnly = false,
    } = body;

    const currentKey = groqApiKey || getActiveApiKey("GROQ_API_KEY");

    // If client just wants to test a Groq key
    if (testOnly) {
      if (!currentKey) {
        return NextResponse.json({
          success: false,
          message: "No Groq API Key provided to test",
        });
      }
      const testResult = await testGroqApiKey(currentKey, groqModel);
      return NextResponse.json({
        success: testResult.valid,
        message: testResult.message,
      });
    }

    const updates = {};
    let groqValidation = null;

    if (groqApiKey !== undefined && groqApiKey !== null) {
      const cleanKey = groqApiKey.trim();
      if (cleanKey) {
        // Validate key before saving
        groqValidation = await testGroqApiKey(cleanKey, groqModel);
        if (!groqValidation.valid) {
          return NextResponse.json(
            {
              success: false,
              error: `Invalid Groq API Key: ${groqValidation.message}. Please check and try again.`,
            },
            { status: 400 }
          );
        }
        setActiveApiKey("GROQ_API_KEY", cleanKey);
        updates.groqApiKey = true;
      }
    }

    if (groqModel) {
      setActiveApiKey("GROQ_MODEL", groqModel.trim());
      updates.groqModel = true;
    }

    return NextResponse.json({
      success: true,
      message: "Groq API credentials updated successfully! All tools are now using these active settings.",
      updates,
      groqValidation,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
