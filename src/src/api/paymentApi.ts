import { MomoPaymentRequest, MomoPaymentResponse } from "../types";
import axiosClient from "./axiosClient";

const paymentApi = {
    /**
     * Tạo thanh toán MoMo
     * POST /api/payment/momo/create
     */
    createMomoPayment: (request: MomoPaymentRequest) => {
        return axiosClient.post<MomoPaymentResponse>("/payment/momo/create", request);
    },

    /**
     * Confirm payment từ frontend (fallback khi IPN không hoạt động)
     * POST /api/payment/confirm
     * Gọi khi user quay về từ MoMo với resultCode
     */
    confirmPayment: (orderId: number, resultCode: number) => {
        return axiosClient.post<{ success: boolean; message: string }>("/payment/confirm", {
            orderId,
            resultCode
        });
    },

    /**
     * Lấy danh sách payment của order
     * GET /api/payment/orderId/{orderId}
     */
    getByOrderId: (orderId: number) => {
        return axiosClient.get(`/payment/orderId/${orderId}`);
    },

    /**
     * Retry payment
     * POST /api/payment/{paymentId}/retry
     */
    retryPayment: (paymentId: number) => {
        return axiosClient.post(`/payment/${paymentId}/retry`);
    },
};

export default paymentApi;