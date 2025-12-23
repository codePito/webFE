import React from 'react';
import { ShoppingCart, User, LogOut, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { SearchBar } from '../common/SearchBar';
export function Header() {
  const {
    getCartCount,
    openCart
  } = useCart();
  const {
    user,
    isAuthenticated,
    isAdmin,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const cartCount = getCartCount();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="bg-primary-500 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-center">
            🎉 Free shipping on orders over $50! Limited time offer.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              ShopHub
            </span>
          </Link>

          <SearchBar />

          <div className="flex items-center gap-3 flex-shrink-0">
            {isAuthenticated && user ? <div className="flex items-center gap-3">
                {isAdmin && <Link to="/admin" className="hidden md:flex items-center gap-2 px-3 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors" title="Admin Dashboard">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Admin</span>
                  </Link>}
                <Link 
                  to="/profile" 
                  className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Xem profile"
                >
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user.fullName}
                  </span>
                </Link>
                <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Logout">
                  <LogOut className="w-5 h-5 text-gray-700" />
                </button>
              </div> : <Link to="/login" className="hidden sm:flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium">
                <User className="w-5 h-5" />
                Sign In
              </Link>}

            <button onClick={openCart} className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Shopping cart">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>}
            </button>
          </div>
        </div>
      </div>
    </header>;
}