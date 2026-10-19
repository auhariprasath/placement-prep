import { NextResponse } from "next/server";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";


export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "POST /api/resume/parse" });
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const fileName = file.name || "resume";
    const fileExt = fileName.split(".").pop().toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";

    if (fileExt === "pdf" || file.type === "application/pdf") {
      try {
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text || "";
      } catch (pdfErr) {
        console.error("PDF parse error:", pdfErr);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to extract text from PDF. The file may be password protected or scanned as an image.",
          },
          { status: 422 }
        );
      }
    } else if (
      fileExt === "docx" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      try {
        const docxResult = await mammoth.extractRawText({ buffer });
        extractedText = docxResult.value || "";
      } catch (docxErr) {
        console.error("DOCX parse error:", docxErr);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to extract text from Word document.",
          },
          { status: 422 }
        );
      }
    } else {
      // Plain text, markdown, or other text formats
      extractedText = buffer.toString("utf-8");
    }

    // Clean up extracted text (normalize whitespace and remove null/control bytes)
    const cleanedText = extractedText
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // remove non-printable control characters
      .replace(/\n{3,}/g, "\n\n") // collapse excessive blank lines
      .trim();

    if (!cleanedText) {
      return NextResponse.json(
        {
          success: false,
          error: "No readable text could be extracted from this file. If it is an image scan, please copy and paste the text directly.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      text: cleanedText,
      fileName,
      length: cleanedText.length,
    });
  } catch (error) {
    console.error("Error parsing resume file:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred while parsing the resume.",
      },
      { status: 500 }
    );
  }
}
