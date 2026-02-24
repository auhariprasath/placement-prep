package com.placementprep.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class StudyPlannerRequest {
    private String subject;
    private int durationDays;
    private int hoursPerDay;
    private String difficultyLevel;
    private String targetGoal;
    
    public StudyPlannerRequest() {
        this.hoursPerDay = 4;
        this.difficultyLevel = "intermediate";
    }
}
