package com.placementprep.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CodeExecutionRequest {
    private String code;
    private String language;
    private String input;
    private String expectedOutput;
    private Long problemId;
}
