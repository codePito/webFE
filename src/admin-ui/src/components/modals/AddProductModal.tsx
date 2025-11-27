import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Select } from '../common/Select';
import { ImageUpload } from '../common/ImageUpload';
import { Button } from '../common/Button';
import { mockCategories } from '../../services/mockData';
interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: any) => void;
}
interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  images: string[];
}
export function AddProductModal({
  isOpen,
  onClose,
  onAdd
}: AddProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    images: []
  });
  const [errors, setErrors] = useState<Partial<ProductFormData>>({});
  const [loading, setLoading] = useState(false);
  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const selectedCategory = mockCategories.find(cat => cat.id === formData.category);
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      categoryName: selectedCategory?.name || 'Unknown',
      images: formData.images,
      rating: 0,
      reviewCount: 0,
      soldCount: 0,
      stock: 100,
      sku: `SKU-${Date.now()}`,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    onAdd(newProduct);
    setLoading(false);
    handleClose();
  };
  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      images: []
    });
    setErrors({});
    onClose();
  };
  const categoryOptions = mockCategories.filter(cat => cat.status === 'active').map(cat => ({
    value: cat.id,
    label: `${cat.id} - ${cat.name}`
  }));
  return <Modal isOpen={isOpen} onClose={handleClose} title="Add New Product" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <Input label="Product Name" value={formData.name} onChange={e => setFormData({
        ...formData,
        name: e.target.value
      })} placeholder="Enter product name" error={errors.name} required />

        {/* Description */}
        <Textarea label="Description" value={formData.description} onChange={e => setFormData({
        ...formData,
        description: e.target.value
      })} placeholder="Enter product description" rows={4} error={errors.description} required />

        {/* Price */}
        <Input label="Price" type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({
        ...formData,
        price: e.target.value
      })} placeholder="0.00" error={errors.price} required />

        {/* Category */}
        <div>
          <Select label="Category" value={formData.category} onChange={value => setFormData({
          ...formData,
          category: value
        })} options={categoryOptions} placeholder="Select a category" error={errors.category} required />
          <p className="mt-1 text-sm text-gray-500">
            Manage categories in the{' '}
            <a href="/admin/categories" className="text-primary-600 hover:text-primary-700 font-medium">
              Categories page
            </a>
          </p>
        </div>

        {/* Images */}
        <ImageUpload label="Product Images" value={formData.images} onChange={images => setFormData({
        ...formData,
        images
      })} maxImages={5} error={errors.images} />

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button type="button" variant="secondary" onClick={handleClose} fullWidth>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading} fullWidth>
            Add Product
          </Button>
        </div>
      </form>
    </Modal>;
}