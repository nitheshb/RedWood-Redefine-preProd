import React from 'react';

interface RadialChartSemiProps {
  progress: number; 
}

const RadialChartSemi: React.FC<RadialChartSemiProps> = ({
  progress = 0,
}) => {
  
  const clampedProgress = Math.min(100, Math.max(0, progress));
  

  const totalSegments = 25;
  const activeSegments = Math.round((clampedProgress / 100) * totalSegments);
  const angleStep = 180 / totalSegments;


  const baseRadius = 50;
  const segmentHeight = 50;
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

          const p1x = centerX + innerRadius * Math.cos(rad);
          const p1y = centerY + innerRadius * Math.sin(rad);

          const p2x = centerX + outerRadius * Math.cos(rad);
          const p2y = centerY + outerRadius * Math.sin(rad);

          const nextAngle = 180 + ((i + 1) * angleStep);
          const nextRad = (nextAngle * Math.PI) / 180;

          const p3x = centerX + outerRadius * Math.cos(nextRad);
          const p3y = centerY + outerRadius * Math.sin(nextRad);

          const p4x = centerX + innerRadius * Math.cos(nextRad);
          const p4y = centerY + innerRadius * Math.sin(nextRad);

          const color = i < activeSegments ? '#e0d4ff' : '#e5e7eb';

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
{/* 
        <text 
          x={centerX} 
          y={centerY + 5} 
          textAnchor="middle" 
          fill="#4b5563"
          className="text-[30px] font-medium text-[#000000]"
        >
          {Math.round(clampedProgress)}%
        </text> */}


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