import React from 'react';
interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}
export function Loader({
  size = 'md',
  fullScreen = false
}: LoaderProps) {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };
  const spinner = <div className={`${sizes[size]} border-primary-500 border-t-transparent rounded-full animate-spin`} />;
  if (fullScreen) {
    return <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        {spinner}
      </div>;
  }
  return <div className="flex justify-center items-center p-8">{spinner}</div>;
}