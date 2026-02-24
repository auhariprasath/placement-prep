package com.placementprep.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "agent_interactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgentInteraction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "session_id")
    private String sessionId;
    
    @Column(name = "interaction_type")
    private String interactionType;
    
    @Column(name = "user_message", columnDefinition = "TEXT")
    private String userMessage;
    
    @Column(name = "agent_response", columnDefinition = "TEXT")
    private String agentResponse;
    
    @Column(name = "context", columnDefinition = "TEXT")
    private String context;
    
    @Column(name = "voice_url")
    private String voiceUrl;
    
    @Column(name = "is_voice_mode")
    private boolean voiceMode = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
