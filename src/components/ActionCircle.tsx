import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ActionCircleProps {
  onClick: () => void;
  disabled?: boolean;
  size?: 'xl' | 'lg' | 'sm';
  color?: string;
  iconColor?: string;
  label?: string; // 可选的标签文本
}

export const ActionCircle: React.FC<ActionCircleProps> = ({
  onClick,
  disabled = false,
  size = 'lg',
  color = 'rgba(255,255,255,0.2)',
  iconColor = 'currentColor',
  label
}) => {
  const sizePx = size === 'xl' ? 80 : size === 'lg' ? 64 : 48;
  const iconSize = size === 'xl' ? 40 : size === 'lg' ? 32 : 24;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          width: `${sizePx}px`,
          height: `${sizePx}px`,
          borderRadius: '50%',
          backgroundColor: color,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      >
        <ArrowUpRight size={iconSize} color={iconColor} strokeWidth={2.5} />
      </button>
      {label && (
        <span style={{
          fontSize: '1.125rem', // Increased 1.5x from 0.75rem
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: iconColor,
          opacity: disabled ? 0.5 : 1,
          marginTop: '0.25rem' // Added slight gap
        }}>
          {label}
        </span>
      )}
    </div>
  );
};
