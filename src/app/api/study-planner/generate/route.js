import { NextResponse } from "next/server";
import { callGroq, extractJSON } from "@/lib/groq";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      subject = "Data Structures and Algorithms",
      durationDays = 30,
      hoursPerDay = 4,
      difficultyLevel = "intermediate",
      targetGoal = "Product Company Placements",
    } = body;

    const systemPrompt = `You are an elite academic curriculum designer and technical interview coach.
Create a highly detailed, topic-specific study plan for: "${subject}".
Duration: ${durationDays} days. Study hours per day: ${hoursPerDay} hours. Target Difficulty: ${difficultyLevel}. Target Goal: ${targetGoal}.
CRITICAL REQUIREMENTS:
1. Provide a progressive roadmap with concrete, real-world subtopics (e.g. for DSA: 'Arrays & Two Pointers', 'Sliding Window', 'Fast & Slow Pointers', 'Binary Trees', 'Graphs BFS/DFS', etc.).
2. For duration up to 14 days, provide individual daily plans for every day. For durations > 14 days, group into milestone phases or key days up to 14 representative daily modules with weekly review targets.
3. Respond ONLY with a valid JSON object matching this schema:
{
  "subject": "${subject}",
  "totalDuration": "${durationDays} Days",
  "dailyCommitment": "${hoursPerDay} Hours/Day",
  "targetGoal": "${targetGoal}",
  "difficulty": "${difficultyLevel}",
  "overview": "2-3 sentences summarizing the strategy and milestone pacing",
  "dailyPlans": [
    {
      "dayNumber": 1,
      "topic": "Specific Topic Name",
      "hoursAllocated": ${hoursPerDay},
      "priority": 1,
      "subtopics": ["Subtopic 1", "Subtopic 2", "Hands-on Practice"],
      "studyTips": "Key trap or tip to master today",
      "practiceResource": "Recommended LeetCode / GeeksforGeeks practice link or problem title"
    }
  ],
  "milestones": [
    { "phase": "Week 1", "goal": "Milestone description" }
  ]
}`;

    const userPrompt = `Subject: ${subject}
Timeline: ${durationDays} Days
Hours/Day: ${hoursPerDay}
Difficulty: ${difficultyLevel}
Goal: ${targetGoal}

Generate the comprehensive study plan now.`;

    let plan = null;
    try {
      const rawAI = await callGroq({
        prompt: userPrompt,
        systemPrompt,
        temperature: 0.3,
        maxTokens: 2500,
        responseFormat: "json",
      });
      plan = extractJSON(rawAI);
    } catch (e) {
      console.warn("Groq failed in study planner, generating smart fallback:", e.message);
    }

    if (!plan || !Array.isArray(plan.dailyPlans) || plan.dailyPlans.length === 0) {
      const days = Math.min(Number(durationDays) || 30, 14);
      const defaultTopics = [
        { topic: "Arrays & Hash Maps", sub: ["Two Sum pattern", "Prefix Sum array", "Subarray sum equals K"] },
        { topic: "Two Pointers & Sliding Window", sub: ["Container With Most Water", "Longest Substring Without Repeating Characters", "Minimum Window Substring"] },
        { topic: "Stack & Queue Fundamentals", sub: ["Valid Parentheses", "Monotonic Stack (Next Greater Element)", "Min Stack design"] },
        { topic: "Binary Search Variations", sub: ["Search in Rotated Sorted Array", "First & Last Position", "Capacity To Ship Packages Within D Days"] },
        { topic: "Linked List Reversal & Pointers", sub: ["Fast & Slow Pointers (Cycle Detection)", "Reverse Linked List in K-Groups", "Merge K Sorted Lists"] },
        { topic: "Binary Trees & DFS", sub: ["Inorder/Preorder/Postorder traversals", "Maximum Depth", "Lowest Common Ancestor"] },
        { topic: "Binary Trees BFS & Level Order", sub: ["Zigzag Level Order", "Right View of Binary Tree", "Serialize and Deserialize Binary Tree"] },
        { topic: "Binary Search Tree (BST)", sub: ["Validate BST", "Kth Smallest Element in BST", "BST Iterator"] },
        { topic: "Heap & Priority Queue", sub: ["Kth Largest Element in an Array", "Top K Frequent Elements", "Find Median from Data Stream"] },
        { topic: "Graph Traversal (BFS & DFS)", sub: ["Number of Islands", "Clone Graph", "Rotting Oranges"] },
        { topic: "Advanced Graphs & Topological Sort", sub: ["Course Schedule I & II", "Word Ladder", "Dijkstra's Algorithm"] },
        { topic: "Backtracking & Recursion", sub: ["Subsets & Permutations", "Combination Sum", "N-Queens"] },
        { topic: "1D Dynamic Programming", sub: ["Climbing Stairs", "House Robber", "Longest Increasing Subsequence"] },
        { topic: "2D Dynamic Programming & Placement Mock", sub: ["0/1 Knapsack", "Longest Common Subsequence", "Edit Distance"] },
      ];

      plan = {
        subject,
        totalDuration: `${durationDays} Days`,
        dailyCommitment: `${hoursPerDay} Hours/Day`,
        targetGoal,
        difficulty: difficultyLevel,
        overview: `A focused ${durationDays}-day curriculum for ${subject} designed to take you from foundational understanding to interview-ready speed.`,
        dailyPlans: Array.from({ length: days }).map((_, i) => {
          const item = defaultTopics[i % defaultTopics.length];
          return {
            dayNumber: i + 1,
            topic: `${item.topic} (${subject})`,
            hoursAllocated: hoursPerDay,
            priority: (i % 3) + 1,
            subtopics: item.sub,
            studyTips: `Focus on time complexity O(N) and avoid redundant memory allocation.`,
            practiceResource: `LeetCode / GFG - ${item.sub[0]}`
          };
        }),
        milestones: [
          { phase: "Week 1", goal: "Master linear data structures and two pointer patterns." },
          { phase: "Week 2", goal: "Conquer hierarchical structures (Trees, Heaps, and Graphs)." },
          { phase: "Week 3+", goal: "Complete Dynamic Programming and timed mock tests." }
        ]
      };
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error generating study plan:", error);
    return NextResponse.json(
      { error: "Failed to generate study plan: " + error.message },
      { status: 500 }
    );
  }
}
