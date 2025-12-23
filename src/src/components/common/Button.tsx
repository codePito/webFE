import React from 'react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-800 text-white hover:bg-gray-900 active:bg-black shadow-sm',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100',
    ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  const widthClass = fullWidth ? 'w-full' : '';
  return <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`} {...props}>
      {children}
    </button>;
}