# 🚀 IMPLEMENTATION ROADMAP

## 📅 Project Timeline (8-12 weeks to Production)

```
WEEK 1-2   |█████ | Backend Setup & Database
WEEK 3-4   |████  | Authentication & Authorization
WEEK 5-6   |████  | Core E-Commerce Features
WEEK 7-8   |████  | Payment Integration & Order System
WEEK 9-10  |███   | Missing Pages & Admin Features
WEEK 11-12 |██    | Deployment, Optimization & Polish
```

---

## 📋 DETAILED TIMELINE & TASKS

### 🔵 PHASE 1: BACKEND SETUP (Week 1-2)
**Goal:** Foundation with database and basic APIs

#### Week 1: Database & ORM Setup

**Task 1.1: Database Planning & Setup**
- [ ] Choose database: PostgreSQL (recommended) vs MySQL vs MongoDB
- [ ] Setup hosted database: Supabase, Railway, AWS RDS
- [ ] Create database connection string
- [ ] Setup connection pooling
- **Assignee:** Backend Lead
- **Time:** 4-6 hours
- **Files to create:**
  ```
  .env.local
  .env.example
  .env.production
  ```

**Task 1.2: Install & Configure Prisma**
```bash
npm install @prisma/client prisma
npx prisma init
```
- [ ] Setup Prisma schema
- [ ] Create initial migrations
- **Assignee:** Backend Lead
- **Time:** 3-4 hours
- **Files:**
  ```
  prisma/schema.prisma
  prisma/migrations/
  ```

**Task 1.3: Database Schema Design**
Models needed:
```prisma
- User (id, email, password, name, role, createdAt)
- Product (id, name, description, price, stock, category, brand)
- Category (id, name, description)
- Brand (id, name, logo)
- Cart (id, userId, items, createdAt, updatedAt)
- CartItem (cartId, productId, quantity)
- Order (id, userId, items, total, status, shippingAddress)
- OrderItem (orderId, productId, quantity, price)
- Wishlist (id, userId, products)
- Review (id, productId, userId, rating, comment)
- Coupon (id, code, discount, expiryDate)
- Address (id, userId, name, street, city, state, zip)
```
- **Assignee:** Database Designer
- **Time:** 6-8 hours

**Task 1.4: Create Database Migrations**
```bash
npx prisma migrate dev --name init
npx prisma generate
```
- [ ] Run migrations locally
- [ ] Seed database with sample data (optional)
- **Assignee:** Backend Lead
- **Time:** 2-3 hours

#### Week 2: Basic API Routes

**Task 2.1: Setup API Route Structure**
```
app/api/
├── auth/
├── products/
├── categories/
├── brands/
├── cart/
├── orders/
├── users/
├── reviews/
└── health/
```
- [ ] Create route handlers
- [ ] Setup error handling middleware
- **Assignee:** Backend Lead
- **Time:** 4-5 hours

**Task 2.2: Implement Product APIs**
- [ ] GET /api/products (list with pagination)
- [ ] GET /api/products/[id] (detail)
- [ ] GET /api/products?category=X&brand=Y (filter)
- **Assignee:** Backend Dev
- **Time:** 4-6 hours

```typescript
// Example GET /api/products
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '12';
  
  const products = await prisma.product.findMany({
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });
  
  return Response.json(products);
}
```

**Task 2.3: Implement Category & Brand APIs**
- [ ] GET /api/categories
- [ ] GET /api/brands
- [ ] GET /api/categories/[id]
- [ ] GET /api/brands/[id]
- **Assignee:** Backend Dev
- **Time:** 2-3 hours

**Task 2.4: Implement Health Check & Error Handling**
- [ ] GET /api/health (connection check)
- [ ] Global error handler
- [ ] API response standardization
- **Assignee:** Backend Lead
- **Time:** 2-3 hours

**Task 2.5: Environment Setup**
```env
# .env.local
DATABASE_URL=postgresql://user:password@host:port/dbname
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=your_secret_key
```
- [ ] Setup environment variables
- [ ] Add .env.local to .gitignore
- [ ] Create .env.example template
- **Assignee:** DevOps
- **Time:** 1 hour

**Deliverables Week 1-2:**
- ✅ PostgreSQL database with Prisma
- ✅ Basic database schema
- ✅ Product/Category/Brand APIs working
- ✅ Environment configuration ready

---

### 🟠 PHASE 2: AUTHENTICATION (Week 3-4)
**Goal:** User authentication and authorization system

#### Week 3: Auth Setup

**Task 3.1: Setup NextAuth.js (Recommended)**
```bash
npm install next-auth
```
- [ ] Configure NextAuth.js
- [ ] Setup JWT strategy
- [ ] Create auth callbacks
- **Assignee:** Auth Specialist
- **Time:** 4-6 hours
- **Files:**
  ```
  app/api/auth/[...nextauth]/route.ts
  lib/auth.ts
  ```

**Alternative: Manual JWT Setup** (if not using NextAuth)
```bash
npm install jsonwebtoken bcryptjs
```
- [ ] Create JWT utilities
- [ ] Create auth middleware
- [ ] Setup token refresh logic

**Task 3.2: User Model & Password Hashing**
- [ ] Add password field to User model
- [ ] Implement bcrypt hashing
- [ ] Create user repository functions
- **Assignee:** Backend Dev
- **Time:** 3-4 hours

**Task 3.3: Create Login/Register Pages**
- [ ] Design login form UI
- [ ] Design register form UI
- [ ] Form validation with Zod
- [ ] Connect to auth API
- **Assignee:** Frontend Dev
- **Files:**
  ```
  app/login/page.tsx
  app/register/page.tsx
  components/LoginForm.tsx
  components/RegisterForm.tsx
  ```
- **Time:** 6-8 hours

```typescript
// Example login page component
'use client'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const handleLogin = async (email: string, password: string) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    
    if (result?.ok) {
      // Redirect to dashboard
    }
  }
  
  return (
    <LoginForm onSubmit={handleLogin} />
  )
}
```

#### Week 4: Auth Integration

**Task 4.1: Implement Auth APIs**
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] POST /api/auth/logout
- [ ] POST /api/auth/refresh
- [ ] GET /api/auth/me (current user)
- **Assignee:** Backend Dev
- **Time:** 6-8 hours

**Task 4.2: Protected Routes & Middleware**
- [ ] Create auth middleware
- [ ] Protect admin routes
- [ ] Protect user profile routes
- [ ] Add session validation
- **Assignee:** Backend Lead
- **Time:** 4-5 hours

```typescript
// Middleware to protect routes
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*']
}
```

**Task 4.3: Forgot Password Flow**
- [ ] Create forgot password page
- [ ] Send password reset email (setup later)
- [ ] Implement password reset endpoint
- [ ] Create reset token management
- **Assignee:** Frontend + Backend Dev
- **Files:**
  ```
  app/forgot-password/page.tsx
  app/reset-password/page.tsx
  app/api/auth/forgot-password/route.ts
  app/api/auth/reset-password/route.ts
  ```
- **Time:** 4-6 hours

**Task 4.4: Role-Based Access Control (RBAC)**
- [ ] Add role field to User model (admin, user, moderator)
- [ ] Create role checking utilities
- [ ] Protect admin endpoints with role check
- [ ] Update middleware for role validation
- **Assignee:** Backend Lead
- **Time:** 3-4 hours

**Task 4.5: Update UI with Auth State**
- [ ] Update header to show user info
- [ ] Add logout button
- [ ] Show login/register links for guests
- [ ] Add profile link for authenticated users
- **Assignee:** Frontend Dev
- **Time:** 2-3 hours

**Deliverables Week 3-4:**
- ✅ Full authentication system
- ✅ Login/Register/Password reset pages
- ✅ Protected routes with role-based access
- ✅ Auth APIs working
- ✅ User session management

---

### 🟡 PHASE 3: CORE E-COMMERCE (Week 5-6)
**Goal:** Shopping cart, wishlist, orders

#### Week 5: Cart & Order System

**Task 5.1: Shopping Cart API**
- [ ] POST /api/cart/add
- [ ] DELETE /api/cart/remove
- [ ] PUT /api/cart/[id] (update quantity)
- [ ] GET /api/cart (get user cart)
- [ ] POST /api/cart/clear
- **Assignee:** Backend Dev
- **Time:** 5-7 hours

```typescript
// POST /api/cart/add
export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await req.json()
  
  let cart = await prisma.cart.findUnique({
    where: { userId: session.user.id }
  })
  
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: session.user.id }
    })
  }
  
  const cartItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: body.productId,
      quantity: body.quantity || 1
    }
  })
  
  return Response.json(cartItem)
}
```

**Task 5.2: Update Cart UI Component**
- [ ] Connect cart page to API
- [ ] Show real cart items
- [ ] Update quantity functionality
- [ ] Remove item functionality
- [ ] Calculate total price
- **Assignee:** Frontend Dev
- **Files:** `app/(user)/cart/page.tsx`
- **Time:** 4-6 hours

**Task 5.3: Order Creation API**
- [ ] POST /api/orders (create order from cart)
- [ ] Clear cart after order
- [ ] Update product stock
- [ ] Generate order number
- **Assignee:** Backend Dev
- **Time:** 5-6 hours

**Task 5.4: Order History API**
- [ ] GET /api/orders (list user orders)
- [ ] GET /api/orders/[id] (order detail)
- [ ] GET /api/orders/[id]/items (order items)
- **Assignee:** Backend Dev
- **Time:** 3-4 hours

#### Week 6: Wishlist & Additional Features

**Task 6.1: Wishlist API & UI**
- [ ] POST /api/wishlist/add
- [ ] DELETE /api/wishlist/remove
- [ ] GET /api/wishlist
- [ ] Update wishlist page UI
- **Assignee:** Frontend + Backend Dev
- **Time:** 4-5 hours

**Task 6.2: Product Search & Filter**
- [ ] Improve product listing API with filters
- [ ] Add search query handler
- [ ] Filter by price range
- [ ] Filter by rating
- [ ] Update products page UI
- **Assignee:** Frontend + Backend Dev
- **Time:** 4-6 hours

**Task 6.3: Reviews & Ratings API**
- [ ] POST /api/reviews (create review)
- [ ] GET /api/reviews (get product reviews)
- [ ] PUT /api/reviews/[id] (update review)
- [ ] DELETE /api/reviews/[id]
- **Assignee:** Backend Dev
- **Time:** 4-5 hours

**Task 6.4: User Profile API**
- [ ] GET /api/profile
- [ ] PUT /api/profile (update user info)
- [ ] PUT /api/profile/password (change password)
- [ ] GET /api/profile/addresses
- [ ] POST /api/profile/addresses
- **Assignee:** Backend Dev
- **Time:** 4-5 hours

**Deliverables Week 5-6:**
- ✅ Shopping cart fully functional
- ✅ Order creation & history
- ✅ Wishlist system
- ✅ Product search & filter
- ✅ Reviews & ratings
- ✅ User profile management

---

### 🔴 PHASE 4: PAYMENT & DEPLOYMENT (Week 7-8)
**Goal:** Payment processing and deployment setup

#### Week 7: Payment Integration

**Task 7.1: Choose Payment Gateway**
Options:
- **Stripe** (International) - ~$0.029 + 2.9% per transaction
- **Momo** (Vietnam) - ~3.5% transaction fee
- **VNPay** (Vietnam) - ~0.55% - 2% transaction fee
- **PayPal** (International) - ~2.9% + $0.30 per transaction

Recommended for Vietnam: **Momo** or **VNPay**

**Task 7.2: Setup Payment Provider**
Example for Stripe:
```bash
npm install stripe next-stripe
```
- [ ] Create Stripe account
- [ ] Get API keys
- [ ] Store keys in .env
- **Assignee:** DevOps
- **Time:** 1-2 hours

**Task 7.3: Implement Payment API**
- [ ] POST /api/payments/create-session
- [ ] POST /api/payments/webhook (handle webhook)
- [ ] Store payment records in database
- [ ] Add payment status to order
- **Assignee:** Backend Dev
- **Time:** 6-8 hours

```typescript
// Example Stripe integration
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.json()
  
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: body.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    success_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout/cancel`,
  })
  
  return Response.json({ sessionId: session.id })
}
```

**Task 7.4: Update Checkout Page**
- [ ] Connect checkout form to payment API
- [ ] Show payment method options
- [ ] Handle payment response
- [ ] Show order confirmation
- **Assignee:** Frontend Dev
- **Time:** 4-6 hours

#### Week 8: Deployment Configuration

**Task 8.1: Environment Setup**
- [ ] Create .env.staging
- [ ] Create .env.production
- [ ] Setup environment variables for all services
- [ ] Add to GitHub secrets
- **Assignee:** DevOps
- **Time:** 2-3 hours

**Task 8.2: CI/CD Pipeline (GitHub Actions)**
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run lint
      - run: npm run build
      - run: npm run test
      - name: Deploy to Vercel
        # Add Vercel deployment step
```

- [ ] Setup GitHub Actions
- [ ] Add linting step
- [ ] Add build step
- [ ] Add automated testing
- **Assignee:** DevOps
- **Time:** 4-6 hours

**Task 8.3: Prepare Vercel Deployment**
- [ ] Create Vercel account
- [ ] Connect GitHub repo
- [ ] Setup environment variables
- [ ] Configure build settings
- **Assignee:** DevOps
- **Time:** 1-2 hours

**Task 8.4: Security Headers & Optimization**
```javascript
// next.config.mjs
export default {
  typescript: { ignoreBuildErrors: false },
  images: { 
    remotePatterns: [
      { protocol: 'https', hostname: '*.example.com' }
    ]
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
      ]
    }
  ]
}
```

- [ ] Add security headers
- [ ] Optimize images
- [ ] Setup compression
- [ ] Add CORS configuration
- **Assignee:** Backend Lead
- **Time:** 3-4 hours

**Deliverables Week 7-8:**
- ✅ Payment gateway integrated
- ✅ Checkout process complete
- ✅ CI/CD pipeline setup
- ✅ Environment configuration ready
- ✅ Ready for staging deployment

---

### 🟢 PHASE 5: MISSING PAGES (Week 9-10)
**Goal:** Complete all missing routes and admin features

#### Week 9: User-Side Pages

**Task 9.1: Complete Missing User Pages**
- [ ] /login/page.tsx ✅ (Done in Phase 2)
- [ ] /register/page.tsx ✅ (Done in Phase 2)
- [ ] /forgot-password/page.tsx ✅ (Done in Phase 2)
- [ ] /orders/[id]/page.tsx (Order detail)
- [ ] /orders/[id]/tracking/page.tsx (Tracking)
- [ ] /addresses/page.tsx (Address management)
- [ ] /settings/page.tsx (Account settings)
- [ ] /notifications/page.tsx (Notifications)
- **Assignee:** Frontend Dev
- **Time:** 8-10 hours

**Task 9.2: Admin List Pages**
Ensure all the following have page.tsx:
- [ ] /admin/settings/page.tsx
- [ ] /admin/returns/page.tsx
- [ ] /admin/shipping/page.tsx
- [ ] /admin/banners/page.tsx
- [ ] /admin/database/page.tsx
- [ ] /admin/integrations/page.tsx
- **Assignee:** Frontend Dev
- **Time:** 6-8 hours

#### Week 10: Admin CRUD Pages

**Task 10.1: Admin Create/Edit Pages**
- [ ] /admin/products/new/page.tsx
- [ ] /admin/products/[id]/page.tsx
- [ ] /admin/categories/new/page.tsx
- [ ] /admin/categories/[id]/page.tsx
- [ ] /admin/brands/new/page.tsx
- [ ] /admin/brands/[id]/page.tsx
- [ ] /admin/coupons/new/page.tsx
- [ ] /admin/coupons/[id]/page.tsx
- **Assignee:** Frontend Dev
- **Time:** 12-14 hours

**Task 10.2: Admin Detail Pages**
- [ ] /admin/orders/[id]/page.tsx
- [ ] /admin/customers/[id]/page.tsx
- [ ] /admin/inventory/[productId]/page.tsx (Stock detail)
- **Assignee:** Frontend Dev
- **Time:** 6-8 hours

**Task 10.3: Implement Admin APIs (CRUD)**
UPDATE backend with create/update/delete endpoints:
- [ ] POST /api/admin/products
- [ ] PUT /api/admin/products/[id]
- [ ] DELETE /api/admin/products/[id]
- [ ] Similar for categories, brands, coupons
- **Assignee:** Backend Dev
- **Time:** 10-12 hours

**Deliverables Week 9-10:**
- ✅ All missing user pages completed
- ✅ All admin list pages completed
- ✅ All admin CRUD pages working
- ✅ Admin APIs complete

---

### 🎯 PHASE 6: EMAIL & POLISH (Week 11-12)
**Goal:** Email system, final testing, deployment to production

#### Week 11: Email System & Final Features

**Task 11.1: Email Service Setup**
```bash
npm install resend
# or
npm install nodemailer
```

Options:
- **Resend** (Modern, easy) - $0.10/1000 emails
- **SendGrid** - Free tier: 100/day
- **AWS SES** - $0.10 per 1000 emails
- **Nodemailer** (self-hosted SMTP)

- [ ] Choose email service
- [ ] Setup email credentials
- [ ] Add environment variables
- **Assignee:** Backend Dev
- **Time:** 2-3 hours

**Task 11.2: Email Templates**
- [ ] Welcome email (registration)
- [ ] Order confirmation email
- [ ] Order shipped notification
- [ ] Password reset email
- [ ] Promotional emails
- **Assignee:** Backend Dev + Designer
- **Time:** 4-6 hours

**Task 11.3: Email API & Queue**
- [ ] POST /api/email/send
- [ ] Setup email queue (Bull or Agenda)
- [ ] Implement rate limiting
- [ ] Add email logging
- **Assignee:** Backend Dev
- **Time:** 4-6 hours

**Task 11.4: Trigger Emails**
- [ ] Send welcome email on registration
- [ ] Send order confirmation on purchase
- [ ] Send password reset email
- [ ] Send promotional emails
- **Assignee:** Backend Dev
- **Time:** 3-4 hours

#### Week 12: Testing, Optimization & Production Deployment

**Task 12.1: Testing**
- [ ] Unit tests for critical functions
- [ ] Integration tests for APIs
- [ ] E2E tests for critical flows
- ```bash
  npm run test
  npm run test:e2e
  ```
- **Assignee:** QA / Test Engineer
- **Time:** 8-10 hours

**Task 12.2: Performance Optimization**
- [ ] Database query optimization
- [ ] Add database indexes
- [ ] Implement caching (Redis)
- [ ] Optimize images
- [ ] Bundle size analysis
- **Assignee:** Backend + Frontend Lead
- **Time:** 6-8 hours

**Task 12.3: Security Audit**
- [ ] Check for SQL injection vulnerabilities
- [ ] Check for XSS vulnerabilities
- [ ] Verify HTTPS enforcement
- [ ] Check environment variable leaks
- [ ] Review CORS configuration
- **Assignee:** Security Lead
- **Time:** 4-6 hours

**Task 12.4: Production Deployment**
- [ ] Deploy to production Vercel
- [ ] Setup production database
- [ ] Setup production payment gateway
- [ ] Setup production email service
- [ ] Configure CDN
- [ ] Setup monitoring & alerting
- **Assignee:** DevOps
- **Time:** 4-6 hours

**Task 12.5: Documentation & Handover**
- [ ] API documentation
- [ ] Setup instructions
- [ ] Deployment guide
- [ ] Admin guide
- [ ] Troubleshooting guide
- **Assignee:** Tech Lead
- **Time:** 4-6 hours

**Deliverables Week 11-12:**
- ✅ Email system fully functional
- ✅ All tests passing
- ✅ Performance optimized
- ✅ Security audit passed
- ✅ **Live on Production! 🚀**

---

## 📊 RESOURCE ALLOCATION

### Recommended Team
- **Backend Lead** (1): Oversee backend architecture, database, APIs
- **Backend Developer** (1-2): API implementation
- **Frontend Lead** (1): Oversee frontend architecture, UI/UX
- **Frontend Developer** (1-2): Page implementation
- **Full Stack Developer** (1): Bridge between frontend & backend
- **DevOps/QA** (1): CI/CD, deployment, testing
- **Tech Lead/Architect** (1): Overall planning and coordination

Total: **7-9 people** for optimal speed

Or **3-4 people** for solo/small team (longer timeline)

---

## 💰 ESTIMATED COSTS (Monthly - Production Ready)

### Infrastructure
- **Hosting (Vercel):** $20-100/month
- **Database (Supabase PostgreSQL):** $25-100/month
- **CDN (Cloudflare):** Free - $200/month
- **Email Service (Resend):** $0-200/month (pay-as-you-go)
- **Payment Processing:** 2.9% + $0.30 per transaction (Stripe) or 2-3% (Momo)
- **Monitoring/Logs (Sentry):** Free - $100+/month

### Total Monthly: **$70-600+** (depending on traffic and transaction volume)

---

## 🎓 TECHNOLOGY STACK SUMMARY

```
Frontend:
├── Next.js 16.2.0
├── React 19.2.4
├── TypeScript 5.7.3
├── Tailwind CSS 4.2.0
├── Radix UI Components
├── React Hook Form + Zod (validation)
├── Framer Motion (animations)
└── Three.js (3D previews)

Backend (to be built):
├── Next.js API Routes
├── Prisma ORM
├── PostgreSQL
├── NextAuth.js (authentication)
├── Stripe/Momo (payments)
├── Resend (email)
└── Jest (testing)

Infrastructure:
├── Vercel (hosting)
├── GitHub Actions (CI/CD)
├── Supabase/Railway (database)
├── Cloudflare (CDN)
└── Sentry (monitoring)
```

---

**Document Version:** 1.0  
**Last Updated:** 04/04/2026  
**Status:** Ready for Implementation
