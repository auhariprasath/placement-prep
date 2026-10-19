package com.placementprep.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.placementprep.dto.MockInterviewDTOs;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class MockInterviewService {

    @Value("${groq.api.key}")
    private String groqApiKey;

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String MODEL_NAME = "qwen/qwen3.8-27b";

    public MockInterviewService() {
        this.httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .connectTimeout(Duration.ofSeconds(30))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public MockInterviewDTOs.StartResponse startInterview(MultipartFile file, String manualResumeText) throws IOException {
        String resumeText = "";
        if (file != null && !file.isEmpty()) {
            String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
            if (filename.endsWith(".pdf")) {
                resumeText = extractTextFromPDF(file);
            } else {
                resumeText = new String(file.getBytes(), StandardCharsets.UTF_8);
            }
        } else if (manualResumeText != null && !manualResumeText.trim().isEmpty()) {
            resumeText = manualResumeText.trim();
        }

        if (resumeText == null || resumeText.trim().isEmpty()) {
            throw new IllegalArgumentException("Resume content is empty. Please upload a valid resume PDF/file or enter text.");
        }

        System.out.println("--- Extracted Resume Text (Length: " + resumeText.length() + " chars) ---");
        System.out.println(resumeText.substring(0, Math.min(300, resumeText.length())) + "...");

        List<String> questions = generateQuestionsFromGroq(resumeText);
        String sessionId = UUID.randomUUID().toString();

        return new MockInterviewDTOs.StartResponse(sessionId, resumeText, questions);
    }

    public MockInterviewDTOs.EvaluationResponse evaluateInterview(MockInterviewDTOs.EvaluateRequest request) {
        if (request.getQaList() == null || request.getQaList().isEmpty()) {
            throw new IllegalArgumentException("No interview questions and answers provided for evaluation.");
        }

        return evaluateFromGroq(request.getResumeText(), request.getQaList());
    }

    private String extractTextFromPDF(MultipartFile file) throws IOException {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private List<String> generateQuestionsFromGroq(String resumeText) {
        String prompt = "You are an expert technical interviewer conducting a targeted interview.\n"
                + "Analyze the candidate's input text below:\n"
                + "INPUT TEXT: \"" + resumeText + "\"\n\n"
                + "INSPECTION & ADAPTATION RULES:\n"
                + "1. Check if the input is a short topic/skill mention (e.g. 'dsa', 'Java', 'React', 'System Design') OR a complete full resume.\n"
                + "2. IF THE INPUT IS A SHORT TOPIC OR SKILL (e.g. 'dsa', 'Java'):\n"
                + "   - DO NOT ask generic questions about projects or resumes!\n"
                + "   - Generate 5 specific, practical technical interview questions directly testing that specific topic/skill (e.g., for DSA, ask about time complexities, arrays, trees, dynamic programming, space-time trade-offs).\n"
                + "3. IF THE INPUT IS A FULL RESUME:\n"
                + "   - Question 1: Ask about a specific project mentioned on their resume.\n"
                + "   - Question 2: Technical question about their primary language or framework.\n"
                + "   - Question 3: Problem solving / debugging challenge in one of their listed tech stack components.\n"
                + "   - Question 4: System design or database architecture question related to their experience.\n"
                + "   - Question 5: Practical software engineering workflow / experience question.\n\n"
                + "CRITICAL FORMAT INSTRUCTIONS:\n"
                + "Return ONLY a JSON array containing exactly 5 string questions. Do NOT include markdown outside JSON or extra text.\n"
                + "Example output:\n"
                + "[\"Question 1\", \"Question 2\", \"Question 3\", \"Question 4\", \"Question 5\"]";

        try {
            String responseText = callGroqAPI(prompt);
            String jsonArrayStr = cleanJsonResponse(responseText);

            // Extract JSON array using regex if necessary
            Pattern pattern = Pattern.compile("\\[.*\\]", Pattern.DOTALL);
            Matcher matcher = pattern.matcher(jsonArrayStr);
            if (matcher.find()) {
                jsonArrayStr = matcher.group(0);
            }

            JsonNode root = objectMapper.readTree(jsonArrayStr);
            List<String> questions = new ArrayList<>();
            if (root.isArray()) {
                for (JsonNode node : root) {
                    String qStr = node.asText().trim();
                    if (!qStr.isEmpty()) {
                        questions.add(qStr);
                    }
                }
            }

            if (questions.size() >= 3) {
                return questions;
            }
        } catch (Exception e) {
            System.err.println("Error generating interview questions: " + e.getMessage());
            e.printStackTrace();
        }

        // Topic-aware fallback if API parsing fails
        String cleanInput = resumeText.toLowerCase().trim();
        if (cleanInput.contains("dsa") || cleanInput.contains("data structure") || cleanInput.contains("algorithm")) {
            return List.of(
                "What is the difference between an Array and a Linked List, and when would you choose one over the other?",
                "How does a Hash Map handle collisions under the hood, and what is its average vs worst-case time complexity?",
                "Can you explain the dynamic programming approach and how memoization differs from tabulation?",
                "How would you detect a cycle in a directed graph using DFS or Kahn's algorithm?",
                "What is the space-time trade-off when using Binary Search vs Linear Search on large datasets?"
            );
        }

        return List.of(
            "Can you explain your technical background and experience in " + resumeText + "?",
            "What are the core fundamentals and architectural principles of " + resumeText + "?",
            "Describe a complex technical challenge you faced when working with " + resumeText + " and how you solved it.",
            "How do you optimize performance and efficiency when building solutions in " + resumeText + "?",
            "What best practices do you follow for unit testing and debugging when developing with " + resumeText + "?"
        );
    }

    private MockInterviewDTOs.EvaluationResponse evaluateFromGroq(String resumeText, List<MockInterviewDTOs.QAItem> qaList) {
        StringBuilder qaBuilder = new StringBuilder();
        int answeredCount = 0;
        int totalQuestions = qaList.size();

        for (MockInterviewDTOs.QAItem item : qaList) {
            String ans = item.getUserAnswer() != null ? item.getUserAnswer().trim() : "";
            boolean isAnswered = !ans.isEmpty() && !ans.equalsIgnoreCase("[No Answer Provided]") && ans.length() > 2;
            if (isAnswered) {
                answeredCount++;
            }

            qaBuilder.append("Question ").append(item.getQuestionNumber()).append(": ").append(item.getQuestion()).append("\n");
            qaBuilder.append("Candidate Answer: ").append(isAnswered ? ans : "[UNANSWERED / NO RESPONSE]").append("\n\n");
        }

        String prompt = "You are a strict, fair, and expert technical interviewer evaluating a candidate's mock interview performance.\n\n"
                + "CANDIDATE RESUME:\n" + resumeText + "\n\n"
                + "INTERVIEW TRANSCRIPT:\n" + qaBuilder.toString() + "\n"
                + "EVALUATION RULES & SCORING GUIDELINES:\n"
                + "1. STRICT SCORING: If an answer is '[UNANSWERED / NO RESPONSE]', empty, gibberish, or 1-word non-answers, score that question EXACTLY 0 out of 10 and mark feedback as 'No answer provided. Candidate failed to respond.'\n"
                + "2. If ALL questions are unanswered, overallScore MUST BE 0 and hiringRecommendation MUST BE 'Needs Improvement'.\n"
                + "3. Evaluate valid answers based on accuracy, technical depth, relevance to the candidate's resume, and structure.\n"
                + "4. Overall score should be a realistic percentage (0 to 100) reflecting answered ratio and quality.\n\n"
                + "CRITICAL FORMAT INSTRUCTIONS:\n"
                + "Return ONLY a valid JSON object matching this structure (no markdown, no comments, no extra text):\n"
                + "{\n"
                + "  \"overallScore\": 0,\n"
                + "  \"summary\": \"Concise overall summary of performance.\",\n"
                + "  \"strengths\": [\"Strength 1\", \"Strength 2\"],\n"
                + "  \"areasForImprovement\": [\"Improvement 1\", \"Improvement 2\"],\n"
                + "  \"hiringRecommendation\": \"Strong Hire / Hire / Re-evaluate / Needs Improvement\",\n"
                + "  \"questionEvaluations\": [\n"
                + "    {\n"
                + "      \"questionNumber\": 1,\n"
                + "      \"question\": \"Question text\",\n"
                + "      \"userAnswer\": \"Candidate answer\",\n"
                + "      \"score\": 0,\n"
                + "      \"feedback\": \"Detailed feedback\",\n"
                + "      \"idealAnswer\": \"Ideal answer benchmark\"\n"
                + "    }\n"
                + "  ]\n"
                + "}";

        try {
            String responseText = callGroqAPI(prompt);
            String jsonStr = cleanJsonResponse(responseText);

            // Extract JSON object using regex if necessary
            Pattern pattern = Pattern.compile("\\{.*\\}", Pattern.DOTALL);
            Matcher matcher = pattern.matcher(jsonStr);
            if (matcher.find()) {
                jsonStr = matcher.group(0);
            }

            return objectMapper.readValue(jsonStr, MockInterviewDTOs.EvaluationResponse.class);
        } catch (Exception e) {
            System.err.println("Error evaluating mock interview via Groq: " + e.getMessage());
            e.printStackTrace();

            // Dynamic fallback based on actual answered questions ratio
            int calculatedScore = totalQuestions > 0 ? (int) Math.round(((double) answeredCount / totalQuestions) * 70) : 0;
            String rec = calculatedScore >= 75 ? "Hire" : calculatedScore >= 50 ? "Re-evaluate" : "Needs Improvement";

            MockInterviewDTOs.EvaluationResponse fallback = new MockInterviewDTOs.EvaluationResponse();
            fallback.setOverallScore(calculatedScore);
            fallback.setSummary(answeredCount > 0 
                ? "Candidate answered " + answeredCount + " out of " + totalQuestions + " questions." 
                : "No responses were provided by the candidate during the interview session.");
            fallback.setStrengths(answeredCount > 0 ? List.of("Attempted questions") : List.of("Completed setup"));
            fallback.setAreasForImprovement(List.of("Ensure all questions are answered in detail", "Use technical examples from projects"));
            fallback.setHiringRecommendation(rec);

            List<MockInterviewDTOs.QuestionEvaluation> qEvals = new ArrayList<>();
            for (MockInterviewDTOs.QAItem item : qaList) {
                String ans = item.getUserAnswer() != null ? item.getUserAnswer().trim() : "";
                boolean isAns = !ans.isEmpty() && !ans.equalsIgnoreCase("[No Answer Provided]") && ans.length() > 2;

                MockInterviewDTOs.QuestionEvaluation qe = new MockInterviewDTOs.QuestionEvaluation();
                qe.setQuestionNumber(item.getQuestionNumber());
                qe.setQuestion(item.getQuestion());
                qe.setUserAnswer(isAns ? ans : "No Answer Provided");
                qe.setScore(isAns ? 7 : 0);
                qe.setFeedback(isAns ? "Answer provided basic information." : "Question was left unanswered.");
                qe.setIdealAnswer("An ideal response clearly explains architectural decisions, technical choices, and practical outcomes.");
                qEvals.add(qe);
            }
            fallback.setQuestionEvaluations(qEvals);
            return fallback;
        }
    }

    private String callGroqAPI(String prompt) throws Exception {
        Map<String, Object> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", prompt);

        Map<String, Object> requestBodyMap = new HashMap<>();
        requestBodyMap.put("model", MODEL_NAME);
        requestBodyMap.put("messages", Collections.singletonList(userMsg));
        requestBodyMap.put("temperature", 0.3); // Lower temperature for structured JSON accuracy

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

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            JsonNode root = objectMapper.readTree(response.body());
            JsonNode choices = root.path("choices");
            if (choices.isArray() && choices.size() > 0) {
                return choices.get(0).path("message").path("content").asText();
            }
            throw new RuntimeException("Groq returned 200 but no choices were generated.");
        } else {
            throw new RuntimeException("Groq API Error (HTTP " + response.statusCode() + "): " + response.body());
        }
    }

    private String cleanJsonResponse(String raw) {
        if (raw == null) return "";
        String trimmed = raw.trim();

        // Remove markdown code blocks ```json ... ```
        if (trimmed.startsWith("```json")) {
            trimmed = trimmed.substring(7);
        } else if (trimmed.startsWith("```")) {
            trimmed = trimmed.substring(3);
        }
        if (trimmed.endsWith("```")) {
            trimmed = trimmed.substring(0, trimmed.length() - 3);
        }

        // Remove single line JSON comments // ...
        trimmed = trimmed.replaceAll("(?m)^\\s*//.*$", "");
        trimmed = trimmed.replaceAll("//.*$", "");

        return trimmed.trim();
    }
}
