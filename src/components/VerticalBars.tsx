// 垂直条视觉指示器组件
import React from 'react';

interface VerticalBarsProps {
  value: number;
  max: number;
  color?: string;
  height?: string;
}

export const VerticalBars: React.FC<VerticalBarsProps> = ({
  value,
  max,
  color = '#1F2421',
  height = 'h-8'
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const barCount = 20; // 固定条数
  const activeBars = Math.floor((percentage / 100) * barCount);

  return (
    <div className={`vertical-bars ${height}`} style={{ color }}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className="vertical-bar"
          style={{
            height: i < activeBars ? '100%' : '30%',
            opacity: i < activeBars ? 0.8 : 0.3
          }}
        />
      ))}
    </div>
  );
};

