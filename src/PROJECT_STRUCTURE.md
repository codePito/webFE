# Unified ShopHub Project Structure

## 📁 New Unified Structure

```
shophub/
├── src/
│   ├── components/
│   │   ├── shared/              # Shared components for both user & admin
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Loader.tsx
│   │   ├── user/                # User-facing components
│   │   │   ├── auth/
│   │   │   ├── cart/
│   │   │   ├── product/
│   │   │   └── layout/
│   │   └── admin/               # Admin dashboard components
│   │       ├── charts/
│   │       ├── tables/
│   │       └── layout/
│   ├── pages/
│   │   ├── user/                # User-facing pages
│   │   │   ├── HomePage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   └── ...
│   │   └── admin/               # Admin pages
│   │       ├── DashboardPage.tsx
│   │       ├── ProductsPage.tsx
│   │       ├── OrdersPage.tsx
│   │       └── ...
│   ├── layouts/
│   │   ├── UserLayout.tsx       # User-facing layout
│   │   └── AdminLayout.tsx      # Admin dashboard layout
│   ├── contexts/                # Shared contexts
│   │   ├── AuthContext.tsx      # Unified auth (user + admin)
│   │   ├── CartContext.tsx
│   │   └── ProductContext.tsx
│   ├── services/                # API services
│   │   ├── api/
│   │   └── mockData.ts
│   ├── types/                   # TypeScript types
│   │   └── index.ts
│   ├── utils/                   # Utilities
│   │   ├── formatters.ts
│   │   └── constants.ts
│   ├── guards/                  # Route protection
│   │   └── AdminRoute.tsx
│   ├── App.tsx                  # Unified routing
│   └── main.tsx
├── public/
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## 🔄 Key Changes

### 1. Unified Routing
- `/` - User-facing store (home, products, cart, checkout)
- `/admin` - Admin dashboard (requires admin role)
- `/login` - Unified login (redirects based on role)

### 2. Role-Based Access
- Users with `role: 'user'` → Access store only
- Users with `role: 'admin'` → Access admin dashboard
- Route guards protect admin pages

### 3. Shared Components
- Button, Input, Badge, Card, Loader → Used by both UIs
- Separate styling variants for user vs admin contexts

### 4. Separate Layouts
- UserLayout: Header, Footer, Cart Modal
- AdminLayout: Sidebar, Navbar

### 5. Unified Authentication
- Single AuthContext handles both user and admin login
- Role-based redirects after login
- Persistent sessions for both

## 🚀 Benefits

✅ Single codebase - easier maintenance
✅ Shared components - DRY principle
✅ Unified authentication - single source of truth
✅ Better code organization
✅ Single build process
✅ Shared utilities and types
