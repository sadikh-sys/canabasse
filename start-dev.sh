#!/bin/bash

echo "Starting PRP Music Platform Development Environment..."

echo ""
echo "Starting Backend Server..."
cd backend && npm run dev &
BACKEND_PID=$!

echo ""
echo "Waiting 5 seconds for backend to start..."
sleep 5

echo ""
echo "Starting Frontend Server..."
cd .. && npm run dev &
FRONTEND_PID=$!

echo ""
echo "Both servers are starting..."
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
