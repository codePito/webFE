import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Loader2 } from 'lucide-react';
import AdminCategoryImageManager from '../../pages/categories/AdminCategoryImageManager';

// ═══════════════════════════════════════════════════════════════
// BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    loading?: boolean;
    fullWidth?: boolean;
    children: React.ReactNode;
}

function Button({
    variant = 'primary',
    loading = false,
    fullWidth = false,
    className = '',
    children,
    disabled,
    ...props
}: ButtonProps) {
    const base = 'rounded-lg font-medium transition inline-flex items-center justify-center disabled:opacity-50';
    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} px-4 py-2 ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </button>
    );
}

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════
interface Category {
    id: string;
    name: string;
    slug?: string;
    icon?: string;
}

interface EditCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
    onUpdate: (id: string, data: any) => Promise<boolean>;
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════
export function EditCategoryModal({ isOpen, onClose, category, onUpdate }: EditCategoryModalProps) {
    const [categoryName, setCategoryName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'image'>('info');

    // Load category data when modal opens
    useEffect(() => {
        if (category && isOpen) {
            setCategoryName(category.name || '');
            setActiveTab('info');
        }
    }, [category, isOpen]);

    // Validate
    const validate = () => {
        setError('');
        
        if (!categoryName.trim()) {
            setError('Category name is required');
            return false;
        }
        if (categoryName.trim().length < 2) {
            setError('Category name must be at least 2 characters');
            return false;
        }
        if (categoryName.length > 100) {
            setError('Category name cannot exceed 100 characters');
            return false;
        }
        
        return true;
    };

    // Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || !category) return;

        setLoading(true);
        try {
            const payload = {
                id: Number(category.id),
                name: categoryName.trim(),
            };

            const success = await onUpdate(category.id, payload);
            if (success) {
                handleClose();
            }
        } finally {
            setLoading(false);
        }
    };

    // Close
    const handleClose = () => {
        setCategoryName('');
        setError('');
        setActiveTab('info');
        onClose();
    };

    if (!category) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={`Edit Category: ${category.name}`} size="md">
            {/* Tabs */}
            <div className="flex border-b mb-4">
                <button
                    type="button"
                    onClick={() => setActiveTab('info')}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'info'
                            ? 'text-primary-600 border-b-2 border-primary-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Category Info
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('image')}
                    className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'image'
                            ? 'text-primary-600 border-b-2 border-primary-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Image
                </button>
            </div>

            {activeTab === 'info' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            label="Category Name"
                            value={categoryName}
                            onChange={e => setCategoryName(e.target.value)}
                            placeholder="Enter category name"
                            error={error}
                            required
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            2-100 characters • {categoryName.length}/100
                        </p>
                    </div>

                    <div className="text-sm text-gray-500">
                        <span className="font-medium">Slug:</span>{' '}
                        {categoryName.toLowerCase().replace(/\s+/g, '-') || '-'}
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <Button type="button" variant="secondary" onClick={handleClose} fullWidth>
                            Cancel
                        </Button>
                        <Button type="submit" loading={loading} fullWidth>
                            Save Changes
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="space-y-4">
                    <AdminCategoryImageManager categoryId={Number(category.id)} />
                    <div className="flex justify-end pt-4 border-t">
                        <Button onClick={handleClose}>Done</Button>
                    </div>
                </div>
            )}
        </Modal>
    );
}

export default EditCategoryModal;
