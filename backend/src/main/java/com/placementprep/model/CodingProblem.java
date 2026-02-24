package com.placementprep.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "coding_problems")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CodingProblem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "difficulty")
    private String difficulty;
    
    @Column(name = "category")
    private String category;
    
    @Column(name = "tags")
    private String tags;
    
    @Column(name = "input_format", columnDefinition = "TEXT")
    private String inputFormat;
    
    @Column(name = "output_format", columnDefinition = "TEXT")
    private String outputFormat;
    
    @Column(name = "constraints", columnDefinition = "TEXT")
    private String constraints;
    
    @Column(name = "sample_input", columnDefinition = "TEXT")
    private String sampleInput;
    
    @Column(name = "sample_output", columnDefinition = "TEXT")
    private String sampleOutput;
    
    @Column(name = "explanation", columnDefinition = "TEXT")
    private String explanation;
    
    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TestCase> testCases = new ArrayList<>();
    
    @Column(name = "time_limit_seconds")
    private Integer timeLimitSeconds = 2;
    
    @Column(name = "memory_limit_mb")
    private Integer memoryLimitMb = 256;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
