import React, { useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { CartItem } from './CartItem';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from '../../utils/constants';
export function CartModal() {
  const {
    items,
    isCartOpen,
    closeCart,
    getCartTotal
  } = useCart();
  const subtotal = getCartTotal();
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);
  if (!isCartOpen) return null;
  return <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity" onClick={closeCart} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Close cart">
            <X className="w-6 h-6" />
          </button>
        </div>

        {items.length === 0 ? <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">Your cart is empty</p>
            <p className="text-sm text-gray-400 mb-6">
              Add some products to get started!
            </p>
            <Button onClick={closeCart}>Continue Shopping</Button>
          </div> : <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map(item => <CartItem key={item.product.id} item={item} />)}
            </div>

            <div className="border-t p-4 space-y-3">
              {subtotal < FREE_SHIPPING_THRESHOLD && <div className="bg-primary-50 border border-primary-200 rounded-lg p-3">
                  <p className="text-sm text-primary-800">
                    Add {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)}{' '}
                    more for free shipping!
                  </p>
                </div>}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary-600">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <Link to="/checkout" onClick={closeCart}>
                <Button variant="primary" size="lg" fullWidth>
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </>}
      </div>
    </>;
}