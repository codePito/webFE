import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Camera, Mail, Phone, Calendar, LogOut, ShoppingBag, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import imageApi, { getImageUrl } from '../api/imageApi';

const DEFAULT_AVATAR = '/placeholder-image.svg';

export function UserProfilePage() {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Redirect nếu chưa đăng nhập
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Load avatar hiện tại
    useEffect(() => {
        const fetchAvatar = async () => {
            if (!user?.id) return;

            try {
                const res = await imageApi.getPrimaryImage('User', Number(user.id));
                if (res?.data?.url) {
                    setAvatar(getImageUrl(res.data.url));
                }
            } catch (err) {
                // Không có avatar → dùng default
                console.log('No avatar found, using default');
            }
        };

        fetchAvatar();
    }, [user?.id]);

    // Upload avatar mới
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            setError('Chỉ chấp nhận file ảnh (JPG, PNG, WebP, GIF)');
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setError('File quá lớn. Tối đa 5MB');
            return;
        }

        try {
            setUploading(true);
            setError(null);

            const res = await imageApi.uploadAvatar(file);

            if (res?.data?.url) {
                setAvatar(getImageUrl(res.data.url));
                setSuccessMsg('Cập nhật avatar thành công!');
                setTimeout(() => setSuccessMsg(null), 3000);
            }
        } catch (err: any) {
            console.error('Upload avatar failed:', err);
            setError(err?.response?.data?.message || 'Upload thất bại. Vui lòng thử lại.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleImageError = () => {
        setAvatar(DEFAULT_AVATAR);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Cover */}
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>

                    {/* Profile Info */}
                    <div className="relative px-6 pb-6">
                        {/* Avatar */}
                        <div className="relative -mt-16 mb-4">
                            <div className="relative inline-block">
                                <img
                                    src={avatar}
                                    alt="Avatar"
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-gray-100"
                                    onError={handleImageError}
                                />

                                {/* Upload Button */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                    id="avatar-upload"
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className={`
                                        absolute bottom-0 right-0 p-2 rounded-full cursor-pointer
                                        transition-all duration-200 shadow-md
                                        ${uploading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-500 hover:bg-blue-600'
                                        }
                                    `}
                                >
                                    {uploading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Camera className="w-5 h-5 text-white" />
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Messages */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        {successMsg && (
                            <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
                                {successMsg}
                            </div>
                        )}

                        {/* User Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {user.fullName}
                                </h1>
                                <p className="text-gray-500 capitalize">
                                    {user.role === 'admin' ? '👑 Administrator' : '👤 Member'}
                                </p>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Contact Info */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2 text-blue-500" />
                            Thông tin liên hệ
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center text-gray-600">
                                <Mail className="w-5 h-5 mr-3 text-gray-400" />
                                <span>{user.email}</span>
                            </div>

                            {user.phone && (
                                <div className="flex items-center text-gray-600">
                                    <Phone className="w-5 h-5 mr-3 text-gray-400" />
                                    <span>{user.phone}</span>
                                </div>
                            )}

                            <div className="flex items-center text-gray-600">
                                <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                                <span>
                                    Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Settings className="w-5 h-5 mr-2 text-blue-500" />
                            Truy cập nhanh
                        </h2>

                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/orders')}
                                className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                <ShoppingBag className="w-5 h-5 mr-3 text-primary-500" />
                                <span className="text-gray-700">Lịch sử đơn hàng</span>
                            </button>

                            {user.role === 'admin' && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="w-full flex items-center p-3 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
                                >
                                    <Settings className="w-5 h-5 mr-3 text-blue-500" />
                                    <span className="text-blue-700">Trang quản trị</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfilePage;
