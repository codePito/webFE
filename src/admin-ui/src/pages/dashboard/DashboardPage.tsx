import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Users, Package, ArrowUpRight } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { TopCustomersChart } from '../../components/charts/TopCustomersChart';
import { ProductSalesMonthlyChart } from '../../components/charts/ProductSalesMonthlyChart';
import analyticsApi from '../../services/analyticsApi';
import { mockDashboardStats, mockOrders, mockProducts } from '../../services/mockData';
import { formatCurrency } from '../../utils/formatters';
import { ORDER_STATUS } from '../../utils/constants';

export function DashboardPage() {
  const currentYear = new Date().getFullYear();

  // State for analytics data
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [productSalesMonthly, setProductSalesMonthly] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for other sections (keep for now)
  const recentOrders = mockOrders.slice(0, 5);
  // const topProducts = mockProducts.slice(0, 5);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch top customers
        const customersResponse = await analyticsApi.getTopCustomers(10);
        setTopCustomers(customersResponse.data);

        // Fetch product sales monthly
        const salesResponse = await analyticsApi.getProductSalesMonthly(currentYear);
        setProductSalesMonthly(salesResponse.data);
      } catch (err: any) {
        console.error('Failed to fetch analytics data:', err);
        setError('Không thể tải dữ liệu thống kê');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [currentYear]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Thống kê và phân tích dữ liệu
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={mockDashboardStats.totalRevenue}
          change={mockDashboardStats.revenueGrowth}
          icon={DollarSign}
          iconColor="bg-green-500"
          format="currency"
        />
        <StatCard
          title="Total Orders"
          value={mockDashboardStats.totalOrders}
          change={mockDashboardStats.ordersGrowth}
          icon={ShoppingCart}
          iconColor="bg-blue-500"
          format="number"
        />
        <StatCard
          title="Total Users"
          value={mockDashboardStats.totalUsers}
          change={mockDashboardStats.usersGrowth}
          icon={Users}
          iconColor="bg-purple-500"
          format="number"
        />
        <StatCard
          title="Total Products"
          value={mockDashboardStats.totalProducts}
          change={mockDashboardStats.productsGrowth}
          icon={Package}
          iconColor="bg-orange-500"
          format="number"
        />
      </div>

      {/* Charts */}
      {loading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu thống kê...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProductSalesMonthlyChart data={productSalesMonthly} year={currentYear} />
          <TopCustomersChart data={topCustomers} />
        </div>
      )}

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View All
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div>
                  {/* <p className="font-medium text-gray-900">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{order.userName}</p> */}
                </div>
                <div className="text-right">
                  {/* <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p> */}
                  {/* <Badge variant={ORDER_STATUS[order.status].color as any} size="sm">
                    {ORDER_STATUS[order.status].label}
                  </Badge> */}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Products */}
        
      </div>
    </div>
  );
}