# ShopHub Admin Dashboard

Modern, professional admin dashboard for e-commerce management.

## Features

- 📊 Dashboard with analytics and charts
- 📦 Product management (CRUD)
- 📋 Order management with status tracking
- 👥 User management
- 🏷️ Category management
- 🏪 Seller management
- 🎟️ Coupon management
- ⚙️ System settings

## Tech Stack

- React 18 + TypeScript
- Vite
- TailwindCSS
- React Router v6
- Redux Toolkit
- Recharts
- Lucide Icons
- Axios

## Getting Started

### Installation

```bash
cd admin-ui
npm install
```

### Development

```bash
npm run dev
```

The admin dashboard will be available at `http://localhost:3001`

### Build

```bash
npm run build
```

## Project Structure

```
admin-ui/
├── src/
│   ├── components/
│   │   ├── common/       # Reusable UI components
│   │   ├── charts/       # Chart components
│   │   └── layout/       # Layout components
│   ├── pages/
│   │   ├── dashboard/    # Dashboard page
│   │   ├── products/     # Product management
│   │   ├── orders/       # Order management
│   │   ├── users/        # User management
│   │   ├── categories/   # Category management
│   │   ├── sellers/      # Seller management
│   │   ├── coupons/      # Coupon management
│   │   └── settings/     # Settings pages
│   ├── store/            # Redux store
│   ├── services/         # API services
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utility functions
│   └── types/            # TypeScript types
├── public/
└── package.json
```

## Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- Auto Rename Tag
- Path Intellisense
- GitLens

## Code Quality

- Clean component architecture
- TypeScript for type safety
- Tailwind utility classes
- Responsive design
- Modern UI/UX patterns
