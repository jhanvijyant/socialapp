# ✦ SocialApp — Mini Social Post Application

A full-stack social media feed application where users can create accounts, post text or images, like, and comment — inspired by the TaskPlanet social page.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Material UI |
| Backend | Node.js + Express |
| Database | MongoDB (Atlas) |
| Auth | JWT (JSON Web Tokens) |
| Image Upload | Multer (local) / Cloudinary (production) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
socialapp/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (collection 1)
│   │   └── Post.js          # Post schema with likes & comments (collection 2)
│   ├── routes/
│   │   ├── auth.js          # /api/auth — register, login, me
│   │   └── posts.js         # /api/posts — CRUD, like, comment
│   ├── middleware/
│   │   └── auth.js          # JWT protect middleware
│   ├── server.js            # Express entry point
│   ├── .env.example         # Environment variables template
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/
    │   │   └── index.js     # Axios instance + all API calls
    │   ├── components/
    │   │   ├── Avatar.js    # Auto-colored avatar by username
    │   │   ├── Navbar.js    # Top navigation bar
    │   │   ├── CreatePost.js # Post creation form
    │   │   └── PostCard.js  # Single post with like/comment
    │   ├── context/
    │   │   └── AuthContext.js # Global auth state
    │   ├── pages/
    │   │   ├── FeedPage.js  # Main feed with pagination
    │   │   ├── LoginPage.js # Login form
    │   │   └── SignupPage.js # Registration form
    │   ├── styles/
    │   │   └── global.css   # Custom CSS with design tokens
    │   ├── App.js           # Router + layout
    │   └── index.js         # React entry point
    ├── .env.example
    └── package.json
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v16+
- MongoDB Atlas account (free tier works)
- Git

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/socialapp.git
cd socialapp
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and fill in MONGO_URI and JWT_SECRET
npm run dev   # Starts on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# No .env needed for local dev (proxy to localhost:5000 is configured)
npm start     # Starts on http://localhost:3000
```

---

## 🌐 Deployment

### Database — MongoDB Atlas
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user and get the connection string
4. Whitelist `0.0.0.0/0` for IP access (or your Render IPs)

### Backend — Render
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo, select `backend` folder
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js`
6. Add environment variables:
   ```
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secret_key
   CLIENT_URL=https://your-frontend.vercel.app
   PORT=5000
   ```

### Frontend — Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo, set **Root Directory** to `frontend`
3. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com/api
   ```
4. Deploy!

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Create account |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Get current user |

### Posts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/posts?page=1&limit=10` | ❌ | Get paginated feed |
| POST | `/api/posts` | ✅ | Create post (text/image) |
| DELETE | `/api/posts/:id` | ✅ | Delete own post |
| PUT | `/api/posts/:id/like` | ✅ | Toggle like |
| POST | `/api/posts/:id/comment` | ✅ | Add comment |
| DELETE | `/api/posts/:postId/comment/:commentId` | ✅ | Delete comment |

---

## ✨ Features

- 🔐 **Auth** — Signup/Login with JWT, persisted session
- 📝 **Create Posts** — Text, image, or both (either is enough)
- 🌐 **Public Feed** — All posts visible to everyone, newest first
- ❤️ **Likes** — Toggle like, optimistic UI updates, like count + preview
- 💬 **Comments** — Add/delete comments with instant updates
- 📄 **Pagination** — Load 10 posts at a time with "Load more"
- 🎨 **Clean UI** — Responsive, DM Sans + DM Serif Display typography
- 🗑 **Delete** — Users can delete their own posts and comments

---

## 🏆 Bonus Features Implemented

- ✅ Optimistic like updates (instant UI feedback)
- ✅ Efficient pagination (page + limit params)
- ✅ Reusable `Avatar` component with auto-colored initials
- ✅ Centralized API layer with auth interceptors
- ✅ Form validation on both client and server
- ✅ Responsive layout (mobile + desktop)
- ✅ Code comments throughout
- ✅ Auto redirect if token expires

---

## 📦 MongoDB Collections

Only **2 collections** are used as required:

1. **users** — `{ username, email, password (hashed), avatar, bio, timestamps }`
2. **posts** — `{ user, username, content, image, likes[], likedBy[], comments[], timestamps }`

---

## 🔑 Environment Variables

**Backend** (`.env`):
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
PORT=5000
CLIENT_URL=http://localhost:3000
```

**Frontend** (`.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```
