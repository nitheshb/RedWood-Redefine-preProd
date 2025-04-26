import React from 'react'

interface SemicircleProgressChartProps {
  progress: number
  size?: number
  strokeWidth?: number
  filledColor?: string
  emptyColor?: string
}

const SemicircleProgressChart: React.FC<SemicircleProgressChartProps> = ({
  progress = 0,
  size = 130,
  strokeWidth = 10,
  filledColor = '#DBD3FD',
  emptyColor = '#e5e7eb',
}) => {
  const safeProgress = Math.max(0, Math.min(100, Number(progress) || 0))

  const radius = (size - strokeWidth) / 2
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference - (safeProgress / 100) * circumference

  const halfHeight = size / 2 + strokeWidth / 2

  return (
    <div className="relative" style={{ width: size, height: halfHeight }}>
      <svg className="w-full h-full" viewBox={`0 0 ${size} ${halfHeight}`}>
        <path
          d={`
            M ${strokeWidth / 2}, ${size / 2}
            A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}
          `}
          stroke={emptyColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        <path
          d={`
            M ${strokeWidth / 2}, ${size / 2}
            A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}
          `}
          stroke={filledColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.4s ease-in-out' }}
        />
      </svg>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center">
        <span className="text-sm font-bold">{Math.round(safeProgress)}%</span>
      </div>
    </div>
  )
}

export default SemicircleProgressChart
