package com.placementprep.dto;

import java.util.List;

public class MockInterviewDTOs {

    public static class StartResponse {
        private String sessionId;
        private String resumeText;
        private List<String> questions;

        public StartResponse() {}

        public StartResponse(String sessionId, String resumeText, List<String> questions) {
            this.sessionId = sessionId;
            this.resumeText = resumeText;
            this.questions = questions;
        }

        public String getSessionId() { return sessionId; }
        public void setSessionId(String sessionId) { this.sessionId = sessionId; }

        public String getResumeText() { return resumeText; }
        public void setResumeText(String resumeText) { this.resumeText = resumeText; }

        public List<String> getQuestions() { return questions; }
        public void setQuestions(List<String> questions) { this.questions = questions; }
    }

    public static class QAItem {
        private int questionNumber;
        private String question;
        private String userAnswer;

        public QAItem() {}

        public int getQuestionNumber() { return questionNumber; }
        public void setQuestionNumber(int questionNumber) { this.questionNumber = questionNumber; }

        public String getQuestion() { return question; }
        public void setQuestion(String question) { this.question = question; }

        public String getUserAnswer() { return userAnswer; }
        public void setUserAnswer(String userAnswer) { this.userAnswer = userAnswer; }
    }

    public static class EvaluateRequest {
        private String sessionId;
        private String resumeText;
        private List<QAItem> qaList;

        public EvaluateRequest() {}

        public String getSessionId() { return sessionId; }
        public void setSessionId(String sessionId) { this.sessionId = sessionId; }

        public String getResumeText() { return resumeText; }
        public void setResumeText(String resumeText) { this.resumeText = resumeText; }

        public List<QAItem> getQaList() { return qaList; }
        public void setQaList(List<QAItem> qaList) { this.qaList = qaList; }
    }

    public static class QuestionEvaluation {
        private int questionNumber;
        private String question;
        private String userAnswer;
        private int score;
        private String feedback;
        private String idealAnswer;

        public QuestionEvaluation() {}

        public int getQuestionNumber() { return questionNumber; }
        public void setQuestionNumber(int questionNumber) { this.questionNumber = questionNumber; }

        public String getQuestion() { return question; }
        public void setQuestion(String question) { this.question = question; }

        public String getUserAnswer() { return userAnswer; }
        public void setUserAnswer(String userAnswer) { this.userAnswer = userAnswer; }

        public int getScore() { return score; }
        public void setScore(int score) { this.score = score; }

        public String getFeedback() { return feedback; }
        public void setFeedback(String feedback) { this.feedback = feedback; }

        public String getIdealAnswer() { return idealAnswer; }
        public void setIdealAnswer(String idealAnswer) { this.idealAnswer = idealAnswer; }
    }

    public static class EvaluationResponse {
        private int overallScore;
        private String summary;
        private List<String> strengths;
        private List<String> areasForImprovement;
        private String hiringRecommendation;
        private List<QuestionEvaluation> questionEvaluations;

        public EvaluationResponse() {}

        public int getOverallScore() { return overallScore; }
        public void setOverallScore(int overallScore) { this.overallScore = overallScore; }

        public String getSummary() { return summary; }
        public void setSummary(String summary) { this.summary = summary; }

        public List<String> getStrengths() { return strengths; }
        public void setStrengths(List<String> strengths) { this.strengths = strengths; }

        public List<String> getAreasForImprovement() { return areasForImprovement; }
        public void setAreasForImprovement(List<String> areasForImprovement) { this.areasForImprovement = areasForImprovement; }

        public String getHiringRecommendation() { return hiringRecommendation; }
        public void setHiringRecommendation(String hiringRecommendation) { this.hiringRecommendation = hiringRecommendation; }

        public List<QuestionEvaluation> getQuestionEvaluations() { return questionEvaluations; }
        public void setQuestionEvaluations(List<QuestionEvaluation> questionEvaluations) { this.questionEvaluations = questionEvaluations; }
    }
}
