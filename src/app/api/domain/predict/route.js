import { NextResponse } from "next/server";
import { callGroq, extractJSON } from "@/lib/groq";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const userInput = (body.userInput || "").trim() || "I enjoy solving problems, building web applications, and working with data structures.";

    const systemPrompt = `You are an elite Senior Academic & Career Advisor for Engineering Placements.
Analyze the student's statement of interests, technical skills, and career dreams.
Map them to the most suitable Engineering/Technology Domain and recommend top semester subjects and video learning resources.
Respond ONLY with a valid JSON object matching this schema:
{
  "predictedDomain": "Artificial Intelligence & Data Science" | "Full Stack Web Development" | "Cloud Computing & DevOps" | "Cybersecurity & Ethical Hacking" | "Mobile App Development" | "Embedded Systems & IoT",
  "confidence": 92.5,
  "domainDescription": "2-3 sentences explaining why this domain matches the user's passion and high-growth industry outlook.",
  "topCareerRoles": ["Role 1", "Role 2", "Role 3"],
  "averageSalary": "₹8 - ₹18 LPA",
  "subjects": [
    {
      "subjectName": "Core Subject Name",
      "semester": "Semester 5",
      "description": "Why this subject is vital for placement interviews and semester exams.",
      "keyTopics": "Topic 1, Topic 2, Topic 3",
      "videoTitle": "Full Course Title",
      "videoChannel": "FreeCodeCamp / NPTEL / Gate Smashers",
      "youtubeVideoId": "youtube_id_or_empty",
      "searchQuery": "search query for YouTube"
    }
  ],
  "learningRoadmap": [
    "Phase 1: Foundation (Months 1-2)",
    "Phase 2: Core Engineering & Projects (Months 3-4)",
    "Phase 3: Placement Rounds & System Design (Months 5-6)"
  ]
}`;

    const userPrompt = `STUDENT INTERESTS & PASSIONS:
"${userInput}"

Recommend 4 highly relevant core subjects and YouTube courses for this domain. Include realistic YouTube video query strings or IDs.`;

    let result = null;
    try {
      const rawAI = await callGroq({
        prompt: userPrompt,
        systemPrompt,
        temperature: 0.3,
        maxTokens: 2500,
        responseFormat: "json",
      });
      result = extractJSON(rawAI);
    } catch (e) {
      console.warn("Groq failed in domain predict, using domain mapper:", e.message);
    }

    if (!result || !result.predictedDomain) {
      // Deterministic fallback based on keywords
      const lower = userInput.toLowerCase();
      let domain = "Full Stack Web Development";
      let desc = "Strong passion for software architecture, client-server interactions, modern JavaScript frameworks, and database scalability.";
      let roles = ["Full Stack SDE", "Frontend Engineer", "Backend Java/Node Engineer"];
      let sal = "₹7 - ₹16 LPA";
      let subjects = [
        {
          subjectName: "Data Structures & Algorithms",
          semester: "Semester 3",
          description: "Essential foundational subject tested in 100% of technical coding assessments.",
          keyTopics: "Arrays, Linked Lists, Trees, Graphs, Dynamic Programming",
          videoTitle: "Data Structures & Algorithms Full Course",
          videoChannel: "FreeCodeCamp / Striver",
          searchQuery: "Data Structures and Algorithms Full Course"
        },
        {
          subjectName: "Database Management Systems (DBMS)",
          semester: "Semester 4",
          description: "Core concepts of relational modeling, ACID properties, indexing, and SQL queries.",
          keyTopics: "ER Modeling, Normalization (1NF-BCNF), Indexing, Transactions",
          videoTitle: "DBMS Complete Course for Placements",
          videoChannel: "Gate Smashers",
          searchQuery: "DBMS Complete Course Gate Smashers"
        },
        {
          subjectName: "Web Technologies & Distributed Systems",
          semester: "Semester 5",
          description: "RESTful architecture, microservices, asynchronous execution, and modern web protocols.",
          keyTopics: "React/Next.js, Node.js, REST APIs, WebSockets, State Management",
          videoTitle: "Next.js Full Stack Masterclass",
          videoChannel: "Traversy Media / Web Dev Simplified",
          searchQuery: "Next.js Full Stack Course"
        },
        {
          subjectName: "Computer Networks & Security",
          semester: "Semester 6",
          description: "Crucial for understanding latency, packet transfer, HTTPS handshakes, and cloud deployment.",
          keyTopics: "OSI & TCP/IP Layers, DNS, Routing Algorithms, Socket Programming",
          videoTitle: "Computer Networks Crash Course",
          videoChannel: "Kunal Kushwaha",
          searchQuery: "Computer Networks Kunal Kushwaha"
        }
      ];

      if (lower.includes("ai") || lower.includes("machine learning") || lower.includes("data") || lower.includes("python") || lower.includes("neural") || lower.includes("nlp")) {
        domain = "Artificial Intelligence & Data Science";
        desc = "High aptitude for statistical learning, predictive modeling, machine learning algorithms, and deep neural architectures.";
        roles = ["ML Engineer", "Data Scientist", "GenAI Application Developer", "NLP Specialist"];
        sal = "₹9 - ₹20 LPA";
        subjects = [
          {
            subjectName: "Machine Learning Foundations",
            semester: "Semester 5",
            description: "Supervised and unsupervised algorithms, mathematical optimization, and gradient descent.",
            keyTopics: "Linear/Logistic Regression, Decision Trees, SVM, Clustering, Bias-Variance Tradeoff",
            videoTitle: "Machine Learning for Beginners Full Course",
            videoChannel: "Stanford Online / Andrew Ng",
            searchQuery: "Machine Learning Andrew Ng Coursera"
          },
          {
            subjectName: "Deep Learning & Neural Networks",
            semester: "Semester 6",
            description: "Backpropagation, Convolutional Neural Networks for vision, and Transformers for LLMs.",
            keyTopics: "PyTorch, CNN, RNN/LSTM, Attention Mechanism, Transformers",
            videoTitle: "Deep Learning with PyTorch",
            videoChannel: "freeCodeCamp.org",
            searchQuery: "Deep Learning PyTorch freeCodeCamp"
          },
          {
            subjectName: "Probability, Statistics & Linear Algebra",
            semester: "Semester 3",
            description: "The mathematical backbone required for ML model training and algorithmic proofs.",
            keyTopics: "Eigenvalues, Matrix Decomposition, Bayes Theorem, Hypothesis Testing",
            videoTitle: "Essence of Linear Algebra",
            videoChannel: "3Blue1Brown",
            searchQuery: "3Blue1Brown Essence of linear algebra"
          },
          {
            subjectName: "Big Data & Data Engineering",
            semester: "Semester 7",
            description: "Handling high volume data pipelines, ETL workflows, and distributed compute engines.",
            keyTopics: "Apache Spark, Hadoop Ecosystem, Kafka Streams, NoSQL Data Stores",
            videoTitle: "Apache Spark & Big Data Architecture",
            videoChannel: "Edureka",
            searchQuery: "Apache Spark Full Course Edureka"
          }
        ];
      }

      result = {
        predictedDomain: domain,
        confidence: 91.0,
        domainDescription: desc,
        topCareerRoles: roles,
        averageSalary: sal,
        subjects,
        learningRoadmap: [
          "Phase 1: Core Fundamentals & Problem Solving (Months 1-2)",
          "Phase 2: Domain Deep-Dive & Real-World Projects (Months 3-4)",
          "Phase 3: Company Mock Assessments & System Architecture (Months 5-6)"
        ]
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in domain prediction:", error);
    return NextResponse.json(
      { error: "Failed to predict domain: " + error.message },
      { status: 500 }
    );
  }
}
