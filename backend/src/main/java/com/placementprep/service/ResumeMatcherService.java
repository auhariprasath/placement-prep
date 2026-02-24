package com.placementprep.service;

import com.placementprep.dto.ResumeAnalysisRequest;
import com.placementprep.dto.ResumeAnalysisResponse;
import com.placementprep.model.ResumeAnalysis;
import com.placementprep.repository.ResumeAnalysisRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ResumeMatcherService {
    
    @Autowired
    private ResumeAnalysisRepository resumeAnalysisRepository;
    
    private static final Set<String> COMMON_WORDS = Set.of(
        "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by",
        "from", "as", "is", "was", "are", "were", "be", "been", "being", "have", "has", "had",
        "do", "does", "did", "will", "would", "could", "should", "may", "might", "must", "can",
        "this", "that", "these", "those", "i", "you", "he", "she", "it", "we", "they"
    );
    
    private static final Set<String> TECHNICAL_KEYWORDS = Set.of(
        "java", "python", "javascript", "typescript", "react", "angular", "vue", "node", "spring",
        "django", "flask", "express", "mongodb", "mysql", "postgresql", "oracle", "sql", "nosql",
        "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "git", "github", "gitlab",
        "ci/cd", "devops", "agile", "scrum", "rest", "api", "graphql", "microservices",
        "machine learning", "deep learning", "ai", "data science", "analytics", "big data",
        "html", "css", "bootstrap", "tailwind", "sass", "less", "jquery", "ajax",
        "linux", "unix", "windows", "bash", "shell", "powershell",
        "tensorflow", "pytorch", "keras", "scikit-learn", "pandas", "numpy", "matplotlib",
        "android", "ios", "flutter", "react native", "swift", "kotlin",
        "security", "cryptography", "penetration testing", "ethical hacking"
    );
    
    private static final Set<String> SOFT_SKILLS = Set.of(
        "leadership", "communication", "teamwork", "problem solving", "critical thinking",
        "time management", "project management", "adaptability", "creativity", "collaboration",
        "analytical", "detail oriented", "self motivated", "organized", "flexible"
    );
    
    public ResumeAnalysisResponse analyzeResume(MultipartFile resumeFile, String jobDescription) throws IOException {
        String resumeText = extractTextFromPDF(resumeFile);
        return analyzeResumeText(resumeText, jobDescription, resumeFile.getOriginalFilename());
    }
    
    public ResumeAnalysisResponse analyzeResumeText(String resumeText, String jobDescription, String fileName) {
        ResumeAnalysisResponse response = new ResumeAnalysisResponse();
        
        Set<String> resumeKeywords = extractKeywords(resumeText);
        Set<String> jobKeywords = extractKeywords(jobDescription);
        
        Set<String> matchedKeywords = new HashSet<>(resumeKeywords);
        matchedKeywords.retainAll(jobKeywords);
        
        Set<String> missingKeywords = new HashSet<>(jobKeywords);
        missingKeywords.removeAll(resumeKeywords);
        
        int keywordScore = calculateKeywordScore(matchedKeywords.size(), jobKeywords.size());
        int formatScore = analyzeFormat(resumeText);
        int contentScore = analyzeContent(resumeText);
        
        int atsScore = (keywordScore + formatScore + contentScore) / 3;
        
        response.setAtsScore(atsScore);
        response.setKeywordMatchScore(keywordScore);
        response.setFormatScore(formatScore);
        response.setContentScore(contentScore);
        response.setMatchedKeywords(new ArrayList<>(matchedKeywords));
        response.setMissingKeywords(new ArrayList<>(missingKeywords));
        response.setSuggestions(generateSuggestions(resumeText, missingKeywords));
        response.setImprovements(generateImprovements(resumeText, jobDescription));
        response.setOverallFeedback(generateOverallFeedback(atsScore, keywordScore, formatScore, contentScore));
        
        saveAnalysis(resumeText, jobDescription, fileName, response);
        
        return response;
    }
    
    private String extractTextFromPDF(MultipartFile file) throws IOException {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }
    
    private Set<String> extractKeywords(String text) {
        Set<String> keywords = new HashSet<>();
        
        // Normalize text: lowercase and handle multiple spaces
        String normalized = text.toLowerCase()
                .replaceAll("[^a-z0-9+#/\\-\\s.]", " ") // Keep . for .net, + for c++
                .replaceAll("\\s+", " ");
        
        // 1. Extract technical keywords from our master list
        for (String techKeyword : TECHNICAL_KEYWORDS) {
            // Use word boundary to avoid partial matches (e.g., "java" in "javascript")
            Pattern p = Pattern.compile("\\b" + Pattern.quote(techKeyword) + "\\b");
            if (p.matcher(normalized).find()) {
                keywords.add(techKeyword);
            }
        }
        
        // 2. Extract soft skills
        for (String softSkill : SOFT_SKILLS) {
            if (normalized.contains(softSkill)) {
                keywords.add(softSkill);
            }
        }
        
        // 3. Extract experience-related patterns
        Pattern expPattern = Pattern.compile("\\b\\d+\\+?\\s*years?\\b");
        Matcher matcher = expPattern.matcher(normalized);
        while (matcher.find()) {
            keywords.add(matcher.group());
        }
        
        // 4. Extract potential nouns/skills not in our master list
        String[] words = normalized.split("\\s+");
        for (String word : words) {
            if (word.length() > 3 && !COMMON_WORDS.contains(word)) {
                // If it looks like a technical term (contains numbers or special chars or all caps in source)
                if (word.matches(".*[0-9].*") || word.length() > 10) {
                    keywords.add(word);
                }
            }
        }
        
        return keywords;
    }
    
    private int calculateKeywordScore(int matched, int total) {
        if (total == 0) return 100;
        
        // Use a non-linear scale: matching the first few keywords is more important
        // matchScore = (matched / total) * 100
        double ratio = (double) matched / total;
        
        // Give a boost if we match at least 50% of keywords
        double score;
        if (ratio >= 0.8) {
            score = 90 + (ratio - 0.8) * 50; // 90 to 100
        } else if (ratio >= 0.5) {
            score = 70 + (ratio - 0.5) * 66; // 70 to 90
        } else {
            score = ratio * 140; // 0 to 70
        }
        
        return (int) Math.min(100, Math.round(score));
    }
    
    private int analyzeFormat(String resumeText) {
        int score = 100;
        
        if (resumeText.length() < 500) score -= 20;
        if (resumeText.length() > 10000) score -= 10;
        
        if (!resumeText.toLowerCase().contains("experience") && 
            !resumeText.toLowerCase().contains("work")) score -= 15;
        
        if (!resumeText.toLowerCase().contains("education")) score -= 10;
        
        if (!resumeText.toLowerCase().contains("skills")) score -= 10;
        
        String[] lines = resumeText.split("\\n");
        boolean hasContactInfo = false;
        for (String line : lines) {
            if (line.matches(".*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}.*") ||
                line.matches(".*\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b.*") ||
                line.toLowerCase().contains("linkedin")) {
                hasContactInfo = true;
                break;
            }
        }
        if (!hasContactInfo) score -= 10;
        
        return Math.max(0, score);
    }
    
    private int analyzeContent(String resumeText) {
        int score = 100;
        String lower = resumeText.toLowerCase();
        
        if (!lower.contains("achieved") && !lower.contains("accomplished") && 
            !lower.contains("improved") && !lower.contains("increased")) {
            score -= 15;
        }
        
        if (lower.contains("i am") || lower.contains("my duties") || lower.contains("responsible for")) {
            score -= 10;
        }
        
        Pattern quantifierPattern = Pattern.compile("\\b\\d+%?\\b");
        Matcher matcher = quantifierPattern.matcher(resumeText);
        int quantifierCount = 0;
        while (matcher.find()) quantifierCount++;
        if (quantifierCount < 3) score -= 10;
        
        if (resumeText.split("\\n").length < 10) score -= 10;
        
        return Math.max(0, score);
    }
    
    private List<String> generateSuggestions(String resumeText, Set<String> missingKeywords) {
        List<String> suggestions = new ArrayList<>();
        
        if (!missingKeywords.isEmpty()) {
            suggestions.add("Consider adding these keywords from the job description: " + 
                missingKeywords.stream().limit(10).collect(Collectors.joining(", ")));
        }
        
        if (!resumeText.toLowerCase().contains("summary") && 
            !resumeText.toLowerCase().contains("objective")) {
            suggestions.add("Add a professional summary or objective statement at the top");
        }
        
        suggestions.add("Use action verbs to start bullet points (e.g., Developed, Implemented, Led)");
        suggestions.add("Quantify achievements with numbers and percentages where possible");
        suggestions.add("Tailor your resume keywords to match the job description");
        
        return suggestions;
    }
    
    private List<ResumeAnalysisResponse.ImprovementItem> generateImprovements(String resumeText, String jobDescription) {
        List<ResumeAnalysisResponse.ImprovementItem> improvements = new ArrayList<>();
        String lower = resumeText.toLowerCase();
        
        if (lower.contains("i am") || lower.contains("my responsibilities")) {
            improvements.add(new ResumeAnalysisResponse.ImprovementItem(
                "Language",
                "Using first-person pronouns",
                "Remove 'I', 'me', 'my' - use action verbs instead",
                3
            ));
        }
        
        if (!lower.contains("skills") || resumeText.toLowerCase().split("skills")[0].length() > 5000) {
            improvements.add(new ResumeAnalysisResponse.ImprovementItem(
                "Structure",
                "Skills section not prominent",
                "Add a dedicated skills section near the top",
                2
            ));
        }
        
        Pattern pattern = Pattern.compile("\\b\\d+%?\\b");
        Matcher matcher = pattern.matcher(resumeText);
        int count = 0;
        while (matcher.find()) count++;
        if (count < 5) {
            improvements.add(new ResumeAnalysisResponse.ImprovementItem(
                "Content",
                "Lack of quantifiable achievements",
                "Add metrics like 'Increased sales by 25%' or 'Managed team of 10'",
                1
            ));
        }
        
        return improvements;
    }
    
    private String generateOverallFeedback(int atsScore, int keywordScore, int formatScore, int contentScore) {
        StringBuilder feedback = new StringBuilder();
        
        if (atsScore >= 80) {
            feedback.append("Excellent! Your resume is well-optimized for ATS systems. ");
        } else if (atsScore >= 60) {
            feedback.append("Good start! Your resume passes basic ATS checks but has room for improvement. ");
        } else {
            feedback.append("Your resume needs significant improvements to pass ATS filters. ");
        }
        
        if (keywordScore < 60) {
            feedback.append("Focus on adding more relevant keywords from the job description. ");
        }
        
        if (formatScore < 70) {
            feedback.append("Review your resume format for better ATS compatibility. ");
        }
        
        if (contentScore < 70) {
            feedback.append("Strengthen your content with more achievements and action verbs. ");
        }
        
        return feedback.toString();
    }
    
    private void saveAnalysis(String resumeText, String jobDescription, String fileName, ResumeAnalysisResponse response) {
        ResumeAnalysis analysis = new ResumeAnalysis();
        analysis.setResumeFileName(fileName);
        analysis.setResumeText(resumeText);
        analysis.setJobDescription(jobDescription);
        analysis.setAtsScore(response.getAtsScore());
        analysis.setKeywordMatchScore(response.getKeywordMatchScore());
        analysis.setFormatScore(response.getFormatScore());
        analysis.setContentScore(response.getContentScore());
        analysis.setMatchedKeywords(String.join(",", response.getMatchedKeywords()));
        analysis.setMissingKeywords(String.join(",", response.getMissingKeywords()));
        analysis.setSuggestions(String.join("\n", response.getSuggestions()));
        
        resumeAnalysisRepository.save(analysis);
    }
}
