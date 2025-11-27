import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { AddCategoryModal } from '../../components/modals/AddCategoryModal';
import { mockCategories } from '../../services/mockData';
import { Category } from '../../types';
import { formatDate } from '../../utils/formatters';
export function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categories, setCategories] = useState(mockCategories);
  const itemsPerPage = 10;
  // Filter categories based on search
  const filteredCategories = categories.filter(category => category.name.toLowerCase().includes(searchQuery.toLowerCase()) || category.id.toLowerCase().includes(searchQuery.toLowerCase()));
  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);
  const handleAddCategory = (categoryName: string) => {
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: categoryName,
      slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
      icon: '📦',
      productCount: 0,
      status: 'active',
      createdAt: new Date()
    };
    setCategories([newCategory, ...categories]);
    alert('Category added successfully!');
  };
  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
      alert('Category deleted successfully!');
    }
  };
  const columns = [{
    key: 'icon',
    label: 'Category',
    render: (category: Category) => <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-2xl">
            {category.icon}
          </div>
          <div>
            <p className="font-medium text-gray-900">{category.name}</p>
            <p className="text-sm text-gray-500">{category.id}</p>
          </div>
        </div>
  }, {
    key: 'slug',
    label: 'Slug',
    render: (category: Category) => <span className="text-gray-600 font-mono text-sm">{category.slug}</span>
  }, {
    key: 'productCount',
    label: 'Products',
    render: (category: Category) => <span className="font-semibold text-gray-900">
          {category.productCount}
        </span>
  }, {
    key: 'status',
    label: 'Status',
    render: (category: Category) => <Badge variant={category.status === 'active' ? 'green' : 'gray'}>
          {category.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
  }, {
    key: 'createdAt',
    label: 'Created',
    render: (category: Category) => <span className="text-sm text-gray-500">
          {formatDate(category.createdAt)}
        </span>
  }, {
    key: 'actions',
    label: 'Actions',
    render: (category: Category) => <div className="flex items-center gap-2">
          <button onClick={() => alert('Edit functionality coming soon!')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit category">
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button onClick={() => handleDeleteCategory(category.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete category">
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
  }];
  return <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Manage product categories</p>
        </div>
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Categories
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {categories.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📁</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Categories
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {categories.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Products
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {categories.reduce((sum, c) => sum + c.productCount, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search categories..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
        </div>
      </Card>

      {/* Categories Table */}
      <Card padding={false}>
        <Table columns={columns} data={paginatedCategories} />
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </Card>

      {/* Add Category Modal */}
      <AddCategoryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddCategory} />
    </div>;
}