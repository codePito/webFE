import axiosClient from "./axiosClient";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface UserResponse {
    id: number;
    userName: string;
    address: string;
    role: string;
    phoneNumber: string;
    avatarUrl?: string | null;
    createdAt: string;
}

export interface UpdateProfileRequest {
    userName: string;
    phoneNumber: string;
    address: string;
}

// ═══════════════════════════════════════════════════════════════
// API CALLS
// ═══════════════════════════════════════════════════════════════

const userApi = {
    /**
     * Lấy thông tin user theo email
     * GET /api/user/{email} (số ít)
     */
    getByEmail: (email: string) => {
        return axiosClient.get<UserResponse>(`/user/${encodeURIComponent(email)}`);
    },

    /**
     * Lấy tất cả users (ADMIN ONLY)
     * GET /api/users (số nhiều)
     */
    getAllUsers: () => {
        return axiosClient.get<UserResponse[]>("/users");
    },

    /**
     * Cập nhật profile user
     * PUT /api/user/{id}/profile
     */
    updateProfile: (userId: number, data: UpdateProfileRequest) => {
        return axiosClient.put(`/user/${userId}/profile`, data);
    }
};

export default userApi;
