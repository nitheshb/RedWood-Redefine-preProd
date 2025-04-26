import React from 'react'
import { PieChart, Pie, Cell } from 'recharts'

interface PaymentDashboardProps {
  progress: number
}

export default function PaymentDashboard({ progress }: PaymentDashboardProps) {
  const roundedProgress = Math.round(progress)

  const createSegments = (total: number, filledPercentage: number) => {
    const segments = []
    const segmentCount = 100
    let filledCount = Math.floor(segmentCount * (filledPercentage / 100))

    if (filledPercentage > 0 && filledCount === 0) {
      filledCount = 1
    }

    for (let i = 0; i < segmentCount; i++) {
      segments.push({
        name: i < filledCount ? 'Paid' : 'Balance',
        value: 100 / segmentCount,
        fill: i < filledCount ? '#c4b5fd' : '#e5e7eb',
      })
    }

    return segments
  }

  const segments = createSegments(100, roundedProgress)

  return (
    <div className="w-24 h-24 relative flex justify-center items-center">
      <PieChart width={96} height={96}>
        {segments.map((segment, index) => (
          <Pie
            key={`segment-${index}`}
            data={[segment]}
            cx={48}
            cy={48}
            startAngle={(index * 360) / segments.length}
            endAngle={((index + 0.8) * 360) / segments.length}
            innerRadius={20}
            outerRadius={40}
            stroke="none"
            paddingAngle={0}
            dataKey="value"
            isAnimationActive={false}
          >
            <Cell fill={segment.fill} />
          </Pie>
        ))}
      </PieChart>
      <div className="absolute inset-0 flex justify-center items-center">
        <span className="text-sm font-semibold">{roundedProgress}%</span>
      </div>
    </div>
  )
}
