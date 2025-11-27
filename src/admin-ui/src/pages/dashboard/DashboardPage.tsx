import React from 'react';
import { DollarSign, ShoppingCart, Users, Package, ArrowUpRight } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { RevenueChart } from '../../components/charts/RevenueChart';
import { OrderStatusChart } from '../../components/charts/OrderStatusChart';
import { mockDashboardStats, mockRevenueData, mockOrderStatusData, mockOrders, mockProducts } from '../../services/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ORDER_STATUS } from '../../utils/constants';
export function DashboardPage() {
  const recentOrders = mockOrders.slice(0, 5);
  const topProducts = mockProducts.slice(0, 5);
  return <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={mockDashboardStats.totalRevenue} change={mockDashboardStats.revenueGrowth} icon={DollarSign} iconColor="bg-green-500" format="currency" />
        <StatCard title="Total Orders" value={mockDashboardStats.totalOrders} change={mockDashboardStats.ordersGrowth} icon={ShoppingCart} iconColor="bg-blue-500" format="number" />
        <StatCard title="Total Users" value={mockDashboardStats.totalUsers} change={mockDashboardStats.usersGrowth} icon={Users} iconColor="bg-purple-500" format="number" />
        <StatCard title="Total Products" value={mockDashboardStats.totalProducts} change={mockDashboardStats.productsGrowth} icon={Package} iconColor="bg-orange-500" format="number" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={mockRevenueData} />
        <OrderStatusChart data={mockOrderStatusData} />
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View All
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map(order => <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">
                    {order.orderNumber}
                  </p>
                  <p className="text-sm text-gray-500">{order.userName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(order.total)}
                  </p>
                  <Badge variant={ORDER_STATUS[order.status].color as any} size="sm">
                    {ORDER_STATUS[order.status].label}
                  </Badge>
                </div>
              </div>)}
          </div>
        </Card>

        {/* Top Products */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Selling Products
            </h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              View All
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {topProducts.map(product => <div key={product.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {product.soldCount} sold
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(product.price)}
                </p>
              </div>)}
          </div>
        </Card>
      </div>
    </div>;
}