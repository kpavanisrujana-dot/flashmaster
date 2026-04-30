# FLASHMASTER - Exam Helper App

Full-stack MERN starter project with JWT authentication and protected flashcard CRUD.

## Tech Stack
- Frontend: React + Vite + React Router + Axios + Tailwind CSS
- Backend: Node.js + Express + MongoDB + Mongoose + JWT + bcryptjs

## Project Structure
- `frontend/` React app
- `backend/` API server

## Quick Start
1. Open terminal in `backend` and `frontend` separately.
2. `.env` files are already created. Update values if needed.
3. Install dependencies:
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
4. Start apps:
   - Backend: `npm run dev`
   - Frontend: `npm run dev`

## Database Mode
- If `MONGO_URI` is set, backend uses your MongoDB instance.
- If `MONGO_URI` is empty, backend auto-starts an in-memory MongoDB for quick prototype use.

## Core Flow
1. Register user
2. Login and receive token
3. Access dashboard (protected)
4. Perform flashcard CRUD
5. Logout
