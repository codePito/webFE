import { MomoPaymentRequest, MomoPaymentResponse } from "../types";
import axiosClient from "./axiosClient";

const paymentApi = {
    /**
     * Tạo thanh toán MoMo
     * POST /api/Payment/momo/create
     */
    createMomoPayment: (request: MomoPaymentRequest) => {
        return axiosClient.post<MomoPaymentResponse>("/Payment/momo/create", request);
    },

    /**
     * Confirm payment từ frontend (fallback khi IPN không hoạt động)
     * POST /api/Payment/confirm
     * Gọi khi user quay về từ MoMo với resultCode
     */
    confirmPayment: (orderId: number, resultCode: number) => {
        return axiosClient.post<{ success: boolean; message: string }>("/Payment/confirm", {
            orderId,
            resultCode
        });
    },

    /**
     * Lấy danh sách payment của order
     * GET /api/Payment/orderId/{orderId}
     */
    getByOrderId: (orderId: number) => {
        return axiosClient.get(`/Payment/orderId/${orderId}`);
    },

    /**
     * Retry payment
     * POST /api/Payment/{paymentId}/retry
     */
    retryPayment: (paymentId: number) => {
        return axiosClient.post(`/Payment/${paymentId}/retry`);
    },
};

export default paymentApi;