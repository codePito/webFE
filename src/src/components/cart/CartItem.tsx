import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
interface CartItemProps {
  item: CartItemType;
}
export function CartItem({
  item
}: CartItemProps) {
  const {
    updateQuantity,
    removeFromCart
  } = useCart();
  const {
    product,
    quantity
  } = item;
  return <div className="flex gap-3 bg-gray-50 rounded-lg p-3">
      <img src={product.images[0]} alt={product.name} className="w-20 h-20 object-cover rounded" />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-orange-600 font-bold mb-2">
          {formatCurrency(product.price)}
        </p>
        <div className="flex items-center gap-2">
          <button onClick={() => updateQuantity(item.id, quantity - 1)} className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors" aria-label="Decrease quantity">
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <button onClick={() => updateQuantity(item.id, quantity + 1)} className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Increase quantity">
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Remove item">
        <Trash2 className="w-5 h-5" />
      </button>
    </div>;
}