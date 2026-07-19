# MERN CRUD + JWT Auth

A task manager app with authentication, JWT-based login, and CRUD operations for tasks.
The project is now set up around Docker Compose, TypeScript, and a backend/frontend split.

## Stack
- Backend: Node.js, Express, Mongoose, JWT auth, bcrypt
- Frontend: React + Vite + TypeScript
- Database: MongoDB

## Project structure
```text
mern-app/
├── backend/          # Express API in TypeScript
├── frontend/         # React app in TypeScript
├── docker-compose.yml
├── README.md
└── k8s/              # Optional Kubernetes files, not required for the current setup
```

## Run locally with Docker Compose

```bash
cd mern-app
docker compose up --build
```

Open the app at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api
- MongoDB: localhost:27017

To stop it:

```bash
docker compose down -v
```

## Run backend locally

```bash
cd backend
npm install
npm run dev
```

## Run frontend locally

```bash
cd frontend
npm install
npm run dev
```

## Environment variables

Use the example files if needed:
- backend/.env.example
- frontend/.env.example

For local development, copy them to `.env` in each folder if you want to override defaults.

## API endpoints

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- GET /api/items
- POST /api/items
- GET /api/items/:id
- PUT /api/items/:id
- DELETE /api/items/:id

All item routes require a bearer token.
