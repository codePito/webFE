import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/shared/Button';
import paymentApi from '../api/paymentApi';
import cartApi from '../api/cartApi';
import orderApi from '../api/orderApi';
import { useCart } from '../context/CartContext';

export function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const confirmedRef = useRef(false); // Tránh gọi confirm 2 lần (React StrictMode)
  
  // Backend redirect về kèm params
  const orderId = searchParams.get('orderId');
  const resultCode = searchParams.get('resultCode'); // Momo: 0 = Success

  useEffect(() => {
    if (!orderId) {
        setLoading(false);
        return;
    }

    // ✅ FIX: Verify Order status trước khi clear cart
    const confirmAndFetchOrder = async () => {
        // Tránh gọi 2 lần do React StrictMode
        if (confirmedRef.current) return;
        confirmedRef.current = true;

        try {
            // Bước 1: Gọi confirm payment (fallback khi IPN không hoạt động)
            // resultCode = 0 là thành công từ MoMo
            const resultCodeNum = parseInt(resultCode || '-1');
            
            try {
                await paymentApi.confirmPayment(parseInt(orderId), resultCodeNum);
                console.log('Payment confirmed successfully');
            } catch (confirmError) {
                // Không block flow nếu confirm fail (có thể đã được IPN xử lý)
                console.warn('Confirm payment failed (may already be processed):', confirmError);
            }

            // Bước 2: ✅ Verify Order status từ backend
            try {
                const orderRes = await orderApi.getById(orderId);
                const order = orderRes.data;
                
                console.log('Order status:', order.status);
                
                // ✅ Chỉ clear cart nếu Order.Status = Paid (2)
                if (order.status === 2) { // OrderStatus.Paid = 2
                    try {
                        // Gọi API backend để xóa cart trong DB
                        await cartApi.clearCart();
                        console.log('Cart cleared successfully');
                    } catch (clearError) {
                        console.warn('Clear cart failed (may already be cleared):', clearError);
                    }
                    // Xóa cart state local
                    clearCart();
                    setPaymentSuccess(true);
                } else {
                    console.log('Order not paid yet, cart not cleared');
                    setPaymentSuccess(false);
                }
            } catch (orderError) {
                console.error('Failed to fetch order:', orderError);
                // Fallback: Nếu không lấy được order, dùng resultCode
                const isSuccess = resultCodeNum === 0;
                if (isSuccess) {
                    try {
                        await cartApi.clearCart();
                        clearCart();
                        setPaymentSuccess(true);
                    } catch (clearError) {
                        console.warn('Clear cart failed:', clearError);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to process payment result", error);
        } finally {
            setLoading(false);
        }
    };

    confirmAndFetchOrder();
  }, [orderId, resultCode, clearCart]);

  if (loading) return <div className="h-screen flex justify-center items-center"><Loader2 className="animate-spin w-10 h-10 text-primary-500"/></div>;

  const isSuccess = resultCode === '0' || paymentSuccess;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
            {isSuccess ? (
                <CheckCircle className="w-20 h-20 text-green-500" />
            ) : (
                <XCircle className="w-20 h-20 text-red-500" />
            )}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
        </h1>
        
        <p className="text-gray-600 mb-6">
            {isSuccess 
                ? `Cảm ơn bạn đã mua hàng. Mã đơn hàng #${orderId} đã được xác nhận.`
                : 'Giao dịch bị hủy hoặc xảy ra lỗi trong quá trình thanh toán.'}
        </p>

        <div className="flex flex-col gap-3">
            <Button variant="primary" fullWidth onClick={() => navigate('/orders')}>
                Xem lịch sử đơn hàng
            </Button>
            <Button variant="secondary" fullWidth onClick={() => navigate('/')}>
                Về trang chủ
            </Button>
        </div>
      </div>
    </div>
  );
}