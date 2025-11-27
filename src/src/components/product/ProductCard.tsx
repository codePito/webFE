import React, { lazy } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { Rating } from '../common/Rating';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../contexts/AuthContext';
interface ProductCardProps {
  product: Product;
}
export function ProductCard({
  product
}: ProductCardProps) {
  const {
    addToCart
  } = useCart();
  const {
    openAuthModal
  } = useAuth();
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const success = addToCart(product);
    // If addToCart returns false, user is not authenticated
    if (!success) {
      openAuthModal();
    }
  };
  return <Link to={`/product/${product.id}`} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        {product.discount && <Badge variant="danger" className="absolute top-2 left-2">
            -{product.discount}%
          </Badge>}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>

        <div className="mb-2">
          <Rating rating={product.rating} reviewCount={product.reviewCount} size="sm" />
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-xl font-bold text-orange-600">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && <span className="text-sm text-gray-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>}
        </div>

        <p className="text-xs text-gray-500 mb-4">
          {formatNumber(product.soldCount)} sold
        </p>

        <Button variant="primary" size="sm" fullWidth onClick={handleAddToCart} className="mt-auto">
          <ShoppingCart className="w-4 h-4 inline mr-2" />
          Add to Cart
        </Button>
      </div>
    </Link>;
}