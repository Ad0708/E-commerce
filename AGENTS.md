# E-Commerce Platform — Full Project Context

> **Purpose**: This file gives any AI agent complete context about this project. Read this FIRST before writing any code.

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    MONOREPO ROOT                     │
│              apps/ (this directory)                  │
├──────────────────────┬──────────────────────────────┤
│       api/           │           web/                │
│   (Express + Node)   │      (Next.js 16 + React 19) │
│   Port 5000          │      Port 3000                │
│   REST API + Socket  │      SSR + CSR                │
└──────────┬───────────┴──────────────┬───────────────┘
           │                          │
           ▼                          ▼
     MongoDB (Atlas)           Browser Client
     Cloudinary (CDN)          Socket.io Client
```

- **Backend** (`api/`): Express 5 REST API with Socket.IO for real-time notifications
- **Frontend** (`web/`): Next.js 16 with App Router, React 19, TailwindCSS 4, TypeScript
- **Database**: MongoDB via Mongoose 9
- **Realtime**: Socket.IO for push notifications
- **Payments**: Stripe + Razorpay + COD
- **Storage**: Cloudinary for images
- **AI**: OpenAI integration for product descriptions, SEO, inventory insights, customer support
- **Auth**: JWT with httpOnly cookies, dual-secret (admin vs customer)

---

## 2. Tech Stack Details

### Backend (`api/`)
| Tech | Version | Purpose |
|------|---------|---------|
| Node.js | 24.x | Runtime |
| Express | 5.x | Web framework |
| Mongoose | 9.x | MongoDB ODM |
| Socket.IO | 4.x | Real-time events |
| JWT | 9.x | Authentication |
| Zod | 4.x | Request validation |
| Cloudinary | 2.x | Image hosting |
| Multer | 2.x | File uploads |
| Stripe | 22.x | Payment gateway |
| Razorpay | 2.x | Payment gateway |
| OpenAI | 6.x | AI features |
| PDFKit | 0.19 | Invoice PDF generation |
| bcrypt / bcryptjs | | Password hashing |
| dotenv | 17.x | Env vars (via `@dotenvx/dotenvx`) |

### Frontend (`web/`)
| Tech | Version | Purpose |
|------|---------|---------|
| Next.js | 16.2 | React framework (App Router) |
| React | 19.2 | UI library |
| TypeScript | 5.x | Type safety |
| TailwindCSS | 4.x | Styling |
| Zustand | 5.x | Client state management |
| TanStack Query | 5.x | Server state / caching |
| Axios | 1.x | HTTP client |
| Framer Motion | 12.x | Animations |
| React Hook Form | 7.x | Form handling |
| Zod | 4.x | Form validation |
| Lucide React | 1.x | Icons |
| React Hot Toast | 2.x | Toast notifications |
| Socket.IO Client | 4.x | Real-time connection |
| Recharts + ApexCharts | | Admin analytics charts |
| jsPDF + autoTable | | Client-side PDF |
| next-themes | 0.4 | Dark/light mode |
| date-fns | 4.x | Date formatting |

---

## 3. Project Structure

### Backend (`api/src/`)
```
api/
├── .env                          # Environment variables (DO NOT COMMIT)
├── .env.example                  # Template for env vars
├── package.json                  # ES Modules ("type": "module")
└── src/
    ├── server.js                 # Entry point — Express + Socket.IO setup, route mounting
    ├── config/
    │   ├── db.js                 # MongoDB connection (Mongoose)
    │   ├── cloudinary.js         # Cloudinary config
    │   ├── stripe.js             # Stripe instance
    │   └── razorpay.js           # Razorpay instance
    ├── models/                   # Mongoose schemas (see §4 for details)
    │   ├── User.js               # name, email, password, role, avatar, addresses[], isBlocked
    │   ├── Product.js            # name, category, brand, description, price, discountPrice, stock, sku, images[], featured, status
    │   ├── Order.js              # Complex: items[], shippingAddress, payment, summary, appliedCoupon, status, marketing, invoice
    │   ├── Cart.js               # userId, items[], appliedCoupon
    │   ├── Coupon.js             # code, type(percentage/fixed), value, limits, appliesTo, dates
    │   ├── Wishlist.js           # user + product (unique compound index)
    │   ├── Address.js            # Sub-schema (embedded in User.addresses[])
    │   ├── Notification.js       # userId, title, message, type, link, isRead, metadata
    │   ├── Wallet.js             # userId, balance, transactions[]
    │   ├── Refund.js             # orderId, userId, amount, reason, status, refundMethod
    │   └── AdminSetting.js       # Single-doc store config: storeName, banners, contact, tax, shipping, currency, SEO, maintenance, invoice, returns
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── product.controller.js
    │   ├── cart.controller.js
    │   ├── order.controller.js
    │   ├── coupon.controller.js
    │   ├── payment.controller.js
    │   ├── wishlist.controller.js
    │   ├── address.controller.js
    │   ├── profile.controller.js
    │   ├── notification.controller.js
    │   ├── wallet.controller.js
    │   ├── refund.controller.js
    │   ├── invoice.controller.js
    │   ├── store.controller.js   # Public store info (customer-facing)
    │   └── admin/
    │       ├── adminOrder.controller.js
    │       ├── adminRefund.controller.js
    │       ├── adminStore.controller.js   # Admin store settings CRUD
    │       ├── customer.controller.js
    │       ├── inventory.controller.js
    │       ├── ai/               # AI-powered controllers
    │       └── analytics/        # Dashboard analytics controllers
    ├── routes/
    │   ├── auth.routes.js        # /api/auth
    │   ├── product.routes.js     # /api/products
    │   ├── cart.routes.js        # /api/cart
    │   ├── order.routes.js       # /api/orders
    │   ├── coupon.routes.js      # /api/coupons
    │   ├── payment.routes.js     # /api/payment
    │   ├── wishlist.routes.js    # /api/wishlist
    │   ├── address.routes.js     # /api/address
    │   ├── profile.routes.js     # /api/profile
    │   ├── notification.routes.js# /api/notifications
    │   ├── wallet.routes.js      # /api/wallet
    │   ├── refund.routes.js      # /api/refunds
    │   ├── invoice.routes.js     # /api/invoices
    │   ├── store.routes.js       # /api/store (public)
    │   └── admin/
    │       ├── adminOrder.routes.js   # /api/admin/orders
    │       ├── adminStore.routes.js   # /api/admin/store
    │       ├── adminrefund.routes.js  # /api/admin/refunds
    │       ├── analytics.routes.js    # /api/admin/analytics
    │       ├── customer.routes.js     # /api/admin/customers
    │       ├── inventory.routes.js    # /api/inventory
    │       └── ai.routes.js           # /api/admin/ai
    ├── middlewares/
    │   ├── auth.middleware.js    # verifyAdminToken, verifyAnyToken
    │   └── upload.middleware.js  # Multer + Cloudinary
    ├── services/
    │   ├── order.service.js
    │   ├── invoice.service.js   # PDFKit invoice generation
    │   ├── refund.services.js
    │   └── ai/
    │       ├── index.js
    │       ├── ai.service.js              # OpenAI base
    │       ├── productAI.service.js        # Product description generation
    │       ├── seoAI.service.js            # SEO optimization
    │       ├── keywordAI.service.js        # Keyword extraction
    │       ├── imageAI.service.js          # Image handling (remove.bg)
    │       ├── inventoryAI.service.js      # Stock insights
    │       ├── salesAI.service.js          # Sales analytics AI
    │       └── customerSupportAI.service.js # Chat support AI
    ├── validators/              # Zod validation schemas
    │   ├── auth.validations.js
    │   ├── product.validations.js
    │   ├── order.validations.js
    │   ├── adderss.validations.js   # (note: typo in filename)
    │   ├── adminstore.validations.js
    │   ├── customer.validations.js
    │   └── profile.validations.js
    ├── socket/
    │   └── socket.js            # Socket.IO init, join rooms by userId, emitNotification()
    └── utils/
        ├── generateToken.js     # JWT token generation
        ├── sendNotification.js  # Create DB notification + emit socket event
        ├── generateInvoiceNumber.js
        └── wallet.js            # Wallet credit/debit helpers
```

### Frontend (`web/`)
```
web/
├── .env.local                    # NEXT_PUBLIC_API_URL, SOCKET_URL, Stripe key, GA ID
├── .env.example                  # Template
├── next.config.ts                # Image domains: unsplash, cloudinary
├── tailwind.config.ts
├── tsconfig.json
├── proxy.ts                      # Next.js middleware — JWT-based route protection
├── app/
│   ├── layout.tsx                # Root layout (ThemeProvider > QueryProvider > AuthProvider > SocketProvider)
│   ├── page.tsx                  # Redirects to /login
│   ├── globals.css
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   └── signup/
│   ├── (store)/                  # Customer-facing route group (wrapped in MaintenanceGuard)
│   │   ├── layout.tsx
│   │   ├── (shop)/               # Shop pages (with Navbar + Footer)
│   │   │   ├── layout.tsx
│   │   │   ├── home/
│   │   │   ├── products/
│   │   │   ├── product/          # Single product [slug]
│   │   │   ├── cart/
│   │   │   ├── wishlist/
│   │   │   └── customer-support/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── profile/
│   │   ├── settings/
│   │   ├── wallet/
│   │   └── maintenance/
│   └── admin/                    # Admin dashboard
│       ├── layout.tsx            # Admin sidebar layout
│       ├── page.tsx              # Admin dashboard home (analytics)
│       ├── products/
│       ├── orders/
│       ├── customers/
│       ├── inventory/
│       ├── coupons/
│       ├── refunds/
│       ├── settings/
│       └── ai/
├── components/
│   ├── common/                   # Shared: Loader, Navbar, Footer, etc.
│   ├── ui/                       # Reusable UI primitives
│   ├── auth/                     # Login/Signup forms
│   ├── home/                     # Homepage sections
│   ├── products/                 # Product cards, grids, filters
│   ├── cart/                     # Cart drawer, items
│   ├── checkout/                 # Checkout flow
│   ├── orders/                   # Order list, details, tracking
│   ├── address/                  # Address management
│   ├── coupon/                   # Coupon display
│   ├── notification/             # Notification bell, list
│   ├── store/                    # Store info, MaintenanceGuard
│   ├── support/                  # Customer support chat
│   └── admin/                    # All admin-specific components
├── hooks/                        # Custom React hooks (one per feature domain)
│   ├── auth/
│   ├── cart/
│   ├── order/
│   ├── product/
│   ├── wishlist/
│   ├── address/
│   ├── coupon/
│   ├── notification/
│   ├── payment/
│   ├── profile/
│   ├── store/
│   ├── wallet/
│   ├── invoices/
│   ├── admin/
│   ├── adminorders/
│   ├── ai/
│   └── useDebounce.ts
├── api/                          # API call functions (axios wrappers)
│   ├── auth.ts
│   ├── product.ts
│   ├── cart.ts
│   ├── order.ts
│   ├── coupon.ts
│   ├── payment.ts
│   ├── wishlist.ts
│   ├── address.ts
│   ├── profile.ts
│   ├── notification.ts
│   ├── wallet.ts
│   ├── invoice.ts
│   ├── store.ts
│   ├── adminorders.ts
│   ├── ai.ts
│   └── admin/                    # Admin-specific API calls
├── store/                        # Zustand stores (client state)
│   ├── auth.store.ts             # User auth state (persisted to localStorage)
│   ├── cart.store.ts             # Cart items, summary, coupon
│   ├── notification.store.ts     # Unread count, notification list
│   └── wishlist.store.ts         # Wishlist state
├── providers/
│   ├── theme-provider.tsx        # next-themes dark/light mode
│   ├── query-provider.tsx        # TanStack Query client
│   ├── auth-provider.tsx         # Fetches current user on mount
│   ├── socket-provider.tsx       # Socket.IO connection + notification listeners
│   └── marketing-provider.tsx    # UTM parameter tracking
├── types/                        # TypeScript type definitions
│   ├── user.ts
│   ├── product.ts
│   ├── order.ts
│   ├── cart.ts
│   ├── store.ts
│   ├── coupon.ts
│   ├── address.ts
│   ├── input.ts
│   ├── inventory.ts
│   ├── ai.ts
│   ├── refund.ts
│   ├── wishlist.ts
│   ├── adminStore.ts
│   └── analytics/
├── lib/
│   ├── axios/axios.ts            # Axios instance (baseURL from env, withCredentials, 401 interceptor)
│   ├── socket/                   # Socket.IO client instance
│   ├── stripe/                   # Stripe Elements wrapper
│   ├── utils/                    # Utility functions
│   ├── utils.ts                  # clsx + tailwind-merge (cn helper)
│   └── validators/               # Zod schemas (client-side)
├── constants/
│   ├── categories.ts             # Product categories list
│   └── inputStyles.ts            # Shared input styling constants
├── services/                     # (currently empty, hooks + api/ are used instead)
└── public/                       # Static assets
```

---

## 4. Data Models (MongoDB/Mongoose)

### User
```js
{ name, email, password (select:false), role: "customer"|"admin",
  avatar, isVerified, isBlocked, addresses: [Address] (max 10) }
```

### Address (sub-schema embedded in User)
```js
{ fullName, phone, address1, address2, city, state, country:"India", pincode, isDefault }
```

### Product
```js
{ name, category, brand, description, price, discountPrice, stock, sku,
  images: [String], featured, status: "draft"|"active"|"out_of_stock" }
```

### Order
```js
{ userId, orderNumber (unique), items: [OrderItem], shippingAddress, payment, summary,
  appliedCoupon, status: "Pending"|"Confirmed"|"Processing"|"Shipped"|"Out For Delivery"|"Delivered"|"Cancelled",
  marketing: { source, medium, campaign, referrer }, invoice: { invoiceNumber, issuedAt } }
```
- **Payment**: `{ gateway, method, status: "Pending"|"Paid"|"Failed"|"Refunded", transactionId }`
- **Summary**: `{ subtotal, discount, total, itemCount, couponDiscount, savings, deliveryCharge }`

### Cart
```js
{ userId (unique), items: [CartItem], appliedCoupon: { code, discount } }
```

### Coupon
```js
{ code (unique, uppercase), description, type: "percentage"|"fixed", value,
  minimumOrderAmount, maximumDiscount, usageLimit, usedCount,
  status: "active"|"inactive"|"expired"|"scheduled"|"deleted",
  appliesTo: "all"|"products"|"categories", products[], categories[], startDate, expiryDate }
```

### Wishlist
```js
{ user (ObjectId→User), product (ObjectId→Product) }  // compound unique index
```

### Notification
```js
{ userId, title, message, type: "order"|"profile"|"offer"|"wishlist"|"system"|"refund",
  link, isRead, metadata (Mixed) }
```

### Wallet
```js
{ userId (unique), balance, transactions: [{ type: "CREDIT"|"DEBIT", amount, reason,
  referenceId, referenceType: "ORDER"|"REFUND"|"PAYMENT" }] }
```

### Refund
```js
{ orderId, userId, amount, reason, status: "REQUESTED"|"APPROVED"|"REJECTED"|"COMPLETED",
  refundMethod: "WALLET"|"STRIPE"|"RAZORPAY", processedAt, processedBy }
```

### AdminSetting (Single Document — Store Config)
```js
{ storeName, description, logo, banners: [Banner],
  contact: { email, phone, whatsapp },
  address: { street, city, state, country, pincode },
  tax: { gstNumber, vatNumber, taxEnabled, taxRate },
  shipping: { enabled, defaultCharge, freeShipping, freeShippingAmount, estimatedDeliveryDays },
  currency: { code:"INR", symbol:"₹" }, timezone: "Asia/Kolkata",
  socialLinks: { facebook, instagram, twitter, linkedin, youtube },
  business: { businessName, supportEmail, supportPhone },
  seo: { metaTitle, metaDescription, metaKeywords, ogImage },
  maintenance: { enabled, message }, invoice: { prefix, footer, signature, stamp },
  returns: { returnDays, replacementDays }, acceptOrders }
```

---

## 5. API Routes

All routes are prefixed with `/api`. Backend runs on port `5000`.

### Public / Customer Routes
| Route | Auth | Description |
|-------|------|-------------|
| `POST /api/auth/signup` | ❌ | Register customer |
| `POST /api/auth/login` | ❌ | Login (sets httpOnly cookie `token`) |
| `GET /api/auth/me` | ✅ | Get current user |
| `POST /api/auth/logout` | ✅ | Clear cookie |
| `GET /api/products` | ✅ | List products (pagination, filtering, search) |
| `GET /api/products/:id` | ✅ | Single product |
| `GET /api/cart` | ✅ | Get user's cart |
| `POST /api/cart` | ✅ | Add to cart |
| `PATCH /api/cart` | ✅ | Update cart item |
| `DELETE /api/cart/:productId` | ✅ | Remove from cart |
| `GET /api/wishlist` | ✅ | Get wishlist |
| `POST /api/wishlist` | ✅ | Add to wishlist |
| `DELETE /api/wishlist/:productId` | ✅ | Remove from wishlist |
| `GET /api/address` | ✅ | List addresses |
| `POST /api/address` | ✅ | Add address |
| `PUT /api/address/:id` | ✅ | Update address |
| `DELETE /api/address/:id` | ✅ | Delete address |
| `POST /api/orders` | ✅ | Create order |
| `GET /api/orders` | ✅ | User's orders |
| `GET /api/orders/:id` | ✅ | Order detail |
| `PATCH /api/orders/:id/cancel` | ✅ | Cancel order |
| `GET /api/coupons` | ✅ | Available coupons |
| `POST /api/coupons/apply` | ✅ | Apply coupon to cart |
| `POST /api/coupons/remove` | ✅ | Remove coupon |
| `POST /api/payment/stripe/create` | ✅ | Create Stripe payment intent |
| `POST /api/payment/webhook` | ❌ | Stripe webhook (raw body) |
| `GET /api/wallet` | ✅ | Get wallet balance |
| `GET /api/notifications` | ✅ | List notifications (paginated) |
| `PATCH /api/notifications/:id/read` | ✅ | Mark as read |
| `GET /api/profile` | ✅ | Get profile |
| `PUT /api/profile` | ✅ | Update profile |
| `GET /api/invoices/:orderId` | ✅ | Download invoice PDF |
| `POST /api/refunds` | ✅ | Request refund |
| `GET /api/store/basic` | ✅ | Public store info |
| `GET /api/store/banners` | ✅ | Active banners |

### Admin Routes (require `verifyAdminToken`)
| Route | Description |
|-------|-------------|
| `GET /api/admin/orders` | All orders (pagination, filters) |
| `PATCH /api/admin/orders/:id/status` | Update order status |
| `GET /api/admin/customers` | Customer management |
| `GET /api/admin/analytics/*` | Dashboard stats, charts |
| `GET/PUT /api/admin/store/*` | Store settings CRUD (all sections) |
| `GET /api/inventory` | Inventory management |
| `GET /api/admin/refunds` | All refund requests |
| `PATCH /api/admin/refunds/:id` | Approve/reject refund |
| `POST /api/admin/ai/*` | AI features (product desc, SEO, etc.) |

---

## 6. Authentication Flow

1. **Login/Signup** → Backend creates JWT with `{ id, role }` using role-specific secret (`JWT_CUSTOMER_SECRET` or `JWT_ADMIN_SECRET`)
2. **Token Storage** → Set as httpOnly cookie named `token`
3. **Middleware** → `verifyAnyToken` tries admin secret first, then customer secret
4. **Frontend Middleware** (`proxy.ts` / `middleware.ts`) → Decodes JWT on Edge to:
   - Redirect logged-in users away from `/login`, `/signup`
   - Redirect customers away from `/admin`
   - Redirect unauthenticated users to `/login`
5. **Axios Interceptor** → On 401 response: clears localStorage, redirects to `/login`
6. **Auth Provider** → On mount, calls `GET /api/auth/me` to hydrate Zustand auth store

---

## 7. Frontend Patterns & Conventions

### State Management
- **Server State**: TanStack Query (caching, pagination, optimistic updates)
- **Client State**: Zustand stores (auth, cart, notifications, wishlist)
- **Form State**: React Hook Form + Zod resolvers

### Data Flow Pattern
```
Component → Hook (useMutation/useQuery) → API function (axios) → Backend Controller → Mongoose Model
```

### Hook Convention
Each feature domain has its own hooks folder:
```
hooks/cart/useAddToCart.ts       → useMutation wrapping api/cart.ts addToCart()
hooks/product/useProducts.ts    → useQuery wrapping api/product.ts getProducts()
hooks/order/useCreateOrder.ts   → useMutation wrapping api/order.ts createOrder()
```

### API Function Convention
Each `api/*.ts` file exports named functions:
```ts
// api/cart.ts
export const getCart = () => api.get("/cart").then(res => res.data);
export const addToCart = (data) => api.post("/cart", data).then(res => res.data);
```

### Provider Wrapping Order (root layout)
```
ThemeProvider → QueryProvider → Suspense → MarketingProvider → AuthProvider → SocketProvider → {children}
```

### Styling
- **TailwindCSS 4** with `@tailwindcss/postcss`
- `cn()` helper from `lib/utils.ts` (clsx + tailwind-merge)
- Constants in `constants/inputStyles.ts` for consistent form styling
- `next-themes` for dark/light mode toggle
- Icons via `lucide-react`

### Route Groups
- `(auth)` — Login/Signup pages (no navbar)
- `(store)` — All customer-facing pages (MaintenanceGuard wrapper)
- `(shop)` — Nested in (store), has Navbar + Footer layout
- `admin/` — Admin dashboard (sidebar layout)

---

## 8. Key Integrations

### Payments
- **Stripe**: Create PaymentIntent → confirm on frontend → webhook verifies
- **Razorpay**: Create order → frontend checkout → verify signature
- **COD**: Direct order creation, payment status "Pending"
- Webhook endpoint: `POST /api/payment/webhook` (raw body middleware BEFORE json parser)

### Real-time (Socket.IO)
- Server: `socket.js` — rooms per userId, `emitNotification(userId, notification)`
- Client: `socket-provider.tsx` — auto-connect when user exists, listens for `notification` event
- Used for: order status updates, refund updates, system notifications
- Also triggers browser Notification API (push)

### Cloudinary
- Image upload via Multer + multer-storage-cloudinary
- Domains whitelisted in `next.config.ts`: `res.cloudinary.com`, `images.unsplash.com`

### AI (OpenAI)
- Product description generation
- SEO meta tag generation
- Keyword extraction
- Image background removal (remove.bg)
- Inventory insights
- Sales analytics
- Customer support chatbot

### Marketing / Analytics
- UTM parameter tracking (stored in cookies via middleware, attached to orders)
- Google Analytics 4 via `@next/third-parties/google`

---

## 9. Environment Variables

### Backend (`api/.env`)
```
PORT=5000
MONGO_URI=mongodb+srv://...
FRONTEND_URL=http://localhost:3000
JWT_CUSTOMER_SECRET=...
JWT_ADMIN_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
OPENAI_API_KEY=...
REMOVE_BG_API_KEY=...
```

### Frontend (`web/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
NEXT_PUBLIC_GA_MEASUREMENT_ID=...
```

---

## 10. Development Commands

```bash
# Backend
cd api
npm start                    # runs: node src/server.js (port 5000)

# Frontend
cd web
npm run dev                  # runs: next dev (port 3000)
npm run build                # production build
npm run lint                 # ESLint
```

---

## 11. Important Notes & Gotchas

1. **Next.js 16 Breaking Changes**: Read `node_modules/next/dist/docs/` before using Next.js APIs. Many APIs have changed from older versions.
2. **ES Modules**: Backend uses `"type": "module"` — all imports use `.js` extensions.
3. **Middleware file**: The Next.js middleware is in `proxy.ts` at web root (NOT the standard `middleware.ts` name — check if it's correctly detected).
4. **Cookie-based auth**: Tokens are in httpOnly cookies, NOT localStorage. The Zustand auth store persists user data to localStorage for UI, but auth itself is cookie-based.
5. **Single AdminSetting document**: The store configuration is a single MongoDB document — use `findOne()` or upsert patterns, not `find()`.
6. **Address sub-schema**: Addresses are embedded in the User document (max 10), NOT a separate collection.
7. **Cart is per-user**: Each user has one cart document (unique on userId).
8. **Stripe webhook**: The `/api/payment/webhook` route uses `express.raw()` and MUST be registered BEFORE `express.json()` — this is already handled in `server.js`.
9. **Validators typo**: `adderss.validations.js` has a typo (should be `address`).
10. **Socket CORS**: Socket.IO is configured to accept connections from both `localhost:3000` and `192.168.2.28:3000`.
11. **Image sources**: Product images come from Cloudinary. The Next.js config allows `res.cloudinary.com` and `images.unsplash.com`.
12. **Currency**: Default is INR (₹), configurable via AdminSetting.

---

## 12. Common Modification Patterns

### Adding a new API endpoint
1. Create model in `api/src/models/` (if new entity)
2. Add validation in `api/src/validators/`
3. Create controller in `api/src/controllers/`
4. Create route file in `api/src/routes/`
5. Mount route in `api/src/server.js`

### Adding a new frontend feature
1. Add TypeScript types in `web/types/`
2. Create API functions in `web/api/`
3. Create hooks in `web/hooks/<feature>/`
4. Create components in `web/components/<feature>/`
5. Add page in `web/app/(store)/(shop)/` or `web/app/admin/`
6. Update Zustand store if client state is needed

### Adding a new admin section
1. Backend: controller + route under `admin/` directories
2. Frontend: page under `web/app/admin/<section>/`
3. Component under `web/components/admin/<section>/`
4. Hook under `web/hooks/admin/`
5. API function in `web/api/admin/`
