import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from '../common/Card';
import { OrderStatusData } from '../../types';
interface OrderStatusChartProps {
  data: OrderStatusData[];
}
export function OrderStatusChart({
  data
}: OrderStatusChartProps) {
  return <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Orders by Status
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" labelLine={false} label={({
          name,
          percent
        }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="count">
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>;
}