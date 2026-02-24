package com.placementprep.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.placementprep.dto.JobSearchRequest;
import com.placementprep.service.JobSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
public class JobSearchController {
    
    @Autowired
    private JobSearchService jobSearchService;
    
    @PostMapping("/search")
    public ResponseEntity<JsonNode> searchJobs(@RequestBody JobSearchRequest request) {
        JsonNode results = jobSearchService.searchJobs(request);
        return ResponseEntity.ok(results);
    }
    
    @GetMapping("/search")
    public ResponseEntity<JsonNode> searchJobsGet(
            @RequestParam String query,
            @RequestParam String location,
            @RequestParam(required = false, defaultValue = "ANY") String locationType,
            @RequestParam(required = false, defaultValue = "10") int limit,
            @RequestParam(required = false, defaultValue = "false") boolean remoteOnly) {
        
        JobSearchRequest request = new JobSearchRequest();
        request.setQuery(query);
        request.setLocation(location);
        request.setLocationType(locationType);
        request.setLimit(limit);
        request.setRemoteOnly(remoteOnly);
        
        JsonNode results = jobSearchService.searchJobs(request);
        return ResponseEntity.ok(results);
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Job Search Service is running!");
    }
}
