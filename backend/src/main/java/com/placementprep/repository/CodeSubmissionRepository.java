package com.placementprep.repository;

import com.placementprep.model.CodeSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodeSubmissionRepository extends JpaRepository<CodeSubmission, Long> {
    
    List<CodeSubmission> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<CodeSubmission> findByUserIdAndProblemIdOrderByCreatedAtDesc(Long userId, Long problemId);
    
    List<CodeSubmission> findByProblemIdAndStatusOrderByCreatedAtDesc(Long problemId, String status);
}
