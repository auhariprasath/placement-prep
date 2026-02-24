package com.placementprep.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgentInteractionRequest {
    private String message;
    private String sessionId;
    private String context;
    private boolean voiceMode;
    private String interactionType;
}
