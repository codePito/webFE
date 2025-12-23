import React, { useEffect, useState, useCallback, useRef } from 'react';
import imageApi, { ImageModel, getImageUrl } from '../../api/imageApi';

interface Props {
    productId: number;
    onImagesChange?: (images: ImageModel[]) => void;
}

const AdminProductImageManager: React.FC<Props> = ({ productId, onImagesChange }) => {
    const [images, setImages] = useState<ImageModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ═══════════════════════════════════════════════════════════════
    // FETCH IMAGES
    // ═══════════════════════════════════════════════════════════════
    const fetchImages = useCallback(async () => {
        if (!productId || productId <= 0) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res = await imageApi.getProductImages(productId);
            const data = res?.data || [];
            setImages(Array.isArray(data) ? data : []);
            onImagesChange?.(data);
        } catch (err: any) {
            console.error('Failed to fetch images:', err);
            setError(err?.response?.data?.message || 'Không thể tải danh sách ảnh');
        } finally {
            setLoading(false);
        }
    }, [productId, onImagesChange]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    // ═══════════════════════════════════════════════════════════════
    // UPLOAD SINGLE IMAGE
    // ═══════════════════════════════════════════════════════════════
    const handleUploadSingle = async (file: File, isPrimary: boolean = false) => {
        try {
            setUploading(true);
            setError(null);
            
            await imageApi.uploadProductImage(productId, file, isPrimary);
            
            setSuccessMsg('Upload thành công!');
            setTimeout(() => setSuccessMsg(null), 3000);
            
            await fetchImages(); // Refresh list
        } catch (err: any) {
            console.error('Upload failed:', err);
            setError(err?.response?.data?.message || 'Upload thất bại');
        } finally {
            setUploading(false);
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // UPLOAD MULTIPLE IMAGES
    // ═══════════════════════════════════════════════════════════════
    const handleUploadMultiple = async (files: FileList) => {
        if (files.length === 0) return;

        try {
            setUploading(true);
            setError(null);

            const res = await imageApi.uploadMultipleProductImages(productId, files);
            
            setSuccessMsg(`Đã upload ${res?.data?.uploadedCount || files.length} ảnh!`);
            setTimeout(() => setSuccessMsg(null), 3000);
            
            await fetchImages();
        } catch (err: any) {
            console.error('Upload multiple failed:', err);
            setError(err?.response?.data?.message || 'Upload nhiều ảnh thất bại');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SET PRIMARY IMAGE
    // ═══════════════════════════════════════════════════════════════
    const handleSetPrimary = async (imageId: number) => {
        try {
            setError(null);
            await imageApi.setPrimaryImage(imageId, 'Product', productId);
            
            setSuccessMsg('Đã đặt làm ảnh chính!');
            setTimeout(() => setSuccessMsg(null), 3000);
            
            await fetchImages();
        } catch (err: any) {
            console.error('Set primary failed:', err);
            setError(err?.response?.data?.message || 'Không thể đặt ảnh chính');
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // SOFT DELETE IMAGE
    // ═══════════════════════════════════════════════════════════════
    const handleSoftDelete = async (imageId: number) => {
        if (!window.confirm('Bạn có chắc muốn xóa ảnh này?')) return;

        try {
            setError(null);
            await imageApi.deleteImage(imageId);
            
            setSuccessMsg('Đã xóa ảnh!');
            setTimeout(() => setSuccessMsg(null), 3000);
            
            await fetchImages();
        } catch (err: any) {
            console.error('Delete failed:', err);
            setError(err?.response?.data?.message || 'Không thể xóa ảnh');
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // PERMANENT DELETE (ADMIN ONLY)
    // ═══════════════════════════════════════════════════════════════
    const handlePermanentDelete = async (imageId: number) => {
        if (!window.confirm('⚠️ XÓA VĨNH VIỄN! Ảnh sẽ bị xóa khỏi database và storage. Tiếp tục?')) {
            return;
        }

        try {
            setError(null);
            await imageApi.permanentDeleteImage(imageId);
            
            setSuccessMsg('Đã xóa vĩnh viễn!');
            setTimeout(() => setSuccessMsg(null), 3000);
            
            await fetchImages();
        } catch (err: any) {
            console.error('Permanent delete failed:', err);
            setError(err?.response?.data?.message || 'Không thể xóa vĩnh viễn (cần quyền Admin)');
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // FILE INPUT HANDLER
    // ═══════════════════════════════════════════════════════════════
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (files.length === 1) {
            handleUploadSingle(files[0], images.length === 0); // Auto primary nếu là ảnh đầu tiên
        } else {
            handleUploadMultiple(files);
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════
    if (loading) {
        return (
            <div className="p-4 bg-white rounded-lg shadow">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-square bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Quản lý ảnh sản phẩm</h3>

            {/* Messages */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                    {error}
                </div>
            )}
            {successMsg && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded">
                    {successMsg}
                </div>
            )}

            {/* Upload Section */}
            <div className="mb-6">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                />
                <label
                    htmlFor="image-upload"
                    className={`
                        inline-flex items-center px-4 py-2 rounded-lg cursor-pointer
                        transition-colors duration-200
                        ${uploading 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }
                    `}
                >
                    {uploading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Đang upload...
                        </>
                    ) : (
                        '+ Thêm ảnh'
                    )}
                </label>
                <span className="ml-3 text-sm text-gray-500">
                    Chọn 1 hoặc nhiều ảnh (JPG, PNG, WebP)
                </span>
            </div>

            {/* Image Grid */}
            {images.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                    Chưa có ảnh nào. Click "Thêm ảnh" để upload.
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
    const [showMenu, setShowMenu] = useState(false);
    const imgUrl = getImageUrl(image.url);

    return (
        <div className="relative group">
            {/* Image */}
            <div className="aspect-square overflow-hidden rounded-lg border bg-gray-50">
                <img
                    src={imgUrl}
                    alt={image.originalFileName}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.png';
                    }}
                />
            </div>

            {/* Primary Badge */}
            {image.isPrimary && (
                <span className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                    Primary
                </span>
            )}

            {/* Actions Menu */}
            <div className="absolute top-2 right-2">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 bg-white rounded shadow hover:bg-gray-100"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </button>

                {showMenu && (
                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border z-10">
                        {!image.isPrimary && (
                            <button
                                onClick={() => { onSetPrimary(); setShowMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            >
                                ⭐ Đặt làm Primary
                            </button>
                        )}
                        <button
                            onClick={() => { onSoftDelete(); setShowMenu(false); }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-orange-600"
                        >
                            🗑️ Xóa (soft)
                        </button>
                        <button
                            onClick={() => { onPermanentDelete(); setShowMenu(false); }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600"
                        >
                            ❌ Xóa vĩnh viễn
                        </button>
                    </div>
                )}
            </div>

            {/* Image Info */}
            <div className="mt-2 text-xs text-gray-500 truncate" title={image.originalFileName}>
                {image.originalFileName}
            </div>
            <div className="text-xs text-gray-400">
                {image.fileSizeFormatted} {image.dimensions && `• ${image.dimensions}`}
            </div>
        </div>
    );
};

export default AdminProductImageManager;
