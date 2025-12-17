import React, { useEffect, useState, createContext, useContext } from 'react';
import authApi from '../api/authApi';

const ROLE_CLAIM_KEY = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const EMAIL_CLAIM_KEY = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
const ID_CLAIM_KEY = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'user' | 'admin' | 'seller';
  avatar?: string;
  createdAt: Date;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  userName: string;
  address: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

// Hàm hỗ trợ giải mã JWT (không cần cài thêm thư viện)
function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  // SỬA LỖI MÀN HÌNH TRẮNG: Thêm try-catch khi khởi tạo state từ localStorage
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('user');
      // Kiểm tra kỹ nếu saved tồn tại và không phải là chuỗi "undefined" hoặc "null"
      if (saved && saved !== "undefined" && saved !== "null") {
        return JSON.parse(saved);
      }
      return null;
    } catch (error) {
      console.error("Lỗi đọc dữ liệu user từ localStorage:", error);
      localStorage.removeItem('user'); // Xóa dữ liệu lỗi
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
        const response = await authApi.login(credentials);
        
        const data = response.data;
        const token = data.token || data; // Lấy token từ object hoặc string
        
        if (!token) return false;

        localStorage.setItem('access_token', token);

        const decoded = parseJwt(token);
        
        if (!decoded) return false;

        // === BƯỚC ÁNH XẠ VÀ CHUẨN HÓA DỮ LIỆU ĐÃ SỬA ===
        const role = decoded[ROLE_CLAIM_KEY] || decoded.role;
        const email = decoded[EMAIL_CLAIM_KEY] || decoded.email || credentials.email;
        const fullName = decoded[EMAIL_CLAIM_KEY] || decoded.name || email.split('@')[0];
        
        const userInfo: User = {
            id: decoded[ID_CLAIM_KEY] || decoded.id || 'unknown-id',
            email: email,
            fullName: fullName,
            phone: decoded.phone,
            
            // CHUẨN HÓA: Bắt buộc chuyển Role sang chữ thường (Admin -> admin)
            role: role ? role.toLowerCase() : 'user', 
            
            avatar: decoded.avatar,
            createdAt: new Date()
        };
        // ===================================

        setUser(userInfo);
        
        setIsAuthModalOpen(false);
        return true;
    } catch (error) {
        console.error("Login failed", error);
        return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      await authApi.register(data);
      setIsAuthModalOpen(false);
      return true;
    } catch (error) {
      console.error("Registed failed", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}