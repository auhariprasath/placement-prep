package com.placementprep.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MainController {
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Placement Prep Backend is running!");
        response.put("version", "1.0.0");
        
        Map<String, String> services = new HashMap<>();
        services.put("domainSelection", "/api/domain");
        services.put("jobSearch", "/api/jobs");
        services.put("interviewSearch", "/api/interviews");
        services.put("resumeBuilder", "/api/resume");
        services.put("studyPlanner", "/api/study-planner");
        
        response.put("services", services);
        
        return ResponseEntity.ok(response);
    }
}
