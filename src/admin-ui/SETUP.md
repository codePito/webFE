# ShopHub Admin Dashboard - Setup Guide

## 📁 Project Structure

```
admin-ui/
├── src/
│   ├── components/
│   │   ├── common/           # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── Table.tsx
│   │   │   └── Pagination.tsx
│   │   ├── charts/           # Chart components
│   │   │   ├── RevenueChart.tsx
│   │   │   └── OrderStatusChart.tsx
│   │   └── layout/           # Layout components
│   │       ├── Sidebar.tsx
│   │       ├── Navbar.tsx
│   │       └── AdminLayout.tsx
│   ├── pages/
│   │   ├── dashboard/        # Dashboard page
│   │   │   └── DashboardPage.tsx
│   │   ├── products/         # Product management
│   │   │   └── ProductsPage.tsx
│   │   ├── orders/           # Order management
│   │   │   └── OrdersPage.tsx
│   │   └── users/            # User management
│   │       └── UsersPage.tsx
│   ├── services/             # API services & mock data
│   │   └── mockData.ts
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   ├── utils/                # Utility functions
│   │   ├── formatters.ts
│   │   └── constants.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd admin-ui
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The admin dashboard will be available at: **http://localhost:3001**

### 3. Build for Production

```bash
npm run build
```

## 📊 Features Implemented

### ✅ Dashboard
- Revenue, orders, users, and products statistics
- Growth indicators with percentage changes
- Revenue overview chart (line chart)
- Orders by status chart (pie chart)
- Recent orders list
- Top selling products

### ✅ Product Management
- Product list with pagination
- Search functionality
- Product details (image, SKU, category, price, stock)
- Status badges (Active, Inactive, Out of Stock)
- Ready for CRUD operations

### ✅ Order Management
- Order list with pagination
- Order details (number, customer, items, total)
- Status tracking (Pending, Processing, Shipping, Delivered, Cancelled)
- Payment status indicators

### ✅ User Management
- User list with pagination
- User details (name, email, phone, role)
- Role badges (Admin, User, Seller)
- Status indicators (Active, Locked)

### 🔜 Coming Soon
- Categories Management
- Sellers Management
- Coupons Management
- Settings Pages
- Modal forms for CRUD operations
- Advanced filtering
- Export functionality

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6) - Main brand color
- **Sidebar**: Dark slate (#1e293b)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#fbbf24)
- **Danger**: Red (#ef4444)

### Components
- **Cards**: White background with subtle shadows
- **Tables**: Clean, hover-able rows
- **Badges**: Color-coded status indicators
- **Buttons**: Primary, secondary, danger, ghost variants
- **Charts**: Recharts with professional styling

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router v6** - Routing
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Redux Toolkit** - State management (ready to implement)
- **Axios** - HTTP client (ready to implement)

## 📱 Responsive Design

The admin dashboard is fully responsive:
- **Desktop**: Full sidebar + content
- **Tablet**: Collapsible sidebar
- **Mobile**: Mobile-optimized navigation

## 🔧 Recommended VS Code Extensions

1. **ESLint** - Code linting
2. **Prettier** - Code formatting
3. **Tailwind CSS IntelliSense** - Tailwind autocomplete
4. **TypeScript Vue Plugin (Volar)** - TypeScript support
5. **Auto Rename Tag** - HTML tag renaming
6. **Path Intellisense** - Path autocomplete
7. **GitLens** - Git integration

## 📝 Code Quality Guidelines

### Component Structure
```tsx
// 1. Imports
import React from 'react';
import { Component } from 'library';

// 2. Types/Interfaces
interface Props {
  title: string;
}

// 3. Component
export function MyComponent({ title }: Props) {
  // 4. State & hooks
  const [state, setState] = useState();
  
  // 5. Handlers
  const handleClick = () => {};
  
  // 6. Render
  return <div>{title}</div>;
}
```

### Tailwind Best Practices
- Use utility classes directly
- Group related utilities (spacing, colors, typography)
- Use responsive prefixes (sm:, md:, lg:)
- Extract repeated patterns into components

### TypeScript Best Practices
- Define interfaces for all props
- Use type inference where possible
- Avoid `any` type
- Use enums for constants

## 🔄 Next Steps

1. **Implement CRUD Modals**
   - Create/Edit product modal
   - Order details modal
   - User profile modal

2. **Add Redux Store**
   - Products slice
   - Orders slice
   - Users slice
   - Auth slice

3. **Connect to Backend API**
   - Replace mock data with real API calls
   - Implement authentication
   - Add error handling

4. **Advanced Features**
   - Advanced filtering and sorting
   - Bulk operations
   - Export to CSV/Excel
   - Real-time notifications

## 📞 Support

For questions or issues, please refer to the documentation or contact the development team.

---

**Built with ❤️ for ShopHub E-commerce Platform**
