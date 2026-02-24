package com.placementprep.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgentInteractionResponse {
    private String response;
    private String voiceUrl;
    private String sessionId;
    private String context;
    private boolean voiceMode;
    private String suggestedActions;
    private String redirectPath;
}
