# NITEX — Class 12 Computer Science (MERN)

A dark, sci-fi themed learning shell for Class 12 Computer Science topics. The original legacy blog could not be scraped reliably; all module text here is **rewritten** for clarity and structured as API-driven chapters (not a copy-paste mirror).

## Stack

| Layer    | Tech |
|----------|------|
| UI       | React 18 (Vite), Tailwind CSS, Framer Motion |
| 3D       | Three.js via `@react-three/fiber` + `@react-three/drei` |
| API      | Node.js, Express |
| Data     | MongoDB + Mongoose |

## Repo layout

```
class12/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── seed.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/api.js
│   └── vite.config.js
└── README.md
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/notes` | List chapters (optional `?category=` `&q=`) |
| `GET` | `/api/notes/search?q=` | Quick search (min 2 chars) |
| `GET` | `/api/notes/:slug` | Full chapter with sections |
| `POST` | `/api/admin/notes` | Create chapter (header `x-admin-key`) |
| `PUT` | `/api/admin/notes/:slug` | Update chapter (header `x-admin-key`) |

## MongoDB document shape (`Note`)

```json
{
  "title": "string",
  "slug": "kebab-case",
  "summary": "string",
  "order": 0,
  "category": "Data | Systems | …",
  "tags": ["…"],
  "readMinutes": 10,
  "sections": [
    {
      "heading": "string",
      "body": "Plain text; use **bold** spans",
      "highlights": ["definition lines"]
    }
  ]
}
```

## Run locally

### Prerequisites

- Node.js 18+
- MongoDB running locally **or** a connection string (Atlas)

### Backend

```bash
cd backend
cp .env.example .env
# Edit MONGODB_URI and ADMIN_API_KEY
npm install
npm run seed
npm run dev
```

API defaults to `http://localhost:5001` (5000 is often busy on macOS due to AirPlay).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite serves `http://localhost:5173` and **proxies** `/api` to the backend.

For production builds pointing at a remote API, set `VITE_API_URL` (see `frontend/.env.example`).

## Bonus features (included)

- **Bookmarks** and **progress** via `localStorage` (no login).
- **Study Copilot**: offline tips panel (not a hosted LLM).
- **Code splitting**: lazy routes + manual vendor chunks in Vite.

## Deploy (optional)

**Frontend — Vercel**

1. Root directory: `frontend`
2. Build: `npm run build`
3. Output: `dist`
4. Environment: ` VITE_API_URL=https://your-api.example.com` (no trailing slash)

**Backend — Render / Railway / Fly**

1. Root directory: `backend`
2. Start: `npm start`
3. Env: `MONGODB_URI`, `ADMIN_API_KEY`, `FRONTEND_ORIGIN` (your Vercel URL for CORS)

After deploy, re-run seed against production MongoDB once (or use admin `POST`).

## Admin curl examples

```bash
export KEY=your-admin-key

curl -X POST http://localhost:5001/api/admin/notes \
  -H "Content-Type: application/json" \
  -H "x-admin-key: $KEY" \
  -d '{"title":"Test","slug":"test","summary":"s","sections":[]}'
```

## License

Educational project scaffold. Module text is original to this repository for teaching purposes.
