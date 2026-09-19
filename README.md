# Ground Report: MERN News Portal

MERN 15 final assignment. A full-stack news portal where anyone can read stories, and registered users can publish,
edit and delete their own.

**Stack:** React (Vite) · Tailwind CSS · Zustand · React Router · Axios | Express · Node.js · MongoDB (Mongoose) · JWT

## Requirements checklist

| # | Requirement | Where |
|---|-------------|-------|
| 1 | Home page with 5 sections, top 6 news in one section (API) | `client/src/pages/Home.jsx`, `GET /api/news/top?limit=6` |
| 2 | News page with all news (API) | `client/src/pages/News.jsx`, `GET /api/news` (search, category filter, sort, pagination) |
| 3 | Single news details page (API) | `client/src/pages/NewsDetails.jsx`, `GET /api/news/:id` |
| 4 | Login and register (API) | `Login.jsx`, `Register.jsx`, `POST /api/auth/login`, `/register` |
| 5 | Registered user can create and publish news (API) | `dashboard/NewsEditor.jsx`, `POST /api/news` |
| 6 | Dashboard / profile to update user info (API) | `dashboard/Profile.jsx`, `PUT /api/users/profile`, `/password` |
| 7 | Edit or delete own news from dashboard (API) | `dashboard/MyStories.jsx`, `PUT` / `DELETE /api/news/:id` (owner only) |
| 8 | Contact Us page | `Contact.jsx`, `POST /api/contact` (saved in MongoDB) |
| 9 | Header and footer | `components/Header.jsx`, `components/Footer.jsx` |

The five home page sections: **Newest story + latest list**, **Most read (top 6)**, **Browse by topic**,
**Topic spotlights** (the two busiest categories), **Call to action**.

## Run it

Requirements: Node 18+ and MongoDB running locally (or a MongoDB Atlas connection string).

```bash
# 1. API
cd server
cp .env.example .env        # then edit JWT_SECRET (and MONGO_URI if you use Atlas)
npm install
npm run seed                # optional: demo users + 14 stories
npm run dev                 # http://localhost:5000

# 2. Client (new terminal)
cd client
npm install
npm run dev                 # http://localhost:5173
```

Demo login after seeding: `demo@groundreport.com` / `password123`

The Vite dev server proxies `/api` to `localhost:5000`, so no CORS setup is needed in development.
For a production build set `VITE_API_URL` (see `client/.env.example`) and `CLIENT_URL` on the server.

## API

Base URL `http://localhost:5000/api`. Protected routes need `Authorization: Bearer <token>`.

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/auth/register` | | Create account, returns `{ token, user }` |
| POST | `/auth/login` | | Log in, returns `{ token, user }` |
| GET | `/auth/me` | yes | Current user |
| PUT | `/users/profile` | yes | Update name, email, phone, bio, avatar |
| PUT | `/users/password` | yes | Change password |
| GET | `/news` | | List. Query: `page, limit, category, search, sort=latest\|popular\|oldest` |
| GET | `/news/top?limit=6` | | Most-read stories |
| GET | `/news/categories` | | Categories with story counts |
| GET | `/news/mine` | yes | Logged-in user's stories |
| GET | `/news/:id` | | Story + related stories (increments views) |
| POST | `/news` | yes | Publish a story |
| PUT | `/news/:id` | yes (owner) | Edit a story |
| DELETE | `/news/:id` | yes (owner) | Delete a story |
| POST | `/contact` | | Send a contact message |

## Structure

```
server/
  server.js  seed.js
  config/db.js
  models/        User, News, Contact
  controllers/   auth, user, news, contact
  routes/        auth, user, news, contact
  middleware/    auth (JWT), error (central error handler)
client/src/
  api/axios.js                 axios instance + JWT interceptor
  store/authStore.js           Zustand: session (persisted), login, register, profile
  store/newsStore.js           Zustand: lists, home data, details, my news, CRUD
  components/                  Header, Footer, NewsCard, Pagination, ConfirmModal, ...
  pages/                       Home, News, NewsDetails, Login, Register, Contact, NotFound
  pages/dashboard/             Dashboard layout, MyStories, NewsEditor, Profile
```

## Notes

- Passwords are hashed with bcrypt; JWTs last 7 days. Ownership is checked on the server for edit and delete.
- Cover images and avatars are **links** (no file upload). Adding upload later means adding `multer` to `POST /news`.
- Changing the category list: edit `CATEGORIES` in `server/models/News.js`. The client reads it from the API.
- The token is kept in `localStorage` by Zustand's `persist`, which is fine for a course project. For a production
  app consider httpOnly cookies.
