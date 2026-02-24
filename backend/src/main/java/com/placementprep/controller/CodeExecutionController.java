package com.placementprep.controller;

import com.placementprep.dto.CodeExecutionRequest;
import com.placementprep.dto.CodeExecutionResponse;
import com.placementprep.service.CodeExecutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/compiler")
public class CodeExecutionController {
    
    @Autowired
    private CodeExecutionService codeExecutionService;
    
    @PostMapping("/execute")
    public ResponseEntity<CodeExecutionResponse> executeCode(@RequestBody CodeExecutionRequest request) {
        CodeExecutionResponse response = codeExecutionService.executeCode(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/run-tests/{problemId}")
    public ResponseEntity<CodeExecutionResponse> runProblemTests(
            @PathVariable Long problemId,
            @RequestBody CodeExecutionRequest request) {
        CodeExecutionResponse response = codeExecutionService.runProblemTests(
                problemId, 
                request.getCode(), 
                request.getLanguage()
        );
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Code Execution Service is running!");
    }
}
