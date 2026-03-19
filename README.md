# WMS — Warehouse Management System

Charcoal Neumorphism design. Full-stack: Next.js 14 + Express + MongoDB.

---

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

---

### 1. Backend

```bash
cd RAW/backend
npm install
npm run dev        # uses nodemon, auto-restarts on save
# OR
npm start          # plain node
```

Server starts at: **http://localhost:5000**

---

### 2. Frontend

```bash
cd RAW/frontend
npm install
npm run dev
```

App runs at: **http://localhost:3000**

---

## Features

| Feature | Details |
|---|---|
| Add Product | Name, SKU, Category, Qty, Price |
| Auto SKU | Generated if left blank |
| Auto Status | In Stock / Low Stock (≤10) / Out of Stock (0) |
| Edit | Inline modal edit |
| Delete | One-click remove |
| Search | Filter by name, SKU, or category |
| Stats | Live counts + total inventory value |
| Toasts | Success / warning / error notifications |

## API Endpoints

| Method | Route | Description |
|---|---|---|
| GET | /products | List all products |
| POST | /products | Add product |
| PUT | /products/:id | Update product |
| DELETE | /products/:id | Delete product |
| GET | /stats | Dashboard stats |

## Project Structure

```
RAW/
├── backend/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── package.json
    ├── tsconfig.json
    └── next.config.js
```
