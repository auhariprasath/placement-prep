package com.placementprep.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class InterviewSearchRequest {
    private String companyId;
    private String page;
    private String sort;
    private String jobFunction;
    private String jobTitle;
    private String location;
    private String locationType;
    private String receivedOfferOnly;
    
    public InterviewSearchRequest() {
        this.page = "1";
        this.sort = "POPULAR";
        this.jobFunction = "ANY";
        this.locationType = "ANY";
        this.receivedOfferOnly = "false";
    }
}
