package com.placementprep.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.placementprep.dto.JobSearchRequest;
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
public class JobSearchService {
    
    @Value("${glassdoor.api.key}")
    private String apiKey;
    
    @Value("${glassdoor.api.host}")
    private String apiHost;
    
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    
    public JobSearchService() {
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();
    }
    
    public JsonNode searchJobs(JobSearchRequest request) {
        try {
            Map<String, String> params = new HashMap<>();
            params.put("query", request.getQuery());
            params.put("location", request.getLocation());
            params.put("location_type", request.getLocationType() != null ? request.getLocationType() : "ANY");
            params.put("limit", String.valueOf(request.getLimit() > 0 ? request.getLimit() : 10));
            params.put("remote_only", String.valueOf(request.isRemoteOnly()));
            params.put("domain", "www.glassdoor.com");
            
            String queryString = buildQueryString(params);
            String url = "https://" + apiHost + "/job-search?" + queryString;
            
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
            throw new RuntimeException("Error searching jobs: " + e.getMessage(), e);
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
