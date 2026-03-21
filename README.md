# Notes Management System

A secure Notes Management System built with **Node.js**, **Express.js**, **MongoDB (Mongoose)** and **EJS**.

Users can register, login/logout using **JWT stored in an httpOnly cookie**, and manage their personal notes with full CRUD. Notes are protected so users can only access their own data.

## Features

- Secure authentication using **JWT + httpOnly cookies**
- **bcrypt** password hashing
- **Protected routes** with JWT verification
- Authorization: users can only access their own notes (`{ _id, userId }` queries)
- Full CRUD for notes (create, read/list, update, delete)
- Search notes by **title/content**
- Filter notes by **created date range**
- Sort notes by **latest / oldest**
- Pagination for dashboard listing
- Profile page for logged-in user
- Change password feature
- **express-validator** input validation
- Flash success/error alerts for better UX
- Proper **404** and **500** EJS error pages
- Environment variables and deployment-friendly configuration (Render/Railway)

## Tech Stack

- Node.js, Express.js
- MongoDB, Mongoose
- EJS templates
- JWT, bcrypt
- express-validator, connect-flash, express-session, connect-mongo
- express-rate-limit, helmet, morgan

## Setup (Local)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` from `.env.example`
3. Start the server:
   ```bash
   npm start
   ```

Default server: `http://localhost:3000`

## Environment Variables

Create `.env` with the following:

- `NODE_ENV` (e.g., development)
- `PORT` (e.g., 3000)
- `MONGO_URI`
- `JWT_SECRET`
- `COOKIE_MAX_AGE_MS`
- `SESSION_SECRET`
- `SESSION_COOKIE_MAX_AGE_MS`
- `SESSION_TTL_SECONDS`
- `BCRYPT_SALT_ROUNDS`

## Deployment (Render / Railway)

1. Add environment variables in the dashboard.
2. Ensure `secure` cookies work in production by setting `NODE_ENV=production`.
3. Use `npm start` as the start command.

## Project Structure (High Level)

- `controllers/`: route/controller separation and business logic
- `routes/`: URL mapping
- `middleware/`: auth, validation, error handling
- `validators/`: express-validator rules
- `models/`: Mongoose schemas
- `config/`: Mongo and session/flash configuration
- `views/`: EJS pages + reusable partials

