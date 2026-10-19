package com.placementprep.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.placementprep.dto.AgentInteractionRequest;
import com.placementprep.dto.AgentInteractionResponse;
import com.placementprep.model.AgentInteraction;
import com.placementprep.model.User;
import com.placementprep.repository.AgentInteractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

@Service
public class AgentService {
    
    @Value("${groq.api.key}")
    private String groqApiKey;
    
    @Autowired
    private AgentInteractionRepository agentInteractionRepository;
    
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    
    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL_NAME = "qwen/qwen3.8-27b";
    
    public AgentService() {
        this.httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .connectTimeout(Duration.ofSeconds(30))
                .build();
        this.objectMapper = new ObjectMapper();
    }
    
    public AgentInteractionResponse interact(AgentInteractionRequest request, Long userId) {
        String sessionId = request.getSessionId() != null ? request.getSessionId() : UUID.randomUUID().toString();
        
        try {
            String context = buildContext(userId, sessionId, request.getContext());
            String prompt = buildPrompt(request.getMessage(), context, request.getInteractionType());
            
            String aiResponse = callGroqAPI(prompt);
            
            AgentInteractionResponse response = new AgentInteractionResponse();
            
            // Check for navigation & state intent [NAVIGATE: /path] or [NAVIGATE: /path | DATA: {"subject":"DSA","durationDays":30}]
            if (aiResponse.contains("[NAVIGATE:")) {
                int start = aiResponse.indexOf("[NAVIGATE:");
                int end = aiResponse.indexOf("]", start);
                if (end > start) {
                    String navContent = aiResponse.substring(start + 11, end).trim();
                    if (navContent.contains("| DATA:")) {
                        String[] parts = navContent.split("\\| DATA:");
                        response.setRedirectPath(parts[0].trim());
                        try {
                            JsonNode jsonNode = objectMapper.readTree(parts[1].trim());
                            response.setTargetState(jsonNode);
                        } catch (Exception ex) {
                            System.err.println("Failed to parse navigation DATA JSON: " + ex.getMessage());
                        }
                    } else {
                        response.setRedirectPath(navContent);
                    }
                    aiResponse = aiResponse.replace(aiResponse.substring(start, end + 1), "").trim();
                }
            }
            
            response.setResponse(aiResponse);
            response.setSessionId(sessionId);
            response.setContext(context);
            response.setVoiceMode(request.isVoiceMode());
            response.setSuggestedActions(generateSuggestedActions(request.getMessage(), request.getInteractionType()));
            
            if (request.isVoiceMode()) {
                String voiceUrl = generateVoice(aiResponse);
                response.setVoiceUrl(voiceUrl);
            }
            
            saveInteraction(userId, sessionId, request, response);
            
            return response;
            
        } catch (Exception e) {
            System.err.println("Error in AgentService.interact: " + e.getMessage());
            e.printStackTrace();
            AgentInteractionResponse errorResponse = new AgentInteractionResponse();
            errorResponse.setResponse("I'm sorry, I encountered an error. Please try again.");
            errorResponse.setSessionId(sessionId);
            return errorResponse;
        }
    }
    
    public List<AgentInteraction> getChatHistory(Long userId, String sessionId) {
        if (sessionId != null) {
            return agentInteractionRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
        }
        return agentInteractionRepository.findTop20ByUserIdOrderByCreatedAtDesc(userId);
    }
    
    private String buildContext(Long userId, String sessionId, String additionalContext) {
        StringBuilder context = new StringBuilder();
        
        context.append("You are an intelligent Placement Prep AI Assistant that can answer questions AND execute actions for the user.\n");
        context.append("IMPORTANT: Always keep your response conversational, concise (1 or 2 lines).\n\n");
        
        context.append("Sitemap & Automated Actions:\n");
        context.append("- Home: /\n");
        context.append("- Domain Selection: /domain-selection\n");
        context.append("- AI Mock Interview: /mock-interview\n");
        context.append("- Job Search: /job-search\n");
        context.append("- Interview Search: /interview-search\n");
        context.append("- Resume Builder: /resume-builder\n");
        context.append("- Study Planner: /study-planner\n");
        context.append("- Community Forum: /forum\n");
        context.append("- ATS Checker: /resume-matcher\n");
        context.append("- Online Compiler: /compiler\n");
        context.append("- AI Assistant: /ai-agent\n\n");
        
        context.append("ACTION COMMAND FORMAT:\n");
        context.append("1. If user asks to navigate to a page without prefilled data, append: '[NAVIGATE: /path]'\n");
        context.append("2. If user asks to perform an action on a page (e.g., create a study plan for DSA for 30 days, search for Java jobs, etc.), append '[NAVIGATE: /path | DATA: {\"subject\":\"DSA\",\"durationDays\":30,\"autoSubmit\":true}]'\n");
        context.append("Example 1: 'Navigating to Study Planner to generate your 30-day DSA plan! [NAVIGATE: /study-planner | DATA: {\"subject\":\"Data Structures & Algorithms\",\"durationDays\":30,\"hoursPerDay\":4,\"difficultyLevel\":\"intermediate\",\"autoSubmit\":true}]'\n");
        context.append("Example 2: 'Taking you to Job Search for Java Developer roles! [NAVIGATE: /job-search | DATA: {\"jobTitle\":\"Java Developer\",\"autoSubmit\":true}]'\n\n");
        
        if (additionalContext != null && !additionalContext.isEmpty()) {
            context.append("Additional Context: ").append(additionalContext).append("\n\n");
        }
        
        List<AgentInteraction> recentInteractions = agentInteractionRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
        if (!recentInteractions.isEmpty()) {
            context.append("Recent Conversation:\n");
            for (AgentInteraction interaction : recentInteractions.subList(
                    Math.max(0, recentInteractions.size() - 5), recentInteractions.size())) {
                context.append("User: ").append(interaction.getUserMessage()).append("\n");
                context.append("AI: ").append(interaction.getAgentResponse()).append("\n");
            }
            context.append("\n");
        }
        
        return context.toString();
    }
    
    private String buildPrompt(String message, String context, String interactionType) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append(context);
        
        if ("interview_prep".equals(interactionType)) {
            prompt.append("The user is preparing for an interview. Provide helpful tips, common questions, ");
            prompt.append("and guidance specific to their query.\n\n");
        } else if ("resume_review".equals(interactionType)) {
            prompt.append("The user wants help with their resume. Provide specific, actionable advice ");
            prompt.append("to improve their resume.\n\n");
        } else if ("coding_help".equals(interactionType)) {
            prompt.append("The user needs help with a coding problem. Provide hints and guidance ");
            prompt.append("without giving away the complete solution.\n\n");
        } else if ("career_guidance".equals(interactionType)) {
            prompt.append("The user is seeking career advice. Provide thoughtful guidance based on ");
            prompt.append("industry trends and best practices.\n\n");
        }
        
        prompt.append("User Query: ").append(message);
        prompt.append("\n\nProvide a very concise response in strictly 1 or 2 lines only.");
        
        return prompt.toString();
    }
    
    private String callGroqAPI(String prompt) throws Exception {
        Map<String, Object> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", prompt);
        
        Map<String, Object> requestBodyMap = new HashMap<>();
        requestBodyMap.put("model", MODEL_NAME);
        requestBodyMap.put("messages", Collections.singletonList(userMsg));
        requestBodyMap.put("temperature", 0.7);
        
        String requestJson = objectMapper.writeValueAsString(requestBodyMap);
        
        System.out.println("Calling Groq API: " + GROQ_API_URL + " with model: " + MODEL_NAME);
        long startTime = System.currentTimeMillis();
        
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(GROQ_API_URL))
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .header("Authorization", "Bearer " + groqApiKey)
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                .timeout(Duration.ofSeconds(60))
                .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                .build();
        
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        long duration = System.currentTimeMillis() - startTime;
        System.out.println("Groq API call took: " + duration + "ms");
        
        if (response.statusCode() == 200) {
            JsonNode root = objectMapper.readTree(response.body());
            JsonNode choices = root.path("choices");
            if (choices.isArray() && choices.size() > 0) {
                return choices.get(0).path("message").path("content").asText();
            }
            throw new RuntimeException("Groq returned 200 but no choices were generated.");
        } else {
            String errorBody = response.body();
            System.err.println("Groq API Error (HTTP " + response.statusCode() + "): " + errorBody);
            
            if (response.statusCode() == 429) {
                return "I'm currently receiving too many requests. Please try again in 30 seconds.";
            }
            
            throw new RuntimeException("Groq API Error: " + response.statusCode() + " - " + errorBody);
        }
    }
    
    private String generateVoice(String text) {
        return "https://api.elevenlabs.io/v1/text-to-speech/" + 
               java.util.Base64.getEncoder().encodeToString(text.getBytes());
    }
    
    private String generateSuggestedActions(String message, String interactionType) {
        if ("interview_prep".equals(interactionType)) {
            return "Common Interview Questions,Behavioral Questions,Technical Questions";
        } else if ("resume_review".equals(interactionType)) {
            return "ATS Optimization,Format Tips,Content Improvement";
        } else if ("coding_help".equals(interactionType)) {
            return "Algorithm Tips,Data Structures,Practice Problems";
        } else if ("career_guidance".equals(interactionType)) {
            return "Domain Selection,Skill Development,Job Search";
        }
        return "Ask Follow-up,Get More Details,Related Topics";
    }
    
    private void saveInteraction(Long userId, String sessionId, AgentInteractionRequest request, AgentInteractionResponse response) {
        try {
            AgentInteraction interaction = new AgentInteraction();
            if (userId != null) {
                User user = new User();
                user.setId(userId);
                interaction.setUser(user);
            }
            interaction.setSessionId(sessionId);
            interaction.setInteractionType(request.getInteractionType());
            interaction.setUserMessage(request.getMessage());
            interaction.setAgentResponse(response.getResponse());
            interaction.setContext(response.getContext());
            interaction.setVoiceMode(response.isVoiceMode());
            interaction.setVoiceUrl(response.getVoiceUrl());
            
            agentInteractionRepository.save(interaction);
        } catch (Exception e) {
            System.err.println("Error saving interaction: " + e.getMessage());
        }
    }
}
