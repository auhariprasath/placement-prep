package com.placementprep.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudyPlannerResponse {
    private String subject;
    private int totalDays;
    private int hoursPerDay;
    private List<DailyPlan> dailyPlans;
    private List<String> tips;
    private String overallStrategy;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyPlan {
        private int day;
        private String date;
        private List<Topic> topics;
        private int totalHours;
        private String focusArea;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Topic {
        private String name;
        private double hours;
        private String difficulty;
        private int priority;
        private String description;
    }
}
