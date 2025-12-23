import React, { useEffect, useState, useCallback } from 'react';
import imageApi, { ImageModel, getImageUrl, getPrimaryImage } from '../../api/imageApi';

interface Props {
    productId: number;
}

const PLACEHOLDER_IMAGE = '/placeholder-image.png';

const ProductGallery: React.FC<Props> = ({ productId }) => {
    const [images, setImages] = useState<ImageModel[]>([]);
    const [selectedImage, setSelectedImage] = useState<string>(PLACEHOLDER_IMAGE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchImages = useCallback(async () => {
        if (!productId || productId <= 0) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const res = await imageApi.getProductImages(productId);
            
            // ✅ Defensive: xử lý nhiều dạng response
            const imageData = res?.data || [];
            
            if (Array.isArray(imageData)) {
                setImages(imageData);
                
                // Chọn ảnh Primary, nếu không có thì lấy ảnh đầu tiên
                const primary = getPrimaryImage(imageData);
                if (primary) {
                    setSelectedImage(getImageUrl(primary.url));
                }
            } else {
                console.warn('Unexpected response format:', res);
                setImages([]);
            }
        } catch (err: any) {
            console.error("Failed to load images:", err);
            
            // ✅ Xử lý các loại lỗi
            if (err?.response?.status === 401) {
                setError('Vui lòng đăng nhập để xem ảnh');
            } else if (err?.response?.status === 404) {
                setError('Không tìm thấy ảnh');
            } else {
                setError('Không thể tải ảnh');
            }
            setImages([]);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    // ✅ Handler khi ảnh load lỗi
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.currentTarget;
        if (target.src !== PLACEHOLDER_IMAGE) {
            target.src = PLACEHOLDER_IMAGE;
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col gap-4">
                <div className="aspect-square w-full bg-gray-100 animate-pulse rounded-lg" />
                <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 w-20 bg-gray-100 animate-pulse rounded-md" />
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="aspect-square w-full bg-gray-100 flex items-center justify-center rounded-lg">
                <p className="text-gray-500 text-center px-4">{error}</p>
            </div>
        );
    }

    // Empty state
    if (images.length === 0) {
        return (
            <div className="aspect-square w-full bg-gray-200 flex items-center justify-center rounded-lg">
                <p className="text-gray-500">Chưa có hình ảnh</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Ảnh lớn (Main Image) */}
            <div className="aspect-square w-full overflow-hidden rounded-lg border bg-white">
                <img
                    src={selectedImage}
                    alt="Product main"
                    className="h-full w-full object-contain"
                    onError={handleImageError}
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img) => {
                        const imgUrl = getImageUrl(img.url);
                        const isSelected = selectedImage === imgUrl;
                        
                        return (
                            <button
                                key={img.id}
                                onClick={() => setSelectedImage(imgUrl)}
                                className={`
                                    h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 
                                    transition-all duration-200
                                    ${isSelected 
                                        ? 'border-blue-500 ring-2 ring-blue-200' 
                                        : 'border-gray-200 hover:border-gray-400'
                                    }
                                `}
                            >
                                <img
                                    src={imgUrl}
                                    alt={img.originalFileName || 'Thumbnail'}
                                    className="h-full w-full object-cover"
                                    onError={handleImageError}
                                />
                                {/* Badge Primary */}
                                {img.isPrimary && (
                                    <span className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-xs text-center py-0.5">
                                        Primary
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProductGallery;
