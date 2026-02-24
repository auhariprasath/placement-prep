package com.placementprep.repository;

import com.placementprep.model.AgentInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgentInteractionRepository extends JpaRepository<AgentInteraction, Long> {
    
    List<AgentInteraction> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<AgentInteraction> findBySessionIdOrderByCreatedAtAsc(String sessionId);
    
    List<AgentInteraction> findTop20ByUserIdOrderByCreatedAtDesc(Long userId);
}
