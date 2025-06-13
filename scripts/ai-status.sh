#!/bin/bash

echo "🤖 Multi-AI Development Status"
echo "================================"

# Current session
if [ -f ".ai-session-active" ]; then
    ACTIVE_SESSION=$(cat .ai-session-active)
    echo "📍 Active session: $ACTIVE_SESSION"
else
    echo "📍 No active session"
fi

# Git status
echo "
🌿 Git Status:"
echo "📍 Current branch: $(git branch --show-current)"
echo "📊 Uncommitted changes: $(git status --porcelain | wc -l)"

# Branch comparison
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    COMMITS_AHEAD=$(git rev-list --count main..$CURRENT_BRANCH 2>/dev/null || echo "0")
    echo "📈 Commits ahead of main: $COMMITS_AHEAD"
fi

# Container status
echo "
🐳 Container Status:"
CURSOR_RUNNING=$(docker ps --filter "name=budget-app-cursor" --format "table {{.Names}}" | grep -v NAMES | wc -l)
WINDSURF_RUNNING=$(docker ps --filter "name=budget-app-windsurf" --format "table {{.Names}}" | grep -v NAMES | wc -l)

if [ "$CURSOR_RUNNING" -gt 0 ]; then
    echo "📱 Cursor container: ✅ Running (ports 3000/3001)"
else
    echo "📱 Cursor container: ❌ Stopped"
fi

if [ "$WINDSURF_RUNNING" -gt 0 ]; then
    echo "🌊 Windsurf container: ✅ Running (ports 4000/4001)"
else
    echo "🌊 Windsurf container: ❌ Stopped"
fi

# Branch status
echo "
🔄 Branch Status:"
CURSOR_EXISTS=$(git branch --list cursor-work | wc -l)
WINDSURF_EXISTS=$(git branch --list windsurf-work | wc -l)

if [ "$CURSOR_EXISTS" -gt 0 ]; then
    CURSOR_COMMITS=$(git rev-list --count main..cursor-work 2>/dev/null || echo "0")
    echo "📱 cursor-work: ✅ ($CURSOR_COMMITS commits ahead)"
else
    echo "📱 cursor-work: ❌ Not created"
fi

if [ "$WINDSURF_EXISTS" -gt 0 ]; then
    WINDSURF_COMMITS=$(git rev-list --count main..windsurf-work 2>/dev/null || echo "0")
    echo "🌊 windsurf-work: ✅ ($WINDSURF_COMMITS commits ahead)"
else
    echo "🌊 windsurf-work: ❌ Not created"
fi

# Quick actions
echo "
🚀 Quick Actions:"
echo "./scripts/start-cursor.sh    - Start Cursor environment"
echo "./scripts/start-windsurf.sh  - Start Windsurf environment"
echo "./scripts/merge-branches.sh  - Merge both sessions"
echo "./scripts/ai-status.sh       - Show this status"

# Recommendations
if [ "$CURSOR_COMMITS" -gt 0 ] || [ "$WINDSURF_COMMITS" -gt 0 ]; then
    echo "
💡 Recommendation: You have uncommitted work. Consider merging branches."
fi
