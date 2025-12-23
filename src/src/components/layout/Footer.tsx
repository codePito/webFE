import React from 'react';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
export function Footer() {
  return <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold text-white">ShopHub</span>
            </div>
            <p className="text-sm">
              Your one-stop shop for quality products at great prices.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/category/electronics" className="hover:text-white transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/category/fashion" className="hover:text-white transition-colors">
                  Fashion
                </Link>
              </li>
              <li>
                <Link to="/category/home" className="hover:text-white transition-colors">
                  Home & Living
                </Link>
              </li>
              <li>
                <Link to="/category/beauty" className="hover:text-white transition-colors">
                  Beauty
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Shipping Info
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
            <div className="flex gap-3 mb-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4" />
              <span>support@shophub.com</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; 2024 ShopHub. All rights reserved.</p>
        </div>
      </div>
    </footer>;
}