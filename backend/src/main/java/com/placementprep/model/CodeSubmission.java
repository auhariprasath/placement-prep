package com.placementprep.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "code_submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CodeSubmission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "problem_id")
    private Long problemId;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String code;
    
    @Column(name = "language")
    private String language;
    
    @Column(name = "input_data", columnDefinition = "TEXT")
    private String inputData;
    
    @Column(name = "expected_output", columnDefinition = "TEXT")
    private String expectedOutput;
    
    @Column(name = "actual_output", columnDefinition = "TEXT")
    private String actualOutput;
    
    @Column(name = "status")
    private String status;
    
    @Column(name = "execution_time_ms")
    private Long executionTimeMs;
    
    @Column(name = "memory_used_kb")
    private Long memoryUsedKb;
    
    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
