import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Truck } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { ProductGrid } from '../components/product/ProductGrid';
import { CategoryFilter } from '../components/product/CategoryFilter';
export function HomePage() {
  const {
    products
  } = useProducts();
  const featuredProducts = products.slice(0, 10);
  return <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Shop Smarter, Live Better
            </h1>
            <p className="text-xl mb-8 text-primary-50">
              Discover amazing deals on quality products. Free shipping on
              orders over $50!
            </p>
            <Link to="/category/electronics" className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                <p className="text-sm text-gray-600">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                <p className="text-sm text-gray-600">
                  100% secure transactions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Best Prices</h3>
                <p className="text-sm text-gray-600">
                  Competitive pricing guaranteed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoryFilter />

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Featured Products
          </h2>
          <p className="text-gray-600">Handpicked deals just for you</p>
        </div>

        <ProductGrid products={featuredProducts} />
      </div>
    </div>;
}