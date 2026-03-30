# NITEX — Class 12 Computer Science Portal

NITEX is a beginner-friendly full-stack study portal for Class 12 Computer Science. It turns a basic notes project into a polished MERN application with a responsive dashboard, real user authentication, progress tracking, bookmarks, search/filter tools, a backend contact form, and cleaner documentation.

## Project purpose

This project helps students revise important Class 12 Computer Science topics such as DBMS, networking, web technology, OOP, software process models, and emerging technology. The notes are rewritten in simple language and presented inside a modern dashboard that feels closer to a real product than a classroom demo.

## Features

- Responsive student dashboard for desktop, tablet, and mobile
- Search, category filtering, sort options, bookmarks, and progress tracking
- Real login and signup flow with JWT authentication and MongoDB-backed users
- Theme toggle for light mode and dark mode
- Contact form connected to the backend and saved in MongoDB
- Admin panel with overview, note management, and contact message review
- Improved note detail page with clear hierarchy and animated sections
- Role-based admin API protected by JWT middleware
- Better SEO metadata and semantic structure
- Beginner-friendly comments in custom logic files

## Tech stack

| Layer | Tools |
|------|------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| State | React hooks + localStorage |

## Folder structure

```bash
class12/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── .env.example
│   └── index.html
└── README.md
```

## API overview

| Method | Route | Purpose |
|------|------|------|
| `GET` | `/api/health` | Check backend status |
| `GET` | `/api/notes` | Get notes with optional search and category filters |
| `GET` | `/api/notes/meta` | Get counts, categories, and popular tags |
| `GET` | `/api/notes/:slug` | Get one full note |
| `POST` | `/api/auth/register` | Create a user account |
| `POST` | `/api/auth/login` | Log in and receive a JWT |
| `GET` | `/api/auth/me` | Fetch current logged-in user |
| `POST` | `/api/auth/logout` | Client logout helper |
| `POST` | `/api/contact` | Save a contact message |
| `GET` | `/api/admin/stats` | Get admin dashboard stats |
| `GET` | `/api/admin/notes` | List notes for admin editing |
| `POST` | `/api/admin/notes` | Create a note as admin |
| `PUT` | `/api/admin/notes/:slug` | Update a note as admin |
| `DELETE` | `/api/admin/notes/:slug` | Delete a note as admin |
| `GET` | `/api/admin/messages` | Read contact messages as admin |

## Installation

### 1. Clone the project

```bash
git clone https://github.com/nt3005156/class12.git
cd class12
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

Default backend URL: `http://localhost:5001`

Recommended `.env` values:

```bash
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/class12_notes
FRONTEND_ORIGIN=http://localhost:5173
JWT_SECRET=change-this-jwt-secret
ADMIN_EMAILS=admin@example.com
```

### 3. Set up the frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Default frontend URL: `http://localhost:5173`

Example frontend env:

```bash
VITE_API_URL=http://localhost:5001
```

## Build checks

These commands were used to verify the upgraded project:

```bash
cd backend && node --check server.js
cd frontend && npm run build
```

## Screenshots

Suggested screenshots to add after running the app locally:

1. Dashboard with search, stats, and module cards
2. Note detail page
3. Login/signup modal
4. Contact form success state
5. Admin dashboard with notes manager
6. Light mode and dark mode comparison

## Deployment guide

### Frontend on Vercel or Netlify

```bash
Root directory: frontend
Build command: npm run build
Publish directory: dist
Environment variable: VITE_API_URL=https://your-backend-url.com
```

### Backend on Render, Railway, or Fly.io

```bash
Root directory: backend
Start command: npm start
Environment variables:
- MONGODB_URI
- FRONTEND_ORIGIN
- JWT_SECRET
- ADMIN_EMAILS
```

After deploying the backend, run `npm run seed` once against the production database.

The admin panel works with any account whose email is listed in `ADMIN_EMAILS`. Existing users can also be promoted manually by changing their `role` field to `"admin"` in MongoDB.

### Render blueprint

This repository now includes [`render.yaml`](/Users/nt30051/Documents/class12/render.yaml), so Render can detect the backend service settings automatically when you import the GitHub repository.

Use these values in Render:

```bash
Service type: Web Service
Root directory: backend
Build command: npm install
Start command: npm start
Health check path: /api/health
```

## Future improvements

- Add password reset and email verification
- Move student progress from localStorage to MongoDB per user
- Add tests for backend routes and frontend components
- Upload screenshots and live demo links to this README

## License

Educational project for learning and portfolio use.
