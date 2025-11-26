// Barcode 组件
import React from 'react';
import { COLORS } from '../constants';

interface BarcodeProps {
  className?: string;
  height?: string;
  color?: string;
}

export const Barcode: React.FC<BarcodeProps> = ({ className = "", height = "h-24", color = COLORS.textMain }) => {
  // Generate a random-looking pattern of lines
  const lines = Array.from({ length: 24 }).map(() => ({
    width: Math.random() > 0.6 ? '2px' : '1px',
    opacity: Math.random() > 0.5 ? 1 : 0.4,
    marginRight: Math.random() * 4 + 2 + 'px'
  }));

  return (
    <div className={`flex items-end ${height} ${className} overflow-hidden`}>
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            width: line.width,
            height: '100%',
            backgroundColor: color,
            opacity: line.opacity,
            marginRight: line.marginRight,
          }}
        />
      ))}
    </div>
  );
};

