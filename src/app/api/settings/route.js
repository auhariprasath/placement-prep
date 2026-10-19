import { NextResponse } from "next/server";
import { getActiveApiKey, setActiveApiKey, testGroqApiKey, maskKey } from "@/lib/keys";

export async function GET() {
  try {
    const groqKey = getActiveApiKey("GROQ_API_KEY");
    const supabaseUrl = getActiveApiKey("NEXT_PUBLIC_SUPABASE_URL");
    const supabaseAnonKey = getActiveApiKey("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    const groqModel = getActiveApiKey("GROQ_MODEL") || "llama-3.3-70b-versatile";

    return NextResponse.json({
      success: true,
      settings: {
        groqApiKeyMasked: maskKey(groqKey),
        isGroqConfigured: Boolean(groqKey && groqKey.startsWith("gsk_")),
        groqModel,
        supabaseUrl: supabaseUrl || "https://lhfroegebpddmjgnwdvk.supabase.co",
        supabaseAnonKeyMasked: maskKey(supabaseAnonKey),
        isSupabaseConfigured: Boolean(supabaseAnonKey && supabaseAnonKey.length > 20),
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
      supabaseUrl,
      supabaseAnonKey,
      groqModel,
      testOnly = false,
    } = body;

    // If client just wants to test a Groq key
    if (testOnly && groqApiKey) {
      const testResult = await testGroqApiKey(groqApiKey, groqModel);
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

    if (supabaseUrl !== undefined && supabaseUrl !== null) {
      const cleanUrl = supabaseUrl.trim();
      if (cleanUrl) {
        setActiveApiKey("NEXT_PUBLIC_SUPABASE_URL", cleanUrl);
        updates.supabaseUrl = true;
      }
    }

    if (supabaseAnonKey !== undefined && supabaseAnonKey !== null) {
      const cleanKey = supabaseAnonKey.trim();
      if (cleanKey) {
        setActiveApiKey("NEXT_PUBLIC_SUPABASE_ANON_KEY", cleanKey);
        updates.supabaseAnonKey = true;
      }
    }

    if (groqModel) {
      setActiveApiKey("GROQ_MODEL", groqModel.trim());
      updates.groqModel = true;
    }

    return NextResponse.json({
      success: true,
      message: "API Keys and Settings updated successfully! All tools are now using these active keys.",
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
