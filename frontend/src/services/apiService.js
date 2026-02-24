import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiService = {
  // Domain Selection
  predictDomain: (data) => {
    return apiClient.post('/domain/predict', data);
  },

  // Job Search
  searchJobs: (data) => {
    return apiClient.post('/jobs/search', data);
  },

  // Interview Search
  searchInterviews: (data) => {
    return apiClient.post('/interviews/search', data);
  },

  // Resume Builder
  generateResume: (data) => {
    return apiClient.post('/resume/generate', data, {
      responseType: 'blob'
    });
  },

  previewResume: (data) => {
    return apiClient.post('/resume/preview', data);
  },

  // Study Planner
  generateStudyPlan: (data) => {
    return apiClient.post('/study-planner/generate', data);
  },

  // Forum
  getForumPosts: (page = 0, size = 10) => {
    return apiClient.get(`/forum/posts?page=${page}&size=${size}`);
  },

  getForumPost: (postId) => {
    return apiClient.get(`/forum/posts/${postId}`);
  },

  createForumPost: (data) => {
    return apiClient.post(`/forum/posts?userId=${data.userId}`, data);
  },

  searchForumPosts: (keyword, page = 0, size = 10) => {
    return apiClient.get(`/forum/posts/search?keyword=${keyword}&page=${page}&size=${size}`);
  },

  addForumComment: (postId, userId, data) => {
    return apiClient.post(`/forum/posts/${postId}/comments?userId=${userId}`, data);
  },

  upvoteForumPost: (postId) => {
    return apiClient.post(`/forum/posts/${postId}/upvote`);
  },

  // Chat
  sendMessage: (senderId, receiverId, content) => {
    return apiClient.post(`/chat/send?senderId=${senderId}&receiverId=${receiverId}&content=${content}`);
  },

  getConversation: (userId1, userId2) => {
    return apiClient.get(`/chat/conversation?userId1=${userId1}&userId2=${userId2}`);
  },

  getUnreadMessages: (userId) => {
    return apiClient.get(`/chat/unread?userId=${userId}`);
  },

  // Blog
  getBlogPosts: (page = 0, size = 10) => {
    return apiClient.get(`/blog/posts?page=${page}&size=${size}`);
  },

  getBlogPost: (postId) => {
    return apiClient.get(`/blog/posts/${postId}`);
  },

  createBlogPost: (data) => {
    return apiClient.post(`/blog/posts?userId=${data.userId}`, data);
  },

  searchBlogPosts: (keyword, page = 0, size = 10) => {
    return apiClient.get(`/blog/posts/search?keyword=${keyword}&page=${page}&size=${size}`);
  },

  likeBlogPost: (postId) => {
    return apiClient.post(`/blog/posts/${postId}/like`);
  },

  // Resume Matcher
  analyzeResume: (formData) => {
    return apiClient.post('/resume-matcher/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  analyzeResumeText: (data) => {
    return apiClient.post('/resume-matcher/analyze-text', data);
  },

  // Online Compiler
  executeCode: (data) => {
    return apiClient.post('/compiler/execute', data);
  },

  runProblemTests: (problemId, data) => {
    return apiClient.post(`/compiler/run-tests/${problemId}`, data);
  },

  // AI Agent
  agentInteract: (data) => {
    return apiClient.post('/agent/interact', data);
  },

  getAgentHistory: (userId, sessionId) => {
    return apiClient.get(`/agent/history?userId=${userId}&sessionId=${sessionId}`);
  },

  // Health Check
  healthCheck: () => {
    return apiClient.get('/health');
  }
};

export default apiService;
