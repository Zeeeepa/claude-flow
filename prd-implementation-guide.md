# PRD Implementation Guide for Claude-Flow

This guide explains how to format, input, and implement Product Requirements Documents (PRDs) with Claude-Flow.

## What is a PRD?

A Product Requirements Document (PRD) outlines the requirements, features, and functionality of a product or project. In the context of Claude-Flow, a PRD serves as the foundation for AI agents to understand what needs to be built.

## PRD Format for Claude-Flow

Claude-Flow works best with structured PRDs in JSON format. Here's the recommended structure:

```json
{
  "project": {
    "name": "Project Name",
    "description": "Brief project description",
    "version": "1.0.0"
  },
  "requirements": [
    {
      "id": "REQ-001",
      "description": "Requirement description",
      "priority": "high|medium|low",
      "category": "functional|non-functional|technical",
      "acceptance_criteria": [
        "Criterion 1",
        "Criterion 2"
      ]
    }
  ],
  "constraints": [
    "Constraint 1",
    "Constraint 2"
  ],
  "deliverables": [
    "Deliverable 1",
    "Deliverable 2"
  ],
  "timeline": {
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD",
    "milestones": [
      {
        "name": "Milestone 1",
        "date": "YYYY-MM-DD"
      }
    ]
  }
}
```

### Required Fields

- `project.name`: Name of the project
- `project.description`: Brief description of the project
- `requirements`: Array of requirement objects
  - `id`: Unique identifier for the requirement
  - `description`: Description of the requirement
  - `priority`: Priority level (high, medium, low)

### Optional Fields

- `project.version`: Version of the PRD
- `requirements[].category`: Category of the requirement
- `requirements[].acceptance_criteria`: Criteria for accepting the requirement as complete
- `constraints`: Array of project constraints
- `deliverables`: Array of expected deliverables
- `timeline`: Project timeline information

## Creating a PRD

### Option 1: Manual Creation

1. Create a JSON file (e.g., `prd.json`) with the structure above
2. Fill in the required fields
3. Add optional fields as needed

### Option 2: PRD Generator

Claude-Flow includes a PRD generator to help you create structured PRDs:

```bash
# Generate a PRD template
claude-flow generate prd --output prd.json

# Generate a PRD with basic information
claude-flow generate prd --name "My Project" --description "Project description" --output prd.json
```

### Option 3: Convert from Text

If you have a text-based PRD, you can convert it to the required JSON format:

```bash
# Convert a text PRD to JSON
claude-flow convert prd --input text-prd.md --output prd.json
```

## PRD Examples

### Simple API Project

```json
{
  "project": {
    "name": "User Management API",
    "description": "A RESTful API for user management",
    "version": "1.0.0"
  },
  "requirements": [
    {
      "id": "REQ-001",
      "description": "User registration with email verification",
      "priority": "high",
      "category": "functional",
      "acceptance_criteria": [
        "Users can register with email and password",
        "Verification email is sent",
        "Account is activated after verification"
      ]
    },
    {
      "id": "REQ-002",
      "description": "User authentication with JWT",
      "priority": "high",
      "category": "functional",
      "acceptance_criteria": [
        "Users can log in with email and password",
        "JWT token is issued on successful login",
        "Token includes user roles and permissions"
      ]
    },
    {
      "id": "REQ-003",
      "description": "Password reset functionality",
      "priority": "medium",
      "category": "functional",
      "acceptance_criteria": [
        "Users can request password reset",
        "Reset link is sent to email",
        "Password can be reset with valid link"
      ]
    },
    {
      "id": "REQ-004",
      "description": "User profile management",
      "priority": "medium",
      "category": "functional",
      "acceptance_criteria": [
        "Users can view their profile",
        "Users can update their profile",
        "Users can delete their account"
      ]
    },
    {
      "id": "REQ-005",
      "description": "API documentation with OpenAPI",
      "priority": "low",
      "category": "non-functional",
      "acceptance_criteria": [
        "All endpoints are documented",
        "Documentation is accessible via Swagger UI",
        "Examples are provided for each endpoint"
      ]
    }
  ],
  "constraints": [
    "Must use Express.js for the API",
    "Must use PostgreSQL for the database",
    "Must implement JWT authentication",
    "Must follow RESTful API design principles"
  ],
  "deliverables": [
    "API server code",
    "Database schema",
    "API documentation",
    "Unit tests",
    "Integration tests"
  ],
  "timeline": {
    "start_date": "2023-01-01",
    "end_date": "2023-01-15",
    "milestones": [
      {
        "name": "Architecture Design",
        "date": "2023-01-03"
      },
      {
        "name": "Core Implementation",
        "date": "2023-01-10"
      },
      {
        "name": "Testing and Documentation",
        "date": "2023-01-15"
      }
    ]
  }
}
```

### Web Application Project

```json
{
  "project": {
    "name": "Task Management Web App",
    "description": "A web application for task management with team collaboration features",
    "version": "1.0.0"
  },
  "requirements": [
    {
      "id": "REQ-001",
      "description": "User authentication and authorization",
      "priority": "high",
      "category": "functional",
      "acceptance_criteria": [
        "Users can register and log in",
        "Different user roles (admin, manager, member)",
        "Role-based access control"
      ]
    },
    {
      "id": "REQ-002",
      "description": "Task creation and management",
      "priority": "high",
      "category": "functional",
      "acceptance_criteria": [
        "Users can create tasks with title, description, due date",
        "Tasks can be assigned to team members",
        "Tasks can be categorized and prioritized"
      ]
    },
    {
      "id": "REQ-003",
      "description": "Team collaboration features",
      "priority": "medium",
      "category": "functional",
      "acceptance_criteria": [
        "Users can create and join teams",
        "Team members can collaborate on tasks",
        "Activity feed for team actions"
      ]
    },
    {
      "id": "REQ-004",
      "description": "Responsive design for mobile and desktop",
      "priority": "medium",
      "category": "non-functional",
      "acceptance_criteria": [
        "UI adapts to different screen sizes",
        "All features accessible on mobile devices",
        "Touch-friendly interface"
      ]
    },
    {
      "id": "REQ-005",
      "description": "Notifications system",
      "priority": "low",
      "category": "functional",
      "acceptance_criteria": [
        "Email notifications for task assignments",
        "In-app notifications for updates",
        "Notification preferences management"
      ]
    }
  ],
  "constraints": [
    "Must use React for frontend",
    "Must use Node.js and Express for backend",
    "Must use MongoDB for database",
    "Must be deployable to AWS"
  ],
  "deliverables": [
    "Frontend code",
    "Backend API",
    "Database schema",
    "Documentation",
    "Deployment scripts"
  ]
}
```

## Implementing PRD with Claude-Flow

### 1. Store PRD in Memory

First, store your PRD in Claude-Flow's memory system:

```javascript
// Import the PRD
const prd = require('./prd.json');

// Store PRD in memory
mcp__claude-flow__memory_usage { 
  action: "store", 
  key: "project/requirements", 
  value: prd
}
```

### 2. Create Todos from Requirements

Convert PRD requirements to todos:

```javascript
// Create todos based on PRD requirements
TodoWrite { todos: prd.requirements.map((req, index) => ({
  id: req.id,
  content: req.description,
  status: index === 0 ? "in_progress" : "pending",
  priority: req.priority
}))}
```

### 3. Initialize Swarm with PRD Context

Initialize a swarm with the appropriate topology and agents:

```javascript
// Initialize swarm
mcp__claude-flow__swarm_init { 
  topology: "hierarchical", 
  maxAgents: prd.requirements.length > 5 ? 8 : 5, 
  strategy: "specialized" 
}

// Spawn specialized agents based on PRD requirements
mcp__claude-flow__agent_spawn { type: "architect", name: "System Designer" }
mcp__claude-flow__agent_spawn { type: "coder", name: "API Developer" }
mcp__claude-flow__agent_spawn { type: "analyst", name: "DB Designer" }
mcp__claude-flow__agent_spawn { type: "tester", name: "QA Engineer" }
mcp__claude-flow__agent_spawn { type: "coordinator", name: "Project Manager" }

// Orchestrate the task with PRD information
mcp__claude-flow__task_orchestrate { 
  task: `Build ${prd.project.name}: ${prd.project.description}`, 
  strategy: "parallel" 
}
```

### 4. Provide PRD Context to Agents

When spawning task agents, include PRD information in their instructions:

```javascript
// Spawn the System Designer agent with PRD context
Task(`You are the System Designer agent in a coordinated swarm.

MANDATORY COORDINATION:
1. START: Run \`npx claude-flow@alpha hooks pre-task --description "Design system architecture"\`
2. DURING: After EVERY file operation, run \`npx claude-flow@alpha hooks post-edit --file "[file]" --memory-key "design/architecture/[step]"\`
3. MEMORY: Store ALL decisions using \`npx claude-flow@alpha hooks notification --message "[decision]"\`
4. END: Run \`npx claude-flow@alpha hooks post-task --task-id "${prd.requirements[0].id}" --analyze-performance true\`

Your specific task: Design the overall architecture for ${prd.project.name}, including:
- System components and their interactions
- Authentication flow
- API endpoint structure
- Database schema design

Project Description: ${prd.project.description}

Requirements:
${prd.requirements.map(req => `- ${req.id}: ${req.description} (${req.priority})`).join('\n')}

Constraints:
${prd.constraints.map(constraint => `- ${constraint}`).join('\n')}

REMEMBER: Coordinate with other agents by checking memory BEFORE making decisions!`)
```

### 5. Track PRD Implementation Progress

Monitor the implementation progress:

```javascript
// Check implementation progress
mcp__claude-flow__task_status { 
  taskId: prd.requirements[0].id,
  detailed: true,
  includeSubtasks: true,
  includeMetrics: true
}

// Get implementation results
mcp__claude-flow__task_results { 
  taskId: prd.requirements[0].id,
  format: "detailed",
  includeArtifacts: true
}
```

## Best Practices for PRD Implementation

1. **Be Specific**: Provide clear, specific requirements with measurable acceptance criteria

2. **Prioritize**: Clearly indicate the priority of each requirement

3. **Include Constraints**: List all technical, business, and resource constraints

4. **Define Deliverables**: Clearly specify what deliverables are expected

5. **Use Consistent IDs**: Use a consistent ID format for requirements (e.g., REQ-001)

6. **Update Regularly**: Keep the PRD updated as requirements change

7. **Validate Requirements**: Ensure requirements are feasible and aligned with project goals

8. **Include Examples**: Provide examples or mockups where appropriate

9. **Consider Dependencies**: Identify dependencies between requirements

10. **Involve Stakeholders**: Get feedback from stakeholders on the PRD

## Troubleshooting PRD Implementation

### PRD Not Found in Memory

If agents can't access the PRD in memory:

```javascript
// Check if PRD is stored in memory
mcp__claude-flow__memory_usage { 
  action: "list", 
  pattern: "project/*" 
}

// If not found, store it again
mcp__claude-flow__memory_usage { 
  action: "store", 
  key: "project/requirements", 
  value: prd
}
```

### Requirements Not Being Implemented

If requirements aren't being implemented:

1. Check that todos are created correctly
2. Verify that agents have access to the PRD
3. Ensure that the task orchestration is properly configured
4. Check that agents are following the coordination protocol

### Inconsistent Implementation

If implementation is inconsistent with the PRD:

1. Make sure the PRD is clear and specific
2. Verify that agents are referencing the PRD in their decisions
3. Use the memory system to store and retrieve implementation decisions
4. Implement validation checks against the PRD requirements

## Next Steps

Now that you understand how to implement PRDs with Claude-Flow, you can:

1. [Create your first PRD](quick-start-guide.md)
2. [Explore example projects](examples/)
3. [Learn about advanced coordination patterns](robust-flow-coordination.js)

