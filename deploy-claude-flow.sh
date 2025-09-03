#!/bin/bash
# =========================================================
# Claude-Flow Alpha93 Deployment Script
# =========================================================
# This script automates the deployment of Claude-Flow as an MCP server
# for Claude Code, with advanced swarm coordination capabilities.
# 
# Author: Codegen
# Version: 1.0.0
# =========================================================

set -e

# Text formatting
BOLD="\033[1m"
GREEN="\033[0;32m"
BLUE="\033[0;34m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
CYAN="\033[0;36m"
MAGENTA="\033[0;35m"
NC="\033[0m" # No Color

# =========================================================
# Configuration Variables
# =========================================================
CLAUDE_FLOW_VERSION="alpha"
NODE_VERSION_REQUIRED="20.0.0"
NPM_VERSION_REQUIRED="9.0.0"
INSTALL_GLOBALLY=true
SETUP_MCP=true
INITIALIZE_SPARC=true
MIGRATE_HOOKS=true
BACKUP_DIR="$HOME/.claude-flow-backups/$(date +%Y%m%d_%H%M%S)"
LOG_FILE="$BACKUP_DIR/deployment.log"

# =========================================================
# Helper Functions
# =========================================================

log() {
  local level=$1
  local message=$2
  local color=$NC
  
  case $level in
    "INFO") color=$GREEN ;;
    "WARN") color=$YELLOW ;;
    "ERROR") color=$RED ;;
    "STEP") color=$BLUE ;;
    "SUCCESS") color=$GREEN ;;
  esac
  
  echo -e "${color}[$level] $message${NC}"
  echo "[$level] $message" >> "$LOG_FILE"
}

check_command() {
  if ! command -v "$1" &> /dev/null; then
    log "ERROR" "$1 is not installed. Please install it and try again."
    exit 1
  fi
}

version_gt() {
  test "$(printf '%s\n' "$1" "$2" | sort -V | head -n 1)" != "$1"
}

check_node_version() {
  local current_version=$(node -v | cut -d 'v' -f 2)
  if version_gt "$NODE_VERSION_REQUIRED" "$current_version"; then
    log "ERROR" "Node.js version $current_version is less than required version $NODE_VERSION_REQUIRED"
    log "INFO" "Please upgrade Node.js to version $NODE_VERSION_REQUIRED or higher"
    exit 1
  fi
}

check_npm_version() {
  local current_version=$(npm -v)
  if version_gt "$NPM_VERSION_REQUIRED" "$current_version"; then
    log "ERROR" "npm version $current_version is less than required version $NPM_VERSION_REQUIRED"
    log "INFO" "Please upgrade npm to version $NPM_VERSION_REQUIRED or higher"
    exit 1
  fi
}

create_backup_dir() {
  mkdir -p "$BACKUP_DIR"
  touch "$LOG_FILE"
  log "INFO" "Created backup directory at $BACKUP_DIR"
}

backup_existing_config() {
  local claude_dir="$HOME/.claude"
  if [ -d "$claude_dir" ]; then
    log "INFO" "Backing up existing Claude configuration..."
    cp -r "$claude_dir" "$BACKUP_DIR/.claude"
    log "SUCCESS" "Backed up existing Claude configuration to $BACKUP_DIR/.claude"
  fi
}

# =========================================================
# Main Installation Functions
# =========================================================

install_claude_flow() {
  log "STEP" "Installing Claude-Flow@$CLAUDE_FLOW_VERSION..."
  
  if [ "$INSTALL_GLOBALLY" = true ]; then
    npm install -g claude-flow@$CLAUDE_FLOW_VERSION
    log "SUCCESS" "Claude-Flow installed globally"
  else
    npm install claude-flow@$CLAUDE_FLOW_VERSION
    log "SUCCESS" "Claude-Flow installed locally"
  fi
  
  # Verify installation
  if [ "$INSTALL_GLOBALLY" = true ]; then
    local version=$(claude-flow --version 2>/dev/null || echo "Unknown")
  else
    local version=$(npx claude-flow --version 2>/dev/null || echo "Unknown")
  fi
  
  log "INFO" "Installed Claude-Flow version: $version"
}

setup_mcp_server() {
  if [ "$SETUP_MCP" = true ]; then
    log "STEP" "Setting up Claude-Flow as an MCP server in Claude Code..."
    
    # Check if claude CLI is available
    if ! command -v claude &> /dev/null; then
      log "WARN" "Claude CLI not found. Skipping MCP server setup."
      log "INFO" "To manually set up the MCP server, run: claude mcp add claude-flow npx claude-flow@alpha mcp start"
      return
    fi
    
    # Add Claude-Flow as an MCP server
    claude mcp add claude-flow npx claude-flow@$CLAUDE_FLOW_VERSION mcp start
    log "SUCCESS" "Claude-Flow added as an MCP server in Claude Code"
  fi
}

initialize_sparc_environment() {
  if [ "$INITIALIZE_SPARC" = true ]; then
    log "STEP" "Initializing SPARC environment..."
    
    if [ "$INSTALL_GLOBALLY" = true ]; then
      claude-flow init --sparc
    else
      npx claude-flow init --sparc
    fi
    
    log "SUCCESS" "SPARC environment initialized"
  fi
}

migrate_hooks() {
  if [ "$MIGRATE_HOOKS" = true ]; then
    log "STEP" "Migrating hooks to new format for Claude Code 1.0.51+ compatibility..."
    
    if [ "$INSTALL_GLOBALLY" = true ]; then
      claude-flow migrate-hooks
    else
      npx claude-flow migrate-hooks
    fi
    
    log "SUCCESS" "Hooks migrated to new format"
  fi
}

print_usage_instructions() {
  echo -e "\n${BOLD}${GREEN}=== Claude-Flow Deployment Complete ===${NC}\n"
  echo -e "${BOLD}${CYAN}Quick Start Guide:${NC}\n"
  
  echo -e "${BOLD}1. Initialize a Swarm:${NC}"
  echo -e "   In Claude Code, use the following MCP tools:\n"
  echo -e "   ${YELLOW}mcp__claude-flow__swarm_init { topology: \"mesh\", maxAgents: 6, strategy: \"parallel\" }${NC}"
  
  echo -e "\n${BOLD}2. Spawn Specialized Agents:${NC}"
  echo -e "   ${YELLOW}mcp__claude-flow__agent_spawn { type: \"architect\", name: \"System Designer\" }${NC}"
  echo -e "   ${YELLOW}mcp__claude-flow__agent_spawn { type: \"coder\", name: \"API Developer\" }${NC}"
  echo -e "   ${YELLOW}mcp__claude-flow__agent_spawn { type: \"analyst\", name: \"DB Designer\" }${NC}"
  echo -e "   ${YELLOW}mcp__claude-flow__agent_spawn { type: \"tester\", name: \"QA Engineer\" }${NC}"
  echo -e "   ${YELLOW}mcp__claude-flow__agent_spawn { type: \"coordinator\", name: \"Project Manager\" }${NC}"
  
  echo -e "\n${BOLD}3. Orchestrate Tasks:${NC}"
  echo -e "   ${YELLOW}mcp__claude-flow__task_orchestrate { task: \"Build a REST API with authentication\", strategy: \"parallel\" }${NC}"
  
  echo -e "\n${BOLD}4. Use Persistent Memory:${NC}"
  echo -e "   ${YELLOW}mcp__claude-flow__memory_usage { action: \"store\", key: \"project/init\", value: { started: Date.now() } }${NC}"
  
  echo -e "\n${BOLD}${MAGENTA}CRITICAL: Follow the Parallel Execution Pattern${NC}"
  echo -e "Always batch related operations in a single message:"
  echo -e "- All MCP coordination setup in one message"
  echo -e "- All Task spawning in one message"
  echo -e "- All TodoWrite operations in one message (5-10+ todos)"
  echo -e "- All file operations in one message"
  
  echo -e "\n${BOLD}${CYAN}Documentation:${NC}"
  echo -e "- GitHub: https://github.com/ruvnet/claude-flow"
  echo -e "- Backup Location: $BACKUP_DIR"
  echo -e "- Log File: $LOG_FILE\n"
}

# =========================================================
# Main Execution
# =========================================================

main() {
  echo -e "\n${BOLD}${BLUE}=== Claude-Flow Alpha93 Deployment ===${NC}\n"
  
  # Create backup directory
  create_backup_dir
  
  # Check prerequisites
  log "STEP" "Checking prerequisites..."
  check_command "node"
  check_command "npm"
  check_node_version
  check_npm_version
  log "SUCCESS" "All prerequisites satisfied"
  
  # Backup existing configuration
  backup_existing_config
  
  # Install Claude-Flow
  install_claude_flow
  
  # Setup MCP server
  setup_mcp_server
  
  # Initialize SPARC environment
  initialize_sparc_environment
  
  # Migrate hooks
  migrate_hooks
  
  # Print usage instructions
  print_usage_instructions
}

# Run the main function
main

