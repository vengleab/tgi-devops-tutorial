# Article Management System Context

## Overview
This project is a simple article management system with:
- **Backend**: ExpressJS server (in `web-server`) using in-memory dummy JSON for articles and a hardcoded user.
- **Frontend**: Static HTML/CSS/JS (in `web-frontend`) for user interaction.

---

## Backend (`web-server`) ✅ Done
- **Framework**: ExpressJS (Node.js)
- **Data Storage**: In-memory array for articles (dummy JSON, not persistent)
- **User**: Hardcoded (e.g., `{ username: "admin", password: "password" }`)
- **Endpoints Implemented**:
  - `POST /login` — User login (returns a simple token or sets a session flag)
  - `GET /articles` — Retrieve all articles (public, for guests and logged-in users)
  - `POST /articles` — Add a new article (title, description); only for logged-in users
  - `POST /logout` — Logout endpoint (optional, clears session)
- **Authentication**: Simple session or token-based (no real security, just for demonstration)
- **Status**: All endpoints and logic implemented in `server.js`.

### Endpoints
- `POST /login` — User login (returns a simple token or sets a session flag)
- `GET /articles` — Retrieve all articles (public, for guests and logged-in users)
- `POST /articles` — Add a new article (title, description); only for logged-in users

### Authentication
- Simple session or token-based (no real security, just for demonstration)
- Only one user (admin); guests are unauthenticated users

---

## Frontend (`web-frontend`) ✅ Done
- **Structure**: Static HTML, CSS, and JS
- **Features Implemented**:
  - **Login Form**: For the hardcoded user
  - **Article Submission Form**: Only visible to logged-in users
  - **Article List**: Always visible to all users (guests and logged-in)
  - **Session Handling**: Store login state in localStorage
  - **API Calls**: Use fetch to interact with backend endpoints
- **Status**: All features implemented in `html/index.html`, `css/style.css`, and `js/app.js`.

---

## Nginx Configuration (`nginx-config`)
- **Purpose**: Contains Nginx configuration files for local development or deployment.
- **Usage**:
  - Can be used to reverse proxy API requests to the Express backend (`web-server`).
  - Can serve static frontend files from `web-frontend/html` and `web-frontend/css`/`js`.
  - Useful for simulating production-like environments or handling CORS in development.
- **Status**: Place your Nginx config files here as needed for your setup.

---

## User Roles
- **Guest**: Can view articles only
- **Logged-in User (admin)**: Can view and post articles

---

## Notes
- No database or persistent storage; all data is lost on server restart
- No real security; authentication is for demonstration only
- Designed for learning and prototyping purposes

---

## Testing ✅ Done
- **Backend Testing**: Jest + Supertest for API endpoint testing
  - Tests all endpoints (`/login`, `/articles`, `/logout`)
  - Tests authentication, validation, and error handling
  - Integration tests for session management
  - Run with: `cd web-server && npm test`

- **Frontend Testing**: Jest + jsdom for DOM and JavaScript testing
  - Tests token management (localStorage)
  - Tests API integration and error handling
  - Tests UI state management
  - Run with: `cd web-frontend && npm test`

- **Test Commands**:
  - `make test` - Run all tests
  - `make test-backend` - Backend tests only
  - `make test-frontend` - Frontend tests only
  - `make install` - Install all dependencies

---
