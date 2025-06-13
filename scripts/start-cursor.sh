#!/bin/bash

echo "🚀 Starting Cursor Development Environment..."
echo "📱 Frontend: http://localhost:3010"
echo "🔧 Backend: http://localhost:3011"

# Switch to cursor branch
git checkout cursor-work 2>/dev/null || git checkout -b cursor-work

# Create session lock file
echo "CURSOR-SESSION-$(date +'%Y-%m-%d %H:%M:%S')" > .ai-session-active

# Start Cursor container
sudo docker compose -f docker-compose.dev.yml up cursor-dev
