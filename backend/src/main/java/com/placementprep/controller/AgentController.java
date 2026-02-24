package com.placementprep.controller;

import com.placementprep.dto.AgentInteractionRequest;
import com.placementprep.dto.AgentInteractionResponse;
import com.placementprep.model.AgentInteraction;
import com.placementprep.service.AgentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agent")
public class AgentController {
    
    @Autowired
    private AgentService agentService;
    
    @PostMapping("/interact")
    public ResponseEntity<AgentInteractionResponse> interact(
            @RequestBody AgentInteractionRequest request,
            @RequestParam(required = false) Long userId) {
        AgentInteractionResponse response = agentService.interact(request, userId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/history")
    public ResponseEntity<List<AgentInteraction>> getChatHistory(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String sessionId) {
        return ResponseEntity.ok(agentService.getChatHistory(userId, sessionId));
    }
    
    @PostMapping("/interview-prep")
    public ResponseEntity<AgentInteractionResponse> interviewPrep(
            @RequestParam String query,
            @RequestParam(required = false) Long userId) {
        AgentInteractionRequest request = new AgentInteractionRequest();
        request.setMessage(query);
        request.setInteractionType("interview_prep");
        return ResponseEntity.ok(agentService.interact(request, userId));
    }
    
    @PostMapping("/resume-help")
    public ResponseEntity<AgentInteractionResponse> resumeHelp(
            @RequestParam String query,
            @RequestParam(required = false) Long userId) {
        AgentInteractionRequest request = new AgentInteractionRequest();
        request.setMessage(query);
        request.setInteractionType("resume_review");
        return ResponseEntity.ok(agentService.interact(request, userId));
    }
    
    @PostMapping("/coding-help")
    public ResponseEntity<AgentInteractionResponse> codingHelp(
            @RequestParam String query,
            @RequestParam(required = false) Long userId) {
        AgentInteractionRequest request = new AgentInteractionRequest();
        request.setMessage(query);
        request.setInteractionType("coding_help");
        return ResponseEntity.ok(agentService.interact(request, userId));
    }
    
    @PostMapping("/career-guidance")
    public ResponseEntity<AgentInteractionResponse> careerGuidance(
            @RequestParam String query,
            @RequestParam(required = false) Long userId) {
        AgentInteractionRequest request = new AgentInteractionRequest();
        request.setMessage(query);
        request.setInteractionType("career_guidance");
        return ResponseEntity.ok(agentService.interact(request, userId));
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("AI Agent Service is running!");
    }
}
