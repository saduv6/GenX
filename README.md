# GenX Laptop

A complete e-commerce website for a laptop store built with React, TypeScript, Vite, Tailwind CSS, and Firebase Realtime Database.

## Features

- **Interactive Splash Screen** - Animated SVG laptop with click-to-enter
- **Store Page** - Hero slider, search, category filters, product grid with pagination
- **Product Detail Page** - Full specs, quantity selector, add to cart
- **Cart Page** - Quantity controls, remove items, total calculation
- **Checkout Page** - Egyptian COD form with honeypot spam protection
- **Compare Page** - Side-by-side laptop comparison (up to 4)
- **Static Pages** - FAQ, Terms of Service, Warranty
- **Admin Dashboard** - Hidden route, password protected, full CRUD
  - Dashboard stats (orders, products, revenue)
  - Orders management with status changes
  - Laptops CRUD with image picker
  - Image upload/management (base64)
  - Settings (store info, colors, social links, password)

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Firebase Realtime Database
- Lucide React Icons
- React Router DOM

## Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project with Realtime Database enabled

## Setup Guide

### 1. Clone and Install

```bash
git clone <repository-url>
cd genx-laptop
npm install
```

### 2. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Realtime Database
4. Go to Project Settings and copy your config

### 3. Environment Variables

Create a `.env` file in the root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# IMPORTANT: Change this to a long random secret string
VITE_ADMIN_ROUTE=/x7K9mP2qL5nR4tY
```

### 4. Firebase Database Rules

Set your Realtime Database rules to:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

For production, tighten these rules.

### 5. Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173`

### 6. Access Admin Dashboard

Visit `http://localhost:5173/your-secret-route`

Default password: `admin123`

You will be forced to change it on first login.

### 7. Build for Production

```bash
npm run build
```

The `dist/` folder will be created.

### 8. Deploy to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Drag and drop the `dist/` folder, or connect your GitHub repo
3. In Site Settings > Environment Variables, add all the variables from your `.env` file
4. Trigger a new deploy

## Project Structure

```
src/
  components/custom/    # Reusable components (Header, Footer, SplashScreen, Toast)
  components/ui/        # shadcn/ui components
  hooks/                # Custom hooks (useCart, useSettings, useDebounce, etc.)
  lib/                  # Firebase config & database operations
  pages/                # Page components
    admin/              # Admin dashboard tabs
  types/                # TypeScript type definitions
```

## Database Structure

```
laptops/
  {id}: { name, image, price, category, cpu, ram, storage, gpu, screen, description, inStock, isActive, sortOrder, bestSeller }
orders/
  {id}: { customerName, phone, address, items[], total, status, createdAt }
carts/
  {sessionId}: { items[] }
images/
  {id}: { path (base64), isActive, createdAt }
settings/: { storeName, contactPhone, social links, heroTitle, heroSubtitle, logoUrl, primaryColor, footerText, adminPasswordHash, adminPasswordSalt }
```

## Security Notes

- The admin route is hidden and defined by `VITE_ADMIN_ROUTE` environment variable
- Admin passwords are SHA-256 hashed with a salt
- Checkout includes a honeypot field to prevent basic bot spam
- For production, consider adding Firebase Auth and tighter database rules
