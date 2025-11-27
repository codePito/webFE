import React from 'react';
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}
export function Card({
  children,
  className = '',
  padding = true
}: CardProps) {
  return <div className={`bg-white rounded-lg shadow-card ${padding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>;
}