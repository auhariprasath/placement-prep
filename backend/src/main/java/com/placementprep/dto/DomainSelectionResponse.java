package com.placementprep.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DomainSelectionResponse {
    private String recommendedDomain;
    private double confidenceScore;
    private String description;
    private String fitReason;
    private List<SubjectRecommendation> importantSubjects;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SubjectRecommendation {
        private String subjectName;
        private String description;
        private String keyTopics;
        private String videoTitle;
        private String videoUrl;
        
        @JsonAlias({"channelName", "videoChannel", "channel"})
        private String videoChannel;
    }
}
