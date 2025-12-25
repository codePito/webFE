import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../common/Card';

interface ProductSalesMonthlyChartProps {
  data: Array<{
    month: string;
    totalProducts: number;
    totalOrders: number;
  }>;
  year: number;
}

export function ProductSalesMonthlyChart({ data, year }: ProductSalesMonthlyChartProps) {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Sản phẩm bán ra theo tháng năm {year}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === 'totalProducts') return [`${value} sản phẩm`, 'Đã bán'];
              if (name === 'totalOrders') return [`${value} đơn`, 'Đơn hàng'];
              return value;
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalProducts"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Sản phẩm bán ra"
          />
          <Line
            type="monotone"
            dataKey="totalOrders"
            stroke="#10b981"
            strokeWidth={2}
            name="Số đơn hàng"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
