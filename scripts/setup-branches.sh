#!/bin/bash

echo "🌿 Setting up branch strategy for multi-AI development"

# Create branches for each IDE
echo "Creating cursor-work branch..."
git checkout -b cursor-work 2>/dev/null || git checkout cursor-work

echo "Creating windsurf-work branch..."
git checkout -b windsurf-work 2>/dev/null || git checkout windsurf-work

# Back to main
git checkout main

echo "
✅ Branches created:
📱 cursor-work   - For Cursor IDE container
🌊 windsurf-work - For Windsurf IDE container

🔄 Workflow:
1. Start Cursor container: ./scripts/start-cursor.sh
   -> Auto switches to cursor-work branch

2. Start Windsurf container: ./scripts/start-windsurf.sh
   -> Auto switches to windsurf-work branch

3. Merge when ready: ./scripts/merge-branches.sh

📍 Current branch: $(git branch --show-current)
"
