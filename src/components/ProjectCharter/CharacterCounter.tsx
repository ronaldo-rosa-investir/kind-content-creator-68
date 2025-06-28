
import React from 'react';

interface CharacterCounterProps {
  current: number;
  max: number;
  className?: string;
}

const CharacterCounter: React.FC<CharacterCounterProps> = ({ 
  current, 
  max, 
  className = '' 
}) => {
  const percentage = (current / max) * 100;
  const getColor = () => {
    if (percentage >= 95) return 'text-red-600';
    if (percentage >= 80) return 'text-orange-600';
    return 'text-gray-500';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`text-xs ${getColor()}`}>
        {current}/{max} caracteres
      </span>
      <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-200 ${
            percentage >= 95 ? 'bg-red-500' :
            percentage >= 80 ? 'bg-orange-500' :
            'bg-green-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default CharacterCounter;
