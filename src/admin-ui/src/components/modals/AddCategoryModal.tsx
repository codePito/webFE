import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (categoryName: string) => void;
}
export function AddCategoryModal({
  isOpen,
  onClose,
  onAdd
}: AddCategoryModalProps) {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!categoryName.trim()) {
      setError('Category name is required');
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    onAdd(categoryName);
    setLoading(false);
    setCategoryName('');
    onClose();
  };
  const handleClose = () => {
    setCategoryName('');
    setError('');
    onClose();
  };
  return <Modal isOpen={isOpen} onClose={handleClose} title="Add New Category" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Category Name" value={categoryName} onChange={e => setCategoryName(e.target.value)} placeholder="Enter category name" error={error} required />

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose} fullWidth>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading} fullWidth>
            Add Category
          </Button>
        </div>
      </form>
    </Modal>;
}