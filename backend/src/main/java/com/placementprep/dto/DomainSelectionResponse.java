package com.placementprep.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DomainSelectionResponse {
    private String recommendedDomain;
    private double confidenceScore;
    private String description;
    private String careerPaths;
    private String skillsRequired;
}
