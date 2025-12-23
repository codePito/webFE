import axiosClient from "./axiosClient";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface UserResponse {
    id: number;
    userName: string;
    address: string;
    role: string;
    avatarUrl?: string | null;
}

// ═══════════════════════════════════════════════════════════════
// API CALLS
// ═══════════════════════════════════════════════════════════════

const userApi = {
    /**
     * Lấy thông tin user theo email
     * GET /api/User/{email}
     * Auth: None (public)
     * Dùng cho: USER - xem profile
     */
    getByEmail: (email: string) => {
        return axiosClient.get<UserResponse>(`/User/${encodeURIComponent(email)}`);
    },

    /**
     * Lấy tất cả users (ADMIN ONLY)
     * GET /api/User
     * Auth: Required
     */
    getAllUsers: () => {
        return axiosClient.get<UserResponse[]>("/User");
    }
};

export default userApi;
