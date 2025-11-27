import React from 'react';
import { Star } from 'lucide-react';
interface RatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}
export function Rating({
  rating,
  reviewCount,
  size = 'md',
  showNumber = true
}: RatingProps) {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  return <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`${sizes[size]} ${star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />)}
      </div>
      {showNumber && <span className={`${textSizes[size]} text-gray-600 font-medium`}>
          {rating.toFixed(1)}
        </span>}
      {reviewCount !== undefined && <span className={`${textSizes[size]} text-gray-500`}>
          ({reviewCount.toLocaleString()})
        </span>}
    </div>;
}