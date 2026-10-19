# PlacementPrep AI — Full-Stack Next.js Platform

Next-generation, full-stack placement preparation suite engineered for college students and tech graduates to ace campus placements and off-campus recruitment drives.

---

## Key Features & Tools

1. **AI Voice Mock Interview** (`/mock-interview`):
   - Real-time voice interaction with Web Speech API (speech recognition microphone & text-to-speech audio).
   - Dynamic Groq AI question generator tailored to candidate resume and chosen role.
   - Comprehensive hiring scorecard (Technical, Communication, Confidence, and Action Plan).
2. **Engineering Domain Selection & Curriculum** (`/domain-selection`):
   - AI mapping of candidate interests to best engineering domain.
   - Semester-wise core subjects, key topics, and curated YouTube video lectures.
3. **Personalized Study Planner** (`/study-planner`):
   - Day-by-day customized preparation curriculum with interactive checkboxes and progress bar.
4. **24/7 AI Placement Copilot** (`/ai-agent`):
   - Conversational career assistant with smart navigation commands and instant answers.
5. **Fresher Job & Internship Search** (`/job-search`):
   - Filterable placement job listings across India with salary ranges and direct apply links.
6. **Company Interview Question Bank** (`/interview-search`):
   - Verified interview experiences and round-by-round assessment breakdowns for Google, Amazon, Microsoft, TCS, etc.
7. **ATS Resume Matcher** (`/resume-matcher`):
   - Upload resume and target job description to compute ATS match score, missing keywords, and STAR rewrites.
8. **Interactive ATS Resume Builder** (`/resume-builder`):
   - Live formatted technical resume builder with 1-click print/save-as-PDF support.
9. **Online Multi-Language Compiler** (`/compiler`):
   - In-browser code runner supporting JavaScript, Python, Java, and C++ with standard I/O.
10. **Community Forum & Prep Guides** (`/forum` & `/blog`):
    - Peer discussion board and curated placement roadmaps.

---

## ⚡ Zero-DB Serverless Architecture (Why Next.js?)

Previously, this platform relied on a heavy dual setup (Java Spring Boot + MySQL + React), requiring multiple hosting services, complex CORS handling, and database connection strings.

**Now, the entire application is unified into Next.js 16 (App Router):**
- **Zero Database Required**: Out-of-the-box serverless data layer with zero external DB configuration required to deploy.
- **Fast Groq AI Integration**: Native server-side API routes powered by Groq (`llama-3.3-70b-versatile`) with sub-second response times.
- **1-Click Vercel Deployment**: Can be deployed to Vercel in seconds with just your free `GROQ_API_KEY`.

---

## Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your free Groq API key:
```bash
# In .env.local
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```
*(Get a free API key instantly at [console.groq.com](https://console.groq.com)).*

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🚀 Deployment to Vercel (1-Click)

1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "Deploy full-stack Next.js placement prep platform"
   git push origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new) and select your GitHub repository `placement-prep`.
3. In the **Environment Variables** section, add:
   - `GROQ_API_KEY` = your Groq API key
4. Click **Deploy**! Your application will be live globally in under 60 seconds with SSL and zero maintenance.

---

## Legacy Spring Boot & React Code
A complete standalone backup of the previous Java Spring Boot backend and React frontend is preserved in `../legacy-spring-react-backup/`.
