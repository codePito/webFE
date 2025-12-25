import axios from 'axios';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface OrderItemResponse {
    id: number;
    productId: number;
    productName: string;
    unitPrice: number;
    quantity: number;
    total: number;
}

export interface AdminOrderResponse {
    id: number;
    userId: number;
    userName?: string;
    userEmail?: string;
    createdAt: string;
    totalAmount: number;
    currency: string;
    shippingAddress?: string;
    status: number; // Backend trả về enum number
    items: OrderItemResponse[];
}

// Backend enum OrderStatus
export enum OrderStatus {
    Pending = 0,
    PaymentPending = 1,
    Paid = 2,
    Cancelled = 3,
    Failed = 4
}

// Mapping status → display text (Tiếng Việt)
export const OrderStatusText: Record<number, string> = {
    [OrderStatus.Pending]: 'Chờ xử lý',
    [OrderStatus.PaymentPending]: 'Chờ thanh toán',
    [OrderStatus.Paid]: 'Đã thanh toán',
    [OrderStatus.Cancelled]: 'Đã hủy',
    [OrderStatus.Failed]: 'Thất bại'
};

// Mapping status → Badge color (theo admin Badge component)
export const OrderStatusColor: Record<number, 'yellow' | 'blue' | 'green' | 'red' | 'gray'> = {
    [OrderStatus.Pending]: 'yellow',
    [OrderStatus.PaymentPending]: 'blue',
    [OrderStatus.Paid]: 'green',
    [OrderStatus.Cancelled]: 'gray',
    [OrderStatus.Failed]: 'red'
};

// ═══════════════════════════════════════════════════════════════
// API CONFIG
// ═══════════════════════════════════════════════════════════════

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7122/api';

// Tạo axios instance với auth header
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor: Tự động attach Authorization header
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ═══════════════════════════════════════════════════════════════
// API CALLS
// ═══════════════════════════════════════════════════════════════

const orderAdminApi = {
    /**
     * Lấy tất cả orders (ADMIN ONLY)
     * GET /api/orders (số nhiều)
     */
    getAll: () => {
        return apiClient.get<AdminOrderResponse[]>('/orders');
    },

    /**
     * Lấy chi tiết order theo ID
     * GET /api/order/{id} (số ít)
     */
    getById: (id: number) => {
        return apiClient.get<AdminOrderResponse>(`/order/${id}`);
    },

    /**
     * Cập nhật trạng thái order (ADMIN)
     * PATCH /api/order/{id}/status (số ít)
     */
    updateStatus: (id: number, status: OrderStatus) => {
        return apiClient.patch<boolean>(`/order/${id}/status`, status);
    },

    /**
     * Xóa order (ADMIN)
     * DELETE /api/order/{id} (số ít)
     */
    deleteOrder: (id: number) => {
        return apiClient.delete<boolean>(`/order/${id}`);
    }
};

export default orderAdminApi;
