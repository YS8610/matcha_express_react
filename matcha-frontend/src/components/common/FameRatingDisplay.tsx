// src/components/common/FameRatingDisplay.tsx
import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { getFameRatingColor, getFameRatingLabel } from '../../utils/fameRating';

interface FameRatingDisplayProps {
  rating: number;
  showLabel?: boolean;
  showNumber?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FameRatingDisplay: React.FC<FameRatingDisplayProps> = ({
  rating,
  showLabel = false,
  showNumber = true,
  size = 'md',
  className = ''
}) => {
  const starCount = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = starCount - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const starSize = sizeClasses[size];
  const textSize = textSizeClasses[size];

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, index) => (
          <Star
            key={`full-${index}`}
            className={`${starSize} text-yellow-400 fill-current`}
          />
        ))}
        
        {hasHalfStar && (
          <StarHalf className={`${starSize} text-yellow-400 fill-current`} />
        )}
        
        {Array.from({ length: emptyStars }).map((_, index) => (
          <Star
            key={`empty-${index}`}
            className={`${starSize} text-gray-300`}
          />
        ))}
      </div>

      {showNumber && (
        <span className={`${textSize} font-medium ${getFameRatingColor(rating)}`}>
          {rating.toFixed(1)}
        </span>
      )}

      {showLabel && (
        <span className={`${textSize} text-gray-600`}>
          {getFameRatingLabel(rating)}
        </span>
      )}
    </div>
  );
};
