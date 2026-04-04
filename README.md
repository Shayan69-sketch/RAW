# RAWTHREAD — Premium Fitness Apparel eCommerce

A full-stack MERN (MongoDB, Express, React, Node.js) eCommerce web application.

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ — [Download](https://nodejs.org/)
- **MongoDB** — Choose one:
  - [MongoDB Atlas](https://www.mongodb.com/atlas) (FREE cloud — recommended for beginners)
  - [MongoDB Community](https://www.mongodb.com/try/download/community) (local install)

### Setup

**Option 1 — Run the setup script:**
```bash
# Windows
setup.bat
```

**Option 2 — Manual:**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Configure MongoDB

**Using Atlas (Recommended):**
1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a cluster → Get connection string
3. Edit `server/.env`:
```
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/rawthread
```

**Using Local MongoDB:**
- Just install MongoDB Community Edition — the default `.env` works out of the box.

### Run

```bash
# Terminal 1 — Start the backend
cd server
npm run dev

# Terminal 2 — Start the frontend
cd client
npm run dev

# Terminal 3 — Seed the database (run once)
cd server
npm run seed
```

### Access
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

### Demo Credentials (after seeding)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@rawthread.com | admin123456 |
| User | john@example.com | password123 |

### Coupon Codes
- `WELCOME10` — 10% off (min $50)
- `SAVE20` — $20 off (min $100)
- `SUMMER25` — 25% off (min $75)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| State | Redux Toolkit, RTK Query |
| Routing | React Router v7 |
| UI | Framer Motion, Swiper, React Icons, Recharts |
| Backend | Express.js, Node.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (access + refresh tokens) |
| Payments | Stripe, PayPal |
| Images | Cloudinary |
| Email | Nodemailer |

## 📁 Project Structure

```
Project/
├── server/              # Express API
│   ├── config/          # DB, Cloudinary, Stripe setup
│   ├── controllers/     # 11 route controllers
│   ├── middleware/       # Auth, error, rate limiting, uploads
│   ├── models/          # 8 Mongoose models
│   ├── routes/          # API route modules
│   ├── seed/            # Database seeder
│   └── utils/           # Helpers, email templates
├── client/              # React SPA
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── features/    # Redux state slices
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components (20+)
│   │   ├── services/    # RTK Query API endpoints
│   │   └── utils/       # Constants, helpers
│   └── vite.config.js
├── setup.bat            # Windows setup script
└── README.md
```

## ✨ Features

- 🛒 Full cart & checkout flow (multi-step)
- 🔐 JWT authentication with refresh tokens
- 👤 User accounts (profile, orders, addresses, wishlist)
- 🔍 Live product search with debounce
- 🏷️ Advanced filtering (gender, category, size, sport, price)
- 💳 Stripe & PayPal payment integration
- 📊 Admin dashboard with revenue charts
- 📱 Fully responsive design
- 📧 Transactional email templates
- 🍪 Cookie consent banner
- 🔝 Back-to-top button
- 🎯 SEO optimized (React Helmet)
