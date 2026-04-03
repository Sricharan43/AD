#!/bin/bash

# Cinelytics Full-Stack Platform Startup Script
# This orchestrates the ML Service, Backend, and Production Frontend

echo "🎬 Starting Cinelytics Platform..."

# 1. Start ML Service (FastAPI)
echo "🤖 Starting ML Service (Port 8000)..."
cd ml-service
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 > ml_service.log 2>&1 &
ML_PID=$!
cd ..

# 2. Start Backend (Node.js)
echo "📦 Starting Backend API (Port 5000)..."
cd backend
NODE_ENV=production node server.js > backend_service.log 2>&1 &
BACKEND_PID=$!
cd ..

# 3. Serve Frontend (Production Build)
echo "🌐 Serving Production Frontend (Port 5173)..."
cd frontend
# Using npx serve to serve the built 'dist' folder
npx -y serve -s dist -l 5173 > frontend_service.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo "✅ All services are launching!"
echo "--------------------------------------------------"
echo "Frontend:   http://localhost:5173"
echo "Backend:    http://localhost:5000/api/movies"
echo "ML Service: http://localhost:8000/health"
echo "--------------------------------------------------"
echo "Logs are available in: ml_service.log, backend_service.log, frontend_service.log"
echo "To stop all services, run: kill $ML_PID $BACKEND_PID $FRONTEND_PID"

# Wait for background processes
wait
