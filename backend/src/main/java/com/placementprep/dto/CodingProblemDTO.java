package com.placementprep.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CodingProblemDTO {
    private Long id;
    private String title;
    private String description;
    private String difficulty;
    private String category;
    private String tags;
    private String inputFormat;
    private String outputFormat;
    private String constraints;
    private String sampleInput;
    private String sampleOutput;
    private String explanation;
    private Integer timeLimitSeconds;
    private Integer memoryLimitMb;
    private List<TestCaseDTO> testCases;
}
