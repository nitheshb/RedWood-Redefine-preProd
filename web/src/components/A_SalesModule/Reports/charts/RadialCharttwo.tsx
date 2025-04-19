
import React from 'react';

interface RadialCharttwoProps {
  paid: number;
  total: number;
  balance: number;
  totalSegments?: number;
  filledColor?: string;
  emptyColor?: string;
  innerWidth?: number;
  outerWidth?: number;
  segmentHeight?: number;
  baseRadius?: number;
}

const RadialCharttwo: React.FC<RadialCharttwoProps> = ({
  paid,
  total,
  balance,
  totalSegments = 50,
  filledColor = '#DBD3FD',
  emptyColor = '#E5E7EB',
  innerWidth = 4,
  outerWidth = 8,
  segmentHeight = 40,
  baseRadius = 50,
}) => {

  const progress = total > 0 ? (paid / total) * 100 : 0;
  const clampedPercentage = Math.min(100, Math.max(0, progress));
  const activeSegments = Math.round((clampedPercentage / 100) * totalSegments);
  const angleStep = 360 / totalSegments;

  const innerRadius = baseRadius;
  const outerRadius = baseRadius + segmentHeight;
  const center = 100;

  return (
    <div className="relative w-[120px] h-[120px] flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 200 200">
        {Array.from({ length: totalSegments }).map((_, i) => {
          const angle = i * angleStep;
          const rad = (angle * Math.PI) / 180;

          const angleOffsetInner = (innerWidth / 2) / innerRadius;
          const angleOffsetOuter = (outerWidth / 2) / outerRadius;

          const p1x = center + innerRadius * Math.cos(rad - angleOffsetInner);
          const p1y = center + innerRadius * Math.sin(rad - angleOffsetInner);

          const p2x = center + outerRadius * Math.cos(rad - angleOffsetOuter);
          const p2y = center + outerRadius * Math.sin(rad - angleOffsetOuter);

          const p3x = center + outerRadius * Math.cos(rad + angleOffsetOuter);
          const p3y = center + outerRadius * Math.sin(rad + angleOffsetOuter);

          const p4x = center + innerRadius * Math.cos(rad + angleOffsetInner);
          const p4y = center + innerRadius * Math.sin(rad + angleOffsetInner);

          const color = i < activeSegments ? filledColor : emptyColor;

          return (
            <polygon
              key={i}
              points={`${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y} ${p4x},${p4y}`}
              fill={color}
            />
          );
        })}
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <div className="text-[14px] font-bold text-gray-800">
          {clampedPercentage.toFixed(0)}%
        </div>
      </div>
    </div>
  );
};

export default RadialCharttwo;