package com.placementprep.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "test_cases")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestCase {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "problem_id", nullable = false)
    private CodingProblem problem;
    
    @Column(name = "input_data", columnDefinition = "TEXT")
    private String inputData;
    
    @Column(name = "expected_output", columnDefinition = "TEXT", nullable = false)
    private String expectedOutput;
    
    @Column(name = "is_hidden")
    private boolean hidden = false;
    
    @Column(name = "description")
    private String description;
}
