package com.placementprep.controller;

import com.placementprep.dto.ResumeRequest;
import com.placementprep.service.ResumeBuilderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resume")
public class ResumeBuilderController {
    
    @Autowired
    private ResumeBuilderService resumeBuilderService;
    
    @PostMapping("/generate")
    public ResponseEntity<byte[]> generateResume(@RequestBody ResumeRequest request) {
        try {
            byte[] pdfBytes = resumeBuilderService.generateResume(request);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", request.getFullName().replace(" ", "_") + "_Resume.pdf");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
                    
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/preview")
    public ResponseEntity<String> previewResume(@RequestBody ResumeRequest request) {
        try {
            String preview = generatePreview(request);
            return ResponseEntity.ok(preview);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error generating preview: " + e.getMessage());
        }
    }
    
    private String generatePreview(ResumeRequest request) {
        StringBuilder preview = new StringBuilder();
        preview.append("=== RESUME PREVIEW ===\n\n");
        preview.append(request.getFullName().toUpperCase()).append("\n");
        preview.append(request.getEmail());
        if (request.getPhone() != null) {
            preview.append(" | ").append(request.getPhone());
        }
        preview.append("\n\n");
        
        if (request.getSummary() != null) {
            preview.append("PROFESSIONAL SUMMARY\n");
            preview.append(request.getSummary()).append("\n\n");
        }
        
        if (request.getEducation() != null && !request.getEducation().isEmpty()) {
            preview.append("EDUCATION\n");
            for (ResumeRequest.Education edu : request.getEducation()) {
                preview.append(edu.getInstitution()).append("\n");
                preview.append(edu.getDegree()).append(" in ").append(edu.getFieldOfStudy()).append("\n");
                preview.append(edu.getStartDate()).append(" - ").append(edu.getEndDate()).append("\n\n");
            }
        }
        
        if (request.getExperience() != null && !request.getExperience().isEmpty()) {
            preview.append("EXPERIENCE\n");
            for (ResumeRequest.Experience exp : request.getExperience()) {
                preview.append(exp.getCompany()).append(" - ").append(exp.getPosition()).append("\n");
                preview.append(exp.getStartDate()).append(" - ").append(exp.getEndDate()).append("\n");
                if (exp.getResponsibilities() != null) {
                    for (String resp : exp.getResponsibilities()) {
                        preview.append("  - ").append(resp).append("\n");
                    }
                }
                preview.append("\n");
            }
        }
        
        if (request.getSkills() != null && !request.getSkills().isEmpty()) {
            preview.append("SKILLS\n");
            preview.append(String.join(", ", request.getSkills())).append("\n\n");
        }
        
        return preview.toString();
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Resume Builder Service is running!");
    }
}
