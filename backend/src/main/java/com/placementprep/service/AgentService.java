package com.placementprep.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
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
import java.util.*;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AgentService {
    
    @Value("${gemini.api.key}")
    private String geminiApiKey;
    
    @Autowired
    private AgentInteractionRepository agentInteractionRepository;
    
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";
    
    public AgentService() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }
    
    public AgentInteractionResponse interact(AgentInteractionRequest request, Long userId) {
        String sessionId = request.getSessionId() != null ? request.getSessionId() : UUID.randomUUID().toString();
        
        try {
            String context = buildContext(userId, sessionId, request.getContext());
            String prompt = buildPrompt(request.getMessage(), context, request.getInteractionType());
            
            String geminiResponse = callGeminiAPI(prompt);
            
            AgentInteractionResponse response = new AgentInteractionResponse();
            
            // Check for navigation intent [NAVIGATE: /path]
            if (geminiResponse.contains("[NAVIGATE:")) {
                int start = geminiResponse.indexOf("[NAVIGATE:");
                int end = geminiResponse.indexOf("]", start);
                if (end > start) {
                    String navPath = geminiResponse.substring(start + 11, end).trim();
                    response.setRedirectPath(navPath);
                    // Clean up the text response
                    geminiResponse = geminiResponse.replace(geminiResponse.substring(start, end + 1), "").trim();
                }
            }
            
            response.setResponse(geminiResponse);
            response.setSessionId(sessionId);
            response.setContext(context);
            response.setVoiceMode(request.isVoiceMode());
            response.setSuggestedActions(generateSuggestedActions(request.getMessage(), request.getInteractionType()));
            
            if (request.isVoiceMode()) {
                String voiceUrl = generateVoice(geminiResponse);
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
        
        context.append("domain selection advice, and general career guidance. ");
        context.append("IMPORTANT: Always keep your responses extremely short, strictly 1 or 2 lines max.\n\n");
        
        context.append("Sitemap (Paths to pages):\n");
        context.append("- Home: /\n");
        context.append("- Domain Selection: /domain-selection\n");
        context.append("- Job Search: /job-search\n");
        context.append("- Interview Search: /interview-search\n");
        context.append("- Resume Builder: /resume-builder\n");
        context.append("- Study Planner: /study-planner\n");
        context.append("- Community Forum: /forum\n");
        context.append("- ATS Checker: /resume-matcher\n");
        context.append("- Online Compiler: /compiler\n");
        context.append("- AI Assistant: /ai-agent\n\n");
        
        context.append("If the user asks to go to or navigate to a page, always include '[NAVIGATE: /path]' in your response.\n");
        context.append("Example: 'Sure, let's go to the Resume Builder. [NAVIGATE: /resume-builder]'\n\n");
        
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
    
    private String callGeminiAPI(String prompt) throws Exception {
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        
        Map<String, Object> content = new HashMap<>();
        content.put("parts", Collections.singletonList(part));
        
        Map<String, Object> requestBodyMap = new HashMap<>();
        requestBodyMap.put("contents", Collections.singletonList(content));
        
        String requestJson = objectMapper.writeValueAsString(requestBodyMap);
        String url = GEMINI_API_URL + "?key=" + geminiApiKey;
        
        System.out.println("Calling Gemini API: " + url.substring(0, url.indexOf("?")));
        long startTime = System.currentTimeMillis();
        
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .timeout(java.time.Duration.ofSeconds(60))
                .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                .build();
        
        System.out.println("Request Body: " + requestJson);
        
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        long duration = System.currentTimeMillis() - startTime;
        System.out.println("Gemini API call took: " + duration + "ms");
        
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
            System.err.println("Gemini API Error (HTTP " + response.statusCode() + "): " + errorBody);
            
            if (response.statusCode() == 429) {
                return "I'm currently receiving too many requests. Please try again in 30 seconds.";
            }
            if (response.statusCode() == 404) {
                return "The AI model is currently unavailable. Please try again later.";
            }
            
            throw new RuntimeException("Gemini API Error: " + response.statusCode());
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
