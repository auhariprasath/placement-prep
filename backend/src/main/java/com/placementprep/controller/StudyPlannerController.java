package com.placementprep.controller;

import com.placementprep.dto.StudyPlannerRequest;
import com.placementprep.dto.StudyPlannerResponse;
import com.placementprep.service.StudyPlannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/study-planner")
public class StudyPlannerController {
    
    @Autowired
    private StudyPlannerService studyPlannerService;
    
    @PostMapping("/generate")
    public ResponseEntity<StudyPlannerResponse> generateStudyPlan(@RequestBody StudyPlannerRequest request) {
        StudyPlannerResponse response = studyPlannerService.generateStudyPlan(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/generate")
    public ResponseEntity<StudyPlannerResponse> generateStudyPlanGet(
            @RequestParam String subject,
            @RequestParam int durationDays,
            @RequestParam(required = false, defaultValue = "4") int hoursPerDay,
            @RequestParam(required = false, defaultValue = "intermediate") String difficultyLevel,
            @RequestParam(required = false) String targetGoal) {
        
        StudyPlannerRequest request = new StudyPlannerRequest();
        request.setSubject(subject);
        request.setDurationDays(durationDays);
        request.setHoursPerDay(hoursPerDay);
        request.setDifficultyLevel(difficultyLevel);
        request.setTargetGoal(targetGoal);
        
        StudyPlannerResponse response = studyPlannerService.generateStudyPlan(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Study Planner Service is running!");
    }
}
