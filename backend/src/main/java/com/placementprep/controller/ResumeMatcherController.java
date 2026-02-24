package com.placementprep.controller;

import com.placementprep.dto.ResumeAnalysisRequest;
import com.placementprep.dto.ResumeAnalysisResponse;
import com.placementprep.service.ResumeMatcherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume-matcher")
public class ResumeMatcherController {
    
    @Autowired
    private ResumeMatcherService resumeMatcherService;
    
    @PostMapping("/analyze")
    public ResponseEntity<ResumeAnalysisResponse> analyzeResume(
            @RequestParam("resume") MultipartFile resumeFile,
            @RequestParam("jobDescription") String jobDescription) {
        try {
            ResumeAnalysisResponse response = resumeMatcherService.analyzeResume(resumeFile, jobDescription);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/analyze-text")
    public ResponseEntity<ResumeAnalysisResponse> analyzeResumeText(
            @RequestBody ResumeAnalysisRequest request) {
        try {
            ResumeAnalysisResponse response = resumeMatcherService.analyzeResumeText(
                    request.getResumeText(), 
                    request.getJobDescription(),
                    request.getResumeFileName()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Resume Matcher Service is running!");
    }
}
