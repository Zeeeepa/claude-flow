# Z.ai Provider Setup Guide for Claude-Flow

## 🚀 Quick Setup

### Method 1: Using CLI Commands

```bash
# Set up Z.ai provider with your API key
npx claude-flow provider zai deb21352b03a40d59eb80c330dadc530.YajyK4xUtogbCVGR

# Or use the general provider command
npx claude-flow provider --set zai --key deb21352b03a40d59eb80c330dadc530.YajyK4xUtogbCVGR

# Check provider status
npx claude-flow provider --status

# Test the connection
npx claude-flow provider --test
```

### Method 2: Interactive Setup

```bash
# Start interactive setup
npx claude-flow provider setup

# Follow the prompts:
# 1. Choose "zai" as provider
# 2. Enter your API key: deb21352b03a40d59eb80c330dadc530.YajyK4xUtogbCVGR
```

### Method 3: Environment Variables

```bash
# Set environment variable
export ZAI_API_KEY="deb21352b03a40d59eb80c330dadc530.YajyK4xUtogbCVGR"

# Initialize Claude-Flow (will auto-detect the API key)
npx claude-flow provider --list
```

## 📋 Provider Configuration Details

### Z.ai Provider Specifications

- **Provider Name**: Z.ai GLM
- **Type**: `zai`
- **API URL**: `https://api.z.ai/v1/chat/completions`
- **Default Model**: `glm-4.5`
- **Capabilities**: Chat, Reasoning, Code, Analysis, Chinese Language
- **Priority**: 90 (highest by default)

### Available Models

- `glm-4.5` (recommended) - Latest and most capable model
- `glm-4` - Previous generation model
- `glm-3-turbo` - Faster, lighter model

## 🔧 Advanced Configuration

### Custom Configuration

```bash
# Add custom Z.ai configuration
npx claude-flow provider --set zai --key deb21352b03a40d59eb80c330dadc530.YajyK4xUtogbCVGR

# Then manually edit ~/.claude-flow/providers.json for advanced settings:
```

```json
{
  "activeProvider": "zai",
  "providers": {
    "zai": {
      "name": "Z.ai GLM",
      "type": "zai",
      "apiKey": "deb21352b03a40d59eb80c330dadc530.YajyK4xUtogbCVGR",
      "apiUrl": "https://api.z.ai/v1/chat/completions",
      "model": "glm-4.5",
      "temperature": 0.7,
      "maxTokens": 4096,
      "topP": 1,
      "timeout": 60000,
      "retryAttempts": 3,
      "enabled": true,
      "priority": 90,
      "capabilities": ["chat", "reasoning", "code", "analysis", "chinese"]
    }
  }
}
```

### Load Balancing Setup

```bash
# Enable load balancing between multiple providers
npx claude-flow provider --list

# Edit ~/.claude-flow/providers.json to enable load balancing:
```

```json
{
  "loadBalancing": {
    "enabled": true,
    "strategy": "weighted",
    "weights": {
      "zai": 60,
      "anthropic": 30,
      "openai": 10
    }
  }
}
```

## 🧪 Testing Your Setup

### Basic Connection Test

```bash
# Test active provider
npx claude-flow provider --test

# Expected output:
# 🧪 Testing provider: Z.ai GLM...
# ✅ Provider test successful
#    Response time: 1234ms
```

### Manual Test Script

```bash
# Run the included test script
node test-zai-integration.js

# Expected output:
# 🚀 Testing Z.ai Integration with Claude-Flow
# 📋 Initializing provider configuration...
# 🔑 Setting Z.ai API key...
# 🎯 Setting Z.ai as active provider...
# ✅ Health check passed!
# ✅ Message sent successfully!
```

### Integration Test with MCP

```bash
# Initialize Claude-Flow with Z.ai
npx claude-flow init --roo --force

# Test MCP integration
claude mcp test claude-flow

# Use Z.ai in Claude Code
# Open Claude Code and use commands like:
# /claude-flow-agent-spawn { type: "code-analyzer", provider: "zai" }
```

## 🎯 Using Z.ai in Claude-Flow

### Basic Usage

```javascript
// In Claude Code, use MCP commands:
mcp__claude-flow__provider_status

// Switch to Z.ai if not active
mcp__claude-flow__provider_set { provider: "zai" }

// Spawn agents using Z.ai
mcp__claude-flow__agent_spawn { 
  type: "code-analyzer", 
  name: "ZAI-Analyzer",
  provider: "zai"
}
```

### SPARC Workflow with Z.ai

```bash
# Use Z.ai for SPARC methodology
npx claude-flow sparc run code "implement user authentication system"

# The system will automatically use Z.ai as the active provider
```

### Swarm Coordination with Z.ai

```javascript
// Initialize swarm with Z.ai provider
mcp__claude-flow__swarm_init { 
  topology: "hierarchical", 
  maxAgents: 6,
  provider: "zai"
}

// All agents will use Z.ai GLM-4.5 model
```

## 🔍 Troubleshooting

### Common Issues

#### 1. API Key Not Working

```bash
# Verify API key format
npx claude-flow provider --list --verbose

# Check if key is properly set
npx claude-flow provider --status

# Test connection
npx claude-flow provider --test
```

#### 2. Connection Timeout

```bash
# Increase timeout in configuration
# Edit ~/.claude-flow/providers.json:
{
  "providers": {
    "zai": {
      "timeout": 120000,  // 2 minutes
      "retryAttempts": 5
    }
  }
}
```

#### 3. Model Not Available

```bash
# Check available models
npx claude-flow provider --list --verbose

# Switch to different model
# Edit configuration to use "glm-4" instead of "glm-4.5"
```

#### 4. Rate Limiting

```bash
# Configure retry settings
{
  "providers": {
    "zai": {
      "retryAttempts": 5,
      "retryDelay": 2000,
      "retryJitter": true
    }
  }
}
```

### Debug Mode

```bash
# Enable debug logging
export CLAUDE_FLOW_DEBUG=true
npx claude-flow provider --test --verbose

# Check logs
tail -f ~/.claude-flow/logs/claude-flow.log
```

## 📊 Performance Optimization

### Recommended Settings for Z.ai

```json
{
  "zai": {
    "model": "glm-4.5",
    "temperature": 0.7,
    "maxTokens": 4096,
    "topP": 0.9,
    "timeout": 60000,
    "retryAttempts": 3,
    "enableHealthCheck": true,
    "healthCheckInterval": 300000,
    "circuitBreakerThreshold": 5
  }
}
```

### Batch Processing

```javascript
// Use Z.ai for batch operations
mcp__claude-flow__batch_process {
  tasks: [
    { type: "code-review", file: "src/auth.js" },
    { type: "test-generation", file: "src/utils.js" },
    { type: "documentation", file: "src/api.js" }
  ],
  provider: "zai",
  parallel: true
}
```

## 🔐 Security Best Practices

### API Key Management

```bash
# Store API key securely
echo 'export ZAI_API_KEY="deb21352b03a40d59eb80c330dadc530.YajyK4xUtogbCVGR"' >> ~/.bashrc
source ~/.bashrc

# Verify key is not exposed in logs
npx claude-flow provider --status | grep -v "deb21352"
```

### Configuration Security

```bash
# Secure provider configuration file
chmod 600 ~/.claude-flow/providers.json

# Backup configuration
cp ~/.claude-flow/providers.json ~/.claude-flow/providers.json.backup
```

## 🚀 Advanced Features

### Custom Prompts for Z.ai

```json
{
  "zai": {
    "systemPrompt": "You are an expert AI assistant powered by GLM-4.5. You excel at code analysis, Chinese language processing, and complex reasoning tasks. Always provide detailed, accurate responses."
  }
}
```

### Multi-Provider Fallback

```json
{
  "fallbackOrder": ["zai", "anthropic", "openai"],
  "loadBalancing": {
    "enabled": true,
    "strategy": "least-latency"
  }
}
```

### Integration with External Tools

```bash
# Use Z.ai with external APIs
mcp__claude-flow__external_integration {
  provider: "zai",
  tool: "github-api",
  action: "analyze-repository"
}
```

## 📚 Additional Resources

- [Z.ai API Documentation](https://api.z.ai/docs)
- [Claude-Flow Documentation](https://github.com/ruvnet/claude-flow)
- [SPARC Methodology Guide](https://github.com/ruvnet/claude-flow/docs/sparc.md)
- [MCP Integration Guide](https://github.com/ruvnet/claude-flow/docs/mcp.md)

## 🎉 Success Checklist

- [ ] Z.ai API key configured: `deb21352b03a40d59eb80c330dadc530.YajyK4xUtogbCVGR`
- [ ] Provider set as active: `npx claude-flow provider --status`
- [ ] Connection test passed: `npx claude-flow provider --test`
- [ ] MCP integration working: `claude mcp test claude-flow`
- [ ] SPARC workflow functional: `npx claude-flow sparc modes`
- [ ] Swarm coordination ready: `mcp__claude-flow__swarm_init`

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Run with debug mode: `CLAUDE_FLOW_DEBUG=true npx claude-flow provider --test`
3. Review logs: `~/.claude-flow/logs/claude-flow.log`
4. Test with the included script: `node test-zai-integration.js`

---

*Your Z.ai provider is now ready for use with Claude-Flow! 🎯*

