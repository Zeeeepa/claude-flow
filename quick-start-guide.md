# Claude-Flow Quick Start Guide

This guide will help you get started with Claude-Flow Alpha93 in just 5 minutes, from installation to running your first AI swarm.

## 1. Installation

```bash
# Install Claude-Flow globally
npm install -g claude-flow@alpha
```

## 2. API Key Setup

Claude-Flow requires an Anthropic API key to function properly:

```bash
# Set your Anthropic API key as an environment variable
export ANTHROPIC_API_KEY=your_api_key_here

# For Windows Command Prompt
set ANTHROPIC_API_KEY=your_api_key_here

# For Windows PowerShell
$env:ANTHROPIC_API_KEY="your_api_key_here"
```

### How to Get an Anthropic API Key

1. Go to [Anthropic's Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the key and set it as an environment variable as shown above

## 3. Configure Claude-Flow as an MCP Server

```bash
# Add Claude-Flow as an MCP server in Claude Code
claude mcp add claude-flow npx claude-flow@alpha mcp start
```

## 4. Create a Project Directory

```bash
# Create a new directory for your project
mkdir my-claude-flow-project
cd my-claude-flow-project

# Initialize a new project
npm init -y
```

## 5. Create a PRD (Product Requirements Document)

Create a file named `prd.json` with your project requirements:

```json
{
  "project": {
    "name": "Simple REST API",
    "description": "A basic REST API for user management"
  },
  "requirements": [
    {
      "id": "REQ-001",
      "description": "User authentication with JWT",
      "priority": "high"
    },
    {
      "id": "REQ-002",
      "description": "CRUD operations for user profiles",
      "priority": "high"
    },
    {
      "id": "REQ-003",
      "description": "Role-based access control",
      "priority": "medium"
    },
    {
      "id": "REQ-004",
      "description": "API documentation with OpenAPI",
      "priority": "low"
    }
  ],
  "constraints": [
    "Must use Express.js for the API",
    "Must use PostgreSQL for the database",
    "Must implement JWT authentication"
  ],
  "deliverables": [
    "API server code",
    "Database schema",
    "API documentation",
    "Unit tests"
  ]
}
```

## 6. Run Claude-Flow with Your PRD

Create a file named `run-swarm.js` with the following content:

```javascript
// Import the PRD
const prd = require('./prd.json');

// Initialize a swarm with a mesh topology
mcp__claude-flow__swarm_init { 
  topology: "mesh", 
  maxAgents: 6, 
  strategy: "parallel" 
}

// Spawn specialized agents
mcp__claude-flow__agent_spawn { type: "architect", name: "System Designer" }
mcp__claude-flow__agent_spawn { type: "coder", name: "API Developer" }
mcp__claude-flow__agent_spawn { type: "analyst", name: "DB Designer" }
mcp__claude-flow__agent_spawn { type: "tester", name: "QA Engineer" }
mcp__claude-flow__agent_spawn { type: "coordinator", name: "Project Manager" }

// Store PRD in memory for all agents to access
mcp__claude-flow__memory_usage { 
  action: "store", 
  key: "project/requirements", 
  value: prd
}

// Create todos based on PRD requirements
TodoWrite { todos: prd.requirements.map((req, index) => ({
  id: req.id,
  content: req.description,
  status: index === 0 ? "in_progress" : "pending",
  priority: req.priority
}))}

// Orchestrate the task
mcp__claude-flow__task_orchestrate { 
  task: `Build ${prd.project.name}: ${prd.project.description}`, 
  strategy: "parallel" 
}

// Spawn the System Designer agent with coordination protocol
Task(`You are the System Designer agent in a coordinated swarm.

MANDATORY COORDINATION:
1. START: Run \`npx claude-flow@alpha hooks pre-task --description "Design system architecture"\`
2. DURING: After EVERY file operation, run \`npx claude-flow@alpha hooks post-edit --file "[file]" --memory-key "design/architecture/[step]"\`
3. MEMORY: Store ALL decisions using \`npx claude-flow@alpha hooks notification --message "[decision]"\`
4. END: Run \`npx claude-flow@alpha hooks post-task --task-id "REQ-001" --analyze-performance true\`

Your specific task: Design the overall architecture for ${prd.project.name}, including:
- System components and their interactions
- Authentication flow using JWT
- API endpoint structure
- Database schema design

Use the project requirements and constraints stored in memory.

REMEMBER: Coordinate with other agents by checking memory BEFORE making decisions!`)

// Spawn the API Developer agent with coordination protocol
Task(`You are the API Developer agent in a coordinated swarm.

MANDATORY COORDINATION:
1. START: Run \`npx claude-flow@alpha hooks pre-task --description "Implement API endpoints"\`
2. DURING: After EVERY file operation, run \`npx claude-flow@alpha hooks post-edit --file "[file]" --memory-key "api/endpoints/[step]"\`
3. MEMORY: Store ALL decisions using \`npx claude-flow@alpha hooks notification --message "[decision]"\`
4. END: Run \`npx claude-flow@alpha hooks post-task --task-id "REQ-002" --analyze-performance true\`

Your specific task: Implement the API endpoints for ${prd.project.name}, including:
- User authentication endpoints
- CRUD operations for user profiles
- Role-based access control
- Error handling and validation

Use the project requirements, architecture decisions, and database schema stored in memory.

REMEMBER: Coordinate with other agents by checking memory BEFORE making decisions!`)
```

## 7. Run Your First Swarm in Claude Code

1. Open Claude Code
2. Navigate to your project directory
3. Open the `run-swarm.js` file
4. Execute the code in a single message (this is critical for parallel execution)

## 8. Monitor Progress and Results

```bash
# Check swarm status
mcp__claude-flow__swarm_status { 
  detailed: true,
  metrics: true,
  agentActivity: true,
  memoryUsage: true,
  taskProgress: true
}

# Retrieve project architecture from memory
mcp__claude-flow__memory_usage { 
  action: "retrieve", 
  key: "project/architecture" 
}

# List all memory entries for the project
mcp__claude-flow__memory_usage { 
  action: "list", 
  pattern: "project/*" 
}
```

## 9. Common Issues and Solutions

### API Key Not Found

If you get an error about the API key not being found:

```bash
# Check if the API key is set
echo $ANTHROPIC_API_KEY

# If it's not set or incorrect, set it again
export ANTHROPIC_API_KEY=your_api_key_here
```

### MCP Server Not Found

If Claude Code can't find the MCP server:

```bash
# Check if the MCP server is added
claude mcp list

# If it's not listed, add it again
claude mcp add claude-flow npx claude-flow@alpha mcp start
```

### Agents Not Coordinating

If agents aren't coordinating properly:

1. Make sure you're executing all code in a single message
2. Verify that all agents are using the coordination protocol with hooks
3. Check that the memory is being properly stored and retrieved

## 10. Next Steps

- Explore different swarm topologies (hierarchical, mesh, adaptive)
- Try different agent types for specialized tasks
- Experiment with more complex PRDs
- Use memory persistence for cross-session coordination

For more detailed information, refer to the [Claude-Flow Implementation Guide](claude-flow-implementation-guide.md) and [Robust Flow Coordination Example](robust-flow-coordination.js).

