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
     * GET /api/Image/Product/{productId}
     */
    getProductImages: (productId: number) =>
        axiosClient.get<ImageModel[]>(`/Image/Product/${productId}`),

    /**
     * Lấy danh sách ảnh theo entity type (Product, User, Category)
     * GET /api/Image/{entityType}/{entityId}
     */
    getEntityImages: (entityType: string, entityId: number) =>
        axiosClient.get<ImageModel[]>(`/Image/${entityType}/${entityId}`),

    /**
     * Lấy ảnh Primary của entity
     * GET /api/Image/{entityType}/{entityId}/primary
     */
    getPrimaryImage: (entityType: string, entityId: number) =>
        axiosClient.get<ImageModel>(`/Image/${entityType}/${entityId}/primary`),

    /**
     * Upload 1 ảnh cho Product
     * POST /api/Image/product/{productId}?isPrimary=true/false
     */
    uploadProductImage: (productId: number, file: File, isPrimary: boolean = false) => {
        const formData = new FormData();
        formData.append("file", file);
        return axiosClient.post<ImageModel>(
            `/Image/product/${productId}?isPrimary=${isPrimary}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
    },

    /**
     * Upload nhiều ảnh cho Product
     * POST /api/Image/product/{productId}/multiple
     */
    uploadMultipleProductImages: (productId: number, files: FileList | File[]) => {
        const formData = new FormData();
        const fileArray = Array.isArray(files) ? files : Array.from(files);
        fileArray.forEach(file => formData.append("files", file));
        return axiosClient.post<UploadMultipleResponse>(
            `/Image/product/${productId}/multiple`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
    },

    /**
     * Upload avatar cho User đang đăng nhập
     * POST /api/Image/user/avatar
     */
    uploadAvatar: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return axiosClient.post<ImageModel>(
            `/Image/user/avatar`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
    },

    /**
     * Đặt ảnh làm Primary
     * PUT /api/Image/{imageId}/set-primary?entityType=xxx&entityId=xxx
     */
    setPrimaryImage: (imageId: number, entityType: string, entityId: number) =>
        axiosClient.put<{ message: string }>(
            `/Image/${imageId}/set-primary?entityType=${entityType}&entityId=${entityId}`
        ),

    /**
     * Soft delete ảnh (đánh dấu IsDeleted = true)
     * DELETE /api/Image/{imageId}
     */
    deleteImage: (imageId: number) =>
        axiosClient.delete<{ message: string }>(`/Image/${imageId}`),

    // ═══════════════════════════════════════════════════════════════
    // 🔒 API CHỈ DÀNH CHO ADMIN (Yêu cầu Role: Admin)
    // ═══════════════════════════════════════════════════════════════

    /**
     * Upload ảnh cho Category (ADMIN ONLY)
     * POST /api/Image/category/{categoryId}
     */
    uploadCategoryImage: (categoryId: number, file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return axiosClient.post<ImageModel>(
            `/Image/category/${categoryId}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
    },

    /**
     * Xóa vĩnh viễn ảnh khỏi DB và Storage (ADMIN ONLY)
     * DELETE /api/Image/{imageId}/permanent
     */
    permanentDeleteImage: (imageId: number) =>
        axiosClient.delete<{ message: string }>(`/Image/${imageId}/permanent`),
};

export default imageApi;
