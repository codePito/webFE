import { Product, Category } from '../types';
export const categories: Category[] = [{
  id: 'electronics',
  name: 'Electronics',
  icon: '📱'
}, {
  id: 'fashion',
  name: 'Fashion',
  icon: '👕'
}, {
  id: 'home',
  name: 'Home & Living',
  icon: '🏠'
}, {
  id: 'beauty',
  name: 'Beauty',
  icon: '💄'
}, {
  id: 'sports',
  name: 'Sports',
  icon: '⚽'
}, {
  id: 'books',
  name: 'Books',
  icon: '📚'
}];
export const mockProducts: Product[] = [{
  id: '1',
  name: 'Wireless Bluetooth Headphones',
  description: 'Premium noise-cancelling headphones with 30-hour battery life. Crystal clear sound quality with deep bass.',
  price: 79.99,
  originalPrice: 129.99,
  discount: 38,
  images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'],
  category: 'electronics',
  rating: 4.5,
  reviewCount: 1234,
  soldCount: 5420,
  stock: 150,
  specifications: {
    'Battery Life': '30 hours',
    Connectivity: 'Bluetooth 5.0',
    Weight: '250g'
  }
}, {
  id: '2',
  name: 'Smart Watch Series 5',
  description: 'Track your fitness goals with this advanced smartwatch. Heart rate monitor, GPS, and water resistant.',
  price: 199.99,
  originalPrice: 299.99,
  discount: 33,
  images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80'],
  category: 'electronics',
  rating: 4.8,
  reviewCount: 892,
  soldCount: 3210,
  stock: 80
}, {
  id: '3',
  name: 'Classic Denim Jacket',
  description: 'Timeless denim jacket perfect for any season. Premium quality fabric with comfortable fit.',
  price: 49.99,
  images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80'],
  category: 'fashion',
  rating: 4.3,
  reviewCount: 456,
  soldCount: 1890,
  stock: 200
}, {
  id: '4',
  name: 'Minimalist Backpack',
  description: 'Sleek and functional backpack with laptop compartment. Water-resistant material and ergonomic design.',
  price: 39.99,
  originalPrice: 59.99,
  discount: 33,
  images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'],
  category: 'fashion',
  rating: 4.6,
  reviewCount: 678,
  soldCount: 2340,
  stock: 120
}, {
  id: '5',
  name: 'Ceramic Coffee Mug Set',
  description: 'Set of 4 elegant ceramic mugs. Microwave and dishwasher safe. Perfect for your morning coffee.',
  price: 24.99,
  images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80'],
  category: 'home',
  rating: 4.7,
  reviewCount: 234,
  soldCount: 890,
  stock: 300
}, {
  id: '6',
  name: 'Scented Candle Collection',
  description: 'Set of 3 premium scented candles. Lavender, vanilla, and ocean breeze. 40-hour burn time each.',
  price: 29.99,
  images: ['https://images.unsplash.com/photo-1602874801006-96e3e7c3c79b?w=800&q=80'],
  category: 'home',
  rating: 4.4,
  reviewCount: 567,
  soldCount: 1450,
  stock: 180
}, {
  id: '7',
  name: 'Hydrating Face Serum',
  description: 'Vitamin C serum for glowing skin. Reduces dark spots and improves skin texture. Dermatologist tested.',
  price: 34.99,
  originalPrice: 49.99,
  discount: 30,
  images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80'],
  category: 'beauty',
  rating: 4.9,
  reviewCount: 1890,
  soldCount: 6780,
  stock: 90
}, {
  id: '8',
  name: 'Yoga Mat Premium',
  description: 'Extra thick yoga mat with carrying strap. Non-slip surface and eco-friendly material.',
  price: 44.99,
  images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80'],
  category: 'sports',
  rating: 4.5,
  reviewCount: 345,
  soldCount: 1120,
  stock: 150
}, {
  id: '9',
  name: 'Resistance Bands Set',
  description: 'Set of 5 resistance bands with different strength levels. Perfect for home workouts.',
  price: 19.99,
  originalPrice: 34.99,
  discount: 43,
  images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&q=80'],
  category: 'sports',
  rating: 4.6,
  reviewCount: 789,
  soldCount: 3450,
  stock: 250
}, {
  id: '10',
  name: 'The Art of Design',
  description: 'Comprehensive guide to modern design principles. Hardcover edition with full-color illustrations.',
  price: 29.99,
  images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80'],
  category: 'books',
  rating: 4.8,
  reviewCount: 234,
  soldCount: 890,
  stock: 100
}, {
  id: '11',
  name: 'Wireless Gaming Mouse',
  description: 'High-precision gaming mouse with RGB lighting. 16000 DPI and programmable buttons.',
  price: 59.99,
  originalPrice: 89.99,
  discount: 33,
  images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80'],
  category: 'electronics',
  rating: 4.7,
  reviewCount: 1567,
  soldCount: 4230,
  stock: 120
}, {
  id: '12',
  name: 'Cotton T-Shirt Pack',
  description: 'Pack of 3 premium cotton t-shirts. Comfortable fit and breathable fabric. Available in multiple colors.',
  price: 34.99,
  images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
  category: 'fashion',
  rating: 4.4,
  reviewCount: 890,
  soldCount: 2340,
  stock: 300
}];