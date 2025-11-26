import React from 'react';

interface NumberTickerProps {
  value: number;
  label: string;
  subLabel?: string;
  size?: 'lg' | 'md' | 'sm';
  color?: string;
}

export const NumberTicker: React.FC<NumberTickerProps> = ({ 
  value, 
  label, 
  subLabel,
  size = 'lg',
  color = 'text-current'
}) => {
  const formattedValue = value.toString().padStart(2, '0');
  
  const textSize = size === 'lg' ? 'text-6xl' : size === 'md' ? 'text-4xl' : 'text-2xl';

  return (
    <div className="flex flex-col">
      <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">{label}</div>
      <div className={`font-bold ${textSize} ${color} leading-none tracking-tighter`}>
        {formattedValue}
        <span className="opacity-30 ml-1 font-normal text-sm align-top">.0</span>
      </div>
       {subLabel && (
        <div className="text-[10px] uppercase mt-2 border-t border-current/20 pt-1 w-max">
          {subLabel}
        </div>
      )}
    </div>
  );
};
// NumberTicker 组件

