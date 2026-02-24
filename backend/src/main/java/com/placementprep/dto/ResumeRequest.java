package com.placementprep.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeRequest {
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String linkedIn;
    private String portfolio;
    private String summary;
    private List<Education> education;
    private List<Experience> experience;
    private List<String> skills;
    private List<Project> projects;
    private List<String> certifications;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Education {
        private String institution;
        private String degree;
        private String fieldOfStudy;
        private String startDate;
        private String endDate;
        private String gpa;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Experience {
        private String company;
        private String position;
        private String startDate;
        private String endDate;
        private List<String> responsibilities;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Project {
        private String name;
        private String description;
        private String technologies;
        private String link;
    }
}
