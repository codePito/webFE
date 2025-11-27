import React, { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { mockUsers } from '../../services/mockData';
import { User } from '../../types';
import { formatDate } from '../../utils/formatters';
import { USER_ROLES } from '../../utils/constants';
export function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = mockUsers.slice(startIndex, startIndex + itemsPerPage);
  const columns = [{
    key: 'user',
    label: 'User',
    render: (user: User) => <div>
          <p className="font-medium text-gray-900">{user.fullName}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
  }, {
    key: 'phone',
    label: 'Phone',
    render: (user: User) => <span className="text-gray-900">{user.phone}</span>
  }, {
    key: 'role',
    label: 'Role',
    render: (user: User) => <Badge variant={USER_ROLES[user.role].color as any}>
          {USER_ROLES[user.role].label}
        </Badge>
  }, {
    key: 'status',
    label: 'Status',
    render: (user: User) => <Badge variant={user.status === 'active' ? 'green' : 'red'}>
          {user.status === 'active' ? 'Active' : 'Locked'}
        </Badge>
  }, {
    key: 'createdAt',
    label: 'Joined',
    render: (user: User) => <span className="text-sm text-gray-500">
          {formatDate(user.createdAt)}
        </span>
  }];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage user accounts</p>
        </div>
        <Button variant="primary">
          <UserPlus className="w-5 h-5 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search users..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
        </div>
      </Card>

      <Card padding={false}>
        <Table columns={columns} data={paginatedUsers} />
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </Card>
    </div>;
}