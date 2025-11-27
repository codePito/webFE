import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { mockOrders } from '../../services/mockData';
import { Order } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ORDER_STATUS, PAYMENT_STATUS } from '../../utils/constants';
export function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = mockOrders.slice(startIndex, startIndex + itemsPerPage);
  const columns = [{
    key: 'orderNumber',
    label: 'Order',
    render: (order: Order) => <div>
          <p className="font-medium text-gray-900">{order.orderNumber}</p>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
  }, {
    key: 'customer',
    label: 'Customer',
    render: (order: Order) => <div>
          <p className="text-gray-900">{order.userName}</p>
          <p className="text-sm text-gray-500">{order.userEmail}</p>
        </div>
  }, {
    key: 'items',
    label: 'Items',
    render: (order: Order) => <span className="text-gray-900">{order.items.length}</span>
  }, {
    key: 'total',
    label: 'Total',
    render: (order: Order) => <span className="font-semibold text-gray-900">
          {formatCurrency(order.total)}
        </span>
  }, {
    key: 'payment',
    label: 'Payment',
    render: (order: Order) => <Badge variant={PAYMENT_STATUS[order.paymentStatus].color as any}>
          {PAYMENT_STATUS[order.paymentStatus].label}
        </Badge>
  }, {
    key: 'status',
    label: 'Status',
    render: (order: Order) => <Badge variant={ORDER_STATUS[order.status].color as any}>
          {ORDER_STATUS[order.status].label}
        </Badge>
  }];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage customer orders</p>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search orders..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
          </div>
          <Button variant="secondary">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </Button>
        </div>
      </Card>

      <Card padding={false}>
        <Table columns={columns} data={paginatedOrders} />
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </Card>
    </div>;
}