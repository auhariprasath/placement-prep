# Placement Prep - Full Stack Application

A comprehensive placement preparation platform built with **React.js** frontend, **Spring Boot** backend, and **MySQL** database.

## Features

1. **Domain Selection** - AI-powered career domain recommendation using Logistic Regression
2. **Job Search** - Search jobs from Glassdoor with advanced filters
3. **Interview Questions** - Access real interview experiences from top companies
4. **Resume Builder** - Create and download professional resumes as PDF
5. **ATS Checker** - Resume matcher to check compatibility with job descriptions
6. **Study Planner** - Personalized study plans powered by Gemini AI
7. **Online Compiler** - Write, run, and test code with custom inputs
8. **Community Forum** - Ask questions and connect with fellow students
9. **Placement Stories** - Share and read placement experiences
10. **AI Assistant** - Chat and voice interaction for placement guidance

## Tech Stack

- **Frontend**: React.js
- **Backend**: Spring Boot (Java 17)
- **Database**: MySQL
- **Build Tool**: Maven

## Project Structure

```
placement-prep-app/
├── backend/                 # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/placementprep/
│   │   │   │   ├── config/       # Configuration classes
│   │   │   │   ├── controller/   # REST API controllers
│   │   │   │   ├── dto/          # Data Transfer Objects
│   │   │   │   ├── model/        # JPA Entities
│   │   │   │   ├── repository/   # JPA Repositories
│   │   │   │   ├── service/      # Business logic
│   │   │   │   └── PlacementPrepApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
└── frontend/                # React Frontend
    ├── public/
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── pages/          # Page components
    │   ├── services/       # API services
    │   ├── styles/         # CSS files
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Node.js 16+
- npm or yarn
- (Optional) Docker for code execution isolation

## Setup Instructions

### 1. Database Setup

```sql
-- Create database
CREATE DATABASE placement_prep_db;

-- Create user (optional, or use root)
CREATE USER 'placementuser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON placement_prep_db.* TO 'placementuser'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Update `src/main/resources/application.properties` with your database credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/placement_prep_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
```

3. Build and run the Spring Boot application:
```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## API Endpoints

### Domain Selection
- `POST /api/domain/predict` - Get domain recommendation based on interests and skills

### Job Search
- `POST /api/jobs/search` - Search jobs with filters
- `GET /api/jobs/search` - Search jobs with query params

### Interview Search
- `POST /api/interviews/search` - Search interview experiences
- `GET /api/interviews/search` - Search interviews with query params

### Resume Builder
- `POST /api/resume/generate` - Generate and download resume PDF
- `POST /api/resume/preview` - Preview resume text

### Resume Matcher (ATS Checker)
- `POST /api/resume-matcher/analyze` - Analyze resume against job description (multipart)
- `POST /api/resume-matcher/analyze-text` - Analyze resume text

### Study Planner
- `POST /api/study-planner/generate` - Generate personalized study plan
- `GET /api/study-planner/generate` - Generate study plan with query params

### Online Compiler
- `POST /api/compiler/execute` - Execute code with input/output
- `POST /api/compiler/run-tests/{problemId}` - Run code against test cases

### Community Forum
- `GET /api/forum/posts` - Get all forum posts
- `POST /api/forum/posts` - Create new forum post
- `GET /api/forum/posts/{postId}` - Get post by ID
- `POST /api/forum/posts/{postId}/comments` - Add comment to post
- `GET /api/forum/posts/search` - Search forum posts
- `POST /api/forum/posts/{postId}/upvote` - Upvote a post
- `POST /api/forum/posts/{postId}/resolve` - Mark post as resolved
- `POST /api/forum/comments/{commentId}/accept` - Accept answer

### Chat/Messaging
- `POST /api/chat/send` - Send message
- `GET /api/chat/conversation` - Get conversation between users
- `GET /api/chat/unread` - Get unread messages
- `GET /api/chat/unread/count` - Get unread message count
- `POST /api/chat/read/{messageId}` - Mark message as read

### Blog (Placement Stories)
- `GET /api/blog/posts` - Get all blog posts
- `POST /api/blog/posts` - Create new blog post
- `GET /api/blog/posts/{postId}` - Get post by ID
- `POST /api/blog/posts/{postId}/comments` - Add comment
- `GET /api/blog/posts/search` - Search blog posts
- `POST /api/blog/posts/{postId}/like` - Like a post

### AI Agent
- `POST /api/agent/interact` - Interact with AI assistant
- `GET /api/agent/history` - Get chat history
- `POST /api/agent/interview-prep` - Get interview preparation help
- `POST /api/agent/resume-help` - Get resume help
- `POST /api/agent/coding-help` - Get coding help
- `POST /api/agent/career-guidance` - Get career guidance

### Health Check
- `GET /api/health` - Check application health

## API Keys

The application uses external APIs for job search and AI features. You need to obtain your own API keys:

1. **Glassdoor API** (via RapidAPI) - For job search and interview data
2. **Gemini API** - For AI-powered study plans and agent interactions

**Note**: Add your keys to `backend/src/main/resources/application.properties`. In production, always store API keys as environment variables.

## Usage Guide

### Domain Selection
1. Navigate to "Domain Selection" page
2. Check your interests (Coding, Math, Design, etc.)
3. Select your skills (Problem Solving, Communication, etc.)
4. Choose work preferences
5. Click "Get My Domain Recommendation"

### Job Search
1. Navigate to "Job Search" page
2. Enter job role (e.g., "Software Engineer")
3. Enter location
4. Select filters (Location Type, Remote Only)
5. Click "Search Jobs"

### Interview Questions
1. Navigate to "Interviews" page
2. Enter company name or ID (e.g., "Amazon" or "1138")
3. Optionally filter by job title, location
4. Select sort order
5. Click "Search Interviews"

### Resume Builder
1. Navigate to "Resume Builder" page
2. Fill in personal information
3. Add education details
4. Add work experience with responsibilities
5. Add skills, projects, and certifications
6. Click "Download Resume PDF"

### ATS Checker (Resume Matcher)
1. Navigate to "ATS Checker" page
2. Upload your resume (PDF)
3. Paste the job description
4. Click "Analyze Resume"
5. Review the score and suggestions

### Study Planner
1. Navigate to "Study Planner" page
2. Enter subject name
3. Set duration (days) and hours per day
4. Select difficulty level
5. Optionally add target goal
6. Click "Generate Study Plan"

### Online Compiler
1. Navigate to "Compiler" page
2. Select programming language
3. Write your code
4. Enter input (optional)
5. Enter expected output (optional, for verification)
6. Click "Run Code"

### Community Forum
1. Navigate to "Community" page
2. Browse existing discussions or search
3. Click "New Discussion" to ask a question
4. Upvote helpful posts
5. Comment to help others

### Placement Stories (Blog)
1. Navigate to "Stories" page
2. Read experiences from others
3. Click "Share Your Story" to add your own
4. Filter by category or company

### AI Assistant
1. Navigate to "AI Assistant" page
2. Type your question or use quick actions
3. Enable voice mode for voice interaction
4. Get personalized guidance for:
   - Interview preparation
   - Resume improvement
   - Coding help
   - Career guidance

## Building for Production

### Backend
```bash
cd backend
mvn clean package
```
The JAR file will be in `target/placement-prep-backend-1.0.0.jar`

Run the JAR:
```bash
java -jar target/placement-prep-backend-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
```
The production build will be in the `build/` directory

## Environment Variables

Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:8080/api
```

For production deployment, update the API URL accordingly.

## Troubleshooting

### Backend Issues

1. **Database connection failed**
   - Check MySQL is running
   - Verify database credentials in `application.properties`
   - Ensure database `placement_prep_db` exists

2. **Port 8080 already in use**
   - Change port in `application.properties`: `server.port=8081`

3. **Code execution not working**
   - Ensure Java, Python, Node.js, GCC are installed on the server
   - For production, consider using Docker for code isolation

### Frontend Issues

1. **CORS errors**
   - Ensure backend CORS configuration allows frontend origin
   - Check `cors.allowed-origins` in `application.properties`

2. **API not found**
   - Verify backend is running
   - Check `REACT_APP_API_URL` environment variable

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and feature requests, please create an issue in the repository.
