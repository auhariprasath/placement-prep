package com.placementprep.service;

import com.placementprep.dto.DomainSelectionRequest;
import com.placementprep.dto.DomainSelectionResponse;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DomainSelectionService {
    
    private final Map<Integer, String> careerMapping;
    private final Map<String, CareerDetails> careerDetailsMap;
    
    public DomainSelectionService() {
        this.careerMapping = initializeCareerMapping();
        this.careerDetailsMap = initializeCareerDetails();
    }
    
    public DomainSelectionResponse predictDomain(DomainSelectionRequest request) {
        Map<String, Boolean> features = request.getFeatures();
        if (features == null) {
            features = new HashMap<>();
        }
        
        // Logic: Calculate scores for each of the 35 careers based on the 59 features
        int bestCareerId = 11; // Default to B.Tech CSE
        double highestScore = -1;
        
        for (int i = 0; i < 35; i++) {
            double score = calculateCareerScore(i, features);
            if (score > highestScore) {
                highestScore = score;
                bestCareerId = i;
            }
        }
        
        String recommendedCareer = careerMapping.get(bestCareerId);
        CareerDetails details = careerDetailsMap.getOrDefault(recommendedCareer, getDefaultDetails());
        
        double confidence = 75.0 + (highestScore * 2.5); // Mocked confidence score based on feature match
        if (confidence > 98.0) confidence = 98.0;

        return new DomainSelectionResponse(
            recommendedCareer,
            Math.round(confidence * 10.0) / 10.0,
            details.getDescription(),
            details.getCareerPaths(),
            details.getSkillsRequired()
        );
    }
    
    private double calculateCareerScore(int careerId, Map<String, Boolean> features) {
        double score = 0;
        
        // Define key features for broad categories
        switch(careerId) {
            case 11: // B.Tech CSE
            case 21: // BCA
            case 8:  // B.Sc IT
                if (isSet(features, "Coding")) score += 10;
                if (isSet(features, "Computer Parts")) score += 5;
                if (isSet(features, "Mathematics")) score += 3;
                if (isSet(features, "Solving Puzzles")) score += 4;
                break;
                
            case 34: // MBBS
            case 22: // BDS
            case 5:  // B.Sc Nursing
            case 26: // BPharma
                if (isSet(features, "Biology")) score += 10;
                if (isSet(features, "Doctor")) score += 8;
                if (isSet(features, "Science")) score += 5;
                if (isSet(features, "Zoology")) score += 4;
                break;
                
            case 0: // Animation
            case 24: // BFD (Fashion Design)
            case 28: // BVA (Visual Arts)
                if (isSet(features, "Drawing")) score += 10;
                if (isSet(features, "Designing")) score += 8;
                if (isSet(features, "Crafting")) score += 5;
                if (isSet(features, "Cartooning")) score += 6;
                break;
                
            case 10: // B.Tech Civil
            case 14: // B.Tech Mechanical
            case 1:  // B.Arch
                if (isSet(features, "Architecture")) score += 10;
                if (isSet(features, "Mechanic Parts")) score += 8;
                if (isSet(features, "Electricity Components")) score += 5;
                if (isSet(features, "Engeeniering")) score += 7;
                break;
                
            case 2: // B.Com
            case 29: // CA
            case 30: // CS
            case 15: // BA Economics
                if (isSet(features, "Accounting")) score += 10;
                if (isSet(features, "Economics")) score += 8;
                if (isSet(features, "Bussiness Education")) score += 6;
                if (isSet(features, "Mathematics")) score += 4;
                break;

            case 32: // Drama
                if (isSet(features, "Acting")) score += 10;
                if (isSet(features, "Dancing")) score += 5;
                if (isSet(features, "Singing")) score += 5;
                if (isSet(features, "Director")) score += 8;
                break;
        }
        
        // General interests add slight points
        if (isSet(features, "Researching")) score += 1;
        if (isSet(features, "Engeeniering") && careerId >= 10 && careerId <= 14) score += 5;
        
        return score;
    }
    
    private boolean isSet(Map<String, Boolean> features, String key) {
        return features.getOrDefault(key, false);
    }
    
    private Map<Integer, String> initializeCareerMapping() {
        Map<Integer, String> map = new HashMap<>();
        map.put(0, "Animation, Graphics and Multimedia");
        map.put(1, "B.Arch");
        map.put(2, "B.Com");
        map.put(3, "B.Ed");
        map.put(4, "B.Sc Applied Geology");
        map.put(5, "B.Sc Nursing");
        map.put(6, "B.Sc Chemistry");
        map.put(7, "B.Sc Mathematics");
        map.put(8, "B.Sc IT");
        map.put(9, "B.Sc Physics");
        map.put(10, "B.Tech Civil");
        map.put(11, "B.Tech CSE");
        map.put(12, "B.Tech EEE");
        map.put(13, "B.Tech ECE");
        map.put(14, "B.Tech Mechanical");
        map.put(15, "BA Economics");
        map.put(16, "BA English");
        map.put(17, "BA Hindi");
        map.put(18, "BA History");
        map.put(19, "BBA");
        map.put(20, "BBS");
        map.put(21, "BCA");
        map.put(22, "BDS");
        map.put(23, "BEM");
        map.put(24, "BFD");
        map.put(25, "BJMC");
        map.put(26, "BPharma");
        map.put(27, "BTTM");
        map.put(28, "BVA");
        map.put(29, "CA");
        map.put(30, "CS");
        map.put(31, "Civil Services");
        map.put(32, "Diploma in Dramatic Arts");
        map.put(33, "BA + LLB");
        map.put(34, "MBBS");
        return map;
    }
    
    private Map<String, CareerDetails> initializeCareerDetails() {
        Map<String, CareerDetails> map = new HashMap<>();
        
        map.put("B.Tech CSE", new CareerDetails(
            "Focuses on software, algorithms, and computing systems. Ideal for problem solvers who love building digital solutions.",
            "Software Engineer, Data Scientist, Full Stack Developer, AI Engineer",
            "Programming, Data Structures, System Design, Problem Solving"
        ));
        
        map.put("MBBS", new CareerDetails(
            "Primary medical degree for aspiring doctors. Requires high dedication to life sciences and patient care.",
            "General Physician, Surgeon, Specialist Doctor (Pediatrics, Cardiology, etc.)",
            "Biology, Clinical Skills, Patient Care, Medical Research"
        ));
        
        map.put("CA", new CareerDetails(
            "Professional degree in accounting, auditing, and taxation. Best for those with strong numerical and regulatory aptitude.",
            "Auditor, Financial Consultant, Tax Advisor, CFO",
            "Accounting, Taxation, Law, Financial Management"
        ));

        map.put("Animation, Graphics and Multimedia", new CareerDetails(
            "Perfect for creative minds interested in visual storytelling, 3D modeling, and digital art.",
            "Graphic Designer, 3D Animator, VFX Artist, UI Designer",
            "Creativity, Adobe Suite, Modeling, Visual Theory"
        ));
        
        return map;
    }
    
    private CareerDetails getDefaultDetails() {
        return new CareerDetails(
            "This domain matches your diverse set of interests and skills. It offers a balanced path forward in your career journey.",
            "Professional, Consultant, Specialist, Manager",
            "Core Domain Knowledge, Communication, Analytical Thinking"
        );
    }
    
    private static class CareerDetails {
        private final String description;
        private final String careerPaths;
        private final String skillsRequired;
        
        public CareerDetails(String description, String careerPaths, String skillsRequired) {
            this.description = description;
            this.careerPaths = careerPaths;
            this.skillsRequired = skillsRequired;
        }
        
        public String getDescription() { return description; }
        public String getCareerPaths() { return careerPaths; }
        public String getSkillsRequired() { return skillsRequired; }
    }
}
