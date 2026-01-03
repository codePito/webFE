import { useState, useEffect, useCallback } from 'react';
import { Search, UserPlus, RefreshCw } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { AddUserModal } from '../../components/modals/AddUserModal';
import authApi from '../../../../src/api/authApi';
import { User } from '../../types';
import { formatDate } from '../../utils/formatters';
import { USER_ROLES } from '../../utils/constants';

export function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const itemsPerPage = 10;

    // Filter users
    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);


    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await authApi.getAllUsers();
            const apiData = response.data;
            const rawList = apiData.result || apiData;
            const userList = Array.isArray(rawList) ? rawList : [];

            const mappedUsers: User[] = userList.map((u: any) => {
                const role = u.role?.toLowerCase() as 'admin' | 'user' | 'seller' || 'user';
                const fullName = u.userName || 'No Name';

                return {
                    id: u.id?.toString() || u.userName,
                    email: u.email || `${fullName.toLowerCase().replace(/\s/g, '')}@shophub.com`,
                    fullName: fullName,
                    phone: u.address || 'N/A',
                    avatar: u.avatar || u.avatarUrl,
                    role: role,
                    status: (u.status || 'active') as 'active' | 'locked',
                    createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
                    lastLogin: u.lastLogin ? new Date(u.lastLogin) : undefined,
                };
            });
            setUsers(mappedUsers);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // ═══════════════════════════════════════════════════════════════
    // ADD USER
    // ═══════════════════════════════════════════════════════════════
    const handleAddUser = async (userData: any): Promise<boolean> => {
        try {
            await authApi.register(userData);
            await fetchUsers();
            alert('User created successfully!');
            return true;
        } catch (error: any) {
            console.error("Failed to create user:", error);
            alert(error?.response?.data?.message || error?.response?.data || 'Failed to create user');
            return false;
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // TABLE COLUMNS
    // ═══════════════════════════════════════════════════════════════
    const columns = [
        {
            key: 'user',
            label: 'User',
            render: (user: User) => (
                <div className="flex items-center gap-3">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => { e.currentTarget.src = '/placeholder-image.svg'; }}
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-600 font-medium">
                                {user.fullName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                    <div>
                        <p className="font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'phone',
            label: 'Address',
            render: (user: User) => (
                <span className="text-gray-900 text-sm">{user.phone}</span>
            ),
        },
        {
            key: 'role',
            label: 'Role',
            render: (user: User) => (
                <Badge variant={USER_ROLES[user.role]?.color as any || 'blue'}>
                    {USER_ROLES[user.role]?.label || user.role}
                </Badge>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (user: User) => (
                <Badge variant={user.status === 'active' ? 'green' : 'red'}>
                    {user.status === 'active' ? 'Active' : 'Locked'}
                </Badge>
            ),
        },
        {
            key: 'createdAt',
            label: 'Joined',
            render: (user: User) => (
                <span className="text-sm text-gray-500">{formatDate(user.createdAt)}</span>
            ),
        },
    ];

    // Stats
    const adminCount = users.filter(u => u.role === 'admin').length;
    const activeCount = users.filter(u => u.status === 'active').length;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                    <p className="text-gray-600 mt-1">Manage user accounts ({users.length} users)</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={fetchUsers}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
                        <UserPlus className="w-5 h-5 mr-2" />
                        Add User
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">👥</span>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Users</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{activeCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">✅</span>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Admins</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{adminCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">👑</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                </div>
            </Card>

            {/* Users Table */}
            <Card padding={false}>
                {isLoading ? (
                    <div className="p-6 text-center text-gray-500">Loading users...</div>
                ) : (
                    <Table columns={columns} data={paginatedUsers} />
                )}
                <div className="px-6 py-4 border-t border-gray-200">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </Card>

            {/* Add User Modal */}
            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddUser}
            />
        </div>
    );
}

export default UsersPage;
