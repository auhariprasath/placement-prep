import { NextResponse } from "next/server";
import { INITIAL_INTERVIEW_EXPERIENCES } from "@/lib/store";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { company = "", role = "", difficulty = "" } = body;

    let filtered = [...INITIAL_INTERVIEW_EXPERIENCES];

    if (company && company !== "All") {
      const c = company.toLowerCase();
      filtered = filtered.filter((item) => item.company.toLowerCase().includes(c));
    }

    if (difficulty && difficulty !== "All") {
      const d = difficulty.toLowerCase();
      filtered = filtered.filter((item) => item.difficulty.toLowerCase().includes(d));
    }

    if (filtered.length === 0) {
      filtered = INITIAL_INTERVIEW_EXPERIENCES;
    }

    return NextResponse.json({
      experiences: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error("Error searching interview experiences:", error);
    return NextResponse.json(
      { experiences: INITIAL_INTERVIEW_EXPERIENCES, total: INITIAL_INTERVIEW_EXPERIENCES.length },
      { status: 500 }
    );
  }
}
