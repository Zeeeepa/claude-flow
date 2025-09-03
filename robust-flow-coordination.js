/**
 * Claude-Flow Alpha93 - Robust Flow Coordination Patterns
 * 
 * This script demonstrates the most robust coordination patterns
 * for Claude-Flow, focusing on parallel execution, memory persistence,
 * and agent coordination.
 */

// =========================================================
// 1. SWARM INITIALIZATION WITH OPTIMAL TOPOLOGY
// =========================================================

// Initialize a hierarchical swarm for complex project development
mcp__claude-flow__swarm_init { 
  topology: "hierarchical",  // Options: hierarchical, mesh, adaptive, ring
  maxAgents: 8,              // Optimal range: 5-12 based on task complexity
  strategy: "specialized",   // Options: specialized, balanced, dynamic
  autoScale: true,           // Automatically adjust agent count based on task
  memoryPersistence: true,   // Enable cross-session memory
  neuralEnabled: true,       // Enable neural pattern learning
  performanceTracking: true  // Enable performance metrics
}

// =========================================================
// 2. AGENT SPAWNING WITH SPECIALIZED CAPABILITIES
// =========================================================

// Spawn a system architect for high-level design
mcp__claude-flow__agent_spawn { 
  type: "architect", 
  name: "System Designer",
  capabilities: ["system-design", "architecture", "planning"],
  priority: "high",
  memoryNamespace: "design"
}

// Spawn a backend developer for API implementation
mcp__claude-flow__agent_spawn { 
  type: "backend-dev", 
  name: "API Developer",
  capabilities: ["rest-api", "authentication", "database"],
  priority: "high",
  memoryNamespace: "api"
}

// Spawn a database specialist for schema design
mcp__claude-flow__agent_spawn { 
  type: "analyst", 
  name: "DB Designer",
  capabilities: ["database-schema", "optimization", "data-modeling"],
  priority: "high",
  memoryNamespace: "database"
}

// Spawn a tester for comprehensive testing
mcp__claude-flow__agent_spawn { 
  type: "tester", 
  name: "QA Engineer",
  capabilities: ["unit-testing", "integration-testing", "e2e-testing"],
  priority: "medium",
  memoryNamespace: "testing"
}

// Spawn a documentation specialist
mcp__claude-flow__agent_spawn { 
  type: "api-docs", 
  name: "Documentation Specialist",
  capabilities: ["openapi", "markdown", "documentation"],
  priority: "medium",
  memoryNamespace: "docs"
}

// Spawn a coordinator for project management
mcp__claude-flow__agent_spawn { 
  type: "coordinator", 
  name: "Project Manager",
  capabilities: ["coordination", "planning", "monitoring"],
  priority: "high",
  memoryNamespace: "coordination"
}

// =========================================================
// 3. TASK ORCHESTRATION WITH PARALLEL EXECUTION
// =========================================================

// Orchestrate the main task with parallel execution
mcp__claude-flow__task_orchestrate { 
  task: "Build a complete REST API with authentication, database, and documentation",
  strategy: "parallel",
  prioritization: "critical-path",
  dependencies: true,
  monitoring: true,
  adaptiveExecution: true
}

// =========================================================
// 4. MEMORY INITIALIZATION FOR CROSS-AGENT COORDINATION
// =========================================================

// Store project requirements in memory
mcp__claude-flow__memory_usage { 
  action: "store", 
  key: "project/requirements", 
  value: { 
    name: "REST API Project",
    description: "A complete REST API with authentication, database, and documentation",
    requirements: [
      "User authentication with JWT",
      "Role-based access control (RBAC)",
      "CRUD operations for users, posts, and comments",
      "PostgreSQL database with optimized schema",
      "Comprehensive test suite with >80% coverage",
      "OpenAPI documentation for all endpoints",
      "Performance monitoring and logging"
    ],
    constraints: [
      "Must use Express.js for the API",
      "Must use PostgreSQL for the database",
      "Must implement JWT authentication",
      "Must have comprehensive test coverage"
    ],
    timeline: {
      design: "1 day",
      implementation: "3 days",
      testing: "2 days",
      documentation: "1 day"
    }
  } 
}

// Store architecture decisions in memory
mcp__claude-flow__memory_usage { 
  action: "store", 
  key: "project/architecture", 
  value: { 
    components: [
      {
        name: "Authentication Service",
        responsibility: "Handle user authentication and authorization",
        technologies: ["JWT", "bcrypt", "passport"]
      },
      {
        name: "User Service",
        responsibility: "Manage user data and operations",
        technologies: ["Express", "PostgreSQL"]
      },
      {
        name: "Post Service",
        responsibility: "Manage post data and operations",
        technologies: ["Express", "PostgreSQL"]
      },
      {
        name: "Comment Service",
        responsibility: "Manage comment data and operations",
        technologies: ["Express", "PostgreSQL"]
      }
    ],
    dataFlow: [
      "Client → Authentication Service → User Service",
      "Client → Authentication Service → Post Service",
      "Client → Authentication Service → Comment Service"
    ],
    securityMeasures: [
      "JWT for authentication",
      "Role-based access control",
      "Input validation",
      "Rate limiting",
      "CORS configuration"
    ]
  } 
}

// =========================================================
// 5. COMPREHENSIVE TODO CREATION (BATCHED)
// =========================================================

// Create all todos in a single batch
TodoWrite { todos: [
  { id: "design-arch", content: "Design system architecture", status: "in_progress", priority: "high" },
  { id: "design-db", content: "Design database schema", status: "pending", priority: "high" },
  { id: "design-api", content: "Design API endpoints", status: "pending", priority: "high" },
  { id: "design-auth", content: "Design authentication flow", status: "pending", priority: "high" },
  
  { id: "impl-setup", content: "Set up project structure", status: "pending", priority: "high" },
  { id: "impl-db", content: "Implement database models", status: "pending", priority: "high" },
  { id: "impl-auth", content: "Implement authentication", status: "pending", priority: "high" },
  { id: "impl-user", content: "Implement user endpoints", status: "pending", priority: "high" },
  { id: "impl-post", content: "Implement post endpoints", status: "pending", priority: "high" },
  { id: "impl-comment", content: "Implement comment endpoints", status: "pending", priority: "medium" },
  
  { id: "test-unit", content: "Write unit tests", status: "pending", priority: "medium" },
  { id: "test-int", content: "Write integration tests", status: "pending", priority: "medium" },
  { id: "test-e2e", content: "Write end-to-end tests", status: "pending", priority: "medium" },
  
  { id: "docs-api", content: "Create OpenAPI documentation", status: "pending", priority: "low" },
  { id: "docs-readme", content: "Write project README", status: "pending", priority: "low" },
  { id: "docs-usage", content: "Create usage examples", status: "pending", priority: "low" },
  
  { id: "deploy-setup", content: "Set up deployment pipeline", status: "pending", priority: "medium" },
  { id: "deploy-config", content: "Configure environment variables", status: "pending", priority: "medium" },
  { id: "deploy-monitor", content: "Set up monitoring and logging", status: "pending", priority: "low" }
]}

// =========================================================
// 6. AGENT TASK SPAWNING WITH COORDINATION PROTOCOL
// =========================================================

// Spawn the System Architect agent with coordination protocol
Task(`You are the System Designer agent in a coordinated swarm.

MANDATORY COORDINATION:
1. START: Run \`npx claude-flow@alpha hooks pre-task --description "Design system architecture"\`
2. DURING: After EVERY file operation, run \`npx claude-flow@alpha hooks post-edit --file "[file]" --memory-key "design/architecture/[step]"\`
3. MEMORY: Store ALL decisions using \`npx claude-flow@alpha hooks notification --message "[decision]"\`
4. END: Run \`npx claude-flow@alpha hooks post-task --task-id "design-arch" --analyze-performance true\`

Your specific task: Design the overall architecture for a REST API with authentication, including:
- System components and their interactions
- Authentication flow using JWT
- API endpoint structure
- Security considerations

Use the project requirements and constraints stored in memory.

REMEMBER: Coordinate with other agents by checking memory BEFORE making decisions!`)

// Spawn the Database Designer agent with coordination protocol
Task(`You are the DB Designer agent in a coordinated swarm.

MANDATORY COORDINATION:
1. START: Run \`npx claude-flow@alpha hooks pre-task --description "Design database schema"\`
2. DURING: After EVERY file operation, run \`npx claude-flow@alpha hooks post-edit --file "[file]" --memory-key "database/schema/[step]"\`
3. MEMORY: Store ALL decisions using \`npx claude-flow@alpha hooks notification --message "[decision]"\`
4. END: Run \`npx claude-flow@alpha hooks post-task --task-id "design-db" --analyze-performance true\`

Your specific task: Design the database schema for the REST API, including:
- Entity-relationship diagram
- Table definitions with columns and data types
- Indexes for performance optimization
- Foreign key relationships
- Migration strategy

Use the project requirements and architecture decisions stored in memory.

REMEMBER: Coordinate with other agents by checking memory BEFORE making decisions!`)

// Spawn the API Developer agent with coordination protocol
Task(`You are the API Developer agent in a coordinated swarm.

MANDATORY COORDINATION:
1. START: Run \`npx claude-flow@alpha hooks pre-task --description "Design API endpoints"\`
2. DURING: After EVERY file operation, run \`npx claude-flow@alpha hooks post-edit --file "[file]" --memory-key "api/endpoints/[step]"\`
3. MEMORY: Store ALL decisions using \`npx claude-flow@alpha hooks notification --message "[decision]"\`
4. END: Run \`npx claude-flow@alpha hooks post-task --task-id "design-api" --analyze-performance true\`

Your specific task: Design the API endpoints for the REST API, including:
- Endpoint definitions with HTTP methods and paths
- Request and response formats
- Authentication and authorization requirements
- Error handling
- Rate limiting and other API policies

Use the project requirements, architecture decisions, and database schema stored in memory.

REMEMBER: Coordinate with other agents by checking memory BEFORE making decisions!`)

// Spawn the QA Engineer agent with coordination protocol
Task(`You are the QA Engineer agent in a coordinated swarm.

MANDATORY COORDINATION:
1. START: Run \`npx claude-flow@alpha hooks pre-task --description "Plan test strategy"\`
2. DURING: After EVERY file operation, run \`npx claude-flow@alpha hooks post-edit --file "[file]" --memory-key "testing/strategy/[step]"\`
3. MEMORY: Store ALL decisions using \`npx claude-flow@alpha hooks notification --message "[decision]"\`
4. END: Run \`npx claude-flow@alpha hooks post-task --task-id "test-plan" --analyze-performance true\`

Your specific task: Plan the testing strategy for the REST API, including:
- Unit testing approach
- Integration testing approach
- End-to-end testing approach
- Test coverage goals
- Testing tools and frameworks

Use the project requirements, architecture decisions, and API endpoint designs stored in memory.

REMEMBER: Coordinate with other agents by checking memory BEFORE making decisions!`)

// =========================================================
// 7. PROJECT SETUP WITH PARALLEL FILE OPERATIONS
// =========================================================

// Create project directories in parallel
Bash(`mkdir -p api/{src,tests,docs,config}
mkdir -p api/src/{models,controllers,routes,middleware,services,utils}
mkdir -p api/tests/{unit,integration,e2e}
mkdir -p api/docs/{api,guides,examples}`)

// Create initial files in parallel
Write("api/package.json", `{
  "name": "rest-api-project",
  "version": "1.0.0",
  "description": "A complete REST API with authentication, database, and documentation",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest",
    "test:unit": "jest --testPathPattern=tests/unit",
    "test:integration": "jest --testPathPattern=tests/integration",
    "test:e2e": "jest --testPathPattern=tests/e2e",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "nodemon": "^3.0.2",
    "eslint": "^8.56.0",
    "prettier": "^3.1.1"
  }
}`)

Write("api/.env.example", `# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rest_api_db
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# Logging Configuration
LOG_LEVEL=info

# CORS Configuration
CORS_ORIGIN=http://localhost:3000`)

Write("api/README.md", `# REST API Project

A complete REST API with authentication, database, and documentation.

## Features

- User authentication with JWT
- Role-based access control (RBAC)
- CRUD operations for users, posts, and comments
- PostgreSQL database with optimized schema
- Comprehensive test suite with >80% coverage
- OpenAPI documentation for all endpoints
- Performance monitoring and logging

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)

### Installation

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Copy \`.env.example\` to \`.env\` and update the values
4. Run database migrations: \`npm run migrate\`
5. Start the server: \`npm start\`

## API Documentation

API documentation is available at \`/api-docs\` when the server is running.

## Testing

- Run all tests: \`npm test\`
- Run unit tests: \`npm run test:unit\`
- Run integration tests: \`npm run test:integration\`
- Run end-to-end tests: \`npm run test:e2e\`

## License

MIT
`)

Write("api/src/index.js", `require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { setupRoutes } = require('./routes');
const { setupMiddleware } = require('./middleware');
const { setupErrorHandling } = require('./middleware/errorHandling');
const { connectToDatabase } = require('./utils/database');
const { logger } = require('./utils/logger');

const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Setup custom middleware
setupMiddleware(app);

// Setup routes
setupRoutes(app);

// Error handling middleware
setupErrorHandling(app);

// Connect to database and start server
async function startServer() {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      logger.info(\`Server running on port \${port}\`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;`)

// =========================================================
// 8. PERFORMANCE MONITORING AND STATUS TRACKING
// =========================================================

// Monitor swarm performance
mcp__claude-flow__swarm_status { 
  detailed: true,
  metrics: true,
  agentActivity: true,
  memoryUsage: true,
  taskProgress: true
}

// Track neural pattern effectiveness
mcp__claude-flow__neural_status {
  patterns: true,
  effectiveness: true,
  learningRate: true,
  adaptations: true
}

// =========================================================
// 9. MEMORY RETRIEVAL FOR COORDINATION
// =========================================================

// Retrieve project requirements for coordination
mcp__claude-flow__memory_usage { 
  action: "retrieve", 
  key: "project/requirements" 
}

// Retrieve architecture decisions for coordination
mcp__claude-flow__memory_usage { 
  action: "retrieve", 
  key: "project/architecture" 
}

// List all memory entries for the project
mcp__claude-flow__memory_usage { 
  action: "list", 
  pattern: "project/*" 
}

// =========================================================
// 10. TASK COMPLETION AND REPORTING
// =========================================================

// Get task status and results
mcp__claude-flow__task_status { 
  taskId: "design-arch",
  detailed: true,
  includeSubtasks: true,
  includeMetrics: true
}

// Get task results
mcp__claude-flow__task_results { 
  taskId: "design-arch",
  format: "detailed",
  includeArtifacts: true
}

// Run performance benchmarks
mcp__claude-flow__benchmark_run { 
  type: "comprehensive",
  metrics: ["time", "memory", "tokens", "quality"],
  compare: true,
  baseline: "previous"
}

// =========================================================
// END OF ROBUST FLOW COORDINATION PATTERNS
// =========================================================

