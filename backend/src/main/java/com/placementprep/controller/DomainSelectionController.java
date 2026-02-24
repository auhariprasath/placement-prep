package com.placementprep.controller;

import com.placementprep.dto.DomainSelectionRequest;
import com.placementprep.dto.DomainSelectionResponse;
import com.placementprep.service.DomainSelectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/domain")
public class DomainSelectionController {
    
    @Autowired
    private DomainSelectionService domainSelectionService;
    
    @PostMapping("/predict")
    public ResponseEntity<DomainSelectionResponse> predictDomain(@RequestBody DomainSelectionRequest request) {
        DomainSelectionResponse response = domainSelectionService.predictDomain(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Domain Selection Service is running!");
    }
}
