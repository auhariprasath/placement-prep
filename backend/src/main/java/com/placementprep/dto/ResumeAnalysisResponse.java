package com.placementprep.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeAnalysisResponse {
    private Integer atsScore;
    private Integer keywordMatchScore;
    private Integer formatScore;
    private Integer contentScore;
    private List<String> matchedKeywords;
    private List<String> missingKeywords;
    private List<String> suggestions;
    private List<ImprovementItem> improvements;
    private String overallFeedback;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImprovementItem {
        private String category;
        private String issue;
        private String suggestion;
        private int priority;
    }
}
