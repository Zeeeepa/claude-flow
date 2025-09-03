# Simple API Project Example

This example demonstrates how to use Claude-Flow to build a simple REST API for user management.

## 1. Project Requirements (PRD)

Create a file named `prd.json` with the following content:

```json
{
  "project": {
    "name": "User Management API",
    "description": "A RESTful API for user management with authentication",
    "version": "1.0.0"
  },
  "requirements": [
    {
      "id": "REQ-001",
      "description": "User authentication with JWT",
      "priority": "high",
      "category": "functional",
      "acceptance_criteria": [
        "Users can register with email and password",
        "Users can log in and receive a JWT token",
        "Protected routes require valid JWT"
      ]
    },
    {
      "id": "REQ-002",
      "description": "User profile CRUD operations",
      "priority": "high",
      "category": "functional",
      "acceptance_criteria": [
        "Users can create their profile",
        "Users can read their profile",
        "Users can update their profile",
        "Users can delete their profile"
      ]
    },
    {
      "id": "REQ-003",
      "description": "Role-based access control",
      "priority": "medium",
      "category": "functional",
      "acceptance_criteria": [
        "Users can have different roles (admin, user)",
        "Certain operations are restricted by role",
        "Admins can manage other users"
      ]
    },
    {
      "id": "REQ-004",
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
    "Must use MongoDB for the database",
    "Must implement JWT authentication",
    "Must follow RESTful API design principles"
  ],
  "deliverables": [
    "API server code",
    "Database schema",
    "API documentation",
    "Unit tests"
  ]
}
```

## 2. Project Setup

Create a new directory and initialize the project:

```bash
# Create project directory
mkdir user-api
cd user-api

# Initialize npm project
npm init -y

# Create basic directory structure
mkdir -p src/{models,routes,controllers,middleware,utils,config}
mkdir -p tests/{unit,integration}
```

## 3. Claude-Flow Implementation Script

Create a file named `implement-api.js` with the following content:

```javascript
// Import the PRD
const prd = require('./prd.json');

// Initialize a swarm with a mesh topology
mcp__claude-flow__swarm_init { 
  topology: "mesh", 
  maxAgents: 5, 
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
1. START: Run \`npx claude-flow@alpha hooks pre-task --description "Design API architecture"\`
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
- User authentication endpoints (register, login)
- User profile CRUD operations
- Role-based access control
- Error handling and validation

Use the project requirements, architecture decisions, and database schema stored in memory.

REMEMBER: Coordinate with other agents by checking memory BEFORE making decisions!`)

// Spawn the DB Designer agent with coordination protocol
Task(`You are the DB Designer agent in a coordinated swarm.

MANDATORY COORDINATION:
1. START: Run \`npx claude-flow@alpha hooks pre-task --description "Design database schema"\`
2. DURING: After EVERY file operation, run \`npx claude-flow@alpha hooks post-edit --file "[file]" --memory-key "db/schema/[step]"\`
3. MEMORY: Store ALL decisions using \`npx claude-flow@alpha hooks notification --message "[decision]"\`
4. END: Run \`npx claude-flow@alpha hooks post-task --task-id "REQ-002" --analyze-performance true\`

Your specific task: Design the database schema for ${prd.project.name}, including:
- User model with authentication fields
- Profile model with user details
- Role model for access control
- Relationships between models
- Indexes for performance optimization

Use the project requirements and architecture decisions stored in memory.

REMEMBER: Coordinate with other agents by checking memory BEFORE making decisions!`)

// Create package.json with required dependencies
Write("package.json", `{
  "name": "user-management-api",
  "version": "1.0.0",
  "description": "A RESTful API for user management with authentication",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {
    "bcrypt": "^5.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.1.0",
    "morgan": "^1.10.0",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^4.6.3"
  },
  "devDependencies": {
    "eslint": "^8.40.0",
    "jest": "^29.5.0",
    "nodemon": "^2.0.22",
    "supertest": "^6.3.3"
  }
}`)

// Create .env.example file
Write(".env.example", `# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/user-api

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# Logging Configuration
LOG_LEVEL=info`)

// Create README.md
Write("README.md", `# User Management API

A RESTful API for user management with authentication.

## Features

- User authentication with JWT
- User profile CRUD operations
- Role-based access control
- API documentation with OpenAPI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Copy \`.env.example\` to \`.env\` and update the values
4. Start the server: \`npm start\`

## API Documentation

API documentation is available at \`/api-docs\` when the server is running.

## Testing

Run tests with: \`npm test\`

## License

MIT
`)
```

## 4. Run the Implementation

1. Open Claude Code
2. Navigate to your project directory
3. Open the `implement-api.js` file
4. Execute the code in a single message

## 5. Expected Output

After running the implementation, you should have:

1. A complete Express.js API with:
   - User authentication (register, login)
   - User profile CRUD operations
   - Role-based access control
   - API documentation with Swagger

2. The following file structure:

```
user-api/
├── .env.example
├── package.json
├── README.md
├── prd.json
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── index.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── roleCheck.js
│   ├── models/
│   │   ├── User.js
│   │   └── Role.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── validation.js
│   └── index.js
└── tests/
    ├── integration/
    │   ├── auth.test.js
    │   └── user.test.js
    └── unit/
        ├── authController.test.js
        └── userController.test.js
```

## 6. Testing the API

Once the implementation is complete, you can test the API:

```bash
# Install dependencies
npm install

# Start the server
npm run dev
```

Then, you can use tools like Postman or curl to test the API endpoints:

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"Test User"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Get User Profile

```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update User Profile

```bash
curl -X PUT http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","bio":"This is my bio"}'
```

## 7. Next Steps

After completing this example, you can:

1. Add more features to the API
2. Implement a frontend client
3. Deploy the API to a cloud provider
4. Add more comprehensive tests
5. Implement CI/CD pipelines

