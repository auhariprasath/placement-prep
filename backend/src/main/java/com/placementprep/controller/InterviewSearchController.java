package com.placementprep.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.placementprep.dto.InterviewSearchRequest;
import com.placementprep.service.InterviewSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interviews")
public class InterviewSearchController {
    
    @Autowired
    private InterviewSearchService interviewSearchService;
    
    @PostMapping("/search")
    public ResponseEntity<JsonNode> searchInterviews(@RequestBody InterviewSearchRequest request) {
        JsonNode results = interviewSearchService.searchInterviews(request);
        return ResponseEntity.ok(results);
    }
    
    @GetMapping("/search")
    public ResponseEntity<JsonNode> searchInterviewsGet(
            @RequestParam String companyId,
            @RequestParam(required = false, defaultValue = "1") String page,
            @RequestParam(required = false, defaultValue = "POPULAR") String sort,
            @RequestParam(required = false, defaultValue = "ANY") String jobFunction,
            @RequestParam(required = false) String jobTitle,
            @RequestParam(required = false) String location,
            @RequestParam(required = false, defaultValue = "ANY") String locationType,
            @RequestParam(required = false, defaultValue = "false") String receivedOfferOnly) {
        
        InterviewSearchRequest request = new InterviewSearchRequest();
        request.setCompanyId(companyId);
        request.setPage(page);
        request.setSort(sort);
        request.setJobFunction(jobFunction);
        request.setJobTitle(jobTitle);
        request.setLocation(location);
        request.setLocationType(locationType);
        request.setReceivedOfferOnly(receivedOfferOnly);
        
        JsonNode results = interviewSearchService.searchInterviews(request);
        return ResponseEntity.ok(results);
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Interview Search Service is running!");
    }
}
