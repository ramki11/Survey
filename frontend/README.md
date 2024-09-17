# FastAPI Project - Frontend

## Project Technologies 

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

## Code Structure

* `frontend/src` - The main frontend code.
* `frontend/src/assets` - Static assets.
* `frontend/src/client` - The generated OpenAPI client.
* `frontend/src/components` -  The different components of the frontend.
* `frontend/src/hooks` - Custom hooks.
* `frontend/src/routes` - The different routes of the frontend which include the pages.
* `theme.tsx` - The Chakra UI custom theme.


## Frontend Setup

# Install a Node Version Manager
 Ensure you have either the Node Version Manager (nvm) or Fast Node Manager (fnm) installed.

* To install fnm, follow (https://github.com/Schniz/fnm)
* To install nvm, use the (https://github.com/nvm-sh/nvm#installing-and-updating)

- Install the Correct Node.js Version
If the Node.js version specified in the `.nvmrc` file isn’t installed, use the following commands:
```bash 
# If using fnm
fnm install
# If using nvm
nvm install
```
- Once the installation is complete, switch to the installed version:
```bash 
# If using fnm
fnm use 
# If using nvm
nvm use
```

# Set Up 
1. Navigate to the frontend directory:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Start the Frontend:
```bash
npm run dev
```
* Ensure the frontend is running by visiting http://localhost:5173/

* Note: This live server is not running inside Docker and is intended for local development. It provides live reloading, which is the recommended workflow during development for productivity. Once you're satisfied with your changes, you can build the frontend Docker image and test it in a production-like environment. However, building the image for every change is less efficient compared to running the local development server with live reload.

Check `package.json` for additional scripts and options.


## Removing the Frontend
If you are developing an API-only app and want to remove the frontend, you can do it easily:

- Remove the `./frontend` directory.
- In the `docker-compose.yml` file, remove the whole service / section `frontend`.
- In the `docker-compose.override.yml` file, remove the whole service / section `frontend`.
Done, you have a frontend-less (api-only) app. 🤓
---
If you want, you can also remove the `FRONTEND` environment variables from:
-  `.env`
- `./scripts/*.sh`



## Development Stage

# Generate Client
To generate the frontend client based on the latest OpenAPI schema, follow these steps:

1. Start the Docker Compose Stack
Ensure your Docker Compose stack is running, as this will host the backend API.

2. Download the OpenAPI JSON (`http://localhost/api/v1/openapi.json`) 
Fetch the OpenAPI JSON file from the following URL and save it as openapi.json in the frontend directory:
```bash
curl http://localhost/api/v1/openapi.json -o frontend/openapi.json
```
3. Modify the OpenAPI JSON
To simplify the names in the generated frontend client code, run the following script:
```bash
node modify-openapi-operationids.js
```
4. Generate the Frontend Client
Execute the following command to generate the frontend client:
```bash
npm run generate-client```
```
5. Commit the Changes
Ensure you commit the updated frontend client code to your version control system.

* Note: Whenever the backend OpenAPI schema changes, repeat these steps to update the frontend client with the new schema.

# Using a Remote API
To configure your frontend to use a remote API, follow these steps:

Set the Remote API URL
In the `frontend/.env` file, set the `VITE_API_URL` environment variable to the URL of the remote API:
```env
VITE_API_URL=https://my-remote-api.example.com
```

* When you start the frontend, it will use the specified URL as the base URL for API requests.
* By configuring this environment variable, you can easily switch the frontend between different API endpoints, whether for local development or remote testing.



## End-to-End Testing with Playwright
The frontend includes initial end-to-end tests using Playwright. Follow these steps to run and manage the tests:

1. Start the Docker Compose Stack
Ensure the Docker Compose stack is running:
```bash
docker compose up -d
```
2. Run the Tests
Execute the tests with the following command:
```bash
npx playwright test
```
3. Run Tests in UI Mode
To see the browser and interact with it while the tests are running, use:
```bash
npx playwright test --ui
```
4. Stop and Clean Up
After tests are complete, stop and remove the Docker Compose stack and clean up any test-generated data:
```bash
docker compose down -v
```

5. Update Tests
To update or add new tests, navigate to the tests directory and modify the existing test files or add new ones as needed.

* For more information on writing and running Playwright tests, refer to the official [Playwright documentation](https://playwright.dev/docs/intro).