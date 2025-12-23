import axios from "axios";
import axiosClient from "./axiosClient";

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

export interface OrderResponse {
    id: number;
    userId: number;
    createdAt: string;
    totalAmount: number;
    currency: string;
    status: OrderStatus;
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

// Mapping status number → display text
export const OrderStatusText: Record<number, string> = {
    [OrderStatus.Pending]: 'Chờ xử lý',
    [OrderStatus.PaymentPending]: 'Chờ thanh toán',
    [OrderStatus.Paid]: 'Đã thanh toán',
    [OrderStatus.Cancelled]: 'Đã hủy',
    [OrderStatus.Failed]: 'Thất bại'
};

// Mapping status → Badge variant (theo base UI)
export const OrderStatusVariant: Record<number, 'primary' | 'success' | 'danger' | 'warning'> = {
    [OrderStatus.Pending]: 'warning',
    [OrderStatus.PaymentPending]: 'primary',
    [OrderStatus.Paid]: 'success',
    [OrderStatus.Cancelled]: 'danger',
    [OrderStatus.Failed]: 'danger'
};

export interface OrderRequest {
    userId: number;
    items: { productId: number; quantity: number }[];
    currency: string;
}

// ═══════════════════════════════════════════════════════════════
// API CALLS
// ═══════════════════════════════════════════════════════════════

const orderApi = {
    /**
     * Tạo đơn hàng mới
     * POST /api/Order
     * Auth: Required (userId lấy từ token claim)
     */
    create: (data: OrderRequest) => {
        return axiosClient.post<OrderResponse>("/Order", data);
    },

    /**
     * Lấy chi tiết đơn hàng theo ID
     * GET /api/Order/{id}
     * Auth: None (nhưng nên có để bảo mật)
     */
    getById: (id: number | string) => {
        return axiosClient.get<OrderResponse>(`/Order/${id}`);
    },

    /**
     * Lấy danh sách đơn hàng của user
     * GET /user/{userId}
     * Auth: Required
     * ⚠️ Backend dùng absolute path /user/{userId} (không có /api prefix)
     */
    getByUserId: (userId: number | string) => {
        // Backend endpoint là absolute: /user/{userId} (không có /api)
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
        const token = localStorage.getItem('access_token');
        return axios.get<OrderResponse[]>(`${baseUrl}/user/${userId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
    },

    // ═══════════════════════════════════════════════════════════════
    // ADMIN ONLY
    // ═══════════════════════════════════════════════════════════════

    /**
     * Xóa đơn hàng (ADMIN)
     * DELETE /api/Order/{id}
     */
    deleteOrder: (id: number) => {
        return axiosClient.delete(`/Order/${id}`);
    },

    /**
     * Cập nhật trạng thái đơn hàng (ADMIN)
     * PATCH /api/Order/{id}/status
     */
    updateStatus: (id: number, status: OrderStatus) => {
        return axiosClient.patch(`/Order/${id}/status`, status, {
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export default orderApi;
