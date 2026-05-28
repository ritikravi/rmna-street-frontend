# RMNA Street — E-Commerce Platform

Premium men's streetwear e-commerce built with React + Node.js + MongoDB.

---

## Project Structure

```
rmna-street/
├── backend/          # Node.js + Express API
│   ├── config/       # DB, Cloudinary config
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Auth, error handling
│   ├── models/       # Mongoose schemas
│   ├── routes/       # Express routers
│   └── utils/        # Email, seed scripts
└── frontend/         # React + Vite app
    └── src/
        ├── pages/    # All page components
        ├── components/
        ├── store/    # Redux slices
        └── utils/    # API client, helpers
```

---

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env   # Fill in your values
node utils/seedAdmin.js  # Create admin user
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # Set VITE_API_URL
npm run dev
```

---

## Environment Variables

### Backend `.env`
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `CLOUDINARY_*` | Cloudinary credentials |
| `EMAIL_*` | SMTP credentials for OTP emails |
| `ADMIN_EMAIL` | Initial admin email |
| `ADMIN_PASSWORD` | Initial admin password |
| `CLIENT_URL` | Frontend URL for CORS |

### Frontend `.env`
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/verify-otp` | Verify email OTP |
| GET | `/api/auth/profile` | Get profile (auth) |
| PUT | `/api/auth/profile` | Update profile (auth) |
| POST | `/api/auth/address` | Add address (auth) |
| DELETE | `/api/auth/address/:id` | Delete address (auth) |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List products (filters: keyword, size, fitType, minPrice, maxPrice, sort, page) |
| GET | `/api/products/:id` | Product detail |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

### Cart
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cart` | Get cart (auth) |
| POST | `/api/cart` | Add to cart (auth) |
| PUT | `/api/cart/:itemId` | Update quantity (auth) |
| DELETE | `/api/cart/:itemId` | Remove item (auth) |
| DELETE | `/api/cart` | Clear cart (auth) |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Place order (auth) |
| GET | `/api/orders/my` | My orders (auth) |
| GET | `/api/orders/:id` | Order detail (auth) |
| PUT | `/api/orders/:id/cancel` | Cancel order (auth) |
| POST | `/api/orders/validate-coupon` | Validate coupon (auth) |

### Wishlist
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/wishlist` | Get wishlist (auth) |
| POST | `/api/wishlist/toggle` | Toggle product (auth) |

### Reviews
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/reviews/:productId` | Add review (auth, must have purchased) |
| DELETE | `/api/reviews/:productId/:reviewId` | Delete review (auth) |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Stats & recent orders |
| GET | `/api/admin/orders` | All orders |
| PUT | `/api/admin/orders/:id/status` | Update order status |
| GET | `/api/admin/users` | All users |
| POST | `/api/admin/coupons` | Create coupon |
| GET | `/api/admin/coupons` | List coupons |
| DELETE | `/api/admin/coupons/:id` | Delete coupon |

---

## Deployment

### Frontend → Vercel
1. Push `frontend/` to GitHub
2. Import in Vercel, set `VITE_API_URL` to your Render backend URL
3. Deploy — `vercel.json` handles SPA routing

### Backend → Render
1. Push `backend/` to GitHub
2. Create a new Web Service on Render
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add all environment variables from `.env.example`

---

## Admin Access

After seeding, login with the credentials set in `ADMIN_EMAIL` / `ADMIN_PASSWORD`.  
Admin panel is at `/admin`.
