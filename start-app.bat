@echo off
chcp 65001 >nul
echo ======================================
echo   Placement Prep Application
echo ======================================
echo.

REM Check prerequisites
echo Checking prerequisites...

java -version >nul 2>&1
if errorlevel 1 (
    echo Error: Java is not installed. Please install Java 17 or higher.
    exit /b 1
)

mvn -version >nul 2>&1
if errorlevel 1 (
    echo Error: Maven is not installed. Please install Maven 3.6+.
    exit /b 1
)

node -v >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed. Please install Node.js 16+.
    exit /b 1
)

echo All prerequisites found!
echo.

REM Start Backend
echo Starting Backend...
cd backend

if exist "target\placement-prep-backend-1.0.0.jar" (
    echo Found existing JAR file. Starting...
    start "Backend Server" java -jar target\placement-prep-backend-1.0.0.jar
) else (
    echo Building backend...
    call mvn clean install -DskipTests
    if errorlevel 1 (
        echo Backend build failed!
        exit /b 1
    )
    echo Build successful. Starting backend...
    start "Backend Server" java -jar target\placement-prep-backend-1.0.0.jar
)

cd ..

echo Waiting for backend to start...
timeout /t 10 /nobreak >nul

echo Backend started successfully on http://localhost:8080
echo.

REM Start Frontend
echo Starting Frontend...
cd frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

echo Starting React development server...
start "Frontend Server" npm start

cd ..

echo Waiting for frontend to start...
timeout /t 15 /nobreak >nul

echo.
echo ======================================
echo Application Started Successfully!
echo ======================================
echo.
echo Backend API:  http://localhost:8080
echo Frontend App: http://localhost:3000
echo.
echo Close the command windows to stop the services
echo.

pause
