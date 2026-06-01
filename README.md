#  SocialApp — Mini Social Post Application

A full-stack social media feed application where users can create accounts, post text or images, like, and comment — inspired by the TaskPlanet social page.

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Material UI |
| Backend | Node.js + Express |
| Database | MongoDB (Atlas) |
| Auth | JWT (JSON Web Tokens) |
| Image Upload | Multer (local) / Cloudinary (production) |
| Deployment | Vercel (frontend) + Render (backend) |

---

##  Project Structure

```
socialapp/
├── backend/
│   ├── models/
│   │   ├── User.js        
│   │   └── Post.js          
│   ├── routes/
│   │   ├── auth.js         
│   │   └── posts.js        
│   ├── middleware/
│   │   └── auth.js        
│   ├── server.js          
│   ├── .env.example         
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/
    │   │   └── index.js    
    │   ├── components/
    │   │   ├── Avatar.js    
    │   │   ├── Navbar.js    
    │   │   ├── CreatePost.js
    │   │   └── PostCard.js 
    │   ├── context/
    │   │   └── AuthContext.js 
    │   ├── pages/
    │   │   ├── FeedPage.js 
    │   │   ├── LoginPage.js 
    │   │   └── SignupPage.js 
    │   ├── styles/
    │   │   └── global.css   
    │   ├── App.js         
    │   └── index.js       
    ├── .env.example
    └── package.json
```

---

## Local Setup

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

```

### 3. Frontend Setup
```bash
cd frontend
npm install
# No .env needed for local dev (proxy to localhost:5000 is configured)
npm start     # Starts on http://localhost:3000
```

---

## Deployment

### Database — MongoDB Atlas
 Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
### Backend — Render
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service

 
   ```

### Frontend — Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo, set **Root Directory** to `frontend.`
3. Add environment variable:
4. Deploy!

---

##  API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Posts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/posts?page=1&limit=10` | Get paginated feed |
| POST | `/api/posts` |Create post (text/image) |
| DELETE | `/api/posts/:id` | Delete own post |
| PUT | `/api/posts/:id/like` | Toggle like |
| POST | `/api/posts/:id/comment` | Add comment |
| DELETE | `/api/posts/:postId/comment/:commentId` |Delete comment |

---

##  Features

-  **Auth** — Signup/Login with JWT, persisted session
-  **Create Posts** — Text, image, or both (either is enough)
-  **Public Feed** — All posts visible to everyone, newest first
 -  **Likes** — Toggle like, optimistic UI updates, like count + preview
-  **Comments** — Add/delete comments with instant updates
-  **Pagination** — Load 10 posts at a time with "Load more"
-  **Clean UI** — Responsive, DM Sans + DM Serif Display typography
-  **Delete** — Users can delete their own posts and comments

---

##  Bonus Features Implemented

-  Optimistic like updates (instant UI feedback)
-  Efficient pagination (page + limit params)
- Reusable `Avatar` component with auto-colored initials
- Centralized API layer with auth interceptors
-  Form validation on both client and server
-  Responsive layout (mobile + desktop)
-  Code comments throughout
-  Auto redirect if token expires

--

---

