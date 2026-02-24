package com.placementprep.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class JobSearchRequest {
    private String query;
    private String location;
    private String locationType;
    private int limit;
    private boolean remoteOnly;
    
    public JobSearchRequest() {
        this.locationType = "ANY";
        this.limit = 10;
        this.remoteOnly = false;
    }
}
