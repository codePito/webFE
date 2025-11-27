import React from 'react';
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}
export function Card({
  children,
  className = '',
  padding = true,
  hover = false
}: CardProps) {
  return <div className={`bg-white rounded-lg shadow-sm ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''} ${padding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>;
}