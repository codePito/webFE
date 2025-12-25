import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Camera, Mail, Phone, Calendar, LogOut, ShoppingBag, Settings, Edit2, X, Check, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import imageApi, { getImageUrl } from '../api/imageApi';
import userApi from '../api/userApi';

const DEFAULT_AVATAR = '/placeholder-image.svg';

export function UserProfilePage() {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Edit mode state
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        userName: user?.fullName || '',
        phoneNumber: user?.phone || '',
        address: user?.address || ''
    });
    const [editErrors, setEditErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    // Redirect nếu chưa đăng nhập
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Update edit data when user changes
    useEffect(() => {
        if (user) {
            setEditData({
                userName: user.fullName || '',
                phoneNumber: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

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

    // Validate edit form
    const validateEditForm = (): boolean => {
        const errors: Record<string, string> = {};

        // UserName validation
        if (!editData.userName.trim()) {
            errors.userName = 'Họ tên không được để trống';
        } else if (editData.userName.length < 5) {
            errors.userName = 'Họ tên phải có ít nhất 5 ký tự';
        } else if (editData.userName.length > 50) {
            errors.userName = 'Họ tên không được vượt quá 50 ký tự';
        } else if (!/^[\p{L}\p{M}\d\s_]+$/u.test(editData.userName)) {
            errors.userName = 'Họ tên chỉ được chứa chữ cái, số, khoảng trắng và dấu gạch dưới';
        }

        // PhoneNumber validation
        if (!editData.phoneNumber.trim()) {
            errors.phoneNumber = 'Số điện thoại không được để trống';
        } else if (!/^0\d{8,9}$/.test(editData.phoneNumber)) {
            errors.phoneNumber = 'Số điện thoại phải bắt đầu bằng 0 và có 9-10 chữ số';
        }

        // Address validation
        if (!editData.address.trim()) {
            errors.address = 'Địa chỉ không được để trống';
        } else if (editData.address.length < 10) {
            errors.address = 'Địa chỉ phải có ít nhất 10 ký tự';
        } else if (editData.address.length > 200) {
            errors.address = 'Địa chỉ không được vượt quá 200 ký tự';
        }

        setEditErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle edit mode
    const handleEditClick = () => {
        setIsEditing(true);
        setError(null);
        setSuccessMsg(null);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditData({
            userName: user?.fullName || '',
            phoneNumber: user?.phone || '',
            address: user?.address || ''
        });
        setEditErrors({});
    };

    const handleSaveProfile = async () => {
        if (!validateEditForm()) {
            return;
        }

        try {
            setSaving(true);
            setError(null);

            await userApi.updateProfile(Number(user?.id), editData);

            setSuccessMsg('Cập nhật thông tin thành công! Vui lòng đăng nhập lại để thấy thay đổi.');
            setIsEditing(false);
            
            // Đăng xuất sau 2 giây để user đăng nhập lại và lấy token mới
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            console.error('Update profile failed:', err);
            const errorMsg = err?.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.';
            setError(errorMsg);
        } finally {
            setSaving(false);
        }
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
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <User className="w-5 h-5 mr-2 text-blue-500" />
                                Thông tin liên hệ
                            </h2>
                            {!isEditing && (
                                <button
                                    onClick={handleEditClick}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Chỉnh sửa"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {!isEditing ? (
                            // View Mode
                            <div className="space-y-4">
                                <div className="flex items-start text-gray-600">
                                    <User className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Họ tên</div>
                                        <div>{user.fullName}</div>
                                    </div>
                                </div>

                                <div className="flex items-start text-gray-600">
                                    <Mail className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Email</div>
                                        <div>{user.email}</div>
                                    </div>
                                </div>

                                <div className="flex items-start text-gray-600">
                                    <Phone className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Số điện thoại</div>
                                        <div>{user.phone || 'Chưa cập nhật'}</div>
                                    </div>
                                </div>

                                <div className="flex items-start text-gray-600">
                                    <MapPin className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Địa chỉ</div>
                                        <div>{user.address || 'Chưa cập nhật'}</div>
                                    </div>
                                </div>

                                <div className="flex items-start text-gray-600">
                                    <Calendar className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Tham gia</div>
                                        <div>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Edit Mode
                            <div className="space-y-4">
                                {/* UserName */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Họ tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editData.userName}
                                        onChange={(e) => setEditData({ ...editData, userName: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            editErrors.userName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Nhập họ tên"
                                    />
                                    <div className="flex justify-between mt-1">
                                        <span className="text-xs text-gray-500">
                                            {editErrors.userName ? (
                                                <span className="text-red-500">{editErrors.userName}</span>
                                            ) : (
                                                'Từ 5-50 ký tự, chữ cái, số, khoảng trắng'
                                            )}
                                        </span>
                                        <span className={`text-xs ${editData.userName.length > 50 ? 'text-red-500' : 'text-gray-500'}`}>
                                            {editData.userName.length}/50
                                        </span>
                                    </div>
                                </div>

                                {/* Email (readonly) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                    />
                                    <span className="text-xs text-gray-500 mt-1">Email không thể thay đổi</span>
                                </div>

                                {/* PhoneNumber */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số điện thoại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={editData.phoneNumber}
                                        onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            editErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="0123456789"
                                    />
                                    <span className="text-xs text-gray-500 mt-1">
                                        {editErrors.phoneNumber ? (
                                            <span className="text-red-500">{editErrors.phoneNumber}</span>
                                        ) : (
                                            'Bắt đầu bằng 0, có 9-10 chữ số'
                                        )}
                                    </span>
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Địa chỉ <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={editData.address}
                                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            editErrors.address ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Nhập địa chỉ"
                                        rows={3}
                                    />
                                    <div className="flex justify-between mt-1">
                                        <span className="text-xs text-gray-500">
                                            {editErrors.address ? (
                                                <span className="text-red-500">{editErrors.address}</span>
                                            ) : (
                                                'Từ 10-200 ký tự'
                                            )}
                                        </span>
                                        <span className={`text-xs ${editData.address.length > 200 ? 'text-red-500' : 'text-gray-500'}`}>
                                            {editData.address.length}/200
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleCancelEdit}
                                        disabled={saving}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                Đang lưu...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="w-4 h-4 mr-2" />
                                                Lưu thay đổi
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
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
