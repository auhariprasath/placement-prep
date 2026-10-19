/**
 * Zero-config in-memory seed store for Forum, Blog, Jobs, and Interviews
 * Fully operational for serverless environments with zero external DB required.
 */

export const INITIAL_FORUM_POSTS = [
  {
    id: 1,
    title: "How to crack Amazon SDE 1 in 3 months of preparation?",
    content: "I am in my 3rd year and aiming for Amazon off-campus or on-campus drives. What should be the ideal roadmap for DSA (LeetCode mediums/hards) and CS fundamentals like OS, DBMS, and System Design?",
    author: "Rahul Sharma",
    authorRole: "Final Year CSE",
    category: "Placements",
    upvotes: 42,
    createdAt: "2026-10-15T10:30:00Z",
    comments: [
      {
        id: 101,
        author: "Priya Nair",
        content: "Focus on Trees, Graphs, Sliding Window, and Dynamic Programming. Revise Amazon Leadership Principles—they carry 50% weightage in behavioral rounds!",
        createdAt: "2026-10-15T12:00:00Z"
      },
      {
        id: 102,
        author: "Karthik V",
        content: "Use the Striver SDE sheet or NeetCode 150. Practice mock interviews with peer voice feedback here on the platform!",
        createdAt: "2026-10-15T14:15:00Z"
      }
    ]
  },
  {
    id: 2,
    title: "TCS Digital vs Ninja Coding Assessment Pattern 2026",
    content: "Anyone who recently took the NQT? What kind of problems are asked in the Advanced Coding section? Are there topics like Graph and DP, or mostly Matrix manipulation?",
    author: "Aakash Patel",
    authorRole: "3rd Year IT",
    category: "Exam Patterns",
    upvotes: 28,
    createdAt: "2026-10-16T08:20:00Z",
    comments: [
      {
        id: 201,
        author: "Sneha Sen",
        content: "1 question was String pattern matching and 1 was greedy sub-array sum with constraints. Time management is key!",
        createdAt: "2026-10-16T11:45:00Z"
      }
    ]
  },
  {
    id: 3,
    title: "Best projects for Resume to bypass ATS screening for Full Stack Roles",
    content: "Does building another e-commerce clone work, or is it better to build an AI-integrated application or distributed system?",
    author: "Hariprasath",
    authorRole: "Student Developer",
    category: "Resume & Portfolio",
    upvotes: 56,
    createdAt: "2026-10-18T16:00:00Z",
    comments: [
      {
        id: 301,
        author: "Aditya Roy",
        content: "Build projects that solve real problems with authentication, rate limiting, WebSockets, or LLM integrations. Showcase deployment URLs and metrics on your resume!",
        createdAt: "2026-10-18T18:10:00Z"
      }
    ]
  }
];

export const INITIAL_BLOG_POSTS = [
  {
    id: 1,
    title: "The Ultimate 90-Day Placement Roadmap for Tier 2/3 College Students",
    summary: "A step-by-step master plan covering Data Structures, Core Computer Science, Live Projects, and Behavioral mastery to land top product offers.",
    content: `Securing a high-paying product company offer requires a structured timeline rather than random problem solving. 

### Month 1: Foundation & Data Structures
- Master language fundamentals (Java/C++/Python).
- Linear Data Structures: Arrays, Two Pointers, Sliding Window, Linked Lists, Stacks, Queues.
- Goal: Solve 80 LeetCode Easy & Medium problems.

### Month 2: Advanced DSA & Core Subjects
- Trees, Binary Search Trees, Heaps, Graphs (BFS/DFS, Dijkstra), and Dynamic Programming.
- Operating Systems (Processes, Threads, Deadlocks, Paging).
- DBMS (SQL Queries, Normalization, ACID properties, Indexing).

### Month 3: System Design, Projects & Mock Interviews
- Low-Level Design (OOP Principles, SOLID, Design Patterns).
- Polish 2 standout full-stack projects with live deployments.
- Practice at least 5 AI Voice Mock Interviews to eliminate stage fear.`,
    author: "Placement Team",
    category: "Preparation Guide",
    readTime: "6 min read",
    likes: 124,
    date: "Oct 18, 2026"
  },
  {
    id: 2,
    title: "Mastering the STAR Technique for HR & Behavioral Rounds",
    summary: "How to structure your answers for 'Tell me about a challenge you overcame' or 'Why should we hire you?' with maximum impact.",
    content: `Many technically brilliant candidates get rejected in behavioral rounds because they give vague or rambling answers. The STAR method gives you clarity and confidence.

1. **S - Situation**: Set the context in 1-2 sentences (team size, project goal).
2. **T - Task**: What specific responsibility or challenge fell upon you?
3. **A - Action**: What exact steps did YOU take? Mention tools, problem solving, and leadership.
4. **R - Result**: What was the measurable outcome? (e.g. 'reduced latency by 35%').`,
    author: "Senior HR Mentor",
    category: "Interview Tips",
    readTime: "4 min read",
    likes: 98,
    date: "Oct 14, 2026"
  },
  {
    id: 3,
    title: "Top 25 SQL Queries Every Candidate Must Know for Placement Tests",
    summary: "From Nth highest salary to Self Joins, Window Functions, and CTEs: here are the most frequent interview SQL problems.",
    content: `SQL rounds often test your ability to write concise aggregations and window functions.
    
Key patterns to master:
- Finding 2nd or Nth highest salary using DENSE_RANK() or LIMIT/OFFSET.
- Finding duplicate emails/records using GROUP BY and HAVING COUNT(*) > 1.
- Self joins to find employees earning more than their managers.
- Cumulative sum and running totals with OVER (PARTITION BY ... ORDER BY ...).`,
    author: "Data Engineering Lead",
    category: "Technical Prep",
    readTime: "5 min read",
    likes: 85,
    date: "Oct 10, 2026"
  }
];

export const INITIAL_INTERVIEW_EXPERIENCES = [
  {
    id: 1,
    company: "Google",
    role: "Software Engineering Intern / Early Career",
    difficulty: "Hard",
    offerStatus: "Offered",
    rounds: [
      { roundName: "Online Assessment", details: "2 algorithmic problems on graphs and dynamic programming (60 mins)." },
      { roundName: "Technical Round 1", details: "Deep dive on Tree structures with prefix-sum path calculations. High emphasis on edge cases." },
      { roundName: "Technical Round 2", details: "Graph shortest path with state transformations. Clean modular code was required." },
      { roundName: "Googliness & Leadership", details: "Hypothetical scenario discussions on cross-team conflict and deadline prioritization." }
    ],
    tips: "Think out loud continuously. Google interviewers care about your thought process more than just the final answer."
  },
  {
    id: 2,
    company: "Amazon",
    role: "SDE-1",
    difficulty: "Medium-Hard",
    offerStatus: "Offered",
    rounds: [
      { roundName: "OA (Online Assessment)", details: "2 DSA questions + Work Styles simulation assessment." },
      { roundName: "Technical Round 1", details: "LRU Cache design and implementation with O(1) get and put." },
      { roundName: "Technical Round 2", details: "Topological Sort / Course Schedule variation followed by deep questions on past internship projects." },
      { roundName: "Bar Raiser", details: "Amazon Leadership Principles (Customer Obsession, Bias for Action) tested with STAR stories." }
    ],
    tips: "Prepare 2 unique stories for every Amazon Leadership Principle."
  },
  {
    id: 3,
    company: "Microsoft",
    role: "Software Engineer",
    difficulty: "Medium",
    offerStatus: "Offered",
    rounds: [
      { roundName: "Online Screening", details: "Codility test with 3 coding challenges focused on string manipulation and arrays." },
      { roundName: "Technical Round 1", details: "Binary tree serialization and deserialization." },
      { roundName: "Technical Round 2", details: "OS concurrency concepts, semaphores, and database indexing." },
      { roundName: "AA Round (As Appropriate)", details: "Discussion on system scalability and cultural fit with an Engineering Director." }
    ],
    tips: "Be very strong with fundamentals in OS, Memory Management, and DBMS."
  },
  {
    id: 4,
    company: "TCS Digital",
    role: "System Engineer / Digital Specialist",
    difficulty: "Medium",
    offerStatus: "Offered",
    rounds: [
      { roundName: "TCS NQT Advanced", details: "Aptitude, Advanced Quant, and 2 coding challenges." },
      { roundName: "Technical + Managerial", details: "Java OOPS concepts, Spring Boot basics, project architecture, and SQL queries." },
      { roundName: "HR Round", details: "Relocation willingness, shift flexibility, and career goals." }
    ],
    tips: "Ensure you know your resume projects thoroughly down to the database schema."
  }
];

export const INITIAL_JOBS = [
  {
    id: "job-1",
    title: "Software Engineer - SDE 1 (Fresher 2026/2027)",
    company: "Paytm / One97 Communications",
    location: "Bengaluru / Noida (Hybrid)",
    salary: "₹12 - ₹18 LPA",
    type: "Full-Time",
    experience: "Fresher / 0-1 yr",
    skills: ["Java", "Spring Boot", "MySQL", "Kafka", "Data Structures"],
    applyLink: "https://www.linkedin.com/jobs",
    description: "Join India's leading fintech platform to engineer high-throughput transaction processing systems and payment gateways."
  },
  {
    id: "job-2",
    title: "Graduate Software Trainee (Product Engineering)",
    company: "Zoho Corporation",
    location: "Chennai / Tenkasi",
    salary: "₹8.5 - ₹12 LPA",
    type: "Full-Time",
    experience: "Fresher",
    skills: ["Java", "C++", "OOPS", "Web Technologies", "Problem Solving"],
    applyLink: "https://www.zoho.com/careers",
    description: "Build world-class SaaS enterprise products utilized by millions across 180+ countries. Zero reliance on framework gimmicks; core programming excellence."
  },
  {
    id: "job-3",
    title: "Frontend Developer Intern",
    company: "CRED",
    location: "Bengaluru",
    salary: "₹50,000 / month Stipend",
    type: "Internship",
    experience: "College Student / Fresher",
    skills: ["React", "Next.js", "TypeScript", "CSS Animations", "UI/UX"],
    applyLink: "https://careers.cred.club",
    description: "Create pixel-perfect, slick micro-interactions and high-performance financial interfaces."
  },
  {
    id: "job-4",
    title: "Associate Software Engineer - Campus Drive",
    company: "Accenture India",
    location: "Pan India (Bangalore, Pune, Hyderabad, Chennai)",
    salary: "₹4.5 - ₹6.5 LPA",
    type: "Full-Time",
    experience: "Fresher",
    skills: ["Cloud Basics", "Java / Python", "SQL", "Agile Methodologies"],
    applyLink: "https://www.accenture.com/in-en/careers",
    description: "Deliver digital transformation solutions for global Fortune 500 clients across banking, retail, and healthcare."
  },
  {
    id: "job-5",
    title: "AI / Machine Learning Engineer Trainee",
    company: "Fractal Analytics",
    location: "Bengaluru / Mumbai",
    salary: "₹10 - ₹15 LPA",
    type: "Full-Time",
    experience: "0-1 yr",
    skills: ["Python", "PyTorch", "NLP", "LLMs", "Data Analysis"],
    applyLink: "https://fractal.ai/careers",
    description: "Work on cutting-edge Generative AI and automated reasoning engines for enterprise clients."
  }
];
