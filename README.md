# 🔄 SkillSwap — Skill Exchange Platform

A full-stack **MERN** (MongoDB, Express, React, Node.js) web application where users can list skills they can teach and skills they want to learn, then get matched with complementary users for skill exchange.

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens)

## ✨ Features

### 🔐 Authentication
- User registration & login with JWT tokens
- Protected routes & persistent sessions

### 👤 User Profiles
- Add bio, location, GitHub & LinkedIn links
- List **skills you can teach** and **skills you want to learn**
- Edit profile anytime

### 🤝 Skill Matching
- Smart matching algorithm finds users who teach what you want to learn
- **Mutual benefit scoring** — prioritizes users where both can benefit
- Match percentage indicator

### 🔍 Browse & Search
- Browse all users on the platform
- Search by name, skill, or keyword
- Filter by specific skills

### 📬 Connections
- Send connection requests to other users
- Accept/reject incoming requests
- View your connections list

### 🎨 UI/UX
- 🌙 Dark/Light mode toggle
- 📱 Fully responsive design
- ✨ Smooth animations & transitions
- 🎯 Clean, modern interface

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React.js | UI framework |
| React Router | Client-side routing |
| Context API | State management |
| CSS3 | Styling & animations |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | API framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |

## 🚀 Getting Started

### Prerequisites
- Node.js v14+
- MongoDB Atlas account (free) or local MongoDB

### 1. Clone the repo
```bash
git clone https://github.com/sheezan-droid/skillswap.git
cd skillswap
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 3. Setup Frontend
```bash
cd ../client
npm install
```

### 4. Run the app
In one terminal (backend):
```bash
cd server
npm run dev
```

In another terminal (frontend):
```bash
cd client
npm start
```

Open **http://localhost:3000** in your browser!

## 📁 Project Structure

```
skillswap/
├── server/                  # Backend API
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── middleware/
│   │   └── auth.js         # JWT auth middleware
│   ├── models/
│   │   └── User.js         # User schema
│   ├── routes/
│   │   ├── auth.js         # Auth routes (register/login)
│   │   └── users.js        # User CRUD & matching routes
│   ├── server.js           # Express app entry
│   └── package.json
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # Auth context
│   │   ├── App.js          # Main app with routing
│   │   ├── App.css         # Styles
│   │   └── index.css       # Global styles
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| GET | `/api/users` | Browse users (search/filter) | ✅ |
| GET | `/api/users/matches` | Get skill matches | ✅ |
| GET | `/api/users/:id` | Get user profile | ✅ |
| PUT | `/api/users/profile` | Update profile | ✅ |
| POST | `/api/users/connect/:id` | Send connection request | ✅ |
| PUT | `/api/users/connect/:id/accept` | Accept connection | ✅ |

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ **If you found this project helpful, give it a star!**
