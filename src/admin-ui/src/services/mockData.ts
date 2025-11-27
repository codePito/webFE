import { Product, Order, User, Category, Seller, Coupon, DashboardStats, RevenueData, OrderStatusData } from '../types';

// Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalRevenue: 125430,
  revenueGrowth: 12.5,
  totalOrders: 1543,
  ordersGrowth: 8.3,
  totalUsers: 8234,
  usersGrowth: 15.2,
  totalProducts: 456,
  productsGrowth: 5.7
};
export const mockRevenueData: RevenueData[] = [{
  month: 'Jan',
  revenue: 45000,
  orders: 234
}, {
  month: 'Feb',
  revenue: 52000,
  orders: 267
}, {
  month: 'Mar',
  revenue: 48000,
  orders: 245
}, {
  month: 'Apr',
  revenue: 61000,
  orders: 312
}, {
  month: 'May',
  revenue: 55000,
  orders: 289
}, {
  month: 'Jun',
  revenue: 67000,
  orders: 345
}];
export const mockOrderStatusData: OrderStatusData[] = [{
  status: 'Pending',
  count: 145,
  color: '#fbbf24'
}, {
  status: 'Processing',
  count: 234,
  color: '#3b82f6'
}, {
  status: 'Shipping',
  count: 189,
  color: '#6366f1'
}, {
  status: 'Delivered',
  count: 876,
  color: '#10b981'
}, {
  status: 'Cancelled',
  count: 99,
  color: '#ef4444'
}];

// Products
export const mockProducts: Product[] = Array.from({
  length: 50
}, (_, i) => ({
  id: `prod-${i + 1}`,
  name: `Product ${i + 1}`,
  description: `Description for product ${i + 1}`,
  price: Math.floor(Math.random() * 500) + 20,
  originalPrice: Math.floor(Math.random() * 700) + 50,
  discount: Math.floor(Math.random() * 50),
  images: [`https://images.unsplash.com/photo-${1500000000000 + i}?w=400`],
  category: ['electronics', 'fashion', 'home', 'beauty'][Math.floor(Math.random() * 4)],
  categoryName: ['Electronics', 'Fashion', 'Home', 'Beauty'][Math.floor(Math.random() * 4)],
  rating: 3 + Math.random() * 2,
  reviewCount: Math.floor(Math.random() * 500),
  soldCount: Math.floor(Math.random() * 5000),
  stock: Math.floor(Math.random() * 200),
  sku: `SKU-${1000 + i}`,
  status: ['active', 'inactive', 'out_of_stock'][Math.floor(Math.random() * 3)] as any,
  createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1),
  updatedAt: new Date()
}));

// Orders
export const mockOrders: Order[] = Array.from({
  length: 100
}, (_, i) => ({
  id: `order-${i + 1}`,
  orderNumber: `ORD-${10000 + i}`,
  userId: `user-${Math.floor(Math.random() * 100)}`,
  userName: `Customer ${i + 1}`,
  userEmail: `customer${i + 1}@example.com`,
  items: [{
    productId: `prod-${Math.floor(Math.random() * 50) + 1}`,
    productName: `Product ${Math.floor(Math.random() * 50) + 1}`,
    productImage: `https://images.unsplash.com/photo-${1500000000000 + i}?w=100`,
    quantity: Math.floor(Math.random() * 3) + 1,
    price: Math.floor(Math.random() * 200) + 20
  }],
  subtotal: Math.floor(Math.random() * 500) + 50,
  shippingFee: 5.99,
  total: Math.floor(Math.random() * 500) + 55.99,
  status: ['pending', 'processing', 'shipping', 'delivered', 'cancelled'][Math.floor(Math.random() * 5)] as any,
  paymentMethod: ['cod', 'card', 'ewallet'][Math.floor(Math.random() * 3)] as any,
  paymentStatus: ['pending', 'paid', 'refunded'][Math.floor(Math.random() * 3)] as any,
  shippingAddress: {
    fullName: `Customer ${i + 1}`,
    phone: '+1 234 567 8900',
    address: '123 Main St',
    city: 'New York',
    postalCode: '10001'
  },
  createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1),
  updatedAt: new Date()
}));

// Users
export const mockUsers: User[] = Array.from({
  length: 50
}, (_, i) => ({
  id: `user-${i + 1}`,
  email: `user${i + 1}@example.com`,
  fullName: `User ${i + 1}`,
  phone: '+1 234 567 8900',
  avatar: undefined,
  role: ['admin', 'user', 'seller'][Math.floor(Math.random() * 3)] as any,
  status: Math.random() > 0.1 ? 'active' : 'locked',
  createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1),
  lastLogin: new Date()
}));

// Categories
export const mockCategories: Category[] = [{
  id: 'cat-1',
  name: 'Electronics',
  slug: 'electronics',
  icon: '📱',
  productCount: 145,
  status: 'active',
  createdAt: new Date()
}, {
  id: 'cat-2',
  name: 'Fashion',
  slug: 'fashion',
  icon: '👕',
  productCount: 234,
  status: 'active',
  createdAt: new Date()
}, {
  id: 'cat-3',
  name: 'Home & Living',
  slug: 'home',
  icon: '🏠',
  productCount: 189,
  status: 'active',
  createdAt: new Date()
}, {
  id: 'cat-4',
  name: 'Beauty',
  slug: 'beauty',
  icon: '💄',
  productCount: 167,
  status: 'active',
  createdAt: new Date()
}, {
  id: 'cat-5',
  name: 'Sports',
  slug: 'sports',
  icon: '⚽',
  productCount: 98,
  status: 'active',
  createdAt: new Date()
}, {
  id: 'cat-6',
  name: 'Books',
  slug: 'books',
  icon: '📚',
  productCount: 76,
  status: 'inactive',
  createdAt: new Date()
}];

// Sellers
export const mockSellers: Seller[] = Array.from({
  length: 30
}, (_, i) => ({
  id: `seller-${i + 1}`,
  businessName: `Store ${i + 1}`,
  ownerName: `Owner ${i + 1}`,
  email: `seller${i + 1}@example.com`,
  phone: '+1 234 567 8900',
  address: '123 Business St, City',
  status: ['pending', 'approved', 'rejected', 'suspended'][Math.floor(Math.random() * 4)] as any,
  totalProducts: Math.floor(Math.random() * 100),
  totalRevenue: Math.floor(Math.random() * 50000),
  rating: 3 + Math.random() * 2,
  createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1)
}));

// Coupons
export const mockCoupons: Coupon[] = Array.from({
  length: 20
}, (_, i) => ({
  id: `coupon-${i + 1}`,
  code: `SAVE${10 + i * 5}`,
  description: `Get ${10 + i * 5}% off on your purchase`,
  discountType: Math.random() > 0.5 ? 'percentage' : 'fixed',
  discountValue: 10 + i * 5,
  minPurchase: 50,
  maxDiscount: 100,
  usageLimit: 1000,
  usedCount: Math.floor(Math.random() * 500),
  startDate: new Date(2024, 0, 1),
  endDate: new Date(2024, 11, 31),
  status: ['active', 'inactive', 'expired'][Math.floor(Math.random() * 3)] as any,
  createdAt: new Date(2024, 0, Math.floor(Math.random() * 30) + 1)
}));