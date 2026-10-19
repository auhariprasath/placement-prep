import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "PlacementPrep AI | All-in-One Placement & Interview Prep Suite",
  description:
    "Master campus and off-campus placements with AI Mock Interviews, Domain Prediction, Personalized Study Roadmaps, ATS Resume Matching, Job Search, and Online Coding Compiler.",
  keywords: [
    "Placement Preparation",
    "AI Mock Interview",
    "Domain Selection",
    "Study Planner",
    "Resume Builder",
    "ATS Scanner",
    "SDE Interview",
    "LeetCode",
    "Campus Drive"
  ],
  authors: [{ name: "PlacementPrep Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
