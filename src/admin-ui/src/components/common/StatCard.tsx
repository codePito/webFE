import React from 'react';
import { TrendingUp, TrendingDown, BoxIcon } from 'lucide-react';
import { Card } from './Card';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';
interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  icon: BoxIcon;
  iconColor: string;
  format?: 'currency' | 'number' | 'none';
}
export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
  format = 'none'
}: StatCardProps) {
  const formatValue = () => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'number':
        return formatNumber(value);
      default:
        return value.toLocaleString();
    }
  };
  return <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatValue()}
          </p>
          {change !== undefined && <div className="flex items-center mt-2">
              {change >= 0 ? <TrendingUp className="w-4 h-4 text-green-600 mr-1" /> : <TrendingDown className="w-4 h-4 text-red-600 mr-1" />}
              <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(change)}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>}
        </div>
        <div className={`w-12 h-12 rounded-lg ${iconColor} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>;
}