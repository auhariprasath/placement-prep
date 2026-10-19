import { NextResponse } from "next/server";
import { INITIAL_JOBS } from "@/lib/store";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { keyword = "", location = "", jobType = "" } = body;

    const apiKey = process.env.GLASSDOOR_API_KEY;
    const apiHost = process.env.GLASSDOOR_API_HOST || "real-time-glassdoor-data.p.rapidapi.com";

    // If valid RapidAPI key exists, we can query it
    if (apiKey && apiKey !== "your_rapidapi_key_here") {
      try {
        const queryParams = new URLSearchParams({
          query: keyword || "Software Engineer",
          location: location || "India",
          page: "1",
        });

        const res = await fetch(`https://${apiHost}/company-search?${queryParams.toString()}`, {
          headers: {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": apiHost,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.data) && data.data.length > 0) {
            const formatted = data.data.map((j, i) => ({
              id: "gd-" + (j.id || i),
              title: j.job_title || j.title || `${keyword || "Software Engineer"}`,
              company: j.company_name || "Top Tech Employer",
              location: j.location || location || "Bengaluru, India",
              salary: j.salary || "Competitive LPA",
              type: j.job_type || "Full-Time",
              experience: "Fresher / 0-2 yrs",
              skills: ["Java", "Python", "SQL", "Problem Solving"],
              applyLink: j.job_apply_link || "https://glassdoor.com",
              description: j.job_description || "Opportunity for engineering graduates to build enterprise systems."
            }));
            return NextResponse.json({ jobs: formatted, total: formatted.length, source: "live-api" });
          }
        }
      } catch (apiErr) {
        console.warn("RapidAPI Glassdoor query error, falling back to curated listings:", apiErr.message);
      }
    }

    // Filter seed jobs
    let filtered = [...INITIAL_JOBS];
    if (keyword) {
      const kw = keyword.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(kw) ||
          j.company.toLowerCase().includes(kw) ||
          j.skills.some((s) => s.toLowerCase().includes(kw))
      );
    }
    if (location) {
      const loc = location.toLowerCase();
      filtered = filtered.filter((j) => j.location.toLowerCase().includes(loc));
    }
    if (jobType && jobType !== "All") {
      filtered = filtered.filter((j) => j.type.toLowerCase() === jobType.toLowerCase());
    }

    // If filter produced nothing, return all seed jobs so the candidate always gets opportunities
    if (filtered.length === 0) {
      filtered = INITIAL_JOBS;
    }

    return NextResponse.json({ jobs: filtered, total: filtered.length, source: "curated-placements" });
  } catch (error) {
    console.error("Error in job search:", error);
    return NextResponse.json({ jobs: INITIAL_JOBS, total: INITIAL_JOBS.length, source: "fallback" });
  }
}
