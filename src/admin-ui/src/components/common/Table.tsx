import React from 'react';
interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}
interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
}
export function Table<T extends {
  id: string;
}>({
  columns,
  data,
  onRowClick
}: TableProps<T>) {
  return <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map(column => <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.label}
              </th>)}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map(item => <tr key={item.id} onClick={() => onRowClick?.(item)} className={onRowClick ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}>
              {columns.map(column => <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(item) : (item as any)[column.key]}
                </td>)}
            </tr>)}
        </tbody>
      </table>
      {data.length === 0 && <div className="text-center py-12 text-gray-500">No data available</div>}
    </div>;
}