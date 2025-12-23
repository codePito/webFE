import React, { useEffect, useState, useCallback } from 'react';
import imageApi, { ImageModel, getImageUrl } from '../../../../src/api/imageApi';

interface Props {
    productId: number;
    onImagesChange?: (images: ImageModel[]) => void;
}

const AdminProductImageManager: React.FC<Props> = ({ productId, onImagesChange }) => {
    const [images, setImages] = useState<ImageModel[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // ═══════════════════════════════════════════════════════════════
    // LOAD IMAGES
    // ═══════════════════════════════════════════════════════════════
    const loadImages = useCallback(async () => {
        if (!productId || productId <= 0) return;

        try {
            const res = await imageApi.getProductImages(productId);
            const data = res?.data || [];
            setImages(Array.isArray(data) ? data : []);
            onImagesChange?.(data);
        } catch (err) {
            console.error("Load images failed", err);
            setError("Không thể tải danh sách ảnh");
        }
    }, [productId, onImagesChange]);

    useEffect(() => {
        loadImages();
    }, [loadImages]);

    // Helper: Show message
    const showSuccess = (msg: string) => {
        setSuccess(msg);
        setError(null);
        setTimeout(() => setSuccess(null), 3000);
    };

    const showError = (msg: string) => {
        setError(msg);
        setSuccess(null);
        setTimeout(() => setError(null), 5000);
    };

    // ═══════════════════════════════════════════════════════════════
    // UPLOAD IMAGES
    // ═══════════════════════════════════════════════════════════════
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            if (files.length === 1) {
                // Upload single - auto set primary nếu là ảnh đầu tiên
                await imageApi.uploadProductImage(productId, files[0], images.length === 0);
            } else {
                // Upload multiple
                await imageApi.uploadMultipleProductImages(productId, files);
            }
            showSuccess(`Đã upload ${files.length} ảnh thành công!`);
            await loadImages();
        } catch (err: any) {
            showError(err?.response?.data?.message || "Upload thất bại!");
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SET PRIMARY
    // ═══════════════════════════════════════════════════════════════
    const handleSetPrimary = async (imageId: number) => {
        try {
            await imageApi.setPrimaryImage(imageId, 'Product', productId);
            showSuccess("Đã cập nhật ảnh đại diện");
            await loadImages();
        } catch (err: any) {
            showError(err?.response?.data?.message || "Lỗi cập nhật");
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SOFT DELETE
    // ═══════════════════════════════════════════════════════════════
    const handleSoftDelete = async (imageId: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa ảnh này?")) return;

        try {
            await imageApi.deleteImage(imageId);
            setImages(prev => prev.filter(i => i.id !== imageId));
            showSuccess("Đã xóa ảnh");
        } catch (err: any) {
            showError(err?.response?.data?.message || "Xóa thất bại");
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // PERMANENT DELETE (ADMIN ONLY)
    // ═══════════════════════════════════════════════════════════════
    const handlePermanentDelete = async (imageId: number) => {
        if (!window.confirm("⚠️ XÓA VĨNH VIỄN!\nẢnh sẽ bị xóa khỏi database và storage.\nTiếp tục?")) {
            return;
        }

        try {
            await imageApi.permanentDeleteImage(imageId);
            setImages(prev => prev.filter(i => i.id !== imageId));
            showSuccess("Đã xóa vĩnh viễn");
        } catch (err: any) {
            showError(err?.response?.data?.message || "Xóa vĩnh viễn thất bại (cần quyền Admin)");
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════
    return (
        <div className="border p-4 rounded-md bg-white shadow-sm mt-4">
            <h3 className="text-lg font-medium mb-4">Quản lý hình ảnh</h3>

            {/* Messages */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded text-sm">
                    {success}
                </div>
            )}

            {/* Upload Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thêm ảnh mới
                </label>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />
                {uploading && (
                    <p className="text-blue-500 text-sm mt-1 flex items-center">
                        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Đang tải lên...
                    </p>
                )}
            </div>

            {/* Image Grid */}
            {images.length === 0 ? (
                <p className="text-gray-400 text-center italic py-8 border-2 border-dashed rounded-lg">
                    Chưa có hình ảnh nào. Click "Thêm ảnh mới" để upload.
                </p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((img) => (
                        <ImageCard
                            key={img.id}
                            image={img}
                            onSetPrimary={() => handleSetPrimary(img.id)}
                            onSoftDelete={() => handleSoftDelete(img.id)}
                            onPermanentDelete={() => handlePermanentDelete(img.id)}
                        />
                    ))}
                </div>
            )}

            {/* Image Count */}
            <div className="mt-4 text-sm text-gray-500">
                Tổng: {images.length} ảnh
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════
// IMAGE CARD COMPONENT
// ═══════════════════════════════════════════════════════════════
interface ImageCardProps {
    image: ImageModel;
    onSetPrimary: () => void;
    onSoftDelete: () => void;
    onPermanentDelete: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({
    image,
    onSetPrimary,
    onSoftDelete,
    onPermanentDelete,
}) => {
    const imgUrl = getImageUrl(image.url);

    return (
        <div className={`relative group border rounded-lg overflow-hidden ${image.isPrimary ? 'ring-2 ring-blue-500' : ''}`}>
            {/* Image */}
            <img
                src={imgUrl}
                alt={image.originalFileName}
                className="w-full h-32 object-cover bg-gray-100"
                onError={(e) => {
                    e.currentTarget.src = '/placeholder-image.svg';
                }}
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2 p-2">
                {!image.isPrimary && (
                    <button
                        onClick={onSetPrimary}
                        className="w-full px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        ⭐ Đặt làm chính
                    </button>
                )}
                <button
                    onClick={onSoftDelete}
                    className="w-full px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                >
                    🗑️ Xóa (soft)
                </button>
                <button
                    onClick={onPermanentDelete}
                    className="w-full px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    ❌ Xóa vĩnh viễn
                </button>
            </div>

            {/* Primary Badge */}
            {image.isPrimary && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] px-2 py-0.5 font-medium">
                    Primary
                </div>
            )}

            {/* File Info */}
            <div className="p-1 text-[10px] text-gray-500 truncate" title={image.originalFileName}>
                {image.fileSizeFormatted}
            </div>
        </div>
    );
};

export default AdminProductImageManager;
