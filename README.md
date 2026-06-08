# 🌿 Urban Harvest Hub

A full-stack Progressive Web Application (PWA) connecting urban communities with sustainable products, workshops, and eco-friendly living. Built with **React + Vite** (frontend) and **Express + MySQL** (backend).

---

## 🌐 Live Deployment

| Service | URL |
|---------|-----|
| **Frontend (Netlify)** | https://kaleidoscopic-blini-15e0da.netlify.app |
| **Backend API (Railway)** | https://urban-harvest-hub-production-5fc4.up.railway.app |
| **API Status Check** | https://urban-harvest-hub-production-5fc4.up.railway.app/api/status |

---

## 📁 Project Structure

```
urban-harvest-hub/
├── backend/          # Node.js + Express REST API
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── database.js   # MySQL connection + auto schema creation
│   ├── server.js     # Express app entry point
│   ├── seed.js       # Database seeder (demo users + items)
│   └── .env          # Backend environment variables
└── frontend/         # React + Vite SPA / PWA
    ├── public/       # Static assets, manifest, service worker
    ├── src/
    │   ├── assets/   # Static JSON seed data (items.json)
    │   ├── components/
    │   ├── context/  # React Context (Auth, Theme, Language)
    │   ├── hooks/    # Custom hooks (useWeather)
    │   ├── pages/
    │   └── locales/  # i18n translation files
    └── .env          # Frontend environment variables
```

---

## ⚙️ Prerequisites

Make sure the following are installed before proceeding:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18+ | https://nodejs.org |
| npm | v9+ | Included with Node.js |
| XAMPP (MySQL) | Any | https://www.apachefriends.org |

---

## 🗄️ Database Setup

The application uses **MySQL**. The schema is created automatically when the backend starts — no manual SQL required.

### Step 1 — Start MySQL via XAMPP

1. Open **XAMPP Control Panel**
2. Click **Start** next to **MySQL**
3. MySQL will run on the default port **3306**

### Step 2 — Verify `.env` Configuration

Open `backend/.env` and confirm these values match your MySQL setup:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=          # Leave blank if XAMPP default (no password)
DB_NAME=urban_harvest_hub
DB_PORT=3306
JWT_SECRET=urban_harvest_hub_secret_key
NODE_ENV=development
```

> **Note:** The database `urban_harvest_hub` is created automatically if it does not exist. The tables (`users`, `items`, `bookings`, `reviews`, `subscriptions`, `push_subscriptions`) are also created automatically on first run.

### Step 3 — Seed the Database (Demo Data)

After the backend is running (see next section), open a **new terminal** and run:

```bash
cd backend
node seed.js
```

This creates the following demo accounts and 10 sample items:

| Role   | Email               | Password       |
|--------|---------------------|----------------|
| Admin  | admin@harvest.hub   | adminpassword  |
| Member | john@gmail.com      | password123    |

---

## 🚀 Running the Backend Locally

### Step 1 — Install dependencies

```bash
cd backend
npm install
```

### Step 2 — Start the server

```bash
node server.js
```

**Expected output:**
```
Database 'urban_harvest_hub' verified/created.
Database tables initialized successfully.
======================================
Urban Harvest Hub Server is running on port 5000
URL: http://localhost:5000
======================================
```

> For auto-reload on file changes during development, use `npm run dev` (requires nodemon).

The API is now live at: **`http://localhost:5000`**

---

## 🖥️ Running the Frontend Locally

### Step 1 — Install dependencies

```bash
cd frontend
npm install
```

### Step 2 — Configure environment (optional)

The frontend `.env` file is pre-configured for local development:

```env
VITE_API_URL=http://localhost:5000
VITE_OPENWEATHER_API_KEY=   # Optional: add key for live weather data
```

> If `VITE_OPENWEATHER_API_KEY` is left blank, the weather widget uses simulated data automatically.

### Step 3 — Start the development server

```bash
npm run dev
```

**Expected output:**
```
VITE v8.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Open **`http://localhost:5173`** in your browser.

> **Note:** Both the backend (`port 5000`) and frontend (`port 5173`) must be running at the same time for full functionality.

---

## 🔌 API Reference & Testing

The base URL for all API endpoints is: `http://localhost:5000`

### Health Check

```
GET /api/status
```
Returns `{ status: "online" }` — confirms the server is running.

---

### 🔐 Authentication Endpoints

#### Register a new user
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword",
  "role": "member"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@harvest.hub",
  "password": "adminpassword"
}
```
> Returns a JWT token. Use this token in the `Authorization: Bearer <token>` header for protected routes.

---

### 📦 Items Endpoints (CRUD)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/items` | None | List all items (supports `?category=food&search=tomato&sort=price_asc`) |
| `GET` | `/api/items/:id` | None | Get single item by ID |
| `POST` | `/api/items` | Admin JWT | Create a new item |
| `PUT` | `/api/items/:id` | Admin JWT | Update an existing item |
| `DELETE` | `/api/items/:id` | Admin JWT | Delete an item |

**Example — Get all food items sorted by price:**
```
GET http://localhost:5000/api/items?category=food&sort=price_asc
```

**Example — Create item (Admin only):**
```http
POST /api/items
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "title": "Herb Garden Workshop",
  "description": "Grow your own herbs at home.",
  "category": "food",
  "price": 20.00,
  "image": "https://images.unsplash.com/...",
  "availability": 20,
  "location": "40.7128,-74.0060",
  "date": "2026-08-01"
}
```

---

### 📅 Bookings Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/bookings` | Admin JWT | View all bookings |
| `POST` | `/api/bookings` | Optional JWT | Create a booking |

**Example — Create a booking:**
```http
POST /api/bookings
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@gmail.com",
  "itemId": 1,
  "date": "2026-07-15",
  "quantity": 2
}
```

---

### ⭐ Reviews Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/reviews?itemId=1` | None | Get reviews for an item |
| `POST` | `/api/reviews` | Member JWT | Submit a review |

---

### 📬 Subscriptions Endpoint

```http
POST /api/subscriptions
Content-Type: application/json

{
  "email": "user@example.com",
  "frequency": "weekly"
}
```

---

### Testing with a REST Client

You can test all endpoints using:

- **Postman** — import the above requests manually
- **Thunder Client** (VS Code extension) — lightweight alternative
- **curl** (terminal):

```bash
# Health check
curl http://localhost:5000/api/status

# Get all items
curl http://localhost:5000/api/items

# Login and get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@harvest.hub\",\"password\":\"adminpassword\"}"
```

---

## 🖱️ GUI Testing Guide

Once both servers are running, open **`http://localhost:5173`** in your browser.

### Pages to Test

| Page | URL | What to Test |
|------|-----|-------------|
| **Home** | `/` | Hero section, category cards, featured items, weather widget |
| **Categories** | `/categories` | 3 category cards (Food, Lifestyle, Education) |
| **Category Detail** | `/categories/food` | Filtered items loaded from API |
| **Products** | `/products` | Search bar, category filter, sort dropdown, item grid |
| **Product Detail** | `/products/1` | Item info, weather widget, booking button, reviews |
| **Booking** | `/book/1` | Form validation, quantity selector, submit booking |
| **Subscribe** | `/subscribe` | Veggie box subscription form |
| **Login** | `/login` | Sign in with test credentials |
| **Register** | `/register` | Create a new account |
| **Admin Panel** | `/admin` | CRUD management (admin login required) |

### Key Features to Verify

1. **Dark Mode** — Click the sun/moon icon in the navbar
2. **Language Switch** — Click the 🌐 / "ES" button to toggle English/Spanish
3. **Search & Filter** — On `/products`, type in the search box and change category/sort
4. **Offline Fallback** — Disconnect internet; static data still loads from `items.json`
5. **PWA Install** — On mobile or Chrome, look for the "Install App" prompt
6. **Admin CRUD** — Log in as `admin@harvest.hub` / `adminpassword`, visit `/admin` to create/edit/delete items

---

## 🏗️ Tech Stack

### Frontend
- **React 19** + **Vite 8**
- **React Router v7** — client-side routing
- **Tailwind CSS v3** — utility-first styling with custom theme
- **vite-plugin-pwa** + **Workbox** — service worker & PWA
- **i18next** — internationalisation (EN/ES)
- **Lucide React** — icon library

### Backend
- **Node.js** + **Express 5**
- **MySQL2** — database driver
- **bcryptjs** — password hashing
- **jsonwebtoken** — JWT authentication
- **express-validator** — input validation & sanitization
- **web-push** — push notification support

---

## 🔒 Security Notes

- All passwords are hashed using **bcrypt** (salt rounds: 10)
- JWT tokens expire and are validated on each request
- All API inputs are validated and sanitized with `express-validator`
- SQL injection is prevented via **parameterized queries** (`mysql2 execute`)
- Admin-only routes are protected with `authenticateToken` + `requireAdmin` middleware
