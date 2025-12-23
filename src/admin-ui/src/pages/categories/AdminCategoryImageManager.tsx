import React, { useEffect, useState, useCallback } from 'react';
import imageApi, { ImageModel, getImageUrl } from '../../../../src/api/imageApi';

interface Props {
    categoryId: number;
    onImageChange?: (image: ImageModel | null) => void;
}

/**
 * Component quản lý ảnh cho Category (ADMIN ONLY)
 * Category chỉ có 1 ảnh duy nhất
 */
const AdminCategoryImageManager: React.FC<Props> = ({ categoryId, onImageChange }) => {
    const [image, setImage] = useState<ImageModel | null>(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Load current image
    const loadImage = useCallback(async () => {
        if (!categoryId || categoryId <= 0) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res = await imageApi.getEntityImages('Category', categoryId);
            const images = res?.data || [];
            const currentImage = images[0] || null;
            setImage(currentImage);
            onImageChange?.(currentImage);
        } catch (err) {
            console.error("Load category image failed", err);
        } finally {
            setLoading(false);
        }
    }, [categoryId, onImageChange]);

    useEffect(() => {
        loadImage();
    }, [loadImage]);

    // Helper: Show messages
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

    // Upload new image
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            showError('Chỉ chấp nhận JPG, PNG, WebP');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showError('File quá lớn (max 5MB)');
            return;
        }

        setUploading(true);
        try {
            const res = await imageApi.uploadCategoryImage(categoryId, file);
            if (res?.data) {
                setImage(res.data);
                onImageChange?.(res.data);
                showSuccess('Upload thành công!');
            }
        } catch (err: any) {
            showError(err?.response?.data?.message || 'Upload thất bại (cần quyền Admin)');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    // Delete image
    const handleDelete = async () => {
        if (!image) return;
        if (!window.confirm('Bạn có chắc muốn xóa ảnh này?')) return;

        try {
            await imageApi.deleteImage(image.id);
            setImage(null);
            onImageChange?.(null);
            showSuccess('Đã xóa ảnh');
        } catch (err: any) {
            showError(err?.response?.data?.message || 'Xóa thất bại');
        }
    };

    // Permanent delete
    const handlePermanentDelete = async () => {
        if (!image) return;
        if (!window.confirm('⚠️ XÓA VĨNH VIỄN! Tiếp tục?')) return;

        try {
            await imageApi.permanentDeleteImage(image.id);
            setImage(null);
            onImageChange?.(null);
            showSuccess('Đã xóa vĩnh viễn');
        } catch (err: any) {
            showError(err?.response?.data?.message || 'Xóa vĩnh viễn thất bại');
        }
    };

    if (loading) {
        return (
            <div className="border p-4 rounded-md bg-white">
                <div className="h-32 bg-gray-100 animate-pulse rounded"></div>
            </div>
        );
    }

    return (
        <div className="border p-4 rounded-md bg-white shadow-sm">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Ảnh danh mục</h4>

            {/* Messages */}
            {error && (
                <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-3 p-2 bg-green-100 text-green-700 rounded text-sm">
                    {success}
                </div>
            )}

            {image ? (
                // Show current image
                <div className="relative group">
                    <img
                        src={getImageUrl(image.url)}
                        alt="Category"
                        className="w-full h-40 object-cover rounded-lg border"
                        onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.svg';
                        }}
                    />

                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-center items-center gap-2">
                        <label className="px-4 py-2 bg-blue-500 text-white text-sm rounded cursor-pointer hover:bg-blue-600">
                            Đổi ảnh
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                className="hidden"
                                disabled={uploading}
                            />
                        </label>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600"
                        >
                            Xóa (soft)
                        </button>
                        <button
                            onClick={handlePermanentDelete}
                            className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                            Xóa vĩnh viễn
                        </button>
                    </div>

                    {/* File info */}
                    <div className="mt-2 text-xs text-gray-500">
                        {image.fileSizeFormatted} {image.dimensions && `• ${image.dimensions}`}
                    </div>
                </div>
            ) : (
                // Upload placeholder
                <label className={`
                    block w-full h-40 border-2 border-dashed rounded-lg cursor-pointer
                    flex flex-col items-center justify-center
                    transition-colors
                    ${uploading ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50 hover:border-blue-400'}
                `}>
                    {uploading ? (
                        <>
                            <svg className="animate-spin h-8 w-8 text-blue-500 mb-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span className="text-sm text-gray-500">Đang upload...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-gray-500">Click để upload ảnh</span>
                            <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP (max 5MB)</span>
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        className="hidden"
                        disabled={uploading}
                    />
                </label>
            )}
        </div>
    );
};

export default AdminCategoryImageManager;
