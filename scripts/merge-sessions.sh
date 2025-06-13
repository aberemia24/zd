#!/bin/bash

echo "🔄 Merging AI Sessions Workflow"

# Check current session
if [ -f ".ai-session-active" ]; then
    ACTIVE_SESSION=$(cat .ai-session-active)
    echo "📍 Current session: $ACTIVE_SESSION"
fi

echo "
🎯 Merge Strategies:

1️⃣ BRANCH STRATEGY (Recomandată)
   git checkout -b cursor-work
   # Work in Cursor container
   git add . && git commit -m 'Cursor: feature implementation'

   git checkout -b windsurf-work
   # Work in Windsurf container
   git add . && git commit -m 'Windsurf: additional features'

   # Merge manual
   git checkout main
   git merge cursor-work
   git merge windsurf-work

2️⃣ VOLUME SYNC STRATEGY
   # Sync between containers automatically
   ./scripts/sync-containers.sh

3️⃣ MANUAL REVIEW STRATEGY
   # Review changes before merge
   git diff --name-only
   git add -p  # Stage selectively
"

read -p "Choose strategy (1-3): " STRATEGY

case $STRATEGY in
    1)
        echo "🌿 Setting up branch workflow..."
        ./scripts/setup-branches.sh
        ;;
    2)
        echo "🔄 Setting up container sync..."
        ./scripts/sync-containers.sh
        ;;
    3)
        echo "👁️ Starting manual review..."
        git status
        echo "Use: git add -p to stage selectively"
        ;;
    *)
        echo "❌ Invalid option"
        ;;
esac
