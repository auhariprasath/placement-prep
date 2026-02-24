#!/bin/bash

# Placement Prep Application Startup Script

echo "======================================"
echo "  Placement Prep Application"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "Checking prerequisites..."

if ! command_exists java; then
    echo -e "${RED}Error: Java is not installed. Please install Java 17 or higher.${NC}"
    exit 1
fi

if ! command_exists mvn; then
    echo -e "${RED}Error: Maven is not installed. Please install Maven 3.6+.${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js 16+.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}Error: npm is not installed. Please install npm.${NC}"
    exit 1
fi

echo -e "${GREEN}All prerequisites found!${NC}"
echo ""

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "Shutting down services..."
    if [ -n "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "Backend stopped"
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "Frontend stopped"
    fi
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start Backend
echo -e "${YELLOW}Starting Backend...${NC}"
cd backend

# Check if target directory exists with JAR
if [ -f "target/placement-prep-backend-1.0.0.jar" ]; then
    echo "Found existing JAR file. Starting..."
    java -jar target/placement-prep-backend-1.0.0.jar &
    BACKEND_PID=$!
else
    echo "Building backend..."
    mvn clean install -DskipTests
    if [ $? -eq 0 ]; then
        echo "Build successful. Starting backend..."
        java -jar target/placement-prep-backend-1.0.0.jar &
        BACKEND_PID=$!
    else
        echo -e "${RED}Backend build failed!${NC}"
        exit 1
    fi
fi

cd ..

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 10

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}Backend failed to start!${NC}"
    exit 1
fi

echo -e "${GREEN}Backend started successfully on http://localhost:8080${NC}"
echo ""

# Start Frontend
echo -e "${YELLOW}Starting Frontend...${NC}"
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo "Starting React development server..."
npm start &
FRONTEND_PID=$!

cd ..

# Wait for frontend to start
echo "Waiting for frontend to start..."
sleep 15

# Check if frontend is running
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${RED}Frontend failed to start!${NC}"
    cleanup
    exit 1
fi

echo ""
echo "======================================"
echo -e "${GREEN}Application Started Successfully!${NC}"
echo "======================================"
echo ""
echo "Backend API:  http://localhost:8080"
echo "Frontend App: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

# Wait for both processes
wait
