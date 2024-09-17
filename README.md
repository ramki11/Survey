# Full Stack FastAPI Template

<a href="https://github.com/fastapi/full-stack-fastapi-template/actions?query=workflow%3ATest" target="_blank"><img src="https://github.com/fastapi/full-stack-fastapi-template/workflows/Test/badge.svg" alt="Test"></a>
<a href="https://coverage-badge.samuelcolvin.workers.dev/redirect/fastapi/full-stack-fastapi-template" target="_blank"><img src="https://coverage-badge.samuelcolvin.workers.dev/fastapi/full-stack-fastapi-template.svg" alt="Coverage"></a>

## Project Technologies 
original template of a project (https://github.com/fastapi/full-stack-fastapi-template)

Backend
⚡ [**FastAPI**]: Framework for the Python backend API.(https://fastapi.tiangolo.com)
🧰 [SQLModel]: ORM for SQL database interactions.(https://sqlmodel.tiangolo.com)
🔍 [Pydantic]: Data validation & settings management used by FastAPI.(https://docs.pydantic.dev)
💾 [PostgreSQL]: SQL database.(https://www.postgresql.org)
🔒 Secure password hashing by default.
🔑 JWT (JSON Web Token) authentication.
📫 Email-based password recovery.
✅ Tests with [Pytest].(https://pytest.org)
* Backend docs: [backend/README.md](./backend/README.md).


Frontend
🚀 [React]: Frontend framework.(https://react.dev)
💃 TypeScript: For type safety.
🔧 Hooks: For state and lifecycle management.
⚡ [Vite]: Build tool for fast development.(https://vitejs.dev/)
🎨 [ChakraUI]: UI component library.
🔍 [TanStackQuery]: Powerful data fetching & state management tool.(https://tanstack.com/query)
🗺️ [TanStackRouter]: Routing solution for managing navigation and URLs.(https://tanstack.com/router)
🤖 Automatically generated frontend client.
🧪 [Playwright]: End-to-End testing.
🦇 Dark mode support.
* Frontend docs: [frontend/README.md](./frontend/README.md).


DevOps and Deployment
🐋 [DockerCompose]: For development and production environments. (https://www.docker.com)
📞 [Traefik]: Reverse proxy and load balancer.(https://traefik.io)
🚢 Deployment instructions: Includes setup for frontend Traefik proxy and automatic HTTPS certificates.
🏭 CI/CD: Continuous Integration and Continuous Deployment using GitHub Actions.
* General development docs: [development.md](./development.md).
* Deployment docs: [deployment.md](./deployment.md).


Release Notes
* [release-notes.md](./release-notes.md).

### License
The Full Stack FastAPI Template is licensed under the terms of the MIT license.


## Installation
To get started with this project, follow these steps:
✨ It just works. ✨

1. Clone the Repository
```bash
git clone https://github.com/your-repo/project.git
```
2. Open your project in VS Code

* If you need to maintain a private repository and want to allow others to use it without forking, you can use the following approach: [PrivateRepo.md]


# Set Up the Backend
1. Navigate to the backend folder
```bash
cd backend
```
2. Install dependencies and set up the environment:
```bash
# For Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
```


# Set Up Frontend
1. Navigate to the frontend directory:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```

# Run the Project
To run the project successfully, you must start both the Frontend and Backend services simultaneously.
If you run only one of them, you will encounter network errors. Ensure that both services are running to avoid connectivity issues.

1. Start the Backend:
```bash
cd backend
docker-compose up -d
```
2. Start the Frontend:
```bash
npm run dev
```

# Verify Installation
 * Ensure the backend is running by visiting http://localhost:8000 
 * Ensure the frontend is running by visiting http://localhost:5173/




### Dashboard Login

[![API docs](img/login.png)](https://github.com/fastapi/full-stack-fastapi-template)

### Dashboard - Admin

[![API docs](img/dashboard.png)](https://github.com/fastapi/full-stack-fastapi-template)

### Dashboard - Create User

[![API docs](img/dashboard-create.png)](https://github.com/fastapi/full-stack-fastapi-template)

### Dashboard - Items

[![API docs](img/dashboard-items.png)](https://github.com/fastapi/full-stack-fastapi-template)

### Dashboard - User Settings

[![API docs](img/dashboard-user-settings.png)](https://github.com/fastapi/full-stack-fastapi-template)

### Dashboard - Dark Mode

[![API docs](img/dashboard-dark.png)](https://github.com/fastapi/full-stack-fastapi-template)

### Interactive API Documentation

[![API docs](img/docs.png)](https://github.com/fastapi/full-stack-fastapi-template)

