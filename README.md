# FLASHMASTER - Exam Helper App

Full-stack MERN app with JWT authentication and protected flashcard CRUD.

## Tech Stack
- Frontend: React + Vite + React Router + Axios + Tailwind CSS
- Backend: Node.js + Express + MongoDB + Mongoose + JWT + bcryptjs

## Project Structure
- `frontend/` - React app
- `backend/` - API server

## Quick Start
1. Install dependencies:
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
2. Configure environment variables:
   - `backend/.env` for backend settings
   - `frontend/.env` for frontend settings
3. Start apps:
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`

## Database Mode
- If `MONGO_URI` is set, backend uses your MongoDB instance.
- If `MONGO_URI` is empty, backend auto-starts an in-memory MongoDB for quick prototype use.

## Core Flow
1. Register user
2. Login and receive token
3. Access dashboard (protected)
4. Perform flashcard CRUD
5. Logout
