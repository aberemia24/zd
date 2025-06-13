#!/bin/bash

echo "🚀 Quick Multi-AI Development Setup"
echo "===================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker installed. Please restart terminal and run this script again."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Starting Docker..."
    sudo systemctl start docker
    sleep 3
fi

echo "✅ Docker is ready"

# Increase file watcher limits for WSL
if grep -q microsoft /proc/version; then
    echo "🔧 Configuring WSL file watchers..."
    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
    sudo sysctl -p
    echo "✅ File watchers configured"
fi

# Setup branch structure
echo "🌿 Setting up Git branches..."
git checkout main 2>/dev/null || git checkout -b main
git checkout -b cursor-work 2>/dev/null || echo "cursor-work branch exists"
git checkout -b windsurf-work 2>/dev/null || echo "windsurf-work branch exists"
git checkout main
echo "✅ Git branches ready"

# Build Docker images
echo "🐳 Building Docker development images..."
docker compose -f docker-compose.dev.yml build --no-cache
echo "✅ Docker images built"

# Test container startup
echo "🧪 Testing container startup..."
docker compose -f docker-compose.dev.yml up -d cursor-dev
sleep 10
CURSOR_STATUS=$(docker ps --filter "name=budget-app-cursor" --format "{{.Status}}")
docker compose -f docker-compose.dev.yml down

if [[ $CURSOR_STATUS == *"Up"* ]]; then
    echo "✅ Container test successful"
else
    echo "❌ Container test failed. Check Docker configuration."
    exit 1
fi

# Create initial session file
echo "SETUP-COMPLETED-$(date +'%Y-%m-%d %H:%M:%S')" > .ai-session-active

echo "
🎉 Multi-AI Setup Complete!

📋 What's Ready:
✅ Docker containers configured (cursor-dev, windsurf-dev)
✅ Git branches created (cursor-work, windsurf-work)
✅ File watchers optimized for WSL
✅ Port assignments: Cursor (3000/3001), Windsurf (4000/4001)
✅ Merge scripts configured

🚀 Next Steps:

For Cursor AI:
  ./scripts/start-cursor.sh

For Windsurf AI:
  ./scripts/start-windsurf.sh

Check status anytime:
  ./scripts/ai-status.sh

📚 Documentation:
  - WINDSURF_AI_GUIDE.md (Complete guide for Windsurf AI)
  - MULTI_AI_SETUP.md (Technical setup documentation)

💡 Pro Tips:
  - Each AI gets isolated containers with separate ports
  - Auto-branch switching when starting containers
  - Smart merge system handles conflicts automatically
  - Status dashboard shows both AI progress

Happy coding! 🌊🚀
"
