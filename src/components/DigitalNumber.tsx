// 数字显示组件（参考图片风格，带 .0 淡色效果）
import React from 'react';

interface DigitalNumberProps {
  value: number | string;
  size?: 'xl' | 'lg' | 'md' | 'sm';
  color?: string;
  showDecimal?: boolean;
}

export const DigitalNumber: React.FC<DigitalNumberProps> = ({
  value,
  size = 'lg',
  color = '#1F2421',
  showDecimal = true
}) => {
  const sizeClasses = {
    xl: 'text-5xl',
    lg: 'text-4xl',
    md: 'text-3xl',
    sm: 'text-2xl'
  };

  const displayValue = typeof value === 'number' ? value.toFixed(1) : value;

  return (
    <span
      className={`digital-number ${sizeClasses[size]}`}
      style={{ color }}
    >
      {displayValue}
      {showDecimal && <span className="decimal">.0</span>}
    </span>
  );
};

