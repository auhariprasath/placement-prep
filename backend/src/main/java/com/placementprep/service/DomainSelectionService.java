package com.placementprep.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.placementprep.dto.DomainSelectionRequest;
import com.placementprep.dto.DomainSelectionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class DomainSelectionService {

    @Value("${groq.api.key}")
    private String groqApiKey;

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL_NAME = "qwen/qwen3.8-27b";

    public DomainSelectionService() {
        this.httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .connectTimeout(Duration.ofSeconds(30))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public DomainSelectionResponse predictDomain(DomainSelectionRequest request) {
        String userInput = request != null && request.getUserInput() != null ? request.getUserInput().trim() : "";
        if (userInput.isEmpty()) {
            userInput = "I have a strong interest in writing programs, solving logical problems, and building web applications.";
        }

        try {
            DomainSelectionResponse response = predictDomainFromGroq(userInput);
            sanitizeAndEnhanceResponse(response, userInput);
            return response;
        } catch (Exception e) {
            System.err.println("Error predicting domain via Groq: " + e.getMessage());
            e.printStackTrace();
            return getFallbackResponse(userInput);
        }
    }

    private DomainSelectionResponse predictDomainFromGroq(String userInput) throws Exception {
        String prompt = "You are a senior engineering admissions and placement advisor with expertise in course mapping.\n"
                + "Read the candidate's statement describing their interests, passion, and career goals:\n"
                + "USER STATEMENT: \"" + userInput + "\"\n\n"
                + "CRITICAL MATCHING GUIDELINES:\n"
                + "- Analyze ALL keywords in the user's statement carefully before picking a branch.\n"
                + "- If the user mentions a combination of Computer/Programming AND Business/Economics/Management/Finance, recommend 'Computer Science and Business Systems (CSBS)' or 'FinTech Engineering'. DO NOT default to generic CSE!\n"
                + "- If the user mentions Data Science / Statistics / Analytics alongside AI, prefer 'Artificial Intelligence and Data Science (AI & DS)' or 'Data Science'.\n"
                + "- Match interdisciplinary interests accurately to specialized branches in the list.\n\n"
                + "STRICT REQUIREMENT FOR RECOMMENDED DOMAIN:\n"
                + "You MUST choose the recommendedDomain EXACTLY as written from one of the following official 13 engineering degree branches:\n\n"
                + "1. B.E. Civil Engineering\n"
                + "2. B.E. Computer Science and Engineering (CSE)\n"
                + "3. B.E. Computer Science and Engineering (AR/VR and Media Design)\n"
                + "4. B.E. Electrical and Electronics Engineering (EEE)\n"
                + "5. B.E. Electronics and Communication Engineering (ECE)\n"
                + "6. B.E. Electronics and Communication Engineering (Advanced Communication Technology)\n"
                + "7. B.E. Electronics Engineering (VLSI Design and Technology)\n"
                + "8. B.E. Electronics and Instrumentation Engineering (EIE)\n"
                + "9. B.E. Mechanical Engineering\n"
                + "10. B.E. Computer Science and Engineering (Artificial Intelligence)\n"
                + "11. B.E. Computer Science and Engineering and Business Systems (CSBS)\n"
                + "12. B.Tech. Artificial Intelligence and Data Science (AI & DS)\n"
                + "13. B.Tech. Information Technology (IT)\n\n"
                + "DO NOT recommend any branch outside this list of 13.\n\n"
                + "TASK:\n"
                + "1. Select the SINGLE best matching engineering branch from the 13 listed above.\n"
                + "2. Provide a clear 2-3 sentence explanation of WHY this engineering domain fits their expressed interests.\n"
                + "3. Identify EXACTLY 4 core engineering subjects in that branch essential for university semester exams and placement interviews.\n"
                + "4. For EACH of the 4 subjects, recommend a high-quality educational demo video with title, channel name, and YouTube URL.\n\n"
                + "RETURN FORMAT (ONLY VALID JSON, NO MARKDOWN, NO COMMENTS):\n"
                + "{\n"
                + "  \"recommendedDomain\": \"Computer Science and Business Systems (CSBS)\",\n"
                + "  \"confidenceScore\": 96.0,\n"
                + "  \"description\": \"Combines core computer science with business strategy, financial management, and enterprise systems.\",\n"
                + "  \"fitReason\": \"Your combined interest in computing, economics, and management aligns perfectly with Computer Science and Business Systems (CSBS).\",\n"
                + "  \"importantSubjects\": []\n"
                + "}";

        String rawResponse = callGroqAPI(prompt);
        String jsonStr = cleanJsonResponse(rawResponse);

        Pattern pattern = Pattern.compile("\\{.*\\}", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(jsonStr);
        if (matcher.find()) {
            jsonStr = matcher.group(0);
        }

        return objectMapper.readValue(jsonStr, DomainSelectionResponse.class);
    }

    private void sanitizeAndEnhanceResponse(DomainSelectionResponse response, String userInput) {
        if (response == null) return;

        // Ensure valid domain string
        String domain = response.getRecommendedDomain();
        if (domain == null || domain.trim().isEmpty()) {
            response.setRecommendedDomain("Computer Science and Engineering (CSE)");
        }

        // Ensure importantSubjects has 4 valid subjects with valid video links
        if (response.getImportantSubjects() == null || response.getImportantSubjects().isEmpty()) {
            response.setImportantSubjects(getFallbackSubjects());
        } else {
            for (DomainSelectionResponse.SubjectRecommendation sub : response.getImportantSubjects()) {
                if (sub.getVideoUrl() == null || sub.getVideoUrl().trim().isEmpty() || !sub.getVideoUrl().contains("youtube")) {
                    sub.setVideoUrl("https://www.youtube.com/results?search_query=" + UriEncoderUtil.encode(sub.getSubjectName() + " full course tutorial"));
                }
                if (sub.getVideoTitle() == null || sub.getVideoTitle().trim().isEmpty()) {
                    sub.setVideoTitle(sub.getSubjectName() + " Full Course & Exam Preparation");
                }
                if (sub.getVideoChannel() == null || sub.getVideoChannel().trim().isEmpty()) {
                    sub.setVideoChannel("YouTube Engineering Tutorial");
                }
            }
        }
    }

    private String callGroqAPI(String prompt) throws Exception {
        Map<String, Object> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", prompt);

        Map<String, Object> requestBodyMap = new HashMap<>();
        requestBodyMap.put("model", MODEL_NAME);
        requestBodyMap.put("messages", Collections.singletonList(userMsg));
        requestBodyMap.put("temperature", 0.1);
        requestBodyMap.put("max_tokens", 600);

        String requestJson = objectMapper.writeValueAsString(requestBodyMap);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(GROQ_API_URL))
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .header("Authorization", "Bearer " + groqApiKey)
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                .timeout(Duration.ofSeconds(60))
                .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                .build();

        int maxRetries = 3;
        long backoffMs = 2000;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode choices = root.path("choices");
                if (choices.isArray() && choices.size() > 0) {
                    return choices.get(0).path("message").path("content").asText();
                }
                throw new RuntimeException("Groq returned 200 but no choices were generated.");
            } else if (response.statusCode() == 429 && attempt < maxRetries) {
                System.out.println("Groq Rate Limit (429) hit. Retrying in " + backoffMs + "ms... (Attempt " + attempt + ")");
                Thread.sleep(backoffMs);
                backoffMs *= 2;
            } else {
                throw new RuntimeException("Groq API Error (HTTP " + response.statusCode() + "): " + response.body());
            }
        }
        throw new RuntimeException("Groq API call failed after retries.");
    }

    private String cleanJsonResponse(String raw) {
        if (raw == null) return "";
        String trimmed = raw.trim();
        if (trimmed.startsWith("```json")) {
            trimmed = trimmed.substring(7);
        } else if (trimmed.startsWith("```")) {
            trimmed = trimmed.substring(3);
        }
        if (trimmed.endsWith("```")) {
            trimmed = trimmed.substring(0, trimmed.length() - 3);
        }
        trimmed = trimmed.replaceAll("(?m)^\\s*//.*$", "");
        return trimmed.trim();
    }

    private DomainSelectionResponse getFallbackResponse(String userInput) {
        DomainSelectionResponse response = new DomainSelectionResponse();
        response.setRecommendedDomain("B.Tech in Computer Science and Engineering");
        response.setConfidenceScore(95.0);
        response.setDescription("B.Tech in Computer Science and Engineering focuses on software engineering, algorithm design, computing systems, and full-stack development.");
        response.setFitReason("Based on your input ('" + userInput + "'), you show a strong affinity for programming, logical problem solving, and building software solutions.");
        response.setImportantSubjects(getFallbackSubjects());
        return response;
    }

    private List<DomainSelectionResponse.SubjectRecommendation> getFallbackSubjects() {
        return List.of(
            new DomainSelectionResponse.SubjectRecommendation(
                "Data Structures & Algorithms",
                "Fundamental core subject for mastering problem-solving and clearing technical placement interviews.",
                "Arrays, Linked Lists, Trees, Graphs, Dynamic Programming, Sorting",
                "Data Structures and Algorithms for Beginners",
                "https://www.youtube.com/watch?v=8hly31xKLI0",
                "freeCodeCamp.org"
            ),
            new DomainSelectionResponse.SubjectRecommendation(
                "Database Management Systems (DBMS)",
                "Teaches data organization, SQL querying, transactions, and relational database management.",
                "SQL Queries, ER Diagrams, Normalization, Indexing, ACID Properties",
                "DBMS Complete Course for Placements",
                "https://www.youtube.com/watch?v=dl00fOOYLOM",
                "Gate Smashers"
            ),
            new DomainSelectionResponse.SubjectRecommendation(
                "Operating Systems",
                "Covers how software interacts with system hardware, process scheduling, and memory.",
                "Processes & Threads, CPU Scheduling, Deadlocks, Virtual Memory, File Systems",
                "Operating Systems Full Course",
                "https://www.youtube.com/watch?v=bkWHS474qHw",
                "Gate Smashers"
            ),
            new DomainSelectionResponse.SubjectRecommendation(
                "Computer Networks",
                "Explores network protocols, OSI model, packet routing, and web communications.",
                "OSI Model, TCP/IP, IP Addressing, HTTP/HTTPS, Routing Protocols",
                "Computer Networks Course for Beginners",
                "https://www.youtube.com/watch?v=IPvYjXCsTg8",
                "freeCodeCamp.org"
            )
        );
    }

    private static class UriEncoderUtil {
        public static String encode(String value) {
            try {
                return java.net.URLEncoder.encode(value, "UTF-8");
            } catch (Exception e) {
                return value;
            }
        }
    }
}
