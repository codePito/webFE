import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from '../common/Card';

interface TopCustomersChartProps {
  data: Array<{
    userName: string;
    totalOrders: number;
    totalSpent: number;
  }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#14b8a6'];

export function TopCustomersChart({ data }: TopCustomersChartProps) {
  // Format data cho pie chart
  const chartData = data.map((customer, index) => ({
    name: customer.userName,
    value: customer.totalOrders,
    totalSpent: customer.totalSpent,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Top 10 Khách hàng mua nhiều nhất
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string, props: any) => {
              const spent = props.payload.totalSpent;
              return [
                `${value} đơn hàng - ${spent.toLocaleString('vi-VN')} ₫`,
                'Tổng mua'
              ];
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Bảng chi tiết */}
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-semibold text-gray-700">Chi tiết:</h4>
        {data.map((customer, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {index + 1}. {customer.userName}
            </span>
            <span className="font-medium text-gray-900">
              {customer.totalOrders} đơn - {customer.totalSpent.toLocaleString('vi-VN')} ₫
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
