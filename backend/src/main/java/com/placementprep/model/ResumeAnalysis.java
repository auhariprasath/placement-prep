package com.placementprep.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "resume_analyses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeAnalysis {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "resume_file_name")
    private String resumeFileName;
    
    @Column(name = "resume_text", columnDefinition = "LONGTEXT")
    private String resumeText;
    
    @Column(name = "job_description", columnDefinition = "LONGTEXT")
    private String jobDescription;
    
    @Column(name = "ats_score")
    private Integer atsScore;
    
    @Column(name = "keyword_match_score")
    private Integer keywordMatchScore;
    
    @Column(name = "format_score")
    private Integer formatScore;
    
    @Column(name = "content_score")
    private Integer contentScore;
    
    @Column(name = "matched_keywords", columnDefinition = "TEXT")
    private String matchedKeywords;
    
    @Column(name = "missing_keywords", columnDefinition = "TEXT")
    private String missingKeywords;
    
    @Column(name = "suggestions", columnDefinition = "TEXT")
    private String suggestions;
    
    @Column(name = "improvements", columnDefinition = "TEXT")
    private String improvements;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
