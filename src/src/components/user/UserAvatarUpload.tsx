import React, { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';
import imageApi, { getImageUrl } from '../../api/imageApi';

interface Props {
    userId: number;
    size?: 'sm' | 'md' | 'lg';
    editable?: boolean;
    onAvatarChange?: (url: string) => void;
}

const SIZES = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-32 h-32',
};

const BUTTON_SIZES = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
};

const ICON_SIZES = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
};

const DEFAULT_AVATAR = '/placeholder-image.svg';

const UserAvatarUpload: React.FC<Props> = ({
    userId,
    size = 'md',
    editable = true,
    onAvatarChange,
}) => {
    const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load avatar hiện tại
    useEffect(() => {
        const fetchAvatar = async () => {
            if (!userId || userId <= 0) return;

            try {
                const res = await imageApi.getPrimaryImage('User', userId);
                if (res?.data?.url) {
                    const url = getImageUrl(res.data.url);
                    setAvatar(url);
                    onAvatarChange?.(url);
                }
            } catch {
                // Không có avatar → dùng default
            }
        };

        fetchAvatar();
    }, [userId, onAvatarChange]);

    // Upload avatar
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            setError('Chỉ chấp nhận JPG, PNG, WebP, GIF');
            setTimeout(() => setError(null), 3000);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('File quá lớn (max 5MB)');
            setTimeout(() => setError(null), 3000);
            return;
        }

        try {
            setUploading(true);
            setError(null);

            const res = await imageApi.uploadAvatar(file);

            if (res?.data?.url) {
                const url = getImageUrl(res.data.url);
                setAvatar(url);
                onAvatarChange?.(url);
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Upload thất bại');
            setTimeout(() => setError(null), 3000);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="relative inline-block">
            {/* Avatar Image */}
            <img
                src={avatar}
                alt="Avatar"
                className={`${SIZES[size]} rounded-full object-cover bg-gray-100 border-2 border-white shadow`}
                onError={() => setAvatar(DEFAULT_AVATAR)}
            />

            {/* Upload Button */}
            {editable && (
                <>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        className="hidden"
                        id={`avatar-upload-${userId}`}
                    />
                    <label
                        htmlFor={`avatar-upload-${userId}`}
                        className={`
                            absolute bottom-0 right-0 ${BUTTON_SIZES[size]} rounded-full cursor-pointer
                            transition-all duration-200 shadow
                            ${uploading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                            }
                        `}
                        title="Đổi avatar"
                    >
                        {uploading ? (
                            <div className={`${ICON_SIZES[size]} border-2 border-white border-t-transparent rounded-full animate-spin`}></div>
                        ) : (
                            <Camera className={`${ICON_SIZES[size]} text-white`} />
                        )}
                    </label>
                </>
            )}

            {/* Error Tooltip */}
            {error && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded shadow">
                        {error}
                    </span>
                </div>
            )}
        </div>
    );
};

export default UserAvatarUpload;
