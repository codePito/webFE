export const API_BASE_URL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';
export const SHIPPING_FEE = 5.99;
export const FREE_SHIPPING_THRESHOLD = 50;
export const PAYMENT_METHODS = [{
  id: 'cod',
  name: 'Cash on Delivery',
  icon: '💵'
}, {
  id: 'card',
  name: 'Credit/Debit Card',
  icon: '💳'
}, {
  id: 'ewallet',
  name: 'E-Wallet',
  icon: '📱'
}] as const;