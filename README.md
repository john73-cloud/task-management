# Task Management API

Task management system built with NestJS, PostgreSQL, and TypeORM.

## Features

- User Authentication (JWT)
- Task CRUD Operations
- Role-based Access Control (Admin, User)
- Pagination and Filtering for Tasks
- API Documentation with Swagger
- Rate Limiting

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Docker](https://www.docker.com/get-started/) and Docker Compose
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Getting Started

Follow these steps to get the project set up and running on your local machine.

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd task-management
```
Replace `<your-repository-url>` with the actual URL of this repository.

### 2. Install Dependencies

Navigate to the project directory and install the necessary dependencies using npm:
```bash
npm install
```

### 3. Environment Configuration

This project uses a `.env` file for environment-specific Gg_variables.

1.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
2.  Open the newly created `.env` file and update the variables as needed. Key variables include:
    *   `PORT`: Port the application will run on (default: `3000`)
    *   `DB_HOST`: Database host (default: `localhost` when using the Docker setup below)
    *   `DB_PORT`: Database port (default: `5432` for PostgreSQL)
    *   `DB_USERNAME`: Database username (default: `postgres`)
    *   `DB_PASSWORD`: Database password (default: `password`)
    *   `DB_DATABASE`: Database name (default: `task_management`)
    *   `JWT_SECRET`: A strong, unique secret key for JWT generation (e.g., generate one using a password manager or online tool).
    *   `JWT_EXPIRES_IN`: JWT expiration time (e.g., `1h`, `24h`, `3600s`).
    *   `REDIS_HOST`: Redis host (default: `localhost` when using the Docker setup)
    *   `REDIS_PORT`: Redis port (default: `6379`)

**Important:** The default database credentials in `.env.example` are configured to work with the `docker-compose.yml` setup provided.

### 4. Start Backend Services (PostgreSQL & Redis via Docker)

The application relies on PostgreSQL and Redis. A `docker-compose.yml` file is included to easily manage these services.

To start the services in detached mode (runs in the background):
```bash
docker-compose up -d
```

**Other Docker Compose commands:**
- To check the status of your services: `docker-compose ps`
- To view logs: `docker-compose logs -f` (or `docker-compose logs -f postgres redis` for specific services)
- To stop the services: `docker-compose down`
- To stop and remove data volumes (useful for a clean start, **deletes all database data**): `docker-compose down -v`

## Running the Application

### Start for Development

Once your backend services (PostgreSQL and Redis) are running via Docker, start the NestJS application in development mode (with hot-reloading):

```bash
npm run start:dev
```
The application will typically be available at `http://localhost:3000` (or the `PORT` specified in your `.env` file).

Alternatively, the `dev:full` script can be used to attempt to start docker services and the app:
```bash
npm run dev:full
```

### Build for Production

To create a production build:
```bash
npm run build
```

### Start in Production Mode

After building the application, and ensuring your Docker services are running:
```bash
npm run start:prod
```

## Running Tests

### End-to-End (E2E) Tests

**Prerequisites for E2E Tests:**
- Ensure the backend services (PostgreSQL and Redis via Docker) are running.
- The application itself does *not* need to be running separately with `npm run start:dev`, as the E2E tests will start and manage an instance of the application.
- E2E tests are configured to run against the database defined in your `.env` file. Be cautious if this is your development database, as tests might alter data. It's recommended to have a separate test database configuration or ensure tests clean up after themselves.

To run all E2E tests:
```bash
npm run test:e2e
```

## API Documentation (Swagger)

When the application is running (e.g., via `npm run start:dev`), interactive API documentation (Swagger UI) is available at:

`http://localhost:<PORT>/api/docs`

(Replace `<PORT>` with the actual port, typically `3000`).


<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>
