#!/bin/bash

echo "🌊 Starting Windsurf Development Environment..."
echo "📱 Frontend: http://localhost:4000"
echo "🔧 Backend: http://localhost:4001"

# Switch to windsurf branch
git checkout windsurf-work 2>/dev/null || git checkout -b windsurf-work

# Create session lock file
echo "WINDSURF-SESSION-$(date +'%Y-%m-%d %H:%M:%S')" > .ai-session-active

# Start Windsurf container
sudo docker compose -f docker-compose.dev.yml up windsurf-dev
