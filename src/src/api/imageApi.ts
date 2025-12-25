import axiosClient from "./axiosClient";

// ✅ Interface đầy đủ theo backend ImageResponse
export interface ImageModel {
    id: number;
    url: string;
    originalFileName: string;
    storageKey: string;
    entityType: string;
    entityId: number;
    isPrimary: boolean;
    displayOrder: number;
    fileSize: number;
    fileSizeFormatted: string;
    mimeType?: string;
    width?: number;
    height?: number;
    dimensions?: string;
    uploadedAt: string;
    storageProvider: string;
}

// ✅ Response wrapper cho upload multiple
export interface UploadMultipleResponse {
    uploadedCount: number;
    images: ImageModel[];
}

// ✅ Helper: Lấy URL ảnh đầy đủ (xử lý cả relative và absolute URL)
export const getImageUrl = (url: string | undefined | null): string => {
    if (!url) return '/placeholder-image.png';
    
    // Nếu đã là full URL (http/https) → dùng luôn
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    
    // Nếu là relative path → ghép với API base URL hoặc static server
    // Tùy thuộc vào cách backend serve static files
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

// ✅ Helper: Lấy ảnh primary từ danh sách
export const getPrimaryImage = (images: ImageModel[]): ImageModel | undefined => {
    return images.find(img => img.isPrimary) || images[0];
};

const imageApi = {
    // ═══════════════════════════════════════════════════════════════
    // 📖 API DÙNG CHO CẢ USER & ADMIN (Chỉ cần đăng nhập)
    // ═══════════════════════════════════════════════════════════════

    /**
     * Lấy danh sách ảnh của Product
     * GET /api/image/Product/{productId}
     */
    getProductImages: (productId: number) =>
        axiosClient.get<ImageModel[]>(`/image/Product/${productId}`),

    /**
     * Lấy danh sách ảnh theo entity type (Product, User, Category)
     * GET /api/image/{entityType}/{entityId}
     */
    getEntityImages: (entityType: string, entityId: number) =>
        axiosClient.get<ImageModel[]>(`/image/${entityType}/${entityId}`),

    /**
     * Lấy ảnh Primary của entity
     * GET /api/image/{entityType}/{entityId}/primary
     */
    getPrimaryImage: (entityType: string, entityId: number) =>
        axiosClient.get<ImageModel>(`/image/${entityType}/${entityId}/primary`),

    /**
     * Upload 1 ảnh cho Product
     * POST /api/image/product/{productId}?isPrimary=true/false
     */
    uploadProductImage: (productId: number, file: File, isPrimary: boolean = false) => {
        const formData = new FormData();
        formData.append("file", file);
        return axiosClient.post<ImageModel>(
            `/image/product/${productId}?isPrimary=${isPrimary}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
    },

    /**
     * Upload nhiều ảnh cho Product
     * POST /api/image/product/{productId}/multiple
     */
    uploadMultipleProductImages: (productId: number, files: FileList | File[]) => {
        const formData = new FormData();
        const fileArray = Array.isArray(files) ? files : Array.from(files);
        fileArray.forEach(file => formData.append("files", file));
        return axiosClient.post<UploadMultipleResponse>(
            `/image/product/${productId}/multiple`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
    },

    /**
     * Upload avatar cho User đang đăng nhập
     * POST /api/image/user/avatar
     */
    uploadAvatar: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return axiosClient.post<ImageModel>(
            `/image/user/avatar`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
    },

    /**
     * Đặt ảnh làm Primary
     * PUT /api/image/{imageId}/set-primary?entityType=xxx&entityId=xxx
     */
    setPrimaryImage: (imageId: number, entityType: string, entityId: number) =>
        axiosClient.put<{ message: string }>(
            `/image/${imageId}/set-primary?entityType=${entityType}&entityId=${entityId}`
        ),

    /**
     * Soft delete ảnh (đánh dấu IsDeleted = true)
     * DELETE /api/image/{imageId}
     */
    deleteImage: (imageId: number) =>
        axiosClient.delete<{ message: string }>(`/image/${imageId}`),

    // ═══════════════════════════════════════════════════════════════
    // 🔒 API CHỈ DÀNH CHO ADMIN (Yêu cầu Role: Admin)
    // ═══════════════════════════════════════════════════════════════

    /**
     * Upload ảnh cho Category (ADMIN ONLY)
     * POST /api/image/category/{categoryId}
     */
    uploadCategoryImage: (categoryId: number, file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return axiosClient.post<ImageModel>(
            `/image/category/${categoryId}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
    },

    /**
     * Xóa vĩnh viễn ảnh khỏi DB và Storage (ADMIN ONLY)
     * DELETE /api/image/{imageId}/permanent
     */
    permanentDeleteImage: (imageId: number) =>
        axiosClient.delete<{ message: string }>(`/image/${imageId}/permanent`),
};

export default imageApi;
