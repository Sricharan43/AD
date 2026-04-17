#!/bin/zsh

# Path to workspace
BASE_DIR="/Users/AD"

echo "🚀 Starting Cinelytics in Zero-Dependency Mode (SQLite)..."

# 1. Seed/Initialize Database if it doesn't exist
if [ ! -f "$BASE_DIR/cinelytics.sqlite" ]; then
    echo "🌱 No database found. Seeding cinematic data into SQLite..."
    zsh -lc "cd $BASE_DIR && source ml-model/venv/bin/activate && python3 dataset/data_gen.py"
else
    echo "✅ SQLite Database found."
fi

# 2. Start Backend API
echo "📂 Starting Backend (Port 5005)..."
zsh -lc "cd $BASE_DIR/backend && npm run dev" &
BACKEND_PID=$!

# 3. Start ML Service
echo "🧠 Starting ML Service (Port 5001)..."
zsh -lc "cd $BASE_DIR/ml-model && source venv/bin/activate && python3 app.py" &
ML_PID=$!

# 4. Start Frontend
echo "💻 Starting Frontend (Port 5173)..."
zsh -lc "cd $BASE_DIR/frontend && npm run dev" &
FRONTEND_PID=$!

echo "✨ Cinelytics is live!"
echo "🔗 Frontend: http://localhost:5173"
echo "🔗 Backend:  http://localhost:5005"
echo "🔗 ML API:   http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop all services."

# Handle shutdown
trap "kill $BACKEND_PID $ML_PID $FRONTEND_PID; echo '🛑 Services stopped.'; exit" INT TERM
wait
