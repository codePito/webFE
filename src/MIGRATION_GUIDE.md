# 🔄 Migration Guide: Unified ShopHub Project

## ✅ What Has Been Done

### 1. **Unified Project Structure**
- Merged `user-ui` and `admin-ui` into single codebase
- Created shared components folder for reusable UI elements
- Organized pages into `user/` and `admin/` directories
- Unified authentication system with role-based access

### 2. **Shared Components Created**
Located in `src/components/shared/`:
- ✅ Button.tsx - Unified button with multiple variants
- ✅ Input.tsx - Form input with label and error handling
- ✅ Badge.tsx - Status badges for both user and admin
- ✅ Card.tsx - Card container component

### 3. **Unified Authentication**
- ✅ Updated `AuthContext.tsx` with role support (user/admin/seller)
- ✅ Added `isAdmin` flag for role checking
- ✅ Created `AdminRoute.tsx` guard for protecting admin pages
- ✅ Role-based redirects after login

### 4. **Routing Structure**
```
/ → User store (public)
/login → Unified login (redirects based on role)
/register → User registration
/admin → Admin dashboard (protected, admin only)
/admin/* → Admin pages (protected)
```

### 5. **Updated Files**
- ✅ `App.tsx` - Unified routing with role-based access
- ✅ `tailwind.config.js` - Supports both user and admin styles
- ✅ `LoginPage.tsx` - Role-based redirects
- ✅ `Header.tsx` - Shows admin link for admin users
- ✅ `Sidebar.tsx` - Uses unified auth, shows user info

## 🚀 How to Use

### Running the Unified Project

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

**The app will run on:** `http://localhost:5173`

### Demo Accounts

**User Account:**
- Email: `user@example.com`
- Password: any
- Access: Store only

**Admin Account:**
- Email: `admin@example.com`
- Password: any
- Access: Store + Admin Dashboard

### Navigation Flow

1. **As User:**
   - Login with `user@example.com`
   - Redirected to store homepage
   - Can browse, add to cart, checkout
   - No admin access

2. **As Admin:**
   - Login with `admin@example.com`
   - Can access store OR admin dashboard
   - Header shows "Admin" button to switch to dashboard
   - Admin sidebar shows "Back to Store" button

## 📁 New File Structure

```
src/
├── components/
│   ├── shared/              # ✨ NEW: Shared components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── Card.tsx
│   ├── user/                # User-facing components (existing)
│   └── admin/               # Admin components (from admin-ui)
├── pages/
│   ├── user/                # User pages (existing)
│   └── admin/               # Admin pages (from admin-ui)
├── contexts/
│   └── AuthContext.tsx      # ✨ UPDATED: Role-based auth
├── guards/
│   └── AdminRoute.tsx       # ✨ NEW: Admin route protection
└── App.tsx                  # ✨ UPDATED: Unified routing
```

## 🔧 Key Changes

### 1. Authentication Context
```tsx
// Now includes role and isAdmin flag
interface User {
  role: 'user' | 'admin' | 'seller';
}

const { isAdmin } = useAuth();
```

### 2. Protected Admin Routes
```tsx
<Route path="/admin/*" element={
  <AdminRoute>
    <AdminLayout>
      {/* Admin pages */}
    </AdminLayout>
  </AdminRoute>
} />
```

### 3. Role-Based Redirects
```tsx
// Login redirects based on role
if (isAdmin) navigate('/admin');
else navigate('/');
```

## ✨ Benefits

1. **Single Codebase** - Easier maintenance and deployment
2. **Shared Components** - DRY principle, consistent UI
3. **Unified Auth** - Single source of truth for user state
4. **Role-Based Access** - Secure admin area
5. **Better Organization** - Clear separation of concerns
6. **Single Build** - One deployment process

## 🎯 Next Steps

### Immediate
- [x] Merge projects
- [x] Create shared components
- [x] Implement role-based auth
- [x] Add route protection
- [x] Update navigation

### Future Enhancements
- [ ] Add more shared components (Modal, Toast, etc.)
- [ ] Implement Redux for global state
- [ ] Connect to real backend API
- [ ] Add more admin pages (Categories, Sellers, Coupons)
- [ ] Implement advanced permissions system
- [ ] Add user profile management

## 🐛 Troubleshooting

### Issue: Admin routes not accessible
**Solution:** Make sure you're logged in with an admin email (contains "admin")

### Issue: Components not found
**Solution:** Check import paths - shared components are in `src/components/shared/`

### Issue: Styling conflicts
**Solution:** Tailwind config includes both user and admin paths

## 📝 Notes

- User-facing store uses **orange** accent color
- Admin dashboard uses **blue** primary color
- Both share the same component library
- Authentication persists across page refreshes
- Admin users can access both store and dashboard

---

**🎉 Migration Complete! The unified project is ready to use.**
