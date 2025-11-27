import React, { useEffect, useState, createContext, useContext } from 'react';
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
  fullName: string;
  phone?: string;
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
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
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
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!credentials.email || !credentials.password) {
        return false;
      }
      // Mock: Check if admin email
      const isAdminEmail = credentials.email.includes('admin');
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: credentials.email,
        fullName: credentials.email.split('@')[0],
        role: isAdminEmail ? 'admin' : 'user',
        createdAt: new Date()
      };
      setUser(mockUser);
      setIsAuthModalOpen(false);
      return true;
    } catch (error) {
      return false;
    }
  };
  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!data.email || !data.password || !data.fullName) {
        return false;
      }
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        role: 'user',
        createdAt: new Date()
      };
      setUser(mockUser);
      setIsAuthModalOpen(false);
      return true;
    } catch (error) {
      return false;
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  return <AuthContext.Provider value={{
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
    </AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}