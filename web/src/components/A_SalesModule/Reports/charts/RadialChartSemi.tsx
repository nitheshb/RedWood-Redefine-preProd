import React from 'react';

interface RadialChartSemiProps {
  progress: number;
  totalSegments?: number;
  filledColor?: string;
  emptyColor?: string;
  innerWidth?: number;  
  outerWidth?: number;  
  segmentHeight?: number;
  baseRadius?: number;
}

const RadialChartSemi: React.FC<RadialChartSemiProps> = ({
  progress = 0,
  totalSegments = 30,
  filledColor = '#e0d4ff',
  emptyColor = '#e5e7eb',
  innerWidth = 4,       
  outerWidth = 8,       
  segmentHeight = 50,
  baseRadius = 50,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const activeSegments = Math.round((clampedProgress / 100) * totalSegments);
  const angleStep = 180 / totalSegments;

  const innerRadius = baseRadius;
  const outerRadius = baseRadius + segmentHeight;
  const centerX = 100;
  const centerY = 100;

  return (
    <div className="relative w-[90px] h-[80px] flex items-end justify-center">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 200 100" 
      >
        {Array.from({ length: totalSegments }).map((_, i) => {
          const angle = 180 + (i * angleStep);
          const rad = (angle * Math.PI) / 180;

          // Calculate angle offsets based on widths
          const angleOffsetInner = (innerWidth / 2) / innerRadius;
          const angleOffsetOuter = (outerWidth / 2) / outerRadius;

          const p1x = centerX + innerRadius * Math.cos(rad - angleOffsetInner);
          const p1y = centerY + innerRadius * Math.sin(rad - angleOffsetInner);

          const p2x = centerX + outerRadius * Math.cos(rad - angleOffsetOuter);
          const p2y = centerY + outerRadius * Math.sin(rad - angleOffsetOuter);

          const p3x = centerX + outerRadius * Math.cos(rad + angleOffsetOuter);
          const p3y = centerY + outerRadius * Math.sin(rad + angleOffsetOuter);

          const p4x = centerX + innerRadius * Math.cos(rad + angleOffsetInner);
          const p4y = centerY + innerRadius * Math.sin(rad + angleOffsetInner);

          const color = i < activeSegments ? filledColor : emptyColor;

          return (
            <polygon
              key={i}
              points={`${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y} ${p4x},${p4y}`}
              fill={color}
              stroke="#fff"
              strokeWidth="0.5"
            />
          );
        })}

        <text 
          x={centerX} 
          y={centerY + 5} 
          textAnchor="middle" 
          fill="#000000" 
          fontSize="30" 
          fontWeight="500"
        >
          {Math.round(clampedProgress)}%
        </text>
      </svg>
    </div>
  );
};

export default RadialChartSemi;