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
    
    @Value("${gemini.api.key}")
    private String geminiApiKey;
    
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";
    
    public StudyPlannerService() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }
    
    public StudyPlannerResponse generateStudyPlan(StudyPlannerRequest request) {
        try {
            String prompt = buildPrompt(request);
            String geminiResponse = callGeminiAPI(prompt);
            return parseStudyPlan(geminiResponse, request);
            
        } catch (Exception e) {
            System.err.println("Error in StudyPlannerService: " + e.getMessage());
            e.printStackTrace();
            return generateFallbackStudyPlan(request);
        }
    }
    
    private String buildPrompt(StudyPlannerRequest request) {
        return String.format(
            "Create a detailed %d-day study plan for %s. " +
            "The user can study %d hours per day. " +
            "Difficulty level: %s. " +
            "Target goal: %s.\n\n" +
            "Please provide a structured study plan with:\n" +
            "1. Daily breakdown with specific topics to cover\n" +
            "2. Time allocation for each topic (in hours)\n" +
            "3. Priority level for each topic (1-5, where 5 is highest)\n" +
            "4. Difficulty level for each topic (Easy/Medium/Hard)\n" +
            "5. Brief description of what to study\n" +
            "6. Study tips and strategies\n" +
            "7. Overall learning strategy\n\n" +
            "Format the response as JSON with this structure:\n" +
            "{\n" +
            "  \"dailyPlans\": [\n" +
            "    {\n" +
            "      \"day\": 1,\n" +
            "      \"topics\": [\n" +
            "        {\n" +
            "          \"name\": \"Topic Name\",\n" +
            "          \"hours\": 2.0,\n" +
            "          \"difficulty\": \"Medium\",\n" +
            "          \"priority\": 5,\n" +
            "          \"description\": \"What to study\"\n" +
            "        }\n" +
            "      ],\n" +
            "      \"focusArea\": \"Main focus for the day\"\n" +
            "    }\n" +
            "  ],\n" +
            "  \"tips\": [\"Tip 1\", \"Tip 2\"],\n" +
            "  \"overallStrategy\": \"Overall approach\"\n" +
            "}",
            request.getDurationDays(),
            request.getSubject(),
            request.getHoursPerDay(),
            request.getDifficultyLevel(),
            request.getTargetGoal() != null ? request.getTargetGoal() : "Master the subject"
        );
    }
    
    private String callGeminiAPI(String prompt) throws Exception {
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        
        Map<String, Object> content = new HashMap<>();
        content.put("parts", Collections.singletonList(part));
        
        Map<String, Object> requestBodyMap = new HashMap<>();
        requestBodyMap.put("contents", Collections.singletonList(content));
        
        String requestJson = objectMapper.writeValueAsString(requestBodyMap);
        String url = GEMINI_API_URL + "?key=" + geminiApiKey;
        
        System.out.println("Calling Study Planner Gemini API: " + url.substring(0, url.indexOf("?")));
        long startTime = System.currentTimeMillis();
        
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .timeout(java.time.Duration.ofSeconds(60))
                .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                .build();
        
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        long duration = System.currentTimeMillis() - startTime;
        System.out.println("Study Planner Gemini API call took: " + duration + "ms");
        
        if (response.statusCode() == 200) {
            JsonNode root = objectMapper.readTree(response.body());
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode contentNode = candidates.get(0).path("content");
                JsonNode partsNode = contentNode.path("parts");
                if (partsNode.isArray() && partsNode.size() > 0) {
                    return partsNode.get(0).path("text").asText();
                }
            }
            throw new RuntimeException("Gemini returned 200 but no content was generated.");
        } else {
            String errorBody = response.body();
            System.err.println("Gemini API Error in StudyPlanner (HTTP " + response.statusCode() + "): " + errorBody);
            throw new RuntimeException("Gemini API Error: " + response.statusCode());
        }
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
                            topic.setPriority(topicNode.path("priority").asInt());
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
