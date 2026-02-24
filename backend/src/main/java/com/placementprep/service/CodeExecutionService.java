package com.placementprep.service;

import com.placementprep.dto.CodeExecutionRequest;
import com.placementprep.dto.CodeExecutionResponse;
import com.placementprep.model.CodeSubmission;
import com.placementprep.model.CodingProblem;
import com.placementprep.model.TestCase;
import com.placementprep.repository.CodeSubmissionRepository;
import com.placementprep.repository.CodingProblemRepository;
import com.placementprep.repository.TestCaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.*;

@Service
public class CodeExecutionService {
    
    @Autowired
    private CodeSubmissionRepository codeSubmissionRepository;
    
    @Autowired
    private CodingProblemRepository codingProblemRepository;
    
    @Autowired
    private TestCaseRepository testCaseRepository;
    
    private final ExecutorService executor = Executors.newFixedThreadPool(10);
    
    public CodeExecutionResponse executeCode(CodeExecutionRequest request) {
        String language = request.getLanguage().toLowerCase();
        String code = request.getCode();
        String input = request.getInput();
        String expectedOutput = request.getExpectedOutput();
        
        CodeExecutionResponse response = new CodeExecutionResponse();
        
        try {
            switch (language) {
                case "java":
                    response = executeJava(code, input, expectedOutput);
                    break;
                case "python":
                case "python3":
                    response = executePython(code, input, expectedOutput);
                    break;
                case "javascript":
                case "js":
                    response = executeJavaScript(code, input, expectedOutput);
                    break;
                case "cpp":
                case "c++":
                    response = executeCpp(code, input, expectedOutput);
                    break;
                case "c":
                    response = executeC(code, input, expectedOutput);
                    break;
                default:
                    response.setStatus("ERROR");
                    response.setError("Unsupported language: " + language);
            }
        } catch (Exception e) {
            response.setStatus("ERROR");
            response.setError("Execution failed: " + e.getMessage());
        }
        
        saveSubmission(request, response);
        return response;
    }
    
    public CodeExecutionResponse runProblemTests(Long problemId, String code, String language) {
        CodingProblem problem = codingProblemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        
        List<TestCase> testCases = testCaseRepository.findByProblemId(problemId);
        
        int passed = 0;
        int total = testCases.size();
        StringBuilder allOutput = new StringBuilder();
        
        for (TestCase testCase : testCases) {
            CodeExecutionRequest request = new CodeExecutionRequest();
            request.setCode(code);
            request.setLanguage(language);
            request.setInput(testCase.getInputData());
            request.setExpectedOutput(testCase.getExpectedOutput());
            
            CodeExecutionResponse response = executeCode(request);
            
            if (response.isPassed()) {
                passed++;
            }
            
            allOutput.append("Test ").append(passed).append(": ")
                    .append(response.isPassed() ? "PASSED" : "FAILED")
                    .append("\n");
        }
        
        CodeExecutionResponse finalResponse = new CodeExecutionResponse();
        finalResponse.setStatus(passed == total ? "ACCEPTED" : "WRONG_ANSWER");
        finalResponse.setPassed(passed == total);
        finalResponse.setOutput(allOutput.toString());
        finalResponse.setMessage(passed + "/" + total + " test cases passed");
        
        return finalResponse;
    }
    
    private CodeExecutionResponse executeJava(String code, String input, String expectedOutput) throws Exception {
        Path tempDir = Files.createTempDirectory("java_exec");
        Path sourceFile = tempDir.resolve("Main.java");
        Files.write(sourceFile, code.getBytes());
        
        ProcessBuilder compilePb = new ProcessBuilder("javac", sourceFile.toString());
        compilePb.directory(tempDir.toFile());
        Process compileProcess = compilePb.start();
        
        if (!compileProcess.waitFor(30, TimeUnit.SECONDS) || compileProcess.exitValue() != 0) {
            String error = readStream(compileProcess.getErrorStream());
            return createErrorResponse("Compilation Error:\n" + error);
        }
        
        ProcessBuilder runPb = new ProcessBuilder("java", "-cp", tempDir.toString(), "Main");
        return runProcess(runPb, input, expectedOutput, 5);
    }
    
    private CodeExecutionResponse executePython(String code, String input, String expectedOutput) throws Exception {
        Path tempDir = Files.createTempDirectory("python_exec");
        Path sourceFile = tempDir.resolve("script.py");
        Files.write(sourceFile, code.getBytes());
        
        ProcessBuilder pb = new ProcessBuilder("python3", sourceFile.toString());
        return runProcess(pb, input, expectedOutput, 5);
    }
    
    private CodeExecutionResponse executeJavaScript(String code, String input, String expectedOutput) throws Exception {
        Path tempDir = Files.createTempDirectory("js_exec");
        Path sourceFile = tempDir.resolve("script.js");
        
        String wrappedCode = "const readline = require('readline');\n" +
                "const rl = readline.createInterface({ input: process.stdin, output: process.stdout });\n" +
                "let input = '';\n" +
                "rl.on('line', (line) => { input += line + '\\n'; });\n" +
                "rl.on('close', () => {\n" + code + "\n});";
        
        Files.write(sourceFile, wrappedCode.getBytes());
        
        ProcessBuilder pb = new ProcessBuilder("node", sourceFile.toString());
        return runProcess(pb, input, expectedOutput, 5);
    }
    
    private CodeExecutionResponse executeCpp(String code, String input, String expectedOutput) throws Exception {
        Path tempDir = Files.createTempDirectory("cpp_exec");
        Path sourceFile = tempDir.resolve("main.cpp");
        Path outputFile = tempDir.resolve("main");
        Files.write(sourceFile, code.getBytes());
        
        ProcessBuilder compilePb = new ProcessBuilder("g++", "-o", outputFile.toString(), sourceFile.toString());
        Process compileProcess = compilePb.start();
        
        if (!compileProcess.waitFor(30, TimeUnit.SECONDS) || compileProcess.exitValue() != 0) {
            String error = readStream(compileProcess.getErrorStream());
            return createErrorResponse("Compilation Error:\n" + error);
        }
        
        ProcessBuilder runPb = new ProcessBuilder(outputFile.toString());
        return runProcess(runPb, input, expectedOutput, 5);
    }
    
    private CodeExecutionResponse executeC(String code, String input, String expectedOutput) throws Exception {
        Path tempDir = Files.createTempDirectory("c_exec");
        Path sourceFile = tempDir.resolve("main.c");
        Path outputFile = tempDir.resolve("main");
        Files.write(sourceFile, code.getBytes());
        
        ProcessBuilder compilePb = new ProcessBuilder("gcc", "-o", outputFile.toString(), sourceFile.toString());
        Process compileProcess = compilePb.start();
        
        if (!compileProcess.waitFor(30, TimeUnit.SECONDS) || compileProcess.exitValue() != 0) {
            String error = readStream(compileProcess.getErrorStream());
            return createErrorResponse("Compilation Error:\n" + error);
        }
        
        ProcessBuilder runPb = new ProcessBuilder(outputFile.toString());
        return runProcess(runPb, input, expectedOutput, 5);
    }
    
    private CodeExecutionResponse runProcess(ProcessBuilder pb, String input, String expectedOutput, int timeoutSeconds) {
        CodeExecutionResponse response = new CodeExecutionResponse();
        
        try {
            long startTime = System.currentTimeMillis();
            Process process = pb.start();
            
            if (input != null && !input.isEmpty()) {
                try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()))) {
                    writer.write(input);
                    writer.flush();
                }
            }
            
            boolean finished = process.waitFor(timeoutSeconds, TimeUnit.SECONDS);
            long executionTime = System.currentTimeMillis() - startTime;
            
            if (!finished) {
                process.destroyForcibly();
                response.setStatus("TIME_LIMIT_EXCEEDED");
                response.setError("Execution time exceeded " + timeoutSeconds + " seconds");
                response.setExecutionTimeMs((long) timeoutSeconds * 1000);
                return response;
            }
            
            String output = readStream(process.getInputStream());
            String error = readStream(process.getErrorStream());
            
            response.setExecutionTimeMs(executionTime);
            
            if (!error.isEmpty()) {
                response.setStatus("RUNTIME_ERROR");
                response.setError(error);
                response.setOutput(output);
                return response;
            }
            
            response.setOutput(output);
            response.setActualOutput(output.trim());
            
            if (expectedOutput != null) {
                boolean passed = output.trim().equals(expectedOutput.trim());
                response.setPassed(passed);
                response.setExpectedOutput(expectedOutput);
                response.setStatus(passed ? "PASSED" : "FAILED");
                response.setMessage(passed ? "Test case passed!" : "Output doesn't match expected");
            } else {
                response.setStatus("SUCCESS");
                response.setMessage("Code executed successfully");
            }
            
        } catch (Exception e) {
            response.setStatus("ERROR");
            response.setError(e.getMessage());
        }
        
        return response;
    }
    
    private String readStream(InputStream stream) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(stream));
        StringBuilder output = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            output.append(line).append("\n");
        }
        return output.toString().trim();
    }
    
    private CodeExecutionResponse createErrorResponse(String error) {
        CodeExecutionResponse response = new CodeExecutionResponse();
        response.setStatus("ERROR");
        response.setError(error);
        return response;
    }
    
    private void saveSubmission(CodeExecutionRequest request, CodeExecutionResponse response) {
        CodeSubmission submission = new CodeSubmission();
        submission.setCode(request.getCode());
        submission.setLanguage(request.getLanguage());
        submission.setInputData(request.getInput());
        submission.setExpectedOutput(request.getExpectedOutput());
        submission.setActualOutput(response.getActualOutput());
        submission.setStatus(response.getStatus());
        submission.setExecutionTimeMs(response.getExecutionTimeMs());
        submission.setErrorMessage(response.getError());
        
        codeSubmissionRepository.save(submission);
    }
}
