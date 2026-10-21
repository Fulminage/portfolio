# Portfolio Server

Express + MongoDB (Mongoose) API for the portfolio in `../client`. ES modules throughout.

## Folder structure

```
server/
├── server.js                 App entry: middleware, routes, starts listening on process.env.PORT
├── config/
│   ├── env.js                Loads and validates environment variables (fails fast if missing)
│   └── db.js                 Connects to MongoDB Atlas
├── models/                   Database shapes: Admin, Project, Message, Profile (about + skills + experience)
├── controllers/              The logic behind each endpoint (validation lives here)
├── routes/                   Maps URLs to controllers; decides which routes need login
├── middleware/
│   ├── auth.js               `protect` - verifies the JWT for admin-only routes
│   ├── rateLimiters.js       Limits for API / login / contact form
│   └── errorHandler.js       404 + consistent JSON errors
├── utils/                    Validation helpers, async wrapper
├── scripts/
│   ├── seedAdmin.js          Creates your admin account from env variables
│   └── seedContent.js        Loads your current About/Skills/Projects text into the database
├── .env.example              Template for your secrets (copy to .env)
└── .gitignore                Keeps .env and node_modules out of GitHub
```

## Run locally

1. **MongoDB Atlas**: create a free cluster → *Database Access* → add a database user (username + password) → *Network Access* → add your current IP (for local use) → *Connect → Drivers* → copy the connection string. Replace `<password>` and add a database name before the `?`, e.g. `.../portfolio?retryWrites=true&w=majority`. If the password has special characters (`@ : / ?`), URL-encode them.
2. ```bash
   cd server
   npm install
   cp .env.example .env     # Windows: copy .env.example .env
   ```
3. Edit `.env`: set `MONGODB_URI`, a long random `JWT_SECRET`, and `ADMIN_EMAIL` / `ADMIN_PASSWORD` (12+ chars).
4. ```bash
   npm run seed:admin       # creates your admin login
   npm run seed:content     # optional: imports the content currently hardcoded in App.jsx
   npm run dev              # http://localhost:5000
   ```
5. Check it: open `http://localhost:5000/api/health` → `{"success":true,"status":"ok"}`.

## Environment variables

| Name | Required | Purpose |
|---|---|---|
| `MONGODB_URI` | yes | Atlas connection string |
| `JWT_SECRET` | yes | Signs login tokens. 32+ random characters |
| `NODE_ENV` | yes in Render | `production` on Render, `development` locally |
| `CLIENT_URL` | yes in production | Frontend origin(s) allowed by CORS, comma-separated, no trailing slash |
| `PORT` | no | Render sets this automatically; defaults to 5000 locally |
| `JWT_EXPIRES_IN` | no | Token lifetime (default `1d`) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | seed only | Used by `npm run seed:admin` |

## API

Admin routes need the header `Authorization: Bearer <token>` (token comes from login).
All responses are JSON with `success: true|false`.

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | – | Health check |
| POST | `/api/auth/login` | – | Body `{email, password}` → `{token}` |
| GET | `/api/auth/me` | admin | Check token is valid |
| GET | `/api/projects` | – | Published projects, newest first |
| GET | `/api/projects/:id` | – | One published project |
| GET | `/api/projects/admin/all` | admin | All projects including drafts |
| POST | `/api/projects` | admin | Create project |
| PUT | `/api/projects/:id` | admin | Update (send only changed fields) |
| DELETE | `/api/projects/:id` | admin | Delete |
| POST | `/api/contact` | – | Body `{name, email, subject, message}` |
| GET | `/api/contact` | admin | Read received messages |
| DELETE | `/api/contact/:id` | admin | Delete a message |
| GET | `/api/about` | – | `{name, title, bio, location, focus, experience}` |
| PUT | `/api/about` | admin | Update any of those fields |
| GET | `/api/skills` | – | `[{name, category}]` |
| PUT | `/api/skills` | admin | Body `{skills: ["HTML", {"name":"React","category":"Frontend"}]}` |

Project fields: `title`*, `description`*, `technologies` (string array), `imageUrl`, `liveUrl`, `githubUrl`, `published` (boolean, default true). `createdAt`/`updatedAt` are added automatically.

### Testing with Postman / Thunder Client

1. `POST /api/auth/login` with JSON `{"email":"...","password":"..."}` → copy `token`.
2. For admin requests add header `Authorization: Bearer <token>`.
3. `POST /api/projects` with
   ```json
   { "title": "Test", "description": "Hello", "technologies": ["React"], "githubUrl": "https://github.com/you/test" }
   ```
   → expect `201`. Then `GET /api/projects` → it appears. Without the header → expect `401`.
4. `POST /api/contact` with a bad email → `400` with an `errors` list; with valid data → `201`, then check it with `GET /api/contact` (admin).

## Deploy to Render

1. Push the repo to GitHub (confirm `.env` is NOT in it: `git status` should never list it).
2. **Atlas network access**: Render's free web services don't have a fixed IP, so you'll need to allow `0.0.0.0/0` in *Network Access*. This is acceptable only because the database user has a strong password and limited privileges (give it read/write on the `portfolio` database only). Remove your temporary local-IP entry if you like.
3. Render → *New → Web Service* → connect your GitHub repo and set:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables: `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (your real frontend URL, e.g. `https://yourname.netlify.app`).
5. Deploy, then open `https://<your-service>.onrender.com/api/health`.
6. Create the admin in production: run `npm run seed:admin` locally with `MONGODB_URI` in `.env` pointing at the same Atlas database (simplest), or use Render's Shell tab.
7. In the frontend, call the Render URL via an env variable (Vite: `VITE_API_URL`), never a hardcoded `localhost`.

Note: on Render's free plan the service sleeps after inactivity, so the first request can take ~30–60 seconds.

### Reading Render logs
Render → your service → **Logs**. Common messages:
- `Missing required environment variables` → add them under *Environment*.
- `MongoDB connection failed: ... bad auth` → wrong username/password in `MONGODB_URI` (encode special characters).
- `MongoDB connection failed: ... ECONNREFUSED / timed out` → Atlas Network Access doesn't allow Render (see step 2).
- Browser error "blocked by CORS" → `CLIENT_URL` doesn't exactly match your frontend origin (protocol + domain, no trailing slash).
- `Cannot find module` / `package.json not found` → Root Directory isn't `server`.

## Security notes
- Passwords hashed with bcrypt (`bcryptjs`, 12 rounds); hashes are never returned by queries.
- Login returns a signed JWT (default 1 day). There is no public register route; the only admin is created by the seed script.
- Rate limits on the API, login (10 / 15 min) and contact form (5 / hour); contact form also has a honeypot field named `website` (add a hidden input with that name in your form; real users leave it empty).
- Helmet headers, 10 KB body limit, strict CORS allow-list, string-type checks on all input, http(s)-only URLs.
