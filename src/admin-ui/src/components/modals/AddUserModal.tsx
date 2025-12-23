import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Loader2, Eye, EyeOff } from 'lucide-react';

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
interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (userData: UserFormData) => Promise<boolean>;
}

interface UserFormData {
    userName: string;
    email: string;
    password: string;
    address: string;
}

interface FormErrors {
    userName?: string;
    email?: string;
    password?: string;
    address?: string;
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════
export function AddUserModal({ isOpen, onClose, onAdd }: AddUserModalProps) {
    const [formData, setFormData] = useState<UserFormData>({
        userName: '',
        email: '',
        password: '',
        address: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Validate form
    const validateForm = (): boolean => {
        const e: FormErrors = {};

        // Username validation
        if (!formData.userName.trim()) {
            e.userName = 'Username is required';
        } else if (formData.userName.length < 5) {
            e.userName = 'Username must be at least 5 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.userName)) {
            e.userName = 'Username can only contain letters, numbers and underscore';
        }

        // Email validation
        if (!formData.email.trim()) {
            e.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            e.email = 'Invalid email format';
        }

        // Password validation
        if (!formData.password) {
            e.password = 'Password is required';
        } else if (formData.password.length < 8) {
            e.password = 'Password must be at least 8 characters';
        } else if (!/[A-Z]/.test(formData.password)) {
            e.password = 'Password must contain at least one uppercase letter';
        } else if (!/[a-z]/.test(formData.password)) {
            e.password = 'Password must contain at least one lowercase letter';
        } else if (!/[0-9]/.test(formData.password)) {
            e.password = 'Password must contain at least one digit';
        }

        // Address validation
        if (!formData.address.trim()) {
            e.address = 'Address is required';
        } else if (formData.address.length > 200) {
            e.address = 'Address cannot exceed 200 characters';
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const success = await onAdd(formData);
            if (success) {
                handleClose();
            }
        } finally {
            setLoading(false);
        }
    };

    // Close modal
    const handleClose = () => {
        setFormData({
            userName: '',
            email: '',
            password: '',
            address: '',
        });
        setErrors({});
        setShowPassword(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Add New User" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Username"
                    value={formData.userName}
                    onChange={e => setFormData({ ...formData, userName: e.target.value })}
                    placeholder="Enter username (letters, numbers, underscore)"
                    error={errors.userName}
                    required
                />

                <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                    error={errors.email}
                    required
                />

                <div className="relative">
                    <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Min 8 chars, uppercase, lowercase, digit"
                        error={errors.password}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                {/* Password requirements hint */}
                <div className="text-xs text-gray-500 space-y-1">
                    <p className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                        • At least 8 characters
                    </p>
                    <p className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                        • At least one uppercase letter
                    </p>
                    <p className={/[a-z]/.test(formData.password) ? 'text-green-600' : ''}>
                        • At least one lowercase letter
                    </p>
                    <p className={/[0-9]/.test(formData.password) ? 'text-green-600' : ''}>
                        • At least one digit
                    </p>
                </div>

                <Input
                    label="Address"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter address"
                    error={errors.address}
                    required
                />

                <div className="flex gap-3 pt-4 border-t">
                    <Button type="button" variant="secondary" onClick={handleClose} fullWidth>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading} fullWidth>
                        Create User
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default AddUserModal;
