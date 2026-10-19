package com.placementprep.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.placementprep.dto.StudyPlannerRequest;
import com.placementprep.dto.StudyPlannerResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class StudyPlannerService {
    
    @Value("${groq.api.key}")
    private String groqApiKey;
    
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    
    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL_NAME = "qwen/qwen3.8-27b";
    
    public StudyPlannerService() {
        this.httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .connectTimeout(java.time.Duration.ofSeconds(30))
                .build();
        this.objectMapper = new ObjectMapper();
    }
    
    public StudyPlannerResponse generateStudyPlan(StudyPlannerRequest request) {
        try {
            String prompt = buildPrompt(request);
            String aiResponse = callGroqAPI(prompt);
            return parseStudyPlan(aiResponse, request);
            
        } catch (Exception e) {
            System.err.println("Error in StudyPlannerService: " + e.getMessage());
            e.printStackTrace();
            return generateFallbackStudyPlan(request);
        }
    }
    
    private String buildPrompt(StudyPlannerRequest request) {
        return String.format(
            "You are an expert academic curriculum designer. Create a highly detailed, topic-specific %d-day study plan for subject: '%s'. " +
            "The user can study %d hours per day. Target Difficulty: %s. Target Goal: %s.\n\n" +
            "CRITICAL REQUIREMENTS:\n" +
            "1. Each day MUST feature specific, real-world subtopics of '%s' (e.g. for DSA: 'Arrays & Sliding Window', 'Trees & BST Traversal', 'Graph BFS/DFS', etc.). DO NOT output generic labels like 'Day 1 - Fundamentals'!\n" +
            "2. Provide clear time allocation, priority (1-5), and difficulty for each subtopic.\n" +
            "3. You MUST respond ONLY with a valid JSON object matching this exact schema (no markdown formatting outside JSON):\n" +
            "{\n" +
            "  \"dailyPlans\": [\n" +
            "    {\n" +
            "      \"day\": 1,\n" +
            "      \"focusArea\": \"Specific Day Theme\",\n" +
            "      \"topics\": [\n" +
            "        {\n" +
            "          \"name\": \"Specific Subtopic Name\",\n" +
            "          \"hours\": 2.0,\n" +
            "          \"difficulty\": \"Medium\",\n" +
            "          \"priority\": 5,\n" +
            "          \"description\": \"Actionable breakdown of what to study.\"\n" +
            "        }\n" +
            "      ]\n" +
            "    }\n" +
            "  ],\n" +
            "  \"tips\": [\"Actionable Study Tip 1\", \"Actionable Study Tip 2\"],\n" +
            "  \"overallStrategy\": \"Overall mastery strategy for the candidate.\"\n" +
            "}",
            request.getDurationDays(),
            request.getSubject(),
            request.getHoursPerDay(),
            request.getDifficultyLevel(),
            request.getTargetGoal() != null ? request.getTargetGoal() : "Master the subject",
            request.getSubject()
        );
    }
    
    private String callGroqAPI(String prompt) throws Exception {
        Map<String, Object> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", prompt);
        
        Map<String, Object> requestBodyMap = new HashMap<>();
        requestBodyMap.put("model", MODEL_NAME);
        requestBodyMap.put("messages", Collections.singletonList(userMsg));
        requestBodyMap.put("temperature", 0.1);
        
        String requestJson = objectMapper.writeValueAsString(requestBodyMap);
        
        System.out.println("Calling Study Planner Groq API: " + GROQ_API_URL);
        long startTime = System.currentTimeMillis();
        
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(GROQ_API_URL))
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .header("Authorization", "Bearer " + groqApiKey)
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                .timeout(java.time.Duration.ofSeconds(60))
                .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                .build();
        
        int maxRetries = 3;
        long backoffMs = 2000;
        
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            long duration = System.currentTimeMillis() - startTime;
            System.out.println("Study Planner Groq API call took: " + duration + "ms");
            
            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode choices = root.path("choices");
                if (choices.isArray() && choices.size() > 0) {
                    return choices.get(0).path("message").path("content").asText();
                }
                throw new RuntimeException("Groq returned 200 but no choices were generated.");
            } else if (response.statusCode() == 429 && attempt < maxRetries) {
                System.out.println("Groq Rate Limit (429) hit in StudyPlanner. Retrying in " + backoffMs + "ms... (Attempt " + attempt + ")");
                Thread.sleep(backoffMs);
                backoffMs *= 2;
            } else {
                String errorBody = response.body();
                System.err.println("Groq API Error in StudyPlanner (HTTP " + response.statusCode() + "): " + errorBody);
                throw new RuntimeException("Groq API Error: " + response.statusCode());
            }
        }
        throw new RuntimeException("Groq API call failed after retries.");
    }
    
    private StudyPlannerResponse parseStudyPlan(String geminiResponse, StudyPlannerRequest request) {
        try {
            String jsonStr = extractJsonFromResponse(geminiResponse);
            JsonNode root = objectMapper.readTree(jsonStr);
            
            StudyPlannerResponse response = new StudyPlannerResponse();
            response.setSubject(request.getSubject());
            response.setTotalDays(request.getDurationDays());
            response.setHoursPerDay(request.getHoursPerDay());
            
            List<StudyPlannerResponse.DailyPlan> dailyPlans = new ArrayList<>();
            JsonNode plansNode = root.path("dailyPlans");
            
            if (plansNode.isArray()) {
                for (JsonNode planNode : plansNode) {
                    StudyPlannerResponse.DailyPlan dailyPlan = new StudyPlannerResponse.DailyPlan();
                    dailyPlan.setDay(planNode.path("day").asInt());
                    dailyPlan.setDate(LocalDate.now().plusDays(dailyPlan.getDay() - 1)
                            .format(DateTimeFormatter.ISO_LOCAL_DATE));
                    
                    List<StudyPlannerResponse.Topic> topics = new ArrayList<>();
                    JsonNode topicsNode = planNode.path("topics");
                    double totalHours = 0;
                    
                    if (topicsNode.isArray()) {
                        for (JsonNode topicNode : topicsNode) {
                            StudyPlannerResponse.Topic topic = new StudyPlannerResponse.Topic();
                            topic.setName(topicNode.path("name").asText());
                            topic.setHours(topicNode.path("hours").asDouble());
                            topic.setDifficulty(topicNode.path("difficulty").asText());
                            if (topicNode.path("priority").isNumber()) {
                                topic.setPriority(topicNode.path("priority").asInt());
                            } else {
                                String prioStr = topicNode.path("priority").asText().toLowerCase();
                                topic.setPriority(prioStr.contains("high") ? 5 : prioStr.contains("med") ? 3 : 1);
                            }
                            topic.setDescription(topicNode.path("description").asText());
                            topics.add(topic);
                            totalHours += topic.getHours();
                        }
                    }
                    
                    dailyPlan.setTopics(topics);
                    dailyPlan.setTotalHours((int) Math.round(totalHours));
                    dailyPlan.setFocusArea(planNode.path("focusArea").asText());
                    dailyPlans.add(dailyPlan);
                }
            }
            
            response.setDailyPlans(dailyPlans);
            
            List<String> tips = new ArrayList<>();
            JsonNode tipsNode = root.path("tips");
            if (tipsNode.isArray()) {
                for (JsonNode tip : tipsNode) {
                    tips.add(tip.asText());
                }
            }
            response.setTips(tips);
            
            response.setOverallStrategy(root.path("overallStrategy").asText());
            
            return response;
            
        } catch (Exception e) {
            return generateFallbackStudyPlan(request);
        }
    }
    
    private String extractJsonFromResponse(String response) {
        int startIndex = response.indexOf("{");
        int endIndex = response.lastIndexOf("}");
        if (startIndex != -1 && endIndex != -1 && endIndex > startIndex) {
            return response.substring(startIndex, endIndex + 1);
        }
        return response;
    }
    
    private StudyPlannerResponse generateFallbackStudyPlan(StudyPlannerRequest request) {
        StudyPlannerResponse response = new StudyPlannerResponse();
        response.setSubject(request.getSubject());
        response.setTotalDays(request.getDurationDays());
        response.setHoursPerDay(request.getHoursPerDay());
        
        List<StudyPlannerResponse.DailyPlan> dailyPlans = new ArrayList<>();
        
        String[] genericTopics = {
            "Fundamentals and Basics",
            "Core Concepts",
            "Advanced Topics",
            "Practical Applications",
            "Problem Solving",
            "Review and Practice",
            "Mock Tests and Assessment"
        };
        
        for (int day = 1; day <= request.getDurationDays(); day++) {
            StudyPlannerResponse.DailyPlan dailyPlan = new StudyPlannerResponse.DailyPlan();
            dailyPlan.setDay(day);
            dailyPlan.setDate(LocalDate.now().plusDays(day - 1).format(DateTimeFormatter.ISO_LOCAL_DATE));
            
            List<StudyPlannerResponse.Topic> topics = new ArrayList<>();
            int topicIndex = (day - 1) % genericTopics.length;
            
            StudyPlannerResponse.Topic topic = new StudyPlannerResponse.Topic();
            topic.setName(genericTopics[topicIndex] + " - Day " + day);
            topic.setHours(request.getHoursPerDay());
            topic.setDifficulty(day <= request.getDurationDays() / 3 ? "Easy" : 
                               day <= 2 * request.getDurationDays() / 3 ? "Medium" : "Hard");
            topic.setPriority(day <= request.getDurationDays() / 3 ? 5 : 
                             day <= 2 * request.getDurationDays() / 3 ? 4 : 3);
            topic.setDescription("Focus on understanding " + genericTopics[topicIndex].toLowerCase());
            topics.add(topic);
            
            dailyPlan.setTopics(topics);
            dailyPlan.setTotalHours(request.getHoursPerDay());
            dailyPlan.setFocusArea(genericTopics[topicIndex]);
            dailyPlans.add(dailyPlan);
        }
        
        response.setDailyPlans(dailyPlans);
        
        List<String> tips = new ArrayList<>();
        tips.add("Set specific goals for each study session");
        tips.add("Take regular breaks using the Pomodoro technique");
        tips.add("Practice active recall and spaced repetition");
        tips.add("Solve problems daily to reinforce concepts");
        tips.add("Review previous topics regularly");
        response.setTips(tips);
        
        response.setOverallStrategy("Follow a structured approach: Start with fundamentals, " +
            "progress to advanced topics, and regularly practice through problems and mock tests.");
        
        return response;
    }
}
