package com.placementprep.controller;

import com.placementprep.dto.MockInterviewDTOs;
import com.placementprep.service.MockInterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/mock-interview")
public class MockInterviewController {

    @Autowired
    private MockInterviewService mockInterviewService;

    @PostMapping("/start")
    public ResponseEntity<?> startInterview(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "resumeText", required = false) String resumeText) {
        try {
            MockInterviewDTOs.StartResponse response = mockInterviewService.startInterview(file, resumeText);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/evaluate")
    public ResponseEntity<?> evaluateInterview(@RequestBody MockInterviewDTOs.EvaluateRequest request) {
        try {
            MockInterviewDTOs.EvaluationResponse response = mockInterviewService.evaluateInterview(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
