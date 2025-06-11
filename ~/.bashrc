# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

# don't put duplicate lines or lines starting with space in the history.
# See bash(1) for more options
HISTCONTROL=ignoreboth

# append to the history file, don't overwrite it
shopt -s histappend

# for setting history length see HISTSIZE and HISTFILESIZE in bash(1)
HISTSIZE=1000
HISTFILESIZE=2000

# check the window size after each command and, if necessary,
# update the values of LINES and COLUMNS.
shopt -s checkwinsize

# If set, the pattern "**" used in a pathname expansion context will
# match all files and zero or more directories and subdirectories.
#shopt -s globstar

# make less more friendly for non-text input files, see lesspipe(1)
[ -x /usr/bin/lesspipe ] && eval "$(SHELL=/bin/sh lesspipe)"

# set variable identifying the chroot you work in (used in the prompt below)
if [ -z "${debian_chroot:-}" ] && [ -r /etc/debian_chroot ]; then
    debian_chroot=$(cat /etc/debian_chroot)
fi

# enable color support of ls and also add handy aliases
if [ -x /usr/bin/dircolors ]; then
    test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
    alias ls='ls --color=auto'
    alias grep='grep --color=auto'
    alias fgrep='fgrep --color=auto'
    alias egrep='egrep --color=auto'
fi

# some more ls aliases
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'

# Add an "alert" alias for long running commands.  Use like so:
#   sleep 10; alert
alias alert='notify-send --urgency=low -i "$([ $? = 0 ] && echo terminal || echo error)" "$(history|tail -n1|sed -e '\''s/^\s*[0-9]\+\s*//;s/[;&|]\s*alert$//'\'')"'

# Alias definitions.
# You may want to put all your additions into a separate file like
# ~/.bash_aliases, instead of adding them here directly.
# See /usr/share/doc/bash-doc/examples in the bash-doc package.

if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi

# enable programmable completion features (you don't need to enable
# this, if it's already enabled in /etc/bash.bashrc and /etc/profile
# sources /etc/bash.bashrc).
if ! shopt -oq posix; then
  if [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
  elif [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
  fi
fi

# =====================================
# CUSTOM CONFIGURATION FOR DEVELOPMENT
# =====================================

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

# Fast project navigation (add more as needed)
alias budget='cd ~/budget-app'

# Show current directory after cd
cd() {
    builtin cd "$@" && pwd
}

# NVM Configuration
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# FORCE simple prompt at the end (highest priority)
export PS1="[\W]$ "

echo "🚀 Development environment loaded! Type 'budget' to go to your project." 