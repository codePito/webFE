import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProductsPage } from './pages/products/ProductsPage';
import { OrdersPage } from './pages/orders/OrdersPage';
import { UsersPage } from './pages/users/UsersPage';
import { CategoriesPage } from './pages/categories/CategoriesPage';
export function App() {
  return <BrowserRouter>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/sellers" element={<div className="text-2xl font-bold">
                Sellers Page (Coming Soon)
              </div>} />
          <Route path="/coupons" element={<div className="text-2xl font-bold">
                Coupons Page (Coming Soon)
              </div>} />
          <Route path="/settings" element={<div className="text-2xl font-bold">
                Settings Page (Coming Soon)
              </div>} />
        </Routes>
      </AdminLayout>
    </BrowserRouter>;
}