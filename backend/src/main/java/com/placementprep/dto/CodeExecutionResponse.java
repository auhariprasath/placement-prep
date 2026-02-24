package com.placementprep.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CodeExecutionResponse {
    private String status;
    private String output;
    private String error;
    private Long executionTimeMs;
    private Long memoryUsedKb;
    private boolean passed;
    private String expectedOutput;
    private String actualOutput;
    private String message;
}
