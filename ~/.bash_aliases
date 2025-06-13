# =====================================
# CUSTOM ALIASES AND CONFIGURATION
# =====================================

# Simple prompt showing only current folder name
export PS1="[\W]$ "

# Git aliases for faster workflow
alias gs='git status -s'
alias ga='git add'
alias gaa='git add -A'
alias gc='git commit -m'
alias gac='git add -A && git commit -m'
alias gco='git checkout'
alias gb='git branch'
alias gp='git push'
alias gl='git pull'
alias gd='git diff'
alias glog='git log --oneline --graph --decorate'

# PNPM aliases for monorepo workflow
alias pf='pnpm --filter frontend'
alias pb='pnpm --filter backend'
alias ps='pnpm --filter shared-constants'
alias pi='pnpm install'
alias pd='pnpm run dev'
alias pb-build='pnpm run build'
alias pt='pnpm run test'
alias lint='pnpm run lint'
alias lint-fix='pnpm run lint --fix'

# Common command aliases with non-interactive flags
alias rm='rm -f'
alias cp='cp -f'
alias mv='mv -f'
alias mkdir='mkdir -p'

# Package manager aliases
alias npm='npm --no-fund --no-audit'
alias pnpm='pnpm --silent'

# Quick navigation
alias ..='cd ..'
alias ...='cd ../..'
alias ~='cd ~'
alias home='cd ~'

# System utilities
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias h='history'
alias c='clear'
alias x='exit'

# Fast project navigation
alias budget='cd ~/budget-app'

# Show current directory after cd
cd() {
    builtin cd "$@" && pwd
}

# VSCode/Cursor shell integration (IMPORTANT: prevents terminal hang)
if [[ "$TERM_PROGRAM" == "vscode" ]]; then
  # Load shell integration
  if [[ -f "$(code --locate-shell-integration-path bash 2>/dev/null)" ]]; then
    . "$(code --locate-shell-integration-path bash)"
  fi
  
  # Set non-interactive mode for agent shells
  export DEBIAN_FRONTEND=noninteractive
  export NONINTERACTIVE=1
  
  # Disable progress bars and verbose output
  export NPM_CONFIG_PROGRESS=false
  export PNPM_CONFIG_PROGRESS=false
fi

echo "🚀 Development environment loaded! Type 'budget' to go to your project." 