package com.placementprep.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.placementprep.dto.InterviewSearchRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class InterviewSearchService {
    
    @Value("${glassdoor.api.key}")
    private String apiKey;
    
    @Value("${glassdoor.api.host}")
    private String apiHost;
    
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    
    public InterviewSearchService() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }
    
    public JsonNode searchInterviews(InterviewSearchRequest request) {
        try {
            Map<String, String> params = new HashMap<>();
            params.put("company_id", request.getCompanyId());
            params.put("page", request.getPage() != null ? request.getPage() : "1");
            params.put("sort", request.getSort() != null ? request.getSort() : "POPULAR");
            params.put("job_function", request.getJobFunction() != null ? request.getJobFunction() : "ANY");
            params.put("location_type", request.getLocationType() != null ? request.getLocationType() : "ANY");
            params.put("received_offer_only", request.getReceivedOfferOnly() != null ? request.getReceivedOfferOnly() : "false");
            params.put("domain", "www.glassdoor.com");
            
            if (request.getJobTitle() != null && !request.getJobTitle().isEmpty()) {
                params.put("job_title", request.getJobTitle());
            }
            
            if (request.getLocation() != null && !request.getLocation().isEmpty()) {
                params.put("location", request.getLocation());
            }
            
            String queryString = buildQueryString(params);
            String url = "https://" + apiHost + "/company-interviews?" + queryString;
            
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("x-rapidapi-key", apiKey)
                    .header("x-rapidapi-host", apiHost)
                    .header("Accept", "application/json")
                    .GET()
                    .build();
            
            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() == 200) {
                return objectMapper.readTree(response.body());
            } else {
                throw new RuntimeException("API request failed with status: " + response.statusCode());
            }
            
        } catch (Exception e) {
            throw new RuntimeException("Error searching interviews: " + e.getMessage(), e);
        }
    }
    
    private String buildQueryString(Map<String, String> params) {
        StringBuilder queryString = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (queryString.length() > 0) {
                queryString.append("&");
            }
            queryString.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8))
                      .append("=")
                      .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8));
        }
        return queryString.toString();
    }
}
