#!/bin/bash

echo "🔄 Smart Branch Merge for Multi-AI Development"

# Check if we have changes to merge
CURSOR_CHANGES=$(git rev-list --count main..cursor-work 2>/dev/null || echo "0")
WINDSURF_CHANGES=$(git rev-list --count main..windsurf-work 2>/dev/null || echo "0")

echo "📊 Changes Summary:"
echo "📱 Cursor branch: $CURSOR_CHANGES commits ahead"
echo "🌊 Windsurf branch: $WINDSURF_CHANGES commits ahead"

if [ "$CURSOR_CHANGES" = "0" ] && [ "$WINDSURF_CHANGES" = "0" ]; then
    echo "✅ No changes to merge"
    exit 0
fi

# Show recent commits
echo "
📝 Recent Commits:
"
if [ "$CURSOR_CHANGES" != "0" ]; then
    echo "📱 Cursor work:"
    git log --oneline main..cursor-work
fi

if [ "$WINDSURF_CHANGES" != "0" ]; then
    echo "🌊 Windsurf work:"
    git log --oneline main..windsurf-work
fi

echo "
🎯 Merge Options:
1️⃣ Sequential merge (Cursor → Windsurf → Main)
2️⃣ Create merge commit with both branches
3️⃣ Interactive merge (review each commit)
4️⃣ Squash and merge (clean history)
"

read -p "Choose merge strategy (1-4): " MERGE_STRATEGY

case $MERGE_STRATEGY in
    1)
        echo "🔄 Sequential merge..."
        git checkout main
        git merge cursor-work --no-ff -m "Merge Cursor AI session"
        git merge windsurf-work --no-ff -m "Merge Windsurf AI session"
        ;;
    2)
        echo "🔄 Creating octopus merge..."
        git checkout main
        git merge cursor-work windsurf-work --no-ff -m "Merge multi-AI development session"
        ;;
    3)
        echo "👁️ Interactive merge..."
        echo "Review cursor-work changes:"
        git checkout main
        git merge cursor-work --no-commit --no-ff
        git status
        read -p "Continue with windsurf merge? (y/n): " CONTINUE
        if [ "$CONTINUE" = "y" ]; then
            git commit -m "Merge Cursor session"
            git merge windsurf-work --no-commit --no-ff
            git status
            echo "Review and commit windsurf changes manually"
        fi
        ;;
    4)
        echo "🗜️ Squash and merge..."
        git checkout main
        git merge cursor-work --squash
        git commit -m "Squashed Cursor AI development session"
        git merge windsurf-work --squash
        git commit -m "Squashed Windsurf AI development session"
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo "
✅ Merge completed!
🧹 Cleanup branches? (cursor-work, windsurf-work)
"
read -p "Delete feature branches? (y/n): " DELETE_BRANCHES

if [ "$DELETE_BRANCHES" = "y" ]; then
    git branch -d cursor-work windsurf-work
    echo "🗑️ Feature branches deleted"
fi

echo "
🎉 Multi-AI merge completed!
📍 Current branch: $(git branch --show-current)
📊 Status: $(git status --porcelain | wc -l) uncommitted changes
"
