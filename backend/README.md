### FastAPI PROJECT! Backend guide 

## Project Technologies 

Backend
⚡ [**FastAPI**]: Framework for the Python backend API.(https://fastapi.tiangolo.com)
🧰 [SQLModel]: ORM for SQL database interactions.(https://sqlmodel.tiangolo.com)
🔍 [Pydantic]: Data validation & settings management used by FastAPI.(https://docs.pydantic.dev)
💾 [PostgreSQL]: SQL database.(https://www.postgresql.org)
🔒 Secure password hashing by default.
🔑 JWT (JSON Web Token) authentication.
📫 Email-based password recovery.
✅ Tests with [Pytest].(https://pytest.org)
[Docker]:A platform for developing, shipping, and running applications in isolated containers.
(https://www.docker.com/)
[Poetry]: A tool for Python package and environment management, facilitating dependency management and packaging. (https://python-poetry.org/) 
* Backend docs: [backend/README.md](./backend/README.md).


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
3.  Start the Backend:
```bash
docker-compose up -d
```


### Backend Local Development 

Requirements:
* [Docker]:A platform for developing, shipping, and running applications in isolated containers.
(https://www.docker.com/)
* [Poetry]: A tool for Python package and environment management, facilitating dependency management and packaging. (https://python-poetry.org/) 
* Make sure your VS Code is using the correct Python virtual environment.

1. Setup Environment Configuration
Create a .env file for local development. Copy the `.env.example` file in the project root to get started:
```bash
cp .env.example .env
```

2. Start Services 
Use Docker Compose to start the stack:
```bash
docker compose up -d
```

3. Access Services
Open your browser, where you can access various services through the following URLs:

* Frontend: http://localhost (built with Docker,routes handled based on the path)
* Backend API: http://localhost/api/ (JSON web API based on OpenAPI)
* Swagger UI: http://localhost/docs (automatic interactive documentation)
* Adminer: http://localhost:8080 (database web administration)
* Traefik UI: http://localhost:8090 (to see how the routes are being handled by the proxy)


**Note**: The first time you start your stack, it might take a minute for it to be ready. While the backend waits for the database to be ready and configures everything. You can check the logs to monitor it.

4. Monitor Logs
Check logs to monitor service status:
```bash
docker compose logs
```

For specific service logs, e.g., backend:
```bash
docker compose logs backend
```

* If your Docker is not running in `localhost` (the URLs above wouldn't work) you would need to use the IP or domain where your Docker is running.



## Dependency Management & Workflow

# Install and Use pipx for Global Python Applications

1. Install pipx (if not already installed):
```bash
python -m pip install --user pipx
python -m pipx ensurepath
```
2. Install an application with pipx:
For example, to install httpie:
```bash
pipx install httpie
```
* pipx is used for installing Python applications globally in isolated environments, separate from your project's dependencies managed by Poetry.

# Install dependencies using Poetry:
```bash
poetry install
```

Start a Poetry shell session:
```bash
poetry shell
```

# Configure PostgreSQL Environment Variables
Add PostgreSQL Environment Variables:

- Ensure that the following environment variables are set for PostgreSQL configuration:
POSTGRES_USER: The username for PostgreSQL.
POSTGRES_PASSWORD: The password for PostgreSQL.

- These variables should be added to your environment configuration files or set directly in your development environment. This ensures that the PostgreSQL service can authenticate and connect properly.


# Development Workflow
- Modify or add models in ./backend/app/models.py
- Add API endpoints in ./backend/app/api/
- Update CRUD utilities in ./backend/app/crud.py


# VS Code Configuration
- Utilize VS Code configurations for debugging and running tests.



## Docker Installation and Setup

# Create Docker Compose File
Create a Docker Compose File: In your project directory, create a docker-compose.yml file. This file will define your PostgreSQL service and any other services you need.

# Install Docker (https://www.docker.com/)
1. Start Docker:
Ensure Docker is running. On Windows and Mac, Docker Desktop should start automatically. On Linux, you might need to start the Docker service manually:
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

# Verify Docker Installation:
1. Check Docker Version: Confirm that Docker is installed and running by checking the version:
```bash
docker --version
```
2. Run a Test Container: Verify Docker is working by running a test container:
```bash
docker run hello-world
```


# Start Docker Stack:
Use Docker Compose: Start your Docker stack by running:
```bash
docker compose up -d
```
# Verify Docker Services:
1. Check Running Containers: Confirm that your PostgreSQL container is running:
```bash
docker ps
```
2. Check Logs: View logs to ensure everything is running smoothly:
```bash
docker compose logs
```

# Interactive Development
1. Start up the containers defined in your docker-compose.yml file in detached mode. This means they'll run in the background, allowing you to use your terminal for other tasks.
```bash
docker compose logs
```

2. if you want to stop the containers later, you can use:
```bash
docker compose down
```

3. To get inside the container:
```bash
docker compose up -d
```

4. To get inside the running container and execute commands:
```bash
docker compose exec backend bash
```

5. Run the live reloading server within the container:
```bash
bash /start-reload.sh
```

# Development Setup and Live Reloading with Docker
1. Mount Backend Code Directory
The backend code directory is mounted as a Docker volume, which allows for live code changes without the need to rebuild the Docker image. This setup is intended for development purposes only. For production, you should use a fresh Docker image.

2. Run Live Reloading Server
For development, use `/start-reload.sh` to run a single server process that automatically reloads on code changes. If a syntax error occurs, the container will stop. To fix the error and restart, run:
```bash
docker compose up -d
```

3. Using a Persistent Bash Session
Alternatively, you can uncomment the command override in the `docker-compose.override.yml` file to keep the container running idle. This allows you to exec into the container for tasks like testing dependencies or running the development server.
To start a bash session inside the container:
```bash
docker compose up -d
docker compose exec backend bash
```

- You’ll see a prompt like:
```bash
root@7f2607af31c3:/app#
```

- From there, start the live reload server:
```bash
$ /start-reload.sh
```

* If the server stops due to an error, fix the issue and rerun the command. This approach is useful for quick iteration during development.


## PostgreSQL Installation and Setup
1. Install PostgreSQL:
- Download and Install PostgreSQL. (https://www.postgresql.org/)
- Skip the Stackbuilder Step: The Stackbuilder tool is not necessary for this setup.

2. Verify PostgreSQL Installation:
- Start PostgreSQL: Ensure PostgreSQL is running on your system.
- Verify Installation: You can check the installation by using the psql command-line tool or by accessing PostgreSQL through other means.

3. Install pgAdmin (Optional):
- When to Install pgAdmin: You can install pgAdmin either before or after setting up Docker. It’s a graphical tool for managing PostgreSQL databases and is independent of Docker.
- Installation: Download and install pgAdmin from the official pgAdmin website. (https://www.pgadmin.org/)

4. Set Up PostgreSQL with Docker:
- Using Docker Compose: Define PostgreSQL in your docker-compose.yml file. This ensures that PostgreSQL runs as part of your Docker stack, simplifying configuration and management.
- Start Docker Stack: Use Docker Compose to start the stack which includes PostgreSQL. Run:
```bash
docker compose up -d
```
- Connect to PostgreSQL: Use the connection details defined in your Docker Compose file to connect to the PostgreSQL instance from your application or pgAdmin.

5. Verify PostgreSQL with pgAdmin:
- Open pgAdmin: Once PostgreSQL is running (either locally or in Docker), you can open pgAdmin.
- Connect to PostgreSQL: Add a new server in pgAdmin using the connection details for your PostgreSQL instance. This will allow you to manage and verify your databases through the pgAdmin interface.

6. Connect PostgreSQL to Docker from pgAdmin:
1. Open pgAdmin: Start pgAdmin if it’s not already running.
2. Add a New Server: Use the connection details from your docker-compose.yml file to connect pgAdmin to your PostgreSQL instance.



## Backend Tests
To test the backend, follow these steps:

# Run Tests Locally
1. Execute the following command to run all tests using `pytest`:
```bash
bash ./scripts/test.sh
```
2. Modify or add new tests in ./backend/app/tests/.
3. If you use GitHub Actions, tests will automatically run as part of your CI/CD pipeline.


# Run Tests with Docker
If your stack is already running and you want to execute the tests, use:
```bash
docker compose exec backend bash /app/tests-start.sh
```

* This script runs `pytest` after ensuring the stack is operational.
* To pass extra arguments to `pytest`, include them in the command. For example, to stop on the first error:
```bash
docker compose exec backend bash /app/tests-start.sh -x
```

# View Test Coverage
After running tests, a coverage report is generated. Open `htmlcov/index.html` in your browser to review the test coverage details.



## Migrations. Steps for Handling Migrations
During local development, your app directory is mounted inside the container, allowing you to manage migrations with Alembic directly from within the container. This way, migration files will be saved in your app directory and can be added to your git repository.


1. Start an Interactive Session in the Container:
```bash
$ docker compose exec backend bash
```

2. Create a Migration Revision
After making changes to your models (e.g., adding a new column), create a new migration revision. If you skip this step, your application may encounter errors due to mismatches between your models and the database schema.
```bash
alembic revision --autogenerate -m "Describe your changes"
```
3. Commit the generated migration files to your git repository.

4. Apply the Migration
Run the migration to update your database schema:
```bash
alembic upgrade head
```

5. Bypass Migrations (Optional)
If you prefer not to use migrations, you can:

Uncomment the line in `./backend/app/core/db.py`:
```bash
SQLModel.metadata.create_all(engine)
```
Comment out the line in `prestart.sh` that runs:
```bash
alembic upgrade head
```

6. Starting Fresh (Optional)
To start with a clean slate, you can:

- Remove existing migration files from `./backend/app/alembic/versions/`.
- Create a new initial migration as described above.

* This approach ensures your database schema stays in sync with your models while keeping your migration files organized and version-controlled.


## Setting Environment Variables (For Mac Users)

# On macOS, environment variables are typically set in shell configuration files. Depending on the shell you use, the files might be:

- For Zsh (the default shell on macOS Catalina and later):
~/.zshrc
~/.zshenv

- For Bash (the default shell on macOS Mojave and earlier)
~/.bash_profile
~/.bashrc

# Instructions for Editing Environment Files on Mac

1. Open Terminal:
You can find Terminal in Applications > Utilities > Terminal or search for it using Spotlight.

2. Edit the Environment File:
To edit the ~/.zshrc or ~/.bash_profile, you can use the pico text editor directly from the Terminal. Here’s how:

- For Zsh:
```bash
pico ~/.zshrc
```
- For Bash:
```bash
pico ~/.bash_profile
```
3. Add Environment Variables:
Add your environment variables to the end of the file. For example:
```bash
export POSTGRES_USER=myuser
export POSTGRES_PASSWORD=mypassword
```

4. Save and Exit:
Press Ctrl + X to exit, Y to confirm saving changes, and Enter to write the changes.

5. Apply Changes:
To apply the changes without restarting the Terminal, run:
```bash
source ~/.zshrc  # For Zsh
source ~/.bash_profile  # For Bash
```

## Setting Environment Variables (Windows)
On Windows, environment variables can be set through the System Properties.

1. Open System Properties:
- Right-click on This PC or Computer on the desktop or in File Explorer.
- Select Properties.
- Click on Advanced system settings on the left-hand side.
- Click on the Environment Variables button.

2. Add or Edit Environment Variables:
- In the Environment Variables window, you can add or edit environment variables:
- For User Variables (specific to your user account):
- Click New or Edit under the User variables section.
- For System Variables (for all users):
- Click New or Edit under the System variables section.

3. Add PostgreSQL Environment Variables:
- Click New and enter the variable name and value. For example:
- Variable name: POSTGRES_USER
- Variable value: myuser
- Click OK.
- Repeat for POSTGRES_PASSWORD.

4. Save and Apply:
- Click OK to close each dialog box.
- You might need to restart any open command prompts or applications for the changes to take effect.

